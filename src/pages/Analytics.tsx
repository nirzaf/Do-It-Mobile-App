
import { Header } from '../components/shared/Header';
import { AdvancedAnalytics } from '../components/features/AdvancedAnalytics';
import { SubscriptionGate } from '../components/features/SubscriptionGate';
import { useLanguage } from '../context/LanguageContext';


/**
 * Analytics page - VIP exclusive feature
 */
export function Analytics() {
  const { t } = useLanguage();


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header
        title={t('advancedAnalytics')}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <SubscriptionGate
          requiredTier="vip"
          feature={t('advancedAnalytics')}
          description={t('analyticsGateDescription')}
        >
          <AdvancedAnalytics />
        </SubscriptionGate>
      </div>
    </div>
  );
}
