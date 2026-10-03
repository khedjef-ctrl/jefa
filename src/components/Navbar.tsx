import React from 'react';
import { 
  FileUp, 
  FileSpreadsheet, 
  History, 
  Settings, 
  ShieldCheck,
  Building2,
  Printer
} from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/presetScenarios';

interface NavbarProps {
  activeTab: 'upload' | 'comparison' | 'history';
  setActiveTab: (tab: 'upload' | 'comparison' | 'history') => void;
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  onOpenSettings: () => void;
  hasAnalysis: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedPresetId,
  onSelectPreset,
  onOpenSettings,
  hasAnalysis,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#1e3a5f] border-b border-slate-700/80 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('upload')}>
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
                  QuoteCompare <span className="text-emerald-400">AI</span>
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

          {/* 3 Main Tabs: Upload, Comparison, History */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/60">
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
          </nav>

          {/* Right Action Icons (Preset quick-select & Settings gear) */}
          <div className="flex items-center space-x-2">
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
  );
};
