'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { dict, Language, DictKey } from '@/lib/i18n';

type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: DictKey) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('arcturus_lang') as Language;
    if (saved && (saved === 'en' || saved === 'uk')) {
      setLangState(saved);
    } else {
      const userLang = navigator.language.includes('uk') || navigator.language.includes('ru') ? 'uk' : 'en';
      setLangState(userLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('arcturus_lang', newLang);
  };

  const t = (key: DictKey): string => {
    // Безпечне отримання перекладу з fallback
    return dict[lang]?.[key] || dict['en']?.[key] || key;
  };

  // ЗАВЖДИ повертаємо провайдер
  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};