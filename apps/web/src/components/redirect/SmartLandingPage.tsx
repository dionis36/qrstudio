'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, ArrowRight, Loader2 } from 'lucide-react';

interface SmartLandingPageProps {
    qrCode: {
        id: string;
        type: string;
        name: string;
        shortcode: string;
        payload: {
            url_details?: {
                destination_url: string;
                title?: string;
                description?: string;
                logo?: string;
            };
            redirect_settings?: {
                delay: number;
                show_preview: boolean;
                custom_message?: string;
            };
            styles?: {
                primary_color?: string;
                secondary_color?: string;
                gradient_type?: 'none' | 'linear' | 'radial';
                gradient_angle?: number;
            };
        };
    };
}

export function SmartLandingPage({ qrCode }: SmartLandingPageProps) {
    const urlDetails = qrCode.payload?.url_details;
    const redirectSettings = qrCode.payload?.redirect_settings;
    const styles = qrCode.payload?.styles;

    const destinationUrl = urlDetails?.destination_url || '';
    const delay = redirectSettings?.delay || 2;
    const customMessage = redirectSettings?.custom_message || '';

    const [countdown, setCountdown] = useState(delay);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if (delay === 0) {
            // Instant redirect
            window.location.href = destinationUrl;
            return;
        }

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setRedirecting(true);
                    window.location.href = destinationUrl;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [delay, destinationUrl]);

    const getBackgroundStyle = () => {
        const primary = styles?.primary_color || '#2563EB';
        const secondary = styles?.secondary_color || '#EFF6FF';
        const gradientType = styles?.gradient_type || 'none';
        const angle = styles?.gradient_angle || 135;

        if (gradientType === 'linear') {
            return {
                background: `linear-gradient(${angle}deg, ${primary}, ${secondary})`,
            };
        } else if (gradientType === 'radial') {
            return {
                background: `radial-gradient(circle, ${primary}, ${secondary})`,
            };
        } else {
            return {
                backgroundColor: secondary,
            };
        }
    };

    return (
        <div
            className="min-h-screen w-full flex flex-col items-center justify-center p-6"
            style={getBackgroundStyle()}
        >
            <div className="w-full max-w-md space-y-8">
                {/* Logo */}
                {urlDetails?.logo && (
                    <div className="flex justify-center">
                        <img
                            src={urlDetails.logo}
                            alt="Logo"
                            className="h-20 w-20 object-contain rounded-xl bg-white/90 p-2 shadow-lg"
                        />
                    </div>
                )}

                {/* Title & Description */}
                {(urlDetails?.title || urlDetails?.description) && (
                    <div className="text-center space-y-2">
                        {urlDetails.title && (
                            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                                {urlDetails.title}
                            </h1>
                        )}
                        {urlDetails.description && (
                            <p className="text-lg text-white/90 drop-shadow">
                                {urlDetails.description}
                            </p>
                        )}
                    </div>
                )}

                {/* Redirect Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl space-y-6">
                    {/* Loading Indicator */}
                    <div className="flex items-center justify-center gap-3">
                        {redirecting ? (
                            <Loader2 className="w-6 h-6 animate-spin" style={{ color: styles?.primary_color || '#2563EB' }} />
                        ) : (
                            <div
                                className="w-6 h-6 rounded-full border-4 border-t-transparent animate-spin"
                                style={{ borderColor: styles?.primary_color || '#2563EB', borderTopColor: 'transparent' }}
                            />
                        )}
                        {customMessage && (
                            <p className="text-slate-700 font-semibold text-lg">
                                {customMessage}
                            </p>
                        )}
                    </div>

                    {/* Countdown */}
                    {delay > 0 && countdown > 0 && (
                        <div className="text-center">
                            <div
                                className="inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl font-bold text-white shadow-lg"
                                style={{ backgroundColor: styles?.primary_color || '#2563EB' }}
                            >
                                {countdown}
                            </div>
                            <p className="text-sm text-slate-500 mt-2">seconds</p>
                        </div>
                    )}

                    {/* Destination URL */}
                    <div className="flex items-center gap-2 text-sm text-slate-600 justify-center">
                        <ExternalLink className="w-4 h-4" />
                        <span className="font-mono truncate max-w-xs">
                            {new URL(destinationUrl).hostname}
                        </span>
                    </div>

                    {/* Manual Link */}
                    <a
                        href={destinationUrl}
                        className="flex items-center justify-center gap-2 text-sm font-semibold hover:underline transition-colors py-3 px-6 rounded-lg border-2 hover:bg-slate-50"
                        style={{
                            color: styles?.primary_color || '#2563EB',
                            borderColor: styles?.primary_color || '#2563EB',
                        }}
                    >
                        Click here if not redirected
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

                {/* Footer Branding */}
                <div className="text-center">
                    <p className="text-sm text-white/70 drop-shadow">
                        Powered by <span className="font-semibold">QR Studio</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
