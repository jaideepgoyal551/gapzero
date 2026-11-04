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
  LockKeyhole,
  Map,
  MessageSquare,
  Search,
  Target,
} from 'lucide-react';

const resourceCategories = [
  {
    icon: FileText,
    title: 'Resume & cover letter',
    description: 'Review your experience, strengthen your wording, and tailor your resume to the role.',
    links: [
      { label: 'Analyze your resume', path: '/resume-analyzer' },
      { label: 'Improve resume keywords', path: '/ats-optimizer' },
    ],
  },
  {
    icon: Briefcase,
    title: 'Job search',
    description: 'Compare your background with a specific opening and focus on the requirements that matter.',
    links: [{ label: 'Match a job description', path: '/job-matcher' }],
  },
  {
    icon: Target,
    title: 'Skills & career direction',
    description: 'Understand the skills your target role calls for and decide what to work on next.',
    links: [
      { label: 'Review skill gaps', path: '/skill-gap' },
      { label: 'Build a career roadmap', path: '/career-roadmap' },
    ],
  },
  {
    icon: Linkedin,
    title: 'Professional profiles',
    description: 'Make your professional story clearer across the profiles employers are likely to review.',
    links: [
      { label: 'Improve LinkedIn', path: '/linkedin-optimizer' },
      { label: 'Review GitHub portfolio', path: '/github-analyzer' },
    ],
  },
  {
    icon: MessageSquare,
    title: 'Interview preparation',
    description: 'Work through interview questions, practice your story, and prepare for the next conversation.',
    links: [{ label: 'Open career coach', path: '/career-coach' }],
  },
  {
    icon: DollarSign,
    title: 'Salary research',
    description: 'Explore compensation ranges by role, location, and career level before your next move.',
    links: [{ label: 'Explore salary insights', path: '/salary-insights' }],
  },
];

const planningSteps = [
  {
    number: '01',
    title: 'Start with your experience',
    description: 'Add a resume or the skills and work history you want to build on.',
  },
  {
    number: '02',
    title: 'Choose a direction',
    description: 'Set a target role and compare it with your current profile.',
  },
  {
    number: '03',
    title: 'Decide what comes next',
    description: 'Use your analysis and roadmap to focus on practical next steps.',
  },
];

export const LandingPage: React.FC = () => {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async () => {
    await loginDemo();
    navigate('/dashboard');
  };

  const startPath = user ? '/dashboard' : '/register';

  return (
    <div className="min-h-screen bg-[#0c100e]">
      <Navbar />

      <main>
        <section className="border-b border-navy-200/70">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-growth-400">
                Career resources & practical tools
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-navy-950 sm:text-5xl">
                Make your next career move with a clearer plan.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-navy-500 sm:text-lg">
                Get your resume ready, understand what employers are looking for, and work out your next steps—all in one place.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to={startPath}>
                  <Button size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                    {user ? 'Open your workspace' : 'Get started'}
                  </Button>
                </Link>
                <a
                  href="#career-resources"
                  className="inline-flex h-11 items-center rounded-md border border-navy-300 px-4 text-sm font-medium text-navy-700 hover:border-navy-400 hover:bg-navy-100"
                >
                  Browse career resources
                </a>
              </div>
              {!user && (
                <button
                  type="button"
                  onClick={handleDemo}
                  className="mt-5 inline-flex items-center gap-2 text-sm text-navy-400 hover:text-growth-400"
                >
                  Take a look around first <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <aside className="rounded-lg border border-navy-200/80 bg-[#121814] p-5 sm:p-6" aria-label="Career planning checklist">
              <div className="flex items-center justify-between border-b border-navy-200/70 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-400">A good place to start</p>
                  <h2 className="mt-1 text-lg font-semibold text-navy-900">Get the essentials in order</h2>
                </div>
                <CheckCircle2 className="h-5 w-5 text-growth-400" />
              </div>
              <ul className="divide-y divide-navy-200/70">
                <li className="flex gap-3 py-4">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-growth-400" />
                  <div>
                    <p className="text-sm font-medium text-navy-800">A clear, current resume</p>
                    <p className="mt-1 text-xs leading-5 text-navy-500">Make your experience easy to scan and understand.</p>
                  </div>
                </li>
                <li className="flex gap-3 py-4">
                  <Search className="mt-0.5 h-4 w-4 shrink-0 text-growth-400" />
                  <div>
                    <p className="text-sm font-medium text-navy-800">A focused job search</p>
                    <p className="mt-1 text-xs leading-5 text-navy-500">Compare your skills with the roles you want.</p>
                  </div>
                </li>
                <li className="flex gap-3 py-4">
                  <Map className="mt-0.5 h-4 w-4 shrink-0 text-growth-400" />
                  <div>
                    <p className="text-sm font-medium text-navy-800">A practical next step</p>
                    <p className="mt-1 text-xs leading-5 text-navy-500">Turn what you learn into a plan you can follow.</p>
                  </div>
                </li>
              </ul>
              <Link
                to="/resume-analyzer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-growth-400 hover:text-growth-300"
              >
                Start with your resume <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </section>

        <section id="career-resources" className="scroll-mt-24 border-b border-navy-200/70 py-14 sm:py-16">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-growth-400">Career resources</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-navy-950 sm:text-3xl">
                Find help for the step you’re working on.
              </h2>
              <p className="mt-3 text-sm leading-6 text-navy-500">
                Start with one part of your career search. Your tools and progress stay together as your plans change.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {resourceCategories.map(({ icon: Icon, title, description, links }) => (
                <article key={title} className="rounded-lg border border-navy-200/80 bg-[#121814] p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-growth-500/10 text-growth-400">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
                      <p className="mt-2 min-h-[3.75rem] text-xs leading-5 text-navy-500">{description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-navy-200/70 pt-3">
                    {links.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="inline-flex items-center gap-1 text-xs font-medium text-growth-400 hover:text-growth-300"
                      >
                        {link.label} <ArrowRight className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="resume-help" className="scroll-mt-24 border-b border-navy-200/70 bg-[#101512] py-14 sm:py-16">
          <div className="mx-auto grid max-w-[1200px] gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-growth-400">Resume & cover letter</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-navy-950 sm:text-3xl">
                Make it easy for employers to see what you bring.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-navy-500">
                A strong application starts with clear, relevant examples of your work. Review your resume, check how it matches a role, and refine the details before you apply.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/resume-analyzer">
                  <Button icon={<FileText className="h-4 w-4" />}>Review your resume</Button>
                </Link>
                <Link
                  to="/ats-optimizer"
                  className="inline-flex h-10 items-center rounded-md border border-navy-300 px-4 text-sm font-medium text-navy-700 hover:border-navy-400 hover:bg-navy-100"
                >
                  Check role keywords
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-navy-200/80 bg-[#121814]">
              <div className="border-b border-navy-200/70 px-5 py-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-navy-400">Before you apply</h3>
              </div>
              <ul className="divide-y divide-navy-200/70 px-5">
                <li className="flex items-start gap-3 py-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-growth-400" />
                  <span className="text-sm leading-5 text-navy-700">Put the most relevant experience where it is easy to find.</span>
                </li>
                <li className="flex items-start gap-3 py-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-growth-400" />
                  <span className="text-sm leading-5 text-navy-700">Use specific examples to show the impact of your work.</span>
                </li>
                <li className="flex items-start gap-3 py-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-growth-400" />
                  <span className="text-sm leading-5 text-navy-700">Tailor your application to the role without overstating your experience.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="job-search" className="scroll-mt-24 border-b border-navy-200/70 py-14 sm:py-16">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-growth-400">Job search & career planning</p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-navy-950 sm:text-3xl">
                  Take the search one useful step at a time.
                </h2>
                <p className="mt-4 text-sm leading-6 text-navy-500">
                  A job search can feel like a lot to manage. Focus on the role, prepare your materials, and build a plan that fits your time and priorities.
                </p>
                <Link to="/job-matcher" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-growth-400 hover:text-growth-300">
                  Compare yourself with a role <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="divide-y divide-navy-200/70 rounded-lg border border-navy-200/80 bg-[#121814]">
                <Link to="/skill-gap" className="group flex items-start gap-4 p-5 hover:bg-navy-50/60">
                  <Target className="mt-0.5 h-5 w-5 shrink-0 text-growth-400" />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-navy-800 group-hover:text-navy-950">Understand the role requirements</span>
                    <span className="mt-1 block text-xs leading-5 text-navy-500">Compare the skills you have with the ones you want to develop.</span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-navy-400 group-hover:text-growth-400" />
                </Link>
                <Link to="/career-roadmap" className="group flex items-start gap-4 p-5 hover:bg-navy-50/60">
                  <Map className="mt-0.5 h-5 w-5 shrink-0 text-growth-400" />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-navy-800 group-hover:text-navy-950">Plan what to learn next</span>
                    <span className="mt-1 block text-xs leading-5 text-navy-500">Turn your priorities into a roadmap of achievable milestones.</span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-navy-400 group-hover:text-growth-400" />
                </Link>
                <Link to="/salary-insights" className="group flex items-start gap-4 p-5 hover:bg-navy-50/60">
                  <DollarSign className="mt-0.5 h-5 w-5 shrink-0 text-growth-400" />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-navy-800 group-hover:text-navy-950">Research compensation</span>
                    <span className="mt-1 block text-xs leading-5 text-navy-500">Review salary ranges for roles and locations you’re considering.</span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-navy-400 group-hover:text-growth-400" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="career-planning" className="scroll-mt-24 border-b border-navy-200/70 bg-[#101512] py-14 sm:py-16">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-growth-400">Career planning</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-navy-950 sm:text-3xl">
                A simple process. Your own pace.
              </h2>
            </div>
            <div className="grid gap-0 border-y border-navy-200/80 md:grid-cols-3 md:divide-x md:divide-navy-200/80">
              {planningSteps.map(step => (
                <article key={step.number} className="py-5 md:px-6 md:py-6 first:md:pl-0 last:md:pr-0">
                  <span className="font-mono text-xs font-semibold text-growth-400">{step.number}</span>
                  <h3 className="mt-3 text-sm font-semibold text-navy-900">{step.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-navy-500">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="privacy" className="scroll-mt-24 py-14 sm:py-16">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-navy-700">
                <LockKeyhole className="h-4 w-4 text-growth-400" />
                Your information stays yours
              </div>
              <h2 className="mt-3 text-xl font-semibold text-navy-950 sm:text-2xl">Career planning should work for you.</h2>
              <p className="mt-2 text-sm leading-6 text-navy-500">
                Choose what to add, update your preferences, and manage your profile from your account settings.
              </p>
            </div>
            <Link to={user ? '/settings' : '/register'}>
              <Button variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
                {user ? 'Manage your profile' : 'Create your profile'}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-navy-200/70 bg-[#101512] py-6">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-growth-600 text-white">
              <FileText className="h-3.5 w-3.5" />
            </span>
            GapZero
          </Link>
          <p className="text-xs text-navy-400">Career resources to help you decide what comes next.</p>
          <div className="flex items-center gap-5 text-xs text-navy-400">
            <Link to="/settings" className="hover:text-growth-400">Privacy & settings</Link>
            <a href="https://github.com/jaideepgoyal551/gapzero" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-growth-400">
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
