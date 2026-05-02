import assert from 'node:assert/strict';
import { calculateFlowScore, sortTasksByFlow } from '../src/utils/flow.js';
import { normalizeSortedIds, parseGeminiPriorityResponse } from '../src/services/priority-response.service.js';

const tasks = [
  {
    id: 'task-a',
    title: 'Deep implementation',
    description: '',
    difficulty: 5,
    estimatedTime: 20,
    category: 'Coding',
    status: 'Backlog',
    createdAt: '2026-05-01T10:00:00.000Z'
  },
  {
    id: 'task-b',
    title: 'Inbox cleanup',
    description: '',
    difficulty: 1,
    estimatedTime: 10,
    category: 'Admin',
    status: 'Backlog',
    createdAt: '2026-05-01T09:00:00.000Z'
  },
  {
    id: 'task-c',
    title: 'Docs polish',
    description: '',
    difficulty: 2,
    estimatedTime: 15,
    category: 'Documentation',
    status: 'In-Progress',
    createdAt: '2026-05-01T08:00:00.000Z'
  }
];

assert.equal(calculateFlowScore(tasks[0], 3), 0.5);
assert.equal(calculateFlowScore(tasks[0], 6), 3);
assert.equal(calculateFlowScore(tasks[0], 9), 10.5);
assert.deepEqual(sortTasksByFlow(tasks, 9).map((task) => task.id), ['task-a', 'task-c', 'task-b']);
assert.deepEqual(normalizeSortedIds(tasks, ['task-c', 'task-c', 'missing', 'task-a']), ['task-c', 'task-a', 'task-b']);

const plainResponse = JSON.stringify({
  sortedIds: ['task-b', 'task-a', 'task-c'],
  reasoning: 'Low energy favors smaller, faster work first.'
});

const fencedResponse = `Here is the refined order:\n\n\`\`\`json\n${plainResponse}\n\`\`\``;

assert.deepEqual(parseGeminiPriorityResponse(plainResponse, tasks).sortedIds, ['task-b', 'task-a', 'task-c']);
assert.deepEqual(parseGeminiPriorityResponse(fencedResponse, tasks).sortedIds, ['task-b', 'task-a', 'task-c']);
assert.equal(parseGeminiPriorityResponse(plainResponse, tasks).reasoning, 'Low energy favors smaller, faster work first.');

console.log('Prioritization verification passed');
