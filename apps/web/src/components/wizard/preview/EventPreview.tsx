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

        return { backgroundColor: primary_color };
    };

    return (
        <div className="flex flex-col h-full font-sans bg-slate-50 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

            {/* Header with gradient - part of scroll flow */}
            <div
                className="relative px-7 pt-12 pb-20 text-white"
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

                {/* Decorative wave - part of the flow */}
                <div className="absolute bottom-0 left-0 right-0 h-12">
                    <svg
                        viewBox="0 0 1440 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,120 L0,40 Q360,100 720,40 T1440,40 L1440,120 Z"
                            fill="rgb(248, 250, 252)"
                        />
                    </svg>
                </div>
            </div>

            {/* Content Area - continuous scroll */}
            <div className="px-4 -mt-8 pb-20 space-y-3.5">
                {/* Add to Calendar Button */}
                <button
                    className="w-full py-3.5 rounded-xl font-bold text-sm shadow-xl transition-all active:scale-95 hover:shadow-2xl"
                    style={{
                        backgroundColor: styles.primary_color,
                        color: 'white'
                    }}
                >
                    Add to Calendar
                </button>

                {/* Event Details Cards */}
                {/* Description */}
                {description && (
                    <div className="bg-white rounded-xl p-3.5 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            About this event
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            {description}
                        </p>
                    </div>
                )}

                {/* Organizer */}
                {(organizer.name || organizer.email) && (
                    <div className="bg-white rounded-xl p-3.5 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            Organizer
                        </h3>
                        <div className="space-y-1.5">
                            {organizer.name && (
                                <p className="text-xs text-slate-600 font-medium">
                                    {organizer.name}
                                </p>
                            )}
                            {organizer.email && (
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <Mail className="w-3 h-3 flex-shrink-0" />
                                    <p className="text-xs truncate">
                                        {organizer.email}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Event URL */}
                {eventUrl && (
                    <div className="bg-white rounded-xl p-3.5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <a
                                href={eventUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium truncate hover:underline"
                                style={{ color: styles.primary_color }}
                            >
                                Event Website
                            </a>
                        </div>
                    </div>
                )}

                {/* Reminder */}
                {reminders.enabled && (
                    <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                        <div className="flex items-center gap-1.5 text-amber-700">
                            <Bell className="w-3.5 h-3.5 flex-shrink-0" />
                            <p className="text-xs font-medium">
                                Reminder set
                            </p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!eventDetails.title && !description && (
                    <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-xs text-slate-400">
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
