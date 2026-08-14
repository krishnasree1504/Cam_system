import { User, Store, Shelf, Camera, SystemActivity, SystemStats } from './schema';

// Database State initialized with Indian Store Branches
export class Database {
  private users: User[] = [
    {
      id: 'usr-1',
      name: 'Alexandra Vance',
      email: 'admin@cams.com',
      role: 'Admin',
      status: 'Active',
      phone: '+91 98200 12345',
      createdAt: '2026-01-10T08:00:00.000Z',
    },
    {
      id: 'usr-2',
      name: 'Rajesh Sharma',
      email: 'manager@cams.com',
      role: 'Store Manager',
      assignedStoreId: 'str-1',
      assignedStoreName: 'Mumbai Central Flagship',
      status: 'Active',
      phone: '+91 98765 43210',
      createdAt: '2026-01-15T09:30:00.000Z',
    },
    {
      id: 'usr-3',
      name: 'Priya Sundaram',
      email: 'analyst@cams.com',
      role: 'Analyst',
      status: 'Active',
      phone: '+91 99887 76655',
      createdAt: '2026-02-01T11:15:00.000Z',
    },
    {
      id: 'usr-4',
      name: 'Vikram Mehta',
      email: 'vmehta@cams.com',
      role: 'Store Manager',
      assignedStoreId: 'str-2',
      assignedStoreName: 'Bengaluru Tech Park',
      status: 'Active',
      phone: '+91 97112 23344',
      createdAt: '2026-02-12T14:20:00.000Z',
    },
  ];

  private stores: Store[] = [
    {
      id: 'str-1',
      name: 'Mumbai Central Flagship',
      storeCode: 'ST-MH-001',
      address: 'Lower Parel, Senapati Bapat Marg',
      city: 'Mumbai',
      state: 'MH',
      managerName: 'Rajesh Sharma',
      status: 'Active',
      shelfCount: 3,
      cameraCount: 3,
    },
    {
      id: 'str-2',
      name: 'Bengaluru Tech Park',
      storeCode: 'ST-KA-002',
      address: '100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'KA',
      managerName: 'Vikram Mehta',
      status: 'Active',
      shelfCount: 2,
      cameraCount: 2,
    },
    {
      id: 'str-3',
      name: 'Delhi Connaught Plaza',
      storeCode: 'ST-DL-003',
      address: 'Connaught Place, Block C',
      city: 'New Delhi',
      state: 'DL',
      managerName: 'Unassigned',
      status: 'Active',
      shelfCount: 2,
      cameraCount: 2,
    },
    {
      id: 'str-4',
      name: 'Hyderabad Cyber Towers',
      storeCode: 'ST-TS-004',
      address: 'HITEC City, Madhapur',
      city: 'Hyderabad',
      state: 'TS',
      managerName: 'Unassigned',
      status: 'Maintenance',
      shelfCount: 1,
      cameraCount: 1,
    },
  ];

  private shelves: Shelf[] = [
    {
      id: 'shf-1',
      shelfName: 'Beverages Aisle A1',
      name: 'Beverages Aisle A1',
      shelfNumber: 'SH-01',
      storeId: 'str-1',
      storeName: 'Mumbai Central Flagship',
      category: 'Beverages',
      section: 'Aisle 1 Bay A',
      productCount: 140,
      status: 'Active',
    },
    {
      id: 'shf-2',
      shelfName: 'Snacks & Confectionery B2',
      name: 'Snacks & Confectionery B2',
      shelfNumber: 'SH-02',
      storeId: 'str-1',
      storeName: 'Mumbai Central Flagship',
      category: 'Snacks',
      section: 'Aisle 2 Bay B',
      productCount: 220,
      status: 'Active',
    },
    {
      id: 'shf-3',
      shelfName: 'Electronics Showcase C1',
      name: 'Electronics Showcase C1',
      shelfNumber: 'SH-03',
      storeId: 'str-1',
      storeName: 'Mumbai Central Flagship',
      category: 'Electronics',
      section: 'Aisle 3 Bay C',
      productCount: 85,
      status: 'Active',
    },
    {
      id: 'shf-4',
      shelfName: 'Dairy Essentials Section E1',
      name: 'Dairy Essentials Section E1',
      shelfNumber: 'SH-04',
      storeId: 'str-2',
      storeName: 'Bengaluru Tech Park',
      category: 'Dairy',
      section: 'Aisle 1 Bay E',
      productCount: 95,
      status: 'Active',
    },
    {
      id: 'shf-5',
      shelfName: 'Gadgets & Accessories F2',
      name: 'Gadgets & Accessories F2',
      shelfNumber: 'SH-05',
      storeId: 'str-2',
      storeName: 'Bengaluru Tech Park',
      category: 'Electronics',
      section: 'Aisle 2 Bay F',
      productCount: 160,
      status: 'Active',
    },
    {
      id: 'shf-6',
      shelfName: 'Stationery & Office H1',
      name: 'Stationery & Office H1',
      shelfNumber: 'SH-06',
      storeId: 'str-3',
      storeName: 'Delhi Connaught Plaza',
      category: 'Stationery',
      section: 'Aisle 1 Bay H',
      productCount: 310,
      status: 'Active',
    },
    {
      id: 'shf-7',
      shelfName: 'Toys & Gaming Zone I1',
      name: 'Toys & Gaming Zone I1',
      shelfNumber: 'SH-07',
      storeId: 'str-3',
      storeName: 'Delhi Connaught Plaza',
      category: 'Toys',
      section: 'Aisle 2 Bay I',
      productCount: 75,
      status: 'Active',
    },
    {
      id: 'shf-8',
      shelfName: 'Cold Beverages Bar K1',
      name: 'Cold Beverages Bar K1',
      shelfNumber: 'SH-08',
      storeId: 'str-4',
      storeName: 'Hyderabad Cyber Towers',
      category: 'Beverages',
      section: 'Aisle 1 Bay K',
      productCount: 150,
      status: 'Active',
    },
  ];

  private cameras: Camera[] = [
    {
      id: 'cam-1',
      name: 'Beverage Aisle Main Overhead',
      cameraName: 'Beverage Aisle Main Overhead',
      cameraId: 'CAM-MUM-01',
      cameraCode: 'CAM-MUM-01',
      shelfId: 'shf-1',
      shelfName: 'Beverages Aisle A1',
      storeId: 'str-1',
      storeName: 'Mumbai Central Flagship',
      status: 'Active',
      streamUrl: 'rtsp://stream.cams-system.internal/mum/cam-01',
      resolution: '1080p (1920x1080)',
      fps: 30,
      lastActive: '2 mins ago',
    },
    {
      id: 'cam-2',
      name: 'Snacks Counter Dual-Lens',
      cameraName: 'Snacks Counter Dual-Lens',
      cameraId: 'CAM-MUM-02',
      cameraCode: 'CAM-MUM-02',
      shelfId: 'shf-2',
      shelfName: 'Snacks & Confectionery B2',
      storeId: 'str-1',
      storeName: 'Mumbai Central Flagship',
      status: 'Active',
      streamUrl: 'rtsp://stream.cams-system.internal/mum/cam-02',
      resolution: '1080p (1920x1080)',
      fps: 30,
      lastActive: '1 min ago',
    },
    {
      id: 'cam-3',
      name: 'Electronics Shelf Wide View',
      cameraName: 'Electronics Shelf Wide View',
      cameraId: 'CAM-MUM-03',
      cameraCode: 'CAM-MUM-03',
      shelfId: 'shf-3',
      shelfName: 'Electronics Showcase C1',
      storeId: 'str-1',
      storeName: 'Mumbai Central Flagship',
      status: 'Offline',
      streamUrl: 'rtsp://stream.cams-system.internal/mum/cam-03',
      resolution: '4K (3840x2160)',
      fps: 60,
      lastActive: '25 mins ago',
    },
    {
      id: 'cam-4',
      name: 'Dairy Section Thermal Tracker',
      cameraName: 'Dairy Section Thermal Tracker',
      cameraId: 'CAM-BLR-01',
      cameraCode: 'CAM-BLR-01',
      shelfId: 'shf-4',
      shelfName: 'Dairy Essentials Section E1',
      storeId: 'str-2',
      storeName: 'Bengaluru Tech Park',
      status: 'Active',
      streamUrl: 'rtsp://stream.cams-system.internal/blr/cam-01',
      resolution: '1080p (1920x1080)',
      fps: 30,
      lastActive: 'Just now',
    },
    {
      id: 'cam-5',
      name: 'Gadgets High-Res Optical',
      cameraName: 'Gadgets High-Res Optical',
      cameraId: 'CAM-BLR-02',
      cameraCode: 'CAM-BLR-02',
      shelfId: 'shf-5',
      shelfName: 'Gadgets & Accessories F2',
      storeId: 'str-2',
      storeName: 'Bengaluru Tech Park',
      status: 'Active',
      streamUrl: 'rtsp://stream.cams-system.internal/blr/cam-02',
      resolution: '4K (3840x2160)',
      fps: 60,
      lastActive: '5 mins ago',
    },
    {
      id: 'cam-6',
      name: 'Stationery Aisle Panoramic',
      cameraName: 'Stationery Aisle Panoramic',
      cameraId: 'CAM-DEL-01',
      cameraCode: 'CAM-DEL-01',
      shelfId: 'shf-6',
      shelfName: 'Stationery & Office H1',
      storeId: 'str-3',
      storeName: 'Delhi Connaught Plaza',
      status: 'Active',
      streamUrl: 'rtsp://stream.cams-system.internal/del/cam-01',
      resolution: '1080p (1920x1080)',
      fps: 30,
      lastActive: '12 mins ago',
    },
    {
      id: 'cam-7',
      name: 'Toys Section Cam 02',
      cameraName: 'Toys Section Cam 02',
      cameraId: 'CAM-DEL-02',
      cameraCode: 'CAM-DEL-02',
      shelfId: 'shf-7',
      shelfName: 'Toys & Gaming Zone I1',
      storeId: 'str-3',
      storeName: 'Delhi Connaught Plaza',
      status: 'Maintenance',
      streamUrl: 'rtsp://stream.cams-system.internal/del/cam-02',
      resolution: '720p (1280x720)',
      fps: 24,
      lastActive: '2 hours ago',
    },
    {
      id: 'cam-8',
      name: 'Cold Drinks Bar Ultra-Wide',
      cameraName: 'Cold Drinks Bar Ultra-Wide',
      cameraId: 'CAM-HYD-01',
      cameraCode: 'CAM-HYD-01',
      shelfId: 'shf-8',
      shelfName: 'Cold Beverages Bar K1',
      storeId: 'str-4',
      storeName: 'Hyderabad Cyber Towers',
      status: 'Active',
      streamUrl: 'rtsp://stream.cams-system.internal/hyd/cam-01',
      resolution: '1080p (1920x1080)',
      fps: 30,
      lastActive: '8 mins ago',
    },
  ];

  private activities: SystemActivity[] = [
    {
      id: 'act-1',
      user: 'Alexandra Vance (Admin)',
      action: 'Registered new store branch',
      target: 'Hyderabad Cyber Towers (ST-TS-004)',
      timestamp: '15 mins ago',
      type: 'success',
    },
    {
      id: 'act-2',
      user: 'Rajesh Sharma',
      action: 'Updated camera stream URL',
      target: 'CAM-MUM-01 (Beverages)',
      timestamp: '32 mins ago',
      type: 'info',
    },
    {
      id: 'act-3',
      user: 'System Watchdog',
      action: 'Detected camera signal drop',
      target: 'CAM-MUM-03 (Electronics)',
      timestamp: '1 hour ago',
      type: 'warning',
    },
    {
      id: 'act-4',
      user: 'Vikram Mehta',
      action: 'Added shelf',
      target: 'Gadgets & Accessories F2',
      timestamp: '3 hours ago',
      type: 'success',
    },
    {
      id: 'act-5',
      user: 'Priya Sundaram',
      action: 'Generated store status report',
      target: 'Delhi Connaught Plaza',
      timestamp: '5 hours ago',
      type: 'info',
    },
  ];

  // Users Methods
  getUsers(): User[] {
    return this.users;
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(data: Partial<User>): User {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name || 'New User',
      email: data.email || 'user@cams.com',
      role: data.role || 'Analyst',
      assignedStoreId: data.assignedStoreId,
      assignedStoreName: data.assignedStoreName,
      status: data.status || 'Active',
      phone: data.phone || '+91 98000 00000',
      createdAt: new Date().toISOString(),
    };
    this.users.unshift(newUser);
    return newUser;
  }

  updateUser(id: string, data: Partial<User>): User | undefined {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.users[idx] = { ...this.users[idx], ...data };
    return this.users[idx];
  }

  deleteUser(id: string): boolean {
    const len = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    return this.users.length < len;
  }

  // Stores Methods
  getStores(): Store[] {
    return this.stores;
  }

  createStore(data: Partial<Store>): Store {
    const newStore: Store = {
      id: `str-${Date.now()}`,
      name: data.name || 'New Store',
      storeCode: data.storeCode || `ST-IN-${Math.floor(100 + Math.random() * 900)}`,
      address: data.address || 'MG Road',
      city: data.city || 'Mumbai',
      state: data.state || 'MH',
      managerName: data.managerName || 'Unassigned',
      status: data.status || 'Active',
      shelfCount: 0,
      cameraCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.stores.unshift(newStore);
    return newStore;
  }

  updateStore(id: string, data: Partial<Store>): Store | undefined {
    const idx = this.stores.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    const oldName = this.stores[idx].name;
    this.stores[idx] = { ...this.stores[idx], ...data };
    const newName = this.stores[idx].name;

    // Sync updated store name across shelves and cameras
    if (oldName !== newName) {
      this.shelves.forEach((sh) => {
        if (sh.storeId === id) sh.storeName = newName;
      });
      this.cameras.forEach((cam) => {
        if (cam.storeId === id) cam.storeName = newName;
      });
      this.users.forEach((usr) => {
        if (usr.assignedStoreId === id) usr.assignedStoreName = newName;
      });
    }

    return this.stores[idx];
  }

  deleteStore(id: string): boolean {
    const len = this.stores.length;
    this.stores = this.stores.filter((s) => s.id !== id);
    if (this.stores.length < len) {
      // Cascading deletion for shelves and cameras belonging to deleted store
      this.shelves = this.shelves.filter((sh) => sh.storeId !== id);
      this.cameras = this.cameras.filter((cam) => cam.storeId !== id);
      this.users.forEach((usr) => {
        if (usr.assignedStoreId === id) {
          usr.assignedStoreId = undefined;
          usr.assignedStoreName = undefined;
        }
      });
      return true;
    }
    return false;
  }

  // Shelves Methods
  getShelves(): Shelf[] {
    return this.shelves;
  }

  createShelf(data: Partial<Shelf>): Shelf {
    const targetStoreId = data.storeId || (this.stores[0] ? this.stores[0].id : 'str-1');
    const store = this.stores.find((s) => s.id === targetStoreId);
    const storeName = store ? store.name : (data.storeName || 'Store Location');

    const newShelf: Shelf = {
      id: `shf-${Date.now()}`,
      name: data.name || data.shelfName || 'New Shelf',
      shelfName: data.shelfName || data.name || 'New Shelf',
      shelfNumber: data.shelfNumber || `SH-${Math.floor(10 + Math.random() * 90)}`,
      storeId: targetStoreId,
      storeName: storeName,
      category: data.category || 'General',
      section: data.section || 'Aisle 1',
      productCount: data.productCount || 50,
      status: data.status || 'Active',
      createdAt: new Date().toISOString(),
    };
    this.shelves.unshift(newShelf);

    // Update shelf count on store
    if (store) store.shelfCount = (store.shelfCount || 0) + 1;

    return newShelf;
  }

  updateShelf(id: string, data: Partial<Shelf>): Shelf | undefined {
    const idx = this.shelves.findIndex((sh) => sh.id === id);
    if (idx === -1) return undefined;

    const oldStoreId = this.shelves[idx].storeId;
    let storeName = this.shelves[idx].storeName;

    if (data.storeId && data.storeId !== oldStoreId) {
      // Adjust shelf counts
      const oldStore = this.stores.find((s) => s.id === oldStoreId);
      if (oldStore && oldStore.shelfCount > 0) oldStore.shelfCount -= 1;

      const newStore = this.stores.find((s) => s.id === data.storeId);
      if (newStore) {
        newStore.shelfCount = (newStore.shelfCount || 0) + 1;
        storeName = newStore.name;
      }
    } else if (data.storeId) {
      const currentStore = this.stores.find((s) => s.id === data.storeId);
      if (currentStore) storeName = currentStore.name;
    }

    const updatedName = data.shelfName || data.name || this.shelves[idx].name;

    this.shelves[idx] = {
      ...this.shelves[idx],
      ...data,
      storeName,
      name: updatedName,
      shelfName: updatedName,
    };

    // Update shelf name on attached cameras
    this.cameras.forEach((cam) => {
      if (cam.shelfId === id) cam.shelfName = updatedName;
    });

    return this.shelves[idx];
  }

  deleteShelf(id: string): boolean {
    const shelf = this.shelves.find((sh) => sh.id === id);
    if (shelf) {
      const store = this.stores.find((s) => s.id === shelf.storeId);
      if (store && store.shelfCount > 0) store.shelfCount -= 1;
      
      // Unlink camera from deleted shelf
      this.cameras.forEach((cam) => {
        if (cam.shelfId === id) {
          cam.shelfId = undefined;
          cam.shelfName = undefined;
        }
      });
    }
    const len = this.shelves.length;
    this.shelves = this.shelves.filter((sh) => sh.id !== id);
    return this.shelves.length < len;
  }

  // Cameras Methods
  getCameras(): Camera[] {
    return this.cameras;
  }

  createCamera(data: Partial<Camera>): Camera {
    const targetStoreId = data.storeId || (this.stores[0] ? this.stores[0].id : 'str-1');
    const store = this.stores.find((s) => s.id === targetStoreId);
    const storeName = store ? store.name : (data.storeName || 'Store Location');

    const shelf = data.shelfId ? this.shelves.find((sh) => sh.id === data.shelfId) : undefined;
    const shelfName = shelf ? shelf.name : data.shelfName;

    const newCamera: Camera = {
      id: `cam-${Date.now()}`,
      name: data.name || data.cameraName || 'New Camera',
      cameraName: data.cameraName || data.name || 'New Camera',
      cameraId: data.cameraId || data.cameraCode || `CAM-IN-${Math.floor(10 + Math.random() * 90)}`,
      cameraCode: data.cameraCode || data.cameraId || `CAM-IN-${Math.floor(10 + Math.random() * 90)}`,
      shelfId: data.shelfId,
      shelfName: shelfName,
      storeId: targetStoreId,
      storeName: storeName,
      status: data.status || 'Active',
      streamUrl: data.streamUrl || 'rtsp://stream.cams-system.internal/in/cam-01',
      resolution: data.resolution || '1080p (1920x1080)',
      fps: data.fps || 30,
      lastActive: 'Just now',
      createdAt: new Date().toISOString(),
    };
    this.cameras.unshift(newCamera);

    // Update camera count on store
    if (store) store.cameraCount = (store.cameraCount || 0) + 1;

    return newCamera;
  }

  updateCamera(id: string, data: Partial<Camera>): Camera | undefined {
    const idx = this.cameras.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;

    const oldStoreId = this.cameras[idx].storeId;
    let storeName = this.cameras[idx].storeName;

    if (data.storeId && data.storeId !== oldStoreId) {
      const oldStore = this.stores.find((s) => s.id === oldStoreId);
      if (oldStore && oldStore.cameraCount > 0) oldStore.cameraCount -= 1;

      const newStore = this.stores.find((s) => s.id === data.storeId);
      if (newStore) {
        newStore.cameraCount = (newStore.cameraCount || 0) + 1;
        storeName = newStore.name;
      }
    } else if (data.storeId) {
      const currentStore = this.stores.find((s) => s.id === data.storeId);
      if (currentStore) storeName = currentStore.name;
    }

    let shelfName = this.cameras[idx].shelfName;
    if (data.shelfId) {
      const shelf = this.shelves.find((sh) => sh.id === data.shelfId);
      if (shelf) shelfName = shelf.name;
    } else if (data.shelfId === null || data.shelfId === '') {
      shelfName = undefined;
    }

    this.cameras[idx] = {
      ...this.cameras[idx],
      ...data,
      storeName,
      shelfName,
      name: data.cameraName || data.name || this.cameras[idx].name,
      cameraName: data.cameraName || data.name || this.cameras[idx].cameraName,
      cameraId: data.cameraCode || data.cameraId || this.cameras[idx].cameraId,
      cameraCode: data.cameraCode || data.cameraId || this.cameras[idx].cameraCode,
    };
    return this.cameras[idx];
  }

  deleteCamera(id: string): boolean {
    const camera = this.cameras.find((c) => c.id === id);
    if (camera) {
      const store = this.stores.find((s) => s.id === camera.storeId);
      if (store && store.cameraCount > 0) store.cameraCount -= 1;
    }
    const len = this.cameras.length;
    this.cameras = this.cameras.filter((c) => c.id !== id);
    return this.cameras.length < len;
  }

  // System Stats
  getStats(): SystemStats {
    const totalStores = this.stores.length;
    const activeStores = this.stores.filter((s) => s.status === 'Active').length;
    const totalShelves = this.shelves.length;
    const totalCameras = this.cameras.length;
    const activeCameras = this.cameras.filter((c) => c.status === 'Active').length;
    const offlineCameras = this.cameras.filter((c) => c.status === 'Offline').length;
    const maintenanceCameras = this.cameras.filter((c) => c.status === 'Maintenance').length;
    const totalUsers = this.users.length;

    return {
      totalStores,
      activeStores,
      totalShelves,
      totalCameras,
      activeCameras,
      offlineCameras,
      maintenanceCameras,
      totalUsers,
      recentActivities: this.activities,
    };
  }
}

export const db = new Database();
