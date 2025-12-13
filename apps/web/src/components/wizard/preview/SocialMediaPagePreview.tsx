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
    const socialLinks = payload.social_links || [];
    const styles = payload.styles || {};

    // Get user's colors
    const primaryColor = styles.primary_color || '#A855F7';
    const secondaryColor = styles.secondary_color || '#FDF4FF';

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

            {/* Thin Accent Strip */}
            <div
                className="h-2"
                style={{ backgroundColor: primaryColor }}
            />

            {/* Main Content */}
            <div className="px-6 py-8">
                {/* Profile Section */}
                <div className="flex flex-col items-center mb-8">
                    {/* Profile Photo - Larger, cleaner */}
                    {profilePhoto ? (
                        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg mb-4 ring-4 ring-white">
                            <img src={profilePhoto} alt={displayName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg mb-4 ring-4 ring-white"
                            style={{ backgroundColor: `${primaryColor}20` }}
                        >
                            <User className="w-10 h-10" style={{ color: primaryColor }} />
                        </div>
                    )}

                    {/* Display Name - Larger, bolder */}
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">
                        {displayName}
                    </h1>

                    {/* Bio - Subtle */}
                    {bio && (
                        <p className="text-sm text-slate-600 text-center max-w-xs leading-relaxed">
                            {bio}
                        </p>
                    )}
                </div>

                {/* Social Links - Minimal Cards */}
                <div className="space-y-3 max-w-sm mx-auto">
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
                                    className="bg-white rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm border border-slate-100 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                                >
                                    {/* Icon with brand color background */}
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: `${platform.color}15` }}
                                    >
                                        <Icon className="w-6 h-6" style={{ color: platform.color }} />
                                    </div>

                                    {/* Platform Name */}
                                    <span className="font-semibold text-slate-800 flex-1">
                                        {displayText}
                                    </span>

                                    {/* Arrow indicator */}
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
