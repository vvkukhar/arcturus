'use client';

import { createContext, useContext, useState } from 'react';

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
  if (!ctx) throw new Error('No ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = (t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36);

    setToasts((x) => [...x, { ...t, id }]);

    setTimeout(() => {
      setToasts((x) => x.filter((y) => y.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ push }}>
      {children}

      <div className="fixed right-4 top-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-xl bg-black text-white px-4 py-3 shadow"
          >
            <div className="font-bold">{t.title}</div>
            {t.message ? (
              <div className="text-sm opacity-80">{t.message}</div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}