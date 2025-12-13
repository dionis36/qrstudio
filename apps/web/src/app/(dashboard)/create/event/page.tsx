'use client';

import { useRouter } from 'next/navigation';
import { EventForm } from '@/components/wizard/forms/EventForm';
import { EventPreview } from '@/components/wizard/preview/EventPreview';
import { PhoneMockup } from '@/components/common/PhoneMockup';
import { ArrowRight } from 'lucide-react';

export default function EventPage() {
    const router = useRouter();

    const handleNext = () => {
        router.push('/create/event/design');
    };

    return (
        <div className="w-full px-4 pb-20">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* LEFT PANEL: 75% - Form */}
                <div className="w-full lg:w-3/4">
                    <EventForm />

                    {/* Next Button */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-base shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            Next: Customize QR Code
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL: 25% - Sticky Preview */}
                <div className="hidden lg:flex w-full lg:w-1/4 relative">
                    <div className="sticky top-6 w-full flex flex-col items-center h-fit">
                        <div className="transform transition-all duration-500 origin-top scale-[0.85] xl:scale-[0.9]">
                            <PhoneMockup className="shadow-2xl shadow-slate-300/50">
                                <EventPreview />
                            </PhoneMockup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
