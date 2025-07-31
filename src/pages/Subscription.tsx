import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../hooks/useUser';
import { useSubscription } from '../components/features/SubscriptionGate';
import { Check, Crown, Star, CreditCard, Shield, Clock, AlertCircle } from 'lucide-react';

interface PackageFeature {
  text: string;
  included: boolean;
}

interface SubscriptionPackage {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: PackageFeature[];
  popular?: boolean;
}

/**
 * Subscription component for displaying and managing subscription packages
 */
export function Subscription() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { updateUser } = useUser();
  const { hasActiveSubscription, subscriptionType, daysRemaining } = useSubscription();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank'>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Check if user came from a protected route
  const fromProtectedRoute = location.state?.from;
  const isUpgrade = location.state?.upgrade;
  const isExpired = location.state?.expired;

  // Mock subscription packages data
  const packages: SubscriptionPackage[] = [
    {
      id: 'basic',
      name: t('basicPackage'),
      price: 300,
      currency: 'SAR',
      period: t('month'),
      features: [
        { text: t('personalizedDietPlan'), included: true },
        { text: t('basicWorkoutPlan'), included: true },
        { text: t('progressTracking'), included: true },
        { text: t('emailSupport'), included: true },
        { text: t('nutritionGuidance'), included: false },
        { text: t('personalTrainer'), included: false },
        { text: t('liveClasses'), included: false },
        { text: t('prioritySupport'), included: false },
      ],
    },
    {
      id: 'vip',
      name: t('vipPackage'),
      price: 550,
      currency: 'SAR',
      period: t('month'),
      popular: true,
      features: [
        { text: t('personalizedDietPlan'), included: true },
        { text: t('advancedWorkoutPlan'), included: true },
        { text: t('progressTracking'), included: true },
        { text: t('emailSupport'), included: true },
        { text: t('nutritionGuidance'), included: true },
        { text: t('personalTrainer'), included: true },
        { text: t('liveClasses'), included: true },
        { text: t('prioritySupport'), included: true },
      ],
    },
  ];

  /**
   * Handle package selection
   * @param packageId - ID of the selected package
   */
  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowPayment(true);
  };

  /**
   * Handle subscription payment processing
   */
  const handleSubscribe = async () => {
    if (!selectedPackage) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update user subscription
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      updateUser({
        subscription: {
          type: selectedPackage as 'basic' | 'vip',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          status: 'active',
          autoRenew: true
        }
      });

      const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
      alert(t('subscriptionConfirmation').replace('{packageName}', selectedPkg?.name || ''));

      // Navigate to appropriate page
      if (fromProtectedRoute) {
        navigate(fromProtectedRoute.pathname);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      alert(t('subscriptionError'));
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Navigate back to dashboard
   */
  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header 
        title={t('subscription')}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Current Subscription Status */}
        {hasActiveSubscription && (
          <Card className="mb-8 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    {subscriptionType === 'vip' ? (
                      <Crown className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100">
                      {t('currentSubscription')}: {subscriptionType === 'vip' ? t('vipPackage') : t('basicPackage')}
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {daysRemaining} {t('daysRemaining')}
                    </p>
                  </div>
                </div>
                {subscriptionType === 'basic' && (
                  <Button
                    variant="outline"
                    onClick={() => handleSelectPackage('vip')}
                    className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
                  >
                    {t('upgradeToVip')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alert Messages */}
        {isExpired && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-700 dark:text-red-300">
                  {t('subscriptionExpired')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isUpgrade && (
          <Card className="mb-8 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Crown className="h-5 w-5 text-blue-500" />
                <p className="text-blue-700 dark:text-blue-300">
                  {t('vipUpgradeRequired')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {hasActiveSubscription ? t('manageSubscription') : t('chooseYourPlan')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {hasActiveSubscription ? t('upgradeOrManageDescription') : t('selectPlanDescription')}
          </p>
        </div>

        {/* Subscription Packages */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id}
              className={`relative transition-all duration-200 hover:shadow-lg ${
                pkg.popular 
                  ? 'ring-2 ring-blue-500 dark:ring-blue-400' 
                  : 'hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-600'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>{t('mostPopular')}</span>
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  {pkg.id === 'vip' ? (
                    <Star className="h-8 w-8 text-yellow-500" />
                  ) : (
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {pkg.name}
                </h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {pkg.price}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">
                    {pkg.currency}/{pkg.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        feature.included 
                          ? 'bg-green-100 dark:bg-green-900' 
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}>
                        <Check className={`h-3 w-3 ${
                          feature.included 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-slate-400 dark:text-slate-600'
                        }`} />
                      </div>
                      <span className={`text-sm ${
                        feature.included 
                          ? 'text-slate-900 dark:text-slate-100' 
                          : 'text-slate-500 dark:text-slate-500 line-through'
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Subscribe Button */}
                <Button
                  onClick={() => handleSelectPackage(pkg.id)}
                  disabled={hasActiveSubscription && subscriptionType === pkg.id}
                  className={`w-full ${
                    pkg.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : ''
                  }`}
                  variant={pkg.popular ? 'primary' : 'outline'}
                >
                  {hasActiveSubscription && subscriptionType === pkg.id
                    ? t('currentPlan')
                    : hasActiveSubscription && pkg.id === 'vip' && subscriptionType === 'basic'
                    ? t('upgrade')
                    : t('subscribe')
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Modal */}
        {showPayment && selectedPackage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {t('completePayment')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {packages.find(p => p.id === selectedPackage)?.name} - {packages.find(p => p.id === selectedPackage)?.price} {packages.find(p => p.id === selectedPackage)?.currency}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('paymentMethod')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['card', 'paypal', 'bank'] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          paymentMethod === method
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
                        }`}
                      >
                        <CreditCard className="h-5 w-5 mx-auto mb-1" />
                        <span className="text-xs">{t(`payment.${method}`)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    {t('securePayment')}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowPayment(false)}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    onClick={handleSubscribe}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 animate-spin" />
                        <span>{t('processing')}</span>
                      </div>
                    ) : (
                      t('confirmPayment')
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleBack}
            className="px-8"
          >
            {t('backToDashboard')}
          </Button>
        </div>
      </div>
    </div>
  );
}