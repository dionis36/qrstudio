import { useForm } from 'react-hook-form';
import { useWizardStore } from '../store';
import { useEffect, useState, useRef } from 'react';
import { ChevronDown, Palette, MessageSquare, Mail, Smartphone, Send } from 'lucide-react';

// Form Value Types
type FormValues = {
    // Design & Customize
    styles: {
        primary_color: string;
        secondary_color?: string;
        gradient_type?: 'none' | 'linear' | 'radial';
        gradient_angle?: number;
    };

    // Platform Selection
    platform: 'sms' | 'whatsapp' | 'telegram';

    // Message Details (dynamic based on platform)
    phone_number?: string;
    username?: string;        // Telegram only
    message?: string;
    message_only?: boolean;   // WhatsApp only
};

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

export function MessageForm() {
    const { payload, updatePayload, editMode } = useWizardStore();

    // Main Sections State
    const [openSections, setOpenSections] = useState({
        design: true,
        message: false
    });

    // Track if we've already loaded edit data
    const hasLoadedEditData = useRef(false);

    const { register, watch, setValue, formState: { errors }, reset } = useForm<FormValues>({
        defaultValues: {
            styles: {
                primary_color: payload.styles?.primary_color || '#10B981',
                secondary_color: payload.styles?.secondary_color || '#D1FAE5',
                gradient_type: payload.styles?.gradient_type || 'none',
                gradient_angle: payload.styles?.gradient_angle || 135
            },
            platform: payload.platform || 'sms',
            phone_number: payload.phone_number || '',
            username: payload.username || '',
            message: payload.message || '',
            message_only: payload.message_only || false
        },
        mode: 'onChange'
    });

    // Reset form ONCE when entering edit mode with loaded data
    useEffect(() => {
        if (editMode && !hasLoadedEditData.current && payload.platform) {
            hasLoadedEditData.current = true;
            reset({
                styles: payload.styles || { primary_color: '#10B981', secondary_color: '#D1FAE5' },
                platform: payload.platform,
                phone_number: payload.phone_number,
                username: payload.username,
                message: payload.message,
                message_only: payload.message_only
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

    // Watch current platform and message length
    const currentPlatform = watch('platform');
    const messageLength = watch('message')?.length || 0;
    const messageOnly = watch('message_only');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Heading Section */}
            <div>
                <h3 className="text-2xl font-bold text-slate-900">Create your message QR code</h3>
                <p className="text-slate-500 mt-1">Generate a QR code for SMS, WhatsApp, or Telegram.</p>
            </div>

            <div className="space-y-4">
                {/* 1. Design and Customize Section */}
                <AccordionSection
                    title="Design and customize"
                    subtitle="Choose your color scheme"
                    icon={Palette}
                    color="bg-green-100 text-green-600"
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
                                        value={watch('styles.primary_color') || '#10B981'}
                                        onChange={(e) => setValue('styles.primary_color', e.target.value)}
                                        type="text"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase"
                                        placeholder="#10B981"
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
                                        value={watch('styles.secondary_color') || '#D1FAE5'}
                                        onChange={(e) => setValue('styles.secondary_color', e.target.value)}
                                        type="text"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase"
                                        placeholder="#D1FAE5"
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
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
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

                {/* 2. Message Details Section (Combined) */}
                <AccordionSection
                    title="Message details"
                    subtitle="Select platform and configure message"
                    icon={MessageSquare}
                    color="bg-blue-100 text-blue-600"
                    isOpen={openSections.message}
                    onToggle={() => toggleSection('message')}
                >
                    <div className="space-y-6 mt-4">
                        {/* Platform Selection - Horizontal */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Platform</label>
                            <div className="flex gap-3">
                                {/* SMS Option */}
                                <label className="flex-1 flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 transition-all has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
                                    <input
                                        {...register('platform')}
                                        type="radio"
                                        value="sms"
                                        className="w-5 h-5 text-green-600 focus:ring-green-500"
                                    />
                                    <div className="flex items-center gap-2 flex-1">
                                        <MessageSquare className="w-5 h-5 text-slate-600" />
                                        <div className="font-semibold text-slate-900">SMS</div>
                                    </div>
                                </label>

                                {/* WhatsApp Option */}
                                <label className="flex-1 flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 transition-all has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
                                    <input
                                        {...register('platform')}
                                        type="radio"
                                        value="whatsapp"
                                        className="w-5 h-5 text-green-600 focus:ring-green-500"
                                    />
                                    <div className="flex items-center gap-2 flex-1">
                                        <Smartphone className="w-5 h-5 text-slate-600" />
                                        <div className="font-semibold text-slate-900">WhatsApp</div>
                                    </div>
                                </label>

                                {/* Telegram Option */}
                                <label className="flex-1 flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 transition-all has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
                                    <input
                                        {...register('platform')}
                                        type="radio"
                                        value="telegram"
                                        className="w-5 h-5 text-green-600 focus:ring-green-500"
                                    />
                                    <div className="flex items-center gap-2 flex-1">
                                        <Send className="w-5 h-5 text-slate-600" />
                                        <div className="font-semibold text-slate-900">Telegram</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Dynamic Fields Based on Platform */}
                        <div className="pt-4 border-t border-slate-200">
                            {/* SMS Fields */}
                            {currentPlatform === 'sms' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            {...register('phone_number', {
                                                pattern: {
                                                    value: /^\+?[1-9]\d{1,14}$/,
                                                    message: 'Invalid phone number (use international format: +1234567890)'
                                                },
                                                validate: (value) => {
                                                    const msg = watch('message');
                                                    if (!value && !msg) return 'Phone number or message required';
                                                    return true;
                                                }
                                            })}
                                            type="tel"
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone_number ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                            placeholder="+1234567890"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Include country code (e.g., +1 for US)</p>
                                        {errors.phone_number && <span className="text-xs text-red-500 mt-1">{errors.phone_number.message}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Message
                                            <span className="text-xs text-slate-500 ml-2">({messageLength}/160)</span>
                                        </label>
                                        <textarea
                                            {...register('message', {
                                                maxLength: {
                                                    value: 160,
                                                    message: 'SMS message must be 160 characters or less'
                                                }
                                            })}
                                            rows={4}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.message ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none resize-none`}
                                            placeholder="Enter your message..."
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Keep under 160 characters for single SMS</p>
                                        {errors.message && <span className="text-xs text-red-500 mt-1">{errors.message.message}</span>}
                                    </div>
                                </div>
                            )}

                            {/* WhatsApp Fields */}
                            {currentPlatform === 'whatsapp' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="flex items-center gap-2 mb-3">
                                            <input
                                                {...register('message_only')}
                                                type="checkbox"
                                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                            />
                                            <span className="text-sm font-semibold text-slate-700">Message only (user selects contact)</span>
                                        </label>
                                    </div>

                                    {!messageOnly && (
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                {...register('phone_number', {
                                                    required: !messageOnly && 'Phone number required for WhatsApp',
                                                    pattern: {
                                                        value: /^[1-9]\d{1,14}$/,
                                                        message: 'Invalid phone number (no + or spaces, e.g., 1234567890)'
                                                    }
                                                })}
                                                type="tel"
                                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone_number ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                                placeholder="1234567890"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">No + or spaces (e.g., 1234567890)</p>
                                            {errors.phone_number && <span className="text-xs text-red-500 mt-1">{errors.phone_number.message}</span>}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            {...register('message')}
                                            rows={4}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                            placeholder="Enter your message..."
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Telegram Fields */}
                            {currentPlatform === 'telegram' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Username
                                        </label>
                                        <input
                                            {...register('username', {
                                                pattern: {
                                                    value: /^[a-zA-Z0-9_]{5,32}$/,
                                                    message: 'Invalid username (5-32 characters, no @ symbol)'
                                                },
                                                validate: (value) => {
                                                    const phone = watch('phone_number');
                                                    if (!value && !phone) return 'Username or phone number required';
                                                    return true;
                                                }
                                            })}
                                            type="text"
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.username ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                            placeholder="username"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Without @ symbol (e.g., username)</p>
                                        {errors.username && <span className="text-xs text-red-500 mt-1">{errors.username.message}</span>}
                                    </div>

                                    <div className="text-center text-sm text-slate-500 py-2">OR</div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            {...register('phone_number', {
                                                pattern: {
                                                    value: /^\+?[1-9]\d{1,14}$/,
                                                    message: 'Invalid phone number (use international format: +1234567890)'
                                                }
                                            })}
                                            type="tel"
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone_number ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                            placeholder="+1234567890"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Include country code (e.g., +1 for US)</p>
                                        {errors.phone_number && <span className="text-xs text-red-500 mt-1">{errors.phone_number.message}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            {...register('message')}
                                            rows={4}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                            placeholder="Enter your message..."
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
}
