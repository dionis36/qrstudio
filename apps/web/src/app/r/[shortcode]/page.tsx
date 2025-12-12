import { redirect } from 'next/navigation';
import { SmartLandingPage } from '@/components/redirect/SmartLandingPage';

interface RedirectPageProps {
    params: {
        shortcode: string;
    };
}

async function getQRCodeByShortcode(shortcode: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/q/${shortcode}`, {
            cache: 'no-store', // Always fetch fresh data
        });

        if (!response.ok) {
            return null;
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Failed to fetch QR code:', error);
        return null;
    }
}

export default async function RedirectPage({ params }: RedirectPageProps) {
    const { shortcode } = params;

    // Fetch QR code data
    const qrCode = await getQRCodeByShortcode(shortcode);

    // Handle not found
    if (!qrCode) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center space-y-4 p-8">
                    <div className="text-6xl">🔍</div>
                    <h1 className="text-3xl font-bold text-slate-900">QR Code Not Found</h1>
                    <p className="text-slate-600">
                        This QR code doesn't exist or has been deactivated.
                    </p>
                </div>
            </div>
        );
    }

    // Handle inactive QR codes
    if (!qrCode.isActive) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center space-y-4 p-8">
                    <div className="text-6xl">⏸️</div>
                    <h1 className="text-3xl font-bold text-slate-900">QR Code Inactive</h1>
                    <p className="text-slate-600">
                        This QR code has been temporarily disabled.
                    </p>
                </div>
            </div>
        );
    }

    // Handle URL type with instant redirect (this shouldn't happen as backend handles it)
    if (qrCode.type === 'url') {
        const urlDetails = qrCode.payload?.url_details;
        const redirectSettings = qrCode.payload?.redirect_settings;

        // If show_preview is false, the backend should have already redirected
        // But as a fallback, we handle it here too
        if (redirectSettings?.show_preview === false && urlDetails?.destination_url) {
            redirect(urlDetails.destination_url);
        }
    }

    // For URL type with preview enabled, show landing page
    if (qrCode.type === 'url') {
        return <SmartLandingPage qrCode={qrCode} />;
    }

    // For other QR code types (menu, vcard, etc.), redirect to their respective pages
    // This will be implemented in future phases
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-center space-y-4 p-8">
                <div className="text-6xl">🚧</div>
                <h1 className="text-3xl font-bold text-slate-900">Coming Soon</h1>
                <p className="text-slate-600">
                    Landing pages for {qrCode.type} QR codes are coming soon!
                </p>
            </div>
        </div>
    );
}
