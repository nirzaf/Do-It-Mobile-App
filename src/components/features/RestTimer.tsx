import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { useLanguage } from '../../context/LanguageContext';
import { Timer, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

interface RestTimerProps {
  initialTime: number; // in seconds
  onComplete: () => void;
  onSkip: () => void;
  isActive: boolean;
}

/**
 * Enhanced rest timer component with controls
 */
export function RestTimer({ initialTime, onComplete, onSkip, isActive }: RestTimerProps) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(isActive);
  const [customTime, setCustomTime] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
    setCustomTime(initialTime);
    setIsRunning(isActive);
  }, [initialTime, isActive]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  /**
   * Format time display
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Toggle timer play/pause
   */
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  /**
   * Reset timer to initial time
   */
  const resetTimer = () => {
    setTimeLeft(customTime);
    setIsRunning(false);
  };

  /**
   * Add 30 seconds to timer
   */
  const addTime = () => {
    setTimeLeft(prev => prev + 30);
    setCustomTime(prev => prev + 30);
  };

  /**
   * Remove 30 seconds from timer (minimum 10 seconds)
   */
  const removeTime = () => {
    setTimeLeft(prev => Math.max(10, prev - 30));
    setCustomTime(prev => Math.max(10, prev - 30));
  };

  const progress = ((customTime - timeLeft) / customTime) * 100;

  return (
    <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
      <CardContent className="p-6">
        <div className="text-center">
          {/* Timer Icon */}
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Timer className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            {t('restTime')}
          </h3>

          {/* Progress Ring */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-orange-200 dark:text-orange-800"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                className="text-orange-600 dark:text-orange-400 transition-all duration-1000 ease-linear"
                strokeLinecap="round"
              />
            </svg>
            
            {/* Time display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={removeTime}
              className="w-10 h-10 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleTimer}
              className="w-12 h-12 p-0"
            >
              {isRunning ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={addTime}
              className="w-10 h-10 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={resetTimer}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('reset')}
            </Button>
            
            <Button
              onClick={onSkip}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {t('skipRest')}
            </Button>
          </div>

          {/* Rest Tips */}
          <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-lg">
            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              {t('restTips')}
            </h4>
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <p>• {t('breatheDeeply')}</p>
              <p>• {t('stayHydrated')}</p>
              <p>• {t('prepareNextSet')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
