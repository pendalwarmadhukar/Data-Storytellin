export type TabType = 
  | 'home' 
  | 'import' 
  | 'quality' 
  | 'eda' 
  | 'charts' 
  | 'aistory' 
  | 'builder' 
  | 'reports' 
  | 'projects' 
  | 'help';

export interface ColumnInfo {
  name: string;
  type: 'number' | 'string' | 'date' | 'boolean';
  missingCount: number;
  missingPercent: number;
  uniqueCount: number;
  sampleValues: any[];
}

export interface DatasetSummary {
  fileName: string;
  rowCount: number;
  columnCount: number;
  columns: ColumnInfo[];
  rawRows: Record<string, any>[];
  cleanedRows: Record<string, any>[];
  createdAt: string;
}

export interface DescriptiveStats {
  column: string;
  count: number;
  mean?: number;
  std?: number;
  min?: number;
  median?: number;
  max?: number;
  iqr?: number;
  skew?: number;
  topValues?: { value: string; count: number }[];
}

export interface OutlierRecord {
  rowIndex: number;
  column: string;
  value: number;
  reason: string;
}

export interface CorrelationMatrix {
  columns: string[];
  matrix: number[][];
}

export interface InsightCard {
  id: string;
  title: string;
  explanation: string;
  keyFigure: string;
  takeaway: string;
  chartConfig?: {
    type: 'bar' | 'line' | 'scatter' | 'pie';
    xAxis: string;
    yAxis: string;
  };
}

export interface SavedProject {
  id: string;
  title: string;
  description: string;
  datasetName: string;
  rowCount: number;
  columnCount: number;
  updatedAt: string;
  summary: DatasetSummary;
  narrative?: {
    executiveSummary: string;
    keyFindings: { title: string; description: string; significance: string }[];
    trendsAndPatterns: string[];
    anomaliesAndOutliers: string[];
    limitations: string[];
    suggestedFollowUps: string[];
    insightCards: InsightCard[];
  };
}
