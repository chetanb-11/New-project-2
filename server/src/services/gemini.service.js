import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';
import { parseGeminiPriorityResponse } from './priority-response.service.js';
import { sortTasksByFlow } from '../utils/flow.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const buildPriorityPrompt = (tasks, currentEnergy, baselineOrder) => {
  return JSON.stringify({
    instruction: 'Refine this task priority order for the current mental energy. Return only JSON. sortedIds must contain every task id exactly once. Prefer tasks whose difficulty and duration match the current energy while respecting the baseline Flow score.',
    currentEnergy,
    baselineOrder,
    tasks: tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      difficulty: task.difficulty,
      estimatedTime: task.estimatedTime,
      category: task.category,
      status: task.status
    })),
    responseShape: {
      sortedIds: ['task-id'],
      reasoning: 'brief natural language reasoning'
    }
  });
};

export const prioritizeWithGemini = async ({ tasks, currentEnergy }) => {
  const baselineTasks = sortTasksByFlow(tasks, currentEnergy);
  const baselineOrder = baselineTasks.map((task) => task.id);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const result = await model.generateContent(buildPriorityPrompt(tasks, currentEnergy, baselineOrder));
    const text = result.response.text();
    const parsed = parseGeminiPriorityResponse(text, tasks);

    const orderedTasks = parsed.sortedIds.map((id) => tasks.find((t) => t.id === id)).filter(Boolean);

    return {
      orderedTasks,
      reasoning: parsed.reasoning,
      geminiFailed: false
    };
  } catch (error) {
    return {
      orderedTasks: baselineTasks,
      reasoning: 'Gemini prioritization was unavailable, so the local Flow score order was used.',
      geminiFailed: true,
      error: error.message
    };
  }
};
