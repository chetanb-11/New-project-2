import { User } from '../models/user.model.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

export const authRoutes = async (fastify, options) => {
  fastify.post('/auth/register', { schema: registerSchema }, async (request, reply) => {
    const { username, email, password } = request.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return reply.code(409).send({ message: 'Username or email already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = fastify.jwt.sign({ id: user.id }, { expiresIn: '7d' });

    return reply.code(201).send({
      message: 'User registered successfully',
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  });

  fastify.post('/auth/login', { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    if (!user) {
      return reply.code(401).send({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return reply.code(401).send({ message: 'Invalid email or password' });
    }

    const token = fastify.jwt.sign({ id: user.id }, { expiresIn: '7d' });

    return reply.send({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  });
};
