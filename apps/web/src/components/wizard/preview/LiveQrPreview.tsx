import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useWizardStore } from '../store';

export function LiveQrPreview() {
    const { type, payload, design } = useWizardStore();
    const [svg, setSvg] = useState<string>('');

    useEffect(() => {
        // Determine content based on type/payload
        let content = '';
        if (type === 'url' && payload.url) content = payload.url;
        else if (type === 'menu') content = JSON.stringify(payload); // In real app, this would be the shortcode URL
        else if (type === 'vcard') content = 'BEGIN:VCARD\nVERSION:3.0\nN:Doe;John;;;\nFN:John Doe\nEND:VCARD'; // Demo content
        else content = 'https://qrstudio.app'; // Default

        // Generate QR
        QRCode.toString(content, {
            type: 'svg',
            margin: design.margin ?? 1,
            color: {
                dark: design.dots?.color ?? '#000000',
                light: design.background?.color ?? '#ffffff',
            },
            width: 1000,
        }).then((svgString) => {
            setSvg(svgString);
        });
    }, [type, payload, design]);

    return (
        <div className="relative group">
            <div
                className="w-full h-full transition-all duration-300 transform group-hover:scale-105"
                dangerouslySetInnerHTML={{ __html: svg }}
            />
            {/* Phone Frame Mockup could go here */}
        </div>
    );
}
