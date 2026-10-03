import React from 'react';
import { ShieldCheck, X, FileText, Lock } from 'lucide-react';

interface LegalModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isTerms = type === 'terms';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 space-y-5 flex flex-col max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              {isTerms ? 'PolicyLens Terms of Service' : 'PolicyLens Privacy & Data Protection Policy'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto text-xs text-slate-300 space-y-4 leading-relaxed pr-2">
          {isTerms ? (
            <>
              <p className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                1. Informational Purpose Only (No Legal or Coverage Advice)
              </p>
              <p>
                PolicyLens provides informational comparisons only. Not legal or coverage advice. Verify all details with the carrier. PolicyLens is an analytical underwriting comparative assistant designed for licensed independent insurance agents, brokers, and risk managers. Coverage is strictly governed by the policy jackets, terms, conditions, definitions, exclusions, and endorsements issued by the underwriting insurance carrier.
              </p>

              <p className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                2. Professional Producer Duty of Care
              </p>
              <p>
                The licensed producer is solely responsible for verifying policy numbers, limits, deductibles, classifications, and binding warranties directly with the quoting underwriter prior to releasing proposals or binding coverage on behalf of commercial clients.
              </p>

              <p className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                3. Subscriptions & Billing
              </p>
              <p>
                PolicyLens offers monthly and annual billing plans processed securely via Stripe. Paid tiers provide specified monthly analysis allowances and watermark-free exports. Subscriptions may be modified or canceled anytime through the customer portal.
              </p>
            </>
          ) : (
            <>
              <p className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                1. Ephemeral PDF Processing & Zero Permanent Storage
              </p>
              <p>
                PolicyLens processes uploaded commercial insurance quote PDFs in-memory solely for optical data extraction and comparative matrix generation. We do NOT store uploaded quote PDFs permanently. All temporary document caches are deleted within 24 hours.
              </p>

              <p className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                2. User Data Control & Deletion
              </p>
              <p>
                Agents retain complete ownership of their client data. You may delete any or all past comparison history items at any time via the History tab. Account deletion requests can be submitted to privacy@policylens.ai.
              </p>

              <p className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                3. Security & Payments
              </p>
              <p>
                All payment transactions are encrypted and processed by Stripe. PolicyLens never stores complete credit card numbers or banking credentials on its servers.
              </p>
            </>
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
