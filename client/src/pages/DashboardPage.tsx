import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { DashboardSummary, ResumeAnalysis, CareerRoadmap } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  FileText,
  Target,
  Sparkles,
  Map,
  MessageSquare,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  UploadCloud,
  ChevronRight,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<DashboardSummary>('/dashboard/summary');
      setSummary(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      await apiRequest(`/roadmap/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !currentStatus }),
      });
      await fetchDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-1" />
          <Skeleton className="h-80 lg:col-span-2" />
        </div>
      </div>
    );
  }

  const latestAnalysis = summary?.latest_resume_analysis;
  const isNewUser = !latestAnalysis && (!profile?.current_skills || profile.current_skills.length === 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 pb-5 border-b border-navy-200/70">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-400">
            <span className="text-growth-400">Workspace</span>
            <span>/</span>
            <span>Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-navy-950 tracking-tight">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm text-navy-500 mt-1.5">
            Your career progress, priorities, and next steps at a glance.
          </p>
          <p className="text-xs text-navy-400 mt-2">
            Target role <span className="mx-1.5 text-navy-300">·</span>
            <span className="font-medium text-navy-700">{profile?.target_role || 'Add a target role in your profile'}</span>
          </p>
        </div>

        {error && (
          <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-400/30 bg-rose-950/30 p-4 text-sm text-rose-900 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={fetchDashboard}>Try again</Button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/resume-analyzer">
            <Button size="sm" icon={<UploadCloud className="w-4 h-4" />}>
              Upload New Resume
            </Button>
          </Link>
          <Link to="/career-coach">
            <Button size="sm" variant="outline" icon={<MessageSquare className="w-4 h-4" />}>
              Ask Coach
            </Button>
          </Link>
        </div>
      </div>

      {/* New User Welcome Callout (If no resume yet) */}
      {isNewUser && (
        <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-brand-800 to-growth-800 text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="max-w-xl">
            <h3 className="text-lg font-bold">Start by analyzing your resume</h3>
            <p className="text-xs text-emerald-900 mt-1">
              Upload a PDF or DOCX resume to review your experience, identify relevant skills, and get suggestions for your next steps.
            </p>
          </div>
          <Link to="/resume-analyzer">
            <Button size="sm" className="whitespace-nowrap font-semibold">
              Analyze Resume Now
            </Button>
          </Link>
        </div>
      )}

      {/* Top 4 Summary Cards */}
      <section aria-label="Career summary" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Card 1: Fit Score */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Career Fit Score</span>
            <div className="text-3xl font-semibold text-navy-900 mt-1">
              {summary?.latest_resume_analysis ? `${summary.career_fit_score}%` : '—'}
            </div>
            <span className="text-[11px] text-brand-700 font-medium">
              {summary?.latest_resume_analysis
                ? (summary.career_fit_score >= 70 ? 'Strong alignment' : 'Room to grow')
                : 'Upload a resume to begin'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </Card>

        {/* Card 2: Identified Skills */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Skills Identified</span>
            <div className="text-3xl font-semibold text-navy-900 mt-1">
              {summary?.identified_skills_count ?? profile?.current_skills?.length ?? '—'}
            </div>
            <span className="text-[11px] text-emerald-300 font-medium">Skills in your profile</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Card>

        {/* Card 3: Critical Gaps */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Critical Gaps</span>
            <div className="text-3xl font-semibold text-navy-800 mt-1">
              {summary?.latest_resume_analysis ? summary.critical_gaps_count : '—'}
            </div>
            <span className="text-[11px] text-rose-700 font-medium">Priority items to bridge</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-navy-100 text-navy-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </Card>

        {/* Card 4: Roadmap Tasks */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Roadmap Progress</span>
            <div className="text-3xl font-semibold text-navy-900 mt-1">
              {summary ? `${summary.roadmap_progress_percentage}%` : '—'}
            </div>
            <span className="text-[11px] text-navy-500 font-medium">
              {summary ? `${summary.completed_tasks_count} / ${summary.total_tasks_count} completed` : 'No roadmap data yet'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-400 flex items-center justify-center">
            <Map className="w-6 h-6" />
          </div>
        </Card>
      </section>

      {/* Main Grid: Profile insights + upcoming tasks */}
      <section aria-label="Career insights and roadmap" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          {summary?.latest_resume_analysis ? (
            <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy-900 text-sm">Role Readiness Index</h3>
              <Badge variant="purple">From your profile</Badge>
            </div>
            <ScoreGauge
              score={summary.career_fit_score}
              size={130}
              label={profile?.target_role || 'Career fit'}
              sublabel="Based on your latest analysis"
            />
            {profile?.current_skills?.length ? (
              <div className="mt-6 border-t border-white/10 pt-4">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-500">Your skills</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.current_skills.slice(0, 8).map(skill => (
                    <Badge key={skill} variant="outline" size="sm">{skill}</Badge>
                  ))}
                </div>
              </div>
            ) : null}
            </>
          ) : (
            <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-growth-400">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-navy-900">Your career insights will appear here</h3>
              <p className="mt-2 max-w-xs text-sm text-navy-500">Add your resume to see information based on your own experience.</p>
              <Link to="/resume-analyzer" className="mt-4">
                <Button size="sm">Analyze a resume</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Center & Right Column: Upcoming Roadmap Tasks */}
        <Card className="p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-navy-900 text-sm">Actionable Roadmap Tasks</h3>
                <p className="text-xs text-navy-500">Check off milestones as you complete them to update your progress</p>
              </div>
              <Link to="/career-roadmap">
                <Button variant="ghost" size="sm" icon={<ChevronRight className="w-4 h-4" />}>
                  View Full Plan
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {summary?.upcoming_tasks && summary.upcoming_tasks.length > 0 ? (
                summary.upcoming_tasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl border border-navy-100 bg-navy-50/40 hover:bg-navy-50/90 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id, task.completed)}
                        className="mt-1 w-4 h-4 accent-brand-600 rounded cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold ${task.completed ? 'line-through text-navy-400' : 'text-navy-900'}`}>
                            {task.title}
                          </span>
                          <Badge
                            size="sm"
                            variant={task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'default'}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-navy-500 mt-0.5 line-clamp-1">{task.description}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-navy-400 whitespace-nowrap">{task.estimated_duration}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-navy-500">
                  {summary ? 'No pending tasks in this phase. You are fully up to date!' : 'Your roadmap tasks will appear here when available.'}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-navy-100 flex items-center justify-between">
            <span className="text-xs font-medium text-navy-600">Roadmap Progress</span>
            {summary ? (
              <div className="w-48 max-w-[50%]">
                <ProgressBar value={summary.roadmap_progress_percentage} color="brand" size="sm" showPercent />
              </div>
            ) : <span className="text-xs text-navy-500">Not available yet</span>}
          </div>
        </Card>
      </section>

      {/* Bottom Section: Quick Links & Tools */}
      <section aria-label="Career tools" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Module 1: ATS Resume Optimizer */}
        <Card className="p-5 hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-navy-900">ATS Resume Optimizer</h4>
            <p className="text-xs text-navy-500 mt-1">
              Review keyword coverage and improve the clarity of your resume bullet points.
            </p>
          </div>
          <Link to="/ats-optimizer" className="mt-4">
            <Button variant="outline" size="sm" className="w-full">
              Optimize Bullets
            </Button>
          </Link>
        </Card>

        {/* Module 2: Job Description Matcher */}
        <Card className="p-5 hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-navy-900">Job Description Matcher</h4>
            <p className="text-xs text-navy-500 mt-1">
              Paste a real job opening to discover matching qualifications, missing criteria, and custom prep tips.
            </p>
          </div>
          <Link to="/job-matcher" className="mt-4">
            <Button variant="outline" size="sm" className="w-full">
              Match Job Posting
            </Button>
          </Link>
        </Card>

        {/* Module 3: Verified Salary Insights */}
        <Card className="p-5 hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-navy-900">Salary Insights Explorer</h4>
            <p className="text-xs text-navy-500 mt-1">
              Inspect official bureau (BLS/ONS) base salary distributions across US, UK, Canada, India, and Germany.
            </p>
          </div>
          <Link to="/salary-insights" className="mt-4">
            <Button variant="outline" size="sm" className="w-full">
              Explore Salary Ranges
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
};
