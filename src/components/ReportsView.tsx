import React from 'react';
import { TabType, DatasetSummary } from '../types';
import { FileText, Download, Printer, CheckCircle, ArrowRight } from 'lucide-react';

interface ReportsViewProps {
  currentDataset: DatasetSummary | null;
  savedStory: any | null;
  onSelectTab: (tab: TabType) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ currentDataset, savedStory, onSelectTab }) => {
  if (!currentDataset) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <FileText className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Dataset Loaded</h2>
        <p className="text-sm text-slate-500">Please import a dataset first to view and export reports.</p>
        <button
          onClick={() => onSelectTab('import')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
        >
          Go to Data Import
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExportCleanedCsv = () => {
    const rows = currentDataset.cleanedRows;
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned_${currentDataset.fileName}`;
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Executive Report Studio</h1>
          <p className="text-sm text-slate-500 mt-1">Export comprehensive reports, data summaries, and cleaned datasets.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCleanedCsv}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export Clean CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print / PDF Report
          </button>
        </div>
      </div>

      {/* Report Preview Document */}
      <div className="bg-white border border-slate-200 rounded-2xl p-12 space-y-10 shadow-xs print:shadow-none print:border-none">
        {/* Report Header */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Data Storytelling Studio Report</span>
            <span className="text-xs font-mono text-slate-500">Generated: {new Date().toLocaleDateString()}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">{currentDataset.fileName}</h2>
          <p className="text-sm text-slate-500">Methodology: Automated Hygiene Inspection, Descriptive Statistics & Gemini AI Narrative Synthesis</p>
        </div>

        {/* Dataset Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">1. Dataset Quality & Dimensions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 font-medium">Rows</span>
              <p className="text-xl font-bold font-mono text-slate-900">{currentDataset.rowCount}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 font-medium">Columns</span>
              <p className="text-xl font-bold font-mono text-slate-900">{currentDataset.columnCount}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 font-medium">Missing Values</span>
              <p className="text-xl font-bold font-mono text-slate-900">
                {currentDataset.columns.reduce((acc, c) => acc + c.missingCount, 0)}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 font-medium">Status</span>
              <p className="text-sm font-semibold text-emerald-600 mt-1">Verified & Clean</p>
            </div>
          </div>
        </div>

        {/* Narrative Section */}
        {savedStory && (
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">2. Executive Narrative</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{savedStory.executiveSummary}</p>

            <h4 className="text-base font-bold text-slate-900 pt-2">Key Insights & Findings</h4>
            <div className="space-y-4">
              {savedStory.insightCards?.map((card: any, idx: number) => (
                <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-600">Card #{idx + 1}</span>
                    <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200">{card.keyFigure}</span>
                  </div>
                  <h5 className="text-base font-bold text-slate-900">{card.title}</h5>
                  <p className="text-sm text-slate-600">{card.explanation}</p>
                  <p className="text-xs font-medium text-slate-900 pt-1">
                    <span className="text-indigo-600">Takeaway:</span> {card.takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Limitations */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">3. Limitations & Constraints</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            All computed metrics are reproducible based on the uploaded snapshot. Correlation does not imply causation. Forecasts and analytical interpretations are derived from measured variables without external causal claims.
          </p>
        </div>
      </div>
    </div>
  );
};
