/**
 * User-specific type definitions
 */

import type { UserProfile } from './index';

// Import only the basic types to avoid circular imports
export type UserGoal = 'loseWeight' | 'gainWeight' | 'gainMuscle' | 'extraDiet';
export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark' | 'system';
export type SubscriptionType = 'basic' | 'vip';

/**
 * User registration form data
 */
export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  birthDate: string;
  weight: number;
  height: number;
  goal: UserGoal;
  activityLevel: ActivityLevel;
  profilePhotoUrl?: string;
  progressVideos?: string[];
}

/**
 * User preferences
 */
export interface UserPreferences {
  language: Language;
  theme: Theme;
  notifications: boolean;
  units: {
    weight: 'kg' | 'lbs';
    height: 'cm' | 'ft';
    temperature: 'celsius' | 'fahrenheit';
  };
  privacy: {
    shareProgress: boolean;
    publicProfile: boolean;
  };
}

/**
 * User subscription details
 */
export interface UserSubscription {
  type: SubscriptionType;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod?: {
    type: 'card' | 'paypal' | 'bank';
    last4?: string;
    expiryDate?: string;
  };
  status: 'active' | 'expired' | 'cancelled' | 'pending';
}

/**
 * User health metrics
 */
export interface UserHealthMetrics {
  bmi: number;
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  bodyFatPercentage?: number;
  muscleMass?: number;
  waterIntake: number; // daily target in liters
  sleepHours?: number;
  stressLevel?: 1 | 2 | 3 | 4 | 5;
}

/**
 * User activity summary
 */
export interface UserActivitySummary {
  totalWorkouts: number;
  totalCaloriesBurned: number;
  averageWorkoutDuration: number;
  currentStreak: number;
  longestStreak: number;
  favoriteExercises: string[];
  weeklyGoal: number;
  weeklyProgress: number;
}

/**
 * User profile update payload
 */
export interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  weight?: number;
  height?: number;
  goal?: UserGoal;
  activityLevel?: ActivityLevel;
  profilePhotoUrl?: string;
  preferences?: Partial<UserPreferences>;
}

/**
 * User authentication state
 */
export interface UserAuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
}

/**
 * User onboarding progress
 */
export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  data: Partial<UserRegistrationData>;
}

/**
 * User notification preferences
 */
export interface NotificationPreferences {
  workoutReminders: boolean;
  mealReminders: boolean;
  progressUpdates: boolean;
  motivationalMessages: boolean;
  coachingMessages: boolean; // VIP only
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

/**
 * User coaching session (VIP feature)
 */
export interface CoachingSession {
  id: string;
  userId: string;
  coachId: string;
  scheduledDate: string;
  duration: number; // in minutes
  type: 'phone' | 'video' | 'chat';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  feedback?: {
    rating: 1 | 2 | 3 | 4 | 5;
    comment: string;
  };
}

/**
 * User goal tracking
 */
export interface GoalTracking {
  currentGoal: UserGoal;
  targetWeight?: number;
  targetDate?: string;
  milestones: {
    id: string;
    description: string;
    targetDate: string;
    completed: boolean;
    completedDate?: string;
  }[];
  progress: {
    startWeight: number;
    currentWeight: number;
    weightChange: number;
    progressPercentage: number;
  };
}
