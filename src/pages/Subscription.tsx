import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import { Check, Crown, Star } from 'lucide-react';

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
  const { t } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

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
   * Handle package subscription
   * @param packageId - ID of the selected package
   */
  const handleSubscribe = (packageId: string) => {
    const selectedPkg = packages.find(pkg => pkg.id === packageId);
    if (selectedPkg) {
      setSelectedPackage(packageId);
      // Show confirmation alert
      alert(t('subscriptionConfirmation').replace('{packageName}', selectedPkg.name));
      // Navigate back to dashboard after subscription
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
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
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {t('chooseYourPlan')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('selectPlanDescription')}
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
                  onClick={() => handleSubscribe(pkg.id)}
                  disabled={selectedPackage === pkg.id}
                  className={`w-full ${
                    pkg.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : ''
                  }`}
                  variant={pkg.popular ? 'primary' : 'outline'}
                >
                  {selectedPackage === pkg.id ? t('subscribed') : t('subscribe')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

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