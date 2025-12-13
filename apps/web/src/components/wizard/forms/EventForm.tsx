import { useForm } from 'react-hook-form';
import { useWizardStore } from '../store';
import { useEffect, useState, useRef } from 'react';
import { ChevronDown, Palette, Calendar, FileText, Bell, ChevronRight } from 'lucide-react';

// Form Value Types
type FormValues = {
    // Design & Customize
    styles: {
        primary_color: string;
        secondary_color?: string;
        gradient_type?: 'none' | 'linear' | 'radial';
        gradient_angle?: number;
    };

    // Event Details
    event_details: {
        title: string; // Required
        location?: string;
        location_url?: string;
        start_date: string;
        start_time: string;
        end_date: string;
        end_time: string;
        all_day: boolean;
        timezone: string;
    };

    // Description
    description?: string;
    organizer?: {
        name?: string;
        email?: string;
    };
    event_url?: string;

    // Reminders
    reminders?: {
        enabled: boolean;
        times: number[]; // Minutes before event
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

const TIMEZONES = [
    { value: 'UTC', label: 'GMT+0 - UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'GMT-5 - Eastern Time (US & Canada)' },
    { value: 'America/Chicago', label: 'GMT-6 - Central Time (US & Canada)' },
    { value: 'America/Denver', label: 'GMT-7 - Mountain Time (US & Canada)' },
    { value: 'America/Los_Angeles', label: 'GMT-8 - Pacific Time (US & Canada)' },
    { value: 'Europe/London', label: 'GMT+0 - London (GMT)' },
    { value: 'Europe/Paris', label: 'GMT+1 - Paris, Berlin, Rome' },
    { value: 'Africa/Nairobi', label: 'GMT+3 - Nairobi, East Africa' },
    { value: 'Asia/Dubai', label: 'GMT+4 - Dubai, Abu Dhabi' },
    { value: 'Asia/Kolkata', label: 'GMT+5:30 - Mumbai, New Delhi' },
    { value: 'Asia/Singapore', label: 'GMT+8 - Singapore, Kuala Lumpur' },
    { value: 'Asia/Tokyo', label: 'GMT+9 - Tokyo, Osaka' },
    { value: 'Australia/Sydney', label: 'GMT+11 - Sydney, Melbourne' },
];

const REMINDER_OPTIONS = [
    { value: 15, label: '15 minutes before' },
    { value: 30, label: '30 minutes before' },
    { value: 60, label: '1 hour before' },
    { value: 120, label: '2 hours before' },
    { value: 1440, label: '1 day before' },
    { value: 2880, label: '2 days before' },
    { value: 10080, label: '1 week before' },
];

export function EventForm() {
    const { payload, updatePayload, editMode } = useWizardStore();

    // Main Sections State
    const [openSections, setOpenSections] = useState({
        design: true,
        details: false,
        description: false,
        reminders: false
    });

    // Track if we've already loaded edit data
    const hasLoadedEditData = useRef(false);

    // Get browser timezone as default
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const { register, control, watch, setValue, formState: { errors }, reset } = useForm<FormValues>({
        defaultValues: {
            styles: {
                primary_color: payload.styles?.primary_color || '#7C3AED',
                secondary_color: payload.styles?.secondary_color || '#FAF5FF',
                gradient_type: payload.styles?.gradient_type || 'none',
                gradient_angle: payload.styles?.gradient_angle || 135
            },
            event_details: payload.event_details || {
                title: '',
                location: '',
                location_url: '',
                start_date: '',
                start_time: '',
                end_date: '',
                end_time: '',
                all_day: false,
                timezone: browserTimezone
            },
            description: payload.description || '',
            organizer: payload.organizer || { name: '', email: '' },
            event_url: payload.event_url || '',
            reminders: payload.reminders || { enabled: false, times: [15] }
        },
        mode: 'onChange'
    });

    // Reset form ONCE when entering edit mode with loaded data
    useEffect(() => {
        if (editMode && !hasLoadedEditData.current && payload.event_details?.title) {
            hasLoadedEditData.current = true;
            reset({
                styles: payload.styles || { primary_color: '#7C3AED', secondary_color: '#FAF5FF' },
                event_details: payload.event_details,
                description: payload.description,
                organizer: payload.organizer,
                event_url: payload.event_url,
                reminders: payload.reminders
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
                <h3 className="text-2xl font-bold text-slate-900">Create your event details</h3>
                <p className="text-slate-500 mt-1">Generate a QR code that adds events to calendars instantly.</p>
            </div>

            <div className="space-y-4">
                {/* 1. Design and Customize Section */}
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
                                        {...register('styles.primary_color')}
                                        type="color"
                                        className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                                    />
                                    <input
                                        value={watch('styles.primary_color') || '#7C3AED'}
                                        onChange={(e) => setValue('styles.primary_color', e.target.value)}
                                        type="text"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase"
                                        placeholder="#7C3AED"
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
                                        value={watch('styles.secondary_color') || '#FAF5FF'}
                                        onChange={(e) => setValue('styles.secondary_color', e.target.value)}
                                        type="text"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase"
                                        placeholder="#FAF5FF"
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
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
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

                {/* 2. Event Details Section */}
                <AccordionSection
                    title="Event details"
                    subtitle="Add event information and schedule"
                    icon={Calendar}
                    color="bg-blue-100 text-blue-600"
                    isOpen={openSections.details}
                    onToggle={() => toggleSection('details')}
                >
                    <div className="space-y-4 mt-4">
                        {/* Event Title */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Event Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('event_details.title', { required: 'Event title is required', minLength: { value: 3, message: 'Title must be at least 3 characters' } })}
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.event_details?.title ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                placeholder="e.g., Team Meeting, Birthday Party, Conference"
                            />
                            {errors.event_details?.title && <span className="text-xs text-red-500 mt-1">{errors.event_details.title.message}</span>}
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                                <input
                                    {...register('event_details.location')}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Conference Room A"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Location URL (Optional)</label>
                                <input
                                    {...register('event_details.location_url')}
                                    type="url"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://maps.google.com/..."
                                />
                            </div>
                        </div>

                        {/* All Day Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                {...register('event_details.all_day')}
                                type="checkbox"
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700">All-day event</span>
                        </label>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register('event_details.start_date', { required: 'Start date is required' })}
                                    type="date"
                                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.event_details?.start_date ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                />
                                {errors.event_details?.start_date && <span className="text-xs text-red-500 mt-1">{errors.event_details.start_date.message}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    End Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register('event_details.end_date', { required: 'End date is required' })}
                                    type="date"
                                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.event_details?.end_date ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                />
                                {errors.event_details?.end_date && <span className="text-xs text-red-500 mt-1">{errors.event_details.end_date.message}</span>}
                            </div>
                        </div>

                        {!watch('event_details.all_day') && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Start Time</label>
                                    <input
                                        {...register('event_details.start_time')}
                                        type="time"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">End Time</label>
                                    <input
                                        {...register('event_details.end_time')}
                                        type="time"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Timezone */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Timezone</label>
                            <select
                                {...register('event_details.timezone')}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                {TIMEZONES.map(tz => (
                                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </AccordionSection>

                {/* 3. Event Description Section */}
                <AccordionSection
                    title="Event description"
                    subtitle="Add details about the event"
                    icon={FileText}
                    color="bg-emerald-100 text-emerald-600"
                    isOpen={openSections.description}
                    onToggle={() => toggleSection('description')}
                >
                    <div className="space-y-4 mt-4">
                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                            <textarea
                                {...register('description')}
                                rows={4}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Add event description, agenda, or additional information..."
                            />
                        </div>

                        {/* Organizer Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Organizer Name</label>
                                <input
                                    {...register('organizer.name')}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Organizer Email</label>
                                <input
                                    {...register('organizer.email', {
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    type="email"
                                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.organizer?.email ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                    placeholder="john@example.com"
                                />
                                {errors.organizer?.email && <span className="text-xs text-red-500 mt-1">{errors.organizer.email.message}</span>}
                            </div>
                        </div>

                        {/* Event URL */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Event URL (Optional)</label>
                            <input
                                {...register('event_url')}
                                type="url"
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://example.com/event"
                            />
                        </div>
                    </div>
                </AccordionSection>

                {/* 4. Reminders Section */}
                <AccordionSection
                    title="Reminders"
                    subtitle="Set up event reminders"
                    icon={Bell}
                    color="bg-orange-100 text-orange-600"
                    isOpen={openSections.reminders}
                    onToggle={() => toggleSection('reminders')}
                >
                    <div className="space-y-4 mt-4">
                        {/* Enable Reminders */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                {...register('reminders.enabled')}
                                type="checkbox"
                                className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-2 focus:ring-orange-500"
                            />
                            <span className="text-sm font-medium text-slate-700">Enable event reminders</span>
                        </label>

                        {watch('reminders.enabled') && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Reminder Time</label>
                                <select
                                    {...register('reminders.times.0')}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                                >
                                    {REMINDER_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 mt-2">
                                    A notification will be sent at the specified time before the event
                                </p>
                            </div>
                        )}
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
}
