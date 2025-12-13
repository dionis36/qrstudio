import { useWizardStore } from '../store';
import { User, Share2, ChevronRight } from 'lucide-react';
import {
    FaInstagram, FaFacebook, FaYoutube, FaTiktok, FaLinkedin,
    FaXTwitter, FaWhatsapp, FaTelegram, FaSnapchat, FaPinterest,
    FaGithub, FaBehance, FaDribbble, FaMedium, FaTwitch,
    FaReddit, FaSpotify, FaDiscord, FaThreads, FaGlobe
} from 'react-icons/fa6';

export function SocialMediaPagePreview() {
    const { payload } = useWizardStore();

    const displayName = payload.display_name || 'Your Name';
    const bio = payload.bio || '';
    const profilePhoto = payload.profile_photo || '';
    const title = payload.title || '';
    const tagline = payload.tagline || '';
    const galleryImages = (payload.gallery_images || []).filter((img: string) => img);
    const socialLinks = payload.social_links || [];
    const styles = payload.styles || {};

    // Get user's colors
    const primaryColor = styles.primary_color || '#A855F7';
    const secondaryColor = styles.secondary_color || '#FDF4FF';
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

    // Generate background style for gradient section
    const getBackgroundStyle = () => {
        if (gradientType === 'linear') {
            return {
                background: `linear-gradient(${gradientAngle}deg, ${primaryColor}, ${secondaryColor})`
            };
        } else if (gradientType === 'radial') {
            return {
                background: `radial-gradient(circle at top, ${primaryColor}, ${secondaryColor})`
            };
        }
        // Default: solid color with lighter bottom
        return {
            background: `linear-gradient(180deg, ${primaryColor} 0%, ${lightenColor(primaryColor, 30)} 100%)`
        };
    };

    // Social Platform configurations
    const SOCIAL_PLATFORMS = {
        instagram: { name: 'Instagram', icon: FaInstagram, color: '#E4405F' },
        facebook: { name: 'Facebook', icon: FaFacebook, color: '#1877F2' },
        youtube: { name: 'YouTube', icon: FaYoutube, color: '#FF0000' },
        tiktok: { name: 'TikTok', icon: FaTiktok, color: '#000000' },
        linkedin: { name: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2' },
        twitter: { name: 'X (Twitter)', icon: FaXTwitter, color: '#000000' },
        whatsapp: { name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366' },
        telegram: { name: 'Telegram', icon: FaTelegram, color: '#26A5E4' },
        snapchat: { name: 'Snapchat', icon: FaSnapchat, color: '#FFFC00' },
        pinterest: { name: 'Pinterest', icon: FaPinterest, color: '#BD081C' },
        github: { name: 'GitHub', icon: FaGithub, color: '#181717' },
        behance: { name: 'Behance', icon: FaBehance, color: '#1769FF' },
        dribbble: { name: 'Dribbble', icon: FaDribbble, color: '#EA4C89' },
        medium: { name: 'Medium', icon: FaMedium, color: '#000000' },
        twitch: { name: 'Twitch', icon: FaTwitch, color: '#9146FF' },
        reddit: { name: 'Reddit', icon: FaReddit, color: '#FF4500' },
        spotify: { name: 'Spotify', icon: FaSpotify, color: '#1DB954' },
        discord: { name: 'Discord', icon: FaDiscord, color: '#5865F2' },
        threads: { name: 'Threads', icon: FaThreads, color: '#000000' },
        website: { name: 'Website', icon: FaGlobe, color: '#2563EB' },
    };

    return (
        <div className="h-full w-full overflow-y-auto bg-slate-50" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Gradient Background Section */}
            <div
                className="relative pb-32"
                style={getBackgroundStyle()}
            >
                {/* Profile Section */}
                <div className="flex flex-col items-center pt-24 px-6">
                    {/* Profile Photo - Larger, cleaner */}
                    {profilePhoto ? (
                        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg mb-4 ring-4 ring-white">
                            <img src={profilePhoto} alt={displayName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg mb-4 ring-4 ring-white bg-white/20 backdrop-blur-sm"
                        >
                            <User className="w-10 h-10 text-white" />
                        </div>
                    )}

                    {/* Display Name */}
                    <h1 className="text-2xl font-bold text-white mb-1">
                        {displayName}
                    </h1>

                    {/* Bio */}
                    {bio && (
                        <p className="text-sm text-white/90 text-center max-w-xs leading-relaxed mb-6">
                            {bio}
                        </p>
                    )}
                </div>

                {/* Image Carousel - Only show if images exist */}
                {galleryImages.length > 0 && (
                    <div className="px-6 mt-4">
                        <div className="flex gap-3 overflow-x-auto pb-2"
                            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}>
                            {galleryImages.map((image: string, index: number) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 w-32 h-40 rounded-2xl overflow-hidden shadow-lg border-4 border-white/30 backdrop-blur-sm"
                                >
                                    <img
                                        src={image}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* White Content Area with Rounded Top */}
            <div className="bg-white -mt-24 rounded-t-3xl relative z-10">
                {/* Title & Tagline Section */}
                {(title || tagline) && (
                    <div className="px-6 pt-8 pb-6 text-center">
                        {title && (
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">
                                {title}
                            </h2>
                        )}
                        {tagline && (
                            <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                                {tagline}
                            </p>
                        )}
                    </div>
                )}

                {/* Social Links - Enhanced Cards */}
                <div className="space-y-3 px-6 pb-8">
                    {socialLinks.length > 0 ? (
                        socialLinks.map((link, index) => {
                            const platform = SOCIAL_PLATFORMS[link.platform as keyof typeof SOCIAL_PLATFORMS];
                            if (!platform) return null;

                            const Icon = platform.icon;
                            const displayText = link.platform === 'website' && link.custom_label
                                ? link.custom_label
                                : platform.name;

                            return (
                                <div
                                    key={index}
                                    className="bg-slate-50 rounded-2xl px-5 py-4 flex items-center gap-4 border border-slate-100 hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                                >
                                    {/* Large Icon Circle with Brand Color */}
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                                        style={{ backgroundColor: platform.color }}
                                    >
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Platform Info */}
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-900 text-base">
                                            {displayText}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Social Account
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </div>
                            );
                        })
                    ) : (
                        /* Empty State */
                        <div className="text-center py-12">
                            <div
                                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                style={{ backgroundColor: `${primaryColor}10` }}
                            >
                                <Share2 className="w-8 h-8" style={{ color: primaryColor }} />
                            </div>
                            <p className="text-slate-400 text-sm">
                                Add social media links to see them here
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
