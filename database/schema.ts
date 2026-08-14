export type UserRole = 'Admin' | 'Store Manager' | 'Analyst';
export type UserStatus = 'Active' | 'Inactive';
export type StoreStatus = 'Active' | 'Inactive' | 'Maintenance';
export type CameraStatus = 'Active' | 'Offline' | 'Maintenance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedStoreId?: string;
  assignedStoreName?: string;
  status: UserStatus;
  phone?: string;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  storeCode: string;
  address: string;
  city: string;
  state: string;
  managerName?: string;
  status: StoreStatus;
  shelfCount: number;
  cameraCount: number;
  createdAt?: string;
}

export interface Shelf {
  id: string;
  shelfName: string;
  name: string;
  shelfNumber: string;
  storeId: string;
  storeName: string;
  category: string;
  section: string;
  productCount: number;
  status: StoreStatus;
  createdAt?: string;
}

export interface Camera {
  id: string;
  cameraName: string;
  name: string;
  cameraId: string;
  cameraCode: string;
  shelfId?: string;
  shelfName?: string;
  storeId: string;
  storeName: string;
  status: CameraStatus;
  streamUrl: string;
  resolution: string;
  fps: number;
  lastActive: string;
  createdAt?: string;
}

export interface SystemActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'danger';
}

export interface SystemStats {
  totalStores: number;
  activeStores: number;
  totalShelves: number;
  totalCameras: number;
  activeCameras: number;
  offlineCameras: number;
  maintenanceCameras: number;
  totalUsers: number;
  recentActivities: SystemActivity[];
}
