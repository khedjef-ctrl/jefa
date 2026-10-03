import React from 'react';
import { 
  CommercialAnalysisOutput 
} from '../types/insurance';
import { 
  Award, 
  ShieldAlert, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ExecutiveOverviewProps {
  analysis: CommercialAnalysisOutput;
  setActiveTab: (tab: string) => void;
  clientName: string;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  analysis,
  setActiveTab,
  clientName,
}) => {
  const { 
    analysis_metadata, 
    carriers, 
    agent_recommendation, 
    premium_analysis, 
    red_flags,
    missing_coverages 
  } = analysis;

  const highSeverityFlags = red_flags.filter((rf) => rf.severity === 'High');

  return (
    <div className="space-y-6">
      {/* Top Banner / Warnings Bar */}
      {analysis_metadata.warnings && analysis_metadata.warnings.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Key Underwriting Warnings & Analyst Alerts
              </h4>
              <ul className="text-xs space-y-1 list-disc list-inside text-amber-200/90">
                {analysis_metadata.warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Hero Recommendation Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border border-blue-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Independent Agent Strategic Recommendation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Proposal Comparison for {carriers[0]?.named_insured || clientName || 'Commercial Client'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Comparative underwriting evaluation of {analysis_metadata.number_of_quotes} commercial quotes.
              Conducted under US independent agency commercial lines standards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('email')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4 mr-1" />
              <span>Generate Client Email Proposal</span>
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
            >
              <span>Side-by-Side Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>

        {/* 3 Decision Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Best Overall Value
              </span>
              <span className="p-1 rounded bg-blue-500/20 text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="text-base font-extrabold text-blue-300">
              {agent_recommendation.best_overall_value}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Optimal balance of broad coverage terms, manageable deductibles, and fair pricing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Broadest Coverage Protection
              </span>
              <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-base font-extrabold text-emerald-300">
              {agent_recommendation.best_coverage}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Highest limits with minimal exclusions and superior endorsement language.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Lowest Upfront Premium
              </span>
              <span className="p-1 rounded bg-amber-500/20 text-amber-400">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <div className="text-base font-extrabold text-amber-300">
              {agent_recommendation.cheapest_option}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Lowest annual outlay, but subject to specific gaps and exclusions detailed below.
            </p>
          </div>
        </div>

        {/* Detailed Reasoning Box */}
        <div className="mt-4 p-4 rounded-xl bg-blue-950/40 border border-blue-900/60">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
                Senior Analyst Strategic Rationale:
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {agent_recommendation.reasoning}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Carrier Side-by-Side Quick Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Evaluated Carrier Quotes ({carriers.length})
          </h3>
          <span className="text-xs text-slate-400">
            Average Premium: <strong className="text-white">${premium_analysis.average_premium?.toLocaleString()}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {carriers.map((c, i) => {
            const isBestValue = c.carrier_name === agent_recommendation.best_overall_value;
            const isBroadest = c.carrier_name === agent_recommendation.best_coverage;
            const isCheapest = c.carrier_name === agent_recommendation.cheapest_option;
            const diffFromAvg = premium_analysis.average_premium
              ? (((c.annual_premium - premium_analysis.average_premium) / premium_analysis.average_premium) * 100).toFixed(1)
              : '0';

            return (
              <div
                key={i}
                className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                  isBestValue
                    ? 'bg-slate-900 border-blue-500/60 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {isBestValue && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white shadow-sm">
                      Recommended
                    </span>
                  )}
                  {isBroadest && !isBestValue && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Broadest Limits
                    </span>
                  )}
                  {isCheapest && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Lowest Premium
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-white tracking-tight line-clamp-1">
                    {c.carrier_name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Policy / Quote #: <span className="text-slate-300 font-mono">{c.policy_number}</span>
                  </p>

                  {/* Premium Hero */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Annual Estimated Premium
                      </span>
                      <span className="text-xl font-black text-white">
                        ${c.annual_premium?.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          Number(diffFromAvg) > 0
                            ? 'bg-rose-500/10 text-rose-300'
                            : 'bg-emerald-500/10 text-emerald-300'
                        }`}
                      >
                        {Number(diffFromAvg) > 0 ? `+${diffFromAvg}%` : `${diffFromAvg}%`}
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-0.5">vs avg</span>
                    </div>
                  </div>

                  {/* Policy Info */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Term:</span>
                      <span className="text-slate-200 font-medium">
                        {c.effective_date} - {c.expiration_date}
                      </span>
                    </div>
                    <div className="flex items-start justify-between text-slate-400">
                      <span className="shrink-0 mr-2">Payment Terms:</span>
                      <span className="text-slate-300 text-right font-medium">
                        {c.payment_terms || 'Annual in full'}
                      </span>
                    </div>
                    <div className="flex items-start justify-between text-slate-400">
                      <span className="shrink-0 mr-2">Business Class:</span>
                      <span className="text-slate-300 text-right line-clamp-2">
                        {c.business_description || 'Commercial Risk'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Quote #{i + 1}
                  </span>
                  <button
                    onClick={() => setActiveTab('matrix')}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center"
                  >
                    View coverage lines <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Snapshot Cards: Red Flags vs Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Red Flags Quick Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Critical Exclusions & Red Flags ({red_flags.length})
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {highSeverityFlags.length} High Severity
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Specific policy endorsements and exclusion forms cited by page that represent operational liability hazards.
            </p>

            <div className="space-y-2">
              {red_flags.slice(0, 3).map((rf, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{rf.carrier_name}</span>
                    <span className="text-[10px] text-amber-400 font-mono">{rf.page_reference}</span>
                  </div>
                  <p className="text-slate-400 mt-1 line-clamp-1">{rf.issue}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('redflags')}
            className="mt-4 text-xs font-semibold text-rose-400 hover:text-rose-300 inline-flex items-center self-start"
          >
            Review all dangerous exclusions <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* Coverage Gaps Quick Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Coverage Discrepancies & Gaps ({missing_coverages.length})
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Peer Variance
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Coverages provided in one or more quotes that are missing or sublimited in competing quotes.
            </p>

            <div className="space-y-2">
              {missing_coverages.slice(0, 3).map((mc, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{mc.coverage}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        mc.risk_level === 'High'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {mc.risk_level} Risk
                    </span>
                  </div>
                  <p className="text-slate-400 mt-1 line-clamp-1">
                    Missing in: <span className="text-rose-300">{mc.missing_in.join(', ')}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('gaps')}
            className="mt-4 text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center self-start"
          >
            Review all coverage gaps <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
