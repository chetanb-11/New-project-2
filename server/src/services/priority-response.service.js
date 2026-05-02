import { geminiPriorityResponseSchema } from '../schemas/task.schema.js';

export const extractJson = (text) => {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```json\s*([\s\S]*?)\s*```/i);
  const objectMatch = trimmed.match(/\{[\s\S]*\}/);
  const candidate = fenced ? fenced[1] : objectMatch ? objectMatch[0] : trimmed;
  return JSON.parse(candidate);
};

export const normalizeSortedIds = (tasks, sortedIds) => {
  const allowedIds = new Set(tasks.map((task) => task.id));
  const acceptedIds = [];

  for (const id of sortedIds) {
    if (allowedIds.has(id) && !acceptedIds.includes(id)) {
      acceptedIds.push(id);
    }
  }

  const missingIds = tasks.map((task) => task.id).filter((id) => !acceptedIds.includes(id));
  return [...acceptedIds, ...missingIds];
};

export const parseGeminiPriorityResponse = (text, tasks) => {
  const parsed = geminiPriorityResponseSchema.parse(extractJson(text));

  return {
    sortedIds: normalizeSortedIds(tasks, parsed.sortedIds),
    reasoning: parsed.reasoning
  };
};
