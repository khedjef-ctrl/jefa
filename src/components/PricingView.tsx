import React, { useState } from 'react';
import { PRICING_TIERS } from '../data/pricingTiers';
import { UserProfile, SubscriptionPlanId } from '../types/insurance';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Building2, 
  Users, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface PricingViewProps {
  currentUser: UserProfile | null;
  onSelectPlan: (planId: SubscriptionPlanId, billingCycle: 'monthly' | 'yearly') => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onManageSubscription?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  currentUser,
  onSelectPlan,
  onOpenAuth,
  onManageSubscription,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleCtaClick = (tierId: SubscriptionPlanId) => {
    trackEvent('plan_selected', { plan: tierId, cycle: billingCycle });

    if (!currentUser && tierId !== 'free') {
      onOpenAuth('signup');
      return;
    }

    onSelectPlan(tierId, billingCycle);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple, Transparent Pricing for Commercial Lines</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Supercharge your agency's quote turnaround
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          14-day free trial on Solo Agent. Cancel anytime. No credit card required to start free.
        </p>

        {/* Monthly / Yearly Toggle (Save 20%) */}
        <div className="pt-2 flex items-center justify-center space-x-3">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
            Monthly Billing
          </span>

          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition duration-300 cursor-pointer ${
              billingCycle === 'yearly' ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-slate-950 w-5 h-5 rounded-full shadow-md transform transition duration-300 ${
                billingCycle === 'yearly' ? 'translate-x-7' : ''
              }`}
            />
          </button>

          <span className={`text-xs font-bold flex items-center space-x-1.5 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_TIERS.map((tier) => {
          const isCurrentPlan = currentUser?.plan === tier.id;
          const displayPrice = billingCycle === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice;

          return (
            <div
              key={tier.id}
              className={`rounded-3xl p-6 transition flex flex-col justify-between relative ${
                tier.highlighted
                  ? 'bg-gradient-to-b from-[#1e3a5f] to-slate-900 border-2 border-emerald-500 shadow-2xl shadow-emerald-950/40 ring-1 ring-emerald-400/50'
                  : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Highlighted Badge */}
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                  Most Popular for Independent Agents
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white tracking-tight">{tier.name}</h3>
                  {isCurrentPlan && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      Your Current Plan
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="mb-4">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      ${displayPrice}
                    </span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                    {tier.analysesLimitLabel}
                  </p>
                  {billingCycle === 'yearly' && tier.monthlyPrice > 0 && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Billed annually (${tier.yearlyPrice * 12}/yr)
                    </p>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 text-xs text-slate-300 mb-6 border-t border-slate-800/80 pt-4">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div>
                {isCurrentPlan ? (
                  <button
                    onClick={onManageSubscription}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Manage Subscription</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleCtaClick(tier.id)}
                    className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md ${
                      tier.highlighted
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enterprise / Security Footnote */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-white">Need custom carrier templates or AMS360/Applied Epic integration?</h4>
            <p className="text-slate-400">PolicyLens Enterprise integrates directly with your agency management system and workflow.</p>
          </div>
        </div>
        <a
          href="mailto:sales@policylens.ai"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold shrink-0 transition"
        >
          Talk to Enterprise Sales
        </a>
      </div>
    </div>
  );
};
