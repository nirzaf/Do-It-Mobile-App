import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import { UserProfile } from '../types';

interface FormData {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | '';
  weight: string;
  height: string;
  age: string;
  email: string;
  phone: string;
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
    gender: '',
    weight: '',
    height: '',
    age: '',
    email: '',
    phone: '',
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
   * Validate form data
   * @returns Object containing validation errors
   */
  const validateForm = (): FormErrors {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    const weight = parseFloat(formData.weight);
    if (!formData.weight || isNaN(weight) || weight <= 0) {
      newErrors.weight = 'Valid weight is required';
    }
    
    const height = parseFloat(formData.height);
    if (!formData.height || isNaN(height) || height <= 0) {
      newErrors.height = 'Valid height is required';
    }
    
    const age = parseInt(formData.age);
    if (!formData.age || isNaN(age) || age < 13 || age > 100) {
      newErrors.age = 'Valid age (13-100) is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    return newErrors;
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
    const profileData: Partial<UserProfile> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender as 'male' | 'female',
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      age: parseInt(formData.age),
      email: formData.email,
      phone: formData.phone,
    };
    
    sessionStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Navigate to goal selection
    navigate('/register/goal');
    setIsSubmitting(false);
  };

  const genderOptions = [
    { value: 'male', label: t('male') },
    { value: 'female', label: t('female') },
  ];

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
                label={t('age')}
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                error={errors.age}
                min="13"
                max="100"
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