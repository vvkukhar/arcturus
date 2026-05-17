'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, ShieldAlert } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, rememberMe }),
      });
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[var(--card)]/80 backdrop-blur-2xl border border-[var(--border)] rounded-[3rem] p-10 sm:p-12 shadow-2xl">
          <div className="mb-10 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-800 to-black dark:from-white dark:to-slate-300 rounded-[1.5rem] flex items-center justify-center shadow-lg mb-6">
              <Lock className="w-8 h-8 text-white dark:text-black" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Arcturus OS</h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Secure Access</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 animate-in shake">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium outline-none text-[var(--foreground)]"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium outline-none text-[var(--foreground)]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full h-14 flex items-center justify-center gap-2 rounded-2xl bg-[var(--foreground)] text-[var(--background)] font-black text-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}