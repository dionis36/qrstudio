import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { useWizardStore } from '../store';

export function LiveQrPreview() {
    const { type, payload, design } = useWizardStore();
    const qrRef = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<QRCodeStyling | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Debounce updates to prevent blinking
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }

        updateTimeoutRef.current = setTimeout(() => {
            setIsUpdating(true);

            // Determine content based on type/payload
            let content = '';
            if (type === 'url' && payload.url) content = payload.url;
            else if (type === 'menu') content = JSON.stringify(payload);
            else if (type === 'vcard') content = 'BEGIN:VCARD\nVERSION:3.0\nN:Doe;John;;;\nFN:John Doe\nEND:VCARD';
            else content = 'https://qrstudio.app';

            // Create or update QR code
            if (!qrCodeRef.current) {
                qrCodeRef.current = new QRCodeStyling({
                    width: 256,
                    height: 256,
                    data: content,
                    margin: design.margin ?? 1,
                    qrOptions: {
                        errorCorrectionLevel: 'M'
                    },
                    dotsOptions: {
                        color: design.dots?.color ?? '#000000',
                        type: design.dots?.style ?? 'square'
                    },
                    cornersSquareOptions: {
                        color: design.cornersSquare?.color ?? design.dots?.color ?? '#000000',
                        type: design.cornersSquare?.style ?? 'square'
                    },
                    cornersDotOptions: {
                        color: design.cornersDot?.color ?? design.dots?.color ?? '#000000',
                        type: design.cornersDot?.style ?? 'square'
                    },
                    backgroundOptions: {
                        color: design.background?.color === 'transparent' ? 'rgba(0,0,0,0)' : (design.background?.color ?? '#ffffff')
                    },
                    image: design.image || undefined,
                    imageOptions: {
                        crossOrigin: 'anonymous',
                        hideBackgroundDots: design.imageOptions?.hideBackgroundDots ?? true,
                        imageSize: design.imageOptions?.imageSize ?? 0.4,
                        margin: design.imageOptions?.margin ?? 10
                    }
                });

                if (qrRef.current) {
                    qrRef.current.innerHTML = '';
                    qrCodeRef.current.append(qrRef.current);
                }
            } else {
                // Update existing QR code
                qrCodeRef.current.update({
                    data: content,
                    margin: design.margin ?? 1,
                    dotsOptions: {
                        color: design.dots?.color ?? '#000000',
                        type: design.dots?.style ?? 'square'
                    },
                    cornersSquareOptions: {
                        color: design.cornersSquare?.color ?? design.dots?.color ?? '#000000',
                        type: design.cornersSquare?.style ?? 'square'
                    },
                    cornersDotOptions: {
                        color: design.cornersDot?.color ?? design.dots?.color ?? '#000000',
                        type: design.cornersDot?.style ?? 'square'
                    },
                    backgroundOptions: {
                        color: design.background?.color === 'transparent' ? 'rgba(0,0,0,0)' : (design.background?.color ?? '#ffffff')
                    },
                    image: design.image || undefined,
                    imageOptions: {
                        crossOrigin: 'anonymous',
                        hideBackgroundDots: design.imageOptions?.hideBackgroundDots ?? true,
                        imageSize: design.imageOptions?.imageSize ?? 0.4,
                        margin: design.imageOptions?.margin ?? 10
                    }
                });
            }

            // Small delay to ensure smooth transition
            setTimeout(() => setIsUpdating(false), 100);
        }, 150); // 150ms debounce

        return () => {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, [type, payload, design]);

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div
                ref={qrRef}
                className={`flex items-center justify-center transition-opacity duration-200 ${isUpdating ? 'opacity-90' : 'opacity-100'}`}
            />
        </div>
    );
}
