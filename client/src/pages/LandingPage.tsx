import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  DollarSign,
  FileText,
  Github,
  Linkedin,
  Lock,
  Map,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';

const tools = [
  {
    icon: FileText,
    title: 'Resume Analyzer',
    description: 'Understand what your resume communicates and where it can be clearer.',
    path: '/resume-analyzer',
    label: '01 / PROFILE',
  },
  {
    icon: Target,
    title: 'Skill Gap Detection',
    description: 'See how your current skills line up with the role you want.',
    path: '/skill-gap',
    label: '02 / INSIGHTS',
  },
  {
    icon: Map,
    title: 'Career Roadmap',
    description: 'Turn your next career move into focused, manageable actions.',
    path: '/career-roadmap',
    label: '03 / ACTION',
  },
  {
    icon: Sparkles,
    title: 'ATS Resume Optimizer',
    description: 'Refine your resume language for the opportunities you care about.',
    path: '/ats-optimizer',
    label: '04 / REFINE',
  },
  {
    icon: MessageSquare,
    title: 'AI Career Coach',
    description: 'Think through interviews, learning plans, and career decisions.',
    path: '/career-coach',
    label: '05 / COACH',
  },
  {
    icon: Briefcase,
    title: 'Job Matcher',
    description: 'Compare your background with a job description you provide.',
    path: '/job-matcher',
    label: '06 / EXPLORE',
  },
  {
    icon: Github,
    title: 'GitHub Portfolio',
    description: 'Review your public projects and identify ways to improve your portfolio.',
    path: '/github-analyzer',
    label: '07 / PROJECTS',
  },
  {
    icon: Linkedin,
    title: 'LinkedIn Optimizer',
    description: 'Make your professional profile easier to find and understand.',
    path: '/linkedin-optimizer',
    label: '08 / PRESENCE',
  },
  {
    icon: DollarSign,
    title: 'Salary Insights',
    description: 'Explore compensation ranges by role, location, and experience.',
    path: '/salary-insights',
    label: '09 / RESEARCH',
  },
];

const journey = [
  {
    icon: FileText,
    title: 'Add your experience',
    description: 'Start with your resume or enter the skills you already use.',
  },
  {
    icon: Target,
    title: 'Choose a direction',
    description: 'Set a target role that reflects where you want to go next.',
  },
  {
    icon: Map,
    title: 'Make a practical plan',
    description: 'Use your insights to decide what to work on next.',
  },
];

export const LandingPage: React.FC = () => {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async () => {
    await loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute inset-0 landing-grid opacity-50" />
          <div className="pointer-events-none absolute -right-32 top-12 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-28">
            <div className="animate-fade-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                A clearer path to your next role
              </div>

              <h1 className="max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight text-navy-950 sm:text-5xl lg:text-6xl">
                Build your skills.
                <br />
                <span className="text-emerald-400">Move your career forward.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-500 sm:text-lg">
                Bring your resume, skills, and goals together. Get useful insights and a practical plan for what comes next.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to={user ? '/dashboard' : '/register'}>
                  <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-500 focus:ring-emerald-400 sm:w-auto" icon={<ArrowRight className="h-4 w-4" />}>
                    Start your career plan
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Explore the tools
                  </Button>
                </a>
              </div>

              {!user && (
                <button
                  type="button"
                  onClick={handleDemo}
                  className="mt-5 inline-flex items-center gap-2 text-sm text-navy-500 hover:text-emerald-300"
                >
                  Explore a demo profile <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="animate-fade-up lg:pl-3" style={{ animationDelay: '120ms' }}>
              <div className="glass-panel overflow-hidden rounded-2xl border border-white/10 shadow-card">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5" aria-hidden="true">
                      <span className="h-2 w-2 rounded-full bg-rose-400/80" />
                      <span className="h-2 w-2 rounded-full bg-orange-400/80" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="text-xs text-navy-500">YOUR CAREER WORKSPACE</span>
                  </div>
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                </div>

                <div className="p-5 sm:p-7">
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-400">From profile to progress</p>
                    <h2 className="mt-2 text-xl font-bold text-navy-950 sm:text-2xl">A plan built around you.</h2>
                    <p className="mt-2 text-sm text-navy-500">Your information shapes the recommendations you see.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { icon: FileText, title: 'Your experience', detail: 'Resume and skills', status: 'YOUR INPUT' },
                      { icon: Target, title: 'Your direction', detail: 'Target role and goals', status: 'YOUR FOCUS' },
                      { icon: Map, title: 'Your next steps', detail: 'Insights and roadmap', status: 'YOUR PLAN' },
                    ].map(({ icon: Icon, title, detail, status }, index) => (
                      <div key={title} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3.5 sm:gap-4 sm:p-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${index === 2 ? 'bg-emerald-400/10 text-emerald-300' : 'bg-brand-50 text-orange-300'}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-navy-900">{title}</p>
                          <p className="mt-0.5 text-xs text-navy-500">{detail}</p>
                        </div>
                        <span className={`hidden text-[10px] font-semibold tracking-wider sm:block ${index === 2 ? 'text-emerald-400' : 'text-navy-400'}`}>
                          {status}
                        </span>
                        {index === 2 && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 sm:hidden" />}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-navy-500">
                    <Lock className="h-3.5 w-3.5 text-emerald-400" />
                    <span>You choose what to add and what to work on.</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-[11px] text-navy-400">A simple workspace for your real goals and experience.</p>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-white/[0.025]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 text-xs text-navy-500 sm:px-6 lg:justify-between lg:px-8">
            <span className="font-semibold uppercase tracking-[0.14em] text-navy-400">Your career toolkit</span>
            <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-emerald-400" /> Resume</span>
            <span className="inline-flex items-center gap-2"><Target className="h-4 w-4 text-emerald-400" /> Skills</span>
            <span className="inline-flex items-center gap-2"><Briefcase className="h-4 w-4 text-emerald-400" /> Opportunities</span>
            <span className="inline-flex items-center gap-2"><Map className="h-4 w-4 text-emerald-400" /> Roadmap</span>
            <span className="inline-flex items-center gap-2"><MessageSquare className="h-4 w-4 text-emerald-400" /> Coaching</span>
          </div>
        </section>

        <section id="how-it-works" className="border-b border-white/10 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-400">A straightforward process</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-navy-950 sm:text-4xl">Make your next move feel manageable.</h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-navy-500 sm:text-base">
                  Start with what you have. GapZero helps organize your goals into a clearer direction and useful next actions.
                </p>
                <Link to={user ? '/dashboard' : '/register'} className="mt-6 inline-flex">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 focus:ring-emerald-400" icon={<ArrowRight className="h-4 w-4" />}>
                    Get started
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {journey.map(({ icon: Icon, title, description }, index) => (
                  <div key={title} className="glass-panel flex items-start gap-4 rounded-2xl p-5 sm:p-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400">STEP / 0{index + 1}</span>
                      <h3 className="mt-1 font-bold text-navy-900">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-navy-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-b border-white/10 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-400">One connected toolkit</p>
                <h2 className="mt-3 text-3xl font-bold text-navy-950 sm:text-4xl">Everything for your next career step.</h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-navy-500">Choose what you need now. Your tools are ready when your goals are.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map(({ icon: Icon, title, description, path, label }) => (
                <Link
                  key={title}
                  to={path}
                  className="glass-panel group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:shadow-card sm:p-6"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300 transition-colors group-hover:bg-emerald-400/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider text-navy-400">{label}</span>
                  </div>
                  <h3 className="font-bold text-navy-900">{title}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-relaxed text-navy-500">{description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    Explore tool <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="trust-privacy" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="glass-panel grid gap-8 rounded-3xl p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
              <div className="max-w-2xl">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-400">Your profile. Your direction.</p>
                <h2 className="mt-3 text-2xl font-bold text-navy-950 sm:text-3xl">Career progress should feel personal.</h2>
                <p className="mt-3 text-sm leading-relaxed text-navy-500">
                  Add the details that matter to you, revisit your goals, and manage your profile and data from your settings.
                </p>
              </div>
              <Link to={user ? '/settings' : '/register'}>
                <Button variant="outline" className="w-full border-emerald-400/30 text-emerald-300 hover:bg-emerald-400/10 sm:w-auto" icon={<ArrowRight className="h-4 w-4" />}>
                  {user ? 'Manage your profile' : 'Create your profile'}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-white/[0.025] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-navy-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-orange-500 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            GapZero
          </Link>
          <p className="text-xs text-navy-500">A clearer path to your next career move.</p>
          <div className="flex items-center gap-5 text-xs text-navy-500">
            <Link to="/settings" className="hover:text-emerald-300">Privacy & settings</Link>
            <a href="https://github.com/jaideepgoyal551/gapzero" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-emerald-300">
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
