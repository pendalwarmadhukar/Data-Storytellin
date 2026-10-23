import React, { useState } from 'react';
import { TabType, DatasetSummary } from '../types';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  Tooltip, CartesianGrid, Legend, ScatterChart, Scatter, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { BarChart3, Download, Filter, ArrowRight, AlertCircle } from 'lucide-react';

interface ChartStudioProps {
  currentDataset: DatasetSummary | null;
  onSelectTab: (tab: TabType) => void;
}

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const ChartStudio: React.FC<ChartStudioProps> = ({ currentDataset, onSelectTab }) => {
  if (!currentDataset || currentDataset.cleanedRows.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Dataset Loaded</h2>
        <p className="text-sm text-slate-500">Please import a dataset first to use Chart Studio.</p>
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
  const stringColumns = currentDataset.columns.map(c => c.name);

  const [chartType, setChartType] = useState<'bar' | 'line' | 'area' | 'scatter' | 'pie'>('bar');
  const [xAxisCol, setXAxisCol] = useState<string>(columns[0] || '');
  const [yAxisCol, setYAxisCol] = useState<string>(numericColumns[0] || columns[1] || columns[0]);

  // Aggregate data if xAxis is categorical
  const prepareChartData = () => {
    const rows = currentDataset.cleanedRows;
    const isXNumeric = currentDataset.columns.find(c => c.name === xAxisCol)?.type === 'number';

    if (isXNumeric || chartType === 'scatter') {
      return rows.map(r => ({
        x: r[xAxisCol],
        y: Number(r[yAxisCol]) || 0
      })).filter(item => !isNaN(item.y));
    }

    // Aggregate by categorical X axis
    const grouped: Record<string, { sum: number; count: number }> = {};
    rows.forEach(r => {
      const key = String(r[xAxisCol] ?? 'Unknown');
      const val = Number(r[yAxisCol]) || 0;
      if (!grouped[key]) {
        grouped[key] = { sum: 0, count: 0 };
      }
      grouped[key].sum += val;
      grouped[key].count += 1;
    });

    return Object.entries(grouped).map(([name, data]) => ({
      name,
      value: Number((data.sum / data.count).toFixed(2)), // average or total
      total: data.sum
    })).slice(0, 30); // limit to 30 categories
  };

  const chartData = prepareChartData();

  const handleDownloadChartData = () => {
    const jsonStr = JSON.stringify(chartData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart_data_${xAxisCol}_vs_${yAxisCol}.json`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Interactive Chart Studio</h1>
          <p className="text-sm text-slate-500 mt-1">Build professional Recharts visualizations with customizable dimensions.</p>
        </div>
        <button
          onClick={() => onSelectTab('aistory')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
        >
          Proceed to AI Story <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-xs">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Chart Type</label>
          <select
            value={chartType}
            onChange={(e: any) => setChartType(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
            <option value="scatter">Scatter Plot</option>
            <option value="pie">Pie / Donut</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">X-Axis / Category</label>
          <select
            value={xAxisCol}
            onChange={(e) => setXAxisCol(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 font-mono"
          >
            {stringColumns.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Y-Axis / Metric</label>
          <select
            value={yAxisCol}
            onChange={(e) => setYAxisCol(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 font-mono"
          >
            {numericColumns.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleDownloadChartData}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Chart JSON
          </button>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            {yAxisCol} by {xAxisCol} ({chartType.toUpperCase()})
          </h3>
          <span className="text-xs font-mono text-slate-500">{chartData.length} data points</span>
        </div>

        <div className="h-[450px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            ) : chartType === 'area' ? (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#6366f1" fill="#818cf8" fillOpacity={0.3} />
              </AreaChart>
            ) : chartType === 'scatter' ? (
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="x" name={xAxisCol} tick={{ fontSize: 11 }} />
                <YAxis dataKey="y" name={yAxisCol} tick={{ fontSize: 11 }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Data Points" data={chartData} fill="#6366f1" />
              </ScatterChart>
            ) : (
              <PieChart>
                <Tooltip />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#6366f1"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
