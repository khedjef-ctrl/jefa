import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UploadView } from './components/UploadView';
import { ComparisonView } from './components/ComparisonView';
import { HistoryView } from './components/HistoryView';
import { SettingsModal } from './components/SettingsModal';
import { LegalModal } from './components/LegalModal';
import { PrintProposalView } from './components/PrintProposalView';
import { PRESET_SCENARIOS } from './data/presetScenarios';
import { PRESET_ANALYSES_MAP } from './data/presetAnalyses';
import { 
  CommercialAnalysisOutput, 
  QuoteInputItem, 
  ClientContext, 
  HistoryItem, 
  AppSettings 
} from './types/insurance';
import { trackEvent } from './utils/analytics';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'comparison' | 'history'>('upload');
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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);

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

    setIsAnalyzing(true);
    setAnalysisError(null);
    setRawErrorResponse(null);
    setAnalysisStep(1); // Uploading PDFs...

    // Step 1: Uploading PDFs
    await new Promise((resolve) => setTimeout(resolve, 600));
    setAnalysisStep(2); // Extracting data...

    try {
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

      const response = await fetch('/api/analyze-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setRawErrorResponse(errorText);
        let errorMsg = `Server error (${response.status}): ${response.statusText}`;
        try {
          const parsed = JSON.parse(errorText);
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
      {/* Top Navigation Bar with 3 Tabs */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasAnalysis={!!analysis}
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
                    Analysis Error Detected
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
              {rawErrorResponse && (
                <button
                  onClick={() => alert(`Raw server response:\n\n${rawErrorResponse}`)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white transition"
                >
                  Report Issue / View Raw Details
                </button>
              )}
            </div>
          </div>
        )}

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
      </main>

      {/* Fixed Footer with Mandatory Disclaimer & Legal Links (Requirement #8) */}
      <footer className="fixed bottom-0 inset-x-0 z-30 bg-[#1e3a5f]/95 backdrop-blur-md border-t border-slate-700/80 py-2.5 px-4 text-center text-[11px] text-slate-300 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
          <p className="font-medium text-slate-200">
            QuoteCompare AI provides informational comparisons only. Not legal or coverage advice. Verify all details with the carrier.
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

      {/* Settings Modal (Requirement #7) */}
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
          onClose={() => setIsPrintViewOpen(false)}
        />
      )}
    </div>
  );
}
