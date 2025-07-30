/**
 * Protected route component for authenticated users
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
  subscriptionType?: 'basic' | 'vip';
}

/**
 * Component to protect routes that require authentication
 */
export function ProtectedRoute({ 
  children, 
  requireSubscription = false,
  subscriptionType 
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useUser();
  const location = useLocation();

  // Redirect to welcome if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  // Check subscription requirements
  if (requireSubscription) {
    if (!user.subscription) {
      return <Navigate to="/subscription" state={{ from: location }} replace />;
    }

    // Check if subscription is active
    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    
    if (endDate < now) {
      return <Navigate to="/subscription" state={{ from: location, expired: true }} replace />;
    }

    // Check specific subscription type requirement
    if (subscriptionType && user.subscription.type !== subscriptionType) {
      return <Navigate to="/subscription" state={{ from: location, upgrade: true }} replace />;
    }
  }

  return <>{children}</>;
}

/**
 * Higher-order component for protecting routes
 */
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireSubscription?: boolean;
    subscriptionType?: 'basic' | 'vip';
  }
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute 
        requireSubscription={options?.requireSubscription}
        subscriptionType={options?.subscriptionType}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
