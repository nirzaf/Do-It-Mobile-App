# Do IT Mobile App

You are an expert Senior Frontend Developer specializing in creating high-fidelity, interactive prototypes using React, TypeScript, and Tailwind CSS. You excel at building clean, well-structured, and visually appealing user interfaces based on detailed requirements.

**Context:**

You are tasked with building a complete, clickable mobile app simulation for a new personalized fitness and diet application named "Do IT." The goal of this simulation is to serve as a functional prototype to demonstrate the app's core user flows and features to stakeholders.

This is a **frontend-only prototype**. There is no backend or database. All data, including user profiles, exercises, and meal plans, must be mocked and stored in local JSON files. All "logic," such as calculating BMI or generating plans, will be simulated with client-side functions.

The application must have a minimalist, clean aesthetic and support both **light and dark modes**.

**Primary Task:**

Generate the complete, runnable code for the "Do IT" mobile app simulation. The application must be built as a modern, multi-file React project using the specified technology stack. The final output should be a series of code blocks, one for each file, with clear file paths. The simulation must be fully interactive, allowing a user to navigate through all the defined screens and user flows.

**Core Requirements:**

**1. Technology Stack & Project Setup:**

* **Framework:** React (using Vite for project setup is preferred).
* **Language:** TypeScript.
* **Styling:** Tailwind CSS. Configure it for the `class`-based dark mode strategy.
* **Routing:** `react-router-dom` for all navigation.
* **Icons:** Use a library like `lucide-react` for icons.
* **Project Structure:** Organize the code into the following directory structure:

    ```
    /src
    ├── /assets
    ├── /components
    │   ├── /ui (for reusable elements like Button, Card, Input)
    │   └── /shared (for complex shared components like Header, Nav)
    ├── /context (for React context providers)
    ├── /data (for all mock data and translations)
    │   └── /locales
    ├── /hooks (for custom hooks)
    ├── /lib (for utility functions)
    ├── /pages (for top-level screen components)
    └── main.tsx
    ```

**2. Styling, Theme, and Internationalization (i18n):**

* **Theme:** Implement a clean, minimalist UI with support for both light and dark modes.
  * **Colors:** Use a neutral color palette (e.g., Tailwind's `slate` color family) for backgrounds and text. Use a vibrant `blue` (e.g., `blue-500`) as the primary accent color for buttons, links, and active UI elements.
  * **Theme Toggle:** Create a `ThemeContext` and a toggle button (e.g., in a header) that switches between light and dark modes by adding or removing the `dark` class from the `<html>` element.
* **Language:**
  * Create a `LanguageContext` to manage language state (`'en'` or `'ar'`).
  * Create translation files: `src/data/locales/en.json` and `src/data/locales/ar.json`. Populate them with all the necessary UI text strings.
  * The Welcome Screen must feature a toggle to switch between English and Arabic. Switching the language should update the entire UI's text accordingly. For Arabic, the layout should feel right-to-left (RTL), which Tailwind can handle with `dir="rtl"`.

**3. Global State & Mock Data:**

* **User State:** Use a `UserContext` to store the user's profile data (name, gender, weight, height, age, goal, etc.) after they complete the onboarding process.
* **Mock Data Files:**
  * `src/data/exercises.json`: Create an array of at least 10 mock exercises. Each exercise object should have an `id`, `name`, `targetMuscle`, `sets`, `reps` (specify different reps for 'Lose Weight' vs 'Gain Muscle' goals), `photoUrl`, and `videoUrl`. Use placeholder image/video URLs (e.g., `https://placehold.co/600x400` for images).
  * `src/data/plans.json`: Create mock diet and training plans. Structure it so you can easily retrieve a full plan based on a user's goal (e.g., `plans['Lose Weight'].diet`, `plans['Lose Weight'].training`).

**4. Utility Functions (`src/lib/utils.ts`):**

* Create and export the following client-side simulation functions:
  * `calculateBMI(weightKg, heightCm)`: Returns the calculated BMI value.
  * `calculateDailyCalories(userProfile)`: Returns a mock calorie target based on user's goal and profile.
  * `calculateWaterIntake(weightKg)`: Returns a recommended daily water intake in liters.
  * `generatePlan(userProfile)`: This function will not generate a new plan but will look up and return the appropriate pre-defined plan from `plans.json` based on the user's selected goal.

**5. Screen-by-Screen Implementation:**

* **Onboarding Flow (Routes start with `/`):**

  * **Welcome Screen (`/`):** Display the app name "Do IT". Include the language toggle (English/Arabic). A "Get Started" button navigates to `/register/profile`.
  * **User Data Collection Screen (`/register/profile`):** A form with validated input fields for First Name, Last Name, Gender, Weight, Height, Age, Email, and Phone Number. "Next" button saves this data to a temporary state and navigates to `/register/goal`.
  * **Goal Selection Screen (`/register/goal`):** Display large, clickable cards for each goal: "Lose Weight," "Gain Weight," "Gain Muscle," "Extra Diet." Selecting a goal saves it and navigates to `/register/media`.
  * **Profile Media Screen (`/register/media`):** An optional screen with two buttons: "Upload Profile Photo" and "Upload Progress Videos." These buttons should simulate a file selection but not perform an actual upload. A "Finish" or "Skip" button saves all collected data to the `UserContext` and navigates the user to the main dashboard (`/dashboard`).

* **Main Application Flow (Routes should be protected/redirect if user profile is not set):**

  * **Main Dashboard (`/dashboard`):** The central hub. Display a personalized greeting (e.g., "Welcome, [FirstName]\!"). Feature two large, distinct, clickable cards: "View Training Program" (links to `/training`) and "View Diet Plan" (links to `/diet`). Also include a button/link to the `/subscription` page.
  * **Diet Plan Screen (`/diet`):**
    * Display the calculated BMI, daily calorie target, and daily water intake goal using the utility functions.
    * Show the personalized meal plan from the mock data, listing 5 meals with food recommendations and portion sizes for the day.
  * **Training Plan Screen (`/training`):**
    * Display the workout for the current day based on the user's plan (e.g., "Day 1: Chest & Biceps").
    * List the exercises for the day. Each list item should be clickable and navigate to a detailed view of that exercise.
  * **Exercise Detail View (Can be a modal or a route like `/training/exercise/:id`):**
    * Display the exercise name.
    * Show the instructional photo (`photoUrl`).
    * Show the instructional video (`videoUrl`) - an embeddable placeholder is fine.
    * Clearly state the number of sets and repetitions required.
  * **Subscription Screen (`/subscription`):**
    * Display two cards side-by-side: "Basic Package (300 SAR/month)" and "VIP Package (550 SAR/month)".
    * List the features for each package as specified in the requirements.
    * Each card has a "Subscribe" button. Clicking it should show a simple confirmation alert (e.g., "You have subscribed to the [Package Name] package\!").

**Output Specification:**

* Generate the code for each file within its own formatted code block.
* Start each block with a comment indicating the full file path (e.g., `// File: src/pages/Dashboard.tsx`).
* Ensure all TypeScript types (`interface UserProfile`, `interface Exercise`, etc.) are clearly defined in a `types.ts` file or colocated where appropriate.
* The code must be clean, well-commented, and free of errors.
* The final output must be a complete, functional prototype that fulfills all the requirements listed above.
