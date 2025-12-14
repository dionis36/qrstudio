import { Phone, Mail, Globe, MapPin, Building2, AlignLeft } from 'lucide-react';
import {
    FaLinkedin, FaFacebook, FaXTwitter, FaInstagram, FaYoutube, FaTiktok, FaPinterest, FaMastodon,
    FaGithub, FaBehance, FaDribbble, FaMedium, FaTwitch, FaFlickr,
    FaGlobe, FaTelegram, FaWhatsapp, FaReddit, FaSpotify, FaSkype
} from 'react-icons/fa6';

// Social network configuration with brand colors
const SOCIAL_NETWORK_CONFIG: Record<string, { icon: any; color: string }> = {
    linkedin: { icon: FaLinkedin, color: '#0A66C2' },
    facebook: { icon: FaFacebook, color: '#1877F2' },
    twitter: { icon: FaXTwitter, color: '#000000' },
    instagram: { icon: FaInstagram, color: '#E4405F' },
    youtube: { icon: FaYoutube, color: '#FF0000' },
    tiktok: { icon: FaTiktok, color: '#000000' },
    pinterest: { icon: FaPinterest, color: '#BD081C' },
    mastodon: { icon: FaMastodon, color: '#6364FF' },
    github: { icon: FaGithub, color: '#181717' },
    behance: { icon: FaBehance, color: '#1769FF' },
    dribbble: { icon: FaDribbble, color: '#EA4C89' },
    medium: { icon: FaMedium, color: '#000000' },
    twitch: { icon: FaTwitch, color: '#9146FF' },
    flickr: { icon: FaFlickr, color: '#0063DC' },
    website: { icon: FaGlobe, color: '#2563EB' },
    telegram: { icon: FaTelegram, color: '#26A5E4' },
    whatsapp: { icon: FaWhatsapp, color: '#25D366' },
    reddit: { icon: FaReddit, color: '#FF4500' },
    spotify: { icon: FaSpotify, color: '#1DB954' },
    skype: { icon: FaSkype, color: '#00AFF0' },
};

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

    // Helper to lighten a color
    const lightenColor = (hex: string, percent: number = 90) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = (num >> 16) + Math.round((255 - (num >> 16)) * (percent / 100));
        const g = ((num >> 8) & 0x00FF) + Math.round((255 - ((num >> 8) & 0x00FF)) * (percent / 100));
        const b = (num & 0x0000FF) + Math.round((255 - (num & 0x0000FF)) * (percent / 100));
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

    const lightPrimary = lightenColor(styles.primary_color, 95);
    const darkPrimary = darkenColor(styles.primary_color, 15);

    return (
        <div
            className="absolute inset-0 w-full h-full flex flex-col overflow-y-auto"
            style={{
                backgroundColor: styles.secondary_color || '#F1F5F9',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}
        >

            {/* Header Section - ONLY Avatar, Name, Button */}
            <div
                className="px-7 pt-24 pb-10 flex flex-col items-center text-center"
                style={{
                    background: `linear-gradient(180deg, ${styles.primary_color} 0%, ${lightenColor(styles.primary_color, 30)} 100%)`
                }}
            >
                {/* Avatar */}
                <div
                    className="rounded-full border-[5px] shadow-2xl overflow-hidden relative mb-5"
                    style={{
                        borderColor: lightenColor(styles.primary_color, 80),
                        width: '7rem',
                        height: '7rem'
                    }}
                >
                    {personal.avatar_image ? (
                        <img src={personal.avatar_image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center font-bold"
                            style={{
                                backgroundColor: lightenColor(styles.primary_color, 80),
                                color: styles.primary_color,
                                fontSize: '2rem'
                            }}
                        >
                            {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Name - Reduced size */}
                <h2 className="font-bold text-white mb-1.5" style={{ fontSize: '1.375rem', lineHeight: '1.75rem' }}>{fullName}</h2>
                {/* Job Title - Increased size */}
                <p className="font-semibold text-white/90" style={{ fontSize: '0.9375rem' }}>{jobTitle}</p>

                {/* Save Contact Button - Better balanced */}
                <button
                    className="mt-7 w-full py-3.5 rounded-2xl font-bold shadow-xl transition-all hover:scale-105"
                    style={{
                        backgroundColor: styles.secondary_color || lightenColor(styles.primary_color, 85),
                        color: styles.primary_color,
                        fontSize: '0.9375rem'
                    }}
                >
                    Save Contact
                </button>
            </div>

            {/* Content Section with Rounded Top */}
            <div
                className="flex-1 px-4 pt-6 pb-4 space-y-3.5 rounded-t-3xl -mt-8"
                style={{ backgroundColor: styles.secondary_color || '#F1F5F9' }}
            >

                {/* Contact Details - Phone */}
                {contact.phone && (
                    <div className="bg-white rounded-2xl p-5 shadow-md">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color, fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <Phone style={{ width: '1rem', height: '1rem' }} /> MOBILE
                        </h3>
                        <a href={`tel:${contact.phone}`} className="text-gray-900 font-medium hover:opacity-80" style={{ fontSize: '0.9375rem', wordBreak: 'break-word' }}>
                            {contact.phone}
                        </a>
                    </div>
                )}

                {/* Alternative Phone */}
                {contact.alternative_phone && (
                    <div className="bg-white rounded-2xl p-5 shadow-md">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color, fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <Phone style={{ width: '1rem', height: '1rem' }} /> ALTERNATIVE
                        </h3>
                        <a href={`tel:${contact.alternative_phone}`} className="text-gray-900 font-medium hover:opacity-80" style={{ fontSize: '0.9375rem', wordBreak: 'break-word' }}>
                            {contact.alternative_phone}
                        </a>
                    </div>
                )}

                {/* Email */}
                {contact.email && (
                    <div className="bg-white rounded-2xl p-5 shadow-md">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color, fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <Mail style={{ width: '1rem', height: '1rem' }} /> EMAIL
                        </h3>
                        <a href={`mailto:${contact.email}`} className="text-gray-900 font-medium hover:opacity-80" style={{ fontSize: '0.9375rem', wordBreak: 'break-all' }}>
                            {contact.email}
                        </a>
                    </div>
                )}

                {/* Website */}
                {contact.website && (
                    <div className="bg-white rounded-2xl p-5 shadow-md">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color, fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <Globe style={{ width: '1rem', height: '1rem' }} /> WEBSITE
                        </h3>
                        <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-gray-900 font-medium hover:opacity-80" style={{ fontSize: '0.9375rem', wordBreak: 'break-all' }}>
                            {contact.website}
                        </a>
                    </div>
                )}

                {/* Company Information Card */}
                {(company.company_name || company.job_title) && (
                    <div className="bg-white rounded-2xl p-5 shadow-md">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color, fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <Building2 style={{ width: '1rem', height: '1rem' }} /> COMPANY
                        </h3>
                        {company.company_name && (
                            <p className="text-gray-900 font-medium mb-1.5" style={{ fontSize: '0.9375rem' }}>{company.company_name}</p>
                        )}
                        {company.job_title && (
                            <p className="text-gray-600 font-normal" style={{ fontSize: '0.875rem' }}>{company.job_title}</p>
                        )}
                    </div>
                )}

                {/* Summary Card */}
                {summary && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color, fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <AlignLeft style={{ width: '1rem', height: '1rem' }} /> ABOUT
                        </h3>
                        <p className="text-gray-700 leading-relaxed" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                            {summary}
                        </p>
                    </div>
                )}

                {/* Address Card */}
                {(address.street || address.city || address.state || address.country) && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h3
                            className="font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: styles.primary_color, fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            <MapPin style={{ width: '1rem', height: '1rem' }} /> ADDRESS
                        </h3>
                        <a
                            href={`http://maps.google.com/?q=${[address.street, address.city, address.state, address.country].filter(Boolean).join(', ')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-900 hover:text-blue-600 transition-colors font-medium"
                            style={{ fontSize: '0.875rem', lineHeight: '1.5' }}
                        >
                            {[address.street, address.city, address.state, address.country].filter(Boolean).join(', ')}
                        </a>
                    </div>
                )}

                {/* Social Networks Card */}
                {socialNetworks.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h3
                            className="font-bold uppercase tracking-wide mb-4 flex items-center gap-2"
                            style={{ color: styles.primary_color, fontSize: '0.75rem', letterSpacing: '0.05em' }}
                        >
                            SOCIAL MEDIA
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                            {socialNetworks.map((net: any, idx: number) => {
                                const config = SOCIAL_NETWORK_CONFIG[net.network] || { icon: FaGlobe, color: '#64748b' };
                                const Icon = config.icon;

                                return (
                                    <a
                                        key={idx}
                                        href={net.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="aspect-square rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-all shadow-sm"
                                        style={{ backgroundColor: config.color }}
                                    >
                                        <Icon style={{ width: '1.375rem', height: '1.375rem' }} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Hide scrollbar */}
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Footer Branding */}
            <div
                className="pb-6 text-center"
                style={{ backgroundColor: styles.secondary_color || '#F1F5F9' }}
            >
                <p className="text-xs text-slate-600">
                    Powered by <span className="font-semibold">QR Studio</span>
                </p>
            </div>
        </div>
    );
}
