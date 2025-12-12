import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { routes } from './routes/index';
import { redirectRoutes } from './routes/redirect.routes';

const app = Fastify({ logger: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
});
app.register(multipart);

// Register redirect routes at root level (for shortcode resolution)
// These handle /:shortcode and should come before /api routes
app.register(redirectRoutes);

// Register API routes with /api prefix
app.register(routes, { prefix: '/api' });

app.get('/', async () => {
    return { status: 'ok', service: 'qr-studio-api' };
});

const start = async () => {
    try {
        const port = parseInt(process.env.PORT || '3001');
        await app.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on port ${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
