/**
 * Application constants and configuration
 */

import type { UserGoal, ActivityLevel, ExerciseDifficulty } from '../types';

/**
 * Application metadata
 */
export const APP_CONFIG = {
  name: 'Do IT',
  version: '1.0.0',
  description: 'Personalized fitness and diet application',
  author: 'Do IT Team',
  supportEmail: 'support@doit-app.com',
  website: 'https://doit-app.com',
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

/**
 * Storage keys for localStorage
 */
export const STORAGE_KEYS = {
  USER_PROFILE: 'userProfile',
  LANGUAGE: 'language',
  THEME: 'theme',
  ONBOARDING_PROGRESS: 'onboardingProgress',
  WORKOUT_SESSIONS: 'workoutSessions',
  PROGRESS_DATA: 'progressData',
  SETTINGS: 'settings',
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  WELCOME: '/welcome',
  REGISTER: {
    PROFILE: '/register/profile',
    GOAL: '/register/goal',
    MEDIA: '/register/media',
  },
  DASHBOARD: '/dashboard',
  DIET_PLAN: '/diet-plan',
  TRAINING_PLAN: '/training-plan',
  EXERCISES: '/exercises',
  EXERCISE_DETAIL: '/exercises/:exerciseId',
  PROFILE: '/profile',
  SUBSCRIPTION: '/subscription',
  COACHING: '/coaching',
  ANALYTICS: '/advanced-analytics',
} as const;

/**
 * User goals configuration
 */
export const USER_GOALS: Record<UserGoal, {
  key: UserGoal;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  color: string;
  calorieModifier: number; // multiplier for TDEE
}> = {
  lose_weight: {
    key: 'lose_weight',
    nameKey: 'goals.loseWeight.name',
    descriptionKey: 'goals.loseWeight.description',
    icon: '📉',
    color: 'text-red-500',
    calorieModifier: 0.8, // 20% deficit
  },
  gain_weight: {
    key: 'gain_weight',
    nameKey: 'goals.gainWeight.name',
    descriptionKey: 'goals.gainWeight.description',
    icon: '📈',
    color: 'text-green-500',
    calorieModifier: 1.2, // 20% surplus
  },
  gain_muscle: {
    key: 'gain_muscle',
    nameKey: 'goals.gainMuscle.name',
    descriptionKey: 'goals.gainMuscle.description',
    icon: '💪',
    color: 'text-blue-500',
    calorieModifier: 1.1, // 10% surplus
  },
  extra_diet: {
    key: 'extra_diet',
    nameKey: 'goals.extraDiet.name',
    descriptionKey: 'goals.extraDiet.description',
    icon: '🥗',
    color: 'text-purple-500',
    calorieModifier: 1.0, // maintenance
  },
} as const;

/**
 * Activity levels configuration
 */
export const ACTIVITY_LEVELS: Record<ActivityLevel, {
  key: ActivityLevel;
  nameKey: string;
  descriptionKey: string;
  multiplier: number; // BMR multiplier for TDEE calculation
}> = {
  sedentary: {
    key: 'sedentary',
    nameKey: 'activityLevels.sedentary.name',
    descriptionKey: 'activityLevels.sedentary.description',
    multiplier: 1.2,
  },
  light: {
    key: 'light',
    nameKey: 'activityLevels.light.name',
    descriptionKey: 'activityLevels.light.description',
    multiplier: 1.375,
  },
  moderate: {
    key: 'moderate',
    nameKey: 'activityLevels.moderate.name',
    descriptionKey: 'activityLevels.moderate.description',
    multiplier: 1.55,
  },
  active: {
    key: 'active',
    nameKey: 'activityLevels.active.name',
    descriptionKey: 'activityLevels.active.description',
    multiplier: 1.725,
  },
  veryActive: {
    key: 'veryActive',
    nameKey: 'activityLevels.veryActive.name',
    descriptionKey: 'activityLevels.veryActive.description',
    multiplier: 1.9,
  },
} as const;

/**
 * Exercise difficulty configuration
 */
export const EXERCISE_DIFFICULTIES: Record<ExerciseDifficulty, {
  key: ExerciseDifficulty;
  nameKey: string;
  color: string;
  intensity: number; // 1-10 scale
}> = {
  beginner: {
    key: 'beginner',
    nameKey: 'difficulty.beginner',
    color: 'text-green-500',
    intensity: 3,
  },
  intermediate: {
    key: 'intermediate',
    nameKey: 'difficulty.intermediate',
    color: 'text-yellow-500',
    intensity: 6,
  },
  advanced: {
    key: 'advanced',
    nameKey: 'difficulty.advanced',
    color: 'text-red-500',
    intensity: 9,
  },
} as const;

/**
 * Subscription packages configuration
 */
export const SUBSCRIPTION_PACKAGES = {
  basic: {
    id: 'basic',
    price: 300,
    currency: 'SAR',
    period: 'month',
    features: [
      'personalizedWorkoutPlans',
      'dietNutritionGuidance',
      'progressTracking',
      'basicExerciseLibrary',
    ],
    limitations: [
      'noPersonalCoaching',
      'noAdvancedAnalytics',
      'limitedSupport',
    ],
  },
  vip: {
    id: 'vip',
    price: 550,
    currency: 'SAR',
    period: 'month',
    features: [
      'personalizedWorkoutPlans',
      'dietNutritionGuidance',
      'progressTracking',
      'completeExerciseLibrary',
      'personalCoachingSessions',
      'advancedAnalytics',
      'prioritySupport',
      'customMealPlans',
      'videoConsultations',
    ],
    limitations: [],
  },
} as const;

/**
 * Macro distribution by goal (percentage of total calories)
 */
export const MACRO_DISTRIBUTIONS: Record<UserGoal, {
  protein: number;
  carbs: number;
  fats: number;
}> = {
  lose_weight: { protein: 35, carbs: 35, fats: 30 },
  gain_weight: { protein: 25, carbs: 45, fats: 30 },
  gain_muscle: { protein: 30, carbs: 40, fats: 30 },
  extra_diet: { protein: 25, carbs: 50, fats: 25 },
} as const;

/**
 * BMI categories
 */
export const BMI_CATEGORIES = {
  underweight: { min: 0, max: 18.5, color: 'text-blue-500', key: 'bmi.underweight' },
  normal: { min: 18.5, max: 25, color: 'text-green-500', key: 'bmi.normal' },
  overweight: { min: 25, max: 30, color: 'text-yellow-500', key: 'bmi.overweight' },
  obese: { min: 30, max: 100, color: 'text-red-500', key: 'bmi.obese' },
} as const;

/**
 * Water intake recommendations (liters per day)
 */
export const WATER_INTAKE = {
  baseAmount: 35, // ml per kg of body weight
  exerciseBonus: 500, // additional ml for active days
  climateBonus: 200, // additional ml for hot climate
  minAmount: 1.5, // minimum liters per day
  maxAmount: 4.0, // maximum recommended liters per day
} as const;

/**
 * Workout timing constants
 */
export const WORKOUT_TIMING = {
  warmUpDuration: 5, // minutes
  coolDownDuration: 5, // minutes
  restBetweenSets: {
    strength: 60, // seconds
    cardio: 30, // seconds
    flexibility: 15, // seconds
  },
  maxWorkoutDuration: 120, // minutes
  minWorkoutDuration: 15, // minutes
} as const;

/**
 * Validation limits
 */
export const VALIDATION_LIMITS = {
  age: { min: 13, max: 100 },
  weight: { min: 30, max: 300 }, // kg
  height: { min: 100, max: 250 }, // cm
  bodyFat: { min: 5, max: 50 }, // percentage
  name: { min: 2, max: 50 },
  email: { min: 5, max: 100 },
  phone: { min: 10, max: 15 },
  password: { min: 8, max: 128 },
} as const;

/**
 * File upload limits
 */
export const FILE_LIMITS = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxWidth: 2048,
    maxHeight: 2048,
  },
  video: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxDuration: 300, // 5 minutes
  },
} as const;

/**
 * Animation durations (milliseconds)
 */
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  page: 200,
  modal: 250,
} as const;

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Default values
 */
export const DEFAULTS = {
  language: 'en' as const,
  theme: 'system' as const,
  currency: 'SAR' as const,
  country: 'SA' as const,
  timezone: 'Asia/Riyadh' as const,
} as const;
