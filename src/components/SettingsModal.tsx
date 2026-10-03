import React from 'react';
import { AppSettings } from '../types/insurance';
import { Settings, X, Globe, DollarSign, Code, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
}) => {
  if (!isOpen) return null;

  const handleLanguageChange = (lang: 'en' | 'ar' | 'fr') => {
    const updated = { ...settings, language: lang };
    setSettings(updated);
    localStorage.setItem('quotecompare_settings', JSON.stringify(updated));
  };

  const handleToggleRawJson = () => {
    const updated = { ...settings, showRawJson: !settings.showRawJson };
    setSettings(updated);
    localStorage.setItem('quotecompare_settings', JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">App Settings</h3>
              <p className="text-xs text-slate-400">Preferences & Display Options</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Language Selection */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 font-semibold text-slate-300">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Display Language</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'en', label: 'English (US)' },
                { id: 'ar', label: 'العربية (Arabic)' },
                { id: 'fr', label: 'Français (French)' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id as any)}
                  className={`p-2 rounded-lg border text-center font-medium transition ${
                    settings.language === lang.id
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Display */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="flex items-center space-x-2 font-semibold text-slate-300">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Currency Format</span>
            </label>
            <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-slate-300 flex items-center justify-between">
              <span>United States Dollar ($ USD)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                Default
              </span>
            </div>
          </div>

          {/* Raw JSON Toggle */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 font-semibold text-slate-300 cursor-pointer" onClick={handleToggleRawJson}>
                <Code className="w-4 h-4 text-indigo-400" />
                <span>Show Raw JSON Tab</span>
              </label>
              <button
                type="button"
                onClick={handleToggleRawJson}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-300 cursor-pointer ${
                  settings.showRawJson ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                    settings.showRawJson ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Displays the full JSON schema inspector tab for developers and power users.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer flex items-center justify-center"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
