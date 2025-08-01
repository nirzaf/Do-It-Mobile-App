import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../hooks/useUser';
import { generatePlan } from '../lib/utils';
import type { Plan } from '../types';
import { 

  Clock,
  Dumbbell,
  Target,
  RotateCcw,
  Play,
  ChevronDown,
  ChevronUp,
  Timer
} from 'lucide-react';

/**
 * Training plan component displaying workout plans based on user goals
 */
export function TrainingPlan() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useUser();
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);


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
  const selectedDayExercises = userPlan.training.days[`Day ${selectedDay + 1}`]?.exercises || [];

  /**
   * Get exercise details by ID
   */


  /**
   * Get exercise reps based on user goal
   */
  const getExerciseReps = (exercise: any, _goal: string) => {
    // Handle legacy data structure
    if (exercise.reps && typeof exercise.reps === 'object') {
      return exercise.reps['Lose Weight'] || exercise.reps[Object.keys(exercise.reps)[0]] || 10;
    }
    return 10; // Default reps
  };

  /**
   * Get exercise details including sets, reps, and rest time
   */
  const getExerciseDetails = (exercise: any) => {
    const reps = getExerciseReps(exercise, user.goal);
    return {
      sets: exercise.sets,
      reps: reps,
      rest: 60
    };
  };

  /**
   * Toggle exercise expansion
   */
  const toggleExerciseExpansion = (index: number) => {
    setExpandedExercise(expandedExercise === index ? null : index);
  };

  /**
   * Calculate total workout time
   */
  const calculateWorkoutTime = () => {
    return selectedDayExercises.length * 3; // Assume 3 minutes per exercise
  };

  /**
   * Get muscle group color
   */
  const getMuscleGroupColor = (muscle: string) => {
    const colors: { [key: string]: string } = {
      'chest': 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
      'back': 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
      'shoulders': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400',
      'arms': 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
      'legs': 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
      'core': 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400',
      'cardio': 'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400',
    };
    return colors[muscle.toLowerCase()] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header 
          title={t('trainingPlan')} 
        />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Plan Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Training Plan
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Complete your daily workout routine
          </p>
        </div>

        {/* Day Selector */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
            {t('selectDay')}
          </h2>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {days.map((day, index) => {
              const dayExercises = userPlan.training.days[`Day ${index + 1}`]?.exercises || [];
              const isRestDay = dayExercises.length === 0;
              
              return (
                <Button
                  key={day}
                  variant={selectedDay === index ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDay(index)}
                  className={`whitespace-nowrap ${isRestDay ? 'opacity-50' : ''}`}
                >
                  {day.slice(0, 3)}
                  {isRestDay && (
                    <span className="ml-1 text-xs">💤</span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Workout Summary */}
        {selectedDayExercises.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
                {days[selectedDay]} {t('workout')}
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedDayExercises.length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('exercises')}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {calculateWorkoutTime()}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('minutes')}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {selectedDayExercises.reduce((total: number, exerciseData: any) => {
                      const exercise = exerciseData.exercise;
                      if (!exercise) return total;
                      const details = getExerciseDetails(exercise);
                      return total + (details.sets * details.reps);
                    }, 0)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('totalReps')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exercises for Selected Day */}
        <div className="space-y-4">
          {selectedDayExercises.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Timer className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  {t('restDay')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('restDayDescription')}
                </p>
              </CardContent>
            </Card>
          ) : (
            selectedDayExercises.map((exerciseData: any, exerciseIndex: number) => {
              const exercise = exerciseData.exercise;
              if (!exercise) return null;
              
              const details = getExerciseDetails(exercise);
              const isExpanded = expandedExercise === exerciseIndex;

              return (
                <Card key={exercise.id} className="overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => toggleExerciseExpansion(exerciseIndex)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Dumbbell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-slate-100">
                            {typeof exercise.name === 'string'
                              ? exercise.name
                              : exercise.name[language] || exercise.name.en}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              getMuscleGroupColor(Array.isArray(exercise.targetMuscle)
                                ? exercise.targetMuscle[0]
                                : exercise.targetMuscle)
                            }`}>
                              {Array.isArray(exercise.targetMuscle)
                                ? exercise.targetMuscle.join(', ')
                                : exercise.targetMuscle}
                            </span>
                            <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">
                              <Target className="h-3 w-3" />
                              <span>{details.sets}x{details.reps}</span>
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
                      <div className="space-y-4">
                        {/* Exercise Details */}
                        <div className="grid grid-cols-3 gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 text-blue-600 dark:text-blue-400 mb-1">
                              <Target className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {details.sets}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {t('sets')}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 text-green-600 dark:text-green-400 mb-1">
                              <RotateCcw className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {details.reps}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {t('reps')}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 text-purple-600 dark:text-purple-400 mb-1">
                              <Clock className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {details.rest}s
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {t('rest')}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/exercises/${exercise.id}`)}
                            className="flex-1"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {t('watchVideo')}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1"
                          >
                            {t('markComplete')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>

        {/* Start Workout Button */}
        {selectedDayExercises.length > 0 && (
          <div className="mt-6">
            <Button 
              className="w-full"
              size="lg"
              onClick={() => navigate(`/workout/${selectedDay}`)}
            >
              <Play className="h-5 w-5 mr-2" />
              {t('startWorkout')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}