import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Header } from '../components/shared/Header';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import type { UserProfile } from '../types';
import { Camera, Video, Upload, Check } from 'lucide-react';

/**
 * Media upload component for profile photos and progress videos
 */
export function MediaUpload() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState(false);

  /**
   * Simulate photo upload
   */
  const handlePhotoUpload = () => {
    // Simulate file selection and upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      if (input.files && input.files[0]) {
        // Simulate upload process
        setTimeout(() => {
          setUploadedPhoto(true);
        }, 1000);
      }
    };
    input.click();
  };

  /**
   * Simulate video upload
   */
  const handleVideoUpload = () => {
    // Simulate file selection and upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.multiple = true;
    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        // Simulate upload process
        setTimeout(() => {
          setUploadedVideos(true);
        }, 1000);
      }
    };
    input.click();
  };

  /**
   * Complete registration and save user profile
   */
  const handleFinish = async () => {
    setIsSubmitting(true);

    // Get profile data from session storage
    const profileDataStr = sessionStorage.getItem('profileData');
    if (!profileDataStr) {
      navigate('/register/profile');
      return;
    }

    const profileData = JSON.parse(profileDataStr);
    
    // Create complete user profile
    const userProfile: UserProfile = {
      ...profileData,
      profilePhoto: uploadedPhoto ? 'https://placehold.co/200x200/3b82f6/ffffff?text=Profile' : undefined,
      progressVideos: uploadedVideos ? ['https://placehold.co/400x300/3b82f6/ffffff?text=Video+1'] : undefined,
    };

    // Save user profile to context and localStorage
    setUser(userProfile);
    
    // Clear session storage
    sessionStorage.removeItem('profileData');
    
    // Navigate to dashboard
    navigate('/dashboard');
    setIsSubmitting(false);
  };

  /**
   * Skip media upload and complete registration
   */
  const handleSkip = () => {
    handleFinish();
  };

  /**
   * Navigate back to goal selection
   */
  const handleBack = () => {
    navigate('/register/goal');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header title="Media Upload" />
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Add Media
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Upload your profile photo and progress videos (optional)
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Profile Photo Upload */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {t('uploadPhoto')}
              </h3>
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  uploadedPhoto ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''
                }`}
                onClick={handlePhotoUpload}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      uploadedPhoto 
                        ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                    }`}>
                      {uploadedPhoto ? <Check className="h-6 w-6" /> : <Camera className="h-6 w-6" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {uploadedPhoto ? 'Photo Uploaded' : 'Upload Profile Photo'}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {uploadedPhoto ? 'Tap to change' : 'Tap to select photo'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Videos Upload */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {t('uploadVideos')}
              </h3>
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  uploadedVideos ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''
                }`}
                onClick={handleVideoUpload}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      uploadedVideos 
                        ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                        : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                    }`}>
                      {uploadedVideos ? <Check className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {uploadedVideos ? 'Videos Uploaded' : 'Upload Progress Videos'}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {uploadedVideos ? 'Tap to change' : 'Tap to select videos'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                {t('back')}
              </Button>
              
              <Button
                variant="secondary"
                onClick={handleSkip}
                disabled={isSubmitting}
                className="flex-1"
              >
                {t('skip')}
              </Button>
              
              <Button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Loading...' : t('finish')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}