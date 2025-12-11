'use client';

import { useEffect, useState } from 'react';
import { qrApi } from '@/lib/api-client';
import { ArrowLeft, Download, Edit, Trash2, QrCode as QrCodeIcon, BarChart3, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QRCodeStyling from 'qr-code-styling';

interface QrCodeDetail {
    id: string;
    shortcode: string;
    type: string;
    name: string;
    payload: any;
    design: any;
    isActive: boolean;
    createdAt: string;
    _count: {
        scans: number;
    };
}

export default function QrCodeDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [qrCode, setQrCode] = useState<QrCodeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [qrCodeInstance, setQrCodeInstance] = useState<QRCodeStyling | null>(null);

    useEffect(() => {
        loadQrCode();
    }, [params.id]);

    async function loadQrCode() {
        try {
            const response = await qrApi.getById(params.id);
            if (response.success && response.data) {
                setQrCode(response.data);
                generateQrCode(response.data);
            }
        } catch (error) {
            console.error('Failed to load QR code:', error);
        } finally {
            setLoading(false);
        }
    }

    function generateQrCode(data: QrCodeDetail) {
        const qrUrl = `https://qrstudio.app/q/${data.shortcode}`;

        const qr = new QRCodeStyling({
            width: 300,
            height: 300,
            data: qrUrl,
            margin: data.design.margin ?? 1,
            qrOptions: {
                errorCorrectionLevel: 'M'
            },
            dotsOptions: {
                color: data.design.dots?.color ?? '#000000',
                type: data.design.dots?.style ?? 'square'
            },
            cornersSquareOptions: {
                color: data.design.cornersSquare?.color ?? data.design.dots?.color ?? '#000000',
                type: data.design.cornersSquare?.style ?? 'square'
            },
            cornersDotOptions: {
                color: data.design.cornersDot?.color ?? data.design.dots?.color ?? '#000000',
                type: data.design.cornersDot?.style ?? 'square'
            },
            backgroundOptions: {
                color: data.design.background?.color === 'transparent' ? 'rgba(0,0,0,0)' : (data.design.background?.color ?? '#ffffff')
            },
            image: data.design.image || undefined,
            imageOptions: {
                crossOrigin: 'anonymous',
                hideBackgroundDots: data.design.imageOptions?.hideBackgroundDots ?? true,
                imageSize: data.design.imageOptions?.imageSize ?? 0.4,
                margin: data.design.imageOptions?.margin ?? 10
            }
        });

        setQrCodeInstance(qr);
    }

    async function handleDownload(format: 'svg' | 'png') {
        if (!qrCodeInstance || !qrCode) return;

        try {
            if (format === 'svg') {
                const blob = await qrCodeInstance.getRawData('svg');
                if (blob && blob instanceof Blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${qrCode.name}.svg`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            } else {
                const blob = await qrCodeInstance.getRawData('png');
                if (blob && blob instanceof Blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${qrCode.name}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            }
        } catch (error) {
            console.error('Failed to download QR code:', error);
            alert('Failed to download QR code');
        }
    }

    async function handleToggleStatus() {
        if (!qrCode) return;

        try {
            await qrApi.update(qrCode.id, { isActive: !qrCode.isActive });
            loadQrCode(); // Reload
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
        }
    }

    async function handleDelete() {
        if (!qrCode || !confirm('Are you sure you want to delete this QR code?')) return;

        try {
            await qrApi.delete(qrCode.id);
            router.push('/qrcodes');
        } catch (error) {
            console.error('Failed to delete QR code:', error);
            alert('Failed to delete QR code');
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!qrCode) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <QrCodeIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">QR Code Not Found</h2>
                    <Link href="/qrcodes" className="text-blue-600 hover:underline">
                        Back to QR Codes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/qrcodes"
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to QR Codes</span>
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{qrCode.name}</h1>
                            <p className="text-slate-600 mt-2">qrstudio.app/q/{qrCode.shortcode}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleToggleStatus}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${qrCode.isActive
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {qrCode.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                {qrCode.isActive ? 'Active' : 'Inactive'}
                            </button>
                            <Link
                                href={`/create/${qrCode.type}/content?edit=${qrCode.id}`}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* QR Code Preview */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">QR Code</h2>
                            <div id="qr-code-container" className="flex justify-center mb-4" ref={(el) => {
                                if (el && qrCodeInstance && !el.hasChildNodes()) {
                                    qrCodeInstance.append(el);
                                }
                            }}></div>
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleDownload('png')}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PNG
                                </button>
                                <button
                                    onClick={() => handleDownload('svg')}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download SVG
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Details & Analytics */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Statistics</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <p className="text-sm text-purple-600 font-medium">Total Scans</p>
                                    <p className="text-3xl font-bold text-purple-900 mt-1">{qrCode._count.scans}</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-600 font-medium">Created</p>
                                    <p className="text-lg font-bold text-blue-900 mt-1">
                                        {new Date(qrCode.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={`/qrcodes/${qrCode.id}/analytics`}
                                className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                            >
                                <BarChart3 className="w-4 h-4" />
                                View Detailed Analytics
                            </Link>
                        </div>

                        {/* Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Details</h2>
                            <dl className="space-y-3">
                                <div>
                                    <dt className="text-sm font-medium text-slate-600">Type</dt>
                                    <dd className="mt-1 text-sm text-slate-900 uppercase font-semibold">{qrCode.type}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-600">Shortcode</dt>
                                    <dd className="mt-1 text-sm text-slate-900 font-mono">{qrCode.shortcode}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-600">Public URL</dt>
                                    <dd className="mt-1">
                                        <a
                                            href={`https://qrstudio.app/q/${qrCode.shortcode}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            https://qrstudio.app/q/{qrCode.shortcode}
                                        </a>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
