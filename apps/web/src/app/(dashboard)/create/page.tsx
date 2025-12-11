'use client';

import { useState } from 'react';
import { QrStepWizard } from '@/components/wizard/QrStepWizard';

export default function CreateQrPage() {
    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1">
                <QrStepWizard />
            </div>
        </div>
    );
}
