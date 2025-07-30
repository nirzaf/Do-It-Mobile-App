import React from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

interface HeaderProps {
  title?: string;
  showLanguageToggle?: boolean;
  showThemeToggle?: boolean;
  className?: string;
}

/**
 * Header component with theme toggle and language switcher
 * @param title - Header title text
 * @param showLanguageToggle - Whether to show language toggle
 * @param showThemeToggle - Whether to show theme toggle
 * @param className - Additional CSS classes
 */
export function Header({ 
  title, 
  showLanguageToggle = true, 
  showThemeToggle = true,
  className 
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, isRTL } = useLanguage();

  /**
   * Toggle between English and Arabic languages
   */
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className={cn(
      'flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700',
      className
    )}>
      {/* Title */}
      <div className="flex-1">
        {title && (
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
        )}
      </div>

      {/* Controls */}
      <div className={cn(
        'flex items-center space-x-2',
        isRTL && 'space-x-reverse'
      )}>
        {/* Language Toggle */}
        {showLanguageToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="p-2"
            title={t('language')}
          >
            <Globe className="h-4 w-4" />
            <span className="ml-1 text-xs">
              {language === 'en' ? 'عربي' : 'EN'}
            </span>
          </Button>
        )}

        {/* Theme Toggle */}
        {showThemeToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </header>
  );
}