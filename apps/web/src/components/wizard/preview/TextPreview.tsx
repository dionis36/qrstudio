type TextPreviewProps = {
    data: any;
};

export function TextPreview({ data }: TextPreviewProps) {
    const textContent = data?.text_content || {};
    const styles = data?.styles || {};

    const primaryColor = styles.primary_color || '#3B82F6';
    const secondaryColor = styles.secondary_color || '#DBEAFE';
    const gradientType = styles.gradient_type || 'none';
    const gradientAngle = styles.gradient_angle || 135;

    // Optional title
    const title = textContent.title || '';
    const message = textContent.message || '';

    // Helper to lighten a color
    const lightenColor = (hex: string, percent: number = 30) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + Math.round(((255 - (num >> 16)) * percent) / 100));
        const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(((255 - ((num >> 8) & 0x00FF)) * percent) / 100));
        const b = Math.min(255, (num & 0x0000FF) + Math.round(((255 - (num & 0x0000FF)) * percent) / 100));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    // Lorem ipsum placeholder
    const placeholderText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`;

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
        } else {
            return {
                backgroundColor: secondaryColor
            };
        }
    };

    const lightPrimary = lightenColor(primaryColor, 95);

    return (
        <div
            className="absolute inset-0 w-full h-full overflow-y-auto font-sans"
            style={{
                ...getBackgroundStyle(),
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
            }}
        >
            {/* Hide scrollbar for Chrome/Safari */}
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            <div className="min-h-full px-6 py-8 flex flex-col">
                {/* Top margin */}
                <div className="flex-shrink-0 h-16"></div>

                {/* Optional Title */}
                {title && (
                    <h1
                        className="text-2xl font-bold text-center mb-6 px-4"
                        style={{ color: primaryColor }}
                    >
                        {title}
                    </h1>
                )}

                {/* Text card - expands with content */}
                <div
                    className="w-full bg-white rounded-2xl shadow-lg p-6 border-2"
                    style={{ borderColor: lightPrimary }}
                >
                    {message ? (
                        <p className="text-base text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
                            {message}
                        </p>
                    ) : (
                        <p className="text-base text-slate-400 leading-relaxed whitespace-pre-wrap italic">
                            {placeholderText}
                        </p>
                    )}
                </div>

                {/* Bottom spacing for scroll allowance */}
                <div className="flex-shrink-0 h-8"></div>

                {/* Footer Branding */}
                <div className="mt-auto pt-6 text-center">
                    <p className="text-xs text-slate-600">
                        Powered by <span className="font-semibold">QR Studio</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
