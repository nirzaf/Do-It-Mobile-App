import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useLanguage } from '../../context/LanguageContext';
import type { LocalizedString } from '../../types';
import {
  Clock,
  Users,
  ChefHat,
  Zap,
  Heart,
  Leaf,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Share2,
  Bookmark
} from 'lucide-react';

interface MealDetailProps {
  meal: any; // Using any for now due to data structure differences
  onBack: () => void;
  className?: string;
}

/**
 * Detailed meal information component with instructions, nutrition, and cooking details
 */
export function MealDetail({ meal, onBack, className = '' }: MealDetailProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'instructions' | 'nutrition'>('overview');
  const [servings, setServings] = useState<number>(1);

  if (!meal) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">{t('meal.notFound')}</p>
      </div>
    );
  }

  /**
   * Get localized text
   */
  const getLocalizedText = (text: LocalizedString | string): string => {
    if (typeof text === 'string') return text;
    return text[language] || text.en || '';
  };

  /**
   * Calculate adjusted nutrition values based on servings
   */
  const getAdjustedNutrition = (value: number) => {
    return Math.round(value * servings);
  };

  /**
   * Get difficulty color
   */
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4 max-w-md">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t('common.back')}</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Meal Image */}
        {meal.photoUrl && (
          <div className="mb-6">
            <img
              src={meal.photoUrl}
              alt={getLocalizedText(meal.name)}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Meal Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {getLocalizedText(meal.name)}
          </h1>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {(meal.prepTime || 0) + (meal.cookTime || 0)}m
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('meal.totalTime')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Zap className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {getAdjustedNutrition(meal.calories)}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('meal.calories')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <ChefHat className={`h-4 w-4 ${getDifficultyColor(meal.difficulty)}`} />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
                {t(`meal.difficulty.${meal.difficulty}`)}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('meal.difficulty.label')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {servings}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('meal.servings')}
              </p>
            </div>
          </div>

          {/* Servings Adjuster */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setServings(Math.max(1, servings - 1))}
              disabled={servings <= 1}
            >
              -
            </Button>
            <span className="text-sm font-medium">
              {t('meal.adjustServings')}: {servings}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setServings(servings + 1)}
            >
              +
            </Button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {meal.isVegetarian && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Leaf className="h-3 w-3 mr-1" />
                {t('meal.vegetarian')}
              </span>
            )}
            {meal.isVegan && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Heart className="h-3 w-3 mr-1" />
                {t('meal.vegan')}
              </span>
            )}
            {meal.isHalal && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                {t('meal.halal')}
              </span>
            )}
            {meal.allergens && meal.allergens.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {t('meal.allergens')}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {(['overview', 'instructions', 'nutrition'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {t(`meal.tabs.${tab}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Ingredients */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {t('meal.ingredients')}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {meal.ingredients?.map((ingredient: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-slate-900 dark:text-slate-100">
                        {getLocalizedText(ingredient.name)}
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {ingredient.amount}
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {getAdjustedNutrition(ingredient.calories)} cal
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {t('meal.cookingInstructions')}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {meal.instructions?.map((instruction: any, index: number) => (
                    <div key={index} className="flex space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-slate-900 dark:text-slate-100 leading-relaxed">
                        {getLocalizedText(instruction)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {t('meal.nutritionFacts')}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {getAdjustedNutrition(meal.macros?.protein || 0)}g
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t('nutrition.protein')}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {getAdjustedNutrition(meal.macros?.carbs || 0)}g
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t('nutrition.carbs')}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {getAdjustedNutrition(meal.macros?.fats || 0)}g
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t('nutrition.fats')}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {getAdjustedNutrition(meal.macros?.fiber || 0)}g
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t('nutrition.fiber')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
