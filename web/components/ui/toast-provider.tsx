'use client';

import { createContext, useCallback, useContext, useState } from 'react';

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

  if (!ctx) {
    throw new Error('No ToastProvider');
  }

  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36);

    setToasts((current) => [...current, { ...t, id }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}

      <div className="fixed right-4 top-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="rounded-xl bg-black px-4 py-3 text-white shadow"
          >
            <div className="font-bold">{toast.title}</div>
            {toast.message ? (
              <div className="text-sm opacity-80">{toast.message}</div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}