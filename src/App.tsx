import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { UserProvider } from './context/UserContext';

// Import pages
import { Welcome } from './pages/Welcome';
import { ProfileForm } from './pages/ProfileForm';
import { GoalSelection } from './pages/GoalSelection';
import { MediaUpload } from './pages/MediaUpload';
import { Dashboard } from './pages/Dashboard';
import { DietPlan } from './pages/DietPlan';
import { TrainingPlan } from './pages/TrainingPlan';
import { Exercises } from './pages/Exercises';
import { ExerciseDetail } from './pages/ExerciseDetail';
import { Profile } from './pages/Profile';

/**
 * Main App component with routing and context providers
 */
function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <Router>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
              <Routes>
                {/* Welcome and Registration Flow */}
                <Route path="/" element={<Navigate to="/welcome" replace />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/register/profile" element={<ProfileForm />} />
                <Route path="/register/goal" element={<GoalSelection />} />
                <Route path="/register/media" element={<MediaUpload />} />
                
                {/* Main App */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/diet-plan" element={<DietPlan />} />
                <Route path="/training-plan" element={<TrainingPlan />} />
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/exercises/:exerciseId" element={<ExerciseDetail />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/welcome" replace />} />
              </Routes>
            </div>
          </Router>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
