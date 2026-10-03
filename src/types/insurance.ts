export type SubscriptionPlanId = 'free' | 'solo' | 'agency' | 'enterprise';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  agencyName?: string;
  plan: SubscriptionPlanId;
  analyses_used: number;
  analyses_limit: number; // 3 for free, 20 for solo, -1 for unlimited
  trial_ends_at: string | null;
  subscription_status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'none';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  role: 'user' | 'admin';
  created_at: string;
  token?: string;
}

export interface PlanPricingTier {
  id: SubscriptionPlanId;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number; // 20% discount
  analysesLimitLabel: string;
  analysesLimitNumber: number;
  watermark: boolean;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export interface ClientContext {
  businessType: string;
  state: string;
  revenue: string;
  employees: string;
  priorities: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  clientName: string;
  carrierNames: string[];
  annualPremiums: Record<string, number>;
  cheapestCarrier: string;
  clientContext: ClientContext;
  analysis: CommercialAnalysisOutput;
  quotes: QuoteInputItem[];
  userId?: string;
}

export interface AppSettings {
  language: 'en' | 'ar' | 'fr';
  currency: 'USD';
  showRawJson: boolean;
}

export interface AnalysisMetadata {
  number_of_quotes: number;
  carriers_detected: string[];
  analysis_date: string;
  warnings: string[];
}

export interface CarrierDetail {
  carrier_name: string;
  policy_number: string;
  quote_date: string;
  effective_date: string;
  expiration_date: string;
  annual_premium: number;
  payment_terms: string;
  named_insured: string;
  business_description: string;
}

export interface ComparisonValue {
  carrier_name: string;
  limit: string;
  deductible: string;
  notes: string;
}

export interface ComparisonTableRow {
  coverage_line: string;
  values: ComparisonValue[];
}

export interface KeyDifference {
  topic: string;
  explanation: string;
  carriers_affected: string[];
  why_it_matters: string;
}

export interface MissingCoverage {
  coverage: string;
  present_in: string[];
  missing_in: string[];
  risk_level: 'Low' | 'Medium' | 'High';
  recommendation: string;
}

export interface RedFlag {
  carrier_name: string;
  issue: string;
  page_reference: string;
  severity: 'Low' | 'Medium' | 'High';
  explanation: string;
}

export interface PremiumCarrierStat {
  carrier: string;
  amount: number;
}

export interface PremiumAnalysis {
  average_premium: number;
  highest_premium: PremiumCarrierStat;
  lowest_premium: PremiumCarrierStat;
  percentage_difference: number;
  commentary: string;
}

export interface UnderwriterQuestion {
  carrier_name: string;
  question: string;
  reason: string;
}

export interface ClientSummaryEmail {
  subject: string;
  body: string;
}

export interface AgentRecommendation {
  best_overall_value: string;
  best_coverage: string;
  cheapest_option: string;
  reasoning: string;
}

export interface CommercialAnalysisOutput {
  analysis_metadata: AnalysisMetadata;
  carriers: CarrierDetail[];
  comparison_table: ComparisonTableRow[];
  key_differences: KeyDifference[];
  missing_coverages: MissingCoverage[];
  red_flags: RedFlag[];
  premium_analysis: PremiumAnalysis;
  questions_for_underwriter: UnderwriterQuestion[];
  client_summary_email: ClientSummaryEmail;
  agent_recommendation: AgentRecommendation;
}

export interface QuoteInputItem {
  id: string;
  carrierName: string;
  fileName: string;
  fileType: string;
  fileSize?: string;
  base64Data?: string;
  textContent: string;
  isPreset?: boolean;
}

export interface QuotePresetScenario {
  id: string;
  title: string;
  businessType: string;
  namedInsured: string;
  description: string;
  quotes: QuoteInputItem[];
  precalculatedAnalysis?: CommercialAnalysisOutput;
}

export interface RateLimitStatus {
  hourlyAnalysesRemaining: number;
  dailyUploadsRemaining: number;
  hourlyResetTime: string;
  dailyResetTime: string;
}

export interface AdminAnalyticsData {
  totalUsers: number;
  activeSubscriptions: number;
  mrr: number;
  churnRate: number;
  recentSignups: Array<{
    id: string;
    email: string;
    plan: SubscriptionPlanId;
    created_at: string;
    status: string;
  }>;
  recentAnalyses: Array<{
    id: string;
    user_id: string;
    user_email: string;
    timestamp: string;
    carriers_count: number;
    carriers: string[];
    token_count?: number;
  }>;
  errorLogs: Array<{
    id: string;
    timestamp: string;
    type: string;
    message: string;
    user_email?: string;
  }>;
}
