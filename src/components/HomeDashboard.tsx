import React from 'react';
import { TabType, DatasetSummary, SavedProject } from '../types';
import { sampleDatasets } from '../utils/sampleDatasets';
import { analyzeDataset } from '../services/dataAnalyzer';
import { Database, BarChart3, Sparkles, FileText, ArrowRight, ShieldCheck, Layers, Play } from 'lucide-react';

interface HomeDashboardProps {
  onSelectTab: (tab: TabType) => void;
  onLoadDataset: (summary: DatasetSummary) => void;
  savedProjects: SavedProject[];
  currentDataset: DatasetSummary | null;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectTab,
  onLoadDataset,
  savedProjects,
  currentDataset,
}) => {
  const handleLoadSample = (sample: typeof sampleDatasets[0]) => {
    const summary = analyzeDataset(sample.fileName, sample.rows);
    onLoadDataset(summary);
    onSelectTab('eda');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white rounded-2xl p-10 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none" />
        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-indigo-400 uppercase">
            <span>Narrative Visualization & Analytics Studio</span>
            <span>·</span>
            <span>Production Grade</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Transform Raw Data into Compelling Data Stories
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            Accepts datasets, validates and cleans them, uncovers statistical insights, builds interactive Recharts visualizations, explains verified findings using Gemini AI, and assembles editable narrative reports.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onSelectTab('import')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              Import New Dataset
            </button>
            {currentDataset && (
              <button
                onClick={() => onSelectTab('eda')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors border border-slate-700 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Resume Active Analysis ({currentDataset.fileName})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Sample Datasets */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Quick-Start Sample Datasets</h2>
            <p className="text-sm text-slate-500">Test the studio instantly with pre-configured professional datasets.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleDatasets.map((sample) => (
            <div
              key={sample.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">{sample.fileName}</span>
                  <span className="text-xs text-indigo-600 font-medium">Ready to Analyze</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{sample.title}</h3>
                <p className="text-sm text-slate-600">{sample.description}</p>
              </div>
              <div className="pt-6 flex items-center justify-between border-t border-slate-100 mt-6">
                <span className="text-xs text-slate-500">{sample.rows.length} rows · {Object.keys(sample.rows[0]).length} columns</span>
                <button
                  onClick={() => handleLoadSample(sample)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  Load Sample <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Studio Capabilities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="text-base font-bold text-slate-900">Robust Data Hygiene</h3>
          <p className="text-sm text-slate-600">
            Detect missing values, duplicates, type mismatches, and statistical outliers with safe transformation confirmation.
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="text-base font-bold text-slate-900">Interactive Chart Studio</h3>
          <p className="text-sm text-slate-600">
            Build dynamic line, bar, scatter, pie, and correlation heatmap charts with customizable filters and aggregation.
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="text-base font-bold text-slate-900">AI Story & Builder</h3>
          <p className="text-sm text-slate-600">
            Generate executive narratives with Gemini AI and assemble structured, editable insight cards into reports.
          </p>
        </div>
      </div>
    </div>
  );
};
