import Link from 'next/link';
import { PackageSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-500">
      <PackageSearch size={64} className="text-slate-300 dark:text-slate-700 mb-6" />
      <h2 className="text-3xl font-black tracking-tight text-[var(--foreground)] mb-4">Набір не знайдено</h2>
      <p className="text-slate-500 font-medium mb-8">
        Можливо, його вже викупили або посилання недійсне.
      </p>
      <Link 
        href="/store/catalog" 
        className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
      >
        Повернутись до каталогу
      </Link>
    </div>
  );
}