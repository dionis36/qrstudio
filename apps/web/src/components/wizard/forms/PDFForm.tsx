import { useForm } from 'react-hook-form';
import { useWizardStore } from '../store';
import { useEffect, useState, useRef } from 'react';
import { ChevronDown, Palette, FileText, Info, Upload, X } from 'lucide-react';

// Supported file types with size limits (in MB)
const ALLOWED_FILE_TYPES = {
    // Documents
    'application/pdf': { ext: 'PDF', category: 'document', maxSize: 20, color: 'text-red-600' },
    'application/msword': { ext: 'DOC', category: 'document', maxSize: 20, color: 'text-blue-600' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: 'DOCX', category: 'document', maxSize: 20, color: 'text-blue-600' },
    'application/vnd.ms-excel': { ext: 'XLS', category: 'document', maxSize: 20, color: 'text-green-600' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { ext: 'XLSX', category: 'document', maxSize: 20, color: 'text-green-600' },
    'application/vnd.ms-powerpoint': { ext: 'PPT', category: 'document', maxSize: 20, color: 'text-orange-600' },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { ext: 'PPTX', category: 'document', maxSize: 20, color: 'text-orange-600' },

    // Images
    'image/jpeg': { ext: 'JPG', category: 'image', maxSize: 10, color: 'text-purple-600' },
    'image/png': { ext: 'PNG', category: 'image', maxSize: 10, color: 'text-purple-600' },
    'image/svg+xml': { ext: 'SVG', category: 'image', maxSize: 10, color: 'text-purple-600' },
    'image/gif': { ext: 'GIF', category: 'image', maxSize: 10, color: 'text-purple-600' },
    'image/webp': { ext: 'WEBP', category: 'image', maxSize: 10, color: 'text-purple-600' },

    // Archives
    'application/zip': { ext: 'ZIP', category: 'archive', maxSize: 20, color: 'text-yellow-600' },
    'application/x-rar-compressed': { ext: 'RAR', category: 'archive', maxSize: 20, color: 'text-yellow-600' },
    'application/x-7z-compressed': { ext: '7Z', category: 'archive', maxSize: 20, color: 'text-yellow-600' },

    // Text
    'text/plain': { ext: 'TXT', category: 'text', maxSize: 5, color: 'text-slate-600' },
    'text/csv': { ext: 'CSV', category: 'text', maxSize: 5, color: 'text-slate-600' },
    'application/json': { ext: 'JSON', category: 'text', maxSize: 5, color: 'text-slate-600' },
    'application/xml': { ext: 'XML', category: 'text', maxSize: 5, color: 'text-slate-600' },
    'text/xml': { ext: 'XML', category: 'text', maxSize: 5, color: 'text-slate-600' },

    // Media
    'audio/mpeg': { ext: 'MP3', category: 'media', maxSize: 15, color: 'text-pink-600' },
    'video/mp4': { ext: 'MP4', category: 'media', maxSize: 15, color: 'text-indigo-600' },
};

// Form Value Types
type FormValues = {
    pdf_file: {
        file_data: string;
        file_name: string;
        file_size: number;
        file_type: string;      // MIME type
        file_extension: string; // e.g., 'PDF', 'DOCX'
        file_category: string;  // 'document', 'image', 'archive', 'text', 'media'
        fullscreen_mode: boolean;
    };
    document_info: {
        title?: string;
        topic?: string;
        description?: string;
        author?: string;
    };
    styles: {
        primary_color: string;
        secondary_color?: string;
        gradient_type?: 'none' | 'linear' | 'radial';
        gradient_angle?: number;
    };
};

// Accordion Section Component
function AccordionSection({
    title,
    subtitle,
    icon: Icon,
    color,
    isOpen,
    onToggle,
    children
}: {
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-slate-50 transition-colors min-h-[60px]"
            >
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`p-3 sm:p-4 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">{title}</h3>
                        <p className="text-xs sm:text-sm text-slate-500">{subtitle}</p>
                    </div>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-100 overflow-x-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function PDFForm() {
    const { payload, updatePayload, editMode } = useWizardStore();
    const [openSections, setOpenSections] = useState({
        design: true,  // First section auto-opened
        upload: false,
        info: false
    });

    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const hasLoadedEditData = useRef(false);

    const { register, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            pdf_file: payload.pdf_file || { file_data: '', file_name: '', file_size: 0, fullscreen_mode: false },
            document_info: payload.document_info || { title: '', topic: '', description: '', author: '' },
            styles: {
                primary_color: payload.styles?.primary_color || '#2563EB',
                secondary_color: payload.styles?.secondary_color || '#EFF6FF'
            }
        },
        mode: 'onChange'
    });

    // Random color palette on initial load (not in edit mode)
    useEffect(() => {
        if (!editMode && !payload.styles?.primary_color) {
            const palettes = [
                { primary: '#2563EB', secondary: '#EFF6FF' },
                { primary: '#1F2937', secondary: '#F3F4F6' },
                { primary: '#059669', secondary: '#ECFDF5' },
                { primary: '#DC2626', secondary: '#FEF2F2' },
                { primary: '#7C3AED', secondary: '#FAF5FF' },
            ];
            const randomPalette = palettes[Math.floor(Math.random() * palettes.length)];
            setValue('styles.primary_color', randomPalette.primary);
            setValue('styles.secondary_color', randomPalette.secondary);
        }
    }, []);

    // Sync form data with wizard store
    useEffect(() => {
        const subscription = watch((value) => {
            updatePayload(value as any);
        });
        return () => subscription.unsubscribe();
    }, [watch, updatePayload]);

    // Reset form ONCE when entering edit mode with loaded data
    useEffect(() => {
        if (editMode && !hasLoadedEditData.current && payload.pdf_file?.file_data) {
            hasLoadedEditData.current = true;
            reset({
                pdf_file: payload.pdf_file || { file_data: '', file_name: '', file_size: 0, fullscreen_mode: false },
                document_info: payload.document_info || { title: '', topic: '', description: '', author: '' },
                styles: {
                    primary_color: payload.styles?.primary_color || '#2563EB',
                    secondary_color: payload.styles?.secondary_color || '#EFF6FF'
                }
            });
        }
        if (!editMode) {
            hasLoadedEditData.current = false;
        }
    }, [editMode, payload, reset]);

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // File upload handlers
    const handleFileSelect = async (file: File) => {
        if (!file) return;

        // Validate file type
        const fileInfo = ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES];

        if (!fileInfo) {
            alert(`File type "${file.type}" is not supported. Please upload a supported file type.`);
            return;
        }

        // Validate file size
        const maxSizeBytes = fileInfo.maxSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            alert(`File size must be less than ${fileInfo.maxSize}MB for ${fileInfo.ext} files`);
            return;
        }

        // Extract filename without extension for title
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');

        // Convert to base64
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            const base64Data = base64.split(',')[1]; // Remove data:xxx;base64, prefix

            setValue('pdf_file.file_data', base64Data);
            setValue('pdf_file.file_name', file.name);
            setValue('pdf_file.file_size', file.size);
            setValue('pdf_file.file_type', file.type);
            setValue('pdf_file.file_extension', fileInfo.ext);
            setValue('pdf_file.file_category', fileInfo.category);

            // Auto-fill title if it's empty
            if (!watch('document_info.title')) {
                setValue('document_info.title', fileNameWithoutExt);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleRemoveFile = () => {
        setValue('pdf_file.file_data', '');
        setValue('pdf_file.file_name', '');
        setValue('pdf_file.file_size', 0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="w-full">
            {/* Accordion Sections */}
            <div className="space-y-4">
                {/* Design and Customize Section */}
                <AccordionSection
                    title="Design and customize"
                    subtitle="Choose your color scheme"
                    icon={Palette}
                    color="bg-purple-100 text-purple-600"
                    isOpen={openSections.design}
                    onToggle={() => toggleSection('design')}
                >
                    <div className="space-y-6 mt-4 min-w-0">
                        {/* Color Palette Presets */}
                        <div className='w-full max-w-full overflow-hidden min-w-0'>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Color Presets</label>
                            <div className="flex gap-2 overflow-x-auto pb-2 max-w-full" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
                                {[
                                    { primary: '#2563EB', secondary: '#EFF6FF', name: 'Classic Blue' },
                                    { primary: '#1F2937', secondary: '#F3F4F6', name: 'Elegant Black' },
                                    { primary: '#059669', secondary: '#ECFDF5', name: 'Fresh Green' },
                                    { primary: '#DC2626', secondary: '#FEF2F2', name: 'Bold Red' },
                                    { primary: '#7C3AED', secondary: '#FAF5FF', name: 'Royal Purple' },
                                    { primary: '#EA580C', secondary: '#FFF7ED', name: 'Warm Orange' },
                                    { primary: '#0891B2', secondary: '#F0FDFA', name: 'Ocean Teal' },
                                    { primary: '#BE123C', secondary: '#FFF1F2', name: 'Wine Red' },
                                    { primary: '#EC4899', secondary: '#FCE7F3', name: 'Hot Pink' },
                                ].map((palette, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            setValue('styles.primary_color', palette.primary);
                                            setValue('styles.secondary_color', palette.secondary);
                                        }}
                                        className="h-10 w-16 flex-shrink-0 rounded-lg border-2 border-slate-200 hover:border-blue-400 transition-all hover:scale-105 shadow-sm overflow-hidden"
                                        style={{ background: `linear-gradient(to right, ${palette.primary} 50%, ${palette.secondary} 50%)` }}
                                        title={palette.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Custom Colors */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Primary color</label>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <input
                                        type="color"
                                        value={watch('styles.primary_color') || '#2563EB'}
                                        onChange={(e) => setValue('styles.primary_color', e.target.value)}
                                        className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer flex-shrink-0"
                                    />
                                    <input
                                        type="text"
                                        value={watch('styles.primary_color') || '#2563EB'}
                                        onChange={(e) => setValue('styles.primary_color', e.target.value)}
                                        className="flex-1 px-3 sm:px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase min-h-[44px]"
                                        placeholder="#2563EB"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Secondary color</label>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <input
                                        type="color"
                                        value={watch('styles.secondary_color') || '#EFF6FF'}
                                        onChange={(e) => setValue('styles.secondary_color', e.target.value)}
                                        className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer flex-shrink-0"
                                    />
                                    <input
                                        type="text"
                                        value={watch('styles.secondary_color') || '#EFF6FF'}
                                        onChange={(e) => setValue('styles.secondary_color', e.target.value)}
                                        className="flex-1 px-3 sm:px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase min-h-[44px]"
                                        placeholder="#EFF6FF"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Gradient Controls */}
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Background Style</label>
                                <select
                                    {...register('styles.gradient_type')}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="none">Solid Color</option>
                                    <option value="linear">Linear Gradient</option>
                                    <option value="radial">Radial Gradient</option>
                                </select>
                            </div>

                            {watch('styles.gradient_type') === 'linear' && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Gradient Angle: {watch('styles.gradient_angle') || 135}°
                                    </label>
                                    <input
                                        {...register('styles.gradient_angle')}
                                        type="range"
                                        min="0"
                                        max="360"
                                        step="45"
                                        defaultValue="135"
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                                        <span>0°</span>
                                        <span>90°</span>
                                        <span>180°</span>
                                        <span>270°</span>
                                        <span>360°</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </AccordionSection>

                {/* File Upload Section */}
                <AccordionSection
                    title="File upload"
                    subtitle="Upload your file"
                    icon={Upload}
                    color="bg-blue-100 text-blue-600"
                    isOpen={openSections.upload}
                    onToggle={() => toggleSection('upload')}
                >
                    <div className="space-y-4 mt-4">
                        {/* Upload Area */}
                        {!watch('pdf_file.file_data') ? (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all min-h-[200px] sm:min-h-[240px] flex flex-col items-center justify-center ${isDragging
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                                    }`}
                            >
                                <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-3 sm:mb-4" />
                                <p className="text-sm sm:text-base font-semibold text-slate-700 mb-1">
                                    Drag and drop your file here
                                </p>
                                <p className="text-xs sm:text-sm text-slate-500 mb-4">or</p>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-5 sm:px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base min-h-[44px] shadow-sm"
                                >
                                    Browse Files
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.svg,.gif,.webp,.zip,.rar,.7z,.txt,.csv,.json,.xml,.mp3,.mp4"
                                    onChange={handleFileInputChange}
                                    className="hidden"
                                />
                                <p className="text-xs text-slate-500 mt-3 sm:mt-4 px-4">Supported: Documents, Images, Archives, Text files, Media (max 20MB)</p>
                            </div>
                        ) : (
                            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <FileText className="w-8 h-8 text-red-600 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{watch('pdf_file.file_name')}</p>
                                            <p className="text-xs text-slate-500">{formatFileSize(watch('pdf_file.file_size'))}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                        title="Remove file"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {errors.pdf_file?.file_data && (
                            <p className="text-xs text-red-500">{errors.pdf_file.file_data.message}</p>
                        )}


                    </div>
                </AccordionSection>

                {/* Document Information Section */}
                <AccordionSection
                    title="Document information"
                    subtitle="Optional metadata about your file"
                    icon={Info}
                    color="bg-emerald-100 text-emerald-600"
                    isOpen={openSections.info}
                    onToggle={() => toggleSection('info')}
                >
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Title (Optional)</label>
                            <input
                                {...register('document_info.title')}
                                className="w-full px-3 sm:px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-base min-h-[44px]"
                                placeholder="e.g. Annual Report 2024"
                            />
                            <p className="text-xs text-slate-500 mt-1">Display name for your file</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Topic/Category (Optional)</label>
                            <input
                                {...register('document_info.topic')}
                                className="w-full px-3 sm:px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-base min-h-[44px]"
                                placeholder="e.g. Marketing, Technical Documentation"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Optional)</label>
                            <textarea
                                {...register('document_info.description')}
                                rows={3}
                                className="w-full px-3 sm:px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-base"
                                placeholder="Brief description of the document..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Author (Optional)</label>
                            <input
                                {...register('document_info.author')}
                                className="w-full px-3 sm:px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-base min-h-[44px]"
                                placeholder="Document author name"
                            />
                        </div>
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
}
