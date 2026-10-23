import { ColumnInfo, DatasetSummary, DescriptiveStats, OutlierRecord, CorrelationMatrix } from '../types';

export function analyzeDataset(fileName: string, rows: Record<string, any>[]): DatasetSummary {
  if (!rows || rows.length === 0) {
    return {
      fileName,
      rowCount: 0,
      columnCount: 0,
      columns: [],
      rawRows: [],
      cleanedRows: [],
      createdAt: new Date().toISOString()
    };
  }

  const columnNames = Object.keys(rows[0]);
  const rowCount = rows.length;

  const columns: ColumnInfo[] = columnNames.map(col => {
    let missingCount = 0;
    const values = rows.map(r => r[col]);
    
    values.forEach(v => {
      if (v === null || v === undefined || v === '' || (typeof v === 'string' && v.trim() === '')) {
        missingCount++;
      }
    });

    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    const uniqueValues = new Set(nonNullValues);

    // Determine type
    let type: 'number' | 'string' | 'date' | 'boolean' = 'string';
    if (nonNullValues.length > 0) {
      const sample = nonNullValues[0];
      if (typeof sample === 'number' || (!isNaN(Number(sample)) && sample !== '')) {
        type = 'number';
      } else if (typeof sample === 'boolean' || sample === 'true' || sample === 'false') {
        type = 'boolean';
      } else if (!isNaN(Date.parse(String(sample))) && String(sample).length > 6 && isNaN(Number(sample))) {
        type = 'date';
      }
    }

    return {
      name: col,
      type,
      missingCount,
      missingPercent: Number(((missingCount / rowCount) * 100).toFixed(1)),
      uniqueCount: uniqueValues.size,
      sampleValues: Array.from(uniqueValues).slice(0, 5)
    };
  });

  return {
    fileName,
    rowCount,
    columnCount: columnNames.length,
    columns,
    rawRows: JSON.parse(JSON.stringify(rows)),
    cleanedRows: JSON.parse(JSON.stringify(rows)),
    createdAt: new Date().toISOString()
  };
}

export function computeDescriptiveStats(summary: DatasetSummary): DescriptiveStats[] {
  const rows = summary.cleanedRows;
  if (!rows || rows.length === 0) return [];

  return summary.columns.map(col => {
    const values = rows.map(r => Number(r[col.name])).filter(v => !isNaN(v));
    const nonNullRaw = rows.map(r => r[col.name]).filter(v => v !== null && v !== undefined && v !== '');

    if (col.type === 'number' && values.length > 0) {
      const sorted = [...values].sort((a, b) => a - b);
      const count = values.length;
      const sum = values.reduce((acc, v) => acc + v, 0);
      const mean = sum / count;
      const median = count % 2 === 0 
        ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2 
        : sorted[Math.floor(count / 2)];
      const min = sorted[0];
      const max = sorted[count - 1];
      const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / count;
      const std = Math.sqrt(variance);

      // IQR
      const q1 = sorted[Math.floor(count * 0.25)];
      const q3 = sorted[Math.floor(count * 0.75)];
      const iqr = q3 - q1;

      return {
        column: col.name,
        count,
        mean: Number(mean.toFixed(2)),
        std: Number(std.toFixed(2)),
        min: Number(min.toFixed(2)),
        median: Number(median.toFixed(2)),
        max: Number(max.toFixed(2)),
        iqr: Number(iqr.toFixed(2))
      };
    } else {
      // Categorical frequency counts
      const counts: Record<string, number> = {};
      nonNullRaw.forEach(val => {
        const key = String(val);
        counts[key] = (counts[key] || 0) + 1;
      });

      const topValues = Object.entries(counts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        column: col.name,
        count: nonNullRaw.length,
        topValues
      };
    }
  });
}

export function detectOutliers(summary: DatasetSummary): OutlierRecord[] {
  const rows = summary.cleanedRows;
  const numericCols = summary.columns.filter(c => c.type === 'number');
  const outliers: OutlierRecord[] = [];

  numericCols.forEach(col => {
    const values = rows.map((r, idx) => ({ val: Number(r[col.name]), idx })).filter(item => !isNaN(item.val));
    if (values.length < 4) return;

    const nums = values.map(v => v.val).sort((a, b) => a - b);
    const q1 = nums[Math.floor(nums.length * 0.25)];
    const q3 = nums[Math.floor(nums.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    values.forEach(item => {
      if (item.val < lowerBound || item.val > upperBound) {
        outliers.push({
          rowIndex: item.idx,
          column: col.name,
          value: item.val,
          reason: `Value ${item.val} is outside IQR bounds [${lowerBound.toFixed(1)}, ${upperBound.toFixed(1)}]`
        });
      }
    });
  });

  return outliers.slice(0, 50); // limit to 50 for display
}

export function computeCorrelation(summary: DatasetSummary): CorrelationMatrix {
  const numericCols = summary.columns.filter(c => c.type === 'number').map(c => c.name);
  const rows = summary.cleanedRows;

  if (numericCols.length < 2 || rows.length === 0) {
    return { columns: numericCols, matrix: [] };
  }

  const matrix: number[][] = [];

  numericCols.forEach(col1 => {
    const rowCorr: number[] = [];
    numericCols.forEach(col2 => {
      if (col1 === col2) {
        rowCorr.push(1);
      } else {
        const paired = rows
          .map(r => ({ x: Number(r[col1]), y: Number(r[col2]) }))
          .filter(p => !isNaN(p.x) && !isNaN(p.y));

        if (paired.length < 2) {
          rowCorr.push(0);
        } else {
          const n = paired.length;
          const sumX = paired.reduce((acc, p) => acc + p.x, 0);
          const sumY = paired.reduce((acc, p) => acc + p.y, 0);
          const sumXY = paired.reduce((acc, p) => acc + p.x * p.y, 0);
          const sumX2 = paired.reduce((acc, p) => acc + p.x * p.x, 0);
          const sumY2 = paired.reduce((acc, p) => acc + p.y * p.y, 0);

          const numerator = n * sumXY - sumX * sumY;
          const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

          const corr = denominator === 0 ? 0 : numerator / denominator;
          rowCorr.push(Number(corr.toFixed(2)));
        }
      }
    });
    matrix.push(rowCorr);
  });

  return { columns: numericCols, matrix };
}
