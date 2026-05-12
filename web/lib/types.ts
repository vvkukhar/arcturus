export type UserRole = 'admin' | 'operator' | 'viewer';

export interface User {
  id: string;
  name: string;
  email?: string | null;
  role: UserRole;
}

export interface InventoryItem {
  id: string;
  itemId: string;
  titleSnapshot: string;
  purchasePrice: number;
  totalCost: number;
  expectedSalePriceManual?: number | null;
  quantity: number;
  condition: string;
  sealed: boolean;
  images?: InventoryImage[];
  assignedUser?: User | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  order?: number;
}

export interface WatchlistItem {
  id: string;
  itemId: string;
  titleSnapshot: string;
  desiredBuyPrice: number;
  maxBuyPrice: number;
  targetSellPrice?: number | null;
  active: boolean;
  priority: number;
  notes?: string | null;
  assignedUserId?: string | null;
  assignedUser?: User | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export type ReserveStatus = 'pending' | 'approved' | 'rejected' | 'contacted';

export interface ReserveRequest {
  id: string;
  inventoryItemId?: string | null;
  productTitle: string;
  name: string;
  contact: string;
  message?: string | null;
  status: ReserveStatus;
  adminNote?: string | null;
  createdAt?: string;
}