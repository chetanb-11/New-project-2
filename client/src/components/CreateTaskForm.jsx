import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

const defaultFormState = {
  title: '',
  description: '',
  difficulty: 3,
  estimatedTime: 30,
  category: 'Coding',
  status: 'Backlog'
};

export const CreateTaskForm = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultFormState);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    onCreated({
      ...form,
      difficulty: Number(form.difficulty),
      estimatedTime: Number(form.estimatedTime)
    });

    setForm(defaultFormState);
    setOpen(false);
  };

  return (
    <>
      <button
        id="create-task-button"
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-fit items-center gap-2 rounded-md bg-emerald-800 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        New Task
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm dark:bg-black/60"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-stone-200 bg-white shadow-2xl dark:border-stone-700 dark:bg-stone-800 transition-colors"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5 dark:border-stone-700 transition-colors">
                  <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Create New Task</h2>
                  <button
                    id="close-create-form"
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-md p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-700 dark:hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form id="create-task-form" onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5 px-6 py-5 overflow-y-auto">
                  <fieldset className="flex flex-col gap-1.5">
                    <label htmlFor="task-title" className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors">Title <span className="text-emerald-600 dark:text-emerald-400">*</span></label>
                    <input
                      id="task-title"
                      type="text"
                      value={form.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="e.g. Refactor API endpoints"
                      required
                      className="rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500 transition-colors"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col gap-1.5">
                    <label htmlFor="task-description" className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors">Description</label>
                    <textarea
                      id="task-description"
                      rows={3}
                      value={form.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Optional details about what needs to be done..."
                      className="resize-none rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500 transition-colors"
                    />
                  </fieldset>

                  <div className="grid grid-cols-2 gap-4">
                    <fieldset className="flex flex-col gap-1.5">
                      <label htmlFor="task-difficulty" className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors">Difficulty (1-5)</label>
                      <select
                        id="task-difficulty"
                        value={form.difficulty}
                        onChange={(e) => updateField('difficulty', e.target.value)}
                        className="rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 transition-colors"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} - {num === 1 ? 'Trivial' : num === 5 ? 'Hard' : 'Medium'}
                          </option>
                        ))}
                      </select>
                    </fieldset>

                    <fieldset className="flex flex-col gap-1.5">
                      <label htmlFor="task-time" className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors">Time (mins)</label>
                      <input
                        id="task-time"
                        type="number"
                        min="5"
                        step="5"
                        value={form.estimatedTime}
                        onChange={(e) => updateField('estimatedTime', e.target.value)}
                        className="rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 transition-colors"
                      />
                    </fieldset>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <fieldset className="flex flex-col gap-1.5">
                      <label htmlFor="task-category" className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors">Category</label>
                      <select
                        id="task-category"
                        value={form.category}
                        onChange={(e) => updateField('category', e.target.value)}
                        className="rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 transition-colors"
                      >
                        <option value="Coding">Coding</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Admin">Admin</option>
                        <option value="Learning">Learning</option>
                      </select>
                    </fieldset>

                    <fieldset className="flex flex-col gap-1.5">
                      <label htmlFor="task-status" className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors">Status</label>
                      <select
                        id="task-status"
                        value={form.status}
                        onChange={(e) => updateField('status', e.target.value)}
                        className="rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 transition-colors"
                      >
                        <option value="Backlog">Backlog</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </fieldset>
                  </div>
                </form>

                <div className="border-t border-stone-200 bg-stone-50 p-6 dark:border-stone-700 dark:bg-stone-800/80 transition-colors">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-600 dark:bg-transparent dark:text-stone-300 dark:hover:bg-stone-700 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="create-task-form"
                      className="rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                      Save Task
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
