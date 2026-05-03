'use client';

import { useState } from 'react';
import { LockKeyhole, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/client-api';

export default function LoginPage() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-slate-100 to-slate-50" />

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-[2rem] border border-white/60 bg-white/80 backdrop-blur-xl p-10 shadow-soft">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
              <LockKeyhole size={32} strokeWidth={2.5} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Admin Access</h1>
            <p className="mt-2 text-sm text-slate-500">
              Provide your backend Bearer token to authenticate.
            </p>
          </div>

          <div className="space-y-5">
            <div className="relative">
              <textarea
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(null);
                }}
                placeholder="eyJh..."
                spellCheck={false}
                className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white/50 px-5 py-4 text-sm font-mono text-slate-700 shadow-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 resize-none"
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                {error}
              </div>
            ) : null}

            <Button
              className="w-full h-14 text-base"
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
                  setError(err instanceof Error ? err.message : 'Authentication failed');
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? 'Verifying...' : 'Enter System'}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}