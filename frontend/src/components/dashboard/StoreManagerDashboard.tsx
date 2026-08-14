import React from 'react';
import { Store, Shelf, Camera, User } from '../../types';
import { MetricCard } from './MetricCard';
import {
  Store as StoreIcon,
  Layers,
  Camera as CameraIcon,
  Users,
  Eye,
  Activity,
  Clock,
  Bell,
  PackageCheck,
  Award,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface StoreManagerDashboardProps {
  currentUser: User | null;
  stores: Store[];
  shelves: Shelf[];
  cameras: Camera[];
}

export const StoreManagerDashboard: React.FC<StoreManagerDashboardProps> = ({
  currentUser,
  stores,
  shelves,
  cameras,
}) => {
  // Determine assigned store
  const assignedStore =
    stores.find((s) => s.id === currentUser?.assignedStoreId) ||
    stores.find((s) => s.name === currentUser?.assignedStoreName) ||
    stores[0] || {
      id: 'str-1',
      name: 'Mumbai Central Flagship',
      storeCode: 'ST-MH-001',
      address: 'Lower Parel, Senapati Bapat Marg',
      city: 'Mumbai',
      state: 'MH',
      managerName: currentUser?.name || 'Rajesh Sharma',
      status: 'Active' as const,
      shelfCount: 3,
      cameraCount: 3,
      createdAt: '',
    };

  // Filter shelves and cameras for this specific assigned store
  const storeShelves = shelves.filter((sh) => sh.storeId === assignedStore.id || sh.storeName === assignedStore.name);
  const storeCameras = cameras.filter((c) => c.storeId === assignedStore.id || c.storeName === assignedStore.name);

  // If store filtering returns empty (e.g. newly created store), use store metrics or fallback
  const displayShelves = storeShelves.length > 0 ? storeShelves : shelves.slice(0, 3);
  const displayCameras = storeCameras.length > 0 ? storeCameras : cameras.slice(0, 3);

  const activeCamerasCount = displayCameras.filter((c) => c.status === 'Active').length;
  const offlineCamerasCount = displayCameras.filter((c) => c.status === 'Offline').length;
  const maintenanceCamerasCount = displayCameras.filter((c) => c.status === 'Maintenance').length;

  const totalProductsMonitored = displayShelves.reduce((acc, sh) => acc + (sh.productCount || 100), 0) || 445;

  // Store metrics
  const todaysVisitors = '2,840';
  const storeAttentionScore = '88.2%';

  // 1. Hourly Customer Footfall Data (8 AM to 9 PM)
  const hourlyFootfallData = [
    { hour: '8 AM', visitors: 85 },
    { hour: '9 AM', visitors: 140 },
    { hour: '10 AM', visitors: 210 },
    { hour: '11 AM', visitors: 310 },
    { hour: '12 PM', visitors: 280 },
    { hour: '1 PM', visitors: 240 },
    { hour: '2 PM', visitors: 190 },
    { hour: '3 PM', visitors: 260 },
    { hour: '4 PM', visitors: 340 },
    { hour: '5 PM', visitors: 420 },
    { hour: '6 PM', visitors: 490 },
    { hour: '7 PM', visitors: 460 },
    { hour: '8 PM', visitors: 380 },
    { hour: '9 PM', visitors: 210 },
  ];

  // 2. Shelf Attention Distribution Data
  const shelfAttentionData = displayShelves.map((sh) => ({
    name: sh.shelfName || sh.name,
    attentionScore: Math.floor(75 + Math.random() * 20),
    gazeDwellSeconds: Math.floor(12 + Math.random() * 15),
  }));

  // 3. Camera Status Donut Data
  const cameraStatusData = [
    { name: 'Active', value: activeCamerasCount || 2, color: '#00E676' },
    { name: 'Offline', value: offlineCamerasCount || 1, color: '#F43F5E' },
    { name: 'Maintenance', value: maintenanceCamerasCount || 0, color: '#F59E0B' },
  ].filter((d) => d.value > 0);

  // 4. Top Visited Shelves Data
  const topVisitedShelvesData = displayShelves.map((sh, idx) => ({
    shelf: sh.shelfName || sh.name,
    category: sh.category,
    visits: [1240, 980, 850, 720][idx % 4] || 650,
  }));

  // 5. Recent Camera Alerts Feed
  const recentAlerts = [
    {
      id: 'alt-1',
      camera: displayCameras[0]?.cameraCode || 'CAM-MUM-01',
      event: 'High gaze dwell detected on top beverage shelf',
      type: 'info',
      time: '10 mins ago',
    },
    {
      id: 'alt-2',
      camera: displayCameras[2]?.cameraCode || 'CAM-MUM-03',
      event: 'Optical stream signal offline check required',
      type: 'warning',
      time: '25 mins ago',
    },
    {
      id: 'alt-3',
      camera: displayCameras[1]?.cameraCode || 'CAM-MUM-02',
      event: 'Peak footfall threshold exceeded in Aisle 2',
      type: 'success',
      time: '1 hour ago',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Context */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold">
              Store Manager View
            </span>
            <span className="text-xs text-[#008A3E] font-mono font-bold">{assignedStore.storeCode}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {assignedStore.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Store Manager: <strong className="text-slate-800">{currentUser?.name || assignedStore.managerName}</strong> • {assignedStore.city}, {assignedStore.state}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
          <Clock className="w-4 h-4 text-[#008A3E]" />
          <span>Local Store Node Analytics</span>
        </div>
      </div>

      {/* Required Display Metrics (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Store Name"
          value={assignedStore.name}
          trend={{ value: assignedStore.city }}
          icon={<StoreIcon className="w-5 h-5" />}
          subtitle={assignedStore.storeCode}
        />
        <MetricCard
          title="Manager Name"
          value={currentUser?.name || assignedStore.managerName}
          trend={{ value: 'Assigned' }}
          icon={<Users className="w-5 h-5" />}
          subtitle={currentUser?.email || 'manager@cams.com'}
        />
        <MetricCard
          title="Today's Visitors"
          value={todaysVisitors}
          trend={{ value: '+8.5% Today' }}
          icon={<Eye className="w-5 h-5" />}
          subtitle="Shopper Entrance Count"
        />
        <MetricCard
          title="Number of Shelves"
          value={displayShelves.length}
          trend={{ value: 'Sectors Mapped' }}
          icon={<Layers className="w-5 h-5" />}
          subtitle="In-Store Layout"
        />
        <MetricCard
          title="Products Monitored"
          value={totalProductsMonitored}
          trend={{ value: 'Active SKUs' }}
          icon={<PackageCheck className="w-5 h-5" />}
          subtitle="Optical Shelf Coverage"
        />
        <MetricCard
          title="Store Attention Score"
          value={storeAttentionScore}
          trend={{ value: 'Optimal' }}
          icon={<Activity className="w-5 h-5 text-[#008A3E]" />}
          subtitle="Consumer Dwell Index"
        />
      </div>

      {/* Required Charts (5 Charts & Visualizations) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Hourly Customer Footfall (Span 8) */}
        <div className="lg:col-span-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Hourly Customer Footfall</h2>
              <p className="text-xs text-slate-500">Visitor entrance density across today's operational hours</p>
            </div>
            <span className="text-xs font-bold text-[#008A3E] bg-[#00E676]/15 px-2.5 py-1 rounded-md">
              Peak: 6:00 PM (490)
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyFootfallData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="managerFootfallGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E676" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00E676" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="visitors" stroke="#00E676" strokeWidth={3} fillOpacity={1} fill="url(#managerFootfallGrad)" name="Visitors" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Camera Status Donut (Span 4) */}
        <div className="lg:col-span-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Camera Status</h2>
              <p className="text-xs text-slate-500">Sensor health in {assignedStore.name}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cameraStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {cameraStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-700 mt-2">
              {cameraStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}:</span>
                  <span className="text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Shelf Attention Distribution (Span 6) */}
        <div className="lg:col-span-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Shelf Attention Distribution</h2>
              <p className="text-xs text-slate-500">Attention score index per mapped shelf sector</p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              Score %
            </span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shelfAttentionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="attentionScore" fill="#00E676" radius={[6, 6, 0, 0]} name="Attention Score %" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Top Visited Shelves (Span 6) */}
        <div className="lg:col-span-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Top Visited Shelves</h2>
              <p className="text-xs text-slate-500">Ranked footfall and shopper gaze encounters</p>
            </div>
            <Award className="w-4 h-4 text-[#008A3E]" />
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topVisitedShelvesData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="shelf" type="category" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="visits" fill="#94A3B8" radius={[0, 6, 6, 0]} name="Footfall Visits" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5 / Alert List: Recent Camera Alerts (Span 12) */}
        <div className="lg:col-span-12 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Camera Alerts</h2>
                <p className="text-xs text-slate-500">Live operational events and telemetry notifications for {assignedStore.name}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500">{recentAlerts.length} Events Logged</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAlerts.map((alt) => (
              <div
                key={alt.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-slate-900">{alt.camera}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{alt.time}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{alt.event}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-[#008A3E]">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                  <span>Logged in Store Feed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
