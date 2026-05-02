'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-sm">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
          Arcturus Admin
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Login</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your backend Bearer token for admin access.
        </p>
        <div className="mt-6 space-y-3">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste token"
            className="min-h-36 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none"
          />
          <Button
            className="w-full"
            onClick={async () => {
              try {
                setLoading(true);
                const response = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: value }),
                });
                if (!response.ok) {
                  throw new Error('Login failed');
                }
                window.location.href = '/admin/dashboard';
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? 'Entering...' : 'Enter Admin'}
          </Button>
        </div>
      </div>
    </main>
  );
}