import { useWizardStore } from '../store';
import { Mail, User, FileText, Users, Eye } from 'lucide-react';

export function EmailPreview() {
    const { payload } = useWizardStore();

    const emailDetails = payload.email_details || {};
    const additionalRecipients = payload.additional_recipients || {};
    const styles = payload.styles || {};

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
        return { backgroundColor: primary };
    };

    // Parse CC/BCC emails
    const ccEmails = additionalRecipients.cc?.split(',').map(e => e.trim()).filter(e => e) || [];
    const bccEmails = additionalRecipients.bcc?.split(',').map(e => e.trim()).filter(e => e) || [];

    return (
        <div className="h-full w-full overflow-y-auto bg-slate-50" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Gradient Header */}
            <div
                className="relative px-7 pt-24 pb-20 text-white"
                style={getBackgroundStyle()}
            >
                {/* Email Icon */}
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                        <Mail className="w-7 h-7" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-xl font-bold text-center mb-2">
                    Send Email
                </h1>

                {/* Subtitle */}
                <p className="text-center text-white/90 text-sm">
                    Scan to compose email
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
                {/* Recipient Card - Event Style */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h3
                        className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                        style={{ color: styles.primary_color || '#F59E0B', fontSize: '0.75rem', letterSpacing: '0.05em' }}
                    >
                        <User style={{ width: '1rem', height: '1rem' }} /> TO
                    </h3>
                    <p className="text-gray-900 font-semibold" style={{ fontSize: '0.9375rem', wordBreak: 'break-all' }}>
                        {emailDetails.recipient || 'recipient@example.com'}
                    </p>
                </div>

                {/* Subject Card */}
                {emailDetails.subject && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
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
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
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
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
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
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
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
        </div>
    );
}
