import React, { useState } from 'react';
import { 
  ComparisonTableRow, 
  CarrierDetail 
} from '../types/insurance';
import { 
  FileSpreadsheet, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  Search,
  Filter,
  Info
} from 'lucide-react';

interface ComparisonMatrixProps {
  comparisonTable: ComparisonTableRow[];
  carriers: CarrierDetail[];
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  comparisonTable,
  carriers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'deductibles' | 'missing'>('all');
  const [selectedCarrierTab, setSelectedCarrierTab] = useState<number>(0);

  const filteredRows = comparisonTable.filter((row) => {
    const matchesSearch = row.coverage_line.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.values.some((v) => 
        v.limit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (filterMode === 'deductibles') {
      return row.values.some((v) => {
        const num = parseInt(v.deductible.replace(/[^0-9]/g, ''), 10);
        return !isNaN(num) && num > 5000;
      });
    }

    if (filterMode === 'missing') {
      return row.values.some((v) => 
        v.limit.toLowerCase().includes('not stated') || 
        v.limit.toLowerCase().includes('excluded')
      );
    }

    return true;
  });

  const isDeductibleHigh = (deductibleStr: string) => {
    const num = parseInt(deductibleStr.replace(/[^0-9]/g, ''), 10);
    return !isNaN(num) && num > 5000;
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coverage line, limits, endorsements..."
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition min-h-[38px] ${
              filterMode === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All ({comparisonTable.length})
          </button>
          <button
            onClick={() => setFilterMode('deductibles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition min-h-[38px] ${
              filterMode === 'deductibles'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Deductible &gt; $5k
          </button>
          <button
            onClick={() => setFilterMode('missing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition min-h-[38px] ${
              filterMode === 'missing'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Excluded
          </button>
        </div>
      </div>

      {/* Info notice about Rule 8 and Rule 2 */}
      <div className="flex items-center space-x-2 text-xs text-slate-400 px-1">
        <Info className="w-4 h-4 text-blue-400 shrink-0" />
        <span>
          Deductibles exceeding <strong>$5,000</strong> are automatically highlighted per Agency Risk Guidelines. Any field missing in source documents is marked <em>"Not stated"</em> per Rule 2.
        </span>
      </div>

      {/* Mobile Tab Switcher at the top: [Travelers] [Hartford] [CNA] [All] */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
          {carriers.map((carrier, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCarrierTab(idx)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
                selectedCarrierTab === idx
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <span>{carrier.carrier_name.split(' ')[0]}</span>
            </button>
          ))}
          <button
            onClick={() => setSelectedCarrierTab(-1)}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCarrierTab === -1
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            All Carriers
          </button>
        </div>
      </div>

      {/* MOBILE VIEW (max-width: 640px): Stacked Cards */}
      <div className="sm:hidden space-y-4">
        {(selectedCarrierTab === -1 ? carriers : [carriers[selectedCarrierTab] || carriers[0]]).map((carrier, cIdx) => (
          <div key={cIdx} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3 shadow-lg">
            <div className="pb-2.5 border-b border-slate-800 flex justify-between items-baseline">
              <div>
                <h4 className="text-base font-black text-white">{carrier.carrier_name}</h4>
                <div className="text-[11px] text-slate-400">Term: {carrier.effective_date} - {carrier.expiration_date}</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Premium</span>
                <span className="text-lg font-black text-emerald-400">${carrier.annual_premium?.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2.5 divide-y divide-slate-800/80">
              {filteredRows.map((row, rIdx) => {
                const cellVal = row.values.find(
                  (v) => v.carrier_name.toLowerCase() === carrier.carrier_name.toLowerCase()
                );
                const isHighDed = cellVal ? isDeductibleHigh(cellVal.deductible) : false;
                const isMissing = !cellVal || cellVal.limit.toLowerCase().includes('not stated') || cellVal.limit.toLowerCase().includes('excluded');

                return (
                  <div key={rIdx} className="pt-2 flex flex-col space-y-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-semibold text-slate-300">{row.coverage_line}</span>
                      <span className={`text-xs font-bold text-right ${isMissing ? 'text-amber-400 italic' : 'text-white'}`}>
                        {cellVal?.limit || 'Not stated'}
                      </span>
                    </div>
                    {cellVal?.deductible && cellVal.deductible !== 'N/A' && (
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Deductible:</span>
                        <span className={isHighDed ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {cellVal.deductible} {isHighDed && '⚠️ (> $5k)'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* TABLET VIEW (641px - 1024px): 2 columns side by side */}
      <div className="hidden sm:grid lg:hidden sm:grid-cols-2 gap-4">
        {carriers.map((carrier, cIdx) => (
          <div key={cIdx} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3 shadow-lg">
            <div className="pb-2.5 border-b border-slate-800 flex justify-between items-baseline">
              <h4 className="text-sm font-black text-white truncate max-w-[150px]">{carrier.carrier_name}</h4>
              <span className="text-base font-black text-emerald-400">${carrier.annual_premium?.toLocaleString()}</span>
            </div>
            <div className="space-y-2 divide-y divide-slate-800/80">
              {filteredRows.map((row, rIdx) => {
                const cellVal = row.values.find(
                  (v) => v.carrier_name.toLowerCase() === carrier.carrier_name.toLowerCase()
                );
                const isHighDed = cellVal ? isDeductibleHigh(cellVal.deductible) : false;
                const isMissing = !cellVal || cellVal.limit.toLowerCase().includes('not stated') || cellVal.limit.toLowerCase().includes('excluded');
                return (
                  <div key={rIdx} className="pt-1.5 flex justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[140px]">{row.coverage_line}</span>
                    <span className={isMissing ? 'text-amber-400 italic' : 'text-white font-bold'}>
                      {cellVal?.limit || 'Not stated'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW (1025px+): Full Table */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-800 shadow-xl bg-slate-900">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/90 border-b border-slate-700 text-slate-300">
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider w-1/4 sticky left-0 bg-slate-800/95 z-10">
                Coverage Line / Policy Terms
              </th>
              {carriers.map((carrier, idx) => (
                <th key={idx} className="py-4 px-4 text-xs font-bold tracking-tight">
                  <div className="text-white font-extrabold text-sm">{carrier.carrier_name}</div>
                  <div className="text-[11px] text-blue-400 font-normal mt-0.5">
                    Premium: ${carrier.annual_premium?.toLocaleString()}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={carriers.length + 1} className="py-8 text-center text-slate-500">
                  No coverage lines matched the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-800/40 transition">
                  {/* Coverage Line Name */}
                  <td className="py-4 px-4 font-bold text-white bg-slate-900/90 sticky left-0 z-10 border-r border-slate-800">
                    <div className="flex items-center space-x-2">
                      <FileSpreadsheet className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{row.coverage_line}</span>
                    </div>
                  </td>

                  {/* Values for each Carrier */}
                  {carriers.map((carrier, cIdx) => {
                    const cellVal = row.values.find(
                      (v) => v.carrier_name.toLowerCase() === carrier.carrier_name.toLowerCase()
                    ) || row.values[cIdx];

                    if (!cellVal) {
                      return (
                        <td key={cIdx} className="py-4 px-4 text-slate-500 italic">
                          Not stated
                        </td>
                      );
                    }

                    const isHighDed = isDeductibleHigh(cellVal.deductible);
                    const isMissing = 
                      cellVal.limit.toLowerCase().includes('not stated') ||
                      cellVal.limit.toLowerCase().includes('excluded');

                    return (
                      <td key={cIdx} className="py-4 px-4 align-top space-y-1.5 border-r border-slate-800/50">
                        {/* Limit Badge */}
                        <div className="flex items-start justify-between">
                          <span
                            className={`font-bold text-sm ${
                              isMissing ? 'text-amber-400 italic' : 'text-slate-100'
                            }`}
                          >
                            {cellVal.limit}
                          </span>
                        </div>

                        {/* Deductible Flag */}
                        {cellVal.deductible && cellVal.deductible !== 'N/A' && (
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[11px] text-slate-400">Ded:</span>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                isHighDed
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {cellVal.deductible}
                              {isHighDed && ' ⚠️ (> $5k)'}
                            </span>
                          </div>
                        )}

                        {/* Notes */}
                        {cellVal.notes && (
                          <p className="text-[11px] text-slate-400 leading-snug pt-1 border-t border-slate-800/60">
                            {cellVal.notes}
                          </p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
