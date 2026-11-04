import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { ATSOptimizationResult } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  ArrowRight,
  ListChecks,
} from 'lucide-react';

export const ATSOptimizerPage: React.FC = () => {
  const { profile } = useAuth();
  const [targetTitle, setTargetTitle] = useState(profile?.target_role || '');
  const [jobDescription, setJobDescription] = useState('');
  const [customResumeText, setCustomResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSOptimizationResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunOptimization = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await apiRequest<ATSOptimizationResult>('/ats/optimize', {
        method: 'POST',
        body: JSON.stringify({
          target_job_title: targetTitle,
          job_description: jobDescription,
          custom_resume_text: customResumeText,
        }),
      });
      setResult(data);
    } catch (err: any) {
      alert(err.message || 'Failed to optimize ATS resume.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRunOptimization();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-950 tracking-tight">ATS Resume Optimizer</h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Simulate applicant tracking system parsing, identify missing keywords, and transform passive bullet points into quantified Google X-Y-Z achievements.
        </p>
      </div>

      {/* Input Parameters Box */}
      <Card className="p-6">
        <form onSubmit={handleRunOptimization} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Target Job Title</label>
              <input
                type="text"
                value={targetTitle}
                onChange={e => setTargetTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Optional Specific Job Description</label>
              <textarea
                rows={2}
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the job posting description here to match specific employer keywords..."
                className="w-full px-3 py-1.5 text-xs border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-navy-100">
            <span className="text-[11px] text-navy-500">
              Uses your latest uploaded resume by default.
            </span>
            <Button type="submit" size="sm" loading={loading} icon={<Sparkles className="w-4 h-4" />}>
              Run ATS Simulation
            </Button>
          </div>
        </form>
      </Card>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Estimated Score & Keyword Health */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Estimated ATS Match</span>
                <div className="text-3xl font-bold text-emerald-600 mt-1">{result.estimated_match_score}%</div>
                <p className="text-[11px] text-navy-400 mt-1">Simulated parser match (not actual recruiter software)</p>
              </div>
              <ScoreGauge score={result.estimated_match_score} size={84} strokeWidth={7} label="" sublabel="" />
            </Card>

            <Card className="p-5 md:col-span-2 space-y-3">
              <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">High-Priority Keywords</span>
              <div className="flex flex-wrap gap-2">
                {result.target_keywords.map((kw, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border ${
                      kw.present
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {kw.present ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{kw.keyword}</span>
                    {kw.present && <span className="text-[10px] opacity-75">({kw.frequency}x)</span>}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Missing Keywords Alert */}
          {result.missing_keywords.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Missing High-Impact ATS Keywords</h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Consider integrating these terms into your skills and work highlights:
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {result.missing_keywords.map((m, i) => (
                    <Badge key={i} variant="warning">{m}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Improved Summary */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>ATS-Optimized Professional Summary</span>
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(result.improved_summary, 'summary')}
                icon={copiedKey === 'summary' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedKey === 'summary' ? 'Copied' : 'Copy Summary'}
              </Button>
            </div>
            <p className="text-xs text-navy-800 bg-navy-50/70 p-4 rounded-xl leading-relaxed border border-navy-100">
              {result.improved_summary}
            </p>
          </Card>

          {/* Google X-Y-Z Bullet Point Improvements */}
          <Card className="p-6 space-y-4">
            <div className="border-b border-navy-100 pb-3">
              <h3 className="font-bold text-navy-900 text-sm">Google X-Y-Z Achievement Bullet Point Rewrites</h3>
              <p className="text-xs text-navy-500 mt-0.5">
                "Accomplished [X] as measured by [Y], by doing [Z]" — Quantified with realistic impacts.
              </p>
            </div>

            <div className="space-y-4">
              {result.bullet_point_improvements.map((bullet, i) => (
                <div key={i} className="p-4 border border-navy-100 rounded-xl bg-navy-50/40 space-y-2">
                  {bullet.original && (
                    <div className="text-xs text-rose-700">
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Original (Passive):</span>
                      <p className="line-through mt-0.5">{bullet.original}</p>
                    </div>
                  )}

                  <div className="text-xs text-navy-900 bg-[#121814] p-3 rounded-md border border-navy-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-emerald-700 uppercase tracking-wider text-[10px]">Recommended Rewrite:</span>
                      <button
                        onClick={() => handleCopy(bullet.improved, `bullet-${i}`)}
                        className="text-xs text-brand-600 hover:text-brand-800 flex items-center gap-1 font-medium"
                      >
                        {copiedKey === `bullet-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === `bullet-${i}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="font-medium text-navy-900">{bullet.improved}</p>
                  </div>

                  <div className="text-[11px] text-navy-500 italic">
                    Rationale: {bullet.rationale}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actionable ATS Checklist */}
          <Card className="p-6">
            <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2 mb-4">
              <ListChecks className="w-4 h-4 text-brand-600" />
              <span>ATS Formatting & Readability Checklist</span>
            </h3>
            <div className="space-y-2.5">
              {result.actionable_checklist.map((chk, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-navy-50/60 border border-navy-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 ${chk.completed ? 'text-emerald-600' : 'text-navy-300'}`} />
                    <span className={chk.completed ? 'text-navy-500 line-through' : 'text-navy-800 font-medium'}>
                      {chk.task}
                    </span>
                  </div>
                  <Badge size="sm" variant={chk.impact === 'High' ? 'danger' : 'default'}>
                    {chk.impact} Impact
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
