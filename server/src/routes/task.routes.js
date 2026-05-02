import { Task } from '../models/task.model.js';
import { createTaskSchema, taskIdParamsSchema, updateTaskSchema } from '../schemas/task.schema.js';

const parseBody = (schema, request) => schema.parse(request.body);
const parseParams = (schema, request) => schema.parse(request.params);

export const taskRoutes = async (app) => {
  app.get('/tasks', async () => {
    return Task.find().sort({ createdAt: -1 });
  });

  app.get('/tasks/:id', async (request, reply) => {
    const { id } = parseParams(taskIdParamsSchema, request);
    const task = await Task.findById(id);

    if (!task) {
      return reply.code(404).send({
        message: 'Task not found'
      });
    }

    return task;
  });

  app.post('/tasks', async (request, reply) => {
    const payload = parseBody(createTaskSchema, request);
    const task = await Task.create(payload);
    return reply.code(201).send(task);
  });

  app.patch('/tasks/:id', async (request, reply) => {
    const { id } = parseParams(taskIdParamsSchema, request);
    const payload = parseBody(updateTaskSchema, request);
    const task = await Task.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return reply.code(404).send({
        message: 'Task not found'
      });
    }

    return task;
  });

  app.delete('/tasks/:id', async (request, reply) => {
    const { id } = parseParams(taskIdParamsSchema, request);
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return reply.code(404).send({
        message: 'Task not found'
      });
    }

    return reply.code(204).send();
  });
};
