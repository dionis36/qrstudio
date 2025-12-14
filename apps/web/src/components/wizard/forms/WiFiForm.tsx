import { useForm } from 'react-hook-form';
import { useWizardStore } from '../store';
import { useEffect, useState, useRef } from 'react';
import { ChevronDown, Palette, Wifi, Info, Lock, Eye, EyeOff } from 'lucide-react';
import { ImageUpload } from '@/components/common/ImageUpload';

// Form Value Types
type FormValues = {
    wifi_details: {
        ssid: string;
        password?: string;
        security: 'WPA' | 'WPA2' | 'WPA3' | 'WEP' | 'nopass';
        hidden: boolean;
    };
    network_info?: {
        title?: string;
        description?: string;
        logo?: string;
    };
    styles: {
        primary_color: string;
        secondary_color?: string;
        gradient_type?: 'none' | 'linear' | 'radial';
        gradient_angle?: number;
    };
    welcome_screen?: {
        logo?: string;
        animation?: 'spinner' | 'fade' | 'pulse';
        background_color?: string;
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

            {/* Content */}
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

export function WiFiForm() {
    const { payload, updatePayload, editMode } = useWizardStore();
    const [openSections, setOpenSections] = useState({
        design: true,  // First section auto-opened
        network: false,
        wifi: false
    });

    const [showPassword, setShowPassword] = useState(false);

    // Track if we've already loaded edit data
    const hasLoadedEditData = useRef(false);
    const hasSetRandomColors = useRef(false);

    const { register, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            wifi_details: payload.wifi_details || { ssid: '', password: '', security: '', hidden: false },
            network_info: payload.network_info || { title: '', description: '', logo: '' },
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
        if (editMode && !hasLoadedEditData.current && payload.wifi_details?.password) {
            // Only reset if we have actual data (not just defaults)
            hasLoadedEditData.current = true;
            reset({
                wifi_details: payload.wifi_details || { ssid: '', password: '', security: '', hidden: false },
                network_info: payload.network_info || { title: '', description: '', logo: '' },
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

    const securityType = watch('wifi_details.security');
    const isPasswordRequired = securityType !== 'nopass';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Heading Section - matches create page */}
            <div>
                <h3 className="text-2xl font-bold text-slate-900">Add content to the WiFi QR code</h3>
                <p className="text-slate-500 mt-1">Create a QR code that automatically connects devices to your WiFi network.</p>
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

                {/* Network Information Section - MOVED UP */}
                <AccordionSection
                    title="Network information"
                    subtitle="Optional branding and description"
                    icon={Info}
                    color="bg-emerald-100 text-emerald-600"
                    isOpen={openSections.network}
                    onToggle={() => toggleSection('network')}
                >
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Network Title (Optional)</label>
                            <input
                                {...register('network_info.title')}
                                className="w-full px-3 sm:px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-base min-h-[44px]"
                                placeholder="e.g. Guest WiFi"
                            />
                            <p className="text-xs text-slate-500 mt-1">A friendly name for your network</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Optional)</label>
                            <textarea
                                {...register('network_info.description')}
                                rows={3}
                                className="w-full px-3 sm:px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-base"
                                placeholder="Welcome to our network! Enjoy fast and secure internet access."
                            />
                        </div>

                        {/* Logo Upload */}
                        <ImageUpload
                            label="Network Logo (Optional)"
                            value={watch('network_info.logo')}
                            onChange={(base64) => setValue('network_info.logo', base64 || '')}
                            maxSizeMB={2}
                        />
                    </div>
                </AccordionSection>

                {/* WiFi Network Details Section - MOVED DOWN, SSID REMOVED */}
                <AccordionSection
                    title="WiFi network details"
                    subtitle="Enter your network credentials"
                    icon={Wifi}
                    color="bg-blue-100 text-blue-600"
                    isOpen={openSections.wifi}
                    onToggle={() => toggleSection('wifi')}
                >
                    <div className="space-y-4 mt-4">

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Security Type <span className="text-red-500">*</span></label>
                            <select
                                {...register('wifi_details.security', { required: 'Please select a security type' })}
                                defaultValue=""
                                className={`w-full px-3 sm:px-4 py-3 rounded-lg border ${errors.wifi_details?.security ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none text-base min-h-[44px]`}
                            >
                                <option value="" disabled>Select security type...</option>
                                <option value="WPA2">WPA/WPA2 (Recommended)</option>
                                <option value="WPA3">WPA3 (Most Secure)</option>
                                <option value="WEP">WEP (Legacy)</option>
                                <option value="nopass">Open (No Password)</option>
                            </select>
                            {errors.wifi_details?.security && <span className="text-xs text-red-500 mt-1">{errors.wifi_details.security.message}</span>}
                            <p className="text-xs text-slate-500 mt-1">The encryption type of your network</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Password {isPasswordRequired && <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative">
                                <input
                                    {...register('wifi_details.password', {
                                        required: isPasswordRequired ? 'Password is required for secured networks' : false
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                    disabled={!isPasswordRequired}
                                    className={`w-full px-3 sm:px-4 py-3 pr-12 rounded-lg border ${errors.wifi_details?.password ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none text-base min-h-[44px] ${!isPasswordRequired ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                                    placeholder={isPasswordRequired ? "Enter network password" : "No password required"}
                                />
                                {isPasswordRequired && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                        title={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                )}
                            </div>
                            {errors.wifi_details?.password && <span className="text-xs text-red-500 mt-1">{errors.wifi_details.password.message}</span>}
                            <p className="text-xs text-slate-500 mt-1">Your WiFi network password</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                                <input
                                    type="checkbox"
                                    {...register('wifi_details.hidden')}
                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                                />
                                <div>
                                    <span className="text-sm font-semibold text-slate-700">Hidden Network</span>
                                    <p className="text-xs text-slate-500">Check if your network SSID is not broadcast</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
}
