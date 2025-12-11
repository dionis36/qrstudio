'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function PdfQrPage() {
    const router = useRouter();

    return (
        <div className="w-full px-4 pb-20">
            <div className="max-w-4xl mx-auto">
                <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400 bg-slate-50/50">
                    <p className="text-lg">Content form for <strong>PDF</strong> is under construction.</p>
                </div>

                {/* Next Button */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={() => router.push('/create/pdf/design')}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        Next: Customize QR Design
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
