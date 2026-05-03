import Fastify from 'fastify';
import cors from '@fastify/cors';
import { ZodError } from 'zod';
import { taskRoutes } from './routes/task.routes.js';
import { prioritizeRoutes } from './routes/prioritize.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { authPlugin } from './plugins/auth.plugin.js';

export const createApp = async () => {
  const app = Fastify({
    logger: true
  });

  await app.register(cors, {
    origin: true
  });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        message: 'Validation failed',
        issues: error.issues
      });
    }

    request.log.error(error);

    return reply.code(500).send({
      message: 'Internal server error',
      error: error.message,
      stack: error.stack
    });
  });

  app.get('/health', async () => ({
    ok: true
  }));

  await app.register(authPlugin);
  await app.register(authRoutes);
  await app.register(taskRoutes);
  await app.register(prioritizeRoutes);

  return app;
};
