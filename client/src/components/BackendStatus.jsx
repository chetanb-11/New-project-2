import { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { checkBackendHealth } from '../api/tasks.js';

const ONLINE_INTERVAL = 30000;
const OFFLINE_INTERVAL = 8000;
const FETCH_TIMEOUT = 10000;

export function BackendStatus() {
  const [status, setStatus] = useState('checking');
  const intervalRef = useRef(null);

  const ping = useCallback(async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    try {
      await checkBackendHealth(controller.signal);
      setStatus('online');
    } catch (_err) {
      setStatus((prev) => (prev === 'checking' ? 'offline' : prev === 'online' ? 'online' : 'offline'));
    } finally {
      clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const onApiSuccess = () => setStatus('online');
    window.addEventListener('backend:reachable', onApiSuccess);
    return () => window.removeEventListener('backend:reachable', onApiSuccess);
  }, []);

  useEffect(() => {
    ping();
  }, [ping]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const delay = status === 'online' ? ONLINE_INTERVAL : OFFLINE_INTERVAL;
    intervalRef.current = setInterval(ping, delay);
    return () => clearInterval(intervalRef.current);
  }, [status, ping]);

  const configs = {
    checking: {
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin text-stone-400 dark:text-stone-500" />,
      label: 'Checking backend…',
      textClass: 'text-stone-400 dark:text-stone-500'
    },
    online: {
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />,
      label: 'Backend connected',
      textClass: 'text-emerald-700 dark:text-emerald-400'
    },
    offline: {
      icon: <XCircle className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />,
      label: 'Backend unreachable',
      textClass: 'text-red-600 dark:text-red-400'
    }
  };

  const current = configs[status];

  return (
    <button
      type="button"
      onClick={ping}
      title="Click to re-check backend status"
      className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/60 px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-all hover:bg-white dark:border-stone-700 dark:bg-stone-800/60 dark:hover:bg-stone-800"
    >
      {current.icon}
      <span className={current.textClass}>{current.label}</span>
    </button>
  );
}
