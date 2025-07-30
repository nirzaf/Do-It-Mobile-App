import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Translations } from '../types';
import enTranslations from '../data/locales/en.json';
import arTranslations from '../data/locales/ar.json';
import { interpolate } from '../lib/utils';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
  isRTL: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
  en: enTranslations,
  ar: arTranslations,
};

/**
 * Language provider component that manages language state and translations
 * @param children - Child components
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check if there's a saved language in localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'en';
  });

  const isRTL = language === 'ar';

  /**
   * Set the current language and update document direction
   * @param lang - Language code to set
   */
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  /**
   * Translation function that returns translated text
   * @param key - Translation key
   * @param variables - Variables for interpolation
   * @returns Translated string
   */
  const t = (key: string, variables?: Record<string, string | number>): string => {
    const translation = translations[language][key] || key;
    
    if (variables && typeof translation === 'string') {
      return interpolate(translation, variables);
    }
    
    return translation as string;
  };

  // Update document direction based on language
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const value = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Custom hook to use language context
 * @returns Language context value
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}