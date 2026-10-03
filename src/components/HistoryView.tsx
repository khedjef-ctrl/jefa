import React, { useState } from 'react';
import { HistoryItem } from '../types/insurance';
import { 
  History, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Calendar, 
  Building2, 
  DollarSign, 
  ShieldCheck,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface HistoryViewProps {
  history: HistoryItem[];
  onViewItem: (item: HistoryItem) => void;
  onRerunItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onViewItem,
  onRerunItem,
  onDeleteItem,
  onClearAll,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  React.useEffect(() => {
    trackEvent('history_viewed', { count: history.length });
  }, [history.length]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Comparison History & Archived Proposals
            </h3>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {history.length} of 20 Max
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Past comparative analyses automatically persisted in your local browser storage.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showClearConfirm && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>
              Are you sure you want to delete all archived analyses? This action cannot be undone.
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClearAll();
                setShowClearConfirm(false);
              }}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition"
            >
              Confirm Clear All
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">No Saved Analyses Yet</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Every time you run a comparative analysis on the Upload tab, it will be automatically saved here for one-click review or re-running.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => {
            const dateFormatted = new Date(item.timestamp).toLocaleDateString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            });

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg shadow-black/20"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-extrabold text-white tracking-tight">
                        {item.clientName || 'Commercial Client'}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{dateFormatted}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {item.carrierNames.length} Quotes
                    </span>
                  </div>

                  {/* Context chips */}
                  {item.clientContext && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.clientContext.businessType && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          {item.clientContext.businessType}
                        </span>
                      )}
                      {item.clientContext.state && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          State: {item.clientContext.state}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Carriers Summary */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Quoting Carriers & Premiums:
                    </span>
                    <div className="space-y-1">
                      {item.carrierNames.map((carrierName, cIdx) => {
                        const premium = item.annualPremiums[carrierName];
                        const isCheapest = carrierName === item.cheapestCarrier;

                        return (
                          <div key={cIdx} className="flex items-center justify-between text-slate-300">
                            <span className="truncate max-w-[200px]">{carrierName}</span>
                            <span className={`font-mono font-bold ${isCheapest ? 'text-emerald-400' : 'text-slate-200'}`}>
                              ${premium ? premium.toLocaleString() : 'N/A'}
                              {isCheapest && ' ★'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Delete saved analysis"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onRerunItem(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1 text-blue-400" />
                      <span>Re-run</span>
                    </button>

                    <button
                      onClick={() => onViewItem(item)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition flex items-center"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>View Comparison</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
