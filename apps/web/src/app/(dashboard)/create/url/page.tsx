'use client';

import { TemplateWizard } from '@/components/wizard/TemplateWizard';

export default function UrlQrPage() {
    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1">
                <TemplateWizard templateType="url" />
            </div>
        </div>
    );
}
