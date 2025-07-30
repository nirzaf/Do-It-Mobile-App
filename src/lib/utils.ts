/**
 * Enhanced utility functions for the Do IT application
 */

import type {
  UserProfile,
  Plan,
  Exercise,
  CalorieTargets,
  Macros,
  UserGoal,
  ActivityLevel
} from '../types';
import {
  USER_GOALS,
  ACTIVITY_LEVELS,
  MACRO_DISTRIBUTIONS,
  WATER_INTAKE
} from './constants';
import exercisesData from '../data/exercises.json';
import plansData from '../data/plans.json';

/**
 * Calculate BMI (Body Mass Index)
 * @param weightKg - Weight in kilograms
 * @param heightCm - Height in centimeters
 * @returns BMI value
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * @param profile - User profile
 * @returns BMR in calories per day
 */
export function calculateBMR(profile: UserProfile): number {
  const age = getAge(profile.birthDate);
  let bmr: number;

  if (profile.gender === 'male') {
    bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * age);
  }

  return Math.round(bmr);
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * @param profile - User profile
 * @returns TDEE in calories per day
 */
export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const activityMultiplier = ACTIVITY_LEVELS[profile.activityLevel].multiplier;
  return Math.round(bmr * activityMultiplier);
}

/**
 * Calculate daily calorie targets based on user profile and goal
 * @param profile - User profile
 * @returns Calorie targets object
 */
export function calculateDailyCalories(profile: UserProfile): CalorieTargets {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(profile);
  const goalModifier = USER_GOALS[profile.goal].calorieModifier;
  const target = Math.round(tdee * goalModifier);

  const result: CalorieTargets = {
    bmr,
    tdee,
    target,
  };

  // Add deficit/surplus information
  if (goalModifier < 1) {
    result.deficit = tdee - target;
  } else if (goalModifier > 1) {
    result.surplus = target - tdee;
  }

  return result;
}

/**
 * Calculate macro distribution based on calories and goal
 * @param calories - Total daily calories
 * @param goal - User goal
 * @returns Macro distribution in grams
 */
export function calculateMacros(calories: number, goal: UserGoal): Macros {
  const distribution = MACRO_DISTRIBUTIONS[goal];

  // Calculate calories for each macro
  const proteinCalories = calories * (distribution.protein / 100);
  const carbCalories = calories * (distribution.carbs / 100);
  const fatCalories = calories * (distribution.fats / 100);

  // Convert to grams (protein: 4 cal/g, carbs: 4 cal/g, fats: 9 cal/g)
  const protein = Math.round(proteinCalories / 4);
  const carbs = Math.round(carbCalories / 4);
  const fats = Math.round(fatCalories / 9);

  return {
    protein,
    carbs,
    fat: fats,
  };
}

/**
 * Calculate water intake recommendation
 * @param weightKg - Weight in kilograms
 * @param activityLevel - Activity level
 * @returns Daily water intake in liters
 */
export function calculateWaterIntake(weightKg: number, activityLevel: ActivityLevel = 'moderate'): number {
  // Base calculation: 35ml per kg of body weight
  const baseIntake = (weightKg * WATER_INTAKE.baseAmount) / 1000; // Convert to liters

  // Add extra for active lifestyle
  let activeBonus = 0;
  if (activityLevel === 'active' || activityLevel === 'veryActive') {
    activeBonus = WATER_INTAKE.exerciseBonus / 1000; // Convert to liters
  }

  // Add extra for hot climate (Qatar)
  const climateBonus = WATER_INTAKE.climateBonus / 1000; // Convert to liters

  const totalIntake = baseIntake + activeBonus + climateBonus;

  // Ensure within recommended limits
  return Math.max(
    WATER_INTAKE.minAmount,
    Math.min(WATER_INTAKE.maxAmount, Math.round(totalIntake * 10) / 10)
  );
}

/**
 * Generate a personalized plan for the user
 * @param user - User profile
 * @returns Generated plan
 */
export function generatePlan(user: UserProfile): Plan {
  const plans = Object.values(plansData) as any[];

  // Find a plan that matches the user's goal
  let matchingPlan = plans.find(plan =>
    plan.diet.goal === user.goal || plan.training.goal === user.goal
  );

  // If no matching plan found, use the first available plan
  if (!matchingPlan) {
    matchingPlan = plans[0];
  }

  // Customize the plan for the user
  const calorieTargets = calculateDailyCalories(user);
  const macros = calculateMacros(calorieTargets.target, user.goal);

  const customizedPlan: Plan = {
    ...matchingPlan,
    id: `plan_${user.id}_${Date.now()}`,
    userId: user.id,
    diet: {
      ...matchingPlan.diet,
      dailyCalories: calorieTargets.target,
      dailyMacros: macros,
      hydration: calculateWaterIntake(user.weight, user.activityLevel)
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return customizedPlan;
}

/**
 * Get age from birth date
 * @param birthDate - Birth date string
 * @returns Age in years
 */
export function getAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Format date for display
 * @param date - Date object or string
 * @param locale - Locale string
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return dateObj.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', options);
}

/**
 * Format currency for display
 * @param amount - Amount to format
 * @param currency - Currency code
 * @param locale - Locale string
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'SAR', locale: string = 'en'): string {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  };

  return amount.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US', options);
}

/**
 * Get exercises by muscle group
 * @param muscleGroup - Target muscle group
 * @returns Array of exercises
 */
export function getExercisesByMuscleGroup(muscleGroup: string): Exercise[] {
  const exercises = exercisesData as any[];
  return exercises.filter(exercise =>
    exercise.targetMuscle.some((muscle: any) =>
      muscle.toLowerCase().includes(muscleGroup.toLowerCase())
    )
  );
}

/**
 * Get exercises by difficulty
 * @param difficulty - Exercise difficulty level
 * @returns Array of exercises
 */
export function getExercisesByDifficulty(difficulty: string): Exercise[] {
  const exercises = exercisesData as any[];
  return exercises.filter(exercise => exercise.difficulty === difficulty);
}

/**
 * Calculate exercise calories burned
 * @param exercise - Exercise object
 * @param durationMinutes - Duration in minutes
 * @param userWeight - User weight in kg
 * @returns Calories burned
 */
export function calculateExerciseCalories(exercise: Exercise, durationMinutes: number, userWeight: number): number {
  // Basic MET (Metabolic Equivalent of Task) calculation
  const baseMET = exercise.difficulty === 'beginner' ? 3 : exercise.difficulty === 'intermediate' ? 5 : 7;

  // Calories = MET × weight in kg × time in hours
  const caloriesBurned = baseMET * userWeight * (durationMinutes / 60);

  return Math.round(caloriesBurned);
}

/**
 * Get BMI category
 * @param bmi - BMI value
 * @returns BMI category
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

/**
 * Validate email format
 * @param email - Email string
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a random ID
 * @param prefix - Optional prefix for the ID
 * @returns Random ID string
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`;
}

/**
 * Format text with interpolation (simple template replacement)
 * @param template - Template string with {{variable}} placeholders
 * @param variables - Object with variable values
 * @returns Formatted string
 */
export function interpolate(template: string, variables: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key]?.toString() || match;
  });
}

/**
 * Utility function to combine CSS classes
 * @param classes - Array of class names or conditional classes
 * @returns Combined class string
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}