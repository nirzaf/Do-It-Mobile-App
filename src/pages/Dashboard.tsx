import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../hooks/useUser';
import { calculateBMI, calculateDailyCalories, calculateWaterIntake, generatePlan } from '../lib/utils';

import { 
  User, 
  Target, 
  Droplets, 
  TrendingUp, 
  Play,
  Utensils,
  Dumbbell,
  ChevronRight,
  Crown
} from 'lucide-react';

/**
 * Dashboard component - main screen after user registration
 */
export function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useUser();
  const [bmi, setBmi] = useState<number>(0);
  const [dailyCalories, setDailyCalories] = useState<number>(0);
  const [waterIntake, setWaterIntake] = useState<number>(0);

  useEffect(() => {
    if (!user) {
      navigate('/welcome');
      return;
    }

    // Calculate user metrics
    const userBMI = calculateBMI(user.weight, user.height);
    const calories = calculateDailyCalories(user);
    const water = calculateWaterIntake(user.weight);
    
    setBmi(userBMI);
    setDailyCalories(calories.target);
    setWaterIntake(water);

    // Generate user plan
    generatePlan(user);
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  /**
   * Get BMI status and color
   */
  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { status: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { status: 'Overweight', color: 'text-yellow-600' };
    return { status: 'Obese', color: 'text-red-600' };
  };

  const bmiStatus = getBMIStatus(bmi);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header title={t('dashboard')} />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {t('welcome')}, {user.firstName}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('readyToStart')}
          </p>
        </div>

        {/* User Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* BMI Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('bmi')}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {bmi.toFixed(1)}
                  </p>
                  <p className={`text-xs ${bmiStatus.color}`}>
                    {bmiStatus.status}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Calories Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('calories')}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {dailyCalories}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('perDay')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Water Intake Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center">
                  <Droplets className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('water')}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {waterIntake}L
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('perDay')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goal Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('goal')}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {t(user.goal.toLowerCase().replace(' ', ''))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t('quickActions')}
          </h2>
          
          {/* Diet Plan */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/diet-plan')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Utensils className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {t('dietPlan')}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t('viewMealPlan')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          {/* Training Plan */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/training-plan')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <Dumbbell className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {t('trainingPlan')}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t('viewWorkoutPlan')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          {/* Exercise Videos */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/exercises')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {t('exerciseVideos')}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t('watchExercises')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow border-yellow-200 dark:border-yellow-800 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
            onClick={() => navigate('/subscription')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <Crown className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {t('subscription')}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t('upgradeAccount')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          {/* Profile */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/profile')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {t('profile')}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t('editProfile')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}