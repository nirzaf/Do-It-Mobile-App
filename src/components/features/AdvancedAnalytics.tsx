import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../hooks/useUser';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Activity,
  Zap,
  Scale,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface AnalyticsData {
  weightProgress: {
    current: number;
    target: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  workoutStats: {
    totalWorkouts: number;
    averageDuration: number;
    caloriesBurned: number;
    consistency: number; // percentage
  };
  nutritionStats: {
    averageCalories: number;
    macroBalance: {
      protein: number;
      carbs: number;
      fats: number;
    };
    hydrationGoal: number;
  };
  insights: {
    type: 'success' | 'warning' | 'info';
    title: string;
    description: string;
  }[];
}

interface AdvancedAnalyticsProps {
  className?: string;
}

/**
 * Advanced analytics component for VIP subscribers
 */
export function AdvancedAnalytics({ className = '' }: AdvancedAnalyticsProps) {
  const { t } = useLanguage();
  const { user } = useUser();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  // Mock analytics data - in real app this would come from API
  useEffect(() => {
    const mockData: AnalyticsData = {
      weightProgress: {
        current: user?.weight || 75,
        target: user?.goal === 'lose_weight' ? 70 : 80,
        change: -2.5,
        trend: 'down'
      },
      workoutStats: {
        totalWorkouts: 24,
        averageDuration: 45,
        caloriesBurned: 8640,
        consistency: 85
      },
      nutritionStats: {
        averageCalories: 1850,
        macroBalance: {
          protein: 25,
          carbs: 45,
          fats: 30
        },
        hydrationGoal: 92
      },
      insights: [
        {
          type: 'success',
          title: t('analytics.insight.consistentProgress'),
          description: t('analytics.insight.consistentProgressDesc')
        },
        {
          type: 'warning',
          title: t('analytics.insight.lowProtein'),
          description: t('analytics.insight.lowProteinDesc')
        },
        {
          type: 'info',
          title: t('analytics.insight.hydrationImprovement'),
          description: t('analytics.insight.hydrationImprovementDesc')
        }
      ]
    };
    
    setAnalyticsData(mockData);
  }, [user, t]);

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">{t('loadingAnalytics')}</p>
        </div>
      </div>
    );
  }

  const getInsightIcon = (type: 'success' | 'warning' | 'info') => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Activity className="h-5 w-5 text-blue-500" />;
    }
  };

  const getInsightColor = (type: 'success' | 'warning' | 'info') => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'info': return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {t('advancedAnalytics')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {t('analyticsDescription')}
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {(['week', 'month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t(`timeRange.${range}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <Scale className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {analyticsData.weightProgress.change > 0 ? '+' : ''}{analyticsData.weightProgress.change}kg
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{t('weightChange')}</p>
            <div className="flex items-center justify-center mt-1">
              {analyticsData.weightProgress.trend === 'down' ? (
                <TrendingDown className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {analyticsData.workoutStats.totalWorkouts}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{t('totalWorkouts')}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {analyticsData.workoutStats.consistency}% {t('consistency')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {analyticsData.workoutStats.caloriesBurned.toLocaleString()}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{t('caloriesBurned')}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {Math.round(analyticsData.workoutStats.caloriesBurned / analyticsData.workoutStats.totalWorkouts)} {t('avgPerWorkout')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {analyticsData.workoutStats.averageDuration}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{t('avgDuration')} ({t('minutes')})</p>
          </CardContent>
        </Card>
      </div>

      {/* Nutrition Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {t('nutritionAnalysis')}
            </h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
                {t('macroDistribution')}
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">{t('protein')}</span>
                    <span className="font-medium">{analyticsData.nutritionStats.macroBalance.protein}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${analyticsData.nutritionStats.macroBalance.protein}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">{t('carbs')}</span>
                    <span className="font-medium">{analyticsData.nutritionStats.macroBalance.carbs}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${analyticsData.nutritionStats.macroBalance.carbs}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">{t('fats')}</span>
                    <span className="font-medium">{analyticsData.nutritionStats.macroBalance.fats}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${analyticsData.nutritionStats.macroBalance.fats}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
                {t('dailyAverages')}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{t('calories')}</span>
                  <span className="font-medium">{analyticsData.nutritionStats.averageCalories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{t('hydrationGoal')}</span>
                  <span className="font-medium">{analyticsData.nutritionStats.hydrationGoal}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {t('aiInsights')}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {t('vipExclusive')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.insights.map((insight, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
