import { Phone, Mail, Globe, MapPin, Share2, UserPlus, Building2, AlignLeft } from 'lucide-react';

export function VCardPreview({ data }: { data: any }) {
    // Destructure with defaults to prevent crashes
    const styles = data?.styles || { primary_color: '#2563EB', secondary_color: '#EFF6FF' };
    const personal = data?.personal_info || {};
    const contact = data?.contact_details || {};
    const company = data?.company_details || {};
    const address = data?.address || {};
    const socialNetworks = data?.social_networks || [];
    const summary = data?.summary || '';

    const fullName = [personal.first_name, personal.last_name].filter(Boolean).join(' ') || 'John Doe';
    const jobTitle = company.job_title || 'Product Designer';
    const companyName = company.company_name || 'Creative Studio Inc.';

    // Helper to get icon for social network
    const getSocialIcon = (network: string) => {
        // You could map specific icons here if you import them
        return Share2;
    };

    return (
        <div className="flex flex-col min-h-full font-sans bg-gray-50 h-full overflow-y-auto custom-scrollbar">

            {/* Header Section */}
            <div className="relative pt-10 px-6 pb-6 bg-white shadow-sm flex flex-col items-center text-center">
                {/* Dynamic Cover BG (Primary Color) */}
                <div
                    className="absolute top-0 left-0 w-full h-24"
                    style={{ background: `linear-gradient(to right, ${styles.primary_color}, ${styles.primary_color}dd)` }}
                />

                {/* Avatar */}
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gray-200 z-10 overflow-hidden relative">
                    {personal.avatar_image ? (
                        <img src={personal.avatar_image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <img src={`https://ui-avatars.com/api/?name=${fullName}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                    )}
                </div>

                <div className="mt-3">
                    <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
                    <p className="text-sm font-bold" style={{ color: styles.primary_color }}>{jobTitle}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{companyName}</p>
                </div>

                {/* Save Contact Button */}
                <div className="flex gap-3 mt-6 w-full">
                    <button
                        className="flex-1 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: styles.primary_color, boxShadow: `0 4px 10px -2px ${styles.primary_color}40` }}
                    >
                        <UserPlus className="w-3.5 h-3.5" /> Save Contact
                    </button>
                </div>
            </div>

            {/* Info Lists */}
            <div className="p-4 space-y-3 pb-20">

                {/* About / Summary Section */}
                {summary && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <AlignLeft className="w-3 h-3" /> About
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {summary}
                        </p>
                    </div>
                )}

                {/* Contact Details List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
                    {[
                        { icon: Phone, label: 'Mobile', value: contact.phone, action: 'tel:' },
                        { icon: Phone, label: 'Alternative', value: contact.alternative_phone, action: 'tel:' },
                        { icon: Mail, label: 'Email', value: contact.email, action: 'mailto:' },
                        { icon: Globe, label: 'Website', value: contact.website, action: 'https://' },
                        {
                            icon: MapPin,
                            label: 'Address',
                            value: [address.street, address.city, address.state, address.country].filter(Boolean).join(', '),
                            action: 'http://maps.google.com/?q='
                        },
                    ].filter(item => item.value).map((item, i) => (
                        <a
                            key={i}
                            href={`${item.action}${item.value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors"
                                style={{ backgroundColor: styles.secondary_color, color: styles.primary_color }}
                            >
                                <item.icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] text-gray-400 font-semibold uppercase">{item.label}</p>
                                <p className="text-sm text-gray-900 font-medium truncate group-hover:text-blue-600 transition-colors">{item.value}</p>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Social Networks Grid */}
                {socialNetworks.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Share2 className="w-3 h-3" /> Social Media
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                            {socialNetworks.map((net: any, idx: number) => (
                                <a
                                    key={idx}
                                    href={net.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="aspect-square bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-white hover:shadow-md transition-all group"
                                    style={{}}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.primary_color;
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f9fafb';
                                        e.currentTarget.style.color = '#9ca3af';
                                    }}
                                >
                                    <Share2 className="w-5 h-5 mb-1" />
                                    <span className="text-[9px] font-bold capitalize">{net.network}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-auto mb-6 text-center">
                <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full">
                    Generated via QR Studio
                </span>
            </div>
        </div>
    );
}
