import React from 'react';

export function LegalFooter() {
  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 font-medium space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-bold uppercase mb-1">Інформація про власника</p>
          <p>ФОП Кухар Владислав Вадимович</p>
          <p>ІПН: 3931504111</p>
          <p>Адреса: Україна, м. Хмельницький, вул. Лісогринівецька, 4</p>
        </div>
        <div className="md:text-right">
          <p className="font-bold uppercase mb-1">Контакти</p>
          <p>Email: support@cortexfinapp.com</p>
          <p>Тел: +380 (93) 118-22-35</p>
        </div>
      </div>
      <div className="text-center">
        <p>© 2026 Arcturus Terminal. Всі права захищені. LEGO є торговою маркою LEGO Group.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="/terms" className="hover:underline">Умови надання послуг</a>
          <a href="/privacy" className="hover:underline">Політика конфіденційності</a>
          <a href="/delivery" className="hover:underline">Доставка та оплата</a>
          <a href="/returns" className="hover:underline">Правила повернення коштів</a>
        </div>
      </div>
    </div>
  );
}