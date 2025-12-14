'use client';

import { EmailForm } from '@/components/wizard/forms/EmailForm';
import { PhoneMockup } from '@/components/common/PhoneMockup';
import { EmailPreview } from '@/components/wizard/preview/EmailPreview';
import { useWizardStore } from '@/components/wizard/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { qrApi } from '@/lib/api-client';
import { SEO } from '@/components/common/SEO';
import { BackButton } from '@/components/common/BackButton';
import { EnhancedPreviewModal } from '@/components/common/EnhancedPreviewModal';

export default function EmailPage() {
    const { payload, setEditMode, loadQrData } = useWizardStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const [loading, setLoading] = useState(!!editId);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (editId) {
            // Load existing QR code data for editing
            loadExistingQr(editId);
        } else {
            // Clear edit mode if no edit parameter
            setEditMode(null);
        }
    }, [editId]);

    async function loadExistingQr(id: string) {
        try {
            setLoading(true);
            const response = await qrApi.getById(id);

            if (response.success && response.data) {
                // Set edit mode and load data into store
                setEditMode(id);
                loadQrData(response.data);
            } else {
                alert('Failed to load QR code');
                router.push('/qrcodes');
            }
        } catch (error) {
            console.error('Failed to load QR code:', error);
            alert('Failed to load QR code');
            router.push('/qrcodes');
        } finally {
            setLoading(false);
        }
    }

    const handleNext = () => {
        router.push(`/create/email/design${editId ? `?edit=${editId}` : ''}`);
    };

    if (loading) {
        return (
            <div className="w-full px-4 pb-20 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading QR code data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-3 sm:px-6 pb-20">
            <SEO
                title="Create Email QR Code"
                description="Create a QR code that opens an email with pre-filled content"
            />

            <BackButton />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* LEFT PANEL: 75% - Form */}
                <div className="w-full lg:w-3/4">
                    <EmailForm />

                    {/* Next Button */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-base shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            {editId ? 'Next: Update Design' : 'Next: Customize QR Design'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL: 25% - Sticky Preview */}
                <div className="hidden lg:flex w-full lg:w-1/4 relative">
                    <div className="sticky top-6 w-full flex flex-col items-center h-fit">
                        <div className="transform transition-all duration-500 origin-top scale-[0.85] xl:scale-[0.9]">
                            <PhoneMockup className="shadow-2xl shadow-slate-300/50">
                                <EmailPreview />
                            </PhoneMockup>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Preview Button */}
            <button
                onClick={() => setShowPreview(true)}
                className="lg:hidden fixed bottom-6 right-6 z-40 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
            >
                <Eye className="w-5 h-5" />
                View Preview
            </button>

            {/* Mobile Preview Modal */}
            <EnhancedPreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)}>
                <EmailPreview />
            </EnhancedPreviewModal>
        </div>
    );
}
