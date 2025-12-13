import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { qrService } from '../services/qr.service';
import { authMiddleware } from '../middleware/auth';

// Validation schemas
const createQrSchema = z.object({
    type: z.enum(['menu', 'vcard', 'url', 'text', 'wifi', 'file', 'event']),
    name: z.string().min(1).max(100),
    payload: z.any(),
    design: z.any(),
});

const updateQrSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    payload: z.any().optional(),
    design: z.any().optional(),
    isActive: z.boolean().optional(),
});

const listQrSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    type: z.string().optional(),
    search: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
});

export async function qrRoutes(fastify: FastifyInstance) {
    // Create QR code
    fastify.post(
        '/qrcodes',
        { preHandler: authMiddleware },
        async (request, reply) => {
            try {
                const userId = (request as any).userId;
                const data = createQrSchema.parse(request.body);

                const qrCode = await qrService.createQrCode(userId, data);

                return reply.code(201).send({
                    success: true,
                    data: qrCode,
                });
            } catch (error: any) {
                return reply.code(400).send({
                    success: false,
                    error: error.message,
                });
            }
        }
    );

    // List user's QR codes
    fastify.get(
        '/qrcodes',
        { preHandler: authMiddleware },
        async (request, reply) => {
            try {
                const userId = (request as any).userId;
                const query = listQrSchema.parse(request.query);

                const result = await qrService.getUserQrCodes(userId, query);

                return reply.send({
                    success: true,
                    ...result,
                });
            } catch (error: any) {
                return reply.code(400).send({
                    success: false,
                    error: error.message,
                });
            }
        }
    );

    // Get specific QR code
    fastify.get<{ Params: { id: string } }>(
        '/qrcodes/:id',
        { preHandler: authMiddleware },
        async (request, reply) => {
            try {
                const userId = (request as any).userId;
                const { id } = request.params;

                const qrCode = await qrService.getQrCodeById(id, userId);

                return reply.send({
                    success: true,
                    data: qrCode,
                });
            } catch (error: any) {
                return reply.code(404).send({
                    success: false,
                    error: error.message,
                });
            }
        }
    );

    // Update QR code
    fastify.patch<{ Params: { id: string } }>(
        '/qrcodes/:id',
        { preHandler: authMiddleware },
        async (request, reply) => {
            try {
                const userId = (request as any).userId;
                const { id } = request.params;
                const data = updateQrSchema.parse(request.body);

                const qrCode = await qrService.updateQrCode(id, userId, data);

                return reply.send({
                    success: true,
                    data: qrCode,
                });
            } catch (error: any) {
                return reply.code(400).send({
                    success: false,
                    error: error.message,
                });
            }
        }
    );

    // Delete QR code
    fastify.delete<{ Params: { id: string } }>(
        '/qrcodes/:id',
        { preHandler: authMiddleware },
        async (request, reply) => {
            try {
                const userId = (request as any).userId;
                const { id } = request.params;

                await qrService.deleteQrCode(id, userId);

                return reply.send({
                    success: true,
                    message: 'QR code deleted successfully',
                });
            } catch (error: any) {
                return reply.code(400).send({
                    success: false,
                    error: error.message,
                });
            }
        }
    );

    // Get dashboard stats
    fastify.get(
        '/dashboard/stats',
        { preHandler: authMiddleware },
        async (request, reply) => {
            try {
                const userId = (request as any).userId;

                const stats = await qrService.getDashboardStats(userId);

                return reply.send({
                    success: true,
                    data: stats,
                });
            } catch (error: any) {
                return reply.code(400).send({
                    success: false,
                    error: error.message,
                });
            }
        }
    );

    // Public: Get QR code by shortcode
    fastify.get<{ Params: { shortcode: string } }>(
        '/q/:shortcode',
        async (request, reply) => {
            try {
                const { shortcode } = request.params;

                const qrCode = await qrService.getQrCodeByShortcode(shortcode);

                return reply.send({
                    success: true,
                    data: qrCode,
                });
            } catch (error: any) {
                return reply.code(404).send({
                    success: false,
                    error: error.message,
                });
            }
        }
    );
}
