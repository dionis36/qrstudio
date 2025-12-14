import { Utensils, MapPin, Clock, Phone, Globe } from 'lucide-react';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    currency?: 'USD' | 'TSH';
    available?: boolean;
}

interface MenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
}

interface MenuData {
    restaurant_info?: {
        name?: string;
        description?: string;
        website?: string;
        phone?: string;
        logo?: string;
        cover_image?: string;
    };
    content?: {
        categories?: MenuCategory[];
    };
    styles?: {
        primary_color?: string;
        secondary_color?: string;
        gradient_type?: 'none' | 'linear' | 'radial';
        gradient_angle?: number;
    };
}

export function MenuPreview({ data }: { data: MenuData }) {
    const info = data.restaurant_info || {};
    const categories = data.content?.categories || [];
    const primaryColor = data.styles?.primary_color || '#f97316';
    const secondaryColor = data.styles?.secondary_color || '#FFF7ED';

    // Helper to lighten a color
    const lightenColor = (hex: string, percent: number = 30) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + Math.round(((255 - (num >> 16)) * percent) / 100));
        const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(((255 - ((num >> 8) & 0x00FF)) * percent) / 100));
        const b = Math.min(255, (num & 0x0000FF) + Math.round(((255 - (num & 0x0000FF)) * percent) / 100));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    const lightPrimary = lightenColor(primaryColor, 95);

    return (
        <div
            className="absolute inset-0 w-full h-full flex flex-col overflow-y-auto"
            style={{
                backgroundColor: secondaryColor || '#F1F5F9',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
            }}
        >
            {/* Hide scrollbar */}
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Hero Banner - Taller with Better Content Spacing */}
            <div className="h-72 bg-gray-200 relative shrink-0">
                {info.cover_image ? (
                    <img
                        src={info.cover_image}
                        alt="Restaurant Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div
                        className="w-full h-full"
                        style={{
                            background: data.styles?.gradient_type === 'linear'
                                ? `linear-gradient(${data.styles.gradient_angle || 135}deg, ${primaryColor}, ${secondaryColor})`
                                : data.styles?.gradient_type === 'radial'
                                    ? `radial-gradient(circle, ${primaryColor}, ${secondaryColor})`
                                    : `linear-gradient(180deg, ${primaryColor} 0%, ${lightenColor(primaryColor, 30)} 100%)` // Subtle gradient default
                        }}
                    />
                )}
                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute bottom-0 left-0 w-full px-5 pt-5 pb-14 text-white">
                    <div className="flex items-center gap-3">
                        {info.logo && (
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white shrink-0">
                                <img
                                    src={info.logo}
                                    alt="Restaurant Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold leading-tight shadow-sm">{info.name || 'Restaurant Name'}</h1>
                            <p className="text-sm opacity-90 mt-1 line-clamp-2">{info.description || 'Tasty food served with love.'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area with Rounded Top */}
            <div
                className="flex-1 rounded-t-3xl -mt-8 relative z-10"
                style={{ backgroundColor: secondaryColor || '#F1F5F9' }}
            >
                {/* Info Bar - Blends with content area */}
                <div
                    className="px-4 py-3 flex gap-4 border-b border-gray-200 sticky top-0 z-10 shadow-sm overflow-x-auto no-scrollbar rounded-t-3xl"
                    style={{ backgroundColor: secondaryColor || '#F1F5F9' }}
                >
                    {info.phone && (
                        <a href={`tel:${info.phone}`} className="flex items-center gap-1.5 text-xs text-gray-600 whitespace-nowrap hover:opacity-80 transition-opacity">
                            <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                            <span>Call</span>
                        </a>
                    )}
                    {info.website && (
                        <a href={info.website} target="_blank" className="flex items-center gap-1.5 text-xs text-gray-600 whitespace-nowrap hover:opacity-80 transition-opacity">
                            <Globe className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                            <span>Website</span>
                        </a>
                    )}
                </div>

                {/* Categories & Items */}
                <div className="p-4 space-y-8">
                    {categories.length === 0 && (
                        <div className="text-center py-10 text-gray-400 text-sm">
                            Add categories and items to see them here.
                        </div>
                    )}

                    {categories.map((category) => (
                        <div key={category.id} className="scroll-mt-20">
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: primaryColor }}>
                                {category.name || 'Category'}
                                <span className="h-px bg-gray-100 flex-1"></span>
                            </h3>

                            <div className="space-y-4">
                                {category.items?.map((item) => {
                                    const isAvailable = item.available !== false; // Default to true if not specified
                                    const currencySymbol = item.currency === 'TSH' ? 'TSh' : '$';

                                    return (
                                        <div key={item.id} className={`flex gap-3 items-start ${!isAvailable ? 'opacity-50' : ''}`}>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-sm text-gray-900">{item.name || 'Item Name'}</h4>
                                                        {!isAvailable && (
                                                            <span
                                                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                                                                style={{
                                                                    backgroundColor: lightenColor('#EF4444', 95),
                                                                    color: '#DC2626',
                                                                    borderColor: lightenColor('#EF4444', 85)
                                                                }}
                                                            >
                                                                Unavailable
                                                            </span>
                                                        )}
                                                    </div>
                                                    {item.price ? (
                                                        <span className="font-semibold text-sm whitespace-nowrap" style={{ color: isAvailable ? primaryColor : '#9ca3af' }}>
                                                            {currencySymbol} {Number(item.price).toFixed(2)}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                {item.description && (
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {(!category.items || category.items.length === 0) && (
                                    <p className="text-xs text-gray-300 italic">No items yet</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Branding - Always at Bottom */}
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
