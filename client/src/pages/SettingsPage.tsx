import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { EducationLevel, WorkArrangement } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Settings,
  User,
  ShieldAlert,
  Save,
  CheckCircle2,
  Trash2,
  Lock,
  FileText,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(profile?.education_level || "Bachelor's Degree");
  const [currentRole, setCurrentRole] = useState(profile?.current_role || '');
  const [yearsOfExperience, setYearsOfExperience] = useState(profile?.years_of_experience || 0);

  const [targetRole, setTargetRole] = useState(profile?.target_role || '');
  const [targetCompaniesInput, setTargetCompaniesInput] = useState((profile?.target_companies || []).join(', '));
  const [preferredCountry, setPreferredCountry] = useState(profile?.preferred_country || 'United States');
  const [preferredWorkArrangement, setPreferredWorkArrangement] = useState<WorkArrangement>(profile?.preferred_work_arrangement || 'Remote');
  const [weeklyHours, setWeeklyHours] = useState(profile?.weekly_learning_hours || 10);
  const [careerGoals, setCareerGoals] = useState(profile?.career_goals || '');
  const [githubUrl, setGithubUrl] = useState(profile?.github_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url || '');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const companies = targetCompaniesInput
        .split(',')
        .map(c => c.trim())
        .filter(Boolean);

      await updateProfile({
        full_name: fullName,
        education_level: educationLevel,
        current_role: currentRole,
        years_of_experience: Number(yearsOfExperience),
        target_role: targetRole,
        target_companies: companies,
        preferred_country: preferredCountry,
        preferred_work_arrangement: preferredWorkArrangement,
        weekly_learning_hours: Number(weeklyHours),
        career_goals: careerGoals,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccountData = async () => {
    const confirmation = window.prompt(
      'Type "DELETE" to permanently erase all personal profile data, resume analyses, and coach conversations from GapZero servers.'
    );

    if (confirmation !== 'DELETE') return;

    setDeleting(true);
    try {
      await apiRequest('/profile/data', { method: 'DELETE' });
      alert('Your personal data has been completely erased.');
      logout();
      navigate('/');
    } catch (err: any) {
      alert(err.message || 'Failed to delete account data.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-950 tracking-tight">Account Settings & Privacy</h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Manage your career preferences, target milestones, and data privacy controls.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile and career preferences saved successfully!</span>
        </div>
      )}

      {/* Edit Profile Form */}
      <Card className="p-6">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="border-b border-navy-100 pb-3">
            <h3 className="font-bold text-navy-900 text-sm">Profile & Background</h3>
            <p className="text-xs text-navy-500">Update your background to refine career fit assessments.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Current Role / Status</label>
              <input
                type="text"
                value={currentRole}
                onChange={e => setCurrentRole(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Education Level</label>
              <select
                value={educationLevel}
                onChange={e => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full px-3 py-2 text-xs border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Associate Degree">Associate Degree</option>
                <option value="Self-Taught / Bootcamp">Self-Taught / Bootcamp</option>
                <option value="Doctorate (Ph.D.)">Doctorate (Ph.D.)</option>
                <option value="High School">High School</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Years of Technical Experience</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                value={yearsOfExperience}
                onChange={e => setYearsOfExperience(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="border-b border-navy-100 pt-4 pb-3">
            <h3 className="font-bold text-navy-900 text-sm">Target Role & Market Preferences</h3>
            <p className="text-xs text-navy-500">Controls which benchmarks and roadmaps are generated.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Target Job Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Target Companies (comma-separated)</label>
              <input
                type="text"
                value={targetCompaniesInput}
                onChange={e => setTargetCompaniesInput(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Preferred Country</label>
              <input
                type="text"
                value={preferredCountry}
                onChange={e => setPreferredCountry(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Work Arrangement</label>
              <select
                value={preferredWorkArrangement}
                onChange={e => setPreferredWorkArrangement(e.target.value as WorkArrangement)}
                className="w-full px-3 py-2 text-xs border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Any">Any</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Weekly Learning Capacity ({weeklyHours} hrs / week)</label>
            <input
              type="range"
              min="2"
              max="40"
              step="2"
              value={weeklyHours}
              onChange={e => setWeeklyHours(Number(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">GitHub Profile URL</label>
              <input
                type="text"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-3 py-2 text-xs border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">LinkedIn Profile URL</label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3 py-2 text-xs border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-navy-100">
            <Button type="submit" size="sm" loading={saving} icon={<Save className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Data Privacy & Retention Policy Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-navy-950 text-sm">Data Flows, Privacy & Retention Policy</h3>
        </div>

        <div className="text-xs text-navy-600 space-y-2 leading-relaxed">
          <p>
            <strong>Resume Processing:</strong> When you upload a resume, text extraction occurs inside a protected execution environment. Raw resume files are held in temporary memory solely during the analysis request and are discarded afterward.
          </p>
          <p>
            <strong>Storage & Access Controls:</strong> All profile records, analyses, and roadmaps are protected with PostgreSQL Row Level Security (RLS) policies. Only authenticated requests matching your unique user ID can query your records.
          </p>
          <p>
            <strong>No AI Retraining:</strong> User uploaded documents, resumes, and career goals are never utilized for model fine-tuning or model training.
          </p>
        </div>
      </Card>

      {/* Danger Zone: Account Deletion */}
      <Card className="p-6 border-rose-200 bg-rose-50/20 space-y-4">
        <div className="flex items-center gap-2 text-rose-700">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-bold text-sm">Danger Zone — Permanent Data Deletion</h3>
        </div>

        <p className="text-xs text-navy-600">
          Permanently delete all your personal account data, resume analyses, generated roadmaps, and career coach conversation history. This action cannot be undone.
        </p>

        <Button
          variant="danger"
          size="sm"
          onClick={handleDeleteAccountData}
          loading={deleting}
          icon={<Trash2 className="w-4 h-4" />}
        >
          Delete All My Data
        </Button>
      </Card>
    </div>
  );
};
