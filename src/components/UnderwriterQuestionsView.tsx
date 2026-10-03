import React, { useState } from 'react';
import { UnderwriterQuestion } from '../types/insurance';
import { 
  HelpCircle, 
  Copy, 
  Check, 
  Send, 
  MessageSquare, 
  ShieldQuestion,
  Building,
  CheckCircle2
} from 'lucide-react';

interface UnderwriterQuestionsViewProps {
  questions: UnderwriterQuestion[];
}

export const UnderwriterQuestionsView: React.FC<UnderwriterQuestionsViewProps> = ({
  questions,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyOne = (q: UnderwriterQuestion, idx: number) => {
    const text = `To: ${q.carrier_name} Underwriting\nQuestion: ${q.question}\nReason/Context: ${q.reason}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleCopyAll = () => {
    const text = questions
      .map(
        (q, i) =>
          `[${i + 1}] Carrier: ${q.carrier_name}\nQuestion: ${q.question}\nUnderwriting Justification: ${q.reason}\n`
      )
      .join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Underwriter Inquiries & Clarification Checklist
            </h3>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {questions.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Precise questions for the quoting underwriters to negotiate broader terms, delete restrictive endorsements, or clarify ambiguities prior to binding.
          </p>
        </div>

        <button
          onClick={handleCopyAll}
          className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          {copiedAll ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              <span>Copied All Questions</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
              <span>Copy All to Clipboard</span>
            </>
          )}
        </button>
      </div>

      {/* Questions Cards */}
      <div className="space-y-4">
        {questions.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                  {idx + 1}
                </span>
                <span className="text-sm font-bold text-white">
                  {item.carrier_name}
                </span>
              </div>

              <button
                onClick={() => handleCopyOne(item, idx)}
                className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                title="Copy single question"
              >
                {copiedIdx === idx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400 mr-1" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400 mr-1" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Formal Underwriting Inquiry:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                "{item.question}"
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Technical Underwriting Reason & Agency Risk Justification:
              </span>
              <p className="text-slate-300">
                {item.reason}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pre-Binding Agency Best Practices */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Independent Agency Pre-Binding Verification Checklist</span>
        </h4>
        <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
          <li>Ensure named insured spelling and entity structure (LLC, Inc., Partnership) matches state corporate filings exactly.</li>
          <li>Confirm all requested additional insureds (landlords, general contractors) are covered under blanket or specific endorsements.</li>
          <li>Verify retroactive dates on any claims-made policies match the continuous coverage inception date without lapse.</li>
          <li>Obtain written confirmation on deductible amounts and exclusions before releasing the binder to the client.</li>
        </ul>
      </div>
    </div>
  );
};
