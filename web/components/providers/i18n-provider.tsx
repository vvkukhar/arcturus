'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('arcturus_lang', newLang);
  }, []);

  // ФІКС: Мемоізуємо функцію, щоб запобігти нескінченним ререндерам та скиданням useEffect у дочірніх компонентах
  const t = useCallback((key: DictKey): string => {
    return dict[lang]?.[key] || dict['en']?.[key] || key;
  }, [lang]);

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