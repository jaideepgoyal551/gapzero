import React, { useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Activity,
  Briefcase,
  DollarSign,
  FileText,
  Github,
  LayoutDashboard,
  Linkedin,
  LogOut,
  Map,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from 'lucide-react';

type NavigationItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
  badge?: string;
};

const navigationItems: NavigationItem[] = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, group: 'Workspace' },
  { name: 'Resume', path: '/resume-analyzer', icon: FileText, group: 'Profile' },
  { name: 'LinkedIn profile', path: '/linkedin-optimizer', icon: Linkedin, group: 'Profile' },
  { name: 'Skill gaps', path: '/skill-gap', icon: Target, group: 'Planning' },
  { name: 'Career roadmap', path: '/career-roadmap', icon: Map, group: 'Planning' },
  { name: 'Job matcher', path: '/job-matcher', icon: Briefcase, group: 'Explore' },
  { name: 'GitHub portfolio', path: '/github-analyzer', icon: Github, group: 'Explore' },
  { name: 'Salary insights', path: '/salary-insights', icon: DollarSign, group: 'Explore' },
  { name: 'ATS optimizer', path: '/ats-optimizer', icon: Activity, group: 'Tools' },
  { name: 'AI career coach', path: '/career-coach', icon: MessageSquare, group: 'Tools', badge: 'AI' },
  { name: 'Settings & privacy', path: '/settings', icon: Settings, group: 'Account' },
];

const primaryTabs = [
  { name: 'Overview', path: '/dashboard' },
  { name: 'Resume', path: '/resume-analyzer' },
  { name: 'Skills', path: '/skill-gap' },
  { name: 'Roadmap', path: '/career-roadmap' },
  { name: 'Jobs', path: '/job-matcher' },
];

export const AppLayout: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(
    () => navigationItems.filter(item => item.name.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );
  const activePage = navigationItems.find(item => item.path === pathname)?.name ?? 'Workspace';

  const goToFirstMatch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && query.trim() && filteredItems[0]) {
      navigate(filteredItems[0].path);
      setQuery('');
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeNavigation = () => {
    setSidebarOpen(false);
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-[#0c100e] text-navy-900">
      <header className="sticky top-0 z-30 border-b border-navy-200/80 bg-[#111713]">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-navy-500 hover:bg-navy-100 hover:text-navy-900 md:hidden"
            aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={sidebarOpen}
            aria-controls="app-navigation"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/dashboard" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-growth-600 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="hidden text-sm font-semibold tracking-tight text-navy-900 sm:inline">
              Gap<span className="text-growth-400">Zero</span>
            </span>
          </Link>

          <div className="mx-1 hidden h-6 w-px bg-navy-200 sm:block" />

          <label className="relative ml-auto w-full max-w-[420px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              onKeyDown={goToFirstMatch}
              placeholder="Search career tools..."
              aria-label="Search career tools"
              className="h-9 w-full rounded-md border border-navy-200 bg-[#0c100e] pl-9 pr-14 text-sm text-navy-800 placeholder:text-navy-400 focus:border-growth-500 focus:ring-2 focus:ring-growth-500/20"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-navy-200 px-1.5 py-0.5 text-[10px] text-navy-400 sm:inline">
              Enter
            </kbd>
          </label>

          <button
            type="button"
            onClick={() => navigate('/resume-analyzer')}
            className="hidden h-9 shrink-0 items-center gap-1.5 rounded-md border border-growth-500/40 bg-growth-600 px-3 text-xs font-semibold text-white hover:bg-growth-500 sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            <span>New analysis</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-growth-500/15 text-xs font-semibold text-growth-300 ring-1 ring-growth-500/30 hover:ring-growth-400"
            aria-label={`Open settings for ${profile?.full_name || user?.email || 'your account'}`}
            title={profile?.full_name || user?.email || 'Account settings'}
          >
            {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </button>
        </div>
      </header>

      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-20 bg-black/70 md:hidden"
            onClick={closeNavigation}
          />
        )}

        <aside
          id="app-navigation"
          className={`fixed bottom-0 left-0 top-14 z-20 flex w-64 flex-col border-r border-navy-200/80 bg-[#101512] transition-transform duration-200 md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="border-b border-navy-200/70 px-4 py-4">
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-navy-100"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-200 text-sm font-semibold text-navy-800">
                {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-navy-800">
                  {profile?.full_name || user?.email?.split('@')[0] || 'Your workspace'}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-navy-400">
                  {profile?.target_role || 'Set your target role'}
                </span>
              </span>
              <Target className="h-4 w-4 shrink-0 text-navy-400" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Main navigation">
            {['Workspace', 'Profile', 'Planning', 'Explore', 'Tools', 'Account'].map(group => {
              const items = filteredItems.filter(item => item.group === group);
              if (!items.length) return null;
              return (
                <div key={group} className="mb-4">
                  <h2 className="px-2 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy-400">
                    {group}
                  </h2>
                  {items.map(item => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={closeNavigation}
                        className={({ isActive }) =>
                          `mb-0.5 flex items-center gap-2.5 rounded-md border px-2.5 py-2 text-[13px] transition-colors ${
                            isActive
                              ? 'border-growth-500/20 bg-growth-500/10 font-semibold text-growth-400'
                              : 'border-transparent text-navy-500 hover:bg-navy-100 hover:text-navy-900'
                          }`
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 flex-1 truncate">{item.name}</span>
                        {item.badge && (
                          <span className="rounded border border-growth-500/20 px-1 py-0.5 text-[9px] font-semibold uppercase text-growth-300">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              );
            })}
            {filteredItems.length === 0 && (
              <p className="px-2 py-4 text-xs leading-relaxed text-navy-400">
                No tools match “{query}”. Try another search.
              </p>
            )}
          </nav>

          <div className="border-t border-navy-200/70 p-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs text-navy-400 hover:bg-navy-100 hover:text-navy-900"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
            <Link
              to="/settings"
              className="mt-1 flex items-center gap-2 rounded-md px-2.5 py-2 text-xs text-navy-400 hover:bg-navy-100 hover:text-navy-900"
            >
              <ShieldCheck className="h-4 w-4" />
              Privacy & account
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="border-b border-navy-200/70 bg-[#0e130f]">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex min-w-max items-center gap-1" aria-label="Workspace sections">
                {primaryTabs.map(tab => (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `relative flex h-12 items-center px-3 text-xs font-medium transition-colors ${
                        isActive
                          ? 'text-navy-900 after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-growth-400'
                          : 'text-navy-400 hover:text-navy-800'
                      }`
                    }
                  >
                    {tab.name}
                  </NavLink>
                ))}
              </nav>
              <div className="hidden items-center gap-2 text-[11px] text-navy-400 lg:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-growth-400" />
                <span>{activePage}</span>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:px-8 lg:py-7">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
