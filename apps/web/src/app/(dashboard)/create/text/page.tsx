'use client';

import { TemplateWizard } from '@/components/wizard/TemplateWizard';

export default function TextQrPage() {
    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1">
                <TemplateWizard templateType="text" />
            </div>
        </div>
    );
}
