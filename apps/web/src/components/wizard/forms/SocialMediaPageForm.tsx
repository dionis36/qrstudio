import { useForm, useFieldArray } from 'react-hook-form';
import { useWizardStore } from '../store';
import { useEffect, useState, useRef } from 'react';
import { ChevronDown, User, Share2, Palette, Trash2 } from 'lucide-react';
import { ImageUpload } from '@/components/common/ImageUpload';
import {
    FaInstagram, FaFacebook, FaYoutube, FaTiktok, FaLinkedin,
    FaXTwitter, FaWhatsapp, FaTelegram, FaSnapchat, FaPinterest,
    FaGithub, FaBehance, FaDribbble, FaMedium, FaTwitch,
    FaReddit, FaSpotify, FaDiscord, FaThreads, FaGlobe
} from 'react-icons/fa6';

// Form Value Types
type FormValues = {
    // Design & Customize
    styles: {
        primary_color: string;
        secondary_color?: string;
        gradient_type?: 'none' | 'linear' | 'radial';
        gradient_angle?: number;
    };

    // Profile Details
    profile_photo?: string;
    display_name: string;
    bio?: string;
    title?: string;              // NEW: Page title/headline
    tagline?: string;            // NEW: Longer description
    gallery_images?: string[];   // NEW: Up to 5 images

    // Social Links
    social_links: {
        platform: string;
        url: string;
        custom_label?: string;
    }[];
};

// Social Platform configurations
const SOCIAL_PLATFORMS = [
    // Tier 1: Essential
    { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: '#E4405F' },
    { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: '#1877F2' },
    { id: 'youtube', name: 'YouTube', icon: FaYoutube, color: '#FF0000' },
    { id: 'tiktok', name: 'TikTok', icon: FaTiktok, color: '#000000' },
    { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2' },
    { id: 'twitter', name: 'X (Twitter)', icon: FaXTwitter, color: '#000000' },
    { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366' },
    { id: 'telegram', name: 'Telegram', icon: FaTelegram, color: '#26A5E4' },
    { id: 'snapchat', name: 'Snapchat', icon: FaSnapchat, color: '#FFFC00' },
    { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, color: '#BD081C' },

    // Tier 2: Creative & Professional
    { id: 'github', name: 'GitHub', icon: FaGithub, color: '#181717' },
    { id: 'behance', name: 'Behance', icon: FaBehance, color: '#1769FF' },
    { id: 'dribbble', name: 'Dribbble', icon: FaDribbble, color: '#EA4C89' },
    { id: 'medium', name: 'Medium', icon: FaMedium, color: '#000000' },
    { id: 'twitch', name: 'Twitch', icon: FaTwitch, color: '#9146FF' },

    // Tier 3: Additional
    { id: 'reddit', name: 'Reddit', icon: FaReddit, color: '#FF4500' },
    { id: 'spotify', name: 'Spotify', icon: FaSpotify, color: '#1DB954' },
    { id: 'discord', name: 'Discord', icon: FaDiscord, color: '#5865F2' },
    { id: 'threads', name: 'Threads', icon: FaThreads, color: '#000000' },
    { id: 'website', name: 'Website', icon: FaGlobe, color: '#2563EB' },
];

// Accordion Component
function AccordionSection({
    title,
    subtitle,
    icon: Icon,
    color,
    isOpen,
    onToggle,
    children
}: {
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-base font-bold text-slate-900">{title}</h3>
                        <p className="text-sm text-slate-500">{subtitle}</p>
                    </div>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function SocialMediaPageForm() {
    const { payload, updatePayload, editMode } = useWizardStore();

    // Main Sections State
    const [openSections, setOpenSections] = useState({
        design: true,
        profile: false,
        links: false
    });

    // Track if we've already loaded edit data
    const hasLoadedEditData = useRef(false);

    const { register, watch, setValue, control, formState: { errors }, reset } = useForm<FormValues>({
        defaultValues: {
            styles: {
                primary_color: payload.styles?.primary_color || '#A855F7',
                secondary_color: payload.styles?.secondary_color || '#FDF4FF',
                gradient_type: payload.styles?.gradient_type || 'none',
                gradient_angle: payload.styles?.gradient_angle || 135
            },
            profile_photo: payload.profile_photo || '',
            display_name: payload.display_name || '',
            bio: payload.bio || '',
            title: payload.title || '',
            tagline: payload.tagline || '',
            gallery_images: payload.gallery_images || [],
            social_links: payload.social_links || []
        },
        mode: 'onChange'
    });

    // Field array for social links
    const { fields: linkFields, append: addLink, remove: removeLink } = useFieldArray({
        control,
        name: 'social_links'
    });

    // Reset form ONCE when entering edit mode with loaded data
    useEffect(() => {
        if (editMode && !hasLoadedEditData.current && payload.display_name) {
            hasLoadedEditData.current = true;
            reset({
                styles: payload.styles || { primary_color: '#A855F7', secondary_color: '#FDF4FF' },
                profile_photo: payload.profile_photo,
                display_name: payload.display_name,
                bio: payload.bio,
                title: payload.title,
                tagline: payload.tagline,
                gallery_images: payload.gallery_images || [],
                social_links: payload.social_links || []
            });
        }
        if (!editMode) {
            hasLoadedEditData.current = false;
        }
    }, [editMode, payload, reset]);

    // Watch for changes and update global store
    useEffect(() => {
        const subscription = watch((value) => {
            updatePayload(value as any);
        });
        return () => subscription.unsubscribe();
    }, [watch, updatePayload]);

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Heading Section */}
            <div>
                <h3 className="text-2xl font-bold text-slate-900">Create your social media page</h3>
                <p className="text-slate-500 mt-1">Build a landing page with all your social media links in one place.</p>
            </div>

            <div className="space-y-4">
                {/* 1. Design & Customize Section */}
                <AccordionSection
                    title="Design and customize"
                    subtitle="Choose your color scheme"
                    icon={Palette}
                    color="bg-purple-100 text-purple-600"
                    isOpen={openSections.design}
                    onToggle={() => toggleSection('design')}
                >
                    <div className="space-y-6 mt-4 min-w-0">
                        {/* Color Palette Presets */}
                        <div className='w-full max-w-full overflow-hidden min-w-0'>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Color Presets</label>
                            <div className="flex gap-2 overflow-x-auto pb-2 max-w-full" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
                                {[
                                    { primary: '#A855F7', secondary: '#FDF4FF', name: 'Purple Glow' },
                                    { primary: '#EC4899', secondary: '#FCE7F3', name: 'Hot Pink' },
                                    { primary: '#F59E0B', secondary: '#FEF3C7', name: 'Warm Amber' },
                                    { primary: '#2563EB', secondary: '#EFF6FF', name: 'Classic Blue' },
                                    { primary: '#059669', secondary: '#ECFDF5', name: 'Fresh Green' },
                                    { primary: '#DC2626', secondary: '#FEF2F2', name: 'Bold Red' },
                                    { primary: '#7C3AED', secondary: '#FAF5FF', name: 'Royal Purple' },
                                    { primary: '#0891B2', secondary: '#F0FDFA', name: 'Ocean Teal' },
                                    { primary: '#1F2937', secondary: '#F3F4F6', name: 'Elegant Black' },
                                ].map((palette, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            setValue('styles.primary_color', palette.primary);
                                            setValue('styles.secondary_color', palette.secondary);
                                        }}
                                        className="h-10 w-16 flex-shrink-0 rounded-lg border-2 border-slate-200 hover:border-blue-400 transition-all hover:scale-105 shadow-sm overflow-hidden"
                                        style={{ background: `linear-gradient(to right, ${palette.primary} 50%, ${palette.secondary} 50%)` }}
                                        title={palette.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Custom Colors */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Primary color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        {...register('styles.primary_color')}
                                        type="color"
                                        className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                                    />
                                    <input
                                        value={watch('styles.primary_color') || '#A855F7'}
                                        onChange={(e) => setValue('styles.primary_color', e.target.value)}
                                        type="text"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase"
                                        placeholder="#A855F7"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Secondary color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        {...register('styles.secondary_color')}
                                        type="color"
                                        className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                                    />
                                    <input
                                        value={watch('styles.secondary_color') || '#FDF4FF'}
                                        onChange={(e) => setValue('styles.secondary_color', e.target.value)}
                                        type="text"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase"
                                        placeholder="#FDF4FF"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Gradient Controls */}
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Background Style</label>
                                <select
                                    {...register('styles.gradient_type')}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="none">Solid Color</option>
                                    <option value="linear">Linear Gradient</option>
                                    <option value="radial">Radial Gradient</option>
                                </select>
                            </div>

                            {watch('styles.gradient_type') === 'linear' && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Gradient Angle: {watch('styles.gradient_angle') || 135}°
                                    </label>
                                    <input
                                        {...register('styles.gradient_angle')}
                                        type="range"
                                        min="0"
                                        max="360"
                                        step="45"
                                        defaultValue="135"
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                                        <span>0°</span>
                                        <span>90°</span>
                                        <span>180°</span>
                                        <span>270°</span>
                                        <span>360°</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </AccordionSection>

                {/* 2. Profile Details Section */}
                <AccordionSection
                    title="Profile details"
                    subtitle="Add your photo, name, and bio"
                    icon={User}
                    color="bg-indigo-100 text-indigo-600"
                    isOpen={openSections.profile}
                    onToggle={() => toggleSection('profile')}
                >
                    <div className="space-y-6 mt-4">
                        {/* Row 1: Profile Photo + Name & Bio */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Left: Profile Photo Upload */}
                            <div>
                                <ImageUpload
                                    label="Profile Photo"
                                    value={watch('profile_photo')}
                                    onChange={(base64) => setValue('profile_photo', base64 || '')}
                                    maxSizeMB={1}
                                />
                            </div>

                            {/* Right: Name & Bio */}
                            <div className="space-y-4">
                                {/* Display Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Display Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register('display_name', {
                                            required: 'Display name is required',
                                            minLength: { value: 1, message: 'Display name is required' },
                                            maxLength: { value: 50, message: 'Display name must be 50 characters or less' }
                                        })}
                                        type="text"
                                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.display_name ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                        placeholder="John Doe"
                                    />
                                    {errors.display_name && <span className="text-xs text-red-500 mt-1">{errors.display_name.message}</span>}
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        {...register('bio', {
                                            maxLength: { value: 150, message: 'Bio must be 150 characters or less' }
                                        })}
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                        placeholder="Content Creator | Tech Enthusiast"
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        {errors.bio && <span className="text-xs text-red-500">{errors.bio.message}</span>}
                                        <span className="text-xs text-slate-400 ml-auto">{watch('bio')?.length || 0}/150</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Title */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Title/Headline (Optional)
                            </label>
                            <input
                                {...register('title', {
                                    maxLength: { value: 30, message: 'Title must be 30 characters or less' }
                                })}
                                type="text"
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="My Works"
                            />
                            <span className="text-xs text-slate-400">{watch('title')?.length || 0}/30</span>
                        </div>

                        {/* Row 3: Tagline */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Tagline (Optional)
                            </label>
                            <textarea
                                {...register('tagline', {
                                    maxLength: { value: 100, message: 'Tagline must be 100 characters or less' }
                                })}
                                rows={2}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Hi, I'm a photographer and I want to share my work with you..."
                            />
                            <span className="text-xs text-slate-400">{watch('tagline')?.length || 0}/100</span>
                        </div>

                        {/* Row 4: Gallery Images */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Gallery Images (Optional)
                                <span className="text-slate-400 text-xs ml-2">Up to 5 images</span>
                            </label>


                            {/* Upload Area - Only show if less than 5 images */}
                            {(watch('gallery_images')?.filter((img: string) => img).length || 0) < 5 && (
                                <ImageUpload
                                    label=""
                                    value=""
                                    onChange={(base64) => {
                                        if (base64) {
                                            const currentImages = watch('gallery_images') || [];
                                            if (currentImages.length < 5) {
                                                setValue('gallery_images', [...currentImages, base64]);
                                            }
                                        }
                                    }}
                                    maxSizeMB={1}
                                />
                            )}


                            {/* Uploaded Images Thumbnails */}
                            {watch('gallery_images')?.filter((img: string) => img).length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold text-slate-700 mb-2">
                                        Uploaded Images ({watch('gallery_images')?.filter((img: string) => img).length}/5)
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {watch('gallery_images')?.map((image: string, index: number) => {
                                            if (!image) return null;
                                            return (
                                                <div key={index} className="relative group">
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-slate-200">
                                                        <img
                                                            src={image}
                                                            alt={`Gallery ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    {/* Remove Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const currentImages = watch('gallery_images') || [];
                                                            const newImages = currentImages.filter((_: string, i: number) => i !== index);
                                                            setValue('gallery_images', newImages);
                                                        }}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                                        title="Remove image"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <p className="text-xs text-slate-500 mt-2">
                                Showcase your work, products, or photos
                            </p>
                        </div>
                    </div>
                </AccordionSection>

                {/* 3. Social Media Links Section */}
                <AccordionSection
                    title="Social media links"
                    subtitle="Add links to your social profiles"
                    icon={Share2}
                    color="bg-pink-100 text-pink-600"
                    isOpen={openSections.links}
                    onToggle={() => toggleSection('links')}
                >
                    <div className="mt-4 space-y-6">
                        {/* Platform Icon Selector */}
                        <div>
                            <p className="text-sm font-semibold text-slate-700 mb-3">Click to add platform:</p>
                            <div className="flex flex-wrap gap-3">
                                {SOCIAL_PLATFORMS.map(platform => (
                                    <button
                                        key={platform.id}
                                        type="button"
                                        onClick={() => addLink({ platform: platform.id, url: '', custom_label: '' })}
                                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50 transition-all w-20 h-20 shadow-sm group"
                                    >
                                        <platform.icon className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color: platform.color }} />
                                        <span className="capitalize text-[10px] font-medium text-slate-600 mt-2 text-center leading-tight">{platform.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Active Links List */}
                        <div className="space-y-3">
                            {linkFields.length > 0 && <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Active Links</h4>}
                            {linkFields.map((field, index) => {
                                const platformId = watch(`social_links.${index}.platform`);
                                const platformConfig = SOCIAL_PLATFORMS.find(p => p.id === platformId);
                                const Icon = platformConfig?.icon || FaGlobe;
                                const brandColor = platformConfig?.color || '#64748b';

                                return (
                                    <div key={field.id} className="flex gap-3 items-start animate-in slide-in-from-left-2 duration-300">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-sm mt-1"
                                            style={{ backgroundColor: brandColor }}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-slate-400 text-sm capitalize font-medium">
                                                    {platformConfig?.name || platformId}:
                                                </span>
                                                <input
                                                    {...register(`social_links.${index}.url` as const, {
                                                        required: 'URL is required',
                                                        pattern: {
                                                            value: /^https?:\/\/.+/,
                                                            message: 'Please enter a valid URL'
                                                        }
                                                    })}
                                                    className="w-full pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow"
                                                    placeholder="https://..."
                                                    style={{ paddingLeft: `${(platformConfig?.name?.length || 8) * 9 + 20}px` }}
                                                />
                                            </div>
                                            {errors.social_links?.[index]?.url && (
                                                <span className="text-xs text-red-500">{errors.social_links[index]?.url?.message}</span>
                                            )}
                                            {/* Custom Label for Website */}
                                            {platformId === 'website' && (
                                                <input
                                                    {...register(`social_links.${index}.custom_label` as const)}
                                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                    placeholder="Custom button text (optional)"
                                                />
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeLink(index)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                );
                            })}
                            {linkFields.length === 0 && (
                                <p className="text-sm text-slate-400 italic text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                    No links added yet. Click a platform icon above to start.
                                </p>
                            )}
                        </div>
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
}
