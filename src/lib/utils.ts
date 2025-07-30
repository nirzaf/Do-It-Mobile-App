import type { UserProfile, Plans, Plan } from '../types';
import plansData from '../data/plans.json';

/**
 * Calculate BMI (Body Mass Index) based on weight and height
 * @param weightKg - Weight in kilograms
 * @param heightCm - Height in centimeters
 * @returns BMI value rounded to 1 decimal place
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

/**
 * Calculate daily calorie target based on user profile and goal
 * @param userProfile - User's profile information
 * @returns Daily calorie target
 */
export function calculateDailyCalories(userProfile: UserProfile): number {
  // Basic Metabolic Rate (BMR) calculation using Mifflin-St Jeor Equation
  let bmr: number;
  
  if (userProfile.gender === 'male') {
    bmr = 88.362 + (13.397 * userProfile.weight) + (4.799 * userProfile.height) - (5.677 * userProfile.age);
  } else {
    bmr = 447.593 + (9.247 * userProfile.weight) + (3.098 * userProfile.height) - (4.330 * userProfile.age);
  }
  
  // Activity factor (assuming moderate activity)
  const activityFactor = 1.55;
  let dailyCalories = bmr * activityFactor;
  
  // Adjust based on goal
  switch (userProfile.goal) {
    case 'Lose Weight':
      dailyCalories -= 500; // 500 calorie deficit for weight loss
      break;
    case 'Gain Weight':
    case 'Gain Muscle':
      dailyCalories += 300; // 300 calorie surplus for weight/muscle gain
      break;
    case 'Extra Diet':
      dailyCalories -= 300; // Moderate deficit for extra diet
      break;
    default:
      break;
  }
  
  return Math.round(dailyCalories);
}

/**
 * Calculate recommended daily water intake based on weight
 * @param weightKg - Weight in kilograms
 * @returns Water intake in liters rounded to 1 decimal place
 */
export function calculateWaterIntake(weightKg: number): number {
  // General recommendation: 35ml per kg of body weight
  const waterIntakeML = weightKg * 35;
  const waterIntakeLiters = waterIntakeML / 1000;
  return Math.round(waterIntakeLiters * 10) / 10;
}

/**
 * Generate/retrieve a plan based on user's goal from pre-defined plans
 * @param userProfile - User's profile information
 * @returns Plan object containing diet and training plans
 */
export function generatePlan(userProfile: UserProfile): Plan {
  const plans = plansData as Plans;
  return plans[userProfile.goal];
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