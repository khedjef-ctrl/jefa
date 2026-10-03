import React, { useState } from 'react';
import { 
  CommercialAnalysisOutput, 
  ClientContext, 
  UnderwriterQuestion 
} from '../types/insurance';
import { 
  Award, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileSpreadsheet, 
  CheckCircle2, 
  HelpCircle, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Calendar, 
  Building2, 
  AlertTriangle, 
  Mail, 
  ShieldCheck, 
  Code,
  FileText,
  AlertCircle
} from 'lucide-react';
import { PremiumChart } from './PremiumChart';
import { exportProposalToPdf } from '../utils/pdfExport';
import { trackEvent } from '../utils/analytics';

interface ComparisonViewProps {
  analysis: CommercialAnalysisOutput;
  clientName: string;
  agencyName: string;
  clientContext?: ClientContext;
  showRawJson: boolean;
  onPrintPreview: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  analysis,
  clientName,
  agencyName,
  clientContext,
  showRawJson,
  onPrintPreview,
}) => {
  const {
    carriers,
    comparison_table,
    red_flags,
    missing_coverages,
    premium_analysis,
    agent_recommendation,
    questions_for_underwriter,
    client_summary_email,
  } = analysis;

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Identify cheapest carrier
  const cheapestCarrierName = agent_recommendation.cheapest_option;

  const handleCopyEmail = () => {
    const text = `Subject: ${client_summary_email.subject}\n\n${client_summary_email.body}`;
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    trackEvent('email_copied', { client: clientName });
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyQuestions = () => {
    const text = questions_for_underwriter
      .map(
        (q, i) =>
          `[${i + 1}] Carrier: ${q.carrier_name}\nQuestion: ${q.question}\nUnderwriting Reason: ${q.reason}\n`
      )
      .join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const toggleQuestionCheck = (idx: number) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      await exportProposalToPdf(analysis, clientName, agencyName, clientContext);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Bar (Download PDF, Print, Copy JSON) */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-extrabold text-white">
              Executive Comparative Analysis Report
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {carriers.length} Quotes Analyzed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Prepared for <strong className="text-slate-200">{clientName || carriers[0]?.named_insured || 'Commercial Client'}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download PDF Report Button (Requirement #3) */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#10b981] hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {isExportingPdf ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Report</span>
              </>
            )}
          </button>

          <button
            onClick={onPrintPreview}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
            title="Open browser print preview"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleCopyJson}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
            title="Copy raw JSON output"
          >
            {copiedJson ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>JSON Copied</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. AGENT RECOMMENDATION CARD AT TOP */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1e3a5f] via-slate-900 to-slate-950 border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
          <Award className="w-4 h-4" />
          <span>Independent Agent Decision Framework</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-4">
          Underwriting Recommendation & Strategic Assessment
        </h3>

        {/* 3 Decision Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Best Overall Value
            </span>
            <div className="text-base font-extrabold text-blue-300">
              {agent_recommendation.best_overall_value}
            </div>
            <p className="text-[11px] text-slate-400">
              Optimal balance between comprehensive endorsements and competitive pricing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Best Coverage
            </span>
            <div className="text-base font-extrabold text-emerald-300">
              {agent_recommendation.best_coverage}
            </div>
            <p className="text-[11px] text-slate-400">
              Highest policy limits, least restrictive terms, superior claims reputation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/40 bg-emerald-950/20 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Cheapest Option
            </span>
            <div className="text-base font-extrabold text-emerald-300">
              {agent_recommendation.cheapest_option}
            </div>
            <p className="text-[11px] text-slate-400">
              Lowest upfront annual expenditure (verify exclusion carve-outs).
            </p>
          </div>
        </div>

        {/* Analyst Rationale */}
        <div className="mt-4 p-4 rounded-2xl bg-blue-950/50 border border-blue-900/60 text-xs">
          <strong className="text-blue-200 block mb-1 uppercase tracking-wider text-[11px]">
            Senior Analyst Technical Rationale:
          </strong>
          <p className="text-slate-300 leading-relaxed">
            {agent_recommendation.reasoning}
          </p>
        </div>
      </div>

      {/* 2. HEADER CARDS: ONE PER CARRIER WITH CHEAPEST HIGHLIGHTED IN GREEN */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Quoting Carriers ({carriers.length})
          </h3>
          <span className="text-xs text-slate-400">
            Cheapest quote highlighted in <strong className="text-emerald-400">Green</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {carriers.map((carrier, idx) => {
            const isCheapest = carrier.carrier_name === cheapestCarrierName;

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                  isCheapest
                    ? 'bg-emerald-950/30 border-emerald-500 shadow-xl shadow-emerald-950/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400">Quote #{idx + 1}</span>
                    {isCheapest && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-sm">
                        Cheapest Quote
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-extrabold text-white tracking-tight line-clamp-1">
                    {carrier.carrier_name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Policy #: <span className="font-mono text-slate-300">{carrier.policy_number}</span>
                  </p>

                  {/* Premium Display */}
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Estimated Annual Premium
                      </span>
                      <span className={`text-2xl font-black ${isCheapest ? 'text-emerald-400' : 'text-white'}`}>
                        ${carrier.annual_premium?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Policy Info */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Effective Term:</span>
                      <span className="text-slate-200 font-medium">
                        {carrier.effective_date} - {carrier.expiration_date}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Plan:</span>
                      <span className="text-slate-300 text-right truncate max-w-[160px]">
                        {carrier.payment_terms || 'Annual pay'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SIDE-BY-SIDE COMPARISON TABLE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Side-by-Side Coverage & Limits Table
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Deductibles &gt; $5,000 flagged with caution badge
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-2xl bg-slate-900">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/90 border-b border-slate-700 text-slate-300">
                <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider w-1/4 sticky left-0 bg-slate-800/95 z-10">
                  Coverage Line
                </th>
                {carriers.map((carrier, idx) => (
                  <th key={idx} className="py-3.5 px-4 text-xs font-bold">
                    <div className="text-white font-extrabold text-sm">{carrier.carrier_name}</div>
                    <div className="text-[11px] text-emerald-400 font-normal">
                      ${carrier.annual_premium?.toLocaleString()} / yr
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {comparison_table.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-bold text-white bg-slate-900/90 sticky left-0 z-10 border-r border-slate-800">
                    {row.coverage_line}
                  </td>
                  {carriers.map((carrier, cIdx) => {
                    const val = row.values.find(
                      (v) => v.carrier_name.toLowerCase() === carrier.carrier_name.toLowerCase()
                    ) || row.values[cIdx];

                    const deductibleNum = parseInt(val?.deductible?.replace(/[^0-9]/g, '') || '0', 10);
                    const isHighDeductible = deductibleNum > 5000;
                    const isMissing = !val || val.limit.toLowerCase().includes('not stated') || val.limit.toLowerCase().includes('excluded');

                    return (
                      <td key={cIdx} className="py-3.5 px-4 align-top space-y-1 border-r border-slate-800/60">
                        <div className={`font-bold text-sm ${isMissing ? 'text-amber-400 italic' : 'text-slate-100'}`}>
                          {val?.limit || 'Not stated'}
                        </div>
                        {val?.deductible && val.deductible !== 'N/A' && (
                          <div className="flex items-center space-x-1">
                            <span className="text-[10px] text-slate-400">Ded:</span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                isHighDeductible
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {val.deductible}
                              {isHighDeductible && ' ⚠️ (> $5k)'}
                            </span>
                          </div>
                        )}
                        {val?.notes && (
                          <p className="text-[11px] text-slate-400 leading-snug pt-1">
                            {val.notes}
                          </p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. RED FLAGS & DANGEROUS EXCLUSIONS (Low=gray, Medium=orange, High=red) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Critical Red Flags & Dangerous Exclusions (Rule 3 & 7)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Always cites carrier name & page reference
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {red_flags.map((flag, idx) => {
            const isHigh = flag.severity === 'High';
            const isMed = flag.severity === 'Medium';

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                  isHigh
                    ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/30'
                    : isMed
                    ? 'bg-amber-950/15 border-amber-500/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isHigh
                          ? 'bg-red-600 text-white border-red-500' // Red
                          : isMed
                          ? 'bg-amber-500 text-slate-950 border-amber-400' // Orange
                          : 'bg-slate-700 text-slate-300 border-slate-600' // Gray
                      }`}
                    >
                      {flag.severity} Severity
                    </span>
                    <span className="text-xs font-mono text-blue-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {flag.page_reference}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-white">
                    {flag.carrier_name}: {flag.issue}
                  </h4>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {flag.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. MISSING COVERAGES SECTION WITH RISK-LEVEL ICONS */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Coverage Gaps & Discrepancies Between Quotes (Rule 6)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missing_coverages.map((gap, idx) => {
            const isHigh = gap.risk_level === 'High';
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-white">
                    {gap.coverage}
                  </h4>
                  <div className="flex items-center space-x-1.5">
                    {isHigh ? (
                      <span className="p-1 rounded-full bg-red-500/20 text-red-400">
                        <AlertCircle className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-full bg-amber-500/20 text-amber-400">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                    )}
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isHigh ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {gap.risk_level} Risk
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                    <strong className="block text-[10px] uppercase font-bold text-emerald-400">Included in:</strong>
                    <span>{gap.present_in.join(', ')}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-300">
                    <strong className="block text-[10px] uppercase font-bold text-red-400">Missing in:</strong>
                    <span>{gap.missing_in.join(', ')}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 italic">
                  <strong>Recommendation:</strong> {gap.recommendation}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. PREMIUM ANALYSIS WITH SIMPLE BAR CHART (CHART.JS VIA CDN) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Premium Spread & Market Benchmark Analysis
            </h3>
            <p className="text-xs text-slate-400">
              Average Premium: <strong className="text-white">${premium_analysis.average_premium?.toLocaleString()}</strong> | Spread: <strong className="text-emerald-400">{premium_analysis.percentage_difference?.toFixed(1)}%</strong>
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Chart.js Active
          </span>
        </div>

        {/* Chart Canvas */}
        <PremiumChart
          carriers={carriers}
          premiumAnalysis={premium_analysis}
          cheapestCarrierName={cheapestCarrierName}
        />

        {/* Pricing Commentary */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
          <strong className="text-slate-200 block mb-1 uppercase tracking-wider text-[10px]">
            Pricing Analysis Commentary:
          </strong>
          <p>{premium_analysis.commentary}</p>
        </div>
      </div>

      {/* 7. QUESTIONS FOR UNDERWRITER AS A CHECKLIST */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Underwriter Inquiries & Clarification Checklist
            </h3>
          </div>

          <button
            onClick={handleCopyQuestions}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
          >
            {copiedQuestions ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Checklist</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-blue-400" />
                <span>Copy Questions</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-3">
          {questions_for_underwriter.map((q, idx) => (
            <div
              key={idx}
              onClick={() => toggleQuestionCheck(idx)}
              className={`p-4 rounded-xl border text-xs cursor-pointer transition flex items-start space-x-3 ${
                checkedQuestions[idx]
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-400 line-through'
                  : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={!!checkedQuestions[idx]}
                onChange={() => {}}
                className="mt-0.5 rounded text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <div className="space-y-1">
                <span className="font-bold text-white">{q.carrier_name}: </span>
                <span className="text-slate-300 font-medium">"{q.question}"</span>
                <p className="text-[11px] text-slate-400">Reason: {q.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. CLIENT SUMMARY EMAIL IN A COPY-TO-CLIPBOARD BOX */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Client Summary Email (Ready to Send)
            </h3>
          </div>

          <button
            onClick={handleCopyEmail}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#10b981] hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-950" />
                <span>Copy Email to Clipboard</span>
              </>
            )}
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
          <div className="pb-2 border-b border-slate-800 font-mono text-slate-300">
            <strong>Subject:</strong> {client_summary_email.subject}
          </div>
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
            {client_summary_email.body}
          </div>
        </div>

        {/* Rule 5 Mandatory Disclaimer Note */}
        <p className="text-[11px] text-slate-500 italic">
          * Concludes with the mandated Rule 5 informational disclaimer protecting the agency.
        </p>
      </div>

      {/* 9. RAW JSON (TOGGLED BY SETTINGS) */}
      {showRawJson && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Raw JSON Output (Rule 10 Verified)</span>
            </h3>
            <button
              onClick={handleCopyJson}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              {copiedJson ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
