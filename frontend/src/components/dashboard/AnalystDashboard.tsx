import React, { useState } from 'react';
import { Store, Shelf, Camera } from '../../types';
import { MetricCard } from './MetricCard';
import {
  Store as StoreIcon,
  Camera as CameraIcon,
  Eye,
  Activity,
  Clock,
  TrendingUp,
  Flame,
  Search,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface AnalystDashboardProps {
  stores: Store[];
  shelves: Shelf[];
  cameras: Camera[];
}

export const AnalystDashboard: React.FC<AnalystDashboardProps> = ({
  stores,
  shelves,
  cameras,
}) => {
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');

  // Filter objects based on selected store
  const currentStore = stores.find((s) => s.id === selectedStoreId);

  const filteredShelves =
    selectedStoreId === 'all'
      ? shelves
      : shelves.filter((sh) => sh.storeId === selectedStoreId || sh.storeName === currentStore?.name);

  const filteredCameras =
    selectedStoreId === 'all'
      ? cameras
      : cameras.filter((c) => c.storeId === selectedStoreId || c.storeName === currentStore?.name);

  // Dynamic calculated metrics based on selection
  const isAll = selectedStoreId === 'all';

  const totalVisitors = isAll ? '142,500' : selectedStoreId === 'str-1' ? '42,500' : selectedStoreId === 'str-2' ? '38,200' : selectedStoreId === 'str-3' ? '34,800' : '27,000';
  const visitorsToday = isAll ? '12,850' : selectedStoreId === 'str-1' ? '3,850' : selectedStoreId === 'str-2' ? '3,400' : selectedStoreId === 'str-3' ? '3,100' : '2,500';
  const storeAttentionScore = isAll ? '84.6%' : selectedStoreId === 'str-1' ? '88.2%' : selectedStoreId === 'str-2' ? '86.5%' : selectedStoreId === 'str-3' ? '81.0%' : '82.8%';

  const workingCameras = filteredCameras.filter((c) => c.status === 'Active').length;
  const offlineCameras = filteredCameras.filter((c) => c.status === 'Offline').length;

  const peakShoppingHour = isAll
    ? '5:00 PM - 7:00 PM'
    : selectedStoreId === 'str-1'
    ? '6:00 PM - 8:00 PM'
    : selectedStoreId === 'str-2'
    ? '1:00 PM - 3:00 PM'
    : '4:00 PM - 6:00 PM';

  // 1. Hourly Footfall Data
  const hourlyFootfallData = [
    { hour: '9 AM', footfall: isAll ? 850 : 210 },
    { hour: '11 AM', footfall: isAll ? 1820 : 450 },
    { hour: '1 PM', footfall: isAll ? 2100 : 580 },
    { hour: '3 PM', footfall: isAll ? 2450 : 640 },
    { hour: '5 PM', footfall: isAll ? 3890 : 920 },
    { hour: '7 PM', footfall: isAll ? 4120 : 980 },
    { hour: '9 PM', footfall: isAll ? 2150 : 510 },
  ];

  // 2. Customer Trend Data (Multi-day)
  const customerTrendData = [
    { day: 'Mon', shoppers: isAll ? 16400 : 4100, attentionScore: 82 },
    { day: 'Tue', shoppers: isAll ? 17800 : 4450, attentionScore: 84 },
    { day: 'Wed', shoppers: isAll ? 19200 : 4800, attentionScore: 86 },
    { day: 'Thu', shoppers: isAll ? 18500 : 4600, attentionScore: 85 },
    { day: 'Fri', shoppers: isAll ? 23400 : 5850, attentionScore: 89 },
    { day: 'Sat', shoppers: isAll ? 28900 : 7200, attentionScore: 92 },
    { day: 'Sun', shoppers: isAll ? 26200 : 6550, attentionScore: 90 },
  ];

  // 3. Shelf Engagement Data (Gaze dwell time per shelf category)
  const shelfEngagementData = [
    { category: 'Beverages', avgGazeSecs: 24.5, conversionPct: 58 },
    { category: 'Snacks', avgGazeSecs: 18.2, conversionPct: 44 },
    { category: 'Dairy', avgGazeSecs: 15.6, conversionPct: 40 },
    { category: 'Electronics', avgGazeSecs: 28.4, conversionPct: 35 },
    { category: 'Personal Care', avgGazeSecs: 14.1, conversionPct: 31 },
  ];

  // 4. Camera Health & Latency Data
  const cameraHealthData = filteredCameras.map((c) => ({
    code: c.cameraCode || c.cameraId || c.name,
    status: c.status,
    latencyMs: c.status === 'Active' ? Math.floor(2 + Math.random() * 5) : 0,
    fps: c.fps || 30,
  }));

  // 5. Attention Heat Summary Zones
  const heatZones = [
    { zone: 'Aisle 1 - Cold Beverages', heatLevel: 'High (88%)', statusColor: 'bg-[#00E676] text-slate-950' },
    { zone: 'Aisle 2 - Snacks & Chips', heatLevel: 'High (82%)', statusColor: 'bg-[#00E676] text-slate-950' },
    { zone: 'Aisle 3 - Dairy Refrigeration', heatLevel: 'Medium (68%)', statusColor: 'bg-amber-400 text-slate-950' },
    { zone: 'Aisle 4 - Bakery & Packaged Goods', heatLevel: 'Moderate (54%)', statusColor: 'bg-slate-300 text-slate-800' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Bar with Store Selector */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#008A3E] border border-emerald-200 text-xs font-bold">
              Analyst Console
            </span>
            <span className="text-xs text-slate-500 font-medium">Read-Only Telemetry & Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Attention & Telemetry Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Analyze shopper attention metrics, gaze dwell time, and sensor performance
          </p>
        </div>

        {/* Store Selector Dropdown */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 pl-2 text-xs font-bold text-slate-600">
            <Search className="w-4 h-4 text-[#008A3E]" />
            <span>Target Store:</span>
          </div>
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676] shadow-sm cursor-pointer"
          >
            <option value="all">All Stores (Aggregate Fleet)</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Required Display Metrics (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Visitors"
          value={totalVisitors}
          trend={{ value: 'Historical Cumulative' }}
          icon={<Eye className="w-5 h-5" />}
          subtitle={isAll ? 'All Store Branches' : currentStore?.name}
        />
        <MetricCard
          title="Visitors Today"
          value={visitorsToday}
          trend={{ value: '+14.2% YoY' }}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle="Today's Entrance Volume"
        />
        <MetricCard
          title="Store Attention Score"
          value={storeAttentionScore}
          trend={{ value: '+4.1% Lift' }}
          icon={<Activity className="w-5 h-5 text-[#008A3E]" />}
          subtitle="Gaze Conversion Index"
        />
        <MetricCard
          title="Number of Cameras"
          value={filteredCameras.length}
          trend={{ value: `${workingCameras} Working` }}
          icon={<CameraIcon className="w-5 h-5" />}
          subtitle="Optical Grid"
        />
        <MetricCard
          title="Peak Shopping Hour"
          value={peakShoppingHour}
          trend={{ value: 'High Traffic' }}
          icon={<Clock className="w-5 h-5" />}
          subtitle="Peak Gaze & Entrance"
        />
      </div>

      {/* Required Charts (5 Charts & Summaries) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Hourly Footfall (Span 6) */}
        <div className="lg:col-span-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Hourly Footfall</h2>
              <p className="text-xs text-slate-500">Distribution of shopper visits across the day</p>
            </div>
            <span className="text-xs font-bold text-[#008A3E] bg-[#00E676]/15 px-2.5 py-1 rounded-md">
              Visits/Hour
            </span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyFootfallData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="analystHourlyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E676" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00E676" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="footfall" stroke="#00E676" strokeWidth={3} fillOpacity={1} fill="url(#analystHourlyGrad)" name="Shopper Footfall" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Customer Trend (Span 6) */}
        <div className="lg:col-span-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Customer Trend</h2>
              <p className="text-xs text-slate-500">7-day shopper volume vs Attention Score trend</p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              7 Days
            </span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="shoppers" stroke="#00E676" strokeWidth={3} dot={{ r: 4, fill: '#00E676' }} name="Shoppers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Shelf Engagement (Span 6) */}
        <div className="lg:col-span-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Shelf Engagement</h2>
              <p className="text-xs text-slate-500">Average gaze dwell duration (seconds) by category</p>
            </div>
            <span className="text-xs font-bold text-[#008A3E]">Seconds / Shopper</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shelfEngagementData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="avgGazeSecs" fill="#00E676" radius={[6, 6, 0, 0]} name="Avg Gaze (s)" barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Camera Health (Span 6) */}
        <div className="lg:col-span-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Camera Health</h2>
              <p className="text-xs text-slate-500">Optical sensor stream frame rates and status</p>
            </div>
            <span className="text-xs font-bold text-[#008A3E]">{workingCameras} / {filteredCameras.length} Active</span>
          </div>
          <div className="space-y-3 pt-1 overflow-y-auto max-h-[220px]">
            {filteredCameras.map((c) => (
              <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900">{c.cameraCode || c.cameraId}</span>
                  <p className="text-[11px] text-slate-500 truncate">{c.shelfName || c.storeName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-600">{c.fps || 30} FPS</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      c.status === 'Active'
                        ? 'bg-[#00E676]/15 text-[#008A3E] border-[#00E676]/30'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 5: Attention Heat Summary (Span 12) */}
        <div className="lg:col-span-12 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#00E676]/15 text-[#008A3E] border border-[#00E676]/40">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Attention Heat Summary</h2>
                <p className="text-xs text-slate-500">High-dwell zone mapping and aisle attention concentration</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500">Aisle Heat Index</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {heatZones.map((z, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 block truncate">{z.zone}</span>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">Heat Level</span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-extrabold ${z.statusColor}`}>
                    {z.heatLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
