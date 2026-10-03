import React, { useState } from 'react';
import { RedFlag } from '../types/insurance';
import { 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  Info, 
  Filter,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface RedFlagsListProps {
  redFlags: RedFlag[];
}

export const RedFlagsList: React.FC<RedFlagsListProps> = ({ redFlags }) => {
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const filteredFlags = redFlags.filter((rf) => {
    if (filterSeverity === 'All') return true;
    return rf.severity === filterSeverity;
  });

  const highCount = redFlags.filter((rf) => rf.severity === 'High').length;
  const medCount = redFlags.filter((rf) => rf.severity === 'Medium').length;
  const lowCount = redFlags.filter((rf) => rf.severity === 'Low').length;

  return (
    <div className="space-y-6">
      {/* Header & Analyst Operational Rule Notice */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Dangerous Exclusions & Red Flags
            </h3>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {redFlags.length} Identified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Strict Rule 3 & 7 Enforcement: Carrier name and exact page references are cited for every exclusion, with plain English risk translations.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setFilterSeverity('All')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              filterSeverity === 'All' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({redFlags.length})
          </button>
          <button
            onClick={() => setFilterSeverity('High')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              filterSeverity === 'High' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            High ({highCount})
          </button>
          <button
            onClick={() => setFilterSeverity('Medium')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              filterSeverity === 'Medium' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Medium ({medCount})
          </button>
          <button
            onClick={() => setFilterSeverity('Low')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              filterSeverity === 'Low' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Low ({lowCount})
          </button>
        </div>
      </div>

      {/* Grid of Red Flag Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFlags.map((flag, idx) => {
          const isHigh = flag.severity === 'High';
          const isMed = flag.severity === 'Medium';

          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                isHigh
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/30'
                  : isMed
                  ? 'bg-amber-950/15 border-amber-500/30 shadow-md'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div>
                {/* Severity Badge & Carrier */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isHigh
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : isMed
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {flag.severity} Severity
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {flag.carrier_name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-blue-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{flag.page_reference}</span>
                  </div>
                </div>

                {/* Issue Title */}
                <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug">
                  {flag.issue}
                </h4>

                {/* Plain English Explanation */}
                <div className="mt-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Plain English Operational Impact:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {flag.explanation}
                  </p>
                </div>
              </div>

              {/* Action Hint */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span className="italic">
                  {isHigh
                    ? 'Requires underwriter endorsement or contract amendment prior to binding.'
                    : 'Requires client acknowledgement of self-insured retention.'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
