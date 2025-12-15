'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useWizardStore } from '@/components/wizard/store';
import { LiveQrPreview } from '@/components/wizard/preview/LiveQrPreview';
import { ArrowLeft, Palette, Grid3x3, Frame, Image as ImageIcon, ChevronDown, CheckCircle2, Copy, Check, AlertTriangle } from 'lucide-react';
import { PhoneMockup } from '@/components/common/PhoneMockup';
import { SEO } from '@/components/common/SEO';


// Accordion Section Component (matching MenuForm style)
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
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-slate-50 transition-colors min-h-[60px]"
            >
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`p-3 sm:p-4 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">{title}</h3>
                        <p className="text-xs sm:text-sm text-slate-500">{subtitle}</p>
                    </div>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-100">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function DesignPage({ params }: { params: { template: string } }) {
    const router = useRouter();
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const editId = searchParams.get('edit');

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [qrName, setQrName] = useState('');
    const { type, payload, design, updateDesign, editMode, loadQrData } = useWizardStore();

    const [openSections, setOpenSections] = useState({
        pattern: true,  // Pattern section auto-opened (now first)
        corners: false,
        logo: false
    });

    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    // Load existing QR data if in edit mode (but only if not already loaded)
    useEffect(() => {
        if (editId && !editMode) {
            // Only load if we're not already in edit mode (coming from external link)
            loadExistingQr();
        }
    }, [editId, editMode]);

    // Load QR name from wizard store when in edit mode
    useEffect(() => {
        if (editMode && useWizardStore.getState().qrName) {
            setQrName(useWizardStore.getState().qrName);
        }
    }, [editMode]);

    async function loadExistingQr() {
        try {
            const { qrApi } = await import('@/lib/api-client');
            const response = await qrApi.getById(editId!);
            if (response.success && response.data) {
                loadQrData(response.data);
                setQrName(response.data.name);
            }
        } catch (error) {
            console.error('Failed to load QR code:', error);
            setError('Failed to load QR code for editing');
        }
    }

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Helper function to copy color to clipboard
    const copyColor = (color: string, label: string) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(label);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    // Helper function to calculate contrast ratio for accessibility
    const getContrastRatio = (color1: string, color2: string): number => {
        // Convert hex to RGB and calculate luminance
        const getLuminance = (hex: string) => {
            if (!hex || hex === 'transparent') return 1;
            const rgb = parseInt(hex.slice(1), 16);
            const r = ((rgb >> 16) & 0xff) / 255;
            const g = ((rgb >> 8) & 0xff) / 255;
            const b = ((rgb >> 0) & 0xff) / 255;
            const [rs, gs, bs] = [r, g, b].map(c =>
                c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
            );
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };

        const l1 = getLuminance(color1);
        const l2 = getLuminance(color2);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };


    const handleGenerate = async () => {
        // Validate QR name
        if (!qrName.trim()) {
            setError('Please enter a name for your QR code');
            return;
        }

        setError(null);
        setSuccess(false);
        setIsGenerating(true);

        try {
            // Import API client
            const { qrApi } = await import('@/lib/api-client');


            console.log('=== QR CODE UPDATE DEBUG ===');
            console.log('editMode:', editMode);
            console.log('editId:', editId);
            console.log('qrName:', qrName);
            console.log('payload:', payload);
            console.log('design:', design);

            if (editMode && editId) {
                // Update existing QR code
                console.log('Calling qrApi.update with:', {
                    id: editId,
                    name: qrName,
                    payload,
                    design
                });

                const response = await qrApi.update(editId, {
                    name: qrName,
                    payload: payload,
                    design: design,
                });

                console.log('Update response:', response);

                if (response.success && response.data) {
                    // Show success message
                    setSuccess(true);
                    setError(null);

                    console.log('Update successful! Redirecting...');

                    // Wait a moment to show success, then redirect with cache refresh
                    setTimeout(() => {
                        // Force router to refresh and clear cache
                        router.refresh();
                        router.push(`/qrcodes?updated=${Date.now()}`);
                    }, 1000);
                } else {
                    throw new Error(response.error || 'Failed to update QR code');
                }
            } else {
                // Create new QR code
                const response = await qrApi.create({
                    type: params.template,
                    name: qrName,
                    payload: payload,
                    design: design,
                });

                if (response.success && response.data) {
                    const qrId = response.data.id;

                    // Store QR ID in sessionStorage
                    sessionStorage.setItem('newlyCreatedQrId', qrId);

                    // Navigate to /create page
                    // This puts /create in the browser history
                    // The /create page will then redirect to QR detail
                    router.push('/create');
                } else {
                    throw new Error(response.error || 'Failed to create QR code');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Failed to save QR code. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full px-4 pb-20">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* LEFT PANEL: 75% - Design Controls */}
                <div className="w-full lg:w-3/4 flex flex-col">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Back to Content</span>
                        </button>
                        <h3 className="text-2xl font-bold text-slate-900">Customize QR Code Design</h3>
                        <p className="text-slate-500 mt-1">Personalize your QR code appearance</p>
                    </div>

                    {/* QR Name Input */}
                    <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            QR Code Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={qrName}
                            onChange={(e) => setQrName(e.target.value)}
                            placeholder="e.g., Restaurant Menu, Business Card, Website Link"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-2">Give your QR code a memorable name for easy identification</p>
                    </div>

                    {/* Accordion Sections */}
                    <div className="space-y-4">
                        {/* Pattern Section - Now First */}
                        <AccordionSection
                            title="QR code pattern"
                            subtitle="Select a pattern for your QR code and choose colors"
                            icon={Grid3x3}
                            color="bg-blue-100 text-blue-600"
                            isOpen={openSections.pattern}
                            onToggle={() => toggleSection('pattern')}
                        >
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">Pattern style</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { style: 'square', label: 'Square' },
                                            { style: 'dots', label: 'Dots' },
                                            { style: 'rounded', label: 'Rounded' },
                                            { style: 'extra-rounded', label: 'Extra Rounded' },
                                            { style: 'classy', label: 'Classy' },
                                            { style: 'classy-rounded', label: 'Classy Rounded' }
                                        ].map(({ style, label }) => (
                                            <button
                                                key={style}
                                                onClick={() => updateDesign({ dots: { ...design.dots, style } })}
                                                className={`p-3 border-2 rounded-xl transition-all flex flex-col items-center gap-2 relative ${design.dots?.style === style
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {/* Pattern Image - Actual QR sample */}
                                                <div className="w-16 h-16 bg-white rounded border border-slate-200 flex items-center justify-center p-1">
                                                    <img
                                                        src={`/patterns/qr-pattern-${style}.png`}
                                                        alt={label}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-slate-700">{label}</span>
                                                {design.dots?.style === style && (
                                                    <div className="absolute top-2 right-2 text-blue-600">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors moved inside pattern section */}
                                <div className="pt-4 border-t border-slate-100">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Foreground Color */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Dot color</label>
                                            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 min-h-[44px]">
                                                <input
                                                    type="color"
                                                    value={design.dots?.color ?? '#000000'}
                                                    onChange={(e) => updateDesign({ dots: { ...design.dots, color: e.target.value } })}
                                                    className="w-10 h-10 rounded border-0 cursor-pointer flex-shrink-0"
                                                />
                                                <input
                                                    type="text"
                                                    value={design.dots?.color ?? '#000000'}
                                                    onChange={(e) => updateDesign({ dots: { ...design.dots, color: e.target.value } })}
                                                    className="flex-1 bg-transparent text-xs sm:text-sm font-mono text-slate-700 focus:outline-none uppercase"
                                                    placeholder="#000000"
                                                />
                                            </div>
                                        </div>

                                        {/* Background Color */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Background color</label>
                                            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 min-h-[44px]">
                                                <input
                                                    type="color"
                                                    value={design.background?.color ?? '#ffffff'}
                                                    onChange={(e) => updateDesign({ background: { color: e.target.value } })}
                                                    className="w-10 h-10 rounded border-0 cursor-pointer flex-shrink-0"
                                                    disabled={design.background?.color === 'transparent'}
                                                />
                                                <input
                                                    type="text"
                                                    value={design.background?.color ?? '#ffffff'}
                                                    onChange={(e) => updateDesign({ background: { color: e.target.value } })}
                                                    className="flex-1 bg-transparent text-xs sm:text-sm font-mono text-slate-700 focus:outline-none disabled:opacity-50 uppercase"
                                                    placeholder="#ffffff"
                                                    disabled={design.background?.color === 'transparent'}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transparent Background Checkbox */}
                                    <label className="flex items-center gap-2 sm:gap-3 cursor-pointer mt-3 min-h-[44px]">
                                        <input
                                            type="checkbox"
                                            checked={design.background?.color === 'transparent'}
                                            onChange={(e) => updateDesign({
                                                background: { color: e.target.checked ? 'transparent' : '#ffffff' }
                                            })}
                                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                                        />
                                        <span className="text-sm text-slate-700">Transparent background</span>
                                    </label>
                                </div>
                            </div>
                        </AccordionSection>


                        {/* Corners Section */}
                        <AccordionSection
                            title="QR code corners"
                            subtitle="Customize the corner squares of your QR code"
                            icon={Frame}
                            color="bg-orange-100 text-orange-600"
                            isOpen={openSections.corners}
                            onToggle={() => toggleSection('corners')}
                        >
                            <div className="mt-4 space-y-6">
                                {/* Match Pattern Color Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            updateDesign({
                                                cornersSquare: { ...design.cornersSquare, color: design.dots?.color },
                                                cornersDot: { ...design.cornersDot, color: design.dots?.color }
                                            });
                                        }}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
                                    >
                                        Match pattern color
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    {/* Corner Square Style */}
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">Corner square style</label>
                                        {/* Grid set to 3 columns on mobile, 2 on desktop for better mobile layout */}
                                        <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-3">
                                            {[
                                                { style: 'square', label: 'Square' },
                                                { style: 'dot', label: 'Dot' },
                                                { style: 'extra-rounded', label: 'Rounded' }
                                            ].map(({ style, label }) => (
                                                <button
                                                    key={style}
                                                    onClick={() => updateDesign({ cornersSquare: { ...design.cornersSquare, style } })}
                                                    className={`p-2 sm:p-3 border-2 rounded-lg transition-all flex flex-col items-center gap-1.5 sm:gap-2 min-h-[70px] sm:min-h-[80px] ${design.cornersSquare?.style === style
                                                        ? 'border-orange-600 bg-orange-50'
                                                        : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {/* Reduced size of preview icon wrapper */}
                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                                                        {/* Reduced size of preview icon */}
                                                        <div className={`w-4 h-4 sm:w-5 sm:h-5 border-2 border-slate-800 ${style === 'dot' ? 'rounded-full' :
                                                            style === 'extra-rounded' ? 'rounded-md' :
                                                                'rounded-sm'
                                                            }`} />
                                                    </div>
                                                    <span className="text-[10px] sm:text-xs font-medium text-slate-700 text-center leading-tight">{label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Corner Dot Style */}
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">Corner dot style</label>
                                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                            {[
                                                { style: 'square', label: 'Square' },
                                                { style: 'dot', label: 'Dot' }
                                            ].map(({ style, label }) => (
                                                <button
                                                    key={style}
                                                    onClick={() => updateDesign({ cornersDot: { ...design.cornersDot, style } })}
                                                    className={`p-2 sm:p-3 border-2 rounded-lg transition-all flex flex-col items-center gap-1.5 sm:gap-2 min-h-[70px] sm:min-h-[80px] ${design.cornersDot?.style === style
                                                        ? 'border-orange-600 bg-orange-50'
                                                        : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {/* Reduced size of preview icon wrapper */}
                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                                                        {/* Reduced size of preview icon */}
                                                        <div className={`w-3 h-3 sm:w-4 sm:h-4 bg-slate-800 ${style === 'dot' ? 'rounded-full' : 'rounded-sm'
                                                            }`} />
                                                    </div>
                                                    <span className="text-[10px] sm:text-xs font-medium text-slate-700 text-center leading-tight">{label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    {/* Corner Square Color */}
                                    <div className="flex-1 pt-4 border-t border-slate-100">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Corner square color</label>
                                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 min-h-[44px]">
                                            <input
                                                type="color"
                                                value={design.cornersSquare?.color ?? design.dots?.color ?? '#000000'}
                                                onChange={(e) => updateDesign({ cornersSquare: { ...design.cornersSquare, color: e.target.value } })}
                                                className="w-10 h-10 rounded border-0 cursor-pointer flex-shrink-0"
                                            />
                                            <input
                                                type="text"
                                                value={design.cornersSquare?.color ?? design.dots?.color ?? '#000000'}
                                                onChange={(e) => updateDesign({ cornersSquare: { ...design.cornersSquare, color: e.target.value } })}
                                                className="flex-1 bg-transparent text-xs sm:text-sm font-mono text-slate-700 focus:outline-none uppercase"
                                                placeholder="#000000"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => copyColor(design.cornersSquare?.color ?? design.dots?.color ?? '#000000', 'square')}
                                                className="p-1.5 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
                                                title="Copy color"
                                            >
                                                {copiedColor === 'square' ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-slate-500" />
                                                )}
                                            </button>
                                        </div>
                                        {/* Contrast Warning for Corner Square */}
                                        {getContrastRatio(
                                            design.cornersSquare?.color ?? design.dots?.color ?? '#000000',
                                            design.background?.color ?? '#ffffff'
                                        ) < 3 && design.background?.color !== 'transparent' && (
                                                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Low contrast may reduce scanability
                                                </p>
                                            )}
                                    </div>

                                    {/* Corner Dot Color */}
                                    <div className="flex-1 pt-4 border-t border-slate-100">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Corner dot color</label>
                                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 min-h-[44px]">
                                            <input
                                                type="color"
                                                value={design.cornersDot?.color ?? design.dots?.color ?? '#000000'}
                                                onChange={(e) => updateDesign({ cornersDot: { ...design.cornersDot, color: e.target.value } })}
                                                className="w-10 h-10 rounded border-0 cursor-pointer flex-shrink-0"
                                            />
                                            <input
                                                type="text"
                                                value={design.cornersDot?.color ?? design.dots?.color ?? '#000000'}
                                                onChange={(e) => updateDesign({ cornersDot: { ...design.cornersDot, color: e.target.value } })}
                                                className="flex-1 bg-transparent text-xs sm:text-sm font-mono text-slate-700 focus:outline-none uppercase"
                                                placeholder="#000000"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => copyColor(design.cornersDot?.color ?? design.dots?.color ?? '#000000', 'dot')}
                                                className="p-1.5 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
                                                title="Copy color"
                                            >
                                                {copiedColor === 'dot' ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-slate-500" />
                                                )}
                                            </button>
                                        </div>
                                        {/* Contrast Warning for Corner Dot */}
                                        {getContrastRatio(
                                            design.cornersDot?.color ?? design.dots?.color ?? '#000000',
                                            design.background?.color ?? '#ffffff'
                                        ) < 3 && design.background?.color !== 'transparent' && (
                                                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Low contrast may reduce scanability
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </AccordionSection>

                        {/* Logo Section */}
                        <AccordionSection
                            title="Add logo"
                            subtitle="Personalize your QR code with a logo (max 2MB)"
                            icon={ImageIcon}
                            color="bg-emerald-100 text-emerald-600"
                            isOpen={openSections.logo}
                            onToggle={() => toggleSection('logo')}
                        >
                            <div className="mt-4 space-y-4">
                                {/* Logo Upload */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">Upload logo</label>
                                    {design.image ? (
                                        <div className="relative">
                                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                <img
                                                    src={design.image}
                                                    alt="Logo preview"
                                                    className="w-16 h-16 object-contain rounded border border-slate-300 bg-white"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-700">Logo uploaded</p>
                                                    <p className="text-xs text-slate-500">Optimized for scanability (40% size)</p>
                                                </div>
                                                <button
                                                    onClick={() => updateDesign({ image: null })}
                                                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="block cursor-pointer">
                                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors">
                                                <ImageIcon className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                                                <p className="text-sm font-medium text-slate-700 mb-1">Click to upload logo</p>
                                                <p className="text-xs text-slate-500">PNG, JPG, SVG (max 2MB)</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        // Validate file size (2MB max)
                                                        if (file.size > 2 * 1024 * 1024) {
                                                            alert('File size must be less than 2MB');
                                                            return;
                                                        }

                                                        const reader = new FileReader();
                                                        reader.onload = (event) => {
                                                            updateDesign({ image: event.target?.result as string });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>

                                {/* Logo Size Slider */}
                                {design.image && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                                            Logo size: {Math.round((design.imageOptions?.imageSize ?? 0.4) * 100)}%
                                        </label>
                                        <input
                                            type="range"
                                            min="20"
                                            max="50"
                                            value={(design.imageOptions?.imageSize ?? 0.4) * 100}
                                            onChange={(e) => updateDesign({
                                                imageOptions: {
                                                    ...design.imageOptions,
                                                    imageSize: parseInt(e.target.value) / 100
                                                }
                                            })}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">
                                            ⚠️ Larger logos may reduce scanability. Keep between 30-40% for best results.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </AccordionSection>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-600">QR code generated and downloaded successfully!</p>
                        </div>
                    )}

                    {/* Create/Update Button */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isGenerating ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update QR Code' : 'Create QR Code')}
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL: 25% - Sticky QR Preview */}
                <div className="hidden lg:flex w-full lg:w-1/4 relative">
                    <div className="sticky top-6 w-full flex flex-col items-center h-fit">
                        <div className="transform transition-all duration-500 origin-top scale-[0.85] xl:scale-[0.9]">
                            <PhoneMockup className="shadow-2xl shadow-slate-300/50">
                                <div className="flex flex-col min-h-full font-sans bg-gradient-to-br from-slate-50 to-white overflow-hidden">
                                    {/* QR Code Display Area */}
                                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                                        <div className="text-center mb-4">
                                            <h3 className="text-base font-bold text-slate-900 mb-1">Your QR Code</h3>
                                            <p className="text-xs text-slate-500">Scan to test</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200">
                                            <LiveQrPreview />
                                        </div>
                                    </div>
                                </div>
                            </PhoneMockup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
