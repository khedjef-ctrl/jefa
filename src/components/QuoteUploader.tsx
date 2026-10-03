import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Plus, 
  AlertCircle, 
  CheckCircle, 
  FileUp, 
  Building,
  Info,
  X,
  FileCode,
  Sparkles
} from 'lucide-react';
import { QuoteInputItem, QuotePresetScenario } from '../types/insurance';
import { PRESET_SCENARIOS } from '../data/presetScenarios';

interface QuoteUploaderProps {
  quotes: QuoteInputItem[];
  setQuotes: React.Dispatch<React.SetStateAction<QuoteInputItem[]>>;
  isOpen: boolean;
  onClose: () => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  onSelectPreset: (presetId: string) => void;
  selectedPresetId: string;
  clientName: string;
  setClientName: (name: string) => void;
  agencyName: string;
  setAgencyName: (name: string) => void;
  analystNotes: string;
  setAnalystNotes: (notes: string) => void;
}

export const QuoteUploader: React.FC<QuoteUploaderProps> = ({
  quotes,
  setQuotes,
  isOpen,
  onClose,
  onRunAnalysis,
  isAnalyzing,
  onSelectPreset,
  selectedPresetId,
  clientName,
  setClientName,
  agencyName,
  setAgencyName,
  analystNotes,
  setAnalystNotes,
}) => {
  const [activeQuoteId, setActiveQuoteId] = useState<string>(quotes[0]?.id || '');
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (quotes.length + files.length > 5) {
      alert('The analysis accepts a maximum of 5 commercial insurance quotes at a time.');
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      if (file.type.includes('pdf')) {
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64Data = reader.result as string;
          const newQuote: QuoteInputItem = {
            id: 'quote-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
            carrierName: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
            fileName: file.name,
            fileType: 'application/pdf',
            fileSize: (file.size / 1024).toFixed(1) + ' KB',
            base64Data: base64Data,
            textContent: `[Uploaded PDF: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]\nGemini multimodal engine will extract dec pages, limits, and endorsements directly from the PDF bytes.`,
            isPreset: false,
          };
          setQuotes((prev) => [...prev, newQuote]);
          setActiveQuoteId(newQuote.id);
        };
      } else {
        // Text / Markdown
        reader.readAsText(file);
        reader.onload = () => {
          const text = reader.result as string;
          const newQuote: QuoteInputItem = {
            id: 'quote-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
            carrierName: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
            fileName: file.name,
            fileType: 'text/plain',
            fileSize: (file.size / 1024).toFixed(1) + ' KB',
            textContent: text,
            isPreset: false,
          };
          setQuotes((prev) => [...prev, newQuote]);
          setActiveQuoteId(newQuote.id);
        };
      }
    });

    e.target.value = '';
  };

  const handleAddManualQuote = () => {
    if (quotes.length >= 5) {
      alert('Maximum of 5 quotes allowed.');
      return;
    }
    const newQuote: QuoteInputItem = {
      id: 'quote-' + Date.now(),
      carrierName: `Carrier Quote #${quotes.length + 1}`,
      fileName: `Quote_${quotes.length + 1}.txt`,
      fileType: 'text/plain',
      fileSize: 'Manual Entry',
      textContent: `COMMERCIAL POLICY DECLARATIONS\nCARRIER: \nPOLICY NUMBER: \nNAMED INSURED: ${clientName || 'Small Business Client'}\nTERM: 12 Months\nANNUAL PREMIUM: $0.00\n\nCOVERAGE LIMITS:\nGeneral Liability Each Occurrence: $1,000,000\nGeneral Aggregate: $2,000,000\nProducts/Completed Ops: $2,000,000\nDamage to Rented Premises: $100,000\nDeductible: $1,000\n\nEXCLUSIONS & NOTES:\n`,
      isPreset: false,
    };
    setQuotes((prev) => [...prev, newQuote]);
    setActiveQuoteId(newQuote.id);
  };

  const handleRemoveQuote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (quotes.length <= 2) {
      alert('A minimum of 2 quotes is required for comparative analysis.');
      return;
    }
    const filtered = quotes.filter((q) => q.id !== id);
    setQuotes(filtered);
    if (activeQuoteId === id) {
      setActiveQuoteId(filtered[0]?.id || '');
    }
  };

  const updateActiveQuote = (field: keyof QuoteInputItem, val: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === activeQuoteId ? { ...q, [field]: val } : q))
    );
  };

  const activeQuote = quotes.find((q) => q.id === activeQuoteId) || quotes[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">Commercial Quote Management & PDF Ingestion</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {quotes.length} of 5 quotes loaded
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload 2 to 5 quote PDFs or policy declaration sheets to run automated comparative analysis.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Client & Agency Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Named Insured / Client Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Apex Mechanical Solutions LLC"
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Agency / Producer
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="e.g. Heritage Independent Insurance Agency"
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Commercial Scenario Preset
              </label>
              <select
                value={selectedPresetId}
                onChange={(e) => onSelectPreset(e.target.value)}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-blue-300 font-medium focus:outline-none focus:border-blue-500"
              >
                {PRESET_SCENARIOS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
                <option value="custom">Custom Uploaded Quotes</option>
              </select>
            </div>
          </div>

          {/* Upload Zone & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
              dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
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
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
                <FileUp className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">
                Drag and drop commercial quote PDFs or declaration pages here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports real carrier quote PDFs (Travelers, Hartford, Chubb, CNA, Liberty Mutual, etc.) or text declarations
              </p>
              <label className="mt-3 inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition shadow-md shadow-blue-500/20">
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                <span>Browse Files (PDF or Text)</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Quotes Manager Tabs & Text Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Active Quotes in Batch ({quotes.length} of 5)
              </span>
              <button
                onClick={handleAddManualQuote}
                disabled={quotes.length >= 5}
                className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Add Another Quote</span>
              </button>
            </div>

            {/* Quote Selector Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {quotes.map((q, idx) => {
                const isSelected = q.id === activeQuoteId;
                return (
                  <div
                    key={q.id}
                    onClick={() => setActiveQuoteId(q.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-start justify-between ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500 shadow-md shadow-blue-500/10'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5 overflow-hidden">
                      <div className={`mt-0.5 p-1.5 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-white truncate max-w-[150px]">
                            {q.carrierName || `Carrier ${idx + 1}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {q.fileName} {q.fileSize ? `(${q.fileSize})` : ''}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleRemoveQuote(q.id, e)}
                      disabled={quotes.length <= 2}
                      title={quotes.length <= 2 ? 'Minimum 2 quotes required' : 'Remove quote'}
                      className="text-slate-500 hover:text-rose-400 disabled:opacity-20 p-1 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Active Quote Content Inspector */}
            {activeQuote && (
              <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <Building className="w-4 h-4 text-blue-400" />
                    <input
                      type="text"
                      value={activeQuote.carrierName}
                      onChange={(e) => updateActiveQuote('carrierName', e.target.value)}
                      placeholder="Carrier Name (e.g. Travelers, Hartford)"
                      className="text-xs font-bold bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-white focus:outline-none focus:border-blue-500 w-full sm:w-80"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                    {activeQuote.base64Data ? 'Native PDF Byte Stream Attached' : 'Text Dec Pages Ready'}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-300">
                      Extracted Declaration & Policy Text:
                    </span>
                    <span className="text-[11px]">
                      {activeQuote.textContent.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    value={activeQuote.textContent}
                    onChange={(e) => updateActiveQuote('textContent', e.target.value)}
                    className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-300 focus:outline-none focus:border-blue-500 leading-relaxed resize-y"
                    placeholder="Paste or review policy dec pages, forms, endorsements, exclusions, and limit schedules..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              All 10 insurance analyst rules will be enforced (no guessing, page citations, $5k deductible flags, mandatory disclaimers).
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRunAnalysis();
              }}
              disabled={isAnalyzing || quotes.length < 2}
              className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/25 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-amber-300" />
              <span>Run Comparative Analysis ({quotes.length} Quotes)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
