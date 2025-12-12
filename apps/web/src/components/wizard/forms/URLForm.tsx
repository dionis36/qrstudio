import { useForm } from 'react-hook-form';
import { useWizardStore } from '../store';
import { useEffect, useState, useRef } from 'react';
import { ChevronDown, Palette, Link, Settings, Image } from 'lucide-react';
import { ImageUpload } from '@/components/common/ImageUpload';

// Form Value Types
type FormValues = {
    url_details: {
        destination_url: string;
        title?: string;
        description?: string;
        logo?: string;
    };
    redirect_settings: {
        delay: number;
        show_preview: boolean;
        custom_message?: string;
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
            {/* Header */}
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-base font-bold text-slate-900">{title}</h3>
                        <p className="text-sm text-slate-500">{subtitle}</p>
                    </div>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 overflow-x-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function URLForm() {
    const { payload, updatePayload, editMode } = useWizardStore();
    const [openSections, setOpenSections] = useState({
        design: true,  // First section auto-opened
        url: false,
        redirect: false
    });

    // Track if we've already loaded edit data
    const hasLoadedEditData = useRef(false);
    const hasSetRandomColors = useRef(false);

    const { register, watch, setValue, reset } = useForm<FormValues>({
        defaultValues: {
            url_details: payload.url_details || { destination_url: '', title: '', description: '', logo: '' },
            redirect_settings: payload.redirect_settings || { delay: 2, show_preview: true, custom_message: '' },
            styles: {
                primary_color: payload.styles?.primary_color || '#2563EB',
                secondary_color: payload.styles?.secondary_color || '#EFF6FF'
            }
        },
        mode: 'onChange'
    });

    // Set random color pair on page load for new QR codes
    useEffect(() => {
        if (!editMode && !hasSetRandomColors.current) {
            const colorPalettes = [
                { primary: '#2563EB', secondary: '#EFF6FF' },
                { primary: '#1F2937', secondary: '#F3F4F6' },
                { primary: '#059669', secondary: '#ECFDF5' },
                { primary: '#DC2626', secondary: '#FEF2F2' },
                { primary: '#7C3AED', secondary: '#FAF5FF' },
                { primary: '#EA580C', secondary: '#FFF7ED' },
                { primary: '#0891B2', secondary: '#F0FDFA' },
                { primary: '#BE123C', secondary: '#FFF1F2' },
                { primary: '#EC4899', secondary: '#FCE7F3' },
            ];
            const randomPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
            setValue('styles.primary_color', randomPalette.primary);
            setValue('styles.secondary_color', randomPalette.secondary);
            hasSetRandomColors.current = true;
        }
    }, [editMode, setValue]);

    // Reset form ONCE when entering edit mode with loaded data
    useEffect(() => {
        if (editMode && !hasLoadedEditData.current && payload.url_details?.destination_url) {
            // Only reset if we have actual data (not just defaults)
            hasLoadedEditData.current = true;
            reset({
                url_details: payload.url_details || { destination_url: '', title: '', description: '', logo: '' },
                redirect_settings: payload.redirect_settings || { delay: 2, show_preview: true, custom_message: '' },
                styles: {
                    primary_color: payload.styles?.primary_color || '#2563EB',
                    secondary_color: payload.styles?.secondary_color || '#EFF6FF'
                }
            });
        }
        // Reset the flag when leaving edit mode
        if (!editMode) {
            hasLoadedEditData.current = false;
        }
    }, [editMode, payload, reset]);

    // Watch for changes and update global store
    useEffect(() => {
        const subscription = watch((value) => {
            updatePayload(value as any);
        });
        return () => subscription.unsubscribe();
    }, [watch, updatePayload]);

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Heading Section - matches create page */}
            <div>
                <h3 className="text-2xl font-bold text-slate-900">Add content to the URL QR code</h3>
                <p className="text-slate-500 mt-1">Customize your URL redirect with colors, branding, and settings.</p>
            </div>

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
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Primary color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={watch('styles.primary_color') || '#2563EB'}
                                        onChange={(e) => setValue('styles.primary_color', e.target.value)}
                                        className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={watch('styles.primary_color') || '#2563EB'}
                                        onChange={(e) => setValue('styles.primary_color', e.target.value)}
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase"
                                        placeholder="#2563EB"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Secondary color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={watch('styles.secondary_color') || '#EFF6FF'}
                                        onChange={(e) => setValue('styles.secondary_color', e.target.value)}
                                        className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={watch('styles.secondary_color') || '#EFF6FF'}
                                        onChange={(e) => setValue('styles.secondary_color', e.target.value)}
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase"
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

                {/* URL Details Section */}
                <AccordionSection
                    title="URL details"
                    subtitle="Provide destination URL and branding"
                    icon={Link}
                    color="bg-blue-100 text-blue-600"
                    isOpen={openSections.url}
                    onToggle={() => toggleSection('url')}
                >
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Destination URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('url_details.destination_url', { required: true })}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://example.com"
                                type="url"
                            />
                            <p className="text-xs text-slate-500 mt-1">The URL where users will be redirected after scanning</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Title (Optional)</label>
                            <input
                                {...register('url_details.title')}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Visit Our Website"
                            />
                            <p className="text-xs text-slate-500 mt-1">Displayed on the landing page before redirect</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Optional)</label>
                            <textarea
                                {...register('url_details.description')}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Short description about where this link leads..."
                            />
                        </div>

                        {/* Logo Upload */}
                        <ImageUpload
                            label="Logo (Optional)"
                            value={watch('url_details.logo')}
                            onChange={(base64) => setValue('url_details.logo', base64 || '')}
                            maxSizeMB={2}
                        />
                    </div>
                </AccordionSection>

                {/* Redirect Settings Section */}
                <AccordionSection
                    title="Redirect settings"
                    subtitle="Configure redirect behavior"
                    icon={Settings}
                    color="bg-orange-100 text-orange-600"
                    isOpen={openSections.redirect}
                    onToggle={() => toggleSection('redirect')}
                >
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Redirect Delay</label>
                            <select
                                {...register('redirect_settings.delay', { valueAsNumber: true })}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value={0}>Instant (0 seconds)</option>
                                <option value={1}>1 second</option>
                                <option value={2}>2 seconds</option>
                                <option value={3}>3 seconds</option>
                                <option value={5}>5 seconds</option>
                            </select>
                            <p className="text-xs text-slate-500 mt-1">How long to show the landing page before redirecting</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('redirect_settings.show_preview')}
                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                                <div>
                                    <span className="text-sm font-semibold text-slate-700">Show preview page</span>
                                    <p className="text-xs text-slate-500">Display branding and info before redirect</p>
                                </div>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Custom Message (Optional)</label>
                            <input
                                {...register('redirect_settings.custom_message')}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Taking you to our store..."
                            />
                            <p className="text-xs text-slate-500 mt-1">Custom message shown during redirect</p>
                        </div>
                    </div>
                </AccordionSection>


            </div>
        </div>
    );
}
