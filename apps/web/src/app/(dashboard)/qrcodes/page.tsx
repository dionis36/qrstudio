'use client';

import { useEffect, useState } from 'react';
import { qrApi } from '@/lib/api-client';
import { Search, Filter, QrCode, Eye, Edit, Trash2, Download, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface QrCodeItem {
    id: string;
    shortcode: string;
    type: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    _count: {
        scans: number;
    };
}

export default function QrCodesPage() {
    const router = useRouter();
    const [qrCodes, setQrCodes] = useState<QrCodeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadQrCodes();
    }, [page, search, typeFilter]);

    async function loadQrCodes() {
        try {
            setLoading(true);
            const response = await qrApi.list({
                page,
                limit: 10,
                search: search || undefined,
                type: typeFilter || undefined,
            });

            if (response.success) {
                setQrCodes(response.data);
                setTotalPages(response.pagination.totalPages);
            }
        } catch (error) {
            console.error('Failed to load QR codes:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this QR code?')) return;

        try {
            await qrApi.delete(id);
            loadQrCodes(); // Reload list
        } catch (error) {
            console.error('Failed to delete QR code:', error);
            alert('Failed to delete QR code');
        }
    }

    function getTypeColor(type: string) {
        const colors: Record<string, string> = {
            menu: 'bg-orange-100 text-orange-700',
            vcard: 'bg-blue-100 text-blue-700',
            url: 'bg-green-100 text-green-700',
            text: 'bg-purple-100 text-purple-700',
            wifi: 'bg-cyan-100 text-cyan-700',
            pdf: 'bg-red-100 text-red-700',
        };
        return colors[type] || 'bg-slate-100 text-slate-700';
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">QR Codes</h1>
                        <p className="text-slate-600 mt-2">Manage all your QR codes in one place</p>
                    </div>
                    <Link
                        href="/create"
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <QrCode className="w-5 h-5" />
                        Create New
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search QR codes..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                value={typeFilter}
                                onChange={(e) => {
                                    setTypeFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                            >
                                <option value="">All Types</option>
                                <option value="menu">Menu</option>
                                <option value="vcard">vCard</option>
                                <option value="url">URL</option>
                                <option value="text">Text</option>
                                <option value="wifi">Wi-Fi</option>
                                <option value="pdf">PDF</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* QR Codes Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : qrCodes.length === 0 ? (
                        <div className="text-center py-12">
                            <QrCode className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No QR codes found</h3>
                            <p className="text-slate-600 mb-6">Create your first QR code to get started</p>
                            <Link
                                href="/create"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                <QrCode className="w-5 h-5" />
                                Create QR Code
                            </Link>
                        </div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Name</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Type</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Scans</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Created</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {qrCodes.map((qr) => (
                                        <tr
                                            key={qr.id}
                                            onClick={() => router.push(`/qrcodes/${qr.id}/analytics`)}
                                            className="hover:bg-slate-50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                        <QrCode className="w-5 h-5 text-slate-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{qr.name}</p>
                                                        <p className="text-sm text-slate-500">qrstudio.app/q/{qr.shortcode}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(qr.type)}`}>
                                                    {qr.type.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-900 font-medium">{qr._count.scans}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${qr.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {qr.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {new Date(qr.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/qrcodes/${qr.id}`}
                                                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/create/${qr.type}?edit=${qr.id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(qr.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                                    <p className="text-sm text-slate-600">
                                        Page {page} of {totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
