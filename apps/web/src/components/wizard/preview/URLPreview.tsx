import { ExternalLink, ArrowRight } from 'lucide-react';

interface URLPreviewProps {
    data: any;
}

export function URLPreview({ data }: URLPreviewProps) {
    const urlDetails = data?.url_details || {};
    const redirectSettings = data?.redirect_settings || { delay: 2, show_preview: true };
    const styles = data?.styles || { primary_color: '#2563EB', secondary_color: '#EFF6FF' };

    const destinationUrl = urlDetails.destination_url || 'https://example.com';
    const title = urlDetails.title || 'Redirecting...';
    const description = urlDetails.description || '';
    const logo = urlDetails.logo;
    const customMessage = redirectSettings.custom_message || '';

    // Get user's colors
    const primaryColor = styles.primary_color || '#2563EB';
    const secondaryColor = styles.secondary_color || '#EFF6FF';
    const gradientType = styles.gradient_type || 'none';
    const gradientAngle = styles.gradient_angle || 135;

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
        if (gradientType === 'linear') {
            return {
                background: `linear-gradient(${gradientAngle}deg, ${primaryColor}, ${secondaryColor})`
            };
        } else if (gradientType === 'radial') {
            return {
                background: `radial-gradient(circle, ${primaryColor}, ${secondaryColor})`
            };
        }
        // Default: subtle gradient
        return {
            background: `linear-gradient(135deg, ${secondaryColor} 0%, ${lightenColor(secondaryColor, 10)} 100%)`
        };
    };

    const lightPrimary = lightenColor(primaryColor, 95);

    // Show instant redirect mode
    if (!redirectSettings.show_preview) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center p-6" style={getBackgroundStyle()}>
                <div className="text-center">
                    <div
                        className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto mb-4"
                        style={{ borderColor: primaryColor, borderTopColor: 'transparent' }}
                    ></div>
                    <p className="text-slate-700 font-semibold text-lg">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 w-full h-full flex flex-col overflow-hidden" style={getBackgroundStyle()}>
            {/* Keyframe animation for dot spinner */}
            <style jsx>{`
                @keyframes dotPulse {
                    0%, 100% {
                        transform: scale(0);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>

            {/* Full Screen Content */}
            <div className="flex-1 min-h-full flex flex-col items-center justify-center px-6 py-8 text-center">
                {/* Logo */}
                {logo && (
                    <div className="mb-8">
                        <div
                            className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-4 mx-auto"
                            style={{ borderColor: lightPrimary }}
                        >
                            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}

                {/* Title */}
                <h1 className="text-2xl font-bold mb-3 text-slate-900 px-4">
                    {title}
                </h1>

                {/* Description */}
                {description && (
                    <p className="text-slate-600 mb-8 max-w-sm text-sm leading-relaxed px-4">
                        {description}
                    </p>
                )}

                {/* Minimal Dot Spinner */}
                <div className="mb-6 relative">
                    <div className="relative flex items-center justify-center" style={{ height: '2.8rem', width: '2.8rem' }}>
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, index) => (
                            <div
                                key={index}
                                className="absolute top-0 left-0 flex items-center justify-start h-full w-full"
                                style={{ transform: `rotate(${rotation}deg)` }}
                            >
                                <div
                                    className="rounded-full"
                                    style={{
                                        height: '20%',
                                        width: '20%',
                                        backgroundColor: primaryColor,
                                        boxShadow: `0 0 20px ${primaryColor}30`,
                                        animation: 'dotPulse 1s ease-in-out infinite',
                                        animationDelay: `${-0.875 + (index * 0.125)}s`,
                                        opacity: 0.5
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message */}
                {customMessage && (
                    <p className="text-slate-700 font-medium text-base mb-6">
                        {customMessage}
                    </p>
                )}

                {/* URL Display */}
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4 px-4">
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate max-w-[240px]">{destinationUrl}</span>
                </div>

                {/* Countdown */}
                {redirectSettings.delay > 0 && (
                    <p className="text-sm text-slate-400 mb-6">
                        Redirecting in {redirectSettings.delay} second{redirectSettings.delay !== 1 ? 's' : ''}...
                    </p>
                )}

                {/* Manual Link */}
                <a
                    href={destinationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold hover:underline transition-colors px-4"
                    style={{ color: primaryColor }}
                >
                    Click here if not redirected
                    <ArrowRight className="w-4 h-4" />
                </a>
            </div>

            {/* Footer Branding */}
            <div className="pb-6 text-center">
                <p className="text-xs text-slate-500">
                    Powered by <span className="font-semibold">QR Studio</span>
                </p>
            </div>
        </div>
    );
}
