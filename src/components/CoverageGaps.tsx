import React from 'react';
import { MissingCoverage, KeyDifference } from '../types/insurance';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight,
  ShieldQuestion,
  Layers,
  Sparkles
} from 'lucide-react';

interface CoverageGapsProps {
  missingCoverages: MissingCoverage[];
  keyDifferences: KeyDifference[];
}

export const CoverageGaps: React.FC<CoverageGapsProps> = ({
  missingCoverages,
  keyDifferences,
}) => {
  return (
    <div className="space-y-8">
      {/* Section 1: Coverage Gaps & Missing Endorsements (Rule 6) */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldQuestion className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Coverage Gaps & Missing Endorsements (Rule 6)
            </h3>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {missingCoverages.length} Gaps Detected
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Coverages provided by one carrier but omitted or excluded in competing proposals, creating disparate client liability exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missingCoverages.map((gap, idx) => {
            const isHigh = gap.risk_level === 'High';
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-extrabold text-white tracking-tight">
                      {gap.coverage}
                    </h4>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        isHigh
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : gap.risk_level === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}
                    >
                      {gap.risk_level} Risk Level
                    </span>
                  </div>

                  {/* Presence Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                      <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Included in Quote:</span>
                      </div>
                      <ul className="text-slate-300 space-y-0.5">
                        {gap.present_in.map((carrier, cIdx) => (
                          <li key={cIdx} className="font-medium">• {carrier}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
                      <div className="flex items-center space-x-1.5 text-rose-400 font-bold mb-1">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>MISSING / Excluded:</span>
                      </div>
                      <ul className="text-rose-200/90 space-y-0.5">
                        {gap.missing_in.map((carrier, cIdx) => (
                          <li key={cIdx} className="font-medium">• {carrier}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Agent Recommendation */}
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
                    <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block mb-1">
                      Analyst Recommendation to Cure Gap:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {gap.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Key Differences & Policy Terms */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Strategic Key Differences
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detailed breakdown of subtle contractual wording variances, warranties, and endorsement nuances.
          </p>
        </div>

        <div className="space-y-3">
          {keyDifferences.map((kd, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-base font-extrabold text-blue-300">
                  {kd.topic}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {kd.carriers_affected.map((carrier, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {carrier}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {kd.explanation}
              </p>

              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 text-xs">
                <span className="font-bold text-blue-400 uppercase tracking-wider block mb-0.5">
                  Why this matters to the business owner:
                </span>
                <span className="text-slate-300">{kd.why_it_matters}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
