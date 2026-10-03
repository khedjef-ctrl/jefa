import React, { useState } from 'react';
import { 
  FileUp, 
  FileSpreadsheet, 
  History, 
  Settings, 
  ShieldCheck,
  CreditCard,
  User,
  LogOut,
  Sparkles,
  Lock,
  Menu,
  X
} from 'lucide-react';
import { UserProfile } from '../types/insurance';

interface NavbarProps {
  activeTab: 'upload' | 'comparison' | 'history' | 'pricing' | 'admin';
  setActiveTab: (tab: 'upload' | 'comparison' | 'history' | 'pricing' | 'admin') => void;
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  onOpenSettings: () => void;
  hasAnalysis: boolean;
  currentUser: UserProfile | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedPresetId,
  onSelectPreset,
  onOpenSettings,
  hasAnalysis,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate remaining trial days
  let trialDaysLeft: number | null = null;
  if (currentUser?.subscription_status === 'trialing' && currentUser.trial_ends_at) {
    const diff = new Date(currentUser.trial_ends_at).getTime() - Date.now();
    trialDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  const navigateTab = (tab: 'upload' | 'comparison' | 'history' | 'pricing' | 'admin') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-40">
      {/* 7. Free Trial Banner */}
      {currentUser && trialDaysLeft !== null && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-slate-950 py-1.5 px-3 text-[11px] sm:text-xs font-bold text-center flex flex-wrap items-center justify-center gap-1">
          <div className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>
              {trialDaysLeft > 0 ? (
                <>{trialDaysLeft} days left in your Solo Agent trial.</>
              ) : (
                <>Your 14-day trial has ended.</>
              )}
            </span>
          </div>
          <button
            onClick={() => navigateTab('pricing')}
            className="underline font-black hover:text-white transition cursor-pointer ml-1"
          >
            Upgrade Now (Save 20%) →
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <header className="bg-[#1e3a5f] border-b border-slate-700/80 shadow-lg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo: scales down gracefully on mobile but stays readable */}
            <div
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer select-none"
              onClick={() => navigateTab('upload')}
            >
              {/* Inline SVG Shield + Checkmark */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.15" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-base sm:text-lg tracking-tight text-white">
                    Policy<span className="text-emerald-400">Lens</span>
                  </span>
                  <span className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full uppercase tracking-wider">
                    Commercial
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 hidden lg:block">
                  5 carrier quotes. 1 clear comparison. 60 seconds.
                </p>
              </div>
            </div>

            {/* Desktop & Tablet Navigation (hidden on mobile <=640px) */}
            <nav className="hidden sm:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/60 text-xs">
              <button
                onClick={() => navigateTab('upload')}
                className={`flex items-center px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileUp className="w-3.5 h-3.5 mr-1" />
                <span>Upload</span>
              </button>

              <button
                onClick={() => {
                  if (hasAnalysis) navigateTab('comparison');
                }}
                disabled={!hasAnalysis}
                className={`flex items-center px-3 py-1.5 rounded-lg font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  activeTab === 'comparison'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1" />
                <span>Comparison</span>
              </button>

              <button
                onClick={() => navigateTab('history')}
                className={`flex items-center px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <History className="w-3.5 h-3.5 mr-1" />
                <span>History</span>
              </button>

              <button
                onClick={() => navigateTab('pricing')}
                className={`flex items-center px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  activeTab === 'pricing'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 mr-1" />
                <span>Pricing</span>
              </button>

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => navigateTab('admin')}
                  className={`flex items-center px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-purple-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 mr-1 text-purple-400" />
                  <span>Admin</span>
                </button>
              )}
            </nav>

            {/* Desktop User Session & Settings Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-xs font-bold text-white truncate max-w-[120px]">
                      {currentUser.name || currentUser.email.split('@')[0]}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                      {currentUser.plan} Plan
                    </span>
                  </div>

                  <button
                    onClick={onLogout}
                    className="p-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-slate-800/80 transition border border-transparent hover:border-slate-700 cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="px-3 py-1.5 rounded-lg font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="px-3.5 py-1.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition cursor-pointer"
                  >
                    Start Free Trial
                  </button>
                </div>
              )}

              {/* Settings Gear */}
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition border border-transparent hover:border-slate-700 cursor-pointer"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Controls (Hamburger & Settings on mobile <=640px) */}
            <div className="flex sm:hidden items-center space-x-1">
              <button
                onClick={onOpenSettings}
                className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer tap-target-48 flex items-center justify-center"
                title="Settings"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-slate-100 hover:text-emerald-400 bg-slate-800/80 border border-slate-700 transition cursor-pointer tap-target-48 flex items-center justify-center"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <span className="text-2xl font-bold leading-none select-none flex items-center justify-center">☰</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen Overlay Menu (min 48px tap targets, full-width actions) */}
        {mobileMenuOpen && (
          <div className="sm:hidden fixed inset-0 top-16 bg-slate-950/98 backdrop-blur-xl z-50 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">
                Navigation
              </div>

              {/* Large Tap Targets (min 48px height) */}
              <div className="space-y-2">
                <button
                  onClick={() => navigateTab('upload')}
                  className={`w-full min-h-[48px] px-4 py-3 rounded-2xl text-left text-sm font-bold flex items-center space-x-3 transition cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-200 border border-slate-800'
                  }`}
                >
                  <FileUp className="w-5 h-5" />
                  <span>Upload & Analyze Quotes</span>
                </button>

                <button
                  onClick={() => {
                    if (hasAnalysis) navigateTab('comparison');
                  }}
                  disabled={!hasAnalysis}
                  className={`w-full min-h-[48px] px-4 py-3 rounded-2xl text-left text-sm font-bold flex items-center space-x-3 transition cursor-pointer disabled:opacity-40 ${
                    activeTab === 'comparison'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-200 border border-slate-800'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  <span>Side-by-Side Comparison</span>
                </button>

                <button
                  onClick={() => navigateTab('history')}
                  className={`w-full min-h-[48px] px-4 py-3 rounded-2xl text-left text-sm font-bold flex items-center space-x-3 transition cursor-pointer ${
                    activeTab === 'history'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-200 border border-slate-800'
                  }`}
                >
                  <History className="w-5 h-5" />
                  <span>Archived Comparisons</span>
                </button>

                {/* Pricing Button: Full width in mobile menu */}
                <button
                  onClick={() => navigateTab('pricing')}
                  className={`w-full min-h-[48px] px-4 py-3 rounded-2xl text-left text-sm font-bold flex items-center space-x-3 transition cursor-pointer ${
                    activeTab === 'pricing'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-200 border border-slate-800'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Pricing & Subscriptions</span>
                </button>

                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => navigateTab('admin')}
                    className={`w-full min-h-[48px] px-4 py-3 rounded-2xl text-left text-sm font-bold flex items-center space-x-3 transition cursor-pointer ${
                      activeTab === 'admin'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-purple-950/40 text-purple-200 border border-purple-800/60'
                    }`}
                  >
                    <Lock className="w-5 h-5 text-purple-400" />
                    <span>Admin Console</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile User Authentication Buttons: Full-width */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">{currentUser.name || currentUser.email}</div>
                      <div className="text-xs text-emerald-400 font-semibold uppercase">{currentUser.plan} Plan</div>
                    </div>
                    <span className="text-xs text-slate-400">{currentUser.analyses_used} used</span>
                  </div>

                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full min-h-[48px] py-3 rounded-2xl text-xs font-bold bg-slate-900 border border-rose-800/60 text-rose-300 hover:bg-rose-950/40 transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onOpenAuth('signup');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full min-h-[50px] py-3.5 rounded-2xl text-sm font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <span>Start 14-Day Free Trial</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenAuth('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full min-h-[48px] py-3 rounded-2xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition flex items-center justify-center cursor-pointer"
                  >
                    <span>Log In to Existing Account</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};
