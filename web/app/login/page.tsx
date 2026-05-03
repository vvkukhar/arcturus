'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/client-api';

export default function LoginPage() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            placeholder="Paste token"
            className="min-h-36 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none"
          />

          {error ? <div className="text-sm font-semibold text-red-600">{error}</div> : null}

          <Button
            className="w-full"
            disabled={loading || !value.trim()}
            onClick={async () => {
              try {
                setLoading(true);
                setError(null);

                await apiFetch('/api/auth/login', {
                  method: 'POST',
                  body: JSON.stringify({ token: value }),
                });

                window.location.href = '/admin/dashboard';
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Login failed');
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