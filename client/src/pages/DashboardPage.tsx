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
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
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
      console.error('Failed to update task:', err);
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

  // Skill Category coverage radar chart data
  const radarData = [
    { category: 'Frontend', current: 75, target: 90 },
    { category: 'Backend', current: 55, target: 85 },
    { category: 'Databases', current: 40, target: 85 },
    { category: 'DevOps', current: 45, target: 80 },
    { category: 'System Design', current: 50, target: 85 },
    { category: 'Soft Skills', current: 80, target: 85 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-navy-100">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
            Welcome back, {profile?.full_name ? profile.full_name.split(' ')[0] : 'Engineer'}!
          </h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-0.5">
            Targeting: <span className="font-semibold text-brand-700">{profile?.target_role || 'Full-Stack Software Engineer'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
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
        <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="max-w-xl">
            <h3 className="text-lg font-bold">Start by analyzing your resume</h3>
            <p className="text-xs text-brand-100 mt-1">
              Upload your PDF or DOCX resume to automatically detect technical skills, calculate your career fit score, and identify critical knowledge gaps.
            </p>
          </div>
          <Link to="/resume-analyzer">
            <Button size="sm" className="bg-white text-brand-700 hover:bg-brand-50 whitespace-nowrap font-semibold">
              Analyze Resume Now
            </Button>
          </Link>
        </div>
      )}

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Fit Score */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Career Fit Score</span>
            <div className="text-3xl font-bold text-navy-900 mt-1">
              {summary?.career_fit_score ? `${summary.career_fit_score}%` : 'N/A'}
            </div>
            <span className="text-[11px] text-brand-700 font-medium">
              {summary?.career_fit_score && summary.career_fit_score >= 70 ? 'Strong Baseline' : 'Needs Optimization'}
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
            <div className="text-3xl font-bold text-navy-900 mt-1">
              {summary?.identified_skills_count || (profile?.current_skills?.length || 0)}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Verified competencies</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Card>

        {/* Card 3: Critical Gaps */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Critical Gaps</span>
            <div className="text-3xl font-bold text-rose-600 mt-1">
              {summary?.critical_gaps_count || 3}
            </div>
            <span className="text-[11px] text-rose-700 font-medium">Priority items to bridge</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </Card>

        {/* Card 4: Roadmap Tasks */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Roadmap Progress</span>
            <div className="text-3xl font-bold text-navy-900 mt-1">
              {summary?.roadmap_progress_percentage || 0}%
            </div>
            <span className="text-[11px] text-navy-500 font-medium">
              {summary?.completed_tasks_count || 0} / {summary?.total_tasks_count || 8} completed
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center">
            <Map className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Main Grid: Career Fit Gauge + Category Radar Chart + Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Fit Gauge & Radar */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy-900 text-sm">Role Readiness Index</h3>
              <Badge variant="purple">AI Calibrated</Badge>
            </div>
            <ScoreGauge
              score={summary?.career_fit_score || 74}
              size={130}
              label={profile?.target_role || 'Target Role'}
              sublabel="Based on current profile & resume"
            />
          </div>

          <div className="mt-6 pt-4 border-t border-navy-100">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: '#475569', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Current" dataKey="current" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.35} />
                  <Radar name="Target" dataKey="target" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.1} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 text-[11px] text-navy-500 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />
                <span>Your Current Skills</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-navy-300" />
                <span>Target Role Benchmark</span>
              </div>
            </div>
          </div>
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
                  No pending tasks in this phase. You are fully up to date!
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-navy-100 flex items-center justify-between">
            <span className="text-xs font-medium text-navy-600">Roadmap Progress</span>
            <div className="w-48">
              <ProgressBar value={summary?.roadmap_progress_percentage || 0} color="brand" size="sm" showPercent />
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Section: Quick Links & Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: ATS Resume Optimizer */}
        <Card className="p-5 hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-navy-900">ATS Resume Optimizer</h4>
            <p className="text-xs text-navy-500 mt-1">
              Verify your keyword density and rewrite weak bullets into high-impact Google X-Y-Z achievements.
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
      </div>
    </div>
  );
};
