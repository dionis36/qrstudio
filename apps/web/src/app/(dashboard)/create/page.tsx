'use client';

import { useState } from 'react';
import { QrStepWizard } from '@/components/wizard/QrStepWizard';

export default function CreateQrPage() {
    return (
        <div className="flex-1 flex flex-col">
            <div className="border-b bg-white px-6 py-4">
                <h1 className="text-2xl font-semibold">Create New QR Code</h1>
            </div>

            <div className="flex-1 p-6 container mx-auto max-w-6xl">
                <QrStepWizard />
            </div>
        </div>
    );
}
