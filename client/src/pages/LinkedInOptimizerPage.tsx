import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { LinkedInOptimization } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Linkedin,
  Copy,
  Check,
  Sparkles,
  Users,
  Key,
  Award,
} from 'lucide-react';

export const LinkedInOptimizerPage: React.FC = () => {
  const { profile } = useAuth();
  const [targetRole, setTargetRole] = useState(profile?.target_role || 'Full-Stack Software Engineer');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LinkedInOptimization | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchOptimization = async () => {
    try {
      const existing = await apiRequest<LinkedInOptimization>('/linkedin/latest');
      if (existing) {
        setData(existing);
      } else {
        await handleGenerate();
      }
    } catch (err) {
      console.warn('Could not load LinkedIn analysis:', err);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<LinkedInOptimization>('/linkedin/analyze', {
        method: 'POST',
        body: JSON.stringify({ target_role: targetRole }),
      });
      setData(res);
    } catch (err: any) {
      alert(err.message || 'Failed to generate LinkedIn optimizations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptimization();
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">LinkedIn Profile Optimizer</h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            Recruiter-friendly headline styles, compelling narrative About sections, and targeted search keywords.
          </p>
        </div>
        <Button size="sm" onClick={handleGenerate} loading={loading} icon={<Sparkles className="w-4 h-4" />}>
          Generate Fresh Optimizations
        </Button>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Headlines Options */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-blue-600" />
              <span>Recommended Headline Styles (Tailored for {data.target_role})</span>
            </h3>

            <div className="space-y-3">
              {data.headline_suggestions.map((hl, i) => (
                <div
                  key={i}
                  className="p-3.5 border border-navy-100 rounded-xl bg-navy-50/40 flex items-center justify-between gap-4"
                >
                  <p className="text-xs font-semibold text-navy-900">{hl}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(hl, `hl-${i}`)}
                    icon={copiedKey === `hl-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedKey === `hl-${i}` ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Narrative About Section */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Storytelling About Section</span>
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(data.improved_about, 'about')}
                icon={copiedKey === 'about' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedKey === 'about' ? 'Copied' : 'Copy About'}
              </Button>
            </div>
            <div className="p-4 bg-navy-50/70 border border-navy-100 rounded-xl text-xs text-navy-800 leading-relaxed whitespace-pre-wrap">
              {data.improved_about}
            </div>
          </Card>

          {/* Recruiter Search Keywords & Recommended Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-600" />
                <span>High-Volume Recruiter Keywords</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.relevant_keywords.map((kw, i) => (
                  <Badge key={i} variant="default">{kw}</Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Featured Skills to Pin on Profile</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.recommended_skills.map((sk, i) => (
                  <Badge key={i} variant="purple">{sk}</Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Networking & Thought Leadership Strategy */}
          <Card className="p-6 space-y-3">
            <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-600" />
              <span>Networking & Profile Engagement Strategy</span>
            </h3>
            <div className="space-y-2">
              {data.networking_and_content_strategy.map((item, i) => (
                <div key={i} className="p-3 bg-brand-50/40 border border-brand-100 rounded-lg text-xs text-brand-950 flex items-start gap-2.5">
                  <span className="text-brand-600 font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
