import React, { useState } from 'react';
import { TabType, DatasetSummary } from '../types';
import { analyzeDataset } from '../services/dataAnalyzer';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface DataImportProps {
  onLoadDataset: (summary: DatasetSummary) => void;
  onSelectTab: (tab: TabType) => void;
  currentDataset: DatasetSummary | null;
}

export const DataImport: React.FC<DataImportProps> = ({ onLoadDataset, onSelectTab, currentDataset }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setFileName(file.name);

    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (fileExt === 'csv') {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const rows = results.data as Record<string, any>[];
            if (!rows || rows.length === 0) {
              throw new Error("Uploaded CSV file contains no rows or is malformed.");
            }
            const summary = analyzeDataset(file.name, rows);
            onLoadDataset(summary);
            setLoading(false);
          } catch (err: any) {
            setError(err.message || "Failed to parse CSV file.");
            setLoading(false);
          }
        },
        error: (err) => {
          setError(err.message || "Error reading CSV file.");
          setLoading(false);
        }
      });
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws) as Record<string, any>[];

          if (!data || data.length === 0) {
            throw new Error("Uploaded Excel file contains no rows.");
          }

          const summary = analyzeDataset(file.name, data);
          onLoadDataset(summary);
          setLoading(false);
        } catch (err: any) {
          setError(err.message || "Failed to parse Excel file.");
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError("Error reading file stream.");
        setLoading(false);
      };
      reader.readAsBinaryString(file);
    } else {
      setError("Unsupported file format. Please upload a .csv, .xls, or .xlsx file.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Data Import Workspace</h1>
        <p className="text-sm text-slate-500 mt-1">Upload CSV or Excel files to begin analytics and storytelling.</p>
      </div>

      {/* Upload Box */}
      <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-4 hover:border-slate-400 transition-colors">
        <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <Upload className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">Drag and drop your dataset here</h3>
          <p className="text-sm text-slate-500">Supports CSV, XLS, XLSX formats up to 50MB</p>
        </div>
        <div>
          <label className="inline-block px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-sm">
            Browse Files
            <input type="file" accept=".csv, .xls, .xlsx" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
        {fileName && <p className="text-xs font-mono text-slate-600">Selected: {fileName}</p>}
      </div>

      {loading && (
        <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 text-sm flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Processing and validating dataset columns...
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {currentDataset && !loading && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">Dataset Loaded Successfully</h3>
                <p className="text-xs font-mono text-slate-500">{currentDataset.fileName}</p>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('quality')}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              Proceed to Data Quality <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 font-medium">Total Rows</span>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{currentDataset.rowCount}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 font-medium">Total Columns</span>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{currentDataset.columnCount}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 font-medium">Missing Values</span>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
                {currentDataset.columns.reduce((acc, c) => acc + c.missingCount, 0)}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 font-medium">Column Types</span>
              <p className="text-sm font-semibold text-slate-700 mt-2">
                {currentDataset.columns.filter(c => c.type === 'number').length} numeric, {currentDataset.columns.filter(c => c.type === 'string').length} text
              </p>
            </div>
          </div>

          {/* Preview Table */}
          <div className="space-y-3 pt-4">
            <h4 className="text-sm font-bold text-slate-900">Preview (First 5 Rows)</h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    {currentDataset.columns.map(col => (
                      <th key={col.name} className="p-3 font-mono">{col.name} ({col.type})</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentDataset.rawRows.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      {currentDataset.columns.map(col => (
                        <td key={col.name} className="p-3 font-mono text-slate-600 truncate max-w-[150px]">
                          {row[col.name] !== undefined ? String(row[col.name]) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
