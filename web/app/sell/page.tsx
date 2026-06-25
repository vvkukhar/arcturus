'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { PackageOpen, Loader2, DollarSign, ArrowRight, ShieldCheck, Tag, Lock, Zap, Scale, ImagePlus, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { swrFetcher } from '@/lib/swr-fetcher';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useI18n } from '@/components/providers/i18n-provider';

// ... (compressImage function remains the same)
const compressImage = async (file: File, maxWidth = 1920): Promise<File> => {
  if (!file.type.startsWith('image/')) return file;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' }));
            else reject(new Error('Canvas to Blob failed'));
          },
          'image/webp',
          0.85
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function SellPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { data: user, isLoading: userLoading } = useSWR('/api/auth/me', swrFetcher);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [tradeType, setTradeType] = useState<'c2c' | 'c2b'>('c2c');
  const [formData, setFormData] = useState({
    itemId: '',
    expectedPrice: '',
    notes: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const combined = [...files, ...newFiles].slice(0, 5); 
      setFiles(combined);

      const urls = combined.map(f => URL.createObjectURL(f));
      setPreviewUrls(urls);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newUrls = [...previewUrls];
    URL.revokeObjectURL(newUrls[index]);
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(t('sell.authReq' as any));
      return;
    }

    setLoading(true);
    try {
      const createdItem = await apiFetch<any>('/api/proxy/marketplace/apply', {
        method: 'POST',
        body: JSON.stringify({
          itemId: formData.itemId,
          expectedPrice: Number(formData.expectedPrice),
          notes: formData.notes,
          tradeType
        })
      });

      if (files.length > 0 && createdItem?.id) {
        const uploadData = new FormData();
        
        for (const f of files) {
          const compressed = await compressImage(f);
          uploadData.append('files', compressed);
        }

        await apiFetch(`/api/proxy/marketplace/${createdItem.id}/upload`, {
          method: 'POST',
          body: uploadData
        });
      }

      toast.success(t('common.success' as any));
      router.push('/account');
    } catch (err: any) {
      toast.error(err.message || t('common.error' as any));
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--background)]"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;
  }

  return (
    <main className="min-h-screen py-12 md:py-20 px-4 bg-[var(--background)] relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-6">
            <Tag size={40} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] mb-6 tracking-tight">{t('sell.title' as any)}</h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            {t('sell.subtitle' as any)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <div className="md:col-span-5 space-y-6">
            <div className="bg-[var(--card)] p-2 rounded-3xl border border-[var(--border)] shadow-sm flex flex-col gap-2">
              <button 
                type="button"
                onClick={() => setTradeType('c2c')}
                className={cn(
                  "p-5 rounded-2xl text-left transition-all border-2",
                  tradeType === 'c2c' ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20" : "border-transparent hover:bg-[var(--background)]"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Scale size={24} className={tradeType === 'c2c' ? "text-blue-600 dark:text-blue-400" : "text-slate-400"} />
                  <h3 className="text-lg font-black text-[var(--foreground)]">{t('sell.c2cTitle' as any)}</h3>
                </div>
                <p className="text-sm font-medium text-slate-500">{t('sell.c2cDesc' as any)}</p>
              </button>

              <button 
                type="button"
                onClick={() => setTradeType('c2b')}
                className={cn(
                  "p-5 rounded-2xl text-left transition-all border-2",
                  tradeType === 'c2b' ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20" : "border-transparent hover:bg-[var(--background)]"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Zap size={24} className={tradeType === 'c2b' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"} />
                  <h3 className="text-lg font-black text-[var(--foreground)]">{t('sell.c2bTitle' as any)}</h3>
                </div>
                <p className="text-sm font-medium text-slate-500">{t('sell.c2bDesc' as any)}</p>
              </button>
            </div>

            <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
              <ShieldCheck size={32} className="text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{t('sell.safeTitle' as any)}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{t('sell.safeDesc' as any)}</p>
            </div>
          </div>

          <div className="md:col-span-7">
            {!user ? (
              <div className="bg-[var(--card)] p-10 md:p-14 rounded-[2.5rem] border border-[var(--border)] shadow-xl text-center flex flex-col items-center justify-center h-full">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <Lock size={32} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-black mb-4">{t('sell.authReq' as any)}</h2>
                <p className="text-slate-500 font-medium mb-8">{t('sell.authDesc' as any)}</p>
                <Link href="/login" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                  {t('sell.authBtn' as any)} <ArrowRight size={20} />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[var(--card)] p-8 md:p-10 rounded-[2.5rem] border border-[var(--border)] shadow-xl space-y-6">
                <div>
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1 mb-2 block">{t('sell.form.itemId' as any)}</label>
                  <input 
                    required
                    value={formData.itemId}
                    onChange={(e) => setFormData({...formData, itemId: e.target.value})}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 font-bold text-[var(--foreground)] focus:ring-2 focus:ring-blue-600 outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1 mb-2 block">
                    {tradeType === 'c2c' ? t('sell.form.priceC2c' as any) : t('sell.form.priceC2b' as any)}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      required
                      type="number"
                      value={formData.expectedPrice}
                      onChange={(e) => setFormData({...formData, expectedPrice: e.target.value})}
                      placeholder="0.00"
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 pl-14 font-bold text-[var(--foreground)] focus:ring-2 focus:ring-blue-600 outline-none transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1 mb-2 block">{t('sell.form.photos' as any)}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {previewUrls.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-2xl border border-[var(--border)] overflow-hidden group bg-slate-100 dark:bg-slate-900">
                        <Image src={url} alt="Preview" fill className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal" />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {files.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background)] text-slate-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                      >
                        <ImagePlus size={24} className="mb-2" />
                        <span className="text-xs font-bold uppercase tracking-widest">{t('common.add' as any)}</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/avif,image/heic"
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1 mb-2 block">{t('sell.form.condition' as any)}</label>
                  <textarea 
                    required
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 font-medium text-[var(--foreground)] focus:ring-2 focus:ring-blue-600 outline-none transition-shadow custom-scrollbar resize-none"
                    rows={4}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-4 h-16 text-white font-black rounded-2xl transition-all shadow-xl disabled:opacity-70 active:scale-[0.98]",
                    tradeType === 'c2b' ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20" : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                  )}
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <PackageOpen size={24} />}
                  {tradeType === 'c2c' ? t('sell.form.submitC2c' as any) : t('sell.form.submitC2b' as any)}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}