export type ScannerSource = {
  code: string;
  name: string;
  type: 'api' | 'manual' | 'file';
  enabled: boolean;
};

export type ScannerJobStatus = 'queued' | 'running' | 'success' | 'failed';

export type ScannerJob = {
  id: string;
  sourceCode: string;
  query?: string | null;
  status: ScannerJobStatus;
  createdAt: string;
  updatedAt: string;
};

export type SuggestionItem = {
  id: string;
  title: string;
  roi: number;
  action: string;
};

export type CollaborationUser = {
  id: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
};

export type SalesStats = {
  totalProfit: number;
  salesCount: number;
};