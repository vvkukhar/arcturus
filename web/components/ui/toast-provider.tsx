'use client';

import { createContext, useCallback, useContext, useState, useRef, useEffect } from 'react';

type Toast = {
  id: string;
  title: string;
  message?: string;
};

const ToastContext = createContext<{
  push: (t: Omit<Toast, 'id'>) => void;
} | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    return () => {
      timeouts.current.forEach((timeout) => clearTimeout(timeout));
      timeouts.current.clear();
    };
  }, []);

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    setToasts((current) => [...current, { ...t, id }]);

    const timeout = setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
      timeouts.current.delete(id);
    }, 4000);

    timeouts.current.set(id, timeout);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed right-4 top-4 z-[9999] space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="rounded-2xl bg-slate-900/95 dark:bg-white/95 backdrop-blur-md px-5 py-4 text-white dark:text-slate-900 shadow-2xl shadow-slate-900/20 border border-slate-800 dark:border-slate-200 animate-in slide-in-from-right-8 fade-in duration-300 pointer-events-auto"
          >
            <div className="font-bold tracking-wide">{toast.title}</div>
            {toast.message && (
              <div className="text-sm font-medium text-slate-300 dark:text-slate-600 mt-1">{toast.message}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}