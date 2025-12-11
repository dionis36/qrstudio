'use client';

import { MenuForm } from '@/components/wizard/forms/MenuForm';
import { PhoneMockup } from '@/components/common/PhoneMockup';
import { MenuPreview } from '@/components/wizard/preview/MenuPreview';
import { useWizardStore } from '@/components/wizard/store';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function MenuQrPage() {
    const { payload } = useWizardStore();
    const router = useRouter();

    return (
        <div className="w-full px-4 pb-20">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* LEFT PANEL: 75% - Content Form */}
                <div className="w-full lg:w-3/4 flex flex-col">
                    <MenuForm />

                    {/* Next Button */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={() => router.push('/create/menu/design')}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            Next: Customize QR Design
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL: 25% - Sticky Preview */}
                <div className="hidden lg:flex w-full lg:w-1/4 relative">
                    <div className="sticky top-6 w-full flex flex-col items-center h-fit">
                        <div className="transform transition-all duration-500 origin-top scale-[0.85] xl:scale-[0.9]">
                            <PhoneMockup className="shadow-2xl shadow-slate-300/50">
                                <MenuPreview data={payload} />
                            </PhoneMockup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
