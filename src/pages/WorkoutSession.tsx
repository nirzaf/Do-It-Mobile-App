import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../hooks/useUser';
import { generatePlan } from '../lib/utils';
import type { Plan, Exercise, WorkoutSession as WorkoutSessionType } from '../types';
import exercisesData from '../data/exercises.json';
import {
  RotateCcw,
  Timer,
  Check,
  Dumbbell,
  Target,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ExerciseProgress {
  exerciseId: string;
  currentSet: number;
  completedSets: {
    reps: number;
    weight?: number;
    completed: boolean;
    restTime?: number;
  }[];
  isCompleted: boolean;
}

/**
 * Workout session component for active workout tracking
 */
export function WorkoutSession() {
  const navigate = useNavigate();
  const { dayIndex } = useParams<{ dayIndex: string }>();
  const { t, language } = useLanguage();
  const { user } = useUser();
  
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([]);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState(false);

  useEffect(() => {
    if (!user || !dayIndex) {
      navigate('/training');
      return;
    }

    // Load exercises data
    setExercises(exercisesData as any[]);

    // Generate user plan
    const plan = generatePlan(user);
    setUserPlan(plan);

    // Initialize workout
    const dayNumber = parseInt(dayIndex) + 1;
    const dayExercises = plan.training.days[`Day ${dayNumber}`]?.exercises || [];
    
    // Initialize exercise progress
    const initialProgress: ExerciseProgress[] = dayExercises.map(exerciseData => ({
      exerciseId: exerciseData.exercise.id,
      currentSet: 1,
      completedSets: [],
      isCompleted: false,
    }));
    
    setExerciseProgress(initialProgress);
    setWorkoutStartTime(new Date());
  }, [user, dayIndex, navigate]);

  // Update workout duration timer
  useEffect(() => {
    if (!workoutStartTime || isWorkoutCompleted) return;

    const interval = setInterval(() => {
      const now = new Date();
      const duration = Math.floor((now.getTime() - workoutStartTime.getTime()) / 1000);
      setWorkoutDuration(duration);
    }, 1000);

    return () => clearInterval(interval);
  }, [workoutStartTime, isWorkoutCompleted]);

  // Rest timer countdown
  useEffect(() => {
    if (!isResting || restTimer <= 0) return;

    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (prev <= 1) {
          setIsResting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  if (!user || !userPlan || exercises.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading workout...</p>
        </div>
      </div>
    );
  }

  const dayNumber = parseInt(dayIndex!) + 1;
  const dayExercises = userPlan.training.days[`Day ${dayNumber}`]?.exercises || [];
  const currentExerciseData = dayExercises[currentExerciseIndex];
  const currentExercise = currentExerciseData?.exercise;
  const currentProgress = exerciseProgress[currentExerciseIndex];

  if (!currentExercise || !currentProgress) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">Exercise not found</p>
          <Button onClick={() => navigate('/training')} className="mt-4">
            Back to Training
          </Button>
        </div>
      </div>
    );
  }

  /**
   * Get exercise reps based on user goal
   */
  const getExerciseReps = (exercise: Exercise, goal: string) => {
    const goalKey = goal as keyof Exercise['reps'];
    return exercise.reps[goalKey] || exercise.reps.loseWeight;
  };

  const targetReps = parseInt(getExerciseReps(currentExercise, user.goal));
  const targetSets = currentExercise.sets;

  /**
   * Complete current set
   */
  const completeSet = (reps: number, weight?: number) => {
    const newCompletedSet = {
      reps,
      weight,
      completed: true,
      restTime: currentExercise.restSeconds || 60,
    };

    setExerciseProgress(prev => {
      const updated = [...prev];
      updated[currentExerciseIndex] = {
        ...updated[currentExerciseIndex],
        completedSets: [...updated[currentExerciseIndex].completedSets, newCompletedSet],
        currentSet: updated[currentExerciseIndex].currentSet + 1,
      };
      return updated;
    });

    // Start rest timer if not the last set
    if (currentProgress.currentSet < targetSets) {
      setIsResting(true);
      setRestTimer(currentExercise.restSeconds || 60);
    } else {
      // Mark exercise as completed
      setExerciseProgress(prev => {
        const updated = [...prev];
        updated[currentExerciseIndex] = {
          ...updated[currentExerciseIndex],
          isCompleted: true,
        };
        return updated;
      });
    }
  };

  /**
   * Move to next exercise
   */
  const nextExercise = () => {
    if (currentExerciseIndex < dayExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setIsResting(false);
      setRestTimer(0);
    } else {
      // Workout completed
      completeWorkout();
    }
  };

  /**
   * Move to previous exercise
   */
  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setIsResting(false);
      setRestTimer(0);
    }
  };

  /**
   * Complete workout
   */
  const completeWorkout = () => {
    setIsWorkoutCompleted(true);
    
    // Create workout session record
    const workoutSession: Partial<WorkoutSessionType> = {
      userId: user.id,
      workoutId: `day-${dayIndex}`,
      date: new Date().toISOString(),
      exercises: exerciseProgress.map(progress => ({
        exerciseId: progress.exerciseId,
        sets: progress.completedSets,
        completed: progress.isCompleted,
      })),
      duration: Math.floor(workoutDuration / 60), // in minutes
      caloriesBurned: exerciseProgress.length * 50, // Rough estimate
    };

    // Save to localStorage (in real app, would save to backend)
    const existingSessions = JSON.parse(localStorage.getItem('workoutSessions') || '[]');
    existingSessions.push(workoutSession);
    localStorage.setItem('workoutSessions', JSON.stringify(existingSessions));
  };

  /**
   * Skip rest timer
   */
  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  /**
   * Format time display
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedSets = currentProgress.completedSets.length;
  const workoutProgress = Math.round((currentExerciseIndex / dayExercises.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header
        title={`Day ${dayNumber} Workout`}
      />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Workout Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-slate-900 dark:text-slate-100">
                {t('workoutProgress')}
              </h3>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {currentExerciseIndex + 1} / {dayExercises.length}
              </span>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${workoutProgress}%` }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatTime(workoutDuration)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('duration')}
                </p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {exerciseProgress.filter(p => p.isCompleted).length}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('completed')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rest Timer */}
        {isResting && (
          <Card className="mb-6 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6 text-center">
              <Timer className="h-12 w-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {t('restTime')}
              </h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                {formatTime(restTimer)}
              </p>
              <Button onClick={skipRest} variant="outline" size="sm">
                {t('skipRest')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Current Exercise */}
        {!isWorkoutCompleted && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {typeof currentExercise.name === 'string'
                    ? currentExercise.name
                    : currentExercise.name[language] || currentExercise.name.en}
                </h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousExercise}
                    disabled={currentExerciseIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextExercise}
                    disabled={currentExerciseIndex === dayExercises.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Exercise Image/Video Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center text-white">
                  <Dumbbell className="h-12 w-12 mx-auto mb-2 opacity-75" />
                  <p className="text-sm opacity-75">{t('exerciseDemo')}</p>
                </div>
              </div>

              {/* Set Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    {t('setProgress')}
                  </h3>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {completedSets} / {targetSets} {t('sets')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {targetSets}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {t('sets')}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <RotateCcw className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {targetReps}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {t('reps')}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {currentExercise.restSeconds || 60}s
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {t('rest')}
                    </p>
                  </div>
                </div>

                {/* Completed Sets */}
                {currentProgress.completedSets.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t('completedSets')}:
                    </h4>
                    {currentProgress.completedSets.map((set, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {t('set')} {index + 1}: {set.reps} {t('reps')}
                          {set.weight && ` @ ${set.weight}kg`}
                        </span>
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Current Set Input */}
              {!currentProgress.isCompleted && !isResting && (
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    {t('set')} {currentProgress.currentSet}
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {t('reps')}
                      </label>
                      <input
                        type="number"
                        defaultValue={targetReps}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        id="reps-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {t('weight')} (kg)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        id="weight-input"
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      const repsInput = document.getElementById('reps-input') as HTMLInputElement;
                      const weightInput = document.getElementById('weight-input') as HTMLInputElement;
                      const reps = parseInt(repsInput.value) || targetReps;
                      const weight = parseFloat(weightInput.value) || undefined;
                      completeSet(reps, weight);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {t('completeSet')}
                  </Button>
                </div>
              )}

              {/* Exercise Completed */}
              {currentProgress.isCompleted && (
                <div className="text-center py-6">
                  <Check className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">
                    {t('exerciseCompleted')}
                  </h3>
                  <Button onClick={nextExercise} className="mt-4">
                    {currentExerciseIndex === dayExercises.length - 1 ? t('finishWorkout') : t('nextExercise')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Workout Completed */}
        {isWorkoutCompleted && (
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                {t('workoutCompleted')}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatTime(workoutDuration)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('totalTime')}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {exerciseProgress.filter(p => p.isCompleted).length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('exercisesCompleted')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => navigate('/training')}
                >
                  {t('backToTraining')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/dashboard')}
                >
                  {t('backToDashboard')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
