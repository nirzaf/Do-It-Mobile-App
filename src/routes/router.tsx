/**
 * Application router configuration
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Import pages
import { Welcome } from '../pages/Welcome';
import { ProfileForm } from '../pages/ProfileForm';
import { GoalSelection } from '../pages/GoalSelection';
import { MediaUpload } from '../pages/MediaUpload';
import { Dashboard } from '../pages/Dashboard';
import { DietPlan } from '../pages/DietPlan';
import { TrainingPlan } from '../pages/TrainingPlan';
import { Exercises } from '../pages/Exercises';
import { ExerciseDetail } from '../pages/ExerciseDetail';
import { WorkoutSession } from '../pages/WorkoutSession';
import { Profile } from '../pages/Profile';
import { Subscription } from '../pages/Subscription';

/**
 * Application router configuration
 */
export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <Navigate to="/welcome" replace />,
  },
  {
    path: '/welcome',
    element: <Welcome />,
  },
  
  // Registration flow
  {
    path: '/register',
    children: [
      {
        path: 'profile',
        element: <ProfileForm />,
      },
      {
        path: 'goal',
        element: <GoalSelection />,
      },
      {
        path: 'media',
        element: <MediaUpload />,
      },
    ],
  },
  
  // Protected routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/diet-plan',
    element: (
      <ProtectedRoute requireSubscription>
        <DietPlan />
      </ProtectedRoute>
    ),
  },
  {
    path: '/training-plan',
    element: (
      <ProtectedRoute requireSubscription>
        <TrainingPlan />
      </ProtectedRoute>
    ),
  },
  {
    path: '/exercises',
    element: (
      <ProtectedRoute requireSubscription>
        <Exercises />
      </ProtectedRoute>
    ),
  },
  {
    path: '/exercises/:exerciseId',
    element: (
      <ProtectedRoute requireSubscription>
        <ExerciseDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: '/workout/:dayIndex',
    element: (
      <ProtectedRoute requireSubscription>
        <WorkoutSession />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/subscription',
    element: (
      <ProtectedRoute>
        <Subscription />
      </ProtectedRoute>
    ),
  },
  
  // VIP-only routes (future expansion)
  {
    path: '/coaching',
    element: (
      <ProtectedRoute requireSubscription subscriptionType="vip">
        <div>Coaching sessions - VIP only</div>
      </ProtectedRoute>
    ),
  },
  {
    path: '/advanced-analytics',
    element: (
      <ProtectedRoute requireSubscription subscriptionType="vip">
        <div>Advanced Analytics - VIP only</div>
      </ProtectedRoute>
    ),
  },
  
  // Catch all route
  {
    path: '*',
    element: <Navigate to="/welcome" replace />,
  },
]);

export default router;
