import { prioritizeSchema } from '../schemas/task.schema.js';
import { prioritizeWithGemini } from '../services/gemini.service.js';

export const prioritizeRoutes = async (app) => {
  app.post('/prioritize', async (request) => {
    const payload = prioritizeSchema.parse(request.body);
    return prioritizeWithGemini(payload);
  });
};
