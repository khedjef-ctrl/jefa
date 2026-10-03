import React from 'react';
import { PremiumAnalysis, CarrierDetail } from '../types/insurance';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CreditCard, 
  BarChart3, 
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface PremiumAnalysisViewProps {
  premiumAnalysis: PremiumAnalysis;
  carriers: CarrierDetail[];
}

export const PremiumAnalysisView: React.FC<PremiumAnalysisViewProps> = ({
  premiumAnalysis,
  carriers,
}) => {
  const avg = premiumAnalysis.average_premium || 0;
  const maxPremium = Math.max(...carriers.map((c) => c.annual_premium || 0), 1);

  return (
    <div className="space-y-6">
      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Premium */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Market Benchmark (Average)</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ${Math.round(avg).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across {carriers.length} quoting carriers
          </span>
        </div>

        {/* Highest Premium */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Highest Quoted</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-300">
            ${premiumAnalysis.highest_premium?.amount?.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block truncate">
            {premiumAnalysis.highest_premium?.carrier}
          </span>
        </div>

        {/* Lowest Premium */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Lowest Quoted</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300">
            ${premiumAnalysis.lowest_premium?.amount?.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block truncate">
            {premiumAnalysis.lowest_premium?.carrier}
          </span>
        </div>

        {/* Spread / Percentage Difference */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Market Price Spread</span>
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            {premiumAnalysis.percentage_difference ? `${premiumAnalysis.percentage_difference.toFixed(1)}%` : '0%'}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Between low and high quote
          </span>
        </div>
      </div>

      {/* Visual Premium Comparison Chart */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Visual Carrier Premium Comparison & Spread
            </h3>
            <p className="text-xs text-slate-400">
              Quotes exceeding ±25% from the market average are automatically flagged per Rule 8.
            </p>
          </div>
          <span className="text-xs text-blue-400 font-semibold px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">
            Rule 8 Active
          </span>
        </div>

        <div className="space-y-4 pt-2">
          {carriers.map((c, idx) => {
            const pctOfMax = ((c.annual_premium || 0) / maxPremium) * 100;
            const diffFromAvg = avg ? (((c.annual_premium - avg) / avg) * 100) : 0;
            const isOutlier = Math.abs(diffFromAvg) >= 25;

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{c.carrier_name}</span>
                    {isOutlier && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {diffFromAvg > 0 ? '+25% Over Avg' : '-25% Below Avg'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-slate-400 text-xs">
                      {diffFromAvg > 0 ? `+${diffFromAvg.toFixed(1)}%` : `${diffFromAvg.toFixed(1)}%`} vs avg
                    </span>
                    <span className="font-extrabold text-white text-sm">
                      ${c.annual_premium?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      diffFromAvg > 20
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-500'
                        : diffFromAvg < -20
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    }`}
                    style={{ width: `${Math.max(pctOfMax, 5)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Commentary */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div className="flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-300 uppercase tracking-wider block">
                Senior Underwriter Pricing Commentary:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {premiumAnalysis.commentary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Options Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Payment Terms & Installment Plans
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {carriers.map((carrier, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2 text-xs"
            >
              <span className="font-bold text-white block text-sm">
                {carrier.carrier_name}
              </span>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">
                  Quoted Schedule
                </span>
                <p className="font-medium text-slate-200">
                  {carrier.payment_terms || 'Annual pay in full'}
                </p>
              </div>
              <div className="flex justify-between items-center text-slate-400 pt-1 text-[11px]">
                <span>Annual Premium:</span>
                <span className="font-bold text-white">
                  ${carrier.annual_premium?.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
