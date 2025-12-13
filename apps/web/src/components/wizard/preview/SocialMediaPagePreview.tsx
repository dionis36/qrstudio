import { useWizardStore } from '../store';
import { User } from 'lucide-react';
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
    const socialLinks = payload.social_links || [];
    const styles = payload.styles || {};

    // Get user's colors
    const primaryColor = styles.primary_color || '#A855F7';
    const secondaryColor = styles.secondary_color || '#FDF4FF';
    const gradientType = styles.gradient_type || 'none';
    const gradientAngle = styles.gradient_angle || 135;

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
        // Default gradient
        const darkPrimary = darkenColor(primaryColor, 15);
        return {
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${darkPrimary} 100%)`
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

            {/* Gradient Header */}
            <div
                className="relative px-7 pt-16 pb-20 text-white"
                style={getBackgroundStyle()}
            >
                {/* Profile Photo */}
                <div className="flex justify-center mb-4">
                    {profilePhoto ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-white/30 backdrop-blur-sm">
                            <img src={profilePhoto} alt={displayName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                            <User className="w-8 h-8" />
                        </div>
                    )}
                </div>

                {/* Display Name */}
                <h1 className="text-xl font-bold text-center mb-2 leading-tight px-4">
                    {displayName}
                </h1>

                {/* Bio */}
                {bio && (
                    <p className="text-center text-white/90 text-sm px-4">
                        {bio}
                    </p>
                )}
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

            {/* Content Area - Social Links */}
            <div className="px-4 pb-6 space-y-3 -mt-4">
                {socialLinks.length > 0 ? (
                    socialLinks.map((link, index) => {
                        const platform = SOCIAL_PLATFORMS[link.platform as keyof typeof SOCIAL_PLATFORMS];
                        if (!platform) return null;

                        const Icon = platform.icon;
                        const displayText = link.platform === 'website' && link.custom_label
                            ? link.custom_label
                            : platform.name;

                        return (
                            <button
                                key={index}
                                className="w-full py-4 px-5 rounded-2xl flex items-center justify-center gap-3 text-white font-semibold shadow-sm hover:scale-[1.02] transition-transform"
                                style={{ backgroundColor: platform.color }}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{displayText}</span>
                            </button>
                        );
                    })
                ) : (
                    <div className="text-center py-12">
                        <p className="text-slate-400 text-sm italic">
                            Add social media links to see them here
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
