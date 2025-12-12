import { useForm } from 'react-hook-form';
import { useWizardStore } from '../store';
import { useEffect, useState } from 'react';
import { ChevronDown, Palette, FileText } from 'lucide-react';

// Form Value Types
type FormValues = {
    text_content: {
        message: string;
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


export function TextForm() {
    const { payload, updatePayload, editMode } = useWizardStore();
    const { register, watch, setValue, reset } = useForm<FormValues>({
        defaultValues: {
            text_content: {
                message: '',
            },
            styles: {
                primary_color: '#3B82F6',
                secondary_color: '#DBEAFE',
                gradient_type: 'none',
                gradient_angle: 135,
            },
        },
        mode: 'onChange'
    });

    const [openSections, setOpenSections] = useState({
        design: true,
        content: false,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Sync form with wizard store
    useEffect(() => {
        const subscription = watch((value) => {
            updatePayload(value as any);
        });
        return () => subscription.unsubscribe();
    }, [watch, updatePayload]);

    // Load existing data in edit mode
    useEffect(() => {
        if (editMode && payload) {
            reset(payload as any);
        }
    }, [editMode, payload, reset]);

    return (
        <div className="space-y-4">
            {/* Design & Customize Section */}
            <AccordionSection
                title="Design & customize"
                subtitle="Choose colors and gradients"
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
                                    value={watch('styles.primary_color') || '#3B82F6'}
                                    onChange={(e) => setValue('styles.primary_color', e.target.value)}
                                    className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={watch('styles.primary_color') || '#3B82F6'}
                                    onChange={(e) => setValue('styles.primary_color', e.target.value)}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase"
                                    placeholder="#3B82F6"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Secondary color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={watch('styles.secondary_color') || '#DBEAFE'}
                                    onChange={(e) => setValue('styles.secondary_color', e.target.value)}
                                    className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={watch('styles.secondary_color') || '#DBEAFE'}
                                    onChange={(e) => setValue('styles.secondary_color', e.target.value)}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase"
                                    placeholder="#DBEAFE"
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

            {/* Text Content Section */}
            <AccordionSection
                title="Text content"
                subtitle="Enter your message"
                icon={FileText}
                color="bg-blue-100 text-blue-600"
                isOpen={openSections.content}
                onToggle={() => toggleSection('content')}
            >
                <div className="mt-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Your message</label>
                    <textarea
                        {...register('text_content.message')}
                        rows={8}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        placeholder="Enter your text message here..."
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        This text will be displayed when someone scans your QR code
                    </p>
                </div>
            </AccordionSection>
        </div>
    );
}
