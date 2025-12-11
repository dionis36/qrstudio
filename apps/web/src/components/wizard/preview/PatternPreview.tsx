'use client';

import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

interface PatternPreviewProps {
    pattern: string;
}

export function PatternPreview({ pattern }: PatternPreviewProps) {
    const qrRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!qrRef.current) return;

        const qrCode = new QRCodeStyling({
            width: 64,
            height: 64,
            data: 'QR',
            margin: 0,
            qrOptions: {
                errorCorrectionLevel: 'L'
            },
            dotsOptions: {
                color: '#1e293b',
                type: pattern as any
            },
            backgroundOptions: {
                color: '#ffffff'
            }
        });

        qrRef.current.innerHTML = '';
        qrCode.append(qrRef.current);
    }, [pattern]);

    return <div ref={qrRef} className="w-16 h-16 flex items-center justify-center" />;
}
