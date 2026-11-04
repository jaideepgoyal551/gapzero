import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Target,
  Sparkles,
  Map,
  MessageSquare,
  Briefcase,
  Github,
  Linkedin,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const AppLayout: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
    { name: 'Skill Gap Detection', path: '/skill-gap', icon: Target },
    { name: 'ATS Optimizer', path: '/ats-optimizer', icon: Sparkles },
    { name: 'Career Roadmap', path: '/career-roadmap', icon: Map },
    { name: 'AI Career Coach', path: '/career-coach', icon: MessageSquare, badge: 'AI' },
    { name: 'Job Matcher', path: '/job-matcher', icon: Briefcase },
    { name: 'GitHub Portfolio', path: '/github-analyzer', icon: Github },
    { name: 'LinkedIn Optimizer', path: '/linkedin-optimizer', icon: Linkedin },
    { name: 'Salary Insights', path: '/salary-insights', icon: DollarSign },
    { name: 'Settings & Privacy', path: '/settings', icon: Settings },
  ];
  const activePage = navItems.find(item => item.path === pathname)?.name ?? 'Workspace';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0c100e]">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#111713] border-b border-navy-200/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold tracking-tight text-navy-900 text-lg">GapZero</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-navy-600 hover:bg-navy-100"
          aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={sidebarOpen}
          aria-controls="app-navigation"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        id="app-navigation"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#111713] border-r border-navy-200/70 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:w-64 md:max-w-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <NavLink to="/dashboard" className="h-16 flex items-center gap-2.5 px-5 border-b border-navy-200/70">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-growth-600 to-growth-400 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-navy-950 text-lg leading-none">
              Gap<span className="text-growth-400">Zero</span>
            </span>
            <span className="text-[9px] font-medium text-navy-400 uppercase tracking-[0.16em] mt-1">
              Career workspace
            </span>
          </div>
        </NavLink>

        {/* User Snapshot Card */}
        <div className="p-3.5 mx-3 my-4 bg-navy-50/70 border border-navy-200/70 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 text-growth-400 flex items-center justify-center font-semibold text-sm ring-1 ring-growth-500/20">
              {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-navy-900 truncate">
                {profile?.full_name || user?.email?.split('@')[0] || 'Candidate'}
              </p>
              <p className="text-[11px] text-navy-500 font-medium truncate">
                {profile?.target_role || 'Add your target role'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto" aria-label="Main navigation">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.path}>
                {(index === 0 || index === 1 || index === navItems.length - 1) && (
                  <p className={`px-3 ${index === 0 ? 'pt-1' : 'pt-6'} pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-400`}>
                    {index === 0 ? 'Workspace' : index === 1 ? 'Career tools' : 'Account'}
                  </p>
                )}
                <NavLink
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2.5 mb-0.5 rounded-lg text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'bg-growth-500/10 text-growth-400 ring-1 ring-inset ring-growth-500/20'
                        : 'text-navy-500 hover:bg-navy-100 hover:text-navy-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-growth-500/10 text-growth-400 ring-1 ring-inset ring-growth-500/20">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </React.Fragment>
            );
          })}
        </nav>

        {/* AI Privacy & Quick Session */}
        <div className="p-4 border-t border-navy-200/70 bg-[#111713]">
          <button
            onClick={() => {
              navigate('/career-coach');
              setSidebarOpen(false);
            }}
            className="w-full mb-3 flex items-center justify-center gap-2 px-3 py-2.5 bg-growth-600 hover:bg-growth-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat with AI Coach</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-navy-500 hover:text-navy-900 hover:bg-navy-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="hidden md:flex min-h-16 bg-[#111713]/95 border-b border-navy-200/70 items-center justify-between px-5 lg:px-8 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs text-navy-400">Workspace</span>
            <span className="text-navy-300">/</span>
            <span className="text-xs font-semibold text-navy-800">{activePage}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/settings')}
              className="inline-flex items-center gap-2 text-xs text-navy-500 hover:text-navy-900"
              title="Update your target role"
            >
              <Target className="w-3.5 h-3.5 text-growth-400" />
              <span className="max-w-40 truncate">{profile?.target_role || 'Set target role'}</span>
            </button>
            <span className="h-5 w-px bg-navy-200" />
            <button
              onClick={() => navigate('/settings')}
              className="text-xs text-navy-500 hover:text-growth-400 flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-navy-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => navigate('/career-coach')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-growth-500/10 hover:bg-growth-500/15 text-growth-400 ring-1 ring-inset ring-growth-500/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Coach Ready</span>
            </button>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-screen-2xl w-full mx-auto animate-fade-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
