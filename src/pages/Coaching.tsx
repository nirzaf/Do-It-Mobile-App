
import { Header } from '../components/shared/Header';
import { PersonalCoaching } from '../components/features/PersonalCoaching';
import { SubscriptionGate } from '../components/features/SubscriptionGate';
import { useLanguage } from '../context/LanguageContext';


/**
 * Coaching page - VIP exclusive feature
 */
export function Coaching() {
  const { t } = useLanguage();


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header
        title={t('personalCoaching')}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <SubscriptionGate
          requiredTier="vip"
          feature={t('personalCoaching')}
          description={t('personalCoachingGateDescription')}
        >
          <PersonalCoaching />
        </SubscriptionGate>
      </div>
    </div>
  );
}
