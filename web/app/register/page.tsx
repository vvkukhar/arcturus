'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, ArrowRight, Loader2, Mail, KeyRound, User, KeySquare, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
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
      setError(err instanceof Error ? err.message : 'Registration failed');
      setLoading(false);
    }
  };

  const isReferred = !!searchParams.get('ref');

  return (
    <main className="flex min-h-screen items-center justify-center px-6 relative overflow-hidden bg-[var(--background)] transition-colors duration-300">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 py-12">
        <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-2xl p-10 md:p-12 shadow-2xl transition-colors duration-300">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/30">
              <UserPlus size={36} strokeWidth={2.5} className="text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Join Arcturus</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Create an account to build your collection.
            </p>
          </div>

          <div className={`mb-8 flex items-center gap-3 p-4 rounded-2xl border ${isReferred ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
            <Gift className="h-6 w-6 shrink-0" />
            <div className="text-sm font-bold leading-tight">
              {isReferred 
                ? 'Syndicate Invite Active! Register now to receive your 1,000 AC bonus.'
                : 'Welcome Bonus: Register today and get 500 AC instantly.'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 pl-12 text-sm font-bold text-[var(--foreground)] shadow-sm transition-all focus:border-emerald-500 focus:bg-[var(--card)] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 pl-12 text-sm font-bold text-[var(--foreground)] shadow-sm transition-all focus:border-emerald-500 focus:bg-[var(--card)] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 pl-12 text-sm font-bold text-[var(--foreground)] shadow-sm transition-all focus:border-emerald-500 focus:bg-[var(--card)] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Invite / Referral Code</label>
              <div className="relative">
                <KeySquare size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="inviteCode"
                  type="text"
                  value={formData.inviteCode}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 pl-12 text-sm font-bold text-[var(--foreground)] shadow-sm transition-all focus:border-emerald-500 focus:bg-[var(--card)] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 mt-4">
                {error}
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-14 text-base rounded-xl font-black bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
                disabled={loading || !formData.name.trim() || !formData.email.trim() || !formData.password.trim()}
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {loading ? 'Creating Account...' : 'Register'}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                Sign in
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
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <RegisterForm />
    </Suspense>
  );
}