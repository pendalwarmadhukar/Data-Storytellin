import React, { useState } from 'react';
import { TabType, DatasetSummary } from '../types';
import { ShieldCheck, AlertTriangle, CheckCircle, RefreshCw, ArrowRight, Download } from 'lucide-react';

interface DataQualityProps {
  currentDataset: DatasetSummary | null;
  onUpdateDataset: (updated: DatasetSummary) => void;
  onSelectTab: (tab: TabType) => void;
}

export const DataQuality: React.FC<DataQualityProps> = ({ currentDataset, onUpdateDataset, onSelectTab }) => {
  const [cleaningStatus, setCleaningStatus] = useState<string | null>(null);

  if (!currentDataset) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Dataset Loaded</h2>
        <p className="text-sm text-slate-500">Please import a dataset first to inspect data quality.</p>
        <button
          onClick={() => onSelectTab('import')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
        >
          Go to Data Import
        </button>
      </div>
    );
  }

  const handleDropDuplicates = () => {
    const rows = currentDataset.cleanedRows;
    const seen = new Set();
    const uniqueRows = rows.filter(r => {
      const key = JSON.stringify(r);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const updated = {
      ...currentDataset,
      cleanedRows: uniqueRows,
      rowCount: uniqueRows.length
    };
    onUpdateDataset(updated);
    setCleaningStatus(`Removed ${rows.length - uniqueRows.length} duplicate rows.`);
  };

  const handleImputeMissingNumeric = () => {
    const rows = JSON.parse(JSON.stringify(currentDataset.cleanedRows));
    const numericCols = currentDataset.columns.filter(c => c.type === 'number');

    numericCols.forEach(col => {
      const vals = rows.map((r: any) => Number(r[col.name])).filter((v: number) => !isNaN(v));
      const mean = vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : 0;

      rows.forEach((r: any) => {
        if (r[col.name] === null || r[col.name] === undefined || r[col.name] === '') {
          r[col.name] = Number(mean.toFixed(2));
        }
      });
    });

    const updated = { ...currentDataset, cleanedRows: rows };
    onUpdateDataset(updated);
    setCleaningStatus("Imputed missing numeric values with column mean.");
  };

  const handleReset = () => {
    const updated = {
      ...currentDataset,
      cleanedRows: JSON.parse(JSON.stringify(currentDataset.rawRows)),
      rowCount: currentDataset.rawRows.length
    };
    onUpdateDataset(updated);
    setCleaningStatus("Reset dataset to original raw rows.");
  };

  const handleDownloadCleanedCsv = () => {
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

  const totalMissing = currentDataset.columns.reduce((acc, c) => acc + c.missingCount, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Data Quality & Hygiene</h1>
          <p className="text-sm text-slate-500 mt-1">Inspect missing values, duplicates, and clean your dataset safely.</p>
        </div>
        <button
          onClick={() => onSelectTab('eda')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
        >
          Proceed to Analytics <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {cleaningStatus && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {cleaningStatus}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
          <span className="text-xs font-medium text-slate-500">Missing Values Count</span>
          <p className="text-3xl font-bold font-mono text-slate-900">{totalMissing}</p>
          <p className="text-xs text-slate-500">{totalMissing === 0 ? 'No missing values detected' : 'Requires attention'}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
          <span className="text-xs font-medium text-slate-500">Active Row Count</span>
          <p className="text-3xl font-bold font-mono text-slate-900">{currentDataset.cleanedRows.length}</p>
          <p className="text-xs text-slate-500">Original: {currentDataset.rawRows.length} rows</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
          <span className="text-xs font-medium text-slate-500">Data Hygiene Status</span>
          <div className="flex items-center gap-2 pt-1">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span className="text-sm font-semibold text-slate-900">Verified & Cleanable</span>
          </div>
        </div>
      </div>

      {/* Cleaning Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Safe Transformation Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleDropDuplicates}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Drop Duplicate Rows
          </button>
          <button
            onClick={handleImputeMissingNumeric}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Impute Missing Numeric (Mean)
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset to Raw Data
          </button>
          <button
            onClick={handleDownloadCleanedCsv}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Download Cleaned CSV
          </button>
        </div>
      </div>

      {/* Column Quality Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Column Hygiene & Validation Breakdown</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Passed Validation
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Issues Found
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="p-3">Validation Status</th>
                <th className="p-3">Column Name</th>
                <th className="p-3">Detected Type</th>
                <th className="p-3">Missing Count</th>
                <th className="p-3">Missing %</th>
                <th className="p-3">Unique Values</th>
                <th className="p-3">Sample Values</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {currentDataset.columns.map(col => {
                const hasIssues = col.missingCount > 0;
                return (
                  <tr key={col.name} className="hover:bg-slate-50">
                    <td className="p-3">
                      {hasIssues ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-sans font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Missing Data
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-sans font-medium">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Passed
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-slate-900">{col.name}</td>
                    <td className="p-3 text-indigo-600">{col.type}</td>
                    <td className="p-3 text-slate-600">{col.missingCount}</td>
                    <td className="p-3 text-slate-600">{col.missingPercent}%</td>
                    <td className="p-3 text-slate-600">{col.uniqueCount}</td>
                    <td className="p-3 text-slate-500 truncate max-w-[200px]">
                      {col.sampleValues.join(', ')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
