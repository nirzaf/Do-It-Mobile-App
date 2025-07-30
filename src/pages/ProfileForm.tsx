import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import { registrationSchema } from '../lib/validators';
import { ACTIVITY_LEVELS } from '../lib/constants';
import type { UserRegistrationData, ActivityLevel, Gender } from '../types';
import { z } from 'zod';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender | '';
  birthDate: string;
  weight: string;
  height: string;
  activityLevel: ActivityLevel | '';
}

interface FormErrors {
  [key: string]: string;
}

/**
 * Profile form component for collecting user data during registration
 */
export function ProfileForm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    birthDate: '',
    weight: '',
    height: '',
    activityLevel: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input field changes
   * @param field - Field name to update
   * @param value - New field value
   */
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Validate form data using Zod schema
   * @returns Object containing validation errors
   */
  const validateForm = (): FormErrors => {
    try {
      const validationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender as Gender,
        birthDate: formData.birthDate,
        weight: parseFloat(formData.weight) || 0,
        height: parseFloat(formData.height) || 0,
        activityLevel: formData.activityLevel as ActivityLevel,
      };

      registrationSchema.parse(validationData);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((err: any) => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        return newErrors;
      }
      return { general: 'Validation failed' };
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // Save form data to session storage for next step
    const profileData: Partial<UserRegistrationData> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender as Gender,
      birthDate: formData.birthDate,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      activityLevel: formData.activityLevel as ActivityLevel,
    };
    
    sessionStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Navigate to goal selection
    navigate('/register/goal');
    setIsSubmitting(false);
  };

  const genderOptions = [
    { value: 'male', label: t('male') },
    { value: 'female', label: t('female') },
    { value: 'other', label: t('other') },
  ];

  const activityLevelOptions = Object.entries(ACTIVITY_LEVELS).map(([key, value]) => ({
    value: key,
    label: t(value.nameKey),
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header title={t('profile')} />
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100">
              {t('profile')}
            </h2>
            <p className="text-center text-slate-600 dark:text-slate-400">
              Tell us about yourself
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t('firstName')}
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
                required
              />
              
              <Input
                label={t('lastName')}
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
                required
              />
              
              <Select
                label={t('gender')}
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                options={genderOptions}
                placeholder={`Select ${t('gender').toLowerCase()}`}
                error={errors.gender}
                required
              />
              
              <Input
                label={t('weight')}
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                error={errors.weight}
                min="1"
                step="0.1"
                required
              />
              
              <Input
                label={t('height')}
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                error={errors.height}
                min="1"
                required
              />
              
              <Input
                label={t('birthDate')}
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                error={errors.birthDate}
                required
              />

              <Input
                label={t('email')}
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                required
              />

              <Input
                label={t('phone')}
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                required
              />

              <Select
                label={t('activityLevel')}
                value={formData.activityLevel}
                onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                options={activityLevelOptions}
                placeholder={`Select ${t('activityLevel').toLowerCase()}`}
                error={errors.activityLevel}
                required
              />

              <div className="flex space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  {t('back')}
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Loading...' : t('next')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}