import React from 'react';
import { SystemStats, Store, Shelf, Camera, User } from '../../types';
import { MetricCard } from './MetricCard';
import {
  Store as StoreIcon,
  Layers,
  Camera as CameraIcon,
  Users,
  Eye,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  UserCheck,
} from 'lucide-react';
import {
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

interface AdminDashboardProps {
  stats: SystemStats | null;
  stores: Store[];
  shelves: Shelf[];
  cameras: Camera[];
  usersList: User[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  stores,
  shelves,
  cameras,
  usersList,
}) => {
  // Calculated KPIs
  const storeManagersCount = usersList.filter((u) => u.role === 'Store Manager').length || 2;
  const analystsCount = usersList.filter((u) => u.role === 'Analyst').length || 1;

  const totalStores = stats?.totalStores || stores.length || 4;
  const totalShelves = stats?.totalShelves || shelves.length || 8;
  const totalCameras = stats?.totalCameras || cameras.length || 8;
  const activeCameras = stats?.activeCameras || cameras.filter((c) => c.status === 'Active').length || 6;
  const offlineCameras = stats?.offlineCameras || cameras.filter((c) => c.status === 'Offline').length || 1;

  // Static/calculated aggregate metrics for enterprise analytics
  const totalConsumersToday = '12,850';
  const totalFootfall = '142,500';
  const avgAttentionScore = '84.6%';

  // 1. Consumer Footfall Across Stores Chart Data
  const storeFootfallData = stores.length > 0
    ? stores.map((s) => ({
        store: s.name.replace(' Flagship', '').replace(' Towers', '').replace(' Plaza', '').replace(' Park', ''),
        footfall: (s.shelfCount + s.cameraCount + 1) * 8500,
        consumersToday: (s.shelfCount + s.cameraCount + 1) * 750,
      }))
    : [
        { store: 'Mumbai Central', footfall: 42500, consumersToday: 3850 },
        { store: 'Bengaluru Tech', footfall: 38200, consumersToday: 3400 },
        { store: 'Delhi Connaught', footfall: 34800, consumersToday: 3100 },
        { store: 'Hyderabad Cyber', footfall: 27000, consumersToday: 2500 },
      ];

  // 2. Store Performance Comparison Chart Data (Attention Score vs Dwell Index)
  const storePerformanceData = stores.length > 0
    ? stores.map((s, idx) => ({
        store: s.name.replace(' Flagship', '').replace(' Towers', '').replace(' Plaza', '').replace(' Park', ''),
        score: Number((82 + (idx * 3) % 12).toFixed(1)),
        dwellIndex: 80 + ((idx * 5) % 18),
      }))
    : [
        { store: 'Mumbai Central', score: 88.2, dwellIndex: 91 },
        { store: 'Bengaluru Tech', score: 86.5, dwellIndex: 88 },
        { store: 'Delhi Connaught', score: 81.0, dwellIndex: 82 },
        { store: 'Hyderabad Cyber', score: 82.8, dwellIndex: 84 },
      ];

  // 3. Camera Status Overview Donut Chart Data
  const cameraStatusData = [
    { name: 'Active', value: activeCameras, color: '#00E676' },
    { name: 'Offline', value: offlineCameras, color: '#F43F5E' },
    { name: 'Maintenance', value: stats?.maintenanceCameras || 1, color: '#F59E0B' },
  ];

  // 4. Shelf Category Distribution Data
  const categoryCounts: Record<string, number> = {};
  shelves.forEach((s) => {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
  });
  const categoryDistributionData = Object.keys(categoryCounts).length > 0
    ? Object.keys(categoryCounts).map((cat) => ({
        category: cat,
        count: categoryCounts[cat],
      }))
    : [
        { category: 'Beverages', count: 2 },
        { category: 'Snacks', count: 1 },
        { category: 'Electronics', count: 2 },
        { category: 'Dairy', count: 1 },
        { category: 'Stationery', count: 1 },
        { category: 'Toys', count: 1 },
      ];

  return (
    <div className="space-y-8">
      {/* Top Banner Context */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold">
              System Admin
            </span>
            <span className="text-xs text-slate-500 font-medium">Enterprise Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            System Executive Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            High-level operational overview across all connected store branches and optical telemetry nodes
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
          <Clock className="w-4 h-4 text-[#008A3E]" />
          <span>Real-time Multi-Store Sync</span>
        </div>
      </div>

      {/* KPI Metrics Grid (3 Required KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Stores"
          value={totalStores}
          trend={{ value: `${stats?.activeStores || 3} Active` }}
          icon={<StoreIcon className="w-5 h-5" />}
          subtitle="Enterprise Fleet"
        />
        <MetricCard
          title="Total Shelves"
          value={totalShelves}
          trend={{ value: 'Mapped' }}
          icon={<Layers className="w-5 h-5" />}
          subtitle="Inventory Sectors"
        />
        <MetricCard
          title="Total Camera Boxes"
          value={totalCameras}
          trend={{ value: `${activeCameras} Online` }}
          icon={<CameraIcon className="w-5 h-5" />}
          subtitle="Optical Grid"
        />
      </div>

      {/* Charts Grid (4 Required Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Consumer Footfall Across Stores */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Consumer Footfall Across Stores</h2>
              <p className="text-xs text-slate-500">Total footfall traffic distribution by store branch</p>
            </div>
            <span className="text-xs font-bold text-[#008A3E] bg-[#00E676]/15 px-2.5 py-1 rounded-md">
              Footfall Count
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storeFootfallData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="store" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="footfall" fill="#00E676" radius={[6, 6, 0, 0]} name="Total Footfall" barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Store Performance Comparison */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Store Performance Comparison</h2>
              <p className="text-xs text-slate-500">Store Attention Score vs Shopper Dwell Index</p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              Score %
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storePerformanceData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="store" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="score" fill="#00E676" radius={[6, 6, 0, 0]} name="Attention Score %" barSize={24} />
                <Bar dataKey="dwellIndex" fill="#94A3B8" radius={[6, 6, 0, 0]} name="Dwell Index" barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Camera Status Overview */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Camera Status Overview</h2>
              <p className="text-xs text-slate-500">Optical sensor fleet operational status distribution</p>
            </div>
            <span className="text-xs font-bold text-[#008A3E]">{activeCameras} Active Sensors</span>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-700 mt-2">
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

        {/* Chart 4: Shelf Category Distribution */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Shelf Category Distribution</h2>
              <p className="text-xs text-slate-500">Category sectors mapped across stores</p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              {totalShelves} Sectors Total
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistributionData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#00E676" radius={[0, 6, 6, 0]} name="Shelves Count" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table: Recent Store Activity (Columns: Store | Manager | Status | Last Updated) */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Store Activity</h2>
            <p className="text-xs text-slate-500">Current operational state and store managers assigned across all store branches</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Store</th>
                <th className="py-3 px-4">Manager</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {stores.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{s.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono font-normal">{s.storeCode} • {s.city}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {s.managerName || 'Unassigned'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        s.status === 'Active'
                          ? 'bg-[#00E676]/15 text-[#008A3E] border-[#00E676]/30'
                          : s.status === 'Maintenance'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          s.status === 'Active' ? 'bg-[#00E676]' : s.status === 'Maintenance' ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                      />
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                    {idx === 0 ? '2 mins ago' : idx === 1 ? '15 mins ago' : idx === 2 ? '1 hour ago' : '3 hours ago'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
