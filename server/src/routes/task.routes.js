import { Task } from '../models/task.model.js';
import { createTaskSchema, taskIdParamsSchema, updateTaskSchema } from '../schemas/task.schema.js';

const parseBody = (schema, request) => schema.parse(request.body);
const parseParams = (schema, request) => schema.parse(request.params);

export const taskRoutes = async (app) => {
  app.get('/tasks', { onRequest: [app.authenticate] }, async (request) => {
    return Task.find({ owner: request.user.id }).sort({ createdAt: -1 });
  });

  app.get('/tasks/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = parseParams(taskIdParamsSchema, request);
    const task = await Task.findOne({ _id: id, owner: request.user.id });

    if (!task) {
      return reply.code(404).send({
        message: 'Task not found'
      });
    }

    return task;
  });

  app.post('/tasks', { onRequest: [app.authenticate] }, async (request, reply) => {
    const payload = parseBody(createTaskSchema, request);
    payload.owner = request.user.id;
    const task = await Task.create(payload);
    return reply.code(201).send(task);
  });

  app.put('/tasks/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = parseParams(taskIdParamsSchema, request);
    const payload = parseBody(updateTaskSchema, request);
    
    const task = await Task.findOne({ _id: id, owner: request.user.id });
    if (!task) {
      return reply.code(404).send({
        message: 'Task not found'
      });
    }

    if (task.status === 'In-Progress' && payload.status && payload.status !== 'In-Progress') {
      if (task.lastStartedAt) {
        const elapsedTime = (Date.now() - new Date(task.lastStartedAt).getTime()) / 60000;
        payload.actualTimeSpent = (task.actualTimeSpent || 0) + elapsedTime;
      }
      payload.lastStartedAt = null;
    } else if (task.status !== 'In-Progress' && payload.status === 'In-Progress') {
      payload.lastStartedAt = new Date();
    }

    const updatedTask = await Task.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    return updatedTask;
  });

  app.delete('/tasks/:id', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { id } = parseParams(taskIdParamsSchema, request);
    const task = await Task.findOneAndDelete({ _id: id, owner: request.user.id });

    if (!task) {
      return reply.code(404).send({
        message: 'Task not found'
      });
    }

    return reply.code(204).send();
  });
};
