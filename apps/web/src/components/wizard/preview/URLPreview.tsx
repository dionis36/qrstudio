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
    const customMessage = redirectSettings.custom_message || 'Taking you to your destination';

    // Generate background style
    const getBackgroundStyle = () => {
        const primary = styles.primary_color || '#2563EB';
        const secondary = styles.secondary_color || '#EFF6FF';
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
        } else {
            return {
                backgroundColor: secondary
            };
        }
    };

    // Show preview page or instant redirect
    if (!redirectSettings.show_preview) {
        return (
            <div className="w-full h-full flex items-center justify-center p-6" style={getBackgroundStyle()}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                    <p className="text-white font-semibold text-lg">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col" style={getBackgroundStyle()}>
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                {/* Logo */}
                {logo && (
                    <div className="mb-6">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                        />
                    </div>
                )}

                {/* Title */}
                <h1 className="text-2xl font-bold mb-3" style={{ color: styles.primary_color || '#2563EB' }}>
                    {title}
                </h1>

                {/* Description */}
                {description && (
                    <p className="text-slate-600 mb-6 max-w-xs text-sm leading-relaxed">
                        {description}
                    </p>
                )}

                {/* Redirect Message */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-sm w-full">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                        <p className="text-slate-700 font-medium">{customMessage}</p>
                    </div>

                    {/* Destination URL Display */}
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
                        <ExternalLink className="w-4 h-4" />
                        <span className="truncate max-w-[200px]">{destinationUrl}</span>
                    </div>

                    {/* Redirect Delay Indicator */}
                    {redirectSettings.delay > 0 && (
                        <div className="text-xs text-slate-400">
                            Redirecting in {redirectSettings.delay} second{redirectSettings.delay !== 1 ? 's' : ''}...
                        </div>
                    )}

                    {/* Manual Link */}
                    <a
                        href={destinationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold hover:underline transition-colors"
                        style={{ color: styles.primary_color || '#2563EB' }}
                    >
                        Click here if not redirected
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="p-4 text-center">
                <p className="text-xs text-slate-500">
                    Powered by <span className="font-semibold">QR Studio</span>
                </p>
            </div>
        </div>
    );
}
