import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { SkillGapReport, SkillGapItem, SkillCategory, GapSeverity } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Layers,
  Award,
  Filter,
} from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const { profile } = useAuth();
  const [report, setReport] = useState<SkillGapReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [error, setError] = useState<string | null>(null);

  const fetchSkillGap = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<SkillGapReport>('/skills/gap-analysis', {
        method: 'POST',
        body: JSON.stringify({
          target_role: profile?.target_role,
          skills: profile?.current_skills,
        }),
      });
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load skill gap report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGap();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40 md:col-span-2" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const filteredSkills = (report?.skills || []).filter(item => {
    const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchSeverity = severityFilter === 'All' || item.gap_severity === severityFilter;
    return matchCategory && matchSeverity;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">Skill Gap & Role Alignment</h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            Comparing your verified skillset against market benchmarks for <span className="font-semibold text-brand-700">{profile?.target_role || 'Target Role'}</span>
          </p>
        </div>
        <Button size="sm" onClick={fetchSkillGap} icon={<Sparkles className="w-4 h-4" />}>
          Re-Analyze Gaps
        </Button>
      </div>

      {error && (
        <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-rose-400/30 bg-rose-950/30 p-4 text-sm text-rose-900 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <Button size="sm" variant="outline" onClick={fetchSkillGap}>Try again</Button>
        </div>
      )}

      {/* Top Cards: Fit Score & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col justify-between items-center text-center">
          {report ? (
            <>
              <ScoreGauge score={report.overall_fit_score} size={135} label="Overall Role Fit" />
              <div className="mt-4 text-xs text-navy-500 max-w-xs">
                Based on the skills and target role in your profile.
              </div>
            </>
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center">
              <Target className="mb-3 h-7 w-7 text-orange-300" />
              <h3 className="font-semibold text-navy-900">No role fit score yet</h3>
              <p className="mt-2 text-xs text-navy-500">Add your target role and skills to your profile.</p>
              <Link to="/settings" className="mt-4"><Button size="sm" variant="outline">Update profile</Button></Link>
            </div>
          )}
        </Card>

        {/* Category Coverage Progress Bars */}
        <Card className="p-6 lg:col-span-2 space-y-4">
          <h3 className="font-bold text-navy-900 text-sm">Competency Coverage by Domain</h3>
          <div className="space-y-3">
            {(report?.coverage_by_category || []).map((cov, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-navy-700">
                  <span>{cov.category}</span>
                  <span className="text-navy-500">{cov.current_score}% / {cov.target_score}% Target</span>
                </div>
                <div className="w-full bg-navy-100 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-brand-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${cov.current_score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-navy-400 pt-2 border-t border-navy-100">
            Note: Current proficiencies reflect observable experience from your resume; gaps indicate unproven or emerging domains.
          </p>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121814] p-4 rounded-lg border border-navy-200/80">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-navy-600">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          {['All', 'Technical', 'Tools & Frameworks', 'Domain Knowledge', 'Soft Skill'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                categoryFilter === cat
                  ? 'bg-brand-600 text-white font-semibold'
                  : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-navy-600">Severity:</span>
          {['All', 'Critical', 'Moderate', 'Minor'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                severityFilter === sev
                  ? 'bg-navy-900 text-white font-semibold'
                  : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Gap Cards List */}
      <div className="space-y-4">
        {filteredSkills.map((item, idx) => (
          <Card key={idx} className="p-5 hover:shadow-subtle transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-navy-950">{item.skill}</h4>
                  <Badge
                    variant={
                      item.gap_severity === 'Critical'
                        ? 'danger'
                        : item.gap_severity === 'Moderate'
                        ? 'warning'
                        : 'success'
                    }
                  >
                    {item.gap_severity} Gap
                  </Badge>
                  <Badge variant="outline">{item.category}</Badge>
                </div>

                <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                  <strong className="text-navy-900">Why it matters:</strong> {item.reason}
                </p>

                <div className="mt-3 p-3 bg-brand-50/50 border border-brand-100 rounded-lg text-xs text-brand-900">
                  <strong className="font-semibold text-brand-800">Action Recommendation:</strong> {item.recommendation}
                </div>
              </div>

              {/* Right Stats & Learning Resources */}
              <div className="sm:text-right flex-shrink-0 sm:min-w-[180px] space-y-2">
                <div className="text-xs font-semibold text-navy-600">
                  Estimated Study Time: <span className="font-bold text-navy-900">~{item.estimated_hours} hrs</span>
                </div>
                <div className="text-[11px] text-navy-500">
                  Current: <span className="font-medium text-navy-700">{item.current_proficiency}</span> → Required: <span className="font-medium text-brand-700">{item.required_proficiency}</span>
                </div>

                {item.learning_resources && item.learning_resources.length > 0 && (
                  <div className="pt-2 flex flex-col gap-1 sm:items-end">
                    {item.learning_resources.map((res, i) => (
                      <div key={i} className="text-[11px] text-brand-600 font-medium flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-brand-500" />
                        {res.url ? (
                          <a href={res.url} target="_blank" rel="noreferrer" className="underline hover:text-brand-800">
                            {res.title}
                          </a>
                        ) : (
                          <span>{res.title} (Recommended Search)</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recommended Capstone Projects & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended Projects */}
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <span>Recommended Portfolio Capstone Projects</span>
          </h3>
          <div className="space-y-3">
            {(report?.recommended_projects || []).map((proj, i) => (
              <div key={i} className="p-3.5 border border-navy-100 rounded-xl bg-navy-50/40">
                <div className="flex justify-between items-center text-xs font-bold text-navy-900">
                  <span>{proj.title}</span>
                  <Badge size="sm" variant={proj.complexity === 'Advanced' ? 'danger' : 'warning'}>
                    {proj.complexity}
                  </Badge>
                </div>
                <p className="text-xs text-navy-600 mt-1">{proj.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {proj.skills_targeted.map((st, j) => (
                    <span key={j} className="text-[10px] px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md font-medium">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommended Certifications */}
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Target Industry Certifications</span>
          </h3>
          <div className="space-y-3">
            {(report?.recommended_certifications || []).map((cert, i) => (
              <div key={i} className="p-3.5 border border-navy-100 rounded-xl bg-navy-50/40">
                <div className="text-xs font-bold text-navy-900">{cert.name}</div>
                <div className="text-[11px] text-navy-500 font-medium mt-0.5">{cert.issuer}</div>
                <p className="text-xs text-navy-600 mt-1">{cert.relevance}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
