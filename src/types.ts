// TypeScript interfaces for the Do IT fitness app

export interface UserProfile {
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

export interface Exercise {
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

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: string[];
  calories: number;
  portions: string;
}

export interface DietPlan {
  meals: Meal[];
  totalCalories: number;
  waterIntake: number;
}

export interface TrainingPlan {
  days: {
    [key: string]: {
      name: string;
      exercises: string[]; // exercise IDs
    };
  };
}

export interface Plan {
  diet: DietPlan;
  training: TrainingPlan;
}

export interface Plans {
  'Lose Weight': Plan;
  'Gain Weight': Plan;
  'Gain Muscle': Plan;
  'Extra Diet': Plan;
}

export interface Translations {
  [key: string]: string | string[];
}

export interface SubscriptionPackage {
  name: string;
  price: number;
  currency: string;
  features: string[];
}