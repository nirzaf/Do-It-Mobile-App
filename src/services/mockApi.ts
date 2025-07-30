/**
 * Mock API service for simulating backend operations
 */

import type {
  UserProfile,
  Exercise,
  Plan,
  ApiResponse,
  SubscriptionPackage,
  Progress,
  WorkoutSession
} from '../types';

// Import mock data
import exercisesData from '../data/exercises.json';
import { generatePlan } from '../lib/utils';

/**
 * Simulates API delay
 */
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API class
 */
class MockApiService {
  private users: UserProfile[] = [];
  private exercises: any[] = exercisesData;
  private progress: Progress[] = [];
  private workoutSessions: WorkoutSession[] = [];

  /**
   * User authentication and management
   */
  async registerUser(userData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    await delay();
    
    try {
      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        gender: userData.gender || 'other',
        birthDate: userData.birthDate || '',
        weight: userData.weight || 70,
        height: userData.height || 170,
        goal: userData.goal || 'lose_weight',
        activityLevel: userData.activityLevel || 'moderate',
        profilePhotoUrl: userData.profilePhotoUrl,
        progressVideos: userData.progressVideos || [],
        preferences: {
          language: userData.preferences?.language || 'en',
          theme: (userData.preferences?.theme === 'light' || userData.preferences?.theme === 'dark')
            ? userData.preferences.theme
            : 'light',
          notifications: userData.preferences?.notifications ?? true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.users.push(newUser);
      
      return {
        success: true,
        data: newUser,
        message: 'User registered successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to register user',
      };
    }
  }

  async getUserById(userId: string): Promise<ApiResponse<UserProfile>> {
    await delay();
    
    const user = this.users.find(u => u.id === userId);
    
    if (user) {
      return {
        success: true,
        data: user,
      };
    }
    
    return {
      success: false,
      error: 'User not found',
    };
  }

  async updateUser(userId: string, updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    await delay();
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return {
      success: true,
      data: this.users[userIndex],
      message: 'User updated successfully',
    };
  }

  /**
   * Exercise management
   */
  async getExercises(filters?: {
    category?: string;
    difficulty?: string;
    equipment?: string[];
    targetMuscle?: string[];
  }): Promise<ApiResponse<Exercise[]>> {
    await delay();
    
    let filteredExercises = [...this.exercises];
    
    if (filters) {
      if (filters.category) {
        filteredExercises = filteredExercises.filter(ex => 
          ex.targetMuscle.some((muscle: string) =>
            muscle.toLowerCase().includes(filters.category!.toLowerCase())
          )
        );
      }
      
      if (filters.difficulty) {
        filteredExercises = filteredExercises.filter(ex => 
          ex.difficulty === filters.difficulty
        );
      }
      
      if (filters.equipment && filters.equipment.length > 0) {
        filteredExercises = filteredExercises.filter(ex =>
          ex.equipment.some((eq: string) => filters.equipment!.includes(eq))
        );
      }
      
      if (filters.targetMuscle && filters.targetMuscle.length > 0) {
        filteredExercises = filteredExercises.filter(ex =>
          ex.targetMuscle.some((muscle: string) => filters.targetMuscle!.includes(muscle))
        );
      }
    }
    
    return {
      success: true,
      data: filteredExercises,
    };
  }

  async getExerciseById(exerciseId: string): Promise<ApiResponse<Exercise>> {
    await delay();
    
    const exercise = this.exercises.find(ex => ex.id === exerciseId);
    
    if (exercise) {
      return {
        success: true,
        data: exercise,
      };
    }
    
    return {
      success: false,
      error: 'Exercise not found',
    };
  }

  /**
   * Plan management
   */
  async generatePlan(userId: string): Promise<ApiResponse<Plan>> {
    await delay();
    
    const user = this.users.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    
    // Generate a plan for the user using the utility function
    const userPlan = generatePlan(user);
    
    return {
      success: true,
      data: userPlan,
    };
  }

  async getPlanById(_planId: string): Promise<ApiResponse<Plan>> {
    await delay();

    // For now, return a mock plan since we don't have individual plan storage
    const mockUser: UserProfile = {
      id: 'mock-user',
      firstName: 'Mock',
      lastName: 'User',
      email: 'mock@example.com',
      phone: '+1234567890',
      gender: 'male',
      weight: 70,
      height: 175,
      birthDate: '1990-01-01',
      goal: 'lose_weight',
      activityLevel: 'moderate',
      preferences: {
        language: 'en',
        theme: 'light',
        notifications: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const plan = generatePlan(mockUser);

    return {
      success: true,
      data: plan,
    };
  }

  /**
   * Subscription management
   */
  async getSubscriptionPackages(): Promise<ApiResponse<SubscriptionPackage[]>> {
    await delay();
    
    const packages: SubscriptionPackage[] = [
      {
        id: 'basic',
        name: { en: 'Basic Package', ar: 'الباقة الأساسية' },
        type: 'basic',
        price: 300,
        currency: 'SAR',
        period: 'month',
        description: { 
          en: 'Essential fitness and diet plans', 
          ar: 'خطط اللياقة والنظام الغذائي الأساسية' 
        },
        features: [
          { text: { en: 'Personalized workout plans', ar: 'خطط تمارين شخصية' }, included: true },
          { text: { en: 'Diet and nutrition guidance', ar: 'إرشادات النظام الغذائي والتغذية' }, included: true },
          { text: { en: 'Progress tracking', ar: 'تتبع التقدم' }, included: true },
          { text: { en: 'Basic exercise library', ar: 'مكتبة التمارين الأساسية' }, included: true },
          { text: { en: 'Personal coaching sessions', ar: 'جلسات التدريب الشخصي' }, included: false },
          { text: { en: 'Advanced analytics', ar: 'التحليلات المتقدمة' }, included: false },
        ],
      },
      {
        id: 'vip',
        name: { en: 'VIP Package', ar: 'الباقة المميزة' },
        type: 'vip',
        price: 550,
        currency: 'SAR',
        period: 'month',
        popular: true,
        description: { 
          en: 'Complete fitness solution with personal coaching', 
          ar: 'حل اللياقة الكامل مع التدريب الشخصي' 
        },
        features: [
          { text: { en: 'Personalized workout plans', ar: 'خطط تمارين شخصية' }, included: true },
          { text: { en: 'Diet and nutrition guidance', ar: 'إرشادات النظام الغذائي والتغذية' }, included: true },
          { text: { en: 'Progress tracking', ar: 'تتبع التقدم' }, included: true },
          { text: { en: 'Complete exercise library', ar: 'مكتبة التمارين الكاملة' }, included: true },
          { text: { en: 'Personal coaching sessions', ar: 'جلسات التدريب الشخصي' }, included: true },
          { text: { en: 'Advanced analytics', ar: 'التحليلات المتقدمة' }, included: true },
          { text: { en: '24/7 Support', ar: 'دعم على مدار الساعة' }, included: true },
        ],
      },
    ];
    
    return {
      success: true,
      data: packages,
    };
  }

  /**
   * Progress tracking
   */
  async saveProgress(progressData: Omit<Progress, 'id'>): Promise<ApiResponse<Progress>> {
    await delay();
    
    const newProgress: Progress = {
      ...progressData,
      id: `progress_${Date.now()}`,
    };
    
    this.progress.push(newProgress);
    
    return {
      success: true,
      data: newProgress,
      message: 'Progress saved successfully',
    };
  }

  async getUserProgress(userId: string): Promise<ApiResponse<Progress[]>> {
    await delay();
    
    const userProgress = this.progress.filter(p => p.userId === userId);
    
    return {
      success: true,
      data: userProgress,
    };
  }

  /**
   * Workout session tracking
   */
  async saveWorkoutSession(sessionData: Omit<WorkoutSession, 'id'>): Promise<ApiResponse<WorkoutSession>> {
    await delay();
    
    const newSession: WorkoutSession = {
      ...sessionData,
      id: `session_${Date.now()}`,
    };
    
    this.workoutSessions.push(newSession);
    
    return {
      success: true,
      data: newSession,
      message: 'Workout session saved successfully',
    };
  }

  async getUserWorkoutSessions(userId: string): Promise<ApiResponse<WorkoutSession[]>> {
    await delay();
    
    const userSessions = this.workoutSessions.filter(s => s.userId === userId);
    
    return {
      success: true,
      data: userSessions,
    };
  }
}

// Export singleton instance
export const mockApi = new MockApiService();
export default mockApi;
