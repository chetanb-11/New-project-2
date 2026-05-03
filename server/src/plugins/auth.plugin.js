import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { env } from '../config/env.js';

export const authPlugin = fp(async (fastify, opts) => {
  fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET
  });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ message: 'Unauthorized', error: err.message });
    }
  });
});
