import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Auth middleware for microservice architecture
 * Expects user ID to be passed from parent service via header
 */
export async function authMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const headerName = process.env.AUTH_HEADER_NAME || 'x-user-id';
    const userId = request.headers[headerName] as string;

    if (!userId) {
        return reply.code(401).send({
            error: 'Unauthorized',
            message: 'User ID header missing. This service must be called through the parent auth gateway.'
        });
    }

    // Attach userId to request for use in handlers
    (request as any).userId = userId;
}

/**
 * Optional auth middleware - doesn't fail if no user ID
 * Used for public endpoints that can work with or without auth
 */
export async function optionalAuthMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const headerName = process.env.AUTH_HEADER_NAME || 'x-user-id';
    const userId = request.headers[headerName] as string;

    if (userId) {
        (request as any).userId = userId;
    }
}
