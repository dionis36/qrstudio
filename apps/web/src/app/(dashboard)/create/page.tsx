'use client';

import { useEffect } from 'react';
import { QrStepWizard } from '@/components/wizard/QrStepWizard';
import { useWizardStore } from '@/components/wizard/store';
import { SEO } from '@/components/common/SEO';
import { BackButton } from '@/components/common/BackButton';

export default function CreateQrPage() {
    const { reset } = useWizardStore();

    // Reset wizard store when accessing create page (ensures clean state)
    useEffect(() => {
        reset();
    }, []);

    return (
        <div className="flex-1 flex flex-col px-3 sm:px-6">
            <SEO
                title="Create QR Code"
                description="Choose from menu, vCard, URL, WiFi, and more QR code types"
            />

            <BackButton label="Back to Dashboard" />

            <div className="flex-1">
                <QrStepWizard />
            </div>
        </div>
    );
}
