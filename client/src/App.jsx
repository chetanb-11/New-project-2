import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Activity, RefreshCw, LogOut, LogIn } from 'lucide-react';
import { EnergySlider } from './components/EnergySlider.jsx';
import { TaskBoard } from './components/TaskBoard.jsx';
import { CreateTaskForm } from './components/CreateTaskForm.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';
import { BackendStatus } from './components/BackendStatus.jsx';
import { AuthForm } from './components/AuthForm.jsx';
import { fetchTasks, createTask, deleteTask, prioritizeTasks, updateTask } from './api/tasks.js';
import { sortTasksByFlow } from './utils/flow.js';
import { getToken, removeToken } from './api/auth.js';

function Dashboard({ isAuthenticated, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [energy, setEnergy] = useState(5);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(
    isAuthenticated ? null : 'You are in Guest Mode. Tasks are only saved locally. Log in to save to the database.'
  );

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    } else {
      setNotice('You are in Guest Mode. Tasks are only saved locally. Log in to save to the database.');
    }
  }, [isAuthenticated]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setNotice(null);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      if (err.message.includes('401')) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const updateEnergy = (newEnergy) => {
    setEnergy(newEnergy);
  };

  const refinePriority = async () => {
    if (tasks.length === 0) return;

    try {
      if (isAuthenticated) {
        setLoading(true);
        const res = await prioritizeTasks(tasks, energy);
        if (res?.orderedTasks) {
          setTasks(res.orderedTasks);
        }
        setNotice(res?.geminiFailed ? 'Gemini prioritization was unavailable, so the local Flow score order was used.' : null);
      } else {
        // Local only prioritization
        setTasks(sortTasksByFlow(tasks, energy));
        setNotice('Prioritized locally (Guest Mode).');
      }
    } catch (err) {
      console.error('Failed to prioritize:', err);
      setNotice('Could not refine priority. Using local Flow scores.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      if (isAuthenticated) {
        const created = await createTask(taskData);
        setTasks((prev) => [...prev, created]);
      } else {
        throw new Error('Guest mode');
      }
    } catch (err) {
      if (isAuthenticated) console.error('Failed to create task:', err);
      const localTask = {
        _id: `temp-${Date.now()}`,
        ...taskData,
        createdAt: new Date().toISOString()
      };
      setTasks((prev) => [...prev, localTask]);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      if (isAuthenticated && !taskId.toString().startsWith('temp-')) {
        await deleteTask(taskId);
      }
      setTasks((prev) => prev.filter((t) => (t.id ?? t._id) !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      setNotice('Could not delete task from server.');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    const originalTasks = [...tasks];
    
    let updatedPayload = { status: newStatus };
    const task = tasks.find(t => (t.id ?? t._id) === taskId);
    
    if (task) {
      if (task.status === 'In-Progress' && newStatus !== 'In-Progress') {
        if (task.lastStartedAt) {
          const elapsedTime = (Date.now() - new Date(task.lastStartedAt).getTime()) / 60000;
          updatedPayload.actualTimeSpent = (task.actualTimeSpent || 0) + elapsedTime;
        }
        updatedPayload.lastStartedAt = null;
      } else if (task.status !== 'In-Progress' && newStatus === 'In-Progress') {
        updatedPayload.lastStartedAt = new Date().toISOString();
      }
    }

    setTasks((prev) =>
      prev.map((t) => ((t.id ?? t._id) === taskId ? { ...t, ...updatedPayload } : t))
    );

    try {
      if (isAuthenticated && !taskId.toString().startsWith('temp-')) {
        await updateTask(taskId, updatedPayload);
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
      setNotice('Failed to update task status on server.');
      setTasks(originalTasks);
    }
  };

  const visibleTasks = sortTasksByFlow(tasks, energy);

  return (
    <main className="min-h-screen bg-[#f5f7f2] text-stone-900 dark:bg-stone-900 dark:text-stone-200 transition-colors duration-300">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#eef3e8] dark:border-stone-800 dark:bg-stone-950/80 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-emerald-800 text-white dark:bg-emerald-600">
              <Activity className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-normal text-stone-950 dark:text-white transition-colors">Focus Flow</h1>
              <p className="text-sm text-stone-600 dark:text-stone-400 transition-colors">Prioritized work for the energy you actually have.</p>
              <BackendStatus />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <EnergySlider value={energy} onChange={updateEnergy} />
            <ThemeToggle />
            {isAuthenticated ? (
              <button onClick={onLogout} title="Log Out" className="p-2 rounded-md hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors">
                <LogOut className="h-5 w-5 text-stone-600 dark:text-stone-400" />
              </button>
            ) : (
              <Link to="/auth" title="Log In" className="p-2 rounded-md hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors flex items-center gap-2">
                <LogIn className="h-5 w-5 text-stone-600 dark:text-stone-400" />
                <span className="text-sm font-medium hidden sm:inline">Log In</span>
              </Link>
            )}
          </div>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-emerald-800 dark:text-emerald-400 transition-colors">Current Flow Order</p>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400 transition-colors">{loading ? 'Loading tasks...' : `${visibleTasks.length} tasks ready`}</p>
          </div>
          <div className="flex items-center gap-2">
            <CreateTaskForm onCreated={handleCreateTask} />
            <button
              id="refine-button"
              type="button"
              onClick={refinePriority}
              className="inline-flex h-10 w-fit items-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Refine
            </button>
          </div>
        </div>
        {notice ? (
          <div className="rounded-md border border-emerald-900/10 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300 transition-colors">
            {notice}
          </div>
        ) : null}
        <TaskBoard tasks={visibleTasks} energy={energy} onDelete={handleDeleteTask} onUpdateStatus={handleUpdateTaskStatus} />
      </section>
    </main>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  return (
    <Routes>
      <Route path="/" element={<Dashboard isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
      <Route path="/auth" element={<AuthForm onAuthSuccess={handleAuthSuccess} />} />
    </Routes>
  );
}

export default App;
