# Enhanced Do IT Mobile App Prototype Requirements

You are an expert Senior Frontend Developer specializing in creating high-fidelity, production-ready mobile app prototypes using React, TypeScript, and Tailwind CSS. You excel at building scalable, maintainable, and accessible user interfaces that follow industry best practices and modern development standards.

## **Project Overview**

You are tasked with developing a comprehensive, interactive mobile app prototype for "Do IT" - a personalized fitness and diet application. This prototype will serve as a functional demonstration of the app's core features and user experience for stakeholder review and user testing.

This is a **frontend-only prototype** with all data mocked locally. The application must demonstrate professional-grade UI/UX design, smooth interactions, and robust error handling while maintaining code quality standards suitable for production development.

## **Technical Requirements**

### **1. Technology Stack & Architecture**

**Core Technologies:**

- **Framework:** React 18+ with Vite (latest stable versions)
- **Language:** TypeScript 5+ with strict mode enabled
- **Styling:** Tailwind CSS 3+ with JIT mode
- **Routing:** React Router v6+ with type-safe routing
- **State Management:** React Context API with proper TypeScript typing
- **Icons:** Lucide React for consistent iconography
- **Animation:** Framer Motion for smooth transitions
- **Form Handling:** React Hook Form with Zod validation
- **Date Handling:** date-fns for date manipulation

**Project Structure:**

```
/src
├── /assets
│   ├── /images
│   └── /fonts
├── /components
│   ├── /ui (atomic components: Button, Input, Card, Modal, etc.)
│   ├── /forms (form-specific components)
│   ├── /layout (Header, Footer, Navigation)
│   └── /features (feature-specific components)
├── /contexts
│   ├── ThemeContext.tsx
│   ├── LanguageContext.tsx
│   ├── UserContext.tsx
│   └── AuthContext.tsx
├── /data
│   ├── /mocks
│   │   ├── exercises.json
│   │   ├── plans.json
│   │   └── users.json
│   └── /locales
│       ├── en.json
│       └── ar.json
├── /hooks
│   ├── useTheme.ts
│   ├── useTranslation.ts
│   ├── useUser.ts
│   └── useMediaQuery.ts
├── /lib
│   ├── utils.ts
│   ├── validators.ts
│   └── constants.ts
├── /pages
│   ├── /onboarding
│   ├── /dashboard
│   ├── /training
│   ├── /diet
│   └── /subscription
├── /routes
│   ├── ProtectedRoute.tsx
│   └── router.tsx
├── /services
│   └── mockApi.ts
├── /types
│   ├── index.ts
│   ├── user.types.ts
│   ├── exercise.types.ts
│   └── plan.types.ts
├── App.tsx
├── main.tsx
└── index.css
```

### **2. Design System & Accessibility**

**Visual Design:**

- Implement a cohesive design system with consistent spacing, typography, and color usage
- Support for light/dark themes with smooth transitions
- Mobile-first responsive design (320px to 768px primary breakpoints)
- Consistent border radius, shadows, and elevation patterns
- Loading states, error states, and empty states for all data displays

**Color Palette:**

```typescript
const colors = {
  primary: {
    light: 'blue-500',
    dark: 'blue-400'
  },
  background: {
    light: 'white',
    dark: 'slate-900'
  },
  surface: {
    light: 'slate-50',
    dark: 'slate-800'
  },
  text: {
    primary: { light: 'slate-900', dark: 'slate-100' },
    secondary: { light: 'slate-600', dark: 'slate-400' }
  },
  success: 'green-500',
  warning: 'amber-500',
  error: 'red-500'
}
```

**Accessibility Standards:**

- WCAG 2.1 AA compliance
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management and visible focus indicators
- Screen reader compatibility
- Proper heading hierarchy
- Color contrast ratios meeting accessibility standards

### **3. Internationalization (i18n) & Localization**

**Implementation:**

- Custom translation hook with TypeScript support
- RTL/LTR layout switching for Arabic
- Number and date formatting based on locale
- Pluralization support
- Translation key type safety
- Fallback language support

**Translation Structure:**

```json
{
  "common": {
    "welcome": "Welcome",
    "next": "Next",
    "back": "Back",
    "submit": "Submit",
    "cancel": "Cancel"
  },
  "onboarding": {
    "getStarted": "Get Started",
    "profileTitle": "Create Your Profile",
    "goalTitle": "Select Your Goal"
  },
  "validation": {
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email",
    "minLength": "Must be at least {{min}} characters"
  }
}
```

### **4. State Management & Data Architecture**

**Context Providers:**

1. **ThemeContext:**
   - Theme preference persistence (localStorage)
   - System theme detection
   - Smooth theme transitions

2. **LanguageContext:**
   - Language preference persistence
   - Dynamic locale loading
   - RTL/LTR direction management

3. **UserContext:**
   - User profile management
   - Goal tracking
   - Progress persistence

4. **AuthContext:**
   - Authentication state simulation
   - Protected route management
   - Session persistence

**Mock Data Schema:**

```typescript
interface Exercise {
  id: string;
  name: LocalizedString;
  targetMuscle: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
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
}

interface DietPlan {
  id: string;
  goal: UserGoal;
  meals: Meal[];
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  hydration: number;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  weight: number;
  height: number;
  goal: UserGoal;
  activityLevel: ActivityLevel;
  profilePhotoUrl?: string;
  progressVideos?: string[];
  preferences: {
    language: 'en' | 'ar';
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
  subscription?: {
    type: 'basic' | 'vip';
    startDate: string;
    endDate: string;
  };
}
```

### **5. Utility Functions & Services**

**Core Utilities (`src/lib/utils.ts`):**

```typescript
export const calculateBMI = (weightKg: number, heightCm: number): number
export const calculateBMR = (profile: UserProfile): number
export const calculateTDEE = (profile: UserProfile): number
export const calculateDailyCalories = (profile: UserProfile): CalorieTargets
export const calculateMacros = (calories: number, goal: UserGoal): Macros
export const calculateWaterIntake = (weightKg: number, activityLevel: ActivityLevel): number
export const generatePlan = (profile: UserProfile): { diet: DietPlan; training: TrainingPlan }
export const formatDate = (date: Date, locale: string): string
export const formatCurrency = (amount: number, currency: string): string
```

**Validation Schemas (`src/lib/validators.ts`):**

```typescript
export const profileSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
  gender: z.enum(['male', 'female', 'other']),
  weight: z.number().min(30).max(300),
  height: z.number().min(100).max(250),
  birthDate: z.string().refine(isValidBirthDate)
})
```

### **6. Screen Implementation Details**

**Onboarding Flow:**

1. **Splash Screen (`/`):**
   - Animated logo entrance
   - Auto-redirect after 2 seconds or tap to continue
   - Language selection overlay on first launch

2. **Welcome Screen (`/welcome`):**
   - Hero section with app benefits
   - Language toggle with visual feedback
   - Animated "Get Started" CTA
   - Terms and Privacy links

3. **Registration Flow (`/register/*`):**
   - Multi-step form with progress indicator
   - Real-time validation with helpful error messages
   - Auto-save progress to prevent data loss
   - Smooth transitions between steps
   - Back navigation with confirmation if data exists

4. **Goal Selection (`/register/goal`):**
   - Interactive cards with hover/tap effects
   - Detailed descriptions for each goal
   - Visual icons for each option
   - Confirmation modal before proceeding

5. **Media Upload (`/register/media`):**
   - Drag-and-drop zones for photos/videos
   - File type and size validation
   - Preview of uploaded media
   - Progress indicators for "uploads"
   - Optional skip with explanation

**Main Application:**

1. **Dashboard (`/dashboard`):**
   - Personalized greeting with time-based messages
   - Quick stats widget (streak, calories, water)
   - Action cards with subtle animations
   - Quick access toolbar
   - Pull-to-refresh gesture support

2. **Training Program (`/training`):**
   - Weekly calendar view
   - Today's workout highlight
   - Exercise list with completion checkboxes
   - Rest timer between sets
   - Video preview thumbnails
   - Workout history tab

3. **Exercise Detail Modal:**
   - Full-screen modal with gesture dismissal
   - Video player with controls
   - Step-by-step instructions
   - Form tips and common mistakes
   - Set/rep tracker with haptic feedback
   - Notes section for user input

4. **Diet Plan (`/diet`):**
   - Daily/Weekly view toggle
   - Meal cards with macro breakdown
   - Water intake tracker with animations
   - Meal prep checklist
   - Alternative food suggestions
   - Shopping list generator

5. **Subscription (`/subscription`):**
   - Feature comparison table
   - Animated pricing cards
   - FAQ accordion
   - Payment method selection (simulated)
   - Confirmation flow with success animation

### **7. Performance & Optimization**

**Requirements:**

- Lazy loading for route components
- Image optimization with loading placeholders
- Memoization for expensive calculations
- Debounced search inputs
- Virtual scrolling for long lists
- Service Worker for offline capability
- Bundle size optimization (<200KB initial load)

### **8. Error Handling & Edge Cases**

**Implementation:**

- Global error boundary with fallback UI
- Network error simulation and handling
- Form validation with helpful messages
- Empty state designs for all data views
- Loading skeletons for async operations
- Graceful degradation for unsupported features
- Session timeout handling

### **9. Testing Considerations**

**Structure for testability:**

- Component isolation with proper props
- Custom hooks for business logic
- Pure utility functions
- Mock service layer for API simulation
- Accessibility testing setup
- Component story files for Storybook

### **10. Documentation Requirements**

**Code Documentation:**

- JSDoc comments for all exported functions
- Interface documentation with examples
- README with setup instructions
- Component usage examples
- Architecture decision records (ADRs)

## **Deliverables**

Generate a complete, production-quality codebase that includes:

1. All source files with proper TypeScript typing
2. Comprehensive mock data sets (minimum 20 exercises, 3 complete meal plans)
3. Full translation files for English and Arabic
4. Configuration files (tsconfig.json, tailwind.config.js, vite.config.ts)
5. Package.json with all required dependencies
6. README.md with setup and development instructions

Each file should be presented in a separate code block with the full file path clearly indicated. The code must be clean, well-structured, follow React best practices, and be ready for immediate deployment as a prototype.
