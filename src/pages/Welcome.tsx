import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import { Dumbbell, Heart, Target } from 'lucide-react';

/**
 * Welcome screen component - the entry point of the application
 * Features language toggle and app introduction
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
      <Header title="" showThemeToggle={true} showLanguageToggle={true} />
      
      <div className="flex flex-col items-center justify-center px-4 py-12">
        {/* App Logo/Icon */}
        <div className="mb-8 flex items-center justify-center w-24 h-24 bg-blue-500 rounded-full shadow-lg">
          <Dumbbell className="h-12 w-12 text-white" />
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
          {t('appName')}
        </h1>

        {/* Welcome Message */}
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 text-center max-w-md">
          {t('welcome')} to your personalized fitness and diet companion
        </p>

        {/* Feature Icons */}
        <div className="flex items-center justify-center space-x-8 mb-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400 text-center">
              Goal Setting
            </span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-2">
              <Dumbbell className="h-8 w-8 text-green-500" />
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400 text-center">
              Training
            </span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-2">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400 text-center">
              Nutrition
            </span>
          </div>
        </div>

        {/* Get Started Button */}
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="w-full max-w-sm"
        >
          {t('getStarted')}
        </Button>

        {/* Footer Text */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-8 text-center">
          Start your fitness journey today
        </p>
      </div>
    </div>
  );
}