'use client';

import { useEffect, useState } from 'react';
import { useWizardStore } from './store';
import { Step1Templates } from './steps/Step1Templates';
import { MenuForm } from './forms/MenuForm';
import { VCardForm } from './forms/VCardForm';
import { DesignControls } from './steps/DesignControls';
import { LiveQrPreview } from './preview/LiveQrPreview';
import { PhoneMockup } from '../common/PhoneMockup';
import { MenuPreview } from './preview/MenuPreview';
import { VCardPreview } from './preview/VCardPreview';
import { URLPreview } from './preview/URLPreview';
import { WiFiPreview } from './preview/WiFiPreview';
import { PreviewModal } from './preview/PreviewModal';
import { Smartphone, Eye } from 'lucide-react';
import { HOVER_PREVIEW_DATA } from './steps/hoverPreviewData';

interface QrStepWizardProps {
    initialType?: string;
}

export function QrStepWizard({ initialType }: QrStepWizardProps) {
    const { step, type, payload, setStep, setType, reset } = useWizardStore();
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

    useEffect(() => {
        if (initialType) {
            reset();
            setType(initialType);
            setStep(2);
        }
    }, [initialType, reset, setType, setStep]);

    const renderPreviewContent = () => {
        if (step === 1) {
            // Show hover preview if user is hovering over a template
            if (hoveredTemplate === 'menu') {
                return (
                    <div className="animate-in fade-in duration-300">
                        <MenuPreview data={HOVER_PREVIEW_DATA.menu} />
                    </div>
                );
            }

            if (hoveredTemplate === 'vcard') {
                return (
                    <div className="animate-in fade-in duration-300">
                        <VCardPreview data={HOVER_PREVIEW_DATA.vcard} />
                    </div>
                );
            }

            if (hoveredTemplate === 'url') {
                return (
                    <div className="animate-in fade-in duration-300">
                        <URLPreview data={HOVER_PREVIEW_DATA.url} />
                    </div>
                );
            }

            if (hoveredTemplate === 'wifi') {
                return (
                    <div className="animate-in fade-in duration-300">
                        <WiFiPreview data={HOVER_PREVIEW_DATA.wifi} />
                    </div>
                );
            }

            // Default state - no hover
            return (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm mb-6 flex items-center justify-center">
                        <Smartphone className="w-8 h-8 text-slate-300" />
                    </div>
                    <h4 className="text-slate-400 font-medium text-sm leading-relaxed">Hover over a template to preview</h4>
                </div>
            );
        }

        if (step === 2) {
            if (type === 'menu') return <MenuPreview data={payload} />;
            if (type === 'vcard') return <VCardPreview data={payload} />;
        }

        if (step === 3) {
            return (
                <div className="w-full h-full flex flex-col bg-white">
                    <div className="h-1/3 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="text-center z-10 text-white px-6">
                            <h3 className="font-bold text-xl mb-1">Scan to View</h3>
                            <p className="text-xs opacity-70 uppercase tracking-widest">{type} Content</p>
                        </div>
                    </div>
                    <div className="-mt-16 mx-auto bg-white p-4 rounded-3xl shadow-xl w-56 h-56 flex items-center justify-center border-4 border-white/50">
                        <LiveQrPreview />
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <p className="text-sm text-gray-500">
                            Open your camera app and point it at the code above.
                        </p>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="w-full pb-20">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* LEFT PANEL: 75% - Content Area */}
                <div className="w-full lg:w-3/4 flex flex-col">
                    {step === 1 && <Step1Templates onTemplateHover={setHoveredTemplate} />}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            {type === 'menu' && <MenuForm />}
                            {type === 'vcard' && <VCardForm />}

                            {type !== 'menu' && type !== 'vcard' && (
                                <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400 bg-slate-50/50">
                                    <p className="text-lg">Content form for <strong>{type}</strong> is under construction.</p>
                                </div>
                            )}

                            {type !== 'menu' && type !== 'vcard' && (
                                <div className="mt-8 flex justify-end">
                                    <button onClick={() => setStep(3)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">Skip to Design</button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[900px]">
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="mb-8 flex items-center justify-between">
                                    <h3 className="text-3xl font-bold text-slate-900 capitalize tracking-tight">Customize Design</h3>

                                    {/* Preview button for small screens */}
                                    <button
                                        onClick={() => setIsPreviewModalOpen(true)}
                                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Preview
                                    </button>
                                </div>

                                <DesignControls />

                                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                                    <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all">
                                        Download QR Code
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL: 25% - Sticky Preview (wide screens only) */}
                <div className="hidden lg:flex w-full lg:w-1/4 relative">
                    <div className="sticky top-6 w-full flex flex-col items-center h-fit">
                        {/* Floating Toggle Controls (only for steps 2 & 3) */}
                        {step > 1 && (
                            <div className="mb-8 bg-white/80 backdrop-blur-xl p-1.5 rounded-full shadow-lg border border-white/50 ring-1 ring-slate-100">
                                <button
                                    onClick={() => step === 3 && setStep(2)}
                                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${step === 2 ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Content
                                </button>
                                <button
                                    onClick={() => step === 2 && setStep(3)}
                                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${step === 3 ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Design
                                </button>
                            </div>
                        )}

                        {/* Phone Mockup */}
                        <div className="transform transition-all duration-500 origin-top scale-[0.85] xl:scale-[0.9]">
                            <PhoneMockup className="shadow-2xl shadow-slate-300/50">
                                {renderPreviewContent()}
                            </PhoneMockup>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Preview Button for Mobile */}
            {step === 2 && (
                <button
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="lg:hidden fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-2xl hover:scale-105"
                >
                    <Eye className="w-5 h-5" />
                    Preview
                </button>
            )}

            {/* Preview Modal for small screens (template pages only) */}
            {step > 1 && (
                <PreviewModal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)}>
                    {renderPreviewContent()}
                </PreviewModal>
            )}
        </div>
    );
}
