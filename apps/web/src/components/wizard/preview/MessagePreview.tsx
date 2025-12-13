import { useWizardStore } from '../store';
import { MessageSquare, Phone, User, Mail, Smartphone, Send } from 'lucide-react';

export function MessagePreview() {
    const { payload } = useWizardStore();

    const platform = payload.platform || 'sms';
    const phoneNumber = payload.phone_number || '';
    const username = payload.username || '';
    const message = payload.message || '';
    const messageOnly = payload.message_only || false;
    const styles = payload.styles || {};

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
        return { backgroundColor: primary };
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
        <div className="h-full w-full overflow-y-auto bg-slate-50" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Gradient Header */}
            <div
                className="relative px-7 pt-16 pb-20 text-white"
                style={getBackgroundStyle()}
            >
                {/* Platform Icon */}
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                        <MessageSquare className="w-7 h-7" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-xl font-bold text-center mb-2">
                    Send Message
                </h1>

                {/* Subtitle */}
                <p className="text-center text-white/90 text-sm">
                    Scan to send via {currentPlatform.name}
                </p>
            </div>

            {/* Wave Separator */}
            <div className="relative -mt-12">
                <svg
                    viewBox="0 0 1440 120"
                    className="w-full"
                    preserveAspectRatio="none"
                    style={{ height: '60px' }}
                >
                    <path
                        d="M0,64 C360,20 720,20 1080,64 C1260,86 1350,96 1440,96 L1440,120 L0,120 Z"
                        fill="#F8FAFC"
                    />
                </svg>
            </div>

            {/* Content Area */}
            <div className="px-4 pb-6 space-y-3 -mt-4">
                {/* Platform Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
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
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
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
        </div>
    );
}
