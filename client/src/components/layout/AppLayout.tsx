import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-navy-900 text-lg">GapZero</span>
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
        <div
          className="fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        id="app-navigation"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r border-white/10 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:w-64 md:max-w-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-navy-100">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-orange-500 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-navy-950 text-lg leading-none">
              Gap<span className="text-brand-600">Zero</span>
            </span>
            <span className="text-[9px] font-semibold text-navy-400 uppercase tracking-widest mt-0.5">
              Career Coach
            </span>
          </div>
        </div>

        {/* User Snapshot Card */}
        <div className="p-4 mx-3 my-3 bg-navy-50/70 border border-navy-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
              {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-navy-900 truncate">
                {profile?.full_name || user?.email?.split('@')[0] || 'Candidate'}
              </p>
              <p className="text-[11px] text-brand-400 font-medium truncate">
                {profile?.target_role || 'Add your target role'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-400 font-semibold'
                      : 'text-navy-600 hover:bg-white/5 hover:text-navy-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-400">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* AI Privacy & Quick Session */}
        <div className="p-4 border-t border-navy-100 bg-white">
          <button
            onClick={() => {
              navigate('/career-coach');
              setSidebarOpen(false);
            }}
            className="w-full mb-3 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-brand-600 to-orange-600 text-white rounded-xl text-xs font-semibold hover:shadow-sm transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat with AI Coach</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-navy-600 hover:text-navy-900 hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="hidden md:flex min-h-16 bg-white border-b border-white/10 items-center justify-between px-5 lg:px-8 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-navy-500">Target role</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-400 border border-brand-200/60">
              <Target className="w-3.5 h-3.5" />
              {profile?.target_role || 'Not set yet'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/settings')}
              className="text-xs text-navy-600 hover:text-orange-400 flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Privacy & settings</span>
            </button>

            <button
              onClick={() => navigate('/career-coach')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-brand-50 hover:bg-brand-100 text-brand-400 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Coach Ready</span>
            </button>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto animate-fade-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
