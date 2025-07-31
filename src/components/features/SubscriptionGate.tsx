import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Crown, Lock, Star } from 'lucide-react';

interface SubscriptionGateProps {
  children: ReactNode;
  requiredTier?: 'basic' | 'vip';
  feature: string;
  description?: string;
  className?: string;
}

/**
 * Component that gates features based on subscription tier
 */
export function SubscriptionGate({ 
  children, 
  requiredTier = 'basic', 
  feature, 
  description,
  className = '' 
}: SubscriptionGateProps) {
  const { user } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Check if user has required subscription
  const hasRequiredSubscription = () => {
    if (!user?.subscription) return false;
    
    // Check if subscription is active
    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    if (endDate < now) return false;
    
    // Check tier requirement
    if (requiredTier === 'vip' && user.subscription.type !== 'vip') {
      return false;
    }
    
    return true;
  };

  // If user has required subscription, show the content
  if (hasRequiredSubscription()) {
    return <>{children}</>;
  }

  // Show subscription gate
  return (
    <div className={`${className}`}>
      <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            {requiredTier === 'vip' ? (
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <Crown className="h-8 w-8 text-white" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {requiredTier === 'vip' ? t('vipFeatureRequired') : t('subscriptionRequired')}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {description || t('subscriptionGateDescription', { feature })}
          </p>
        </CardHeader>
        
        <CardContent className="text-center">
          <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Lock className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {feature}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {requiredTier === 'vip' 
                ? t('vipOnlyFeature') 
                : t('subscriptionOnlyFeature')
              }
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/subscription')}
              className="w-full"
              variant="primary"
            >
              {user?.subscription 
                ? t('upgradeSubscription') 
                : t('getSubscription')
              }
            </Button>
            
            {requiredTier === 'vip' && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {t('vipBenefits')}: {t('personalCoaching')}, {t('advancedAnalytics')}, {t('prioritySupport')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Hook to check subscription status
 */
export function useSubscription() {
  const { user } = useUser();

  const hasActiveSubscription = () => {
    if (!user?.subscription) return false;
    
    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    return endDate >= now && user.subscription.status === 'active';
  };

  const hasVipSubscription = () => {
    return hasActiveSubscription() && user?.subscription?.type === 'vip';
  };

  const hasBasicSubscription = () => {
    return hasActiveSubscription() && user?.subscription?.type === 'basic';
  };

  const subscriptionStatus = user?.subscription?.status || 'none';
  const subscriptionType = user?.subscription?.type;
  const daysRemaining = user?.subscription ? 
    Math.max(0, Math.ceil((new Date(user.subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0;

  return {
    hasActiveSubscription: hasActiveSubscription(),
    hasVipSubscription: hasVipSubscription(),
    hasBasicSubscription: hasBasicSubscription(),
    subscriptionStatus,
    subscriptionType,
    daysRemaining,
    subscription: user?.subscription
  };
}
