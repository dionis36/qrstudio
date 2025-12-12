import { FastifyInstance } from 'fastify';
import { qrRoutes } from './qr.routes';
import { analyticsRoutes } from './analytics.routes';
import { redirectRoutes } from './redirect.routes';

export async function routes(fastify: FastifyInstance) {
    // Register QR code routes
    fastify.register(qrRoutes);

    // Register analytics routes
    fastify.register(analyticsRoutes);

    // Register redirect routes (no /api prefix - handled at root level)
    // This will be registered separately in app.ts

    // Health check
    fastify.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });
}
