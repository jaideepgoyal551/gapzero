import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDemo = async () => {
    await loginDemo();
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-navy-200/80 bg-[#111713]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-growth-600 flex items-center justify-center group-hover:bg-growth-500 transition-colors">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-navy-950 tracking-tight leading-none">
                Gap<span className="text-growth-400">Zero</span>
              </span>
              <span className="text-[9px] font-medium text-navy-400 uppercase tracking-[0.14em] mt-1">
                Career Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-navy-500 hover:text-growth-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-navy-500 hover:text-growth-400 transition-colors">
              How It Works
            </a>
            <a href="#trust-privacy" className="text-sm font-medium text-navy-500 hover:text-growth-400 transition-colors">
              Trust & Privacy
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button size="sm" onClick={() => navigate('/dashboard')} icon={<ArrowRight className="w-4 h-4" />}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleDemo}>
                  Explore Demo Profile
                </Button>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-navy-600 hover:text-navy-900 p-2 rounded-lg hover:bg-white/5"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="public-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="public-mobile-menu" className="md:hidden border-b border-navy-200/70 bg-[#111713] px-4 pt-3 pb-6 space-y-2">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-navy-700 hover:bg-navy-100 rounded-lg"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-navy-700 hover:bg-navy-100 rounded-lg"
          >
            How It Works
          </a>
          <a
            href="#trust-privacy"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-navy-700 hover:bg-navy-100 rounded-lg"
          >
            Trust & Privacy
          </a>
          <div className="pt-4 border-t border-navy-100 flex flex-col gap-2.5">
            {user ? (
              <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleDemo}>
                  Explore Demo Profile
                </Button>
                <Link to="/login" className="w-full">
                  <Button variant="ghost" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button className="w-full">Get Started Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
