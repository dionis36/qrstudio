'use client';

import { EnhancedPreviewModal } from './EnhancedPreviewModal';
import { PreviewProvider } from '../wizard/preview/PreviewContext';
import { MenuPreview } from '../wizard/preview/MenuPreview';
import { VCardPreview } from '../wizard/preview/VCardPreview';
import { URLPreview } from '../wizard/preview/URLPreview';
import { TextPreview } from '../wizard/preview/TextPreview';
import { WiFiPreview } from '../wizard/preview/WiFiPreview';
import { PDFPreview } from '../wizard/preview/PDFPreview';
import { EventPreview } from '../wizard/preview/EventPreview';
import { EmailPreview } from '../wizard/preview/EmailPreview';
import { MessagePreview } from '../wizard/preview/MessagePreview';
import { AppStorePreview } from '../wizard/preview/AppStorePreview';
import { SocialMediaPagePreview } from '../wizard/preview/SocialMediaPagePreview';

interface QrContentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    qrCode: {
        type: string;
        payload: any;
        design?: any;
    } | null;
}

export function QrContentPreviewModal({ isOpen, onClose, qrCode }: QrContentPreviewModalProps) {
    if (!qrCode) return null;

    // Render the appropriate preview component based on QR code type
    const renderPreview = () => {
        const { type, payload } = qrCode;

        switch (type.toLowerCase()) {
            case 'menu':
                return <MenuPreview data={payload} />;
            case 'vcard':
                return <VCardPreview data={payload} />;
            case 'url':
                return <URLPreview data={payload} />;
            case 'text':
                return <TextPreview data={payload} />;
            case 'wifi':
                return <WiFiPreview data={payload} />;
            case 'file':
                return <PDFPreview data={payload} />;
            case 'event':
                return <EventPreview data={payload} />;
            case 'email':
                return <EmailPreview data={payload} />;
            case 'message':
                return <MessagePreview data={payload} />;
            case 'appstore':
                return <AppStorePreview data={payload} />;
            case 'socialmedia':
                return <SocialMediaPagePreview data={payload} />;
            default:
                return (
                    <div className="flex items-center justify-center h-full p-8 text-center">
                        <div>
                            <p className="text-slate-600 font-medium">Preview not available</p>
                            <p className="text-sm text-slate-500 mt-2">
                                Preview for {type} type is not supported yet
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <EnhancedPreviewModal isOpen={isOpen} onClose={onClose}>
            <PreviewProvider>
                {renderPreview()}
            </PreviewProvider>
        </EnhancedPreviewModal>
    );
}
