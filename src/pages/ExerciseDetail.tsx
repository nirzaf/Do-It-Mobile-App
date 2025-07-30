import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import type { Exercise } from '../types';
import exercisesData from '../data/exercises.json';
import { 
  Play,
  Pause,
  RotateCcw,
  Target,
  Clock,
  Dumbbell,
  CheckCircle,
  AlertCircle,
  Volume2,
  VolumeX
} from 'lucide-react';

/**
 * Exercise detail component displaying individual exercise information with video
 */
export function ExerciseDetail() {
  const navigate = useNavigate();
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { t } = useLanguage();
  const { user } = useUser();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/welcome');
      return;
    }

    if (!exerciseId) {
      navigate('/exercises');
      return;
    }

    // Find exercise by ID
    const exercises = exercisesData as Exercise[];
    const foundExercise = exercises.find(ex => ex.id === exerciseId);
    
    if (!foundExercise) {
      navigate('/exercises');
      return;
    }

    setExercise(foundExercise);
  }, [user, exerciseId, navigate]);

  useEffect(() => {
    let interval: number;
    
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting, restTimer]);

  if (!user || !exercise) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  /**
   * Get exercise reps based on user goal
   */
  const getExerciseReps = (exercise: Exercise, goal: string) => {
    const goalKey = goal as keyof Exercise['reps'];
    return exercise.reps[goalKey] || exercise.reps['Lose Weight'];
  };

  const reps = getExerciseReps(exercise, user.goal);

  /**
   * Toggle video play/pause
   */
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  /**
   * Toggle video mute
   */
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  /**
   * Complete a rep
   */
  const completeRep = () => {
    if (currentRep < reps) {
      setCurrentRep(prev => prev + 1);
    } else {
      // Set completed, start rest or move to next set
      if (currentSet < exercise.sets) {
        setIsResting(true);
        setRestTimer(60); // Default 60 seconds rest
        setCurrentSet(prev => prev + 1);
        setCurrentRep(0);
      } else {
        // Exercise completed
        setIsCompleted(true);
      }
    }
  };

  /**
   * Reset exercise
   */
  const resetExercise = () => {
    setCurrentSet(1);
    setCurrentRep(0);
    setIsResting(false);
    setRestTimer(0);
    setIsCompleted(false);
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
        title={exercise.name}
      />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Video Player */}
        <Card className="mb-6 overflow-hidden">
          <div className="relative aspect-video bg-slate-900">
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
              <div className="text-center text-white">
                <Dumbbell className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">{exercise.name}</p>
                <p className="text-sm opacity-75">{t('exerciseVideo')}</p>
              </div>
            </div>
            
            {/* Video Controls */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={togglePlay}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8" />
                )}
              </Button>
            </div>
            
            {/* Volume Control */}
            <div className="absolute top-4 right-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleMute}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Exercise Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {exercise.name}
                </h1>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  getMuscleGroupColor(exercise.targetMuscle)
                }`}>
                  {exercise.targetMuscle}
                </span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center space-x-1 text-blue-600 dark:text-blue-400 mb-1">
                  <Target className="h-4 w-4" />
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {exercise.sets}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('sets')}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1 text-green-600 dark:text-green-400 mb-1">
                  <RotateCcw className="h-4 w-4" />
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {reps}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('reps')}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1 text-purple-600 dark:text-purple-400 mb-1">
                  <Clock className="h-4 w-4" />
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  60s
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('rest')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout Progress */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('workoutProgress')}
            </h2>
          </CardHeader>
          
          <CardContent>
            {isCompleted ? (
              <div className="text-center py-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {t('exerciseCompleted')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {t('greatJob')}
                </p>
                <Button onClick={resetExercise} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t('doAgain')}
                </Button>
              </div>
            ) : isResting ? (
              <div className="text-center py-6">
                <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {t('restTime')}
                </h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {restTimer}s
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('getReady')} {t('set')} {currentSet}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t('currentSet')}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {currentSet} / {exercise.sets}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t('currentRep')}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {currentRep} / {reps}
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((currentSet - 1) * reps + currentRep) / (exercise.sets * reps) * 100}%` 
                    }}
                  ></div>
                </div>
                
                <Button 
                  onClick={completeRep}
                  className="w-full"
                  size="lg"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {t('completeRep')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('instructions')}
            </h2>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('watchVideoCarefully')}
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('performExerciseSlowly')}
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('takeRestBetweenSets')}
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('stopIfPain')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}