/**
 * Main types and interfaces for the Do IT application
 */

// Re-export types from individual modules to avoid circular imports
export type { UserRegistrationData, UserPreferences, UserAuthState, UserProfileUpdate } from './user.types';
export * from './plan.types';

/**
 * Translation structure interface
 */
export interface Translations {
  [key: string]: string | string[] | Translations;
}

/**
 * Localized string type
 */
export interface LocalizedString {
  en: string;
  ar: string;
}

/**
 * Subscription types
 */
export type SubscriptionType = 'basic' | 'vip';

/**
 * User goals
 */
export type UserGoal = 'lose_weight' | 'gain_weight' | 'gain_muscle' | 'extra_diet';

/**
 * Macronutrient breakdown
 */
export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

/**
 * Theme types
 */
export type Theme = 'light' | 'dark';

/**
 * Exercise difficulty levels
 */
export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Meal times
 */
export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/**
 * Gender types
 */
export type Gender = 'male' | 'female' | 'other';

/**
 * Activity levels
 */
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

/**
 * Language types
 */
export type Language = 'en' | 'ar';

/**
 * User profile interface
 */
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  birthDate: string;
  weight: number; // in kg
  height: number; // in cm
  goal: UserGoal;
  activityLevel: ActivityLevel;
  profilePhotoUrl?: string;
  progressVideos?: string[];
  preferences: {
    language: Language;
    theme: Theme;
    notifications: boolean;
  };
  subscription?: {
    type: SubscriptionType;
    startDate: string;
    endDate: string;
    status: 'active' | 'expired' | 'cancelled';
    autoRenew?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Exercise interface
 */
export interface Exercise {
  id: string;
  name: LocalizedString;
  targetMuscle: string[];
  equipment: string[];
  difficulty: ExerciseDifficulty;
  sets: number;
  reps: {
    loseWeight: string;
    gainMuscle: string;
    gainWeight: string;
  };
  restSeconds: number;
  instructions: LocalizedString[];
  tips: LocalizedString[];
  photoUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  calories: number; // calories burned per set
}



/**
 * Food item interface
 */
export interface FoodItem {
  id: string;
  name: LocalizedString;
  calories: number; // per 100g
  macros: Macros; // per 100g
  servingSize: number; // in grams
  category: string;
  imageUrl?: string;
}

/**
 * Meal interface
 */
export interface Meal {
  id: string;
  time: MealTime;
  name: LocalizedString;
  foods: {
    food: FoodItem;
    quantity: number; // in grams
  }[];
  totalCalories: number;
  totalMacros: Macros;
  preparationTime: number; // in minutes
  instructions: LocalizedString[];
}

/**
 * Diet plan interface
 */
export interface DietPlan {
  id: string;
  goal: UserGoal;
  meals: Meal[];
  dailyCalories: number;
  dailyMacros: Macros;
  hydration: number; // in liters
  notes: LocalizedString[];
}

/**
 * Workout day interface
 */
export interface WorkoutDay {
  day: string;
  exercises: {
    exercise: Exercise;
    sets: number;
    reps: string;
    restSeconds: number;
    completed?: boolean;
  }[];
  totalDuration: number; // in minutes
  targetMuscles: string[];
}

/**
 * Training plan interface
 */
export interface TrainingPlan {
  id: string;
  goal: UserGoal;
  days: { [key: string]: WorkoutDay };
  weeklySchedule: string[];
  notes: LocalizedString[];
}

/**
 * Complete user plan interface
 */
export interface Plan {
  id: string;
  userId: string;
  diet: DietPlan;
  training: TrainingPlan;
  createdAt: string;
  updatedAt: string;
}

/**
 * Calorie targets interface
 */
export interface CalorieTargets {
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  target: number; // Target calories based on goal
  deficit?: number; // For weight loss
  surplus?: number; // For weight gain
}

/**
 * Subscription package interface
 */
export interface SubscriptionPackage {
  id: string;
  name: LocalizedString;
  type: SubscriptionType;
  price: number;
  currency: string;
  period: string;
  features: {
    text: LocalizedString;
    included: boolean;
  }[];
  popular?: boolean;
  description: LocalizedString;
}

/**
 * Progress tracking interface
 */
export interface Progress {
  id: string;
  userId: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  photos?: string[];
  notes?: string;
}

/**
 * Workout session interface
 */
export interface WorkoutSession {
  id: string;
  userId: string;
  workoutId: string;
  date: string;
  exercises: {
    exerciseId: string;
    sets: {
      reps: number;
      weight?: number;
      duration?: number;
      completed: boolean;
    }[];
    completed: boolean;
  }[];
  duration: number; // in minutes
  caloriesBurned: number;
  notes?: string;
}

/**
 * API response interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Form validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * App state interface
 */
export interface AppState {
  user: UserProfile | null;
  currentPlan: Plan | null;
  isLoading: boolean;
  error: string | null;
}
