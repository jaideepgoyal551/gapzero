import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/context/AuthContext';
import {
  FileText,
  Target,
  Sparkles,
  Map,
  MessageSquare,
  Briefcase,
  Github,
  Linkedin,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Layers,
  Lock,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async () => {
    await loginDemo();
    navigate('/dashboard');
  };

  const featureCards = [
    {
      icon: FileText,
      title: 'AI Resume Analyzer',
      description: 'Parses PDF & DOCX resumes to extract verified skills, evaluate work experience relevance, and identify critical weaknesses.',
      tag: 'Core Intelligence',
    },
    {
      icon: Target,
      title: 'Career Fit Analysis',
      description: 'Calculates an objective match score against standard market expectations for your target role with evidentiary explanations.',
      tag: 'Benchmarking',
    },
    {
      icon: Layers,
      title: 'Skill Gap Detection',
      description: 'Pinpoints missing technical, architectural, and soft skills with severity ratings (Critical, Moderate, Minor) and estimated hours to bridge.',
      tag: 'Gap Mapping',
    },
    {
      icon: Sparkles,
      title: 'ATS Resume Optimizer',
      description: 'Estimates ATS keyword density and rewrites weak bullet points into high-impact Google X-Y-Z achievement statements.',
      tag: 'Recruiter Screening',
    },
    {
      icon: Linkedin,
      title: 'LinkedIn Profile Optimizer',
      description: 'Generates role-tailored headlines, engaging About sections, and recruiter search keywords to elevate your professional presence.',
      tag: 'Personal Brand',
    },
    {
      icon: Map,
      title: 'Personalized Career Roadmap',
      description: 'Generates structured 30-day, 90-day, and 12-month action plans with priority filters, verified learning resources, and progress tracking.',
      tag: 'Actionable Steps',
    },
    {
      icon: MessageSquare,
      title: 'AI Career Coach',
      description: 'A dedicated conversational mentor with continuous context of your career profile, assisting with interview prep and technical planning.',
      tag: 'Interactive Mentor',
    },
    {
      icon: Github,
      title: 'GitHub Portfolio Analyzer',
      description: 'Inspects your public repositories, languages, and documentation quality to highlight engineering strengths and next recommended builds.',
      tag: 'Code Evidence',
    },
    {
      icon: DollarSign,
      title: 'Salary Insights',
      description: 'Verifiable compensation ranges derived from official statistical bureau data (BLS, ONS) and industry surveys with transparent disclosures.',
      tag: 'Market Benchmarks',
    },
    {
      icon: Briefcase,
      title: 'Job Description Matcher',
      description: 'Paste any job posting to evaluate requirement alignment, discover missing qualifications, and receive tailored interview prep tasks.',
      tag: 'Targeted Prep',
    },
  ];

  const problemSolutions = [
    {
      problem: 'Unclear Career Direction',
      problemDesc: 'Students and engineers guess which technologies to study next without reliable data.',
      solution: 'GapZero analyzes your target role requirements and charts a verified 3-phase progression path.',
    },
    {
      problem: 'Missing Technical Competencies',
      problemDesc: 'Failing technical screenings because critical backend, database, or system design skills were overlooked.',
      solution: 'Automated skill gap detection categorizes gaps by severity and estimates study hours required.',
    },
    {
      problem: 'Silent Resume Rejections & ATS Filters',
      problemDesc: 'Unreadable layouts and missing keywords cause automated tracking systems to discard qualified applicants.',
      solution: 'ATS optimizer scans keyword density and rewrites passive bullets into quantified accomplishments.',
    },
    {
      problem: 'Lack of Structured Learning Discipline',
      problemDesc: 'Tutorial purgatory: starting random courses without building tangible production evidence.',
      solution: 'Interactive 30-day, 90-day, and 12-month roadmaps with trackable tasks and capstone project prompts.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-navy-100">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/80 mb-6 shadow-subtle">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Generation Career Intelligence Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-navy-950 tracking-tight leading-[1.15]">
              Stop Guessing. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-violet-600">
                Start Growing Your Career.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-navy-600 font-normal leading-relaxed">
              Discover your skill gaps, optimize your resume, and build a personalized roadmap to your dream role with AI-powered career intelligence.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={user ? '/dashboard' : '/register'}>
                <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Analyze My Career
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </a>
              <Button variant="ghost" size="lg" onClick={handleDemo}>
                Try Demo Profile
              </Button>
            </div>

            <p className="mt-3 text-xs text-navy-500">
              Free to start • No credit card required • Private & secure file processing
            </p>
          </div>

          {/* Interactive Dashboard Preview */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="p-3 bg-white/60 border border-navy-200/80 rounded-2xl shadow-card backdrop-blur-md">
              <div className="bg-white rounded-xl border border-navy-100 p-6 sm:p-8">
                {/* Dashboard Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-navy-100 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
                      Live Assessment Snapshot
                    </span>
                    <h3 className="text-xl font-bold text-navy-900 mt-0.5">
                      Target Role: Senior Full-Stack Engineer
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="purple">Claude 3.5 Verified</Badge>
                    <Badge variant="success">Profile Active</Badge>
                  </div>
                </div>

                {/* Dashboard Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Gauge Card */}
                  <div className="flex flex-col items-center justify-center p-4 bg-navy-50/50 rounded-xl border border-navy-100">
                    <ScoreGauge score={78} size={120} label="Career Fit" sublabel="Strong Foundation" />
                  </div>

                  {/* Skill Gap Summary */}
                  <div className="p-4 bg-white rounded-xl border border-navy-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-navy-500 uppercase">Skill Gap Summary</span>
                        <Target className="w-4 h-4 text-brand-600" />
                      </div>
                      <div className="mt-2 text-2xl font-bold text-navy-900">3 Critical Gaps</div>
                      <p className="text-xs text-navy-600 mt-1">PostgreSQL Indexing, Docker, System Design</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-navy-100">
                      <span className="text-[11px] text-amber-700 font-medium">Estimated bridge time: ~80 hrs</span>
                    </div>
                  </div>

                  {/* Resume ATS Score */}
                  <div className="p-4 bg-white rounded-xl border border-navy-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-navy-500 uppercase">Resume ATS Score</span>
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="mt-2 text-2xl font-bold text-emerald-600">82 / 100</div>
                      <p className="text-xs text-navy-600 mt-1">6/8 High-Priority Keywords Present</p>
                    </div>
                    <div className="mt-4">
                      <ProgressBar value={82} color="emerald" size="sm" showPercent />
                    </div>
                  </div>

                  {/* Roadmap Progress */}
                  <div className="p-4 bg-white rounded-xl border border-navy-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-navy-500 uppercase">Roadmap Progress</span>
                        <Map className="w-4 h-4 text-violet-600" />
                      </div>
                      <div className="mt-2 text-2xl font-bold text-navy-900">4 / 8 Tasks</div>
                      <p className="text-xs text-navy-600 mt-1">30-Day Milestone in progress</p>
                    </div>
                    <div className="mt-4">
                      <ProgressBar value={50} color="brand" size="sm" showPercent />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 bg-white border-b border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              The Modern Job Market Challenge
            </h2>
            <h3 className="text-3xl font-bold text-navy-950 mt-2">
              Why Traditional Job Hunting Leaves Candidates Stuck
            </h3>
            <p className="text-navy-600 mt-3 text-sm">
              Applying to hundreds of jobs with generic resumes and vague study routines leads to burnout. Here is how GapZero changes the equation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {problemSolutions.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-navy-50/50 border border-navy-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>The Challenge: {item.problem}</span>
                  </div>
                  <p className="text-sm text-navy-600">{item.problemDesc}</p>
                </div>

                <div className="mt-6 pt-5 border-t border-navy-200/60">
                  <div className="flex items-center gap-2 text-brand-700 font-semibold text-sm mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>GapZero Solution</span>
                  </div>
                  <p className="text-sm text-navy-800 font-medium">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 Feature Cards Section */}
      <section id="features" className="py-20 bg-[#F8FAFC] border-b border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Comprehensive Toolkit
            </h2>
            <h3 className="text-3xl font-bold text-navy-950 mt-2">
              Everything You Need to Advance Your Career
            </h3>
            <p className="text-navy-600 mt-3 text-sm">
              Ten modular intelligence engines designed to give you clarity, concrete skills, and interview readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Card key={idx} hoverEffect className="flex flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="outline" size="sm">{feat.tag}</Badge>
                    </div>
                    <h4 className="text-base font-bold text-navy-900">{feat.title}</h4>
                    <p className="text-sm text-navy-600 mt-2 leading-relaxed">{feat.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-b border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Simple 4-Step Process
            </h2>
            <h3 className="text-3xl font-bold text-navy-950 mt-2">
              How GapZero Accelerates Your Journey
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Upload Resume', desc: 'Securely upload your PDF or DOCX resume. We safely extract text in-memory.' },
              { step: '02', title: 'Define Target Role', desc: 'Specify your dream job, target companies, and weekly learning availability.' },
              { step: '03', title: 'AI Analysis', desc: 'Claude analyzes skills, scores career fit, and flags critical technical gaps.' },
              { step: '04', title: 'Execute Roadmap', desc: 'Follow structured 30/90/365-day tasks, practice with AI Coach, and get hired.' },
            ].map((st, i) => (
              <div key={i} className="relative p-6 rounded-xl bg-navy-50/50 border border-navy-100">
                <span className="text-3xl font-extrabold text-brand-200">{st.step}</span>
                <h4 className="text-base font-bold text-navy-900 mt-3">{st.title}</h4>
                <p className="text-xs text-navy-600 mt-2 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section id="trust-privacy" className="py-20 bg-[#F8FAFC] border-b border-navy-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 bg-white rounded-2xl border border-navy-200/80 shadow-subtle">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy-950">Data Trust & User Privacy Commitments</h3>
                <p className="text-xs text-navy-500">Transparent data practices without unsupported marketing hype</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-navy-700 mt-6 leading-relaxed">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-navy-900">In-Memory Resume Processing:</strong> Uploaded documents are parsed in temporary memory solely to extract structural skills and experience. We never sell candidate resumes or use your personal career data for model training.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-navy-900">Row-Level Security (RLS) Isolation:</strong> Every record in Supabase is protected by cryptographic user-id policies. No other user or unauthorized third party can view your analyses.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-navy-900">One-Click Permanent Deletion:</strong> You retain complete ownership. You can permanently delete your account, resume records, and chat transcripts with a single click from the Settings panel at any time.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-navy-900">Clear Statistical Disclosures:</strong> Salary insights and ATS match scores are presented as structured estimates and benchmark distributions from verifiable bureaus (such as BLS), rather than fabricated guarantees.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-900 via-navy-900 to-navy-950 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Bridge Your Career Gaps?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-brand-200 max-w-2xl mx-auto">
            Join thousands of ambitious engineers and graduates who use GapZero to optimize their resumes and land their target roles.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={user ? '/dashboard' : '/register'}>
              <Button size="lg" className="bg-white text-navy-900 hover:bg-navy-50 font-semibold">
                Get Started with GapZero
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={handleDemo} className="border-white/20 text-white hover:bg-white/10">
              Explore Demo Profile
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-navy-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-navy-900">GapZero</span>
            <span className="text-xs text-navy-400">© 2026 GapZero Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-navy-600">
            <Link to="/settings" className="hover:text-brand-600">Privacy Policy</Link>
            <Link to="/settings" className="hover:text-brand-600">Terms of Service</Link>
            <a href="https://github.com/jaideepgoyal551/gapzero" target="_blank" rel="noreferrer" className="hover:text-brand-600 flex items-center gap-1">
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
