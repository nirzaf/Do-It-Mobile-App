import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import type { UserGoal } from '../types';

import { Target, TrendingDown, TrendingUp, Dumbbell, Utensils } from 'lucide-react';

interface GoalOption {
  id: UserGoal;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

/**
 * Goal selection component for choosing fitness objectives
 */
export function GoalSelection() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Define available goal options with icons and descriptions
   */
  const goalOptions: GoalOption[] = [
    {
      id: 'lose_weight',
      title: t('loseWeight'),
      description: 'Burn calories and reduce body fat',
      icon: <TrendingDown className="h-8 w-8" />,
      color: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
    },
    {
      id: 'gain_weight',
      title: t('gainWeight'),
      description: 'Increase overall body mass',
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    },
    {
      id: 'gain_muscle',
      title: t('gainMuscle'),
      description: 'Build lean muscle mass',
      icon: <Dumbbell className="h-8 w-8" />,
      color: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    },
    {
      id: 'extra_diet',
      title: t('extraDiet'),
      description: 'Focus on specialized nutrition',
      icon: <Utensils className="h-8 w-8" />,
      color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
    },
  ];

  /**
   * Handle goal selection
   * @param goal - Selected fitness goal
   */
  const handleGoalSelect = (goal: UserGoal) => {
    setSelectedGoal(goal);
  };

  /**
   * Handle form submission and navigate to next step
   */
  const handleSubmit = async () => {
    if (!selectedGoal) return;
    
    setIsSubmitting(true);

    // Get profile data from session storage
    const profileDataStr = sessionStorage.getItem('profileData');
    if (!profileDataStr) {
      navigate('/register/profile');
      return;
    }

    const profileData = JSON.parse(profileDataStr);
    const updatedProfileData = {
      ...profileData,
      goal: selectedGoal,
    };

    // Save updated profile data
    sessionStorage.setItem('profileData', JSON.stringify(updatedProfileData));
    
    // Navigate to media upload screen
    navigate('/register/media');
    setIsSubmitting(false);
  };

  /**
   * Navigate back to profile form
   */
  const handleBack = () => {
    navigate('/register/profile');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header title={t('goal')} />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {t('selectGoal')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Choose what you want to achieve
          </p>
        </div>

        {/* Goal Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {goalOptions.map((option) => (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedGoal === option.id
                  ? 'ring-2 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleGoalSelect(option.id)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${option.color}`}>
                    {option.icon}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {option.description}
                    </p>
                  </div>
                  
                  {selectedGoal === option.id && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            {t('back')}
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={!selectedGoal || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Loading...' : t('next')}
          </Button>
        </div>
      </div>
    </div>
  );
}