'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QrStepWizard } from '@/components/wizard/QrStepWizard';
import { useWizardStore } from '@/components/wizard/store';
import { SEO } from '@/components/common/SEO';

export default function CreateQrPage() {
    const { reset } = useWizardStore();
    const router = useRouter();

    // Reset wizard store when accessing create page (ensures clean state)
    useEffect(() => {
        reset();

        // Check if we just created a QR code
        const newlyCreatedQrId = sessionStorage.getItem('newlyCreatedQrId');
        if (newlyCreatedQrId) {
            // Clear the flag
            sessionStorage.removeItem('newlyCreatedQrId');
            // Use router.push (NOT replace) to go to QR detail
            // This keeps /create in history, so browser back goes to /create
            router.push(`/qrcodes/${newlyCreatedQrId}?created=true`);
        }
    }, [router]);

    return (
        <div className="flex-1 flex flex-col px-3 sm:px-6">
            <SEO
                title="Create QR Code"
                description="Choose from menu, vCard, URL, WiFi, and more QR code types"
            />

            <div className="flex-1">
                <QrStepWizard />
            </div>
        </div>
    );
}
