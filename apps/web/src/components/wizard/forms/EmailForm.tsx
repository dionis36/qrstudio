import { useForm } from 'react-hook-form';
import { useWizardStore } from '../store';
import { useEffect, useState, useRef } from 'react';
import { ChevronDown, Palette, Mail, Users } from 'lucide-react';

// Form Value Types
type FormValues = {
    // Design & Customize
    styles: {
        primary_color: string;
        secondary_color?: string;
        gradient_type?: 'none' | 'linear' | 'radial';
        gradient_angle?: number;
    };

    // Email Details
    email_details: {
        recipient: string; // Required
        subject?: string;
        body?: string;
    };

    // Additional Recipients
    additional_recipients?: {
        cc?: string;
        bcc?: string;
    };
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

export function EmailForm() {
    const { payload, updatePayload, editMode } = useWizardStore();

    // Main Sections State
    const [openSections, setOpenSections] = useState({
        design: true,
        details: false,
        recipients: false
    });

    // Track if we've already loaded edit data
    const hasLoadedEditData = useRef(false);

    const { register, watch, setValue, formState: { errors }, reset } = useForm<FormValues>({
        defaultValues: {
            styles: {
                primary_color: payload.styles?.primary_color || '#F59E0B',
                secondary_color: payload.styles?.secondary_color || '#FEF3C7',
                gradient_type: payload.styles?.gradient_type || 'none',
                gradient_angle: payload.styles?.gradient_angle || 135
            },
            email_details: payload.email_details || {
                recipient: '',
                subject: '',
                body: ''
            },
            additional_recipients: payload.additional_recipients || {
                cc: '',
                bcc: ''
            }
        },
        mode: 'onChange'
    });

    // Reset form ONCE when entering edit mode with loaded data
    useEffect(() => {
        if (editMode && !hasLoadedEditData.current && payload.email_details?.recipient) {
            hasLoadedEditData.current = true;
            reset({
                styles: payload.styles || { primary_color: '#F59E0B', secondary_color: '#FEF3C7' },
                email_details: payload.email_details,
                additional_recipients: payload.additional_recipients
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

    // Character counters
    const subjectLength = watch('email_details.subject')?.length || 0;
    const bodyLength = watch('email_details.body')?.length || 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Heading Section */}
            <div>
                <h3 className="text-2xl font-bold text-slate-900">Create your email QR code</h3>
                <p className="text-slate-500 mt-1">Generate a QR code that opens a pre-filled email.</p>
            </div>

            <div className="space-y-4">
                {/* 1. Design and Customize Section */}
                <AccordionSection
                    title="Design and customize"
                    subtitle="Choose your color scheme"
                    icon={Palette}
                    color="bg-amber-100 text-amber-600"
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
                                        value={watch('styles.primary_color') || '#F59E0B'}
                                        onChange={(e) => setValue('styles.primary_color', e.target.value)}
                                        type="text"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase"
                                        placeholder="#F59E0B"
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
                                        value={watch('styles.secondary_color') || '#FEF3C7'}
                                        onChange={(e) => setValue('styles.secondary_color', e.target.value)}
                                        type="text"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase"
                                        placeholder="#FEF3C7"
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
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
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

                {/* 2. Email Details Section */}
                <AccordionSection
                    title="Email details"
                    subtitle="Configure recipient and message"
                    icon={Mail}
                    color="bg-blue-100 text-blue-600"
                    isOpen={openSections.details}
                    onToggle={() => toggleSection('details')}
                >
                    <div className="space-y-4 mt-4">
                        {/* Recipient Email */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Recipient Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('email_details.recipient', {
                                    required: 'Recipient email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                type="email"
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.email_details?.recipient ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                placeholder="recipient@example.com"
                            />
                            {errors.email_details?.recipient && <span className="text-xs text-red-500 mt-1">{errors.email_details.recipient.message}</span>}
                        </div>

                        {/* Subject Line */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Subject Line
                                <span className="text-xs text-slate-500 ml-2">({subjectLength}/200)</span>
                            </label>
                            <input
                                {...register('email_details.subject', {
                                    maxLength: {
                                        value: 200,
                                        message: 'Subject must be 200 characters or less'
                                    }
                                })}
                                type="text"
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.email_details?.subject ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                placeholder="Enter email subject"
                            />
                            {errors.email_details?.subject && <span className="text-xs text-red-500 mt-1">{errors.email_details.subject.message}</span>}
                        </div>

                        {/* Message Body */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Message Body
                                <span className="text-xs text-slate-500 ml-2">({bodyLength}/1000)</span>
                            </label>
                            <textarea
                                {...register('email_details.body', {
                                    maxLength: {
                                        value: 1000,
                                        message: 'Message must be 1000 characters or less'
                                    }
                                })}
                                rows={6}
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.email_details?.body ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none resize-none`}
                                placeholder="Enter your message..."
                            />
                            {errors.email_details?.body && <span className="text-xs text-red-500 mt-1">{errors.email_details.body.message}</span>}
                        </div>
                    </div>
                </AccordionSection>

                {/* 3. Additional Recipients Section */}
                <AccordionSection
                    title="Additional recipients"
                    subtitle="Add CC and BCC recipients (optional)"
                    icon={Users}
                    color="bg-emerald-100 text-emerald-600"
                    isOpen={openSections.recipients}
                    onToggle={() => toggleSection('recipients')}
                >
                    <div className="space-y-4 mt-4">
                        {/* CC Recipients */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">CC Recipients</label>
                            <input
                                {...register('additional_recipients.cc', {
                                    validate: (value) => {
                                        if (!value || value.trim() === '') return true;
                                        const emails = value.split(',').map(e => e.trim());
                                        return emails.every(email =>
                                            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
                                        ) || 'All CC emails must be valid';
                                    }
                                })}
                                type="text"
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.additional_recipients?.cc ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                placeholder="cc1@example.com, cc2@example.com"
                            />
                            <p className="text-xs text-slate-500 mt-1">Separate multiple emails with commas</p>
                            {errors.additional_recipients?.cc && <span className="text-xs text-red-500 mt-1">{errors.additional_recipients.cc.message}</span>}
                        </div>

                        {/* BCC Recipients */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">BCC Recipients</label>
                            <input
                                {...register('additional_recipients.bcc', {
                                    validate: (value) => {
                                        if (!value || value.trim() === '') return true;
                                        const emails = value.split(',').map(e => e.trim());
                                        return emails.every(email =>
                                            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
                                        ) || 'All BCC emails must be valid';
                                    }
                                })}
                                type="text"
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.additional_recipients?.bcc ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                placeholder="bcc1@example.com, bcc2@example.com"
                            />
                            <p className="text-xs text-slate-500 mt-1">Separate multiple emails with commas</p>
                            {errors.additional_recipients?.bcc && <span className="text-xs text-red-500 mt-1">{errors.additional_recipients.bcc.message}</span>}

                            {/* Privacy Warning */}
                            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                                <span className="text-amber-600 text-sm">⚠️</span>
                                <p className="text-xs text-amber-700">
                                    <strong>Privacy Note:</strong> BCC addresses will be visible in the QR code data. Use with caution.
                                </p>
                            </div>
                        </div>
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
}
