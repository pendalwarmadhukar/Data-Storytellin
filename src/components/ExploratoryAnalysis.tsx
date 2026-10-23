import React, { useState } from 'react';
import { TabType, DatasetSummary } from '../types';
import { computeDescriptiveStats, detectOutliers, computeCorrelation } from '../services/dataAnalyzer';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  Tooltip, CartesianGrid, ReferenceLine 
} from 'recharts';
import { BarChart3, TrendingUp, AlertCircle, ArrowRight, Plus, Trash2, Tag } from 'lucide-react';

interface ExploratoryAnalysisProps {
  currentDataset: DatasetSummary | null;
  onSelectTab: (tab: TabType) => void;
}

interface ChartAnnotation {
  id: string;
  xValue: string;
  label: string;
  note: string;
}

export const ExploratoryAnalysis: React.FC<ExploratoryAnalysisProps> = ({ currentDataset, onSelectTab }) => {
  if (!currentDataset) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Dataset Loaded</h2>
        <p className="text-sm text-slate-500">Please import a dataset first to run exploratory analysis.</p>
        <button
          onClick={() => onSelectTab('import')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
        >
          Go to Data Import
        </button>
      </div>
    );
  }

  const columns = currentDataset.columns.map(c => c.name);
  const numericColumns = currentDataset.columns.filter(c => c.type === 'number').map(c => c.name);

  const [timeCol, setTimeCol] = useState<string>(columns[0] || '');
  const [metricCol, setMetricCol] = useState<string>(numericColumns[0] || columns[1] || '');
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>([
    { id: 'ann-1', xValue: String(currentDataset.cleanedRows[0]?.[columns[0]] || ''), label: 'Baseline Start', note: 'Initial observation point' }
  ]);

  const [newXValue, setNewXValue] = useState<string>('');
  const [newLabel, setNewLabel] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');

  const stats = computeDescriptiveStats(currentDataset);
  const outliers = detectOutliers(currentDataset);
  const corr = computeCorrelation(currentDataset);

  // Prepare chart data
  const chartData = currentDataset.cleanedRows.map((r, idx) => ({
    index: idx,
    x: String(r[timeCol] ?? `Row ${idx + 1}`),
    y: Number(r[metricCol]) || 0
  })).filter(item => !isNaN(item.y));

  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const targetX = newXValue || chartData[0]?.x || '';
    const ann: ChartAnnotation = {
      id: `ann-${Date.now()}`,
      xValue: targetX,
      label: newLabel,
      note: newNote || 'Highlighted event or spike'
    };

    setAnnotations([...annotations, ann]);
    setNewLabel('');
    setNewNote('');
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(annotations.filter(a => a.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Exploratory Data Analysis</h1>
          <p className="text-sm text-slate-500 mt-1">Descriptive statistics, distributions, correlations, outlier flags, and time-series annotations.</p>
        </div>
        <button
          onClick={() => onSelectTab('charts')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
        >
          Proceed to Chart Studio <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Time-Series Chart with Callout Annotations */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Time-Series & Event Callout Annotations</h3>
            <p className="text-xs text-slate-500">Highlight specific spikes, milestones, or anomalies on trend lines.</p>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-[10px] font-medium text-slate-500 mb-1">X-Axis (Time/Category)</label>
              <select
                value={timeCol}
                onChange={(e) => setTimeCol(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
              >
                {columns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-500 mb-1">Y-Axis (Metric)</label>
              <select
                value={metricCol}
                onChange={(e) => setMetricCol(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
              >
                {numericColumns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[380px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="x" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="y" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
              {annotations.map((ann) => (
                <ReferenceLine 
                  key={ann.id} 
                  x={ann.xValue} 
                  stroke="#ef4444" 
                  strokeDasharray="4 4" 
                  label={{ value: ann.label, fill: '#ef4444', position: 'top', fontSize: 11, fontWeight: 'bold' }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Add Annotation Form & List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
          <div className="md:col-span-1 bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-600" /> Add Event Callout
            </h4>
            <form onSubmit={handleAddAnnotation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target X Value / Date</label>
                <select
                  value={newXValue}
                  onChange={(e) => setNewXValue(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                >
                  <option value="">Select point...</option>
                  {chartData.map((d, i) => (
                    <option key={i} value={d.x}>{d.x}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Label</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g., Q3 Launch Spike"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Note / Description</label>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g., Marketing campaign reached peak impact"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Callout
              </button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Active Annotations ({annotations.length})</h4>
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {annotations.map((ann) => (
                <div key={ann.id} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs font-bold rounded font-mono">{ann.label}</span>
                      <span className="text-xs font-mono text-slate-500">at {ann.xValue}</span>
                    </div>
                    <p className="text-xs text-slate-600">{ann.note}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnotation(ann.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 shrink-0"
                    title="Delete Annotation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Descriptive Statistics Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900">Descriptive Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="p-3">Column</th>
                <th className="p-3">Count</th>
                <th className="p-3">Mean</th>
                <th className="p-3">Std Dev</th>
                <th className="p-3">Min</th>
                <th className="p-3">Median</th>
                <th className="p-3">Max</th>
                <th className="p-3">IQR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {stats.map(st => (
                <tr key={st.column} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">{st.column}</td>
                  <td className="p-3 text-slate-600">{st.count}</td>
                  <td className="p-3 text-slate-600">{st.mean !== undefined ? st.mean : '-'}</td>
                  <td className="p-3 text-slate-600">{st.std !== undefined ? st.std : '-'}</td>
                  <td className="p-3 text-slate-600">{st.min !== undefined ? st.min : '-'}</td>
                  <td className="p-3 text-slate-600">{st.median !== undefined ? st.median : '-'}</td>
                  <td className="p-3 text-slate-600">{st.max !== undefined ? st.max : '-'}</td>
                  <td className="p-3 text-slate-600">{st.iqr !== undefined ? st.iqr : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Correlation Matrix */}
      {corr.columns.length >= 2 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900">Numerical Correlation Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="p-3 text-left">Column</th>
                  {corr.columns.map(c => (
                    <th key={c} className="p-3">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {corr.matrix.map((row, i) => (
                  <tr key={corr.columns[i]} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900 text-left">{corr.columns[i]}</td>
                    {row.map((val, j) => {
                      const bg = val > 0.5 ? 'bg-indigo-100 text-indigo-900' : val < -0.5 ? 'bg-amber-100 text-amber-900' : 'text-slate-600';
                      return (
                        <td key={j} className={`p-3 ${bg} font-bold`}>
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Outlier Detection */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900">Explainable Outlier Flags ({outliers.length})</h3>
        {outliers.length === 0 ? (
          <p className="text-sm text-slate-500">No extreme outliers detected using IQR method (1.5x).</p>
        ) : (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
                  <th className="p-3">Row Index</th>
                  <th className="p-3">Column</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Detection Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {outliers.map((out, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-600">#{out.rowIndex + 1}</td>
                    <td className="p-3 font-semibold text-slate-900">{out.column}</td>
                    <td className="p-3 text-indigo-600 font-bold">{out.value}</td>
                    <td className="p-3 text-slate-500">{out.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
