import React from 'react';
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
  Lock
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
  // Calculate remaining trial days
  let trialDaysLeft: number | null = null;
  if (currentUser?.subscription_status === 'trialing' && currentUser.trial_ends_at) {
    const diff = new Date(currentUser.trial_ends_at).getTime() - Date.now();
    trialDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="sticky top-0 z-40">
      {/* 7. Free Trial Banner (Requirement #7) */}
      {currentUser && trialDaysLeft !== null && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-slate-950 py-1.5 px-4 text-xs font-bold text-center flex items-center justify-center space-x-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {trialDaysLeft > 0 ? (
              <>{trialDaysLeft} days left in your Solo Agent trial. Upgrade now to lock in 20% annual savings.</>
            ) : (
              <>Your 14-day trial has ended. Upgrade to continue unlimited comparisons.</>
            )}
          </span>
          <button
            onClick={() => setActiveTab('pricing')}
            className="ml-2 underline font-black hover:text-white transition cursor-pointer"
          >
            Upgrade Now →
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <header className="bg-[#1e3a5f] border-b border-slate-700/80 shadow-lg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Tagline (Requirement 2 & 3) */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setActiveTab('upload')}
            >
              {/* Inline SVG Shield with Checkmark Logo */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <svg 
                  className="w-6 h-6 text-slate-950" 
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
                <div className="flex items-center space-x-2">
                  <span className="font-black text-lg tracking-tight text-white">
                    Policy<span className="text-emerald-400">Lens</span>
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full uppercase tracking-wider">
                    Commercial
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 hidden md:block">
                  5 carrier quotes. 1 clear comparison. 60 seconds.
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/60">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileUp className="w-3.5 h-3.5 mr-1.5" />
                <span>Upload</span>
              </button>

              <button
                onClick={() => {
                  if (hasAnalysis) setActiveTab('comparison');
                }}
                disabled={!hasAnalysis}
                className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  activeTab === 'comparison'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
                <span>Comparison</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <History className="w-3.5 h-3.5 mr-1.5" />
                <span>History</span>
              </button>

              <button
                onClick={() => setActiveTab('pricing')}
                className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'pricing'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                <span>Pricing</span>
              </button>

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-purple-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                  <span>Admin</span>
                </button>
              )}
            </nav>

            {/* User Session & Settings Actions */}
            <div className="flex items-center space-x-2">
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-bold text-white truncate max-w-[130px]">
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

              {/* Settings Gear Icon */}
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition border border-transparent hover:border-slate-700 cursor-pointer"
                title="Settings & Display Preferences"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
