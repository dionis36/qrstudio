'use client';

import { TemplateWizard } from '@/components/wizard/TemplateWizard';

export default function WifiQrPage() {
    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1">
                <TemplateWizard templateType="wifi" />
            </div>
        </div>
    );
}
