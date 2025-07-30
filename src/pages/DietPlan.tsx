import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../hooks/useUser';
import { generatePlan } from '../lib/utils';
import type { Plan, Meal } from '../types';
import { 
  Clock,
  Utensils,
  Zap,
  Scale,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

/**
 * Diet plan component displaying meal plans based on user goals
 */
export function DietPlan() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useUser();
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/welcome');
      return;
    }

    // Generate user plan
    const plan = generatePlan(user);
    setUserPlan(plan);
  }, [user, navigate]);

  if (!user || !userPlan) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTimes = ['breakfast', 'lunch', 'dinner', 'snack'];

  /**
   * Get meal icon based on meal time
   */
  const getMealIcon = (mealTime: string) => {
    switch (mealTime) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '☀️';
      case 'dinner':
        return '🌙';
      case 'snack':
        return '🍎';
      default:
        return '🍽️';
    }
  };

  /**
   * Get meal time display
   */
  const getMealTime = (mealTime: string) => {
    switch (mealTime) {
      case 'breakfast':
        return '7:00 AM';
      case 'lunch':
        return '12:00 PM';
      case 'dinner':
        return '7:00 PM';
      case 'snack':
        return '3:00 PM';
      default:
        return '';
    }
  };

  /**
   * Calculate total calories for a meal
   */
  const calculateMealCalories = (meal: Meal) => {
    return meal.totalCalories || 0;
  };

  /**
   * Toggle meal expansion
   */
  const toggleMealExpansion = (index: number) => {
    setExpandedMeal(expandedMeal === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header 
        title={t('dietPlan')}
      />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Plan Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {t('dietPlan')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('personalizedDietPlan')}
          </p>
        </div>

        {/* Day Selector */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
            {t('selectDay')}
          </h2>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {days.map((day, index) => (
              <Button
                key={day}
                variant={selectedDay === index ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedDay(index)}
                className="whitespace-nowrap"
              >
                {day.slice(0, 3)}
              </Button>
            ))}
          </div>
        </div>

        {/* Meals for Selected Day */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {days[selectedDay]} {t('meals')}
          </h2>
          
          {mealTimes.map((mealTime, mealIndex) => {
            const meal = userPlan.diet.meals.find((m: any) => m.time === mealTime);
            if (!meal) return null;

            const totalCalories = calculateMealCalories(meal);
            const isExpanded = expandedMeal === mealIndex;

            return (
              <Card key={mealTime} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleMealExpansion(mealIndex)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getMealIcon(mealTime)}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                          {t(mealTime)}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{getMealTime(mealTime)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="h-4 w-4" />
                            <span>{totalCalories} cal</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {meal.foods.map((food: any, foodIndex: number) => (
                        <div 
                          key={foodIndex}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center">
                              <Utensils className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">
                                {food.name}
                              </p>
                              <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex items-center space-x-1">
                                  <Scale className="h-3 w-3" />
                                  <span>{food.portion}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Zap className="h-3 w-3" />
                                  <span>{food.calories} cal</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Daily Summary */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
              {t('dailySummary')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {userPlan.diet.meals.reduce((total: number, meal: any) => total + calculateMealCalories(meal), 0)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('totalCalories')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {userPlan.diet.meals.length}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('meals')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}