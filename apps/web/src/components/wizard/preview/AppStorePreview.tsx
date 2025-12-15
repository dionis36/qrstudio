import { Store, Smartphone } from 'lucide-react';

export function AppStorePreview({ data }: { data: any }) {

    const appName = data.app_name || 'App Name';
    const developer = data.developer || '';
    const description = data.description || '';
    const appLogo = data.app_logo || '';
    const platforms = data.platforms || [];
    const styles = data.styles || {};

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

    // Helper to darken a color
    const darkenColor = (hex: string, percent: number = 20) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.max(0, (num >> 16) - Math.round((num >> 16) * (percent / 100)));
        const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(((num >> 8) & 0x00FF) * (percent / 100)));
        const b = Math.max(0, (num & 0x0000FF) - Math.round((num & 0x0000FF) * (percent / 100)));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    // Generate background style for header
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
        // Default: subtle gradient from primary to lighter shade
        return {
            background: `linear-gradient(180deg, ${primaryColor} 0%, ${lightenColor(primaryColor, 30)} 100%)`
        };
    };

    // Platform badge images (using official store badge styles)
    const platformBadges = {
        google_play: {
            name: 'Google Play',
            badge: (
                <div className="w-full bg-black rounded-xl py-3.5 px-6 flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                        <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.61 3 21.09 3 20.5Z" fill="#00D7FF" />
                        <path d="M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12Z" fill="#FFCE00" />
                        <path d="M3.84 2.15L6.05 2.66L14.54 11.15L6.05 2.66L3.84 2.15Z" fill="#00F076" />
                        <path d="M16.81 8.88L14.54 11.15L6.05 2.66L16.81 8.88Z" fill="#FF3A44" />
                    </svg>
                    <div className="text-left">
                        <div className="text-[9px] text-white/80 uppercase tracking-wide">GET IT ON</div>
                        <div className="text-base font-semibold text-white -mt-0.5">Google Play</div>
                    </div>
                </div>
            )
        },
        ios: {
            name: 'App Store',
            badge: (
                <div className="w-full bg-black rounded-xl py-3.5 px-6 flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="white">
                        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                    </svg>
                    <div className="text-left">
                        <div className="text-[9px] text-white/80 uppercase tracking-wide">Download on the</div>
                        <div className="text-base font-semibold text-white -mt-0.5">App Store</div>
                    </div>
                </div>
            )
        },
        amazon: {
            name: 'Amazon Appstore',
            badge: (
                <div className="w-full bg-black rounded-xl py-3.5 px-6 flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors">
                    <svg className="w-9 h-9" viewBox="0 0 64 64" fill="none">
                        {/* Amazon smile arrow */}
                        <path
                            d="M47 40C41 45 34 47 27 47C18 47 10 44 4 38C3 37 4 36 5 37C12 41 20 43 28 43C33 43 39 42 44 39C45 38 46 40 47 40Z"
                            fill="#FF9900"
                            stroke="#FF9900"
                            strokeWidth="0.5"
                        />
                        {/* Small arrow pointing up-right */}
                        <path
                            d="M50 37C49 36 44 37 42 37C41 37 41 36 42 36C46 33 53 34 54 35C55 36 54 43 50 47C49 48 49 47 49 46C50 43 51 38 50 37Z"
                            fill="#FF9900"
                            stroke="#FF9900"
                            strokeWidth="0.5"
                        />
                    </svg>
                    <div className="text-left">
                        <div className="text-[9px] text-white/80 uppercase tracking-wide">AVAILABLE AT</div>
                        <div className="text-base font-semibold text-white -mt-0.5">amazon appstore</div>
                    </div>
                </div>
            )
        }
    };

    return (
        <div
            className="absolute inset-0 w-full h-full flex flex-col overflow-y-auto"
            style={{
                backgroundColor: secondaryColor || '#F1F5F9',
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
                {/* App Logo */}
                <div className="flex justify-center mb-4">
                    {appLogo ? (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-4 border-white/30 backdrop-blur-sm">
                            <img src={appLogo} alt={appName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                            <Store className="w-8 h-8" />
                        </div>
                    )}
                </div>

                {/* App Name */}
                <h1
                    className="text-xl font-bold text-center mb-2 leading-tight px-4"
                    style={{ color: secondaryColor || '#FFFFFF' }}
                >
                    {appName}
                </h1>

                {/* Developer */}
                {developer && (
                    <p className="text-center text-white/90 text-sm">
                        {developer}
                    </p>
                )}
            </div>

            {/* Content Area with Rounded Top */}
            <div
                className="flex-1 px-4 pt-6 pb-4 space-y-3 rounded-t-3xl -mt-8"
                style={{ backgroundColor: secondaryColor || '#F1F5F9' }}
            >
                {/* Description Card */}
                {description && (
                    <div className="bg-white rounded-2xl p-5 shadow-md">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: primaryColor, fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <Smartphone style={{ width: '1rem', height: '1rem' }} /> ABOUT
                        </h3>
                        <p className="text-gray-700 leading-relaxed" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                            {description}
                        </p>
                    </div>
                )}

                {/* Download Buttons */}
                {platforms.length > 0 && (
                    <div className="space-y-3 pt-1">
                        {platforms.map((platform, index) => (
                            <div key={index} className="cursor-pointer transform hover:scale-[1.02] transition-transform">
                                {platformBadges[platform.platform]?.badge}
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {platforms.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-slate-400 text-sm italic">
                            Add platforms to show download buttons
                        </p>
                    </div>
                )}
            </div>

            {/* Footer Branding */}
            <div
                className="pb-6 text-center"
                style={{ backgroundColor: secondaryColor || '#F1F5F9' }}
            >
                <p className="text-xs text-slate-600">
                    Powered by <span className="font-semibold">QR Studio</span>
                </p>
            </div>
        </div>
    );
}
