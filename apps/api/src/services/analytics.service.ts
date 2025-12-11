import { prisma } from '../lib/prisma';
import crypto from 'crypto';

export interface ScanMetadata {
    country?: string;
    city?: string;
    device?: string;
    os?: string;
    browser?: string;
    ipAddress?: string;
}

export class AnalyticsService {
    /**
     * Hash IP address for privacy
     */
    private hashIp(ip: string): string {
        return crypto.createHash('sha256').update(ip).digest('hex');
    }

    /**
     * Record a scan event
     */
    async recordScan(shortcode: string, metadata: ScanMetadata) {
        // Get QR code
        const qrCode = await prisma.qrCode.findUnique({
            where: { shortcode },
        });

        if (!qrCode) {
            throw new Error('QR code not found');
        }

        // Create scan record
        const scan = await prisma.scan.create({
            data: {
                qrCodeId: qrCode.id,
                country: metadata.country,
                city: metadata.city,
                device: metadata.device,
                os: metadata.os,
                browser: metadata.browser,
                ipHash: metadata.ipAddress ? this.hashIp(metadata.ipAddress) : undefined,
            },
        });

        return scan;
    }

    /**
     * Get analytics for a specific QR code
     */
    async getQrAnalytics(
        qrCodeId: string,
        userId: string,
        dateRange?: { start: Date; end: Date }
    ) {
        // Verify ownership
        const qrCode = await prisma.qrCode.findFirst({
            where: { id: qrCodeId, userId },
        });

        if (!qrCode) {
            throw new Error('QR code not found');
        }

        const where: any = { qrCodeId };
        if (dateRange) {
            where.scannedAt = {
                gte: dateRange.start,
                lte: dateRange.end,
            };
        }

        // Get total scans
        const totalScans = await prisma.scan.count({ where });

        // Get scans over time (daily)
        const scansOverTime = await prisma.scan.groupBy({
            by: ['scannedAt'],
            where,
            _count: true,
            orderBy: { scannedAt: 'asc' },
        });

        // Group by day
        const scansByDay = scansOverTime.reduce((acc: Record<string, number>, scan: { scannedAt: Date; _count: number }) => {
            const date = scan.scannedAt.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + scan._count;
            return acc;
        }, {});

        // Get device breakdown
        const deviceBreakdown = await prisma.scan.groupBy({
            by: ['device'],
            where,
            _count: true,
        });

        // Get OS breakdown
        const osBreakdown = await prisma.scan.groupBy({
            by: ['os'],
            where,
            _count: true,
        });

        // Get browser breakdown
        const browserBreakdown = await prisma.scan.groupBy({
            by: ['browser'],
            where,
            _count: true,
        });

        // Get geographic distribution
        const countryBreakdown = await prisma.scan.groupBy({
            by: ['country'],
            where,
            _count: true,
            orderBy: { _count: { country: 'desc' } },
        });

        return {
            totalScans,
            scansByDay,
            deviceBreakdown: deviceBreakdown.map((d: { device: string | null; _count: number }) => ({
                device: d.device || 'Unknown',
                count: d._count,
            })),
            osBreakdown: osBreakdown.map((o: { os: string | null; _count: number }) => ({
                os: o.os || 'Unknown',
                count: o._count,
            })),
            browserBreakdown: browserBreakdown.map((b: { browser: string | null; _count: number }) => ({
                browser: b.browser || 'Unknown',
                count: b._count,
            })),
            countryBreakdown: countryBreakdown.map((c: { country: string | null; _count: number }) => ({
                country: c.country || 'Unknown',
                count: c._count,
            })),
        };
    }

    /**
     * Get recent scans for dashboard
     */
    async getRecentScans(userId: string, limit: number = 10) {
        const scans = await prisma.scan.findMany({
            where: {
                qrCode: { userId },
            },
            take: limit,
            orderBy: { scannedAt: 'desc' },
            include: {
                qrCode: {
                    select: {
                        name: true,
                        type: true,
                        shortcode: true,
                    },
                },
            },
        });

        return scans;
    }
}

export const analyticsService = new AnalyticsService();
