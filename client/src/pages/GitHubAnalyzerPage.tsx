import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { GitHubPortfolioAnalysis } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Github,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Star,
  GitFork,
  ExternalLink,
  Code2,
} from 'lucide-react';

export const GitHubAnalyzerPage: React.FC = () => {
  const { profile } = useAuth();
  const [usernameInput, setUsernameInput] = useState(profile?.github_url || 'torvalds');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<GitHubPortfolioAnalysis | null>(null);

  const fetchLatestAnalysis = async () => {
    try {
      const data = await apiRequest<GitHubPortfolioAnalysis>('/github/latest');
      if (data) {
        setAnalysis(data);
      }
    } catch (err) {
      console.warn('Could not load latest GitHub analysis:', err);
    }
  };

  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  const handleAnalyzeGitHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setLoading(true);
    try {
      const data = await apiRequest<GitHubPortfolioAnalysis>('/github/analyze', {
        method: 'POST',
        body: JSON.stringify({ username: usernameInput }),
      });
      setAnalysis(data);
    } catch (err: any) {
      alert(err.message || 'Failed to analyze GitHub portfolio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-950 tracking-tight">GitHub Portfolio Analyzer</h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Inspect public repositories, language distribution, and README documentation quality to verify real-world implementation depth.
        </p>
      </div>

      {/* Input Box */}
      <Card className="p-6">
        <form onSubmit={handleAnalyzeGitHub} className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Github className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
            <input
              type="text"
              value={usernameInput}
              onChange={e => setUsernameInput(e.target.value)}
              placeholder="Enter GitHub username or URL (e.g. torvalds or https://github.com/...)"
              className="w-full pl-9 pr-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>
          <Button type="submit" loading={loading} icon={<Code2 className="w-4 h-4" />}>
            Inspect Public Repositories
          </Button>
        </form>
      </Card>

      {/* Analysis Content */}
      {analysis && (
        <div className="space-y-6">
          {/* Profile Overview Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 flex items-center gap-4">
              {analysis.profile_summary.avatar_url && (
                <img
                  src={analysis.profile_summary.avatar_url}
                  alt={analysis.username}
                  className="w-16 h-16 rounded-full border border-navy-200 shadow-xs"
                />
              )}
              <div>
                <h3 className="text-base font-bold text-navy-950">{analysis.profile_summary.name || analysis.username}</h3>
                <p className="text-xs text-navy-500">@{analysis.username}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-navy-600">
                  <span><strong>{analysis.profile_summary.public_repos}</strong> repos</span>
                  <span><strong>{analysis.profile_summary.followers}</strong> followers</span>
                </div>
              </div>
            </Card>

            <Card className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Role Alignment</span>
                <div className="text-3xl font-bold text-brand-600 mt-1">{analysis.role_alignment_score}%</div>
                <p className="text-[11px] text-navy-400 mt-1">Language & project alignment for target role</p>
              </div>
              <ScoreGauge score={analysis.role_alignment_score} size={84} strokeWidth={7} label="" sublabel="" />
            </Card>

            <Card className="p-5 space-y-2">
              <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Observed Languages</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Object.entries(analysis.language_distribution).map(([lang, count]) => (
                  <Badge key={lang} variant="default" size="sm">
                    {lang} ({count})
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Observed Repositories */}
          <Card className="p-6">
            <h3 className="font-bold text-navy-900 text-sm mb-4">Observed Public Repositories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {analysis.analyzed_repositories.map((repo, i) => (
                <div key={i} className="p-4 border border-navy-100 rounded-xl bg-navy-50/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <a
                        href={`https://github.com/${analysis.username}/${repo.name}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-navy-900 text-xs hover:text-brand-600 flex items-center gap-1"
                      >
                        <span>{repo.name}</span>
                        <ExternalLink className="w-3 h-3 text-navy-400" />
                      </a>
                      <div className="flex items-center gap-2 text-xs text-navy-500">
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{repo.stars}</span>
                        </span>
                        <span className="flex items-center gap-0.5">
                          <GitFork className="w-3 h-3" />
                          <span>{repo.forks}</span>
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-navy-600 mt-1 line-clamp-2">{repo.description}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-navy-100 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-navy-700">{repo.language}</span>
                    <Badge size="sm" variant={repo.has_readme ? 'success' : 'danger'}>
                      {repo.has_readme ? 'README Present' : 'Missing README'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Strengths & Documentation Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Portfolio Strengths</span>
              </h3>
              <ul className="space-y-2 text-xs text-navy-700">
                {analysis.portfolio_strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 space-y-3">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Documentation Gaps & Suggestions</span>
              </h3>
              <ul className="space-y-2 text-xs text-navy-700">
                {analysis.documentation_gaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
                {analysis.project_improvement_suggestions.map((sug, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Recommended Next Projects */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Recommended Next Repositories to Build</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.recommended_next_projects.map((proj, i) => (
                <div key={i} className="p-4 border border-navy-100 rounded-xl bg-navy-50/30 space-y-2">
                  <h4 className="text-xs font-bold text-navy-900">{proj.title}</h4>
                  <p className="text-xs text-navy-600">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.tech_stack.map((ts, j) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-medium">
                        {ts}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
