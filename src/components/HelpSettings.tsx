import React from 'react';
import { TabType } from '../types';
import { HelpCircle, Shield, Database, Sparkles, CheckCircle2 } from 'lucide-react';

interface HelpSettingsProps {
  onSelectTab: (tab: TabType) => void;
}

export const HelpSettings: React.FC<HelpSettingsProps> = ({ onSelectTab }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Help & Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Documentation, supported formats, privacy information, and system status.</p>
      </div>

      {/* AI Configuration Status */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-4 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" /> AI Storytelling Status
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Data Storytelling Studio integrates with Google Gemini AI (`gemini-3.8-flash`) via secure server-side API calls to synthesize executive summaries and key findings. If API credentials are not configured in your environment secrets, the studio seamlessly falls back to local deterministic narrative analytics.
        </p>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 pt-2">
          <CheckCircle2 className="w-4 h-4" /> Server-side proxy active and secured
        </div>
      </div>

      {/* Supported Formats */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-4 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" /> Supported File Formats & Limits
        </h3>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
          <li><strong>CSV (.csv)</strong>: Standard comma-separated values with header rows. Automatic type detection for numbers, dates, and strings.</li>
          <li><strong>Excel (.xls, .xlsx)</strong>: Microsoft Excel workbooks (first worksheet is automatically parsed).</li>
          <li><strong>File Size Limit</strong>: Recommended up to 50MB (client-side and server memory optimized).</li>
        </ul>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-4 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" /> Privacy & Data Security
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Your datasets are processed locally in your browser memory and through secure server-side proxies. No sensitive row-level data is permanently stored or exposed to third parties. All cleaning transformations are non-destructive and fully reversible.
        </p>
      </div>
    </div>
  );
};
