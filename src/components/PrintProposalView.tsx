import React from 'react';
import { CommercialAnalysisOutput } from '../types/insurance';
import { ShieldCheck, Printer, X } from 'lucide-react';

interface PrintProposalViewProps {
  analysis: CommercialAnalysisOutput;
  clientName: string;
  agencyName: string;
  onClose: () => void;
}

export const PrintProposalView: React.FC<PrintProposalViewProps> = ({
  analysis,
  clientName,
  agencyName,
  onClose,
}) => {
  const {
    carriers,
    comparison_table,
    red_flags,
    missing_coverages,
    premium_analysis,
    agent_recommendation,
    client_summary_email,
  } = analysis;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 p-4 sm:p-8">
      {/* Non-printing Control Bar */}
      <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between print:hidden">
        <div className="flex items-center space-x-2">
          <Printer className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold text-white">
            Client-Facing Comparative Insurance Proposal (Print / PDF Preview)
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition flex items-center"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            <span>Print or Save as PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Exit Print View
          </button>
        </div>
      </div>

      {/* Printable Document Paper Sheet */}
      <div className="max-w-4xl mx-auto bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl print:shadow-none print:p-0 print:m-0 text-xs">
        {/* Proposal Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6 flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm tracking-wide uppercase mb-1">
              <ShieldCheck className="w-5 h-5 text-blue-800" />
              <span>{agencyName || 'Independent Commercial Insurance Agency'}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950">
              COMMERCIAL INSURANCE QUOTE COMPARISON
            </h1>
            <p className="text-slate-600 mt-1">
              Side-by-Side Coverage Analysis, Exclusion Review & Premium Evaluation
            </p>
          </div>

          <div className="text-right text-slate-600 space-y-1">
            <div className="font-bold text-slate-900">
              Prepared for: {carriers[0]?.named_insured || clientName || 'Commercial Client'}
            </div>
            <div>Date: {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</div>
            <div className="text-[11px] text-slate-500">Quotes Evaluated: {carriers.length} Carriers</div>
          </div>
        </div>

        {/* Executive Recommendation Box */}
        <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-300 space-y-3">
          <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            Agent Strategic Recommendation & Value Assessment
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="font-bold text-slate-500 block text-[10px] uppercase">Best Overall Value</span>
              <span className="font-bold text-slate-900 text-xs">{agent_recommendation.best_overall_value}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 block text-[10px] uppercase">Broadest Coverage</span>
              <span className="font-bold text-slate-900 text-xs">{agent_recommendation.best_coverage}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 block text-[10px] uppercase">Lowest Upfront Cost</span>
              <span className="font-bold text-slate-900 text-xs">{agent_recommendation.cheapest_option}</span>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed pt-1">
            <strong>Analyst Rationale: </strong>
            {agent_recommendation.reasoning}
          </p>
        </div>

        {/* Carrier Summary Table */}
        <div className="mb-6">
          <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 mb-2">
            1. Quoting Carriers & Premium Summary
          </h2>
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2.5 font-bold border-r border-slate-300">Carrier Name</th>
                <th className="p-2.5 font-bold border-r border-slate-300">Quote / Policy #</th>
                <th className="p-2.5 font-bold border-r border-slate-300">Policy Term</th>
                <th className="p-2.5 font-bold border-r border-slate-300">Payment Terms</th>
                <th className="p-2.5 font-bold text-right">Annual Premium</th>
              </tr>
            </thead>
            <tbody>
              {carriers.map((c, i) => (
                <tr key={i} className="border-b border-slate-200">
                  <td className="p-2.5 font-bold border-r border-slate-200">{c.carrier_name}</td>
                  <td className="p-2.5 font-mono border-r border-slate-200">{c.policy_number}</td>
                  <td className="p-2.5 border-r border-slate-200">{c.effective_date} - {c.expiration_date}</td>
                  <td className="p-2.5 border-r border-slate-200">{c.payment_terms}</td>
                  <td className="p-2.5 text-right font-black">${c.annual_premium?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[11px] text-slate-500">
            Average Premium: ${premium_analysis.average_premium?.toLocaleString()} | Spread: {premium_analysis.percentage_difference?.toFixed(1)}% between lowest and highest quote.
          </p>
        </div>

        {/* Side-by-Side Coverage Matrix */}
        <div className="mb-6">
          <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 mb-2">
            2. Detailed Coverage & Limits Comparison
          </h2>
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2 font-bold border-r border-slate-300 w-1/4">Coverage Line</th>
                {carriers.map((c, i) => (
                  <th key={i} className="p-2 font-bold border-r border-slate-300">
                    {c.carrier_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison_table.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-200">{row.coverage_line}</td>
                  {carriers.map((carrier, cIdx) => {
                    const val = row.values.find(
                      (v) => v.carrier_name.toLowerCase() === carrier.carrier_name.toLowerCase()
                    ) || row.values[cIdx];

                    return (
                      <td key={cIdx} className="p-2 border-r border-slate-200 align-top">
                        <div className="font-bold">{val?.limit || 'Not stated'}</div>
                        {val?.deductible && val.deductible !== 'N/A' && (
                          <div className="text-[10px] text-slate-600">Ded: {val.deductible}</div>
                        )}
                        {val?.notes && (
                          <div className="text-[10px] text-slate-500 mt-0.5">{val.notes}</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Critical Red Flags & Dangerous Exclusions */}
        <div className="mb-6">
          <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 mb-2 text-rose-900">
            3. Critical Red Flags & Restrictive Exclusions (Rule 3 & 7)
          </h2>
          <div className="space-y-2">
            {red_flags.map((flag, idx) => (
              <div key={idx} className="p-2.5 rounded border border-slate-200 bg-slate-50 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{flag.carrier_name} — {flag.issue}</span>
                  <span className="text-slate-600 font-mono text-[11px]">{flag.page_reference}</span>
                </div>
                <p className="text-slate-600 mt-1">{flag.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Gaps */}
        <div className="mb-6">
          <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 mb-2">
            4. Coverage Gaps Between Competing Quotes (Rule 6)
          </h2>
          <div className="space-y-2">
            {missing_coverages.map((gap, idx) => (
              <div key={idx} className="p-2.5 rounded border border-slate-200 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900">{gap.coverage}</span>
                  <span className="text-slate-500 font-normal">Risk: {gap.risk_level}</span>
                </div>
                <div className="text-slate-600 mt-0.5">
                  <strong>Included in:</strong> {gap.present_in.join(', ')} | <strong>Missing in:</strong> {gap.missing_in.join(', ')}
                </div>
                <p className="text-slate-700 mt-1 italic">Recommendation: {gap.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Rule 5 Disclaimer */}
        <div className="mt-8 pt-4 border-t-2 border-slate-900 text-center text-[10px] text-slate-500 leading-relaxed font-semibold">
          This comparison is for informational purposes only. Coverage is subject to the actual policy wording. Please confirm all details with your agent.
        </div>
      </div>
    </div>
  );
};
