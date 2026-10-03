import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface LegalModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isTerms = type === 'terms';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-5 flex flex-col max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              {isTerms ? 'Terms of Service' : 'Privacy & Data Protection Policy'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto text-xs text-slate-300 space-y-4 leading-relaxed pr-2">
          {isTerms ? (
            <>
              <p className="font-semibold text-white">
                1. Informational Purpose Only (No Legal or Coverage Advice)
              </p>
              <p>
                QuoteCompare AI is an analytical tool built exclusively for independent insurance agents and brokers. The comparisons, red flag warnings, deductible alerts, and summary proposals produced by this application are for informational and preparatory purposes only. Coverage is strictly subject to the actual policy terms, conditions, definitions, limitations, and endorsements issued by the underwriting carrier.
              </p>
              <p className="font-semibold text-white">
                2. Professional Agent Duty of Care
              </p>
              <p>
                The licensed producer or agency is solely responsible for confirming all coverage forms, policy limits, deductibles, classifications, and binding terms with the underwriting carrier prior to delivering proposals or binding coverage on behalf of clients.
              </p>
              <p className="font-semibold text-white">
                3. Limitation of Liability
              </p>
              <p>
                QuoteCompare AI disclaims all liability for errors or omissions arising from distorted, incomplete, or unreadable source documents, optical character recognition ambiguities, or carrier endorsement interpretations.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-white">
                1. Client Confidentiality & Policy Data Handling
              </p>
              <p>
                QuoteCompare AI treats all uploaded policy declarations, quote documents, and client details with strict confidentiality. Document payloads are processed in-memory during analysis and are not indexed or used for model retraining.
              </p>
              <p className="font-semibold text-white">
                2. Local Storage Persistence
              </p>
              <p>
                Comparative analysis history and app settings are stored locally within your web browser’s localStorage. No third-party tracking cookies or advertising pixels are deployed.
              </p>
              <p className="font-semibold text-white">
                3. Privacy-Friendly Metrics
              </p>
              <p>
                Analytics hooks within this application operate locally for diagnostic purposes and do not transmit policyholder personal identification information (PII) or confidential underwriting files to external trackers.
              </p>
            </>
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
