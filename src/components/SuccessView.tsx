import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { SubscriptionPlanId } from '../types/insurance';

interface SuccessViewProps {
  planId?: string;
  sessionId?: string;
  onContinueToApp: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  planId = 'solo',
  sessionId,
  onContinueToApp,
}) => {
  const planNames: Record<string, string> = {
    solo: 'Solo Agent',
    agency: 'Small Agency',
    enterprise: 'Enterprise',
    free: 'Free',
  };

  const planName = planNames[planId] || 'Solo Agent';
  const trialEndFormatted = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(
    'en-US',
    { dateStyle: 'long' }
  );

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
          Payment & Subscription Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Welcome to PolicyLens {planName}!
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
          Your 14-day free trial has been activated. Your trial ends on <strong className="text-emerald-400">{trialEndFormatted}</strong>.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-left space-y-3 max-w-md mx-auto text-xs">
        <span className="font-bold text-slate-300 uppercase tracking-wider block text-[11px]">
          Your Plan Privileges:
        </span>
        <ul className="space-y-2 text-slate-300">
          <li className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Watermark-free PDF comparative proposals</span>
          </li>
          <li className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Automated 10-rule commercial lines extraction</span>
          </li>
          <li className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Pre-formatted client proposal email with required legal notice</span>
          </li>
        </ul>
      </div>

      <div className="pt-2">
        <button
          onClick={onContinueToApp}
          className="px-8 py-3.5 rounded-2xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/25 transition inline-flex items-center space-x-2 cursor-pointer"
        >
          <span>Start Comparing Quotes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
