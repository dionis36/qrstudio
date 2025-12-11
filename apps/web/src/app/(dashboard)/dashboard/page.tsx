'use client';

import { useEffect, useState } from 'react';
import { qrApi } from '@/lib/api-client';
import { BarChart3, QrCode, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
    totalQrCodes: number;
    activeQrCodes: number;
    totalScans: number;
    recentScans: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        try {
            const response = await qrApi.getDashboardStats();
            if (response.success && response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-600 mt-2">Welcome back! Here's your QR code overview.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total QR Codes */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total QR Codes</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stats?.totalQrCodes || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <QrCode className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Active QR Codes */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Active QR Codes</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{stats?.activeQrCodes || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Activity className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Total Scans */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total Scans</p>
                                <p className="text-3xl font-bold text-purple-600 mt-2">{stats?.totalScans || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    {/* Recent Scans (Last 7 Days) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Last 7 Days</p>
                                <p className="text-3xl font-bold text-orange-600 mt-2">{stats?.recentScans || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/create"
                            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                        >
                            <QrCode className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-900">Create New QR Code</span>
                        </Link>
                        <Link
                            href="/qrcodes"
                            className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                        >
                            <BarChart3 className="w-5 h-5 text-slate-600" />
                            <span className="font-medium text-slate-900">View All QR Codes</span>
                        </Link>
                        <Link
                            href="/qrcodes?filter=active"
                            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                        >
                            <Activity className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-900">Active QR Codes</span>
                        </Link>
                    </div>
                </div>

                {/* Getting Started */}
                {stats?.totalQrCodes === 0 && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
                        <h2 className="text-2xl font-bold mb-2">Get Started with QR Studio</h2>
                        <p className="text-blue-100 mb-6">
                            Create your first QR code in seconds! Choose from menu, vCard, URL, and more.
                        </p>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                            <QrCode className="w-5 h-5" />
                            Create Your First QR Code
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
