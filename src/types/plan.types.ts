/**
 * Plan-specific type definitions
 */

// Import only the basic types to avoid circular imports
export type UserGoal = 'loseWeight' | 'gainWeight' | 'gainMuscle' | 'extraDiet';
export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface Macros {
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
  calories: number; // total calories
}

// Import EnhancedExercise and MuscleGroup from exercise.types
import type { EnhancedExercise, MuscleGroup } from './exercise.types';

/**
 * Plan generation parameters
 */
export interface PlanGenerationParams {
  userId: string;
  goal: UserGoal;
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  preferences?: {
    workoutDays: number;
    workoutDuration: number; // minutes
    dietaryRestrictions: string[];
    allergies: string[];
    dislikedFoods: string[];
    preferredCuisines: string[];
  };
}

/**
 * Nutritional information
 */
export interface NutritionalInfo {
  calories: number;
  macros: Macros;
  micronutrients?: {
    vitamins: { [key: string]: number };
    minerals: { [key: string]: number };
  };
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
}

/**
 * Food ingredient
 */
export interface FoodIngredient {
  id: string;
  name: LocalizedString;
  quantity: number;
  unit: string;
  nutrition: NutritionalInfo;
  category: string;
  allergens: string[];
  isOptional?: boolean;
  substitutes?: FoodIngredient[];
}

/**
 * Recipe instruction
 */
export interface RecipeInstruction {
  step: number;
  description: LocalizedString;
  duration?: number; // in minutes
  temperature?: number; // in celsius
  imageUrl?: string;
}

/**
 * Enhanced meal interface
 */
export interface EnhancedMeal {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  mealTime: MealTime;
  category: string;
  cuisine: string;
  
  // Ingredients and preparation
  ingredients: FoodIngredient[];
  instructions: RecipeInstruction[];
  preparationTime: number; // in minutes
  cookingTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Nutritional information
  nutrition: NutritionalInfo;
  
  // Media
  imageUrl: string;
  videoUrl?: string;
  
  // Goal suitability
  suitableForGoals: UserGoal[];
  
  // Metadata
  tags: string[];
  rating?: number;
  reviews?: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isKeto: boolean;
  isLowCarb: boolean;
  isHighProtein: boolean;
}

/**
 * Daily meal plan
 */
export interface DailyMealPlan {
  date: string;
  meals: {
    [K in MealTime]: EnhancedMeal[];
  };
  totalNutrition: NutritionalInfo;
  waterIntake: number; // in liters
  supplements?: {
    name: string;
    dosage: string;
    timing: string;
  }[];
  notes?: LocalizedString[];
}

/**
 * Weekly meal plan
 */
export interface WeeklyMealPlan {
  id: string;
  name: LocalizedString;
  goal: UserGoal;
  days: DailyMealPlan[];
  shoppingList: {
    category: string;
    items: {
      ingredient: FoodIngredient;
      totalQuantity: number;
      unit: string;
      estimated_cost?: number;
    }[];
  }[];
  weeklyNutritionSummary: {
    averageDaily: NutritionalInfo;
    weeklyTotals: NutritionalInfo;
    adherenceScore: number; // 0-100
  };
  mealPrepInstructions?: {
    day: string;
    tasks: LocalizedString[];
    estimatedTime: number;
  }[];
}

/**
 * Exercise set
 */
export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight?: number;
  duration?: number; // for time-based exercises
  distance?: number; // for cardio exercises
  restTime: number; // in seconds
  rpe?: number; // Rate of Perceived Exertion (1-10)
  completed: boolean;
  notes?: string;
}

/**
 * Workout exercise
 */
export interface WorkoutExercise {
  exercise: EnhancedExercise;
  order: number;
  sets: ExerciseSet[];
  targetSets: number;
  targetReps: string;
  targetWeight?: number;
  restBetweenSets: number;
  instructions?: LocalizedString[];
  modifications?: LocalizedString[];
  completed: boolean;
}

/**
 * Daily workout
 */
export interface DailyWorkout {
  id: string;
  name: LocalizedString;
  date: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'rest' | 'mixed';
  targetMuscles: MuscleGroup[];
  exercises: WorkoutExercise[];
  warmUp?: {
    exercises: WorkoutExercise[];
    duration: number;
  };
  coolDown?: {
    exercises: WorkoutExercise[];
    duration: number;
  };
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  caloriesBurned?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  notes?: LocalizedString[];
  completed: boolean;
  completedAt?: string;
}

/**
 * Weekly training plan
 */
export interface WeeklyTrainingPlan {
  id: string;
  name: LocalizedString;
  goal: UserGoal;
  week: number;
  days: DailyWorkout[];
  restDays: string[];
  weeklyVolume: {
    totalSets: number;
    totalReps: number;
    totalWeight: number;
    totalDuration: number;
    caloriesBurned: number;
  };
  progressiveOverload: {
    weeklyIncrease: number; // percentage
    method: 'weight' | 'reps' | 'sets' | 'time';
  };
  deloadWeek?: boolean;
}

/**
 * Complete fitness plan
 */
export interface CompleteFitnessPlan {
  id: string;
  userId: string;
  name: LocalizedString;
  goal: UserGoal;
  startDate: string;
  endDate: string;
  duration: number; // in weeks
  
  // Plans
  mealPlan: WeeklyMealPlan[];
  trainingPlan: WeeklyTrainingPlan[];
  
  // Targets and metrics
  targets: {
    weightChange: number; // kg
    bodyFatChange?: number; // percentage
    strengthGains?: { [exerciseId: string]: number }; // percentage
    enduranceGains?: number; // percentage
  };
  
  // Progress tracking
  milestones: {
    week: number;
    description: LocalizedString;
    metrics: string[];
    completed: boolean;
  }[];
  
  // Adjustments and modifications
  adjustments: {
    date: string;
    reason: string;
    changes: string[];
    modifiedBy: 'user' | 'coach' | 'system';
  }[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  adherenceScore?: number; // 0-100
}

/**
 * Plan template
 */
export interface PlanTemplate {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  goal: UserGoal;
  duration: number; // in weeks
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetAudience: {
    ageRange: { min: number; max: number };
    fitnessLevel: string[];
    equipment: string[];
  };
  mealPlanTemplate: Partial<WeeklyMealPlan>;
  trainingPlanTemplate: Partial<WeeklyTrainingPlan>;
  expectedResults: LocalizedString[];
  requirements: LocalizedString[];
  tags: string[];
  rating?: number;
  usageCount?: number;
  createdBy?: string;
  isPublic: boolean;
}

/**
 * Plan customization options
 */
export interface PlanCustomization {
  workoutFrequency: number; // days per week
  workoutDuration: number; // minutes per session
  intensityLevel: 'low' | 'moderate' | 'high';
  equipmentAvailable: string[];
  dietaryPreferences: string[];
  allergies: string[];
  dislikedExercises: string[];
  preferredMealTimes: MealTime[];
  budgetConstraints?: {
    groceryBudget: number;
    supplementBudget: number;
  };
  timeConstraints: {
    mealPrepTime: number; // minutes per day
    workoutTime: number; // minutes per day
  };
}

/**
 * Plan progress summary
 */
export interface PlanProgressSummary {
  planId: string;
  userId: string;
  startDate: string;
  currentWeek: number;
  totalWeeks: number;
  adherence: {
    workout: number; // percentage
    diet: number; // percentage
    overall: number; // percentage
  };
  results: {
    weightChange: number;
    bodyFatChange?: number;
    strengthGains: { [exerciseId: string]: number };
    measurements?: { [bodyPart: string]: number };
  };
  nextMilestone?: {
    week: number;
    description: LocalizedString;
    daysRemaining: number;
  };
  recommendations: LocalizedString[];
}
