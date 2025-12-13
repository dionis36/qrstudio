import { useForm, useFieldArray } from 'react-hook-form';
import { useWizardStore } from '../store';
import { useEffect, useState, useRef } from 'react';
import { ChevronDown, Smartphone, Store, Trash2, Palette } from 'lucide-react';
import { ImageUpload } from '@/components/common/ImageUpload';
import { FaGooglePlay, FaApple, FaAmazon } from 'react-icons/fa6';

// Form Value Types
type FormValues = {
    // Design & Customize
    styles: {
        primary_color: string;
        secondary_color?: string;
        gradient_type?: 'none' | 'linear' | 'radial';
        gradient_angle?: number;
    };

    // App Details
    app_name: string;
    developer: string;
    description?: string;
    app_logo?: string;

    // App Store Links
    platforms: {
        platform: 'google_play' | 'ios' | 'amazon';
        url: string;
    }[];
};

// Platform configurations
const PLATFORMS_LIST = [
    { id: 'google_play', name: 'Google Play', icon: FaGooglePlay, color: '#34A853' },
    { id: 'ios', name: 'App Store', icon: FaApple, color: '#007AFF' },
    { id: 'amazon', name: 'Amazon Appstore', icon: FaAmazon, color: '#FF9900' },
];

// Accordion Component
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
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function AppStoreForm() {
    const { payload, updatePayload, editMode } = useWizardStore();

    // Main Sections State
    const [openSections, setOpenSections] = useState({
        design: true,
        app: false,
        platforms: false
    });

    // Track if we've already loaded edit data
    const hasLoadedEditData = useRef(false);

    const { register, watch, setValue, control, formState: { errors }, reset } = useForm<FormValues>({
        defaultValues: {
            styles: {
                primary_color: payload.styles?.primary_color || '#2563EB',
                secondary_color: payload.styles?.secondary_color || '#EFF6FF',
                gradient_type: payload.styles?.gradient_type || 'none',
                gradient_angle: payload.styles?.gradient_angle || 135
            },
            app_name: payload.app_name || '',
            developer: payload.developer || '',
            description: payload.description || '',
            app_logo: payload.app_logo || '',
            platforms: payload.platforms || []
        },
        mode: 'onChange'
    });

    // Field array for platforms
    const { fields: platformFields, append: addPlatform, remove: removePlatform } = useFieldArray({
        control,
        name: 'platforms'
    });

    // Reset form ONCE when entering edit mode with loaded data
    useEffect(() => {
        if (editMode && !hasLoadedEditData.current && payload.app_name) {
            hasLoadedEditData.current = true;
            reset({
                styles: payload.styles || { primary_color: '#2563EB', secondary_color: '#EFF6FF' },
                app_name: payload.app_name,
                developer: payload.developer,
                description: payload.description,
                app_logo: payload.app_logo,
                platforms: payload.platforms || []
            });
        }
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
            {/* Heading Section */}
            <div>
                <h3 className="text-2xl font-bold text-slate-900">Create your app store QR code</h3>
                <p className="text-slate-500 mt-1">Link to your app on Google Play, App Store, or Amazon Appstore.</p>
            </div>

            <div className="space-y-4">
                {/* 1. Design & Customize Section */}
                <AccordionSection
                    title="Design and customize"
                    subtitle="Choose your color scheme"
                    icon={Palette}
                    color="bg-blue-100 text-blue-600"
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
                                    { primary: '#F59E0B', secondary: '#FEF3C7', name: 'Warm Amber' },
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
                                        {...register('styles.primary_color')}
                                        type="color"
                                        className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                                    />
                                    <input
                                        value={watch('styles.primary_color') || '#2563EB'}
                                        onChange={(e) => setValue('styles.primary_color', e.target.value)}
                                        type="text"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase"
                                        placeholder="#2563EB"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Secondary color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        {...register('styles.secondary_color')}
                                        type="color"
                                        className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                                    />
                                    <input
                                        value={watch('styles.secondary_color') || '#EFF6FF'}
                                        onChange={(e) => setValue('styles.secondary_color', e.target.value)}
                                        type="text"
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

                {/* 2. App Details Section */}
                <AccordionSection
                    title="App details"
                    subtitle="Enter your app information"
                    icon={Smartphone}
                    color="bg-indigo-100 text-indigo-600"
                    isOpen={openSections.app}
                    onToggle={() => toggleSection('app')}
                >
                    <div className="space-y-6 mt-4">
                        {/* App Logo Upload */}
                        <ImageUpload
                            label="App Logo"
                            value={watch('app_logo')}
                            onChange={(base64) => setValue('app_logo', base64 || '')}
                            maxSizeMB={1}
                        />

                        {/* App Name */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                App Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('app_name', {
                                    required: 'App name is required',
                                    minLength: { value: 1, message: 'App name is required' },
                                    maxLength: { value: 100, message: 'App name must be 100 characters or less' }
                                })}
                                type="text"
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.app_name ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                placeholder="Cinema App"
                            />
                            {errors.app_name && <span className="text-xs text-red-500 mt-1">{errors.app_name.message}</span>}
                        </div>

                        {/* Developer/Company */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Developer / Company
                            </label>
                            <input
                                {...register('developer')}
                                type="text"
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="United Cinemas"
                            />
                        </div>

                        {/* App Description */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                App Description
                            </label>
                            <textarea
                                {...register('description')}
                                rows={4}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Purchase movie tickets online. Discover the ultimate movie experience at our cinemas."
                            />
                        </div>
                    </div>
                </AccordionSection>

                {/* 3. App Store Details Section */}
                <AccordionSection
                    title="App store details"
                    subtitle="Add links to your app on different platforms"
                    icon={Store}
                    color="bg-purple-100 text-purple-600"
                    isOpen={openSections.platforms}
                    onToggle={() => toggleSection('platforms')}
                >
                    <div className="mt-4 space-y-6">
                        {/* Platform Icon Selector */}
                        <div>
                            <p className="text-sm font-semibold text-slate-700 mb-3">Click to add platform:</p>
                            <div className="flex flex-wrap gap-3">
                                {PLATFORMS_LIST.map(platform => (
                                    <button
                                        key={platform.id}
                                        type="button"
                                        onClick={() => addPlatform({ platform: platform.id as any, url: '' })}
                                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50 transition-all w-20 h-20 shadow-sm group"
                                    >
                                        <platform.icon className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color: platform.color }} />
                                        <span className="capitalize text-[10px] font-medium text-slate-600 mt-2 text-center leading-tight">{platform.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Active Platforms List */}
                        <div className="space-y-3">
                            {platformFields.length > 0 && <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Active Platforms</h4>}
                            {platformFields.map((field, index) => {
                                const platformId = watch(`platforms.${index}.platform`);
                                const platformConfig = PLATFORMS_LIST.find(p => p.id === platformId);
                                const Icon = platformConfig?.icon || FaGooglePlay;
                                const brandColor = platformConfig?.color || '#64748b';

                                return (
                                    <div key={field.id} className="flex gap-3 items-center animate-in slide-in-from-left-2 duration-300">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-sm"
                                            style={{ backgroundColor: brandColor }}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-slate-400 text-sm capitalize font-medium">
                                                    {platformConfig?.name || platformId}:
                                                </span>
                                                <input
                                                    {...register(`platforms.${index}.url` as const, {
                                                        required: 'URL is required',
                                                        pattern: {
                                                            value: /^https?:\/\/.+/,
                                                            message: 'Please enter a valid URL'
                                                        }
                                                    })}
                                                    className="w-full pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow"
                                                    placeholder="e.g. https://apps.apple.com/my-app"
                                                    style={{ paddingLeft: `${(platformConfig?.name?.length || 8) * 9 + 20}px` }}
                                                />
                                            </div>
                                            {errors.platforms?.[index]?.url && (
                                                <span className="text-xs text-red-500 mt-1">{errors.platforms[index]?.url?.message}</span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removePlatform(index)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                );
                            })}
                            {platformFields.length === 0 && (
                                <p className="text-sm text-slate-400 italic text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                    No platforms added yet. Click an icon above to start.
                                </p>
                            )}
                        </div>
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
}
