import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../hooks/useUser';
import { calculateDailyCalories, calculateMacros } from '../../lib/utils';
import type { Macros, CalorieTargets } from '../../types';
import { 
  Target, 
  TrendingUp, 
  Activity,
  Zap,
  Scale,
  BarChart3
} from 'lucide-react';

interface MacroEntry {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

interface MacroCalculatorProps {
  dailyMeals?: any[];
  className?: string;
}

/**
 * Macro calculator and tracking component with daily targets and progress
 */
export function MacroCalculator({ dailyMeals = [], className = '' }: MacroCalculatorProps) {
  const { t } = useLanguage();
  const { user } = useUser();
  const [currentMacros, setCurrentMacros] = useState<MacroEntry>({
    protein: 0,
    carbs: 0,
    fat: 0,
    calories: 0
  });
  const [targetMacros, setTargetMacros] = useState<Macros & { calories: number }>({
    protein: 0,
    carbs: 0,
    fat: 0,
    calories: 0
  });

  useEffect(() => {
    if (!user) return;

    // Calculate target calories and macros
    const calorieTargets: CalorieTargets = calculateDailyCalories(user);
    const macros: Macros = calculateMacros(calorieTargets.target, user.goal);
    
    setTargetMacros({
      ...macros,
      calories: calorieTargets.target
    });

    // Calculate current macros from meals
    const current = dailyMeals.reduce((acc, meal) => {
      const mealCalories = meal.totalCalories || meal.calories || 0;
      const mealMacros = meal.totalMacros || meal.macros || { protein: 0, carbs: 0, fat: 0 };
      
      return {
        protein: acc.protein + (mealMacros.protein || 0),
        carbs: acc.carbs + (mealMacros.carbs || 0),
        fat: acc.fat + (mealMacros.fat || mealMacros.fats || 0),
        calories: acc.calories + mealCalories
      };
    }, { protein: 0, carbs: 0, fat: 0, calories: 0 });

    setCurrentMacros(current);
  }, [user, dailyMeals]);

  /**
   * Calculate percentage of target achieved
   */
  const getProgressPercentage = (current: number, target: number): number => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  /**
   * Get progress color based on percentage
   */
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };



  const macroData = [
    {
      name: 'protein',
      current: currentMacros.protein,
      target: targetMacros.protein,
      unit: 'g',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500',
      icon: Activity,
      caloriesPerGram: 4
    },
    {
      name: 'carbs',
      current: currentMacros.carbs,
      target: targetMacros.carbs,
      unit: 'g',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500',
      icon: Zap,
      caloriesPerGram: 4
    },
    {
      name: 'fat',
      current: currentMacros.fat,
      target: targetMacros.fat,
      unit: 'g',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-500',
      icon: Scale,
      caloriesPerGram: 9
    }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {t('macros.dailyMacros')}
            </h3>
          </div>
          <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">
            <Target className="h-4 w-4" />
            <span>{targetMacros.calories} cal</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Calories Overview */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('macros.totalCalories')}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {currentMacros.calories} / {targetMacros.calories}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                getProgressPercentage(currentMacros.calories, targetMacros.calories)
              )}`}
              style={{
                width: `${getProgressPercentage(currentMacros.calories, targetMacros.calories)}%`
              }}
            />
          </div>
          <div className="mt-2 text-center">
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {getProgressPercentage(currentMacros.calories, targetMacros.calories).toFixed(0)}%
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">
              {t('macros.complete')}
            </span>
          </div>
        </div>

        {/* Macro Breakdown */}
        <div className="space-y-4">
          {macroData.map((macro) => {
            const percentage = getProgressPercentage(macro.current, macro.target);
            const Icon = macro.icon;
            
            return (
              <div key={macro.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-4 w-4 ${macro.color}`} />
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
                      {t(`nutrition.${macro.name}`)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {macro.current.toFixed(1)}{macro.unit}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400 ml-1">
                      / {macro.target.toFixed(1)}{macro.unit}
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${macro.bgColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className={macro.color}>
                    {percentage.toFixed(0)}% {t('macros.complete')}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {(macro.current * macro.caloriesPerGram).toFixed(0)} cal
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Macro Distribution Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {t('macros.distribution')}
          </h4>
          
          <div className="grid grid-cols-3 gap-3">
            {macroData.map((macro) => {
              const caloriesFromMacro = macro.current * macro.caloriesPerGram;
              const percentageOfTotal = currentMacros.calories > 0 
                ? (caloriesFromMacro / currentMacros.calories) * 100 
                : 0;
              
              return (
                <div key={macro.name} className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className={`text-lg font-bold ${macro.color}`}>
                    {percentageOfTotal.toFixed(0)}%
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                    {t(`nutrition.${macro.name}`)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {caloriesFromMacro.toFixed(0)} cal
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                {t('macros.recommendation')}
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                {currentMacros.calories < targetMacros.calories * 0.8
                  ? t('macros.recommendationLow')
                  : currentMacros.calories > targetMacros.calories * 1.2
                  ? t('macros.recommendationHigh')
                  : t('macros.recommendationGood')
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
