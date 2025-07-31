import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  MessageCircle, 
  Video, 
  Calendar, 
  User, 
  Star, 
  Clock,
  Phone,
  CheckCircle,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';

interface CoachingSession {
  id: string;
  date: string;
  time: string;
  type: 'video' | 'call' | 'message';
  status: 'scheduled' | 'completed' | 'cancelled';
  duration: number; // minutes
  notes?: string;
  goals?: string[];
}

interface Coach {
  id: string;
  name: string;
  avatar: string;
  specialization: string[];
  rating: number;
  experience: number; // years
  languages: string[];
  bio: string;
}

interface PersonalCoachingProps {
  className?: string;
}

/**
 * Personal coaching component for VIP subscribers
 */
export function PersonalCoaching({ className = '' }: PersonalCoachingProps) {
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'progress'>('overview');
  const [upcomingSessions, setUpcomingSessions] = useState<CoachingSession[]>([]);
  const [coach, setCoach] = useState<Coach | null>(null);

  // Mock data - in real app this would come from API
  useEffect(() => {
    // Mock coach data
    setCoach({
      id: 'coach-1',
      name: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed',
      avatar: '/images/coach-avatar.jpg',
      specialization: ['Weight Loss', 'Muscle Building', 'Nutrition'],
      rating: 4.9,
      experience: 8,
      languages: ['Arabic', 'English'],
      bio: language === 'ar' 
        ? 'مدرب شخصي معتمد مع 8 سنوات من الخبرة في مساعدة العملاء على تحقيق أهدافهم الصحية واللياقة البدنية.'
        : 'Certified personal trainer with 8 years of experience helping clients achieve their health and fitness goals.'
    });

    // Mock upcoming sessions
    setUpcomingSessions([
      {
        id: 'session-1',
        date: '2024-02-15',
        time: '10:00',
        type: 'video',
        status: 'scheduled',
        duration: 30,
        goals: ['Review progress', 'Adjust workout plan', 'Nutrition guidance']
      },
      {
        id: 'session-2',
        date: '2024-02-18',
        time: '15:30',
        type: 'call',
        status: 'scheduled',
        duration: 15,
        goals: ['Quick check-in', 'Motivation boost']
      }
    ]);
  }, [language]);

  const getSessionTypeIcon = (type: CoachingSession['type']) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'message': return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: CoachingSession['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {t('personalCoaching')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t('personalCoachingDescription')}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        {(['overview', 'sessions', 'progress'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t(`coaching.${tab}`)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Coach Profile */}
          {coach && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {t('yourPersonalCoach')}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                      {coach.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {coach.rating}
                        </span>
                      </div>
                      <span className="text-slate-400">•</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {coach.experience} {t('yearsExperience')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      {coach.bio}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {coach.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-20 flex-col space-y-2">
              <Video className="h-6 w-6" />
              <span className="text-sm">{t('scheduleVideoCall')}</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <MessageCircle className="h-6 w-6" />
              <span className="text-sm">{t('sendMessage')}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {t('upcomingSessions')}
            </h3>
            <Button size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              {t('scheduleNew')}
            </Button>
          </div>

          {upcomingSessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      {getSessionTypeIcon(session.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {new Date(session.date).toLocaleDateString()}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {session.time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {session.duration} {t('minutes')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(session.status)}>
                    {t(`sessionStatus.${session.status}`)}
                  </Badge>
                </div>
                
                {session.goals && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('sessionGoals')}:
                    </p>
                    <ul className="space-y-1">
                      {session.goals.map((goal, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                          <Target className="h-3 w-3" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {t('coachingProgress')}
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">12</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('completedSessions')}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">85%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('goalProgress')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {t('recentAchievements')}
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {t('achievement.consistentWorkouts')}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {t('achievement.weightLossGoal')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
