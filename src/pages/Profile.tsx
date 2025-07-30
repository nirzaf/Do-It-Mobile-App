import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { UserProfile } from '../types';
import { calculateBMI, calculateDailyCalories, calculateWaterIntake } from '../lib/utils';
import { 
  User,
  Edit3,
  Save,
  X,
  Camera,
  Target,
  Scale,
  Ruler,
  Calendar,
  Activity,
  TrendingUp,
  Droplets,
  Zap,
  LogOut
} from 'lucide-react';

/**
 * Profile component for viewing and editing user profile information
 */
export function Profile() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!user) {
      navigate('/welcome');
      return;
    }
    setEditForm(user);
  }, [user, navigate]);

  if (!user || !editForm) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  /**
   * Handle input changes
   */
  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setEditForm(prev => prev ? { ...prev, [field]: value } : null);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!editForm?.name.trim()) {
      newErrors.name = t('nameRequired');
    }

    if (!editForm?.age || editForm.age < 13 || editForm.age > 100) {
      newErrors.age = t('ageInvalid');
    }

    if (!editForm?.weight || editForm.weight < 30 || editForm.weight > 300) {
      newErrors.weight = t('weightInvalid');
    }

    if (!editForm?.height || editForm.height < 100 || editForm.height > 250) {
      newErrors.height = t('heightInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Save profile changes
   */
  const handleSave = () => {
    if (!validateForm() || !editForm) return;

    setUser(editForm);
    setIsEditing(false);
  };

  /**
   * Cancel editing
   */
  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
    setErrors({});
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    setUser(null);
    navigate('/welcome');
  };

  /**
   * Calculate user metrics
   */
  const bmi = calculateBMI(user.weight, user.height);
  const dailyCalories = calculateDailyCalories(user.weight, user.height, user.age, user.gender, user.activityLevel);
  const waterIntake = calculateWaterIntake(user.weight, user.activityLevel);

  /**
   * Get BMI status and color
   */
  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { status: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { status: 'Overweight', color: 'text-yellow-600' };
    return { status: 'Obese', color: 'text-red-600' };
  };

  const bmiStatus = getBMIStatus(bmi);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header 
        title={t('profile')} 
        showBack 
        onBack={() => navigate('/dashboard')}
      />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {user.profilePhoto ? (
                    <img 
                      src={user.profilePhoto} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-white" />
                  )}
                </div>
                {isEditing && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer">
                    <Camera className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {user.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {t(user.goal.toLowerCase().replace(' ', ''))}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {user.age} {t('yearsOld')} • {user.gender === 'male' ? t('male') : t('female')}
                  </span>
                </div>
              </div>
              
              {/* Edit Button */}
              <Button
                variant={isEditing ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Edit3 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Health Metrics */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('healthMetrics')}
            </h2>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* BMI */}
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('bmi')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {bmi.toFixed(1)}
                </p>
                <p className={`text-xs ${bmiStatus.color}`}>
                  {bmiStatus.status}
                </p>
              </div>
              
              {/* Daily Calories */}
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Zap className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('calories')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {dailyCalories}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('perDay')}
                </p>
              </div>
              
              {/* Water Intake */}
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Droplets className="h-6 w-6 text-cyan-500 mx-auto mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('water')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {waterIntake}L
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('perDay')}
                </p>
              </div>
              
              {/* Goal */}
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Target className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('goal')}</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t(user.goal.toLowerCase().replace(' ', ''))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t('profileDetails')}
            </h2>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {isEditing ? (
              // Edit Mode
              <>
                <Input
                  label={t('name')}
                  value={editForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  icon={<User className="h-4 w-4" />}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={t('age')}
                    type="number"
                    value={editForm.age.toString()}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                    error={errors.age}
                    icon={<Calendar className="h-4 w-4" />}
                  />
                  
                  <Select
                    label={t('gender')}
                    value={editForm.gender}
                    onChange={(value) => handleInputChange('gender', value)}
                    options={[
                      { value: 'male', label: t('male') },
                      { value: 'female', label: t('female') }
                    ]}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={t('weight')}
                    type="number"
                    value={editForm.weight.toString()}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                    error={errors.weight}
                    icon={<Scale className="h-4 w-4" />}
                    helperText="kg"
                  />
                  
                  <Input
                    label={t('height')}
                    type="number"
                    value={editForm.height.toString()}
                    onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                    error={errors.height}
                    icon={<Ruler className="h-4 w-4" />}
                    helperText="cm"
                  />
                </div>
                
                <Select
                  label={t('activityLevel')}
                  value={editForm.activityLevel}
                  onChange={(value) => handleInputChange('activityLevel', value)}
                  options={[
                    { value: 'sedentary', label: t('sedentary') },
                    { value: 'light', label: t('lightlyActive') },
                    { value: 'moderate', label: t('moderatelyActive') },
                    { value: 'active', label: t('veryActive') },
                    { value: 'extra', label: t('extraActive') }
                  ]}
                  icon={<Activity className="h-4 w-4" />}
                />
                
                <Select
                  label={t('goal')}
                  value={editForm.goal}
                  onChange={(value) => handleInputChange('goal', value)}
                  options={[
                    { value: 'Lose Weight', label: t('loseweight') },
                    { value: 'Gain Weight', label: t('gainweight') },
                    { value: 'Gain Muscle', label: t('gainmuscle') },
                    { value: 'Extra Diet', label: t('extradiet') }
                  ]}
                  icon={<Target className="h-4 w-4" />}
                />
                
                {/* Save/Cancel Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t('cancel')}
                  </Button>
                  
                  <Button
                    onClick={handleSave}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {t('save')}
                  </Button>
                </div>
              </>
            ) : (
              // View Mode
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Scale className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{t('weight')}</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {user.weight} kg
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Ruler className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{t('height')}</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {user.height} cm
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Activity className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{t('activityLevel')}</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                      {t(user.activityLevel)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Logout Button */}
        {!isEditing && (
          <Button
            variant="outline"
            onClick={() => setShowLogoutModal(true)}
            className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('logout')}
          </Button>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title={t('confirmLogout')}
      >
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            {t('logoutConfirmation')}
          </p>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
              className="flex-1"
            >
              {t('cancel')}
            </Button>
            
            <Button
              onClick={handleLogout}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {t('logout')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}