import { useWizardStore } from '../store';
import { Mail, User, FileText, Users, Eye } from 'lucide-react';

export function EmailPreview() {
    const { payload } = useWizardStore();

    const emailDetails = payload.email_details || {};
    const additionalRecipients = payload.additional_recipients || {};
    const styles = payload.styles || {};

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
        const primary = styles.primary_color || '#F59E0B';
        const secondary = styles.secondary_color || '#FEF3C7';
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

    // Parse CC/BCC emails
    const ccEmails = additionalRecipients.cc?.split(',').map(e => e.trim()).filter(e => e) || [];
    const bccEmails = additionalRecipients.bcc?.split(',').map(e => e.trim()).filter(e => e) || [];

    return (
        <div
            className="absolute inset-0 w-full h-full flex flex-col bg-slate-50 overflow-y-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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
                {/* Email Icon */}
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                        <Mail className="w-7 h-7" />
                    </div>
                </div>

                {/* Title */}
                <h1
                    className="text-xl font-bold text-center mb-2"
                    style={{ color: styles.secondary_color || '#FFFFFF' }}
                >
                    Send Email
                </h1>

                {/* Subtitle */}
                <p className="text-center text-white/90 text-sm">
                    Scan to compose email
                </p>
            </div>

            {/* Content Area with Rounded Top */}
            <div className="flex-1 px-4 pt-6 pb-4 space-y-3 bg-slate-100 rounded-t-3xl -mt-8">
                {/* Recipient Card - Event Style */}
                <div className="bg-white rounded-2xl p-5 shadow-md">
                    <h3
                        className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                        style={{ color: styles.primary_color || '#F59E0B', fontSize: '0.6875rem', letterSpacing: '0.05em' }}
                    >
                        <User style={{ width: '1rem', height: '1rem' }} /> TO
                    </h3>
                    <p className="text-gray-900 font-semibold text-sm" style={{ wordBreak: 'break-all' }}>
                        {emailDetails.recipient || 'recipient@example.com'}
                    </p>
                </div>

                {/* Subject Card */}
                {emailDetails.subject && (
                    <div className="bg-white rounded-2xl p-5 shadow-md">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color || '#F59E0B', fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <FileText style={{ width: '1rem', height: '1rem' }} /> SUBJECT
                        </h3>
                        <p className="text-gray-900 font-semibold" style={{ fontSize: '0.9375rem' }}>
                            {emailDetails.subject}
                        </p>
                    </div>
                )}

                {/* Message Body Card */}
                {emailDetails.body && (
                    <div className="bg-white rounded-2xl p-5 shadow-md">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color || '#F59E0B', fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <Mail style={{ width: '1rem', height: '1rem' }} /> MESSAGE
                        </h3>
                        <p className="text-gray-700 leading-relaxed" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                            {emailDetails.body}
                        </p>
                    </div>
                )}

                {/* CC Recipients Card */}
                {ccEmails.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-md">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color || '#F59E0B', fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <Users style={{ width: '1rem', height: '1rem' }} /> CC
                        </h3>
                        <div className="space-y-1">
                            {ccEmails.map((email, idx) => (
                                <p key={idx} className="text-gray-700" style={{ fontSize: '0.875rem', wordBreak: 'break-all' }}>
                                    {email}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* BCC Recipients Card */}
                {bccEmails.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-md">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color || '#F59E0B', fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <Eye style={{ width: '1rem', height: '1rem' }} /> BCC
                        </h3>
                        <div className="space-y-1">
                            {bccEmails.map((email, idx) => (
                                <p key={idx} className="text-gray-700" style={{ fontSize: '0.875rem', wordBreak: 'break-all' }}>
                                    {email}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Open Email App Button */}
                <button
                    className="w-full py-4 rounded-xl font-semibold text-base shadow-md transition-all flex items-center justify-center gap-2"
                    style={{
                        backgroundColor: styles.secondary_color || '#FEF3C7',
                        color: styles.primary_color || '#F59E0B'
                    }}
                >
                    <Mail className="w-5 h-5" />
                    Open Email App
                </button>
            </div>

            {/* Footer Branding */}
            <div className="pb-6 text-center bg-slate-100">
                <p className="text-xs text-slate-600">
                    Powered by <span className="font-semibold">QR Studio</span>
                </p>
            </div>
        </div>
    );
}
