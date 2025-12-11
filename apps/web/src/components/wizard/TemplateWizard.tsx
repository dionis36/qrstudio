'use client';

import { useState } from 'react';
import { MenuForm } from './forms/MenuForm';
import { VCardForm } from './forms/VCardForm';
import { DesignControls } from './steps/DesignControls';
import { LiveQrPreview } from './preview/LiveQrPreview';
import { PhoneMockup } from '../common/PhoneMockup';
import { MenuPreview } from './preview/MenuPreview';
import { VCardPreview } from './preview/VCardPreview';
import { Smartphone } from 'lucide-react';
import { useWizardStore } from './store';
import { createQrCode, downloadQrCode, ApiError } from '@/lib/api';

interface TemplateWizardProps {
    templateType: string;
}

export function TemplateWizard({ templateType }: TemplateWizardProps) {
    const [step, setStep] = useState<'content' | 'design'>('content');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { payload, design } = useWizardStore();

    const renderForm = () => {
        switch (templateType) {
            case 'menu':
                return <MenuForm />;
            case 'vcard':
                return <VCardForm />;
            default:
                return (
                    <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400 bg-slate-50/50">
                        <p className="text-lg">Content form for <strong>{templateType}</strong> is under construction.</p>
                    </div>
                );
        }
    };

    const renderPreview = () => {
        if (step === 'design') {
            return (
                <div className="w-full h-full flex flex-col bg-white">
                    <div className="h-1/3 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="text-center z-10 text-white px-6">
                            <h3 className="font-bold text-xl mb-1">Scan to View</h3>
                            <p className="text-xs opacity-70 uppercase tracking-widest">{templateType} Content</p>
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

        switch (templateType) {
            case 'menu':
                return <MenuPreview data={payload} />;
            case 'vcard':
                return <VCardPreview data={payload} />;
            default:
                return (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-sm mb-6 flex items-center justify-center">
                            <Smartphone className="w-8 h-8 text-slate-300" />
                        </div>
                        <h4 className="text-slate-400 font-medium text-sm leading-relaxed">Preview will appear here</h4>
                    </div>
                );
        }
    };

    return (
        <div className="w-full px-4 pb-20">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* LEFT PANEL: 75% - Content Area */}
                <div className="w-full lg:w-3/4 flex flex-col">
                    {step === 'content' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            {renderForm()}
                        </div>
                    )}

                    {step === 'design' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="mb-8">
                                <h3 className="text-3xl font-bold text-slate-900 capitalize tracking-tight">Customize Design</h3>
                            </div>

                            <DesignControls />

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

                            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={async () => {
                                        setError(null);
                                        setSuccess(false);
                                        setIsGenerating(true);

                                        try {
                                            const response = await createQrCode({
                                                type: templateType as any,
                                                payload: payload,
                                                design: design,
                                                is_dynamic: false
                                            });

                                            // Download the QR code
                                            downloadQrCode(response.raw_svg, `${templateType}-qrcode.svg`);
                                            setSuccess(true);

                                            // Clear success message after 3 seconds
                                            setTimeout(() => setSuccess(false), 3000);
                                        } catch (err) {
                                            if (err instanceof ApiError) {
                                                setError(err.message);
                                            } else {
                                                setError('Failed to generate QR code. Please try again.');
                                            }
                                        } finally {
                                            setIsGenerating(false);
                                        }
                                    }}
                                    disabled={isGenerating}
                                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    {isGenerating ? 'Generating...' : 'Download QR Code'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL: 25% - Sticky Preview */}
                <div className="hidden lg:flex w-full lg:w-1/4 relative">
                    <div className="sticky top-6 w-full flex flex-col items-center h-fit">

                        {/* Floating Toggle Controls */}
                        <div className="mb-8 bg-white/80 backdrop-blur-xl p-1.5 rounded-full shadow-lg border border-white/50 ring-1 ring-slate-100">
                            <button
                                onClick={() => setStep('content')}
                                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${step === 'content' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Content
                            </button>
                            <button
                                onClick={() => setStep('design')}
                                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${step === 'design' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Design
                            </button>
                        </div>

                        {/* Phone Mockup */}
                        <div className="transform transition-all duration-500 origin-top scale-[0.85] xl:scale-[0.9]">
                            <PhoneMockup className="shadow-2xl shadow-slate-300/50">
                                {renderPreview()}
                            </PhoneMockup>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
