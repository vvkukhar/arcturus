'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole, ArrowRight, Loader2, Mail, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/client-api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      setLoading(true);
      setError(null);

      await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password: password.trim(), rememberMe }),
      });

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 relative overflow-hidden bg-[var(--background)] transition-colors duration-300">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-2xl p-10 md:p-12 shadow-2xl transition-colors duration-300">
          <div className="flex justify-center mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30">
              <LockKeyhole size={36} strokeWidth={2.5} className="text-white" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Terminal Access</h1>
            <p className="mt-3 text-sm font-medium text-slate-500">
              Authenticate to manage the Arcturus infrastructure.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="admin@arcturus.local"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 pl-12 text-sm font-bold text-[var(--foreground)] shadow-sm transition-all focus:border-blue-500 focus:bg-[var(--card)] focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 pl-12 text-sm font-bold text-[var(--foreground)] shadow-sm transition-all focus:border-blue-500 focus:bg-[var(--card)] focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 pb-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border-2 border-slate-300 dark:border-slate-700 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-colors"
                  />
                  <div className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Remember me</span>
              </label>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 text-base rounded-xl font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 active:scale-[0.98]"
              disabled={loading || !email.trim() || !password.trim()}
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {loading ? 'Authenticating...' : 'Enter Workspace'}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}