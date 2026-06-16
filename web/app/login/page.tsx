'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, ShieldAlert, Sparkles } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

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
    <main className="relative flex min-h-screen items-center justify-center bg-[#020617] p-6 overflow-hidden selection:bg-indigo-500/30">
      {/* Анімований бекграунд (Сітка + Сяйво) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute left-[20%] top-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute right-[10%] bottom-[-20%] h-[600px] w-[600px] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-700">
        {/* Декоративний елемент над карткою */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-gradient-to-b from-indigo-500 to-purple-600 shadow-[0_0_40px_rgba(99,102,241,0.4)] border border-white/20 backdrop-blur-xl transform transition-transform hover:scale-105 hover:rotate-3">
          <Lock className="h-8 w-8 text-white drop-shadow-lg" strokeWidth={2.5} />
        </div>

        {/* Сама картка Glassmorphism */}
        <div className="relative rounded-[2.5rem] bg-white/[0.03] border border-white/[0.08] p-8 sm:p-12 shadow-2xl backdrop-blur-3xl">
          <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/10 pointer-events-none" />
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              Arcturus <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">OS</span>
            </h1>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center justify-center gap-1.5">
              <Sparkles size={12} className="text-indigo-400" /> Secure Terminal
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400 shadow-inner animate-in shake">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              {/* Інпут Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-30" />
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 h-5 w-5 text-slate-500 transition-colors group-focus-within:text-indigo-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full h-14 rounded-2xl border border-white/10 bg-black/40 px-4 pl-12 text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600 focus:border-indigo-500 focus:bg-black/60 shadow-inner"
                      placeholder="admin@arcturus.store"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Інпут Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Пароль</label>
                  <span className="text-[10px] font-bold text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors">Забули?</span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-30" />
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 h-5 w-5 text-slate-500 transition-colors group-focus-within:text-indigo-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full h-14 rounded-2xl border border-white/10 bg-black/40 px-4 pl-12 text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600 focus:border-indigo-500 focus:bg-black/60 shadow-inner"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer group w-fit ml-1">
              <div className="relative flex items-center justify-center w-5 h-5 rounded border border-white/20 bg-black/50 transition-colors group-hover:border-indigo-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="absolute inset-0 rounded bg-indigo-500 scale-0 transition-transform peer-checked:scale-100" />
                <svg className="w-3 h-3 text-white absolute z-10 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-400 group-hover:text-slate-300 transition-colors">Запам'ятати мене</span>
            </label>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="relative w-full h-14 rounded-2xl font-black text-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] rounded-2xl pointer-events-none" />
                
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-md">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      Увійти в систему
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 delay-200">
          <p className="text-sm font-medium text-slate-500">
            Немає доступу?{' '}
            <Link href="/register" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors underline decoration-indigo-400/30 underline-offset-4">
              Подати заявку на реєстрацію
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}