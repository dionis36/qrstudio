import { FastifyInstance } from 'fastify';
import { qrRoutes } from './modules/qr/qr.controller';

export async function routes(fastify: FastifyInstance) {
    fastify.get('/health', async () => ({ status: 'ok' }));

    // Modules will be registered here
    fastify.register(qrRoutes, { prefix: '/qrcodes' });
}
