import React from 'react';
import { ArrowLeft, Sparkles, ShieldAlert } from 'lucide-react';

interface CancelViewProps {
  onReturnToPricing: () => void;
  onReturnToApp: () => void;
}

export const CancelView: React.FC<CancelViewProps> = ({
  onReturnToPricing,
  onReturnToApp,
}) => {
  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
        <Sparkles className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          No worries. You can upgrade anytime.
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Your free account remains active with 3 free lifetime commercial quote comparisons. When your agency is ready to unlock watermark-free PDF exports and unlimited comparisons, we'll be right here.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
        <button
          onClick={onReturnToApp}
          className="px-5 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer"
        >
          Return to PolicyLens App
        </button>

        <button
          onClick={onReturnToPricing}
          className="px-5 py-2.5 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
        >
          View Pricing Plans
        </button>
      </div>
    </div>
  );
};
