import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CreateQrSchema, CreateQrDto } from './qr.schema';
import { QrService } from './qr.service';

export async function qrRoutes(fastify: FastifyInstance) {
    const service = new QrService();

    // Use withTypeProvider for Zod integration
    fastify.withTypeProvider<ZodTypeProvider>().post('/', {
        schema: {
            body: CreateQrSchema,
        },
    }, async (request, reply) => {
        // request.body is now strictly typed as CreateQrDto
        const result = await service.create(request.body);
        return reply.code(201).send(result);
    });
}
