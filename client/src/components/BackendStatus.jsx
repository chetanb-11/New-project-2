import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { checkBackendHealth } from '../api/tasks.js';

const POLL_INTERVAL = 30000;

export function BackendStatus() {
  const [status, setStatus] = useState('checking');

  const ping = useCallback(async () => {
    try {
      await checkBackendHealth();
      setStatus('online');
    } catch {
      setStatus('offline');
    }
  }, []);

  useEffect(() => {
    ping();
    const id = setInterval(ping, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [ping]);

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
