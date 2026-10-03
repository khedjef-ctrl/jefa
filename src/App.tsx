import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UploadView } from './components/UploadView';
import { ComparisonView } from './components/ComparisonView';
import { HistoryView } from './components/HistoryView';
import { PricingView } from './components/PricingView';
import { SuccessView } from './components/SuccessView';
import { CancelView } from './components/CancelView';
import { AdminDashboard } from './components/AdminDashboard';
import { SettingsModal } from './components/SettingsModal';
import { LegalModal } from './components/LegalModal';
import { AuthModal } from './components/AuthModal';
import { PrintProposalView } from './components/PrintProposalView';
import { PRESET_SCENARIOS } from './data/presetScenarios';
import { PRESET_ANALYSES_MAP } from './data/presetAnalyses';
import { 
  CommercialAnalysisOutput, 
  QuoteInputItem, 
  ClientContext, 
  HistoryItem, 
  AppSettings,
  UserProfile,
  SubscriptionPlanId
} from './types/insurance';
import { trackEvent } from './utils/analytics';
import { AlertCircle, ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'comparison' | 'history' | 'pricing' | 'admin'>('upload');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('contractor-hvac');
  
  // App Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('quotecompare_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      language: 'en',
      currency: 'USD',
      showRawJson: false,
    };
  });

  // User Profile & Authentication
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Settings & Legal Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);

  // URL Query Parameters check for /success or /cancel
  const [successSessionId, setSuccessSessionId] = useState<string | null>(null);
  const [successPlanId, setSuccessPlanId] = useState<string>('solo');
  const [isCancelView, setIsCancelView] = useState(false);

  // Client Details & Context
  const initialPreset = PRESET_SCENARIOS[0];
  const [clientName, setClientName] = useState<string>(initialPreset.namedInsured);
  const [agencyName, setAgencyName] = useState<string>('Heritage Independent Insurance Agency');
  const [clientContext, setClientContext] = useState<ClientContext>({
    businessType: 'Commercial HVAC, Refrigeration & Piping Contractor',
    state: 'OH',
    revenue: '$2,800,000',
    employees: '14 technicians',
    priorities: 'Broad Completed Operations, No Subcontractor Warranty, $1M Auto',
  });

  // Quotes List
  const [quotes, setQuotes] = useState<QuoteInputItem[]>(initialPreset.quotes);

  // Analysis State
  const [analysis, setAnalysis] = useState<CommercialAnalysisOutput | null>(
    PRESET_ANALYSES_MAP['contractor-hvac']
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0); // 0=idle, 1=uploading, 2=extracting, 3=comparing, 4=done
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [rawErrorResponse, setRawErrorResponse] = useState<string | null>(null);

  // History State (Persisted in localStorage, max 20)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('quotecompare_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse history from localStorage', e);
      }
    }
    return [];
  });

  // Auto-authenticate on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('policylens_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject('Invalid token')))
        .then((data) => {
          if (data.user) {
            setCurrentUser(data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem('policylens_token');
        });
    }

    // Check URL parameters for Stripe redirect
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session_id');
    const plan = urlParams.get('plan') || 'solo';
    if (session) {
      setSuccessSessionId(session);
      setSuccessPlanId(plan);
      // clean url
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('policylens_token');
    setCurrentUser(null);
    setActiveTab('upload');
  };

  // Save history to localStorage
  const saveAnalysisToHistory = (
    newAnalysis: CommercialAnalysisOutput,
    cName: string,
    ctx: ClientContext,
    qList: QuoteInputItem[]
  ) => {
    const carrierNames = newAnalysis.carriers.map((c) => c.carrier_name);
    const annualPremiums: Record<string, number> = {};
    newAnalysis.carriers.forEach((c) => {
      annualPremiums[c.carrier_name] = c.annual_premium;
    });

    const newItem: HistoryItem = {
      id: 'analysis-' + Date.now(),
      timestamp: new Date().toISOString(),
      clientName: cName || newAnalysis.carriers[0]?.named_insured || 'Commercial Client',
      carrierNames,
      annualPremiums,
      cheapestCarrier: newAnalysis.agent_recommendation.cheapest_option,
      clientContext: ctx,
      analysis: newAnalysis,
      quotes: qList,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 20); // Keep max 20
      localStorage.setItem('quotecompare_history', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle Preset Switching
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setAnalysisError(null);
    setRawErrorResponse(null);

    const foundPreset = PRESET_SCENARIOS.find((p) => p.id === presetId);
    if (foundPreset) {
      setQuotes(foundPreset.quotes);
      setClientName(foundPreset.namedInsured);
      setClientContext({
        businessType: foundPreset.businessType,
        state: 'OH',
        revenue: '$3,000,000',
        employees: '15',
        priorities: 'Best overall coverage & low deductibles',
      });
      if (PRESET_ANALYSES_MAP[presetId]) {
        setAnalysis(PRESET_ANALYSES_MAP[presetId]);
      }
    }
  };

  // Run Comparative Analysis via Gemini API
  const handleRunAnalysis = async () => {
    if (quotes.length < 2) {
      setAnalysisError('Please attach at least 2 commercial quote PDFs for comparative analysis.');
      return;
    }

    // Check plan limits
    if (currentUser && currentUser.analyses_limit !== -1 && currentUser.analyses_used >= currentUser.analyses_limit) {
      setUpgradeModalOpen(true);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setRawErrorResponse(null);
    setAnalysisStep(1); // Uploading PDFs...

    await new Promise((resolve) => setTimeout(resolve, 500));
    setAnalysisStep(2); // Extracting data...

    try {
      const token = localStorage.getItem('policylens_token') || currentUser?.token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const payload = {
        quotes: quotes.map((q) => ({
          id: q.id,
          carrierName: q.carrierName,
          fileName: q.fileName,
          fileType: q.fileType,
          base64Data: q.base64Data,
          textContent: q.textContent,
        })),
        clientName,
        agencyName,
        clientContext,
      };

      setAnalysisStep(3); // Comparing quotes...

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setRawErrorResponse(errorText);
        let errorMsg = `Server error (${response.status}): ${response.statusText}`;
        try {
          const parsed = JSON.parse(errorText);
          if (parsed.code === 'PLAN_LIMIT_REACHED') {
            setIsAnalyzing(false);
            setUpgradeModalOpen(true);
            return;
          }
          if (parsed.error) errorMsg = parsed.error;
        } catch (e) {
          // not json
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();

      if (!result.data) {
        throw new Error('API returned empty response or invalid JSON structure.');
      }

      setAnalysisStep(4); // Done
      setAnalysis(result.data);

      // Increment usage count locally
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          analyses_used: currentUser.analyses_used + 1,
        });
      }

      // Save to localStorage history
      saveAnalysisToHistory(result.data, clientName, clientContext, quotes);

      trackEvent('analysis_completed', {
        client: clientName,
        carrierCount: result.data.carriers?.length || quotes.length,
      });

      // Switch to Comparison Tab
      setTimeout(() => {
        setIsAnalyzing(false);
        setActiveTab('comparison');
      }, 500);

    } catch (err: any) {
      console.error('Comparative analysis failed:', err);
      setIsAnalyzing(false);
      setAnalysisStep(0);
      setAnalysisError(err.message || 'An unexpected error occurred during document extraction.');
    }
  };

  // Stripe Checkout Selection
  const handleSelectPlan = async (planId: SubscriptionPlanId, billingCycle: 'monthly' | 'yearly') => {
    try {
      const token = localStorage.getItem('policylens_token') || currentUser?.token;
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          planId,
          billingCycle,
          customerEmail: currentUser?.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize checkout');

      if (data.url) {
        if (data.url.startsWith('/')) {
          // Simulated development redirect
          setSuccessSessionId(data.sessionId || 'cs_test');
          setSuccessPlanId(planId);
        } else {
          // Live Stripe redirect
          window.location.href = data.url;
        }
      }
    } catch (err: any) {
      alert(`Checkout initialization notice: ${err.message}`);
    }
  };

  // Customer Portal Call
  const handleManageSubscription = async () => {
    try {
      const token = localStorage.getItem('policylens_token') || currentUser?.token;
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      const data = await res.json();
      if (data.url) {
        if (data.url.startsWith('/')) {
          setActiveTab('pricing');
        } else {
          window.location.href = data.url;
        }
      }
    } catch (e) {
      setActiveTab('pricing');
    }
  };

  // History Actions
  const handleViewHistoryItem = (item: HistoryItem) => {
    setAnalysis(item.analysis);
    setClientName(item.clientName);
    setClientContext(item.clientContext);
    setQuotes(item.quotes);
    setActiveTab('comparison');
  };

  const handleRerunHistoryItem = (item: HistoryItem) => {
    setClientName(item.clientName);
    setClientContext(item.clientContext);
    setQuotes(item.quotes);
    setActiveTab('upload');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('quotecompare_history', JSON.stringify(updated));
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem('quotecompare_history');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16">
      {/* Top Navigation Bar with PolicyLens Branding */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasAnalysis={!!analysis}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error notification banner */}
        {analysisError && (
          <div className="mb-6 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    PolicyLens Processing Notice
                  </h4>
                  <p className="text-xs text-rose-100 mt-1 leading-relaxed">
                    {analysisError}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAnalysisError(null)}
                className="text-xs text-rose-400 hover:text-white font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            {/* If unreadable PDF error */}
            {analysisError.toLowerCase().includes('scanned') && (
              <div className="p-3 bg-rose-950/60 rounded-xl border border-rose-800 text-xs text-rose-200 font-medium">
                This PDF appears to be scanned. Please upload a text-based PDF or a higher-resolution scan.
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handleRunAnalysis}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer"
              >
                Retry Analysis
              </button>
              <button
                onClick={() => window.open('mailto:support@policylens.ai?subject=PolicyLens%20Issue%20Report')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white transition"
              >
                Report Issue
              </button>
            </div>
          </div>
        )}

        {/* View Routing */}
        {successSessionId ? (
          <SuccessView
            planId={successPlanId}
            sessionId={successSessionId}
            onContinueToApp={() => {
              setSuccessSessionId(null);
              setActiveTab('upload');
            }}
          />
        ) : isCancelView ? (
          <CancelView
            onReturnToPricing={() => {
              setIsCancelView(false);
              setActiveTab('pricing');
            }}
            onReturnToApp={() => {
              setIsCancelView(false);
              setActiveTab('upload');
            }}
          />
        ) : (
          <>
            {/* TAB 1: UPLOAD TAB */}
            {activeTab === 'upload' && (
              <UploadView
                quotes={quotes}
                setQuotes={setQuotes}
                clientName={clientName}
                setClientName={setClientName}
                agencyName={agencyName}
                setAgencyName={setAgencyName}
                clientContext={clientContext}
                setClientContext={setClientContext}
                onAnalyze={handleRunAnalysis}
                isAnalyzing={isAnalyzing}
                analysisStep={analysisStep}
                onSelectPreset={handleSelectPreset}
                selectedPresetId={selectedPresetId}
                currentUser={currentUser}
                onOpenPricing={() => setActiveTab('pricing')}
              />
            )}

            {/* TAB 2: COMPARISON TAB */}
            {activeTab === 'comparison' && analysis && (
              <ComparisonView
                analysis={analysis}
                clientName={clientName}
                agencyName={agencyName}
                clientContext={clientContext}
                showRawJson={settings.showRawJson}
                onPrintPreview={() => setIsPrintViewOpen(true)}
                currentUser={currentUser}
                onOpenPricing={() => setActiveTab('pricing')}
              />
            )}

            {/* TAB 3: HISTORY TAB */}
            {activeTab === 'history' && (
              <HistoryView
                history={history}
                onViewItem={handleViewHistoryItem}
                onRerunItem={handleRerunHistoryItem}
                onDeleteItem={handleDeleteHistoryItem}
                onClearAll={handleClearAllHistory}
              />
            )}

            {/* TAB 4: PRICING TAB */}
            {activeTab === 'pricing' && (
              <PricingView
                currentUser={currentUser}
                onSelectPlan={handleSelectPlan}
                onOpenAuth={(mode) => {
                  setAuthModalMode(mode);
                  setAuthModalOpen(true);
                }}
                onManageSubscription={handleManageSubscription}
              />
            )}

            {/* TAB 5: ADMIN DASHBOARD TAB */}
            {activeTab === 'admin' && (
              <AdminDashboard
                currentUser={currentUser}
                onClose={() => setActiveTab('upload')}
              />
            )}
          </>
        )}
      </main>

      {/* Fixed Footer with Mandatory Disclaimer & Legal Links (Requirement #11) */}
      <footer className="fixed bottom-0 inset-x-0 z-30 bg-[#1e3a5f]/95 backdrop-blur-md border-t border-slate-700/80 py-2.5 px-4 text-center text-[11px] text-slate-300 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
          <p className="font-medium text-slate-200">
            PolicyLens provides informational comparisons only. Not legal or coverage advice. Verify all details with the carrier.
          </p>
          <div className="flex items-center space-x-3 text-slate-400 font-semibold">
            <button
              onClick={() => setLegalModalType('terms')}
              className="hover:text-emerald-300 underline transition cursor-pointer"
            >
              Terms
            </button>
            <span>•</span>
            <button
              onClick={() => setLegalModalType('privacy')}
              className="hover:text-emerald-300 underline transition cursor-pointer"
            >
              Privacy
            </button>
          </div>
        </div>
      </footer>

      {/* Upgrade / Quota Reached Modal */}
      {upgradeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Monthly Comparison Limit Reached</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You have utilized all comparisons allocated to your current plan. Upgrade to Solo Agent or Small Agency to unlock additional comparisons, watermark-free PDF exports, and priority processing.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setUpgradeModalOpen(false);
                  setActiveTab('pricing');
                }}
                className="w-full py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer text-xs"
              >
                View Plans & Upgrade
              </button>
              <button
                onClick={() => setUpgradeModalOpen(false)}
                className="w-full py-2.5 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />

      {/* Legal Modals (Terms & Privacy) */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* Print / Proposal PDF Full Preview */}
      {isPrintViewOpen && analysis && (
        <PrintProposalView
          analysis={analysis}
          clientName={clientName}
          agencyName={agencyName}
          currentUser={currentUser}
          onClose={() => setIsPrintViewOpen(false)}
        />
      )}
    </div>
  );
}
