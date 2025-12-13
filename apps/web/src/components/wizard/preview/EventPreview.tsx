import { useWizardStore } from '../store';
import { Calendar, MapPin, Clock, User, Mail, Globe, Bell, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export function EventPreview() {
    const { payload } = useWizardStore();

    // Extract event data
    const styles = payload.styles || { primary_color: '#7C3AED', secondary_color: '#FAF5FF' };
    const eventDetails = payload.event_details || {};
    const description = payload.description || '';
    const organizer = payload.organizer || {};
    const eventUrl = payload.event_url || '';
    const reminders = payload.reminders || { enabled: false };

    // Get GMT offset for timezone
    const getTimezoneDisplay = (timezone: string) => {
        if (!timezone) return '';

        const timezoneOffsets: { [key: string]: string } = {
            'UTC': 'GMT+0',
            'America/New_York': 'GMT-5',
            'America/Chicago': 'GMT-6',
            'America/Denver': 'GMT-7',
            'America/Los_Angeles': 'GMT-8',
            'Europe/London': 'GMT+0',
            'Europe/Paris': 'GMT+1',
            'Asia/Dubai': 'GMT+4',
            'Asia/Kolkata': 'GMT+5:30',
            'Asia/Singapore': 'GMT+8',
            'Asia/Tokyo': 'GMT+9',
            'Australia/Sydney': 'GMT+11',
            'Africa/Nairobi': 'GMT+3',
        };

        return timezoneOffsets[timezone] || 'GMT';
    };

    // Format date and time
    const formatEventDate = () => {
        if (!eventDetails.start_date) return 'Select date';

        try {
            const startDate = parseISO(eventDetails.start_date);
            const endDate = eventDetails.end_date ? parseISO(eventDetails.end_date) : startDate;

            if (eventDetails.all_day) {
                if (eventDetails.start_date === eventDetails.end_date) {
                    return format(startDate, 'EEEE, MMMM d, yyyy');
                }
                return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
            }

            const startTime = eventDetails.start_time || '09:00';
            const endTime = eventDetails.end_time || '10:00';

            if (eventDetails.start_date === eventDetails.end_date) {
                return `${format(startDate, 'EEE, MMM d, yyyy')} • ${startTime} - ${endTime}`;
            }

            return `${format(startDate, 'MMM d')} ${startTime} - ${format(endDate, 'MMM d')} ${endTime}`;
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Helper to lighten a color
    const lightenColor = (hex: string, percent: number = 90) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = (num >> 16) + Math.round((255 - (num >> 16)) * (percent / 100));
        const g = ((num >> 8) & 0x00FF) + Math.round((255 - ((num >> 8) & 0x00FF)) * (percent / 100));
        const b = (num & 0x0000FF) + Math.round((255 - (num & 0x0000FF)) * (percent / 100));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    // Helper to darken a color
    const darkenColor = (hex: string, percent: number = 20) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.max(0, (num >> 16) - Math.round((num >> 16) * (percent / 100)));
        const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(((num >> 8) & 0x00FF) * (percent / 100)));
        const b = Math.max(0, (num & 0x0000FF) - Math.round((num & 0x0000FF) * (percent / 100)));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    // Generate background style
    const getBackgroundStyle = () => {
        const { primary_color, secondary_color, gradient_type, gradient_angle } = styles;

        if (gradient_type === 'linear') {
            return {
                background: `linear-gradient(${gradient_angle || 135}deg, ${primary_color}, ${secondary_color || primary_color})`
            };
        } else if (gradient_type === 'radial') {
            return {
                background: `radial-gradient(circle, ${primary_color}, ${secondary_color || primary_color})`
            };
        }

        // Default gradient
        const darkPrimary = darkenColor(primary_color, 15);
        return {
            background: `linear-gradient(135deg, ${primary_color} 0%, ${darkPrimary} 100%)`
        };
    };

    const lightPrimary = lightenColor(styles.primary_color, 95);

    return (
        <div className="flex flex-col h-full font-sans bg-slate-50 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

            {/* Header Section - Calendar Icon, Title, Button */}
            <div
                className="px-7 pt-16 pb-10 flex flex-col items-center text-center"
                style={getBackgroundStyle()}
            >
                {/* Calendar Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                        <Calendar className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Event Title */}
                <h1 className="text-xl font-bold text-center mb-3 leading-tight px-4">
                    {eventDetails.title || 'Event Title'}
                </h1>


                {/* Date & Time */}
                <div className="flex flex-col items-center gap-1 mb-2">
                    <div className="flex items-center justify-center gap-1.5 text-white/95">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <p className="text-xs font-medium">
                            {formatEventDate()}
                        </p>
                    </div>
                    {/* Subtle timezone display */}
                    {eventDetails.timezone && !eventDetails.all_day && (
                        <p className="text-[10px] text-white/70 font-normal">
                            {getTimezoneDisplay(eventDetails.timezone)}
                        </p>
                    )}
                </div>

                {/* Location */}
                {eventDetails.location && (
                    <div className="flex items-center justify-center gap-1.5 text-white/95 px-4">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <p className="text-xs font-medium truncate max-w-[220px]">
                            {eventDetails.location}
                        </p>
                    </div>
                )}

                {/* Add to Calendar Button */}
                <button
                    className="mt-7 w-full py-3.5 rounded-2xl font-bold shadow-xl transition-all hover:scale-105"
                    style={{
                        backgroundColor: styles.secondary_color || lightenColor(styles.primary_color, 85),
                        color: styles.primary_color,
                        fontSize: '0.9375rem'
                    }}
                >
                    Add to Calendar
                </button>
            </div>

            {/* Content Section - All Details */}
            <div className="px-4 py-4 space-y-3.5 pb-20">

                {/* Date & Time Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h3
                        className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                        style={{ color: styles.primary_color, fontSize: '0.75rem', letterSpacing: '0.05em' }}
                    >
                        <Clock style={{ width: '1rem', height: '1rem' }} /> DATE & TIME
                    </h3>
                    <p className="text-gray-900 font-semibold mb-1.5" style={{ fontSize: '0.9375rem' }}>
                        {formatEventDate()}
                    </p>
                    {eventDetails.timezone && !eventDetails.all_day && (
                        <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>
                            {getTimezoneDisplay(eventDetails.timezone)}
                        </p>
                    )}
                </div>

                {/* Location Card */}
                {eventDetails.location && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color, fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <MapPin style={{ width: '1rem', height: '1rem' }} /> LOCATION
                        </h3>
                        <p className="text-gray-900 font-semibold" style={{ fontSize: '0.9375rem', wordBreak: 'break-word' }}>
                            {eventDetails.location}
                        </p>
                    </div>
                )}

                {/* Description Card */}
                {description && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color, fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <FileText style={{ width: '1rem', height: '1rem' }} /> ABOUT THIS EVENT
                        </h3>
                        <p className="text-gray-700 leading-relaxed" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                            {description}
                        </p>
                    </div>
                )}

                {/* Organizer Card */}
                {(organizer.name || organizer.email) && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color, fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <User style={{ width: '1rem', height: '1rem' }} /> ORGANIZER
                        </h3>
                        {organizer.name && (
                            <p className="text-gray-900 font-semibold mb-1.5" style={{ fontSize: '0.9375rem' }}>
                                {organizer.name}
                            </p>
                        )}
                        {organizer.email && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail style={{ width: '0.875rem', height: '0.875rem' }} />
                                <p className="font-medium" style={{ fontSize: '0.875rem', wordBreak: 'break-all' }}>
                                    {organizer.email}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Event URL Card */}
                {eventUrl && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color, fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <Globe style={{ width: '1rem', height: '1rem' }} /> EVENT WEBSITE
                        </h3>
                        <a
                            href={eventUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-900 font-semibold hover:underline"
                            style={{ fontSize: '0.9375rem', wordBreak: 'break-all' }}
                        >
                            {eventUrl}
                        </a>
                    </div>
                )}

                {/* Reminder Card */}
                {reminders.enabled && (
                    <div className="bg-amber-50 rounded-2xl p-4 shadow-sm border border-amber-100">
                        <div className="flex items-center gap-2">
                            <Bell style={{ width: '1rem', height: '1rem' }} className="text-amber-600" />
                            <p className="text-amber-900 font-semibold" style={{ fontSize: '0.875rem' }}>
                                Reminder set for this event
                            </p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!eventDetails.title && !description && (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium" style={{ fontSize: '0.875rem' }}>
                            Fill in event details to see preview
                        </p>
                    </div>
                )}
            </div>

            {/* Hide scrollbar */}
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
