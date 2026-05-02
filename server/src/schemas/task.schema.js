import { z } from 'zod';

export const taskCategorySchema = z.enum(['Coding', 'Documentation', 'Admin', 'Learning']);
export const taskStatusSchema = z.enum(['Backlog', 'In-Progress', 'Completed']);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional().default(''),
  difficulty: z.number().int().min(1).max(5),
  estimatedTime: z.number().int().min(0),
  category: taskCategorySchema,
  status: taskStatusSchema.optional().default('Backlog')
});

export const updateTaskSchema = createTaskSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field is required'
});

export const taskIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i)
});

export const prioritizeTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().optional().default(''),
  difficulty: z.number().int().min(1).max(5),
  estimatedTime: z.number().int().min(0),
  category: taskCategorySchema,
  status: taskStatusSchema,
  createdAt: z.coerce.date().optional()
});

export const prioritizeSchema = z.object({
  currentEnergy: z.number().int().min(1).max(10),
  tasks: z.array(prioritizeTaskSchema).min(1)
});

export const geminiPriorityResponseSchema = z.object({
  sortedIds: z.array(z.string().min(1)),
  reasoning: z.string().min(1)
});
