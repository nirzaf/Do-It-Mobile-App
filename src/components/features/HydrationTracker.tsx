import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../hooks/useUser';
import { calculateWaterIntake } from '../../lib/utils';
import { 
  Droplets, 
  Plus, 
  Minus, 
  Target,
  TrendingUp,
  Clock
} from 'lucide-react';

interface HydrationEntry {
  id: string;
  amount: number; // in ml
  timestamp: string;
  type: 'water' | 'tea' | 'coffee' | 'juice' | 'other';
}

interface HydrationTrackerProps {
  className?: string;
}

/**
 * Hydration tracking component with daily goals and progress monitoring
 */
export function HydrationTracker({ className = '' }: HydrationTrackerProps) {
  const { t } = useLanguage();
  const { user } = useUser();
  const [dailyIntake, setDailyIntake] = useState<number>(0);
  const [hydrationEntries, setHydrationEntries] = useState<HydrationEntry[]>([]);
  const [quickAmount, setQuickAmount] = useState<number>(250); // Default glass size

  // Calculate daily water goal based on user profile
  const dailyGoal = user ? calculateWaterIntake(user.weight, user.activityLevel) * 1000 : 2500; // Convert to ml
  const progressPercentage = Math.min((dailyIntake / dailyGoal) * 100, 100);

  useEffect(() => {
    // Load today's hydration data from localStorage
    const today = new Date().toDateString();
    const savedData = localStorage.getItem(`hydration_${today}`);
    if (savedData) {
      const entries = JSON.parse(savedData);
      setHydrationEntries(entries);
      const total = entries.reduce((sum: number, entry: HydrationEntry) => sum + entry.amount, 0);
      setDailyIntake(total);
    }
  }, []);

  /**
   * Add water intake entry
   */
  const addWaterIntake = (amount: number, type: HydrationEntry['type'] = 'water') => {
    const newEntry: HydrationEntry = {
      id: Date.now().toString(),
      amount,
      timestamp: new Date().toISOString(),
      type
    };

    const updatedEntries = [...hydrationEntries, newEntry];
    setHydrationEntries(updatedEntries);
    setDailyIntake(prev => prev + amount);

    // Save to localStorage
    const today = new Date().toDateString();
    localStorage.setItem(`hydration_${today}`, JSON.stringify(updatedEntries));
  };

  /**
   * Remove last entry
   */
  const removeLastEntry = () => {
    if (hydrationEntries.length === 0) return;

    const lastEntry = hydrationEntries[hydrationEntries.length - 1];
    const updatedEntries = hydrationEntries.slice(0, -1);
    
    setHydrationEntries(updatedEntries);
    setDailyIntake(prev => prev - lastEntry.amount);

    // Update localStorage
    const today = new Date().toDateString();
    localStorage.setItem(`hydration_${today}`, JSON.stringify(updatedEntries));
  };

  /**
   * Get hydration status message
   */
  const getHydrationStatus = () => {
    if (progressPercentage >= 100) {
      return { message: t('hydration.goalAchieved'), color: 'text-green-600 dark:text-green-400' };
    } else if (progressPercentage >= 75) {
      return { message: t('hydration.almostThere'), color: 'text-blue-600 dark:text-blue-400' };
    } else if (progressPercentage >= 50) {
      return { message: t('hydration.halfwayThere'), color: 'text-yellow-600 dark:text-yellow-400' };
    } else {
      return { message: t('hydration.keepGoing'), color: 'text-red-600 dark:text-red-400' };
    }
  };

  const status = getHydrationStatus();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {t('hydration.dailyHydration')}
            </h3>
          </div>
          <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">
            <Target className="h-4 w-4" />
            <span>{(dailyGoal / 1000).toFixed(1)}L</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Circle */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-200 dark:text-slate-700"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - progressPercentage / 100)}`}
                className="text-blue-500 transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {Math.round(progressPercentage)}%
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {(dailyIntake / 1000).toFixed(1)}L
              </span>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center">
          <p className={`font-medium ${status.color}`}>
            {status.message}
          </p>
        </div>

        {/* Quick Add Buttons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('hydration.quickAdd')}
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuickAmount(Math.max(100, quickAmount - 50))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {quickAmount}ml
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuickAmount(Math.min(1000, quickAmount + 50))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => addWaterIntake(quickAmount)}
              className="flex items-center justify-center space-x-2"
            >
              <Droplets className="h-4 w-4" />
              <span>{t('hydration.addWater')}</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => addWaterIntake(quickAmount, 'tea')}
              className="flex items-center justify-center space-x-2"
            >
              <span>🫖</span>
              <span>{t('hydration.addTea')}</span>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addWaterIntake(250)}
            >
              250ml
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addWaterIntake(500)}
            >
              500ml
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addWaterIntake(750)}
            >
              750ml
            </Button>
          </div>
        </div>

        {/* Recent Entries */}
        {hydrationEntries.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('hydration.recentEntries')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={removeLastEntry}
                className="text-red-600 hover:text-red-700"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {hydrationEntries.slice(-5).reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">
                      {new Date(entry.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {entry.amount}ml
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hydration Tips */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                {t('hydration.tip')}
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                {t('hydration.tipMessage')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
