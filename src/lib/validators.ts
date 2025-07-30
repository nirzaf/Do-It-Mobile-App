/**
 * Form validation schemas using Zod
 */

import { z } from 'zod';

/**
 * User profile validation schema
 */
export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, 'First name can only contain letters'),
  
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, 'Last name can only contain letters'),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
  
  phone: z
    .string()
    .regex(
      /^[+]?[(]?[\d\s\-\(\)]{10,15}$/,
      'Please enter a valid phone number'
    ),
  
  gender: z.enum(['male', 'female', 'other']),
  
  birthDate: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13 && age <= 100;
    }, 'Age must be between 13 and 100 years'),
  
  weight: z
    .number()
    .min(30, 'Weight must be at least 30 kg')
    .max(300, 'Weight must be less than 300 kg'),
  
  height: z
    .number()
    .min(100, 'Height must be at least 100 cm')
    .max(250, 'Height must be less than 250 cm'),
  
  goal: z.enum(['loseWeight', 'gainWeight', 'gainMuscle', 'extraDiet']),
  
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'veryActive']),
});

/**
 * User registration schema (extends profile schema)
 */
export const registrationSchema = profileSchema.extend({
  profilePhotoUrl: z.string().url().optional(),
  progressVideos: z.array(z.string().url()).optional(),
});

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Password schema
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Progress tracking schema
 */
export const progressSchema = z.object({
  weight: z.number().min(30).max(300).optional(),
  bodyFat: z.number().min(5).max(50).optional(),
  measurements: z.object({
    chest: z.number().min(50).max(200).optional(),
    waist: z.number().min(50).max(200).optional(),
    hips: z.number().min(50).max(200).optional(),
    arms: z.number().min(20).max(80).optional(),
    thighs: z.number().min(30).max(100).optional(),
  }).optional(),
  photos: z.array(z.string().url()).optional(),
  notes: z.string().max(500).optional(),
});

/**
 * Workout session schema
 */
export const workoutSessionSchema = z.object({
  workoutId: z.string().min(1, 'Workout ID is required'),
  exercises: z.array(z.object({
    exerciseId: z.string().min(1, 'Exercise ID is required'),
    sets: z.array(z.object({
      reps: z.number().min(1).max(100),
      weight: z.number().min(0).max(500).optional(),
      duration: z.number().min(1).max(3600).optional(), // max 1 hour
      completed: z.boolean(),
    })),
    completed: z.boolean(),
  })),
  duration: z.number().min(1).max(300), // max 5 hours
  caloriesBurned: z.number().min(0).max(2000),
  notes: z.string().max(500).optional(),
});

/**
 * Subscription schema
 */
export const subscriptionSchema = z.object({
  type: z.enum(['basic', 'vip']),
  paymentMethod: z.object({
    type: z.enum(['card', 'paypal', 'bank']),
    cardNumber: z.string().regex(/^\d{16}$/).optional(),
    expiryDate: z.string().regex(/^\d{2}\/\d{2}$/).optional(),
    cvv: z.string().regex(/^\d{3,4}$/).optional(),
    holderName: z.string().min(2).max(100).optional(),
  }).optional(),
});

/**
 * Contact form schema
 */
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

/**
 * Settings schema
 */
export const settingsSchema = z.object({
  preferences: z.object({
    language: z.enum(['en', 'ar']),
    theme: z.enum(['light', 'dark', 'system']),
    notifications: z.boolean(),
    units: z.object({
      weight: z.enum(['kg', 'lbs']),
      height: z.enum(['cm', 'ft']),
      temperature: z.enum(['celsius', 'fahrenheit']),
    }),
    privacy: z.object({
      shareProgress: z.boolean(),
      publicProfile: z.boolean(),
    }),
  }),
  notifications: z.object({
    workoutReminders: z.boolean(),
    mealReminders: z.boolean(),
    progressUpdates: z.boolean(),
    motivationalMessages: z.boolean(),
    coachingMessages: z.boolean(),
    emailNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    smsNotifications: z.boolean(),
  }),
});

/**
 * Utility function to validate data against a schema
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: { field: string; message: string }[];
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ field: 'unknown', message: 'Validation failed' }] };
  }
}

/**
 * Utility function to get validation errors for a specific field
 */
export function getFieldError(
  errors: { field: string; message: string }[] | undefined,
  fieldName: string
): string | undefined {
  return errors?.find(error => error.field === fieldName)?.message;
}

/**
 * Custom validation functions
 */
export const customValidators = {
  isValidBirthDate: (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 13 && age <= 100;
  },
  
  isValidPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^[+]?[(]?[\d\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone);
  },
  
  isStrongPassword: (password: string): boolean => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  },
  
  isValidWeight: (weight: number): boolean => {
    return weight >= 30 && weight <= 300;
  },
  
  isValidHeight: (height: number): boolean => {
    return height >= 100 && height <= 250;
  },
};
