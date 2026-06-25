'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, ArrowRight, Loader2, Mail, KeyRound, User, KeySquare, Gift, ShieldAlert } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useI18n } from '@/components/providers/i18n-provider';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    inviteCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, inviteCode: refCode }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !formData.name.trim() || !formData.email.trim() || !formData.password.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<any>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          inviteCode: formData.inviteCode.trim()
        }),
      });

      if (response.user?.role === 'admin' || response.user?.role === 'operator') {
        router.push('/admin/dashboard');
      } else {
        router.push('/account');
      }
      
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error' as any));
      setLoading(false);
    }
  };

  const isReferred = !!searchParams.get('ref');

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#020617] p-6 overflow-hidden selection:bg-emerald-500/30">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute right-[20%] top-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-600/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute left-[10%] bottom-[-20%] h-[600px] w-[600px] rounded-full bg-teal-600/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '11s' }} />
      </div>

      <div className="relative z-10 w-full max-w-[460px] py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-gradient-to-br from-emerald-400 to-teal-600 shadow-[0_0_40px_rgba(16,185,129,0.4)] border border-white/20 backdrop-blur-xl transform transition-transform hover:scale-105 hover:-rotate-3">
          <UserPlus className="h-9 w-9 text-white drop-shadow-lg" strokeWidth={2.5} />
        </div>

        <div className="relative rounded-[2.5rem] bg-white/[0.03] border border-white/[0.08] p-8 sm:p-12 shadow-2xl backdrop-blur-3xl">
          <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/10 pointer-events-none" />
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black tracking-tight text-white">{t('auth.register' as any)}</h1>
          </div>

          <div className={`mb-8 flex items-center gap-4 p-4 rounded-2xl border ${isReferred ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'} shadow-inner`}>
            <div className={`p-2 rounded-xl ${isReferred ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`}>
              <Gift className="h-6 w-6 shrink-0" />
            </div>
            <div className="text-xs font-bold leading-relaxed">
              {isReferred 
                ? 'Реферальний код активовано! Отримайте 1,000 AC бонусу після реєстрації.'
                : 'Welcome Bonus: Зареєструйтесь зараз та отримайте 500 AC на баланс.'}
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400 shadow-inner animate-in shake">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('contact.name' as any)}</label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-30" />
                <div className="relative flex items-center">
                  <User className="absolute left-4 h-5 w-5 text-slate-500 transition-colors group-focus-within:text-emerald-400" />
                  <input
                    required
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full h-14 rounded-2xl border border-white/10 bg-black/40 px-4 pl-12 text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600 focus:border-emerald-500 focus:bg-black/60 shadow-inner"
                    placeholder="Ім'я"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('contact.email' as any)}</label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-30" />
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 h-5 w-5 text-slate-500 transition-colors group-focus-within:text-emerald-400" />
                  <input
                    required
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full h-14 rounded-2xl border border-white/10 bg-black/40 px-4 pl-12 text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600 focus:border-emerald-500 focus:bg-black/60 shadow-inner"
                    placeholder="mail@arcturus.store"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Пароль</label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-30" />
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-4 h-5 w-5 text-slate-500 transition-colors group-focus-within:text-emerald-400" />
                  <input
                    required
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full h-14 rounded-2xl border border-white/10 bg-black/40 px-4 pl-12 text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600 focus:border-emerald-500 focus:bg-black/60 shadow-inner"
                    placeholder="Min 6 chars"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Invite Code (Optional)</label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-30" />
                <div className="relative flex items-center">
                  <KeySquare className="absolute left-4 h-5 w-5 text-slate-500 transition-colors group-focus-within:text-emerald-400" />
                  <input
                    name="inviteCode"
                    type="text"
                    value={formData.inviteCode}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full h-14 rounded-2xl border border-white/10 bg-black/40 px-4 pl-12 text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600 focus:border-emerald-500 focus:bg-black/60 shadow-inner font-mono uppercase"
                    placeholder="ARC-XXXX"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || !formData.name.trim() || !formData.email.trim() || !formData.password.trim()}
                className="relative w-full h-14 rounded-2xl font-black text-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] rounded-2xl pointer-events-none" />
                
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-md">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      {t('auth.register' as any)}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 delay-200">
            <p className="text-sm font-medium text-slate-500">
              Вже є акаунт?{' '}
              <Link href="/login" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-emerald-400/30 underline-offset-4">
                {t('auth.signIn' as any)}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
      <RegisterForm />
    </Suspense>
  );
}