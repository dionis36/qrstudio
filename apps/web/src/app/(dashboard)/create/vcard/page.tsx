'use client';

import { TemplateWizard } from '@/components/wizard/TemplateWizard';

export default function VCardQrPage() {
    return (
        <div className="flex-1 flex flex-col">
            <div className="border-b bg-white px-6 py-4">
                <h1 className="text-2xl font-semibold">Create vCard QR Code</h1>
            </div>

            <div className="flex-1 p-6 container mx-auto max-w-6xl">
                <TemplateWizard templateType="vcard" />
            </div>
        </div>
    );
}
