/**
 * Exercise-specific type definitions
 */

// Import only the basic types to avoid circular imports
export interface LocalizedString {
  en: string;
  ar: string;
}

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type UserGoal = 'loseWeight' | 'gainWeight' | 'gainMuscle' | 'extraDiet';

/**
 * Exercise category
 */
export type ExerciseCategory = 
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'balance'
  | 'sports'
  | 'rehabilitation';

/**
 * Equipment type
 */
export type EquipmentType = 
  | 'bodyweight'
  | 'dumbbells'
  | 'barbell'
  | 'kettlebell'
  | 'resistance_bands'
  | 'cable_machine'
  | 'treadmill'
  | 'stationary_bike'
  | 'rowing_machine'
  | 'pull_up_bar'
  | 'bench'
  | 'stability_ball'
  | 'medicine_ball'
  | 'foam_roller';

/**
 * Muscle group
 */
export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'lower_back'
  | 'glutes'
  | 'quadriceps'
  | 'hamstrings'
  | 'calves'
  | 'full_body'
  | 'core';

/**
 * Exercise movement pattern
 */
export type MovementPattern = 
  | 'push'
  | 'pull'
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'carry'
  | 'rotation'
  | 'gait';

/**
 * Exercise instruction step
 */
export interface ExerciseInstruction {
  step: number;
  description: LocalizedString;
  imageUrl?: string;
  videoTimestamp?: number; // seconds into the main video
}

/**
 * Exercise variation
 */
export interface ExerciseVariation {
  id: string;
  name: LocalizedString;
  difficulty: ExerciseDifficulty;
  description: LocalizedString;
  modifications: LocalizedString[];
  videoUrl?: string;
  imageUrl?: string;
}

/**
 * Exercise progression
 */
export interface ExerciseProgression {
  beginner: {
    sets: number;
    reps: string;
    weight?: string;
    duration?: number;
  };
  intermediate: {
    sets: number;
    reps: string;
    weight?: string;
    duration?: number;
  };
  advanced: {
    sets: number;
    reps: string;
    weight?: string;
    duration?: number;
  };
}

/**
 * Exercise safety information
 */
export interface ExerciseSafety {
  contraindications: LocalizedString[];
  commonMistakes: LocalizedString[];
  safetyTips: LocalizedString[];
  injuryRisk: 'low' | 'medium' | 'high';
  requiredSupervision: boolean;
}

/**
 * Exercise metrics
 */
export interface ExerciseMetrics {
  caloriesPerMinute: number;
  averageHeartRate?: number;
  mets: number; // Metabolic Equivalent of Task
  difficultyRating: number; // 1-10 scale
  popularityScore: number;
  effectivenessRating: {
    strength: number;
    cardio: number;
    flexibility: number;
    balance: number;
  };
}

/**
 * Enhanced exercise interface
 */
export interface EnhancedExercise {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  category: ExerciseCategory;
  targetMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: EquipmentType[];
  difficulty: ExerciseDifficulty;
  movementPattern: MovementPattern[];
  
  // Media
  thumbnailUrl: string;
  imageUrls: string[];
  videoUrl: string;
  alternativeVideoUrls?: string[];
  
  // Instructions
  instructions: ExerciseInstruction[];
  tips: LocalizedString[];
  variations: ExerciseVariation[];
  progression: ExerciseProgression;
  safety: ExerciseSafety;
  
  // Metrics
  metrics: ExerciseMetrics;
  
  // Goal-specific parameters
  goalParameters: {
    [K in UserGoal]: {
      sets: number;
      reps: string;
      restSeconds: number;
      intensity: 'low' | 'medium' | 'high';
      frequency: number; // times per week
    };
  };
  
  // Metadata
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

/**
 * Exercise filter options
 */
export interface ExerciseFilters {
  category?: ExerciseCategory[];
  targetMuscles?: MuscleGroup[];
  equipment?: EquipmentType[];
  difficulty?: ExerciseDifficulty[];
  duration?: {
    min: number;
    max: number;
  };
  caloriesBurned?: {
    min: number;
    max: number;
  };
  searchQuery?: string;
}

/**
 * Exercise search result
 */
export interface ExerciseSearchResult {
  exercises: EnhancedExercise[];
  totalCount: number;
  filters: {
    categories: { value: ExerciseCategory; count: number }[];
    muscles: { value: MuscleGroup; count: number }[];
    equipment: { value: EquipmentType; count: number }[];
    difficulties: { value: ExerciseDifficulty; count: number }[];
  };
}

/**
 * Exercise performance tracking
 */
export interface ExercisePerformance {
  exerciseId: string;
  userId: string;
  sessions: {
    date: string;
    sets: {
      reps: number;
      weight?: number;
      duration?: number;
      restTime?: number;
      rpe?: number; // Rate of Perceived Exertion (1-10)
    }[];
    notes?: string;
    difficulty: number; // 1-10 scale
    form: number; // 1-10 scale
  }[];
  personalBests: {
    maxWeight?: number;
    maxReps?: number;
    longestDuration?: number;
    bestForm?: number;
  };
  averagePerformance: {
    weight?: number;
    reps?: number;
    duration?: number;
    consistency: number; // percentage
  };
}

/**
 * Exercise recommendation
 */
export interface ExerciseRecommendation {
  exercise: EnhancedExercise;
  reason: LocalizedString;
  confidence: number; // 0-1 scale
  alternatives: EnhancedExercise[];
  priority: 'high' | 'medium' | 'low';
}

/**
 * Workout template
 */
export interface WorkoutTemplate {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  category: ExerciseCategory;
  targetMuscles: MuscleGroup[];
  difficulty: ExerciseDifficulty;
  estimatedDuration: number; // in minutes
  exercises: {
    exercise: EnhancedExercise;
    order: number;
    sets: number;
    reps: string;
    restSeconds: number;
    notes?: LocalizedString;
  }[];
  equipment: EquipmentType[];
  goals: UserGoal[];
  tags: string[];
  isPublic: boolean;
  createdBy?: string;
  rating?: number;
  usageCount?: number;
}
