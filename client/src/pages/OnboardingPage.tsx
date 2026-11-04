import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EducationLevel, WorkArrangement } from '@/types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Target,
  Clock,
  Github,
  Linkedin,
} from 'lucide-react';

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL',
  'Docker', 'Git', 'REST APIs', 'AWS', 'GraphQL', 'Tailwind CSS',
  'Next.js', 'System Design', 'Algorithms', 'MongoDB', 'Redis', 'Kubernetes'
];

export const OnboardingPage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel | ''>(profile?.education_level || '');
  const [currentRole, setCurrentRole] = useState(profile?.current_role || '');
  const [yearsOfExperience, setYearsOfExperience] = useState(profile?.years_of_experience ?? 0);

  const [targetRole, setTargetRole] = useState(profile?.target_role || '');
  const [targetCompaniesInput, setTargetCompaniesInput] = useState((profile?.target_companies || []).join(', '));
  const [preferredCountry, setPreferredCountry] = useState(profile?.preferred_country || '');
  const [preferredWorkArrangement, setPreferredWorkArrangement] = useState<WorkArrangement>(profile?.preferred_work_arrangement || 'Any');

  const [currentSkills, setCurrentSkills] = useState<string[]>(profile?.current_skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [weeklyLearningHours, setWeeklyLearningHours] = useState(profile?.weekly_learning_hours ?? 0);

  const [careerGoals, setCareerGoals] = useState(profile?.career_goals || '');
  const [githubUrl, setGithubUrl] = useState(profile?.github_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url || '');

  const toggleSkill = (skill: string) => {
    if (currentSkills.includes(skill)) {
      setCurrentSkills(currentSkills.filter(s => s !== skill));
    } else {
      setCurrentSkills([...currentSkills, skill]);
    }
  };

  const addCustomSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !currentSkills.includes(trimmed)) {
      setCurrentSkills([...currentSkills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const targetCompanies = targetCompaniesInput
        .split(',')
        .map(c => c.trim())
        .filter(Boolean);

      await updateProfile({
        full_name: fullName,
        education_level: educationLevel || undefined,
        current_role: currentRole,
        years_of_experience: Number(yearsOfExperience),
        target_role: targetRole,
        target_companies: targetCompanies,
        preferred_country: preferredCountry,
        preferred_work_arrangement: preferredWorkArrangement,
        current_skills: currentSkills,
        weekly_learning_hours: Number(weeklyLearningHours),
        career_goals: careerGoals,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c100e] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-navy-900 text-lg">GapZero Onboarding</span>
          </div>
          <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">
            Step {step} of 4
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-8">
          <ProgressBar value={(step / 4) * 100} size="sm" color="brand" />
        </div>

        <Card className="p-6 sm:p-8">
          {/* STEP 1: Background & Education */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-navy-950">Tell us about your background</h3>
                <p className="text-xs text-navy-500 mt-1">This helps our AI calibrate your current level and experience trajectory.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Current Role or Student Status</label>
                  <input
                    type="text"
                    value={currentRole}
                    onChange={e => setCurrentRole(e.target.value)}
                    placeholder="e.g. Computer Science Student, Junior Developer, Career Switcher"
                    className="w-full px-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-navy-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 mb-1">Education Level</label>
                    <select
                      value={educationLevel}
                      onChange={e => setEducationLevel(e.target.value as EducationLevel | '')}
                      className="w-full px-3 py-2 text-sm border border-navy-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-navy-900 bg-[#121814]"
                    >
                      <option value="">Select education level</option>
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
                      className="w-full px-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-navy-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Target Career & Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-navy-950">Where do you want to go next?</h3>
                <p className="text-xs text-navy-500 mt-1">We will tailor your skill gap assessments against market expectations for this role.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Target Job Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    placeholder="e.g. Full-Stack Software Engineer, Machine Learning Engineer, DevOps Architect"
                    className="w-full px-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-navy-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Target Companies (comma-separated)</label>
                  <input
                    type="text"
                    value={targetCompaniesInput}
                    onChange={e => setTargetCompaniesInput(e.target.value)}
                    placeholder="e.g. Stripe, Airbnb, Linear, Datadog"
                    className="w-full px-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-navy-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 mb-1">Preferred Country</label>
                    <input
                      type="text"
                      value={preferredCountry}
                      onChange={e => setPreferredCountry(e.target.value)}
                      placeholder="e.g. United States, United Kingdom, Canada, India"
                      className="w-full px-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-navy-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-700 mb-1">Work Arrangement</label>
                    <select
                      value={preferredWorkArrangement}
                      onChange={e => setPreferredWorkArrangement(e.target.value as WorkArrangement)}
                      className="w-full px-3 py-2 text-sm border border-navy-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-navy-900 bg-[#121814]"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                      <option value="Any">Any</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Current Skills & Capacity */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-navy-950">Current Skills & Learning Capacity</h3>
                <p className="text-xs text-navy-500 mt-1">Select the tools and languages you already have experience with.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-2">Select Your Current Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {COMMON_SKILLS.map(skill => {
                    const selected = currentSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          selected
                            ? 'bg-brand-600 border-brand-600 text-white font-semibold shadow-xs'
                            : 'bg-[#121814] border-navy-200 text-navy-700 hover:border-brand-300'
                        }`}
                      >
                        {skill} {selected && '✓'}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
                    placeholder="Add other skill (e.g. C++, Kafka, GraphQL)..."
                    className="flex-1 px-3 py-1.5 text-xs border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={addCustomSkill}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-navy-100">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-navy-700">Weekly Learning Hours Available</label>
                  <span className="text-xs font-bold text-brand-700">{weeklyLearningHours} hrs / week</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="2"
                  value={weeklyLearningHours}
                  onChange={e => setWeeklyLearningHours(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <p className="text-[11px] text-navy-400 mt-1">Roadmaps will calibrate milestone durations around this weekly commitment.</p>
              </div>
            </div>
          )}

          {/* STEP 4: Goals & Online Profiles */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-navy-950">Final Polish: Goals & Portfolios</h3>
                <p className="text-xs text-navy-500 mt-1">Optional profiles enable instant GitHub repository and LinkedIn profile audits.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Career Goal Statement</label>
                  <textarea
                    rows={3}
                    value={careerGoals}
                    onChange={e => setCareerGoals(e.target.value)}
                    placeholder="Describe what you want to achieve over the next 6-12 months..."
                    className="w-full px-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">
                    Public GitHub Profile URL or Username (optional)
                  </label>
                  <div className="relative">
                    <Github className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={githubUrl}
                      onChange={e => setGithubUrl(e.target.value)}
                      placeholder="e.g. https://github.com/torvalds"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-navy-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">
                    LinkedIn Profile URL (optional)
                  </label>
                  <div className="relative">
                    <Linkedin className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={linkedinUrl}
                      onChange={e => setLinkedinUrl(e.target.value)}
                      placeholder="e.g. https://linkedin.com/in/alex-rivera-dev"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-navy-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-navy-100 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="outline" size="sm" onClick={() => setStep(step - 1)} icon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
            ) : <div />}

            {step < 4 ? (
              <Button size="sm" onClick={() => setStep(step + 1)} icon={<ArrowRight className="w-4 h-4" />}>
                Continue
              </Button>
            ) : (
              <Button size="sm" onClick={handleFinish} loading={loading} icon={<CheckCircle2 className="w-4 h-4" />}>
                Complete Profile & Open Dashboard
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
