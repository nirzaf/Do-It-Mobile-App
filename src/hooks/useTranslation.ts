/**
 * Custom hook for translations
 */

import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

/**
 * Hook to access language context and translation function
 * @returns Language context value with translation function
 */
export function useTranslation() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  return {
    t: context.t,
    language: context.language,
    setLanguage: context.setLanguage,
    isRTL: context.isRTL,
  };
}
