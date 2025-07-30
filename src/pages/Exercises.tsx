import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import type { Exercise } from '../types';
import exercisesData from '../data/exercises.json';
import { 
  Search,
  Filter,
  Play,
  Dumbbell,
  Target,
  Clock
} from 'lucide-react';

/**
 * Exercises component displaying all available exercises with search and filter
 */
export function Exercises() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');

  useEffect(() => {
    if (!user) {
      navigate('/welcome');
      return;
    }

    // Load exercises data
    const exercisesList = exercisesData as Exercise[];
    setExercises(exercisesList);
    setFilteredExercises(exercisesList);
  }, [user, navigate]);

  useEffect(() => {
    // Filter exercises based on search term and selected muscle
    let filtered = exercises;

    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.targetMuscle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedMuscle !== 'all') {
      filtered = filtered.filter(exercise =>
        exercise.targetMuscle.toLowerCase() === selectedMuscle.toLowerCase()
      );
    }

    setFilteredExercises(filtered);
  }, [searchTerm, selectedMuscle, exercises]);

  if (!user) {
    return null;
  }

  // Get unique muscle groups
  const muscleGroups = ['all', ...Array.from(new Set(exercises.map(ex => ex.targetMuscle)))];

  /**
   * Get exercise reps based on user goal
   */
  const getExerciseReps = (exercise: Exercise, goal: string) => {
    const goalKey = goal.toLowerCase().replace(' ', '') as keyof Exercise['reps'];
    return exercise.reps[goalKey] || exercise.reps.loseWeight;
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
        title={t('exerciseVideos')}
      />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder={t('searchExercises')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Muscle Group Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t('filterByMuscle')}
              </span>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {muscleGroups.map((muscle) => (
                <Button
                  key={muscle}
                  variant={selectedMuscle === muscle ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMuscle(muscle)}
                  className="whitespace-nowrap capitalize"
                >
                  {muscle === 'all' ? t('all') : muscle}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {filteredExercises.length} {t('exercisesFound')}
          </p>
        </div>

        {/* Exercises List */}
        <div className="space-y-4">
          {filteredExercises.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  {t('noExercisesFound')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('tryDifferentSearch')}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredExercises.map((exercise) => {
              const reps = getExerciseReps(exercise, user.goal);
              
              return (
                <Card 
                  key={exercise.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/exercises/${exercise.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* Exercise Image Placeholder */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Dumbbell className="h-8 w-8 text-white" />
                      </div>
                      
                      {/* Exercise Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                          {exercise.name}
                        </h3>
                        
                        {/* Muscle Group Badge */}
                        <div className="mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getMuscleGroupColor(exercise.targetMuscle)
                          }`}>
                            {exercise.targetMuscle}
                          </span>
                        </div>
                        
                        {/* Exercise Stats */}
                        <div className="flex items-center space-x-4 text-xs text-slate-600 dark:text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Target className="h-3 w-3" />
                            <span>{reps.sets}x{reps.reps}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{reps.rest}s {t('rest')}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Play Button */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Play className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Quick Stats */}
        {filteredExercises.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
                {t('quickStats')}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {filteredExercises.length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('exercises')}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {new Set(filteredExercises.map(ex => ex.targetMuscle)).size}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('muscleGroups')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}