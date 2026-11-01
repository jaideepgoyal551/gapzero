import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { JobMatchResult } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ListChecks,
  Building,
} from 'lucide-react';

export const JobMatcherPage: React.FC = () => {
  const { profile } = useAuth();
  const [jobTitle, setJobTitle] = useState(profile?.target_role || '');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<JobMatchResult | null>(null);
  const [pastMatches, setPastMatches] = useState<JobMatchResult[]>([]);

  const fetchMatches = async () => {
    try {
      const data = await apiRequest<JobMatchResult[]>('/jobs/matches');
      setPastMatches(data || []);
      if (data && data.length > 0 && !currentMatch) {
        setCurrentMatch(data[0]);
      }
    } catch (err) {
      console.warn('Could not load past matches:', err);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleMatchJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim() || jobDescription.length < 50) {
      alert('Please paste a job description with at least 50 characters.');
      return;
    }

    setLoading(true);
    try {
      const match = await apiRequest<JobMatchResult>('/jobs/analyze', {
        method: 'POST',
        body: JSON.stringify({
          job_title: jobTitle,
          company_name: companyName,
          job_description: jobDescription,
        }),
      });
      setCurrentMatch(match);
      await fetchMatches();
    } catch (err: any) {
      alert(err.message || 'Failed to analyze job match.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-950 tracking-tight">Job Description Matcher</h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Paste any live job posting to compare required qualifications against your authorized profile and uncover tailoring strategies.
        </p>
      </div>

      {/* Input Box */}
      <Card className="p-6">
        <form onSubmit={handleMatchJob} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full px-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Company Name (Optional)</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Airbnb, Linear, Vercel"
                className="w-full px-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              Job Description (Paste text from LinkedIn, Indeed, or careers page)
            </label>
            <textarea
              rows={5}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the full job posting requirements and responsibilities here..."
              className="w-full px-3 py-2 text-xs border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              required
            />
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-navy-100">
            <span className="text-[11px] text-navy-400">
              Evaluates against your latest uploaded resume & profile skills.
            </span>
            <Button type="submit" size="sm" loading={loading} icon={<Sparkles className="w-4 h-4" />}>
              Compare Requirements
            </Button>
          </div>
        </form>
      </Card>

      {/* Match Results */}
      {currentMatch && (
        <div className="space-y-6">
          {/* Match Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Candidate Match</span>
                <div className="text-3xl font-bold text-navy-900 mt-1">{currentMatch.match_percentage}%</div>
                <p className="text-[11px] text-brand-700 font-medium mt-1">
                  for {currentMatch.job_title} @ {currentMatch.company_name}
                </p>
              </div>
              <ScoreGauge score={currentMatch.match_percentage} size={84} strokeWidth={7} label="" sublabel="" />
            </Card>

            <Card className="p-5 md:col-span-2 space-y-2">
              <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Matching Skills Verified</span>
              <div className="flex flex-wrap gap-2">
                {currentMatch.matching_skills.map((s, i) => (
                  <Badge key={i} variant="success">✓ {s}</Badge>
                ))}
              </div>

              <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider block pt-2">Missing or Unproven Criteria</span>
              <div className="flex flex-wrap gap-2">
                {currentMatch.missing_skills.map((s, i) => (
                  <Badge key={i} variant="danger">✗ {s}</Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Detailed Alignment: Matching vs Missing Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Matching Qualifications & Experience</span>
              </h3>
              <ul className="space-y-2 text-xs text-navy-700">
                {currentMatch.matching_experience.map((exp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 space-y-3">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Gaps & Missing Employer Requirements</span>
              </h3>
              <ul className="space-y-2 text-xs text-navy-700">
                {currentMatch.missing_experience.map((exp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Resume Tailoring & Prep Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Resume Tailoring Suggestions</span>
              </h3>
              <div className="space-y-2">
                {currentMatch.resume_tailoring_suggestions.map((sug, i) => (
                  <div key={i} className="p-3 bg-brand-50/50 border border-brand-100 rounded-lg text-xs text-brand-900">
                    {sug}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-emerald-600" />
                <span>Recommended Prep Tasks Prior to Interview</span>
              </h3>
              <div className="space-y-2">
                {currentMatch.recommended_prep_tasks.map((task, i) => (
                  <div key={i} className="p-3 bg-navy-50 border border-navy-100 rounded-lg text-xs text-navy-800">
                    {task}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Saved Job Matches History */}
      {pastMatches.length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold text-navy-900 text-sm mb-4">Saved Job Match History</h3>
          <div className="divide-y divide-navy-100">
            {pastMatches.map(m => (
              <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-navy-900">{m.job_title}</span>
                  <span className="text-navy-500 ml-2">@ {m.company_name}</span>
                  <div className="text-[11px] text-navy-400 mt-0.5">
                    Analyzed on {new Date(m.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-brand-600">{m.match_percentage}% Match</span>
                  <Button size="sm" variant="ghost" onClick={() => setCurrentMatch(m)}>
                    View Breakdown
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
