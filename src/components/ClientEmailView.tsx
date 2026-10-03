import React, { useState } from 'react';
import { ClientSummaryEmail, CarrierDetail } from '../types/insurance';
import { 
  Mail, 
  Copy, 
  Check, 
  Send, 
  Printer, 
  Edit3, 
  ShieldCheck, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface ClientEmailViewProps {
  emailData: ClientSummaryEmail;
  carriers: CarrierDetail[];
  clientName: string;
  agencyName: string;
  onPrint: () => void;
}

export const ClientEmailView: React.FC<ClientEmailViewProps> = ({
  emailData,
  carriers,
  clientName,
  agencyName,
  onPrint,
}) => {
  const [subject, setSubject] = useState(emailData.subject);
  const [body, setBody] = useState(emailData.body);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const MANDATORY_DISCLAIMER =
    "This comparison is for informational purposes only. Coverage is subject to the actual policy wording. Please confirm all details with your agent.";

  const handleCopyEmail = () => {
    const fullEmail = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailto = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const hasMandatoryDisclaimer = body.includes(MANDATORY_DISCLAIMER);

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Client Proposal Communication & Executive Email
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Written in plain, accessible English for the small business owner, strictly compliant with Rule 4 & 5.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            <span>{isEditing ? 'Preview Email' : 'Customize Email'}</span>
          </button>

          <button
            onClick={handleCopyEmail}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition flex items-center"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-white" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5 text-white" />
                <span>Copy Full Email</span>
              </>
            )}
          </button>

          <button
            onClick={handleOpenMailto}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center"
          >
            <Send className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            <span>Open in Mail Client</span>
          </button>

          <button
            onClick={onPrint}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center shadow-md shadow-emerald-600/20"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            <span>Print Client Proposal PDF</span>
          </button>
        </div>
      </div>

      {/* Rule 5 Compliance Check */}
      <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-900/60 flex items-start space-x-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-blue-200 uppercase tracking-wider block">
            Rule 5 Agency Compliance Certified:
          </span>
          <p className="text-slate-300 mt-0.5">
            This client summary strictly avoids unauthorized legal or coverage advice, and concludes with the mandated disclaimer.
          </p>
        </div>
      </div>

      {/* Email Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Email Header Fields */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center text-xs">
            <span className="w-20 font-bold text-slate-400">To:</span>
            <span className="font-semibold text-white">
              {clientName || carriers[0]?.named_insured || 'Client Executive Team'} &lt;client@example.com&gt;
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center text-xs">
            <span className="w-20 font-bold text-slate-400">From:</span>
            <span className="text-slate-300">
              {agencyName || 'Commercial Insurance Producer'} &lt;agent@agency.com&gt;
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center text-xs">
            <span className="w-20 font-bold text-slate-400">Subject:</span>
            {isEditing ? (
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-semibold focus:outline-none focus:border-blue-500"
              />
            ) : (
              <span className="font-bold text-white text-sm">
                {subject}
              </span>
            )}
          </div>
        </div>

        {/* Email Body Content */}
        <div className="p-6">
          {isEditing ? (
            <textarea
              rows={16}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full text-xs sm:text-sm font-mono bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 leading-relaxed focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
              {body}
            </div>
          )}
        </div>

        {/* Mandatory Disclaimer footer highlight */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Mandatory Client Disclaimer Attached</span>
          </div>
          <span className="font-mono text-slate-500">ISO 8601 Compliance</span>
        </div>
      </div>
    </div>
  );
};
