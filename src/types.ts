/**
 * Main types file - Re-exports from organized type modules
 * This maintains backward compatibility while using the new organized structure
 */

// Re-export all types from the new organized structure
export * from './types/index';

// Legacy interfaces for backward compatibility
export interface LegacyUserProfile {
  firstName: string;
  lastName: string;
  name: string;
  gender: 'male' | 'female';
  weight: number; // in kg
  height: number; // in cm
  age: number;
  email: string;
  phone: string;
  goal: 'Lose Weight' | 'Gain Weight' | 'Gain Muscle' | 'Extra Diet';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  profilePhoto?: string;
  progressVideos?: string[];
}

export interface LegacyExercise {
  id: string;
  name: string;
  targetMuscle: string;
  sets: number;
  reps: {
    'Lose Weight': number;
    'Gain Muscle': number;
    'Gain Weight': number;
    'Extra Diet': number;
  };
  photoUrl: string;
  videoUrl: string;
}

export interface LegacyMeal {
  id: string;
  name: string;
  time: string;
  foods: string[];
  calories: number;
  portions: string;
}

export interface LegacyDietPlan {
  meals: LegacyMeal[];
  totalCalories: number;
  waterIntake: number;
}

export interface LegacyTrainingPlan {
  days: {
    [key: string]: {
      name: string;
      exercises: string[]; // exercise IDs
    };
  };
}

export interface LegacyPlan {
  diet: LegacyDietPlan;
  training: LegacyTrainingPlan;
}

export interface Plans {
  'Lose Weight': LegacyPlan;
  'Gain Weight': LegacyPlan;
  'Gain Muscle': LegacyPlan;
  'Extra Diet': LegacyPlan;
}

// Type aliases for backward compatibility
export type { UserProfile as LegacyUserProfileAlias } from './types/index';