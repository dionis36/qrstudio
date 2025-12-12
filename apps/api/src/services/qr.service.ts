import { prisma } from '../lib/prisma';
import { nanoid } from 'nanoid';

export interface CreateQrCodeData {
    type: string;
    name: string;
    payload?: any;
    design?: any;
}

export interface UpdateQrCodeData {
    name?: string;
    payload?: any;
    design?: any;
    isActive?: boolean;
}

export class QrService {
    /**
     * Generate a unique 8-character shortcode
     */
    private async generateShortcode(): Promise<string> {
        let shortcode: string;
        let exists = true;

        // Keep generating until we get a unique one
        while (exists) {
            shortcode = nanoid(8);
            const existing = await prisma.qrCode.findUnique({
                where: { shortcode },
            });
            exists = !!existing;
        }

        return shortcode!;
    }

    /**
     * Create a new QR code
     */
    async createQrCode(userId: string, data: CreateQrCodeData) {
        const shortcode = await this.generateShortcode();

        const qrCode = await prisma.qrCode.create({
            data: {
                shortcode,
                type: data.type,
                name: data.name,
                payload: data.payload,
                design: data.design,
                userId,
            },
            include: {
                _count: {
                    select: { scans: true },
                },
            },
        });

        return qrCode;
    }

    /**
     * Get all QR codes for a user with pagination and filters
     */
    async getUserQrCodes(
        userId: string,
        options: {
            page?: number;
            limit?: number;
            type?: string;
            search?: string;
            isActive?: boolean;
        } = {}
    ) {
        const { page = 1, limit = 10, type, search, isActive } = options;
        const skip = (page - 1) * limit;

        const where: any = { userId };

        if (type) where.type = type;
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        if (isActive !== undefined) where.isActive = isActive;

        const [qrCodes, total] = await Promise.all([
            prisma.qrCode.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { scans: true },
                    },
                },
            }),
            prisma.qrCode.count({ where }),
        ]);

        return {
            data: qrCodes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get a specific QR code by ID
     */
    async getQrCodeById(id: string, userId: string) {
        const qrCode = await prisma.qrCode.findFirst({
            where: { id, userId },
            include: {
                _count: {
                    select: { scans: true },
                },
            },
        });

        if (!qrCode) {
            throw new Error('QR code not found');
        }

        return qrCode;
    }

    /**
     * Get QR code by shortcode (public, no auth required)
     */
    async getQrCodeByShortcode(shortcode: string) {
        const qrCode = await prisma.qrCode.findUnique({
            where: { shortcode },
        });

        if (!qrCode || !qrCode.isActive) {
            throw new Error('QR code not found or inactive');
        }

        return qrCode;
    }

    /**
     * Update a QR code
     */
    async updateQrCode(id: string, userId: string, data: UpdateQrCodeData) {
        // Verify ownership
        const existing = await this.getQrCodeById(id, userId);

        const qrCode = await prisma.qrCode.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.payload && { payload: data.payload }),
                ...(data.design && { design: data.design }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
                updatedAt: new Date(),
            },
            include: {
                _count: {
                    select: { scans: true },
                },
            },
        });

        return qrCode;
    }

    /**
     * Delete a QR code (hard delete - permanently removes from database)
     */
    async deleteQrCode(id: string, userId: string) {
        // Verify ownership
        await this.getQrCodeById(id, userId);

        // Hard delete - actually remove from database
        await prisma.qrCode.delete({
            where: { id },
        });

        return { success: true };
    }

    /**
     * Get dashboard stats for a user
     */
    async getDashboardStats(userId: string) {
        const [totalQrCodes, activeQrCodes, totalScans] = await Promise.all([
            prisma.qrCode.count({ where: { userId } }),
            prisma.qrCode.count({ where: { userId, isActive: true } }),
            prisma.scan.count({
                where: {
                    qrCode: { userId },
                },
            }),
        ]);

        // Get scans from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentScans = await prisma.scan.count({
            where: {
                qrCode: { userId },
                scannedAt: { gte: sevenDaysAgo },
            },
        });

        return {
            totalQrCodes,
            activeQrCodes,
            totalScans,
            recentScans,
        };
    }
}

export const qrService = new QrService();
