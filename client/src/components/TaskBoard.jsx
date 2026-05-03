import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { TaskCard } from './TaskCard.jsx';

export const TaskBoard = ({ tasks, energy, onDelete, onUpdateStatus }) => {
  if (!tasks?.length) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/50 transition-colors">
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400">No tasks in flow right now. Take a break!</p>
      </div>
    );
  }

  const backlogTasks = tasks.filter(t => t.status === 'Backlog');
  const inProgressTasks = tasks.filter(t => t.status === 'In-Progress');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  const getTaskId = (task) => task.id ?? task._id;

  return (
    <LayoutGroup>
      <div className="grid gap-6 md:grid-rows-3">
        {inProgressTasks.length > 0 && (
          <section className="flex flex-col gap-3">
            <h3 className="flex items-center justify-between text-sm font-semibold text-stone-800 dark:text-stone-200">
              In-Progress
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                {inProgressTasks.length}
              </span>
            </h3>
            <motion.div layout className="flex flex-col gap-3 min-h-[100px] rounded-md border border-transparent">
              <AnimatePresence mode="popLayout">
                {inProgressTasks.map((task, index) => (
                  <TaskCard
                    key={getTaskId(task)}
                    task={task}
                    index={tasks.indexOf(task)}
                    energy={energy}
                    onDelete={onDelete}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </section>
        )}

        <section className="flex flex-col gap-3">
          <h3 className="flex items-center justify-between text-sm font-semibold text-stone-800 dark:text-stone-200">
            Backlog
            <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400">
              {backlogTasks.length}
            </span>
          </h3>
          <motion.div layout className="flex flex-col gap-3 min-h-[100px] rounded-md border border-transparent">
            <AnimatePresence mode="popLayout">
              {backlogTasks.map((task, index) => (
                <TaskCard
                  key={getTaskId(task)}
                  task={task}
                  index={tasks.indexOf(task)}
                  energy={energy}
                  onDelete={onDelete}
                  onUpdateStatus={onUpdateStatus}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {completedTasks.length > 0 && (
          <section className="flex flex-col gap-3">
            <h3 className="flex items-center justify-between text-sm font-semibold text-stone-800 dark:text-stone-200">
              Completed
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                {completedTasks.length}
              </span>
            </h3>
            <motion.div layout className="flex flex-col gap-3 min-h-[100px] rounded-md border border-transparent">
              <AnimatePresence mode="popLayout">
                {completedTasks.map((task, index) => (
                  <TaskCard
                    key={getTaskId(task)}
                    task={task}
                    index={tasks.indexOf(task)}
                    energy={energy}
                    onDelete={onDelete}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </section>
        )}
      </div>
    </LayoutGroup>
  );
};
