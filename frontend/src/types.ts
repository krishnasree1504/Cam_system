export type UserRole = 'Admin' | 'Store Manager' | 'Analyst';

export type UserStatus = 'Active' | 'Inactive' | 'Pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedStoreId?: string;
  assignedStoreName?: string;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export type StoreStatus = 'Active' | 'Maintenance' | 'Inactive';

export interface Store {
  id: string;
  name: string;
  storeCode: string;
  address: string;
  city: string;
  state: string;
  managerName: string;
  status: StoreStatus;
  shelfCount: number;
  cameraCount: number;
  createdAt: string;
}

export type CategoryType =
  | 'Snacks'
  | 'Beverages'
  | 'Stationery'
  | 'Toys'
  | 'Dairy'
  | 'Personal Care'
  | 'Household'
  | 'Electronics'
  | string;

export type ShelfStatus = 'Active' | 'Restocking' | 'Maintenance';

export interface Shelf {
  id: string;
  name: string;
  shelfName: string;
  shelfNumber: string;
  storeId: string;
  storeName: string;
  category: CategoryType;
  section: string;
  productCount: number;
  cameraName?: string;
  status: ShelfStatus;
  createdAt: string;
  updatedAt: string;
}

export type CameraStatus = 'Active' | 'Offline' | 'Maintenance';

export interface Camera {
  id: string;
  name: string;
  cameraName: string;
  cameraId: string;
  cameraCode: string;
  shelfId: string;
  shelfName: string;
  storeId: string;
  storeName: string;
  status: CameraStatus;
  streamUrl: string;
  resolution?: string;
  fps?: number;
  lastActive: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'danger';
}

export interface SystemStats {
  totalStores: number;
  totalShelves: number;
  totalCameras: number;
  totalUsers: number;
  activeCameras: number;
  offlineCameras: number;
  maintenanceCameras: number;
  activeStores: number;
  recentActivities: ActivityLog[];
}
