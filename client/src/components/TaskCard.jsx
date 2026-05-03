import { useState, useEffect, useRef } from 'react';
import { Clock, Gauge, Layers, Trash2 } from 'lucide-react';
import { calculateFlowScore } from '../utils/flow.js';
import { motion } from 'framer-motion';

const boardTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 0.8
};

const statusTone = {
  Backlog: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
  'In-Progress': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  Completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
};

const getTaskId = (task) => task.id ?? task._id;

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  if (h > 0) {
    return `${h}:${m}:${s}`;
  }
  return `${m}:${s}`;
};

export const TaskCard = ({ task, energy, onDelete, onUpdateStatus, index }) => {
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    let intervalId;
    if (task.status === 'In-Progress') {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      intervalId = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      startTimeRef.current = null;
      setElapsed(0);
    }
    return () => clearInterval(intervalId);
  }, [task.status]);

  return (
    <motion.article
      layout="position"
      layoutId={getTaskId(task)}
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={boardTransition}
      className="group rounded-md border border-stone-200 bg-white p-4 shadow-sm transition-colors dark:border-stone-700 dark:bg-stone-800"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded bg-emerald-800 text-xs font-bold text-white dark:bg-emerald-600">
              {index + 1}
            </span>
            <h2 className="text-base font-semibold text-stone-950 dark:text-stone-100 transition-colors">{task.title}</h2>
          </div>
          {task.description ? (
            <p className="mt-1 pl-8 text-sm leading-6 text-stone-600 dark:text-stone-400 transition-colors">{task.description}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {task.status === 'In-Progress' && (
            <span className="font-mono text-sm font-semibold text-amber-600 dark:text-amber-400">
              {formatTime(elapsed)}
            </span>
          )}
          <select
            value={task.status}
            onChange={(e) => onUpdateStatus(getTaskId(task), e.target.value)}
            className={`cursor-pointer appearance-none rounded px-2 py-1 text-xs font-medium outline-none transition-colors focus:ring-2 focus:ring-emerald-500/50 ${statusTone[task.status]}`}
          >
            <option value="Backlog">Backlog</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(getTaskId(task))}
              className="grid h-8 w-8 place-items-center rounded text-stone-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/30 dark:hover:text-red-400"
              title="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-stone-700 dark:text-stone-300 pl-8 transition-colors">
        <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-1 dark:bg-stone-700">
          <Gauge className="h-4 w-4" aria-hidden="true" />
          {task.difficulty}/5
        </span>
        <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-1 dark:bg-stone-700">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {task.estimatedTime}m
        </span>
        <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-1 dark:bg-stone-700">
          <Layers className="h-4 w-4" aria-hidden="true" />
          {task.category}
        </span>
        <span className="rounded bg-emerald-50 px-2 py-1 font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 transition-colors">
          Flow {calculateFlowScore(task, energy).toFixed(1)}
        </span>
      </div>
    </motion.article>
  );
};
