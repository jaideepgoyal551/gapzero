import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';

import { DashboardPage } from './pages/DashboardPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { ATSOptimizerPage } from './pages/ATSOptimizerPage';
import { CareerRoadmapPage } from './pages/CareerRoadmapPage';
import { CareerCoachPage } from './pages/CareerCoachPage';
import { JobMatcherPage } from './pages/JobMatcherPage';
import { GitHubAnalyzerPage } from './pages/GitHubAnalyzerPage';
import { LinkedInOptimizerPage } from './pages/LinkedInOptimizerPage';
import { SalaryInsightsPage } from './pages/SalaryInsightsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Onboarding Wizard */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Application Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
            <Route path="/skill-gap" element={<SkillGapPage />} />
            <Route path="/ats-optimizer" element={<ATSOptimizerPage />} />
            <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
            <Route path="/career-coach" element={<CareerCoachPage />} />
            <Route path="/job-matcher" element={<JobMatcherPage />} />
            <Route path="/github-analyzer" element={<GitHubAnalyzerPage />} />
            <Route path="/linkedin-optimizer" element={<LinkedInOptimizerPage />} />
            <Route path="/salary-insights" element={<SalaryInsightsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
