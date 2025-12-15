import { MessageSquare, Phone, User, Mail, Smartphone, Send } from 'lucide-react';

export function MessagePreview({ data }: { data: any }) {

    const platform = data.platform || 'sms';
    const phoneNumber = data.phone_number || '';
    const username = data.username || '';
    const message = data.message || '';
    const messageOnly = data.message_only || false;
    const styles = data.styles || {};

    // Helper to lighten a color
    const lightenColor = (hex: string, percent: number = 30) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + Math.round(((255 - (num >> 16)) * percent) / 100));
        const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(((255 - ((num >> 8) & 0x00FF)) * percent) / 100));
        const b = Math.min(255, (num & 0x0000FF) + Math.round(((255 - (num & 0x0000FF)) * percent) / 100));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    // Generate background style
    const getBackgroundStyle = () => {
        const primary = styles.primary_color || '#10B981';
        const secondary = styles.secondary_color || '#D1FAE5';
        const gradientType = styles.gradient_type || 'none';
        const angle = styles.gradient_angle || 135;

        if (gradientType === 'linear') {
            return {
                background: `linear-gradient(${angle}deg, ${primary}, ${secondary})`
            };
        } else if (gradientType === 'radial') {
            return {
                background: `radial-gradient(circle, ${primary}, ${secondary})`
            };
        }
        // Default: subtle gradient from primary to lighter shade
        return {
            background: `linear-gradient(180deg, ${primary} 0%, ${lightenColor(primary, 30)} 100%)`
        };
    };

    // Platform-specific data
    const platformData = {
        sms: { Icon: MessageSquare, name: 'SMS', action: 'Send SMS' },
        whatsapp: { Icon: Smartphone, name: 'WhatsApp', action: 'Open WhatsApp' },
        telegram: { Icon: Send, name: 'Telegram', action: 'Open Telegram' }
    };

    const currentPlatform = platformData[platform];
    const PlatformIcon = currentPlatform.Icon;

    return (
        <div
            className="absolute inset-0 w-full h-full flex flex-col overflow-y-auto"
            style={{
                backgroundColor: styles.secondary_color || '#F1F5F9',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}
        >
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Gradient Header */}
            <div
                className="px-7 pt-28 pb-14 flex flex-col items-center text-center text-white"
                style={getBackgroundStyle()}
            >
                {/* Platform Icon */}
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                        <MessageSquare className="w-7 h-7" />
                    </div>
                </div>

                {/* Title */}
                <h1
                    className="text-xl font-bold text-center mb-2"
                    style={{ color: styles.secondary_color || '#FFFFFF' }}
                >
                    Send Message
                </h1>

                {/* Subtitle */}
                <p className="text-center text-white/90 text-sm">
                    Scan to send via {currentPlatform.name}
                </p>
            </div>

            {/* Content Area with Rounded Top */}
            <div
                className="flex-1 px-4 pt-6 pb-4 space-y-3 rounded-t-3xl -mt-8"
                style={{ backgroundColor: styles.secondary_color || '#F1F5F9' }}
            >
                {/* Platform Card */}
                <div className="bg-white rounded-2xl p-5 shadow-md">
                    <h3
                        className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                        style={{ color: styles.primary_color || '#10B981', fontSize: '0.75rem', letterSpacing: '0.05em' }}
                    >
                        <MessageSquare style={{ width: '1rem', height: '1rem' }} /> PLATFORM
                    </h3>
                    <div className="flex items-center gap-2">
                        <PlatformIcon className="w-5 h-5 text-slate-600" />
                        <p className="text-gray-900 font-semibold" style={{ fontSize: '0.9375rem' }}>
                            {currentPlatform.name}
                        </p>
                    </div>
                </div>

                {/* Phone Number Card (if provided and not message-only) */}
                {phoneNumber && !messageOnly && (
                    <div className="bg-white rounded-2xl p-5 shadow-md">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color || '#10B981', fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <Phone style={{ width: '1rem', height: '1rem' }} /> TO
                        </h3>
                        <p className="text-gray-900 font-semibold" style={{ fontSize: '0.9375rem', wordBreak: 'break-all' }}>
                            {phoneNumber}
                        </p>
                    </div>
                )}

                {/* Username Card (Telegram only) */}
                {platform === 'telegram' && username && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color || '#10B981', fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <User style={{ width: '1rem', height: '1rem' }} /> USERNAME
                        </h3>
                        <p className="text-gray-900 font-semibold" style={{ fontSize: '0.9375rem', wordBreak: 'break-all' }}>
                            @{username}
                        </p>
                    </div>
                )}

                {/* Message Card */}
                {message && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color || '#10B981', fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <Mail style={{ width: '1rem', height: '1rem' }} /> MESSAGE
                        </h3>
                        <p className="text-gray-700 leading-relaxed" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                            {message}
                        </p>
                        {platform === 'sms' && message.length > 0 && (
                            <p className="text-xs text-slate-500 mt-2">
                                {message.length}/160 characters
                            </p>
                        )}
                    </div>
                )}

                {/* Message Only Mode (WhatsApp) */}
                {platform === 'whatsapp' && messageOnly && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color || '#10B981', fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <User style={{ width: '1rem', height: '1rem' }} /> RECIPIENT
                        </h3>
                        <p className="text-gray-700 text-sm italic">
                            User will select contact
                        </p>
                    </div>
                )}

                {/* Action Button */}
                <button
                    className="w-full py-4 rounded-xl font-semibold text-base shadow-md transition-all flex items-center justify-center gap-2"
                    style={{
                        backgroundColor: styles.secondary_color || '#D1FAE5',
                        color: styles.primary_color || '#10B981'
                    }}
                >
                    <PlatformIcon className="w-5 h-5" />
                    {currentPlatform.action}
                </button>
            </div>

            {/* Footer Branding */}
            <div
                className="pb-6 text-center"
                style={{ backgroundColor: styles.secondary_color || '#F1F5F9' }}
            >
                <p className="text-xs text-slate-600">
                    Powered by <span className="font-semibold">QR Studio</span>
                </p>
            </div>
        </div>
    );
}
