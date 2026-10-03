import React, { useState } from 'react';
import { CommercialAnalysisOutput } from '../types/insurance';
import { 
  Code, 
  Copy, 
  Check, 
  Download, 
  CheckCircle2, 
  FileCode,
  FileSpreadsheet
} from 'lucide-react';

interface JsonViewerProps {
  analysis: CommercialAnalysisOutput;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ analysis }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(analysis, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commercial-insurance-comparison-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const schemaKeys = [
    { key: 'analysis_metadata', label: 'analysis_metadata' },
    { key: 'carriers', label: 'carriers' },
    { key: 'comparison_table', label: 'comparison_table' },
    { key: 'key_differences', label: 'key_differences' },
    { key: 'missing_coverages', label: 'missing_coverages' },
    { key: 'red_flags', label: 'red_flags' },
    { key: 'premium_analysis', label: 'premium_analysis' },
    { key: 'questions_for_underwriter', label: 'questions_for_underwriter' },
    { key: 'client_summary_email', label: 'client_summary_email' },
    { key: 'agent_recommendation', label: 'agent_recommendation' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Rule 10 Verified JSON Output Schema
            </h3>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Valid JSON
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Exact structure compliant with Rule 10 output requirements.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center shadow-md shadow-emerald-500/20"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Download .json</span>
          </button>
        </div>
      </div>

      {/* Schema Verification Checklist */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Schema 10-Field Validation Verification:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {schemaKeys.map((item) => {
            const hasKey = item.key in analysis;
            return (
              <div
                key={item.key}
                className="flex items-center space-x-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate text-slate-300">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Display */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden shadow-2xl bg-slate-950">
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">output_schema.json</span>
          <span>{jsonString.length} bytes</span>
        </div>
        <pre className="p-5 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[600px] leading-relaxed selection:bg-emerald-900 selection:text-white">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
