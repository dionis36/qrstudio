import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { analyticsService } from '../services/analytics.service';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

// Validation schemas
const analyticsQuerySchema = z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});

const scanMetadataSchema = z.object({
    country: z.string().optional(),
    city: z.string().optional(),
    device: z.string().optional(),
    os: z.string().optional(),
    browser: z.string().optional(),
});

export async function analyticsRoutes(fastify: FastifyInstance) {
    // Get analytics for a specific QR code
    fastify.get<{ Params: { id: string } }>(
        '/analytics/qrcodes/:id',
        { preHandler: authMiddleware },
        async (request, reply: FastifyReply) => {
            try {
                const userId = (request as any).userId;
                const { id } = request.params;
                const query = analyticsQuerySchema.parse(request.query);

                const dateRange = query.startDate && query.endDate
                    ? { start: new Date(query.startDate), end: new Date(query.endDate) }
                    : undefined;

                const analytics = await analyticsService.getQrAnalytics(id, userId, dateRange);

                return reply.send({
                    success: true,
                    data: analytics,
                });
            } catch (error: any) {
                return reply.code(400).send({
                    success: false,
                    error: error.message,
                });
            }
        }
    );

    // Get recent scans for dashboard
    fastify.get(
        '/analytics/recent-scans',
        { preHandler: authMiddleware },
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const userId = (request as any).userId;

                const scans = await analyticsService.getRecentScans(userId, 10);

                return reply.send({
                    success: true,
                    data: scans,
                });
            } catch (error: any) {
                return reply.code(400).send({
                    success: false,
                    error: error.message,
                });
            }
        }
    );

    // Record a scan (public endpoint, called when QR is scanned)
    fastify.post<{ Params: { shortcode: string } }>(
        '/analytics/scan/:shortcode',
        { preHandler: optionalAuthMiddleware },
        async (request, reply: FastifyReply) => {
            try {
                const { shortcode } = request.params;
                const metadata = scanMetadataSchema.parse(request.body);

                // Get IP from request
                const ipAddress = request.ip;

                const scan = await analyticsService.recordScan(shortcode, {
                    ...metadata,
                    ipAddress,
                });

                return reply.code(201).send({
                    success: true,
                    data: { id: scan.id },
                });
            } catch (error: any) {
                return reply.code(400).send({
                    success: false,
                    error: error.message,
                });
            }
        }
    );
}
