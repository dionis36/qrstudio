import { useForm, useFieldArray, Control, useWatch } from 'react-hook-form';
import { useWizardStore } from '../store';
import { useEffect, useState, useRef } from 'react';
import { ChevronDown, Palette, Info, Image, Plus, Trash2, User, Share2, Phone, Mail, Globe, Briefcase, MapPin, AlignLeft, ChevronRight } from 'lucide-react';
import { ImageUpload } from '@/components/common/ImageUpload';

// Form Value Types
type FormValues = {
    // Design & Customize
    styles: {
        primary_color: string;
        secondary_color?: string;
    };

    // About You - Personal Info
    personal_info: {
        first_name: string;
        last_name: string;
        avatar_image?: string;
    };

    // About You - Contact Details
    contact_details: {
        phone: string; // Mandatory (*)
        alternative_phone?: string;
        email?: string;
        website?: string;
    };

    // About You - Company Details
    company_details: {
        company_name?: string;
        job_title?: string;
    };

    // About You - Summary
    summary?: string;

    // About You - Address
    address: {
        street?: string;
        city?: string;
        postal_code?: string;
        country?: string;
        state?: string;
    };

    // Social Networks
    social_networks: {
        network: string;
        url: string;
    }[];

    // Welcome Screen
    welcome_screen?: {
        logo?: string;
        animation?: 'spinner' | 'fade' | 'pulse';
        background_color?: string;
    };
};

import {
    FaLinkedin, FaFacebook, FaXTwitter, FaInstagram, FaYoutube, FaTiktok, FaPinterest, FaMastodon,
    FaGithub, FaBehance, FaDribbble, FaMedium, FaTwitch, FaFlickr,
    FaGlobe, FaTelegram, FaWhatsapp, FaReddit, FaSpotify, FaSkype
} from 'react-icons/fa6';

const SOCIAL_NETWORKS_LIST = [
    // Professional & Mainstream
    { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2' },
    { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: '#1877F2' },
    { id: 'twitter', name: 'X (Twitter)', icon: FaXTwitter, color: '#000000' },
    { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: '#E4405F' },
    { id: 'youtube', name: 'YouTube', icon: FaYoutube, color: '#FF0000' },
    { id: 'tiktok', name: 'TikTok', icon: FaTiktok, color: '#000000' },
    { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, color: '#BD081C' },
    { id: 'mastodon', name: 'Mastodon', icon: FaMastodon, color: '#6364FF' },

    // Developer & Creative
    { id: 'github', name: 'GitHub', icon: FaGithub, color: '#181717' },
    { id: 'behance', name: 'Behance', icon: FaBehance, color: '#1769FF' },
    { id: 'dribbble', name: 'Dribbble', icon: FaDribbble, color: '#EA4C89' },
    { id: 'medium', name: 'Medium', icon: FaMedium, color: '#000000' },
    { id: 'twitch', name: 'Twitch', icon: FaTwitch, color: '#9146FF' },
    { id: 'flickr', name: 'Flickr', icon: FaFlickr, color: '#0063DC' },

    // Messaging & Generic
    { id: 'website', name: 'Website', icon: FaGlobe, color: '#2563EB' },
    { id: 'telegram', name: 'Telegram', icon: FaTelegram, color: '#26A5E4' },
    { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366' },
    { id: 'reddit', name: 'Reddit', icon: FaReddit, color: '#FF4500' },
    { id: 'spotify', name: 'Spotify', icon: FaSpotify, color: '#1DB954' },
    { id: 'skype', name: 'Skype', icon: FaSkype, color: '#00AFF0' },
];

// Main Accordion Component
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

// Sub Accordion Component for nested sections
function SubAccordion({
    title,
    icon: Icon,
    isOpen,
    onToggle,
    children
}: {
    title: string;
    icon?: any;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-100 transition-colors bg-white"
            >
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-slate-500" />}
                    {title}
                </span>
                <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-4 border-t border-slate-200">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function VCardForm() {
    const { payload, updatePayload, editMode } = useWizardStore();

    // Main Sections State
    const [openSections, setOpenSections] = useState({
        design: true,
        about: false,
        social: false,
        welcome: false
    });

    // About Sub-Sections State
    const [openSubSections, setOpenSubSections] = useState({
        personal: true, // Open first by default
        contact: false,
        company: false,
        summary: false,
        address: false
    });

    // Track if we've already loaded edit data
    const hasLoadedEditData = useRef(false);

    const { register, control, watch, setValue, formState: { errors }, reset } = useForm<FormValues>({
        defaultValues: {
            styles: {
                primary_color: payload.styles?.primary_color || '#2563EB',
                secondary_color: payload.styles?.secondary_color || '#EFF6FF'
            },
            personal_info: payload.personal_info || { first_name: '', last_name: '', avatar_image: '' },
            contact_details: payload.contact_details || { phone: '', alternative_phone: '', email: '', website: '' },
            company_details: payload.company_details || { company_name: '', job_title: '' },
            summary: payload.summary || '',
            address: payload.address || { street: '', city: '', postal_code: '', country: '', state: '' },
            social_networks: payload.social_networks || [],
            welcome_screen: payload.welcome_screen || { logo: '', animation: 'spinner', background_color: '#ffffff' }
        },
        mode: 'onChange'
    });

    const { fields: socialFields, append: addSocial, remove: removeSocial } = useFieldArray({
        control,
        name: "social_networks"
    });

    // Reset form ONCE when entering edit mode with loaded data
    useEffect(() => {
        if (editMode && !hasLoadedEditData.current && payload.contact_details?.phone) {
            // Only reset if we have actual data (not just defaults)
            hasLoadedEditData.current = true;
            reset({
                styles: {
                    primary_color: payload.styles?.primary_color || '#2563EB',
                    secondary_color: payload.styles?.secondary_color || '#EFF6FF'
                },
                personal_info: payload.personal_info || { first_name: '', last_name: '', avatar_image: '' },
                contact_details: payload.contact_details || { phone: '', alternative_phone: '', email: '', website: '' },
                company_details: payload.company_details || { company_name: '', job_title: '' },
                summary: payload.summary || '',
                address: payload.address || { street: '', city: '', postal_code: '', country: '', state: '' },
                social_networks: payload.social_networks || [],
                welcome_screen: payload.welcome_screen || { logo: '', animation: 'spinner', background_color: '#ffffff' }
            });
        }
        // Reset the flag when leaving edit mode
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

    const toggleSubSection = (section: keyof typeof openSubSections) => {
        setOpenSubSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Heading Section */}
            <div>
                <h3 className="text-2xl font-bold text-slate-900">Enter your contact details</h3>
                <p className="text-slate-500 mt-1">Share your contact info, social links, and more with a digital business card.</p>
            </div>

            <div className="space-y-4">
                {/* 1. Design and Customize Section */}
                <AccordionSection
                    title="Design and customize"
                    subtitle="Choose your color scheme"
                    icon={Palette}
                    color="bg-purple-100 text-purple-600"
                    isOpen={openSections.design}
                    onToggle={() => toggleSection('design')}
                >
                    <div className="space-y-6 mt-4">
                        {/* Color Palette Presets */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {[
                                { primary: '#2563EB', secondary: '#EFF6FF', name: 'Classic Blue' },
                                { primary: '#1F2937', secondary: '#F3F4F6', name: 'Elegant Black' },
                                { primary: '#059669', secondary: '#ECFDF5', name: 'Fresh Green' },
                                { primary: '#DC2626', secondary: '#FEF2F2', name: 'Bold Red' },
                                { primary: '#7C3AED', secondary: '#FAF5FF', name: 'Royal Purple' },
                                { primary: '#EA580C', secondary: '#FFF7ED', name: 'Warm Orange' },
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
                                        {...register('styles.primary_color')}
                                        type="text"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                        placeholder="#2563EB"
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
                                        {...register('styles.secondary_color')}
                                        type="text"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                        placeholder="#EFF6FF"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionSection>

                {/* 2. About You Section */}
                <AccordionSection
                    title="About you"
                    subtitle="Personal, company and contact info"
                    icon={User}
                    color="bg-blue-100 text-blue-600"
                    isOpen={openSections.about}
                    onToggle={() => toggleSection('about')}
                >
                    <div className="space-y-3 mt-2">

                        {/* 2.1 Personal Info */}
                        <SubAccordion
                            title="Personal Information"
                            icon={User}
                            isOpen={openSubSections.personal}
                            onToggle={() => toggleSubSection('personal')}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <ImageUpload
                                        label="Profile Image"
                                        value={watch('personal_info.avatar_image')}
                                        onChange={(base64) => setValue('personal_info.avatar_image', base64 || '')}
                                        maxSizeMB={2}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                                        <input
                                            {...register('personal_info.first_name')}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                                        <input
                                            {...register('personal_info.last_name')}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                            </div>
                        </SubAccordion>

                        {/* 2.2 Contact Details */}
                        <SubAccordion
                            title="Contact Details"
                            icon={Phone}
                            isOpen={openSubSections.contact}
                            onToggle={() => toggleSubSection('contact')}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number *</label>
                                    <input
                                        {...register('contact_details.phone', { required: 'Mobile number is required' })}
                                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.contact_details?.phone ? 'border-red-300' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                    {errors.contact_details?.phone && <span className="text-xs text-red-500 mt-1">{errors.contact_details.phone.message}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Alternative Phone</label>
                                    <input
                                        {...register('contact_details.alternative_phone')}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                                    <input
                                        {...register('contact_details.email')}
                                        type="email"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Website</label>
                                    <input
                                        {...register('contact_details.website')}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="www.example.com"
                                    />
                                </div>
                            </div>
                        </SubAccordion>

                        {/* 2.3 Company Details */}
                        <SubAccordion
                            title="Company Information"
                            icon={Briefcase}
                            isOpen={openSubSections.company}
                            onToggle={() => toggleSubSection('company')}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
                                    <input
                                        {...register('company_details.company_name')}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Acme Corp"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Job Title</label>
                                    <input
                                        {...register('company_details.job_title')}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Product Manager"
                                    />
                                </div>
                            </div>
                        </SubAccordion>

                        {/* 2.4 Summary */}
                        <SubAccordion
                            title="Summary"
                            icon={AlignLeft}
                            isOpen={openSubSections.summary}
                            onToggle={() => toggleSubSection('summary')}
                        >
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">About Company / Profile</label>
                                <textarea
                                    {...register('summary')}
                                    rows={4}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="Write a short summary about yourself or your company..."
                                />
                            </div>
                        </SubAccordion>

                        {/* 2.5 Address */}
                        <SubAccordion
                            title="Address"
                            icon={MapPin}
                            isOpen={openSubSections.address}
                            onToggle={() => toggleSubSection('address')}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Street Address</label>
                                    <input
                                        {...register('address.street')}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="123 Main St"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">City</label>
                                    <input
                                        {...register('address.city')}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="New York"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">State / Province</label>
                                    <input
                                        {...register('address.state')}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="NY"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Postal Code</label>
                                    <input
                                        {...register('address.postal_code')}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="10001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Country</label>
                                    <input
                                        {...register('address.country')}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="USA"
                                    />
                                </div>
                            </div>
                        </SubAccordion>

                    </div>
                </AccordionSection>

                {/* 3. Social Networks Section */}
                <AccordionSection
                    title="Social networks"
                    subtitle="Add your social media profiles"
                    icon={Share2}
                    color="bg-emerald-100 text-emerald-600"
                    isOpen={openSections.social}
                    onToggle={() => toggleSection('social')}
                >
                    <div className="mt-4 space-y-6">
                        {/* Selector Icons */}
                        <div>
                            <p className="text-sm font-semibold text-slate-700 mb-3">Click to add specific network:</p>
                            <div className="flex flex-wrap gap-3">
                                {SOCIAL_NETWORKS_LIST.map(net => (
                                    <button
                                        key={net.id}
                                        type="button"
                                        onClick={() => addSocial({ network: net.id, url: '' })}
                                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50 transition-all w-20 h-20 shadow-sm group"
                                    >
                                        <net.icon className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color: net.color }} />
                                        <span className="capitalize text-[10px] font-medium text-slate-600 mt-2 text-center leading-tight">{net.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Active Networks Inputs */}
                        <div className="space-y-3">
                            {socialFields.length > 0 && <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Active Networks</h4>}
                            {socialFields.map((field, index) => {
                                const networkId = watch(`social_networks.${index}.network`);
                                const networkConfig = SOCIAL_NETWORKS_LIST.find(n => n.id === networkId);
                                const Icon = networkConfig?.icon || FaGlobe;
                                const brandColor = networkConfig?.color || '#64748b';

                                return (
                                    <div key={field.id} className="flex gap-3 items-center animate-in slide-in-from-left-2 duration-300">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-sm"
                                            style={{ backgroundColor: brandColor }}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-slate-400 text-sm capitalize font-medium">
                                                    {networkConfig?.name || networkId}:
                                                </span>
                                                <input
                                                    {...register(`social_networks.${index}.url` as const)}
                                                    className="w-full pl-[100px] pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow"
                                                    placeholder="https://..."
                                                    style={{ paddingLeft: `${(networkConfig?.name?.length || 8) * 9 + 20}px` }}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeSocial(index)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                );
                            })}
                            {socialFields.length === 0 && (
                                <p className="text-sm text-slate-400 italic text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                    No social networks added yet. Click an icon above to start.
                                </p>
                            )}
                        </div>
                    </div>
                </AccordionSection>

                {/* 4. Welcome Screen Section */}
                <AccordionSection
                    title="Welcome screen"
                    subtitle="Display a custom logo while your page is loading"
                    icon={Image}
                    color="bg-orange-100 text-orange-600"
                    isOpen={openSections.welcome}
                    onToggle={() => toggleSection('welcome')}
                >
                    <div className="grid grid-cols-2 gap-6 mt-4">
                        <ImageUpload
                            label="Welcome Screen Logo"
                            value={watch('welcome_screen.logo')}
                            onChange={(base64) => setValue('welcome_screen.logo', base64 || '')}
                            maxSizeMB={1}
                        />

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Loading Animation</label>
                                <select
                                    {...register('welcome_screen.animation')}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="spinner">Spinner</option>
                                    <option value="fade">Fade</option>
                                    <option value="pulse">Pulse</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Background Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        {...register('welcome_screen.background_color')}
                                        type="color"
                                        className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                                    />
                                    <input
                                        {...register('welcome_screen.background_color')}
                                        type="text"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                        placeholder="#ffffff"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
}
