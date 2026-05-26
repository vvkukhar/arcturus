// web/app/returns/page.tsx
'use client';

import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300 py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-8 transition-colors">
            <ArrowLeft size={16} /> На головну
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl">
              <ShieldAlert size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tight">Обмін та Повернення</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Відповідно до Закону України «Про захист прав споживачів»</p>
        </div>

        <div className="space-y-8">
          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">1. Умови повернення товарів належної якості</h2>
            <p className="text-[var(--foreground)] leading-relaxed text-lg font-medium mb-4">
              Покупець має право повернути або обміняти товар належної якості протягом 14 днів з моменту отримання замовлення, за умови:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[var(--foreground)] font-medium">
              <li>Товар не був у вжитку і не має слідів використання (подряпин, відколів тощо).</li>
              <li><b>Збережено цілісність заводського пакування (пломби LEGO не зірвані).</b></li>
              <li>Збережено всі ярлики, маркування та розрахунковий документ (чек або ТТН).</li>
            </ul>
            <p className="text-red-500 font-bold mt-4">Увага: Відкриті набори LEGO або набори з пошкодженим заводським пакуванням поверненню не підлягають.</p>
          </div>

          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">2. Повернення товарів неналежної якості (Б/В набори)</h2>
            <p className="text-[var(--foreground)] leading-relaxed text-lg font-medium">
              Вживані набори продаються "як є", однак ми гарантуємо їхню комплектність, заявлену в описі. Якщо ви виявили нестачу деталей, яка не була вказана, ви маєте право звернутися до нас протягом 3-х днів з моменту отримання для доукомплектування або часткового відшкодування.
            </p>
          </div>

          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">3. Процедура повернення коштів</h2>
            <p className="text-[var(--foreground)] leading-relaxed text-lg font-medium">
              Для оформлення повернення зв'яжіться з нами за адресою <b>support@arcturus.store</b>. Повернення коштів здійснюється на банківську картку, з якої була здійснена оплата, протягом 3-7 банківських днів після того, як ми отримаємо товар назад і перевіримо його стан. Витрати на зворотну доставку оплачує покупець.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}