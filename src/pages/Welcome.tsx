import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import { Dumbbell, Heart, Target } from 'lucide-react';

/**
 * Welcome screen component - the entry point of the application
 * Features language toggle and app introduction with Arabic cultural context
 */
export function Welcome() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  /**
   * Navigate to the profile registration screen
   */
  const handleGetStarted = () => {
    navigate('/register/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header
        title=""
        showLanguageToggle={true}
        showThemeToggle={true}
        className="bg-transparent"
      />

      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="text-center max-w-md mx-auto">
          {/* App Logo/Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <Dumbbell className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
              {t('appName')}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {t('appSlogan')}
            </p>
          </div>

          {/* Welcome Message */}
          <div className="mb-8 space-y-4">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {t('welcomeMessage')}
            </p>

            {/* Feature highlights with cultural context */}
            <div className="grid grid-cols-1 gap-4 mt-6">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Target className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('personalizedExperience')}
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Heart className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('expertGuidance')}
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Dumbbell className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('transformYourLife')}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleGetStarted}
            className="w-full py-4 text-lg font-semibold"
            size="lg"
          >
            {t('getStarted')}
          </Button>

          {/* Motivational text */}
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            {t('readyToStart')}
          </p>
        </div>
      </div>
    </div>
  );
}