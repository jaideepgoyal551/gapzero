import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { uploadResumeFile, apiRequest } from '@/lib/api';
import { ResumeAnalysis } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Target,
  ArrowRight,
  Trash2,
  Clock,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const ResumeAnalyzerPage: React.FC = () => {
  const { profile } = useAuth();
  const [targetRole, setTargetRole] = useState(profile?.target_role || '');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysis | null>(null);
  const [pastAnalyses, setPastAnalyses] = useState<ResumeAnalysis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'extracted' | 'gaps' | 'recommendations'>('overview');

  const fetchAnalyses = async () => {
    try {
      const data = await apiRequest<ResumeAnalysis[]>('/resume/analyses');
      setPastAnalyses(data || []);
      if (data && data.length > 0 && !currentAnalysis) {
        setCurrentAnalysis(data[0]);
      }
    } catch (err) {
      console.warn('Could not fetch past analyses:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ];
      const validExts = ['.pdf', '.docx', '.doc'];
      const hasValidExt = validExts.some(ext => selected.name.toLowerCase().endsWith(ext));

      if (!validTypes.includes(selected.type) && !hasValidExt) {
        setError('Unsupported format. Please upload a standard PDF (.pdf) or Word document (.docx).');
        setFile(null);
        return;
      }

      if (selected.size > 5 * 1024 * 1024) {
        setError('File exceeds 5MB size limit. Please upload a smaller resume.');
        setFile(null);
        return;
      }

      setError(null);
      setFile(selected);
    }
  };

  const handleUploadAndAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please choose a file to upload.');
      return;
    }

    setError(null);
    setUploading(true);
    setAnalysisStatus('Extracting readable text from document...');

    try {
      setTimeout(() => setAnalysisStatus('Evaluating experience relevance against target role...'), 1200);
      setTimeout(() => setAnalysisStatus('Running ATS keyword simulation and skills extraction...'), 2400);

      const result = await uploadResumeFile(file, targetRole);
      setCurrentAnalysis(result);
      setFile(null);
      await fetchAnalyses();
    } catch (err: any) {
      setError(err.message || 'Failed to process resume analysis.');
    } finally {
      setUploading(false);
      setAnalysisStatus(null);
    }
  };

  const handleDeleteAnalysis = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this analysis report?')) return;
    try {
      await apiRequest(`/resume/analyses/${id}`, { method: 'DELETE' });
      const updated = pastAnalyses.filter(a => a.id !== id);
      setPastAnalyses(updated);
      if (currentAnalysis?.id === id) {
        setCurrentAnalysis(updated[0] || null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete record.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-950 tracking-tight">AI Resume Analyzer</h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Upload your resume in PDF or DOCX format to receive an in-depth career fit score, keyword analysis, and concrete improvement steps.
        </p>
      </div>

      {/* Upload Box */}
      <Card className="p-6 border-dashed border-2 border-brand-200 bg-brand-50/20">
        <form onSubmit={handleUploadAndAnalyze} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-navy-700 mb-1">
                Target Role for Evaluation
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Full-Stack Software Engineer"
                className="w-full px-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                required
              />
            </div>

            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-navy-700 mb-1">
                Select Resume File (PDF or DOCX, max 5MB)
              </label>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                disabled={uploading}
                className="w-full text-xs text-navy-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
              />
            </div>

            <div className="sm:self-end">
              <Button type="submit" loading={uploading} disabled={!file} icon={<Sparkles className="w-4 h-4" />}>
                Analyze Resume
              </Button>
            </div>
          </div>

          {analysisStatus && (
            <div className="p-3 bg-brand-50 border border-brand-200 rounded-lg flex items-center gap-2 text-xs text-brand-800 animate-pulse">
              <Sparkles className="w-4 h-4 text-brand-600 animate-spin" />
              <span>{analysisStatus}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-[11px] text-navy-400">
            🔒 Privacy First: Your file is parsed in temporary memory and never stored permanently. Optical Character Recognition (OCR) is required if your document is an image-only scan.
          </p>
        </form>
      </Card>

      {/* Analysis Results View */}
      {currentAnalysis ? (
        <div className="space-y-6">
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Overall Profile Score</span>
                <div className="text-3xl font-bold text-navy-900 mt-1">{currentAnalysis.overall_score} / 100</div>
                <p className="text-[11px] text-navy-500 mt-1">Holistic evaluation of format, clarity & skills</p>
              </div>
              <ScoreGauge score={currentAnalysis.overall_score} size={84} strokeWidth={7} label="" sublabel="" />
            </Card>

            <Card className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">Role Fit Score</span>
                <div className="text-3xl font-bold text-brand-600 mt-1">{currentAnalysis.career_fit_score} / 100</div>
                <p className="text-[11px] text-brand-700 font-medium mt-1">Alignment with {currentAnalysis.target_role}</p>
              </div>
              <ScoreGauge score={currentAnalysis.career_fit_score} size={84} strokeWidth={7} label="" sublabel="" />
            </Card>

            <Card className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider">ATS Readiness</span>
                <div className="text-3xl font-bold text-emerald-600 mt-1">{currentAnalysis.ats_score} / 100</div>
                <p className="text-[11px] text-emerald-700 font-medium mt-1">Machine parseability & keyword density</p>
              </div>
              <ScoreGauge score={currentAnalysis.ats_score} size={84} strokeWidth={7} label="" sublabel="" />
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-navy-200 gap-6 text-sm font-medium">
            {[
              { id: 'overview', label: 'Overview & Strengths' },
              { id: 'gaps', label: 'Weaknesses & Missing Skills' },
              { id: 'extracted', label: 'Extracted Profile Data' },
              { id: 'recommendations', label: 'Actionable Next Steps' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 transition-colors border-b-2 font-semibold text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-navy-500 hover:text-navy-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4">
                <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Strongest Verified Skills</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentAnalysis.strongest_skills.map((skill, i) => (
                    <Badge key={i} variant="success">{skill}</Badge>
                  ))}
                </div>

                <div className="pt-4 border-t border-navy-100">
                  <h4 className="text-xs font-semibold text-navy-700 mb-1">Experience Relevance ({currentAnalysis.experience_relevance.score}%)</h4>
                  <p className="text-xs text-navy-600 leading-relaxed">{currentAnalysis.experience_relevance.explanation}</p>
                </div>

                <div className="pt-4 border-t border-navy-100">
                  <h4 className="text-xs font-semibold text-navy-700 mb-1">Project Relevance ({currentAnalysis.project_relevance.score}%)</h4>
                  <p className="text-xs text-navy-600 leading-relaxed">{currentAnalysis.project_relevance.explanation}</p>
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600" />
                  <span>Scoring Rationale & Evidence</span>
                </h3>

                <div className="space-y-3 text-xs text-navy-600">
                  <div className="p-3 bg-navy-50/70 rounded-lg">
                    <strong className="text-navy-900 block mb-0.5">Overall Score Rationale:</strong>
                    {currentAnalysis.scoring_rationale.overall_explanation}
                  </div>
                  <div className="p-3 bg-navy-50/70 rounded-lg">
                    <strong className="text-navy-900 block mb-0.5">Career Fit Rationale:</strong>
                    {currentAnalysis.scoring_rationale.fit_explanation}
                  </div>
                  <div className="p-3 bg-navy-50/70 rounded-lg">
                    <strong className="text-navy-900 block mb-0.5">ATS Readiness Rationale:</strong>
                    {currentAnalysis.scoring_rationale.ats_explanation}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: Missing Skills & Weaknesses */}
          {activeTab === 'gaps' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Missing Technical Competencies for {currentAnalysis.target_role}</span>
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentAnalysis.missing_skills.map((skill, i) => (
                    <Badge key={i} variant="danger">{skill}</Badge>
                  ))}
                </div>
                <p className="text-xs text-navy-500">
                  These technologies and concepts are standard prerequisites for this role in competitive hiring markets.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Important Resume Weaknesses</span>
                </h3>
                <ul className="space-y-2 text-xs text-navy-600">
                  {currentAnalysis.important_weaknesses.map((weakness, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}

          {/* TAB 3: Extracted Profile Data */}
          {activeTab === 'extracted' && (
            <Card className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-2">Professional Summary</h4>
                <p className="text-xs text-navy-700 bg-navy-50 p-3 rounded-lg leading-relaxed">
                  {currentAnalysis.extracted_data.summary || 'No explicit summary section detected in document.'}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-2">Technical Skills Extracted</h4>
                <div className="flex flex-wrap gap-2">
                  {currentAnalysis.extracted_data.technical_skills.map((s, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-navy-100 text-navy-800 rounded-md font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-2">Work Experience</h4>
                <div className="space-y-4">
                  {currentAnalysis.extracted_data.work_experience.map((exp, i) => (
                    <div key={i} className="p-3 border border-navy-100 rounded-lg">
                      <div className="flex justify-between items-center text-xs font-bold text-navy-900">
                        <span>{exp.title} — {exp.company}</span>
                        <span className="text-navy-400 font-normal">{exp.duration}</span>
                      </div>
                      <ul className="mt-2 space-y-1 text-xs text-navy-600 list-disc list-inside">
                        {exp.highlights.map((h, j) => (
                          <li key={j}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* TAB 4: Actionable Recommendations */}
          {activeTab === 'recommendations' && (
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-navy-900 text-sm mb-3">Recommended Resume Improvements</h3>
                <div className="space-y-2">
                  {currentAnalysis.recommended_improvements.map((rec, i) => (
                    <div key={i} className="p-3 bg-brand-50/50 border border-brand-100 rounded-lg text-xs text-brand-900 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-navy-900 text-sm mb-3">Suggested Next Steps</h3>
                <div className="space-y-2">
                  {currentAnalysis.suggested_next_steps.map((step, i) => (
                    <div key={i} className="p-3 bg-navy-50 border border-navy-100 rounded-lg text-xs text-navy-800 flex items-start gap-2.5">
                      <ArrowRight className="w-4 h-4 text-navy-500 flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-navy-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-navy-900">No Resume Analyses Yet</h3>
          <p className="text-xs text-navy-500 mt-1 max-w-sm mx-auto">
            Upload your resume above to extract skills and evaluate your career fit score.
          </p>
        </Card>
      )}

      {/* Past Analyses Table */}
      {pastAnalyses.length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold text-navy-900 text-sm mb-4">Past Resume Analyses</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-navy-50 text-navy-500 uppercase font-semibold border-b border-navy-200">
                <tr>
                  <th className="py-2.5 px-3">Filename</th>
                  <th className="py-2.5 px-3">Target Role</th>
                  <th className="py-2.5 px-3">Overall Score</th>
                  <th className="py-2.5 px-3">Fit Score</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 text-navy-700">
                {pastAnalyses.map(a => (
                  <tr key={a.id} className="hover:bg-navy-50/50">
                    <td className="py-3 px-3 font-semibold text-navy-900">{a.filename}</td>
                    <td className="py-3 px-3">{a.target_role}</td>
                    <td className="py-3 px-3 font-bold text-brand-600">{a.overall_score}%</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">{a.career_fit_score}%</td>
                    <td className="py-3 px-3 text-navy-400">{new Date(a.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => setCurrentAnalysis(a)}>
                        View Report
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteAnalysis(a.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
