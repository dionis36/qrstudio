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

            <div className="min-h-full p-6 flex flex-col">
                {/* Top spacing */}
                <div className="flex-shrink-0 h-8"></div>

                {/* Text card - expands with content */}
                <div className="w-full bg-white rounded-2xl shadow-xl p-6">
                    {textContent.message ? (
                        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
                            {textContent.message}
                        </p>
                    ) : (
                        <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap italic">
                            {placeholderText}
                        </p>
                    )}
                </div>

                {/* Bottom spacing for scroll allowance */}
                <div className="flex-shrink-0 h-8"></div>
            </div>
        </div>
    );
}
