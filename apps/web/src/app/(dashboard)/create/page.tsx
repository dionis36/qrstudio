'use client';

import { useEffect } from 'react';
import { QrStepWizard } from '@/components/wizard/QrStepWizard';
import { useWizardStore } from '@/components/wizard/store';

export default function CreateQrPage() {
    const { reset } = useWizardStore();

    // Reset wizard store when accessing create page (ensures clean state)
    useEffect(() => {
        reset();
    }, []);

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1">
                <QrStepWizard />
            </div>
        </div>
    );
}
