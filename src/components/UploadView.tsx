import React, { useState, useRef } from 'react';
import { 
  FileUp, 
  Upload, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  DollarSign, 
  Users, 
  MapPin, 
  Sliders, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Clock,
  Layers,
  Lock
} from 'lucide-react';
import { QuoteInputItem, ClientContext, UserProfile } from '../types/insurance';
import { PRESET_SCENARIOS } from '../data/presetScenarios';
import { trackEvent } from '../utils/analytics';

interface UploadViewProps {
  quotes: QuoteInputItem[];
  setQuotes: React.Dispatch<React.SetStateAction<QuoteInputItem[]>>;
  clientName: string;
  setClientName: (name: string) => void;
  agencyName: string;
  setAgencyName: (name: string) => void;
  clientContext: ClientContext;
  setClientContext: React.Dispatch<React.SetStateAction<ClientContext>>;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysisStep: number; // 0=idle, 1=uploading, 2=extracting, 3=comparing, 4=done
  onSelectPreset: (presetId: string) => void;
  selectedPresetId: string;
  currentUser: UserProfile | null;
  onOpenPricing: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  quotes,
  setQuotes,
  clientName,
  setClientName,
  agencyName,
  setAgencyName,
  clientContext,
  setClientContext,
  onAnalyze,
  isAnalyzing,
  analysisStep,
  onSelectPreset,
  selectedPresetId,
  currentUser,
  onOpenPricing,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const uploadZoneRef = useRef<HTMLDivElement | null>(null);

  const scrollToUpload = () => {
    uploadZoneRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setFileError(null);

    trackEvent('upload_started', { count: files.length });

    if (quotes.length + files.length > 5) {
      setFileError('PolicyLens accepts a maximum of 5 commercial quote PDFs per comparison.');
      return;
    }

    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

    Array.from(files).forEach((file) => {
      // Validate PDF format
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        setFileError(`Invalid file format: "${file.name}". Please upload text-based .pdf quote files only.`);
        return;
      }

      // Validate 20 MB size limit
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File "${file.name}" exceeds the maximum limit of 20 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = reader.result as string;

        // Check for password protection marker (/Encrypt)
        const sampleHeader = atob(base64Data.slice(28, 5000) || '');
        if (sampleHeader.includes('/Encrypt')) {
          setFileError(`File "${file.name}" is password-protected. Please upload an unprotected PDF quote.`);
          return;
        }

        const newQuote: QuoteInputItem = {
          id: 'quote-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          carrierName: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
          fileName: file.name,
          fileType: 'application/pdf',
          fileSize: (file.size / 1024).toFixed(1) + ' KB',
          base64Data: base64Data,
          textContent: `[Uploaded PDF: ${file.name} - ${(file.size / 1024).toFixed(1)} KB]`,
          isPreset: false,
        };

        setQuotes((prev) => [...prev, newQuote]);
      };
    });

    e.target.value = '';
  };

  const handleRemoveQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  const updateCarrierName = (id: string, name: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, carrierName: name } : q))
    );
  };

  const stepLabels = [
    'Ready',
    'Uploading PDFs...',
    'Extracting data...',
    'Comparing quotes...',
    'Done',
  ];

  return (
    <div className="space-y-10">
      {/* 1. Landing Hero Section (PolicyLens Branding & Tagline) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e3a5f] via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Commercial Insurance Comparative Analysis</span>
          </div>

          {/* Requirement 4: Landing hero headline */}
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Compare commercial insurance quotes in 60 seconds
          </h1>

          {/* Requirement 3: Tagline */}
          <p className="text-lg sm:text-xl text-emerald-400 font-bold">
            5 carrier quotes. 1 clear comparison. 60 seconds.
          </p>

          {/* Requirement 5: Sub-headline */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            PolicyLens turns 5 carrier PDFs into one client-ready comparison. Built for US independent insurance agents.
          </p>

          {/* 3 Benefit Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start space-x-2.5">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-white block">Save 3+ Hours</strong>
                <span className="text-[11px] text-slate-400">Instant side-by-side matrix across all carriers</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-white block">Uncover Red Flags</strong>
                <span className="text-[11px] text-slate-400">Page-cited pollution & subcontractor traps</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-white block">Client-Ready PDF</strong>
                <span className="text-[11px] text-slate-400">1-click branded export with plain English summaries</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={scrollToUpload}
              className="px-6 py-3 rounded-xl text-sm font-bold bg-[#10b981] hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition flex items-center space-x-2 cursor-pointer"
            >
              <span>Start Free Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick 1-click Preset Selector */}
            <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-3 py-2 rounded-xl text-xs">
              <span className="text-slate-400">Sample Carrier Quotes:</span>
              <div className="flex space-x-1.5">
                {PRESET_SCENARIOS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectPreset(p.id)}
                    className={`px-2.5 py-1 rounded font-semibold transition ${
                      selectedPresetId === p.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700/60 text-slate-300 hover:text-white'
                    }`}
                  >
                    {p.id.split('-')[0].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Drag & Drop Upload Zone */}
      <div ref={uploadZoneRef} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileUp className="w-5 h-5 text-emerald-400" />
              <span>Upload Carrier Quotes (2 to 5 PDFs)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload commercial quotes from Travelers, Hartford, Chubb, CNA, Liberty Mutual, etc.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {quotes.length} of 5 loaded
            </span>
          </div>
        </div>

        {/* Error notification if file issue */}
        {fileError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 flex items-start justify-between text-xs">
            <div className="flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{fileError}</span>
            </div>
            <button
              onClick={() => setFileError(null)}
              className="text-rose-400 hover:text-white font-bold ml-3"
            >
              Dismiss
            </button>
          </div>
        )}

        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${
            dragOver
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-slate-700 hover:border-slate-600 bg-slate-900/60'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const fakeEvent = {
                target: { files: e.dataTransfer.files },
              } as any;
              handleFileUpload(fakeEvent);
            }
          }}
        >
          <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shadow-inner">
              <Upload className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                Drag and drop commercial quote PDFs here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Only <strong className="text-slate-200">.pdf</strong> files supported (max 20 MB each). Text-based PDFs recommended.
              </p>
            </div>

            <label className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-[#1e3a5f] hover:bg-blue-900 text-white cursor-pointer transition shadow-md border border-blue-700/50">
              <FileUp className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              <span>Browse Quote PDFs</span>
              <input
                type="file"
                multiple
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 3. Uploaded File List with Sizes and Remove Buttons */}
        {quotes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 uppercase tracking-wider">
                Attached Quote Documents ({quotes.length})
              </span>
              <span>Minimum 2 required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quotes.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex items-start justify-between"
                >
                  <div className="flex items-start space-x-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-blue-950 text-blue-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <input
                        type="text"
                        value={q.carrierName}
                        onChange={(e) => updateCarrierName(q.id, e.target.value)}
                        placeholder="Carrier Name"
                        className="text-xs font-bold text-white bg-transparent border-b border-transparent hover:border-slate-600 focus:border-emerald-400 focus:outline-none w-full truncate"
                      />
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="truncate max-w-[120px]">{q.fileName}</span>
                        <span>•</span>
                        <span className="font-mono text-emerald-400">{q.fileSize || 'PDF'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveQuote(q.id)}
                    className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Remove quote"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Optional Client Context Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Client Underwriting Profile & Priorities (Optional)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">Helps tailor coverage recommendations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Named Insured */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Named Insured / Business Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Apex Mechanical Solutions LLC"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Industry / Business Description
              </label>
              <input
                type="text"
                value={clientContext.businessType}
                onChange={(e) =>
                  setClientContext({ ...clientContext, businessType: e.target.value })
                }
                placeholder="e.g. Commercial HVAC & Piping Contractor"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Operating State(s)
              </label>
              <input
                type="text"
                value={clientContext.state}
                onChange={(e) =>
                  setClientContext({ ...clientContext, state: e.target.value })
                }
                placeholder="e.g. OH, PA, IN"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Revenue */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Annual Revenue
              </label>
              <input
                type="text"
                value={clientContext.revenue}
                onChange={(e) =>
                  setClientContext({ ...clientContext, revenue: e.target.value })
                }
                placeholder="e.g. $3,500,000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Employees */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Full-Time Employees
              </label>
              <input
                type="text"
                value={clientContext.employees}
                onChange={(e) =>
                  setClientContext({ ...clientContext, employees: e.target.value })
                }
                placeholder="e.g. 18 field technicians"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Priorities */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Key Client Priorities
              </label>
              <input
                type="text"
                value={clientContext.priorities}
                onChange={(e) =>
                  setClientContext({ ...clientContext, priorities: e.target.value })
                }
                placeholder="e.g. No subcontractor warranty, $2M Umbrella"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 5. Progress Bar During Analysis */}
        {isAnalyzing && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-4 animate-pulse">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>PolicyLens AI Extracting & Comparing...</span>
              </span>
              <span className="text-emerald-400 font-semibold font-mono">
                {stepLabels[analysisStep] || 'Processing...'}
              </span>
            </div>

            {/* Stepped progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-emerald-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{
                  width: `${(analysisStep / 4) * 100}%`,
                }}
              ></div>
            </div>

            {/* Step markers */}
            <div className="grid grid-cols-4 text-center text-[10px] text-slate-400">
              <span className={analysisStep >= 1 ? 'text-emerald-300 font-bold' : ''}>1. Uploading PDFs</span>
              <span className={analysisStep >= 2 ? 'text-emerald-300 font-bold' : ''}>2. Extracting data</span>
              <span className={analysisStep >= 3 ? 'text-emerald-300 font-bold' : ''}>3. Comparing</span>
              <span className={analysisStep >= 4 ? 'text-emerald-300 font-bold' : ''}>4. Done</span>
            </div>
          </div>
        )}

        {/* 6. Primary Large "Analyze Quotes" Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || quotes.length < 2}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl text-base font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-xl shadow-emerald-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Analyzing {quotes.length} Carrier Quotes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Analyze Quotes ({quotes.length} Loaded)</span>
              </>
            )}
          </button>
        </div>

        {quotes.length < 2 && (
          <p className="text-center text-xs text-amber-400 font-medium">
            Please ensure at least 2 quotes are attached to initiate comparative analysis.
          </p>
        )}
      </div>
    </div>
  );
};
