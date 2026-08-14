import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Store } from '../types';
import {
  BarChart2,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Flame,
  PieChart as PieIcon,
  ArrowUpRight,
  Video,
} from 'lucide-react';
import { VideoAnalysisSection } from '../components/analytics/VideoAnalysis';

type AnalyticsTab = 'overview' | 'video' | 'tracking' | 'attention' | 'heatmaps' | 'insights';

export const AnalyticsPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<AnalyticsTab>('video');
  const [selectedStore, setSelectedStore] = useState('All');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedHeatmapZone, setSelectedHeatmapZone] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get('/stores');
        if (Array.isArray(res.data)) {
          setStores(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch stores in AnalyticsPage', err);
      }
    };
    fetchStores();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#008A3E]" />
            <span>Consumer Attention & Behavioral Intelligence</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deep analytics into foot traffic, shopper dwell attention, video analysis, shelf heatmaps, and AI-driven behavior patterns.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
          >
            <option value="All">All Stores (Global)</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.city})
              </option>
            ))}
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Quarter to Date</option>
          </select>
        </div>
      </div>

      {/* Analytics Sub-Tab Navigation Bar */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm flex flex-wrap gap-1">
        {[
          { id: 'video', label: 'AI Video Analysis (YOLOv8)', icon: Video },
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'tracking', label: 'Consumer Tracking', icon: Users },
          { id: 'attention', label: 'Attention Analysis', icon: Eye },
          { id: 'heatmaps', label: 'Heatmaps', icon: Flame },
          { id: 'insights', label: 'Behavior Insights', icon: PieIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as AnalyticsTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#00E676] text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: AI Video Analysis */}
      {activeSubTab === 'video' && <VideoAnalysisSection />}

      {/* Tab 1: Overview */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Key KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-600">Total Foot Traffic</span>
                <Users className="w-4 h-4 text-[#008A3E]" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900">128,450</span>
                <span className="text-xs font-extrabold text-[#008A3E] flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Unique shoppers detected</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-600">Avg Gaze Dwell Time</span>
                <Clock className="w-4 h-4 text-[#008A3E]" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900">18.4s</span>
                <span className="text-xs font-extrabold text-[#008A3E] flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +2.8s
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Attention hold per shelf zone</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-600">Engagement Conversion</span>
                <Eye className="w-4 h-4 text-[#008A3E]" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900">42.8%</span>
                <span className="text-xs font-extrabold text-[#008A3E] flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +5.1%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Look-to-pick interactions</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-600">Top Performing Sector</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-extrabold text-slate-900 truncate">Beverages Endcap</span>
                <span className="text-xs font-bold text-amber-600">98% Hot</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Highest total eye gaze density</p>
            </div>
          </div>

          {/* Overview Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Foot Traffic vs Gaze Engagement Trend
                  </h3>
                  <p className="text-xs text-slate-400">Hourly volume of passing shoppers vs active gaze impressions</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#00E676]" />
                    <span className="text-slate-700">Foot Traffic</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-700" />
                    <span className="text-slate-700">Gaze Engagement</span>
                  </div>
                </div>
              </div>

              {/* Simulated Chart Bars */}
              <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-4 border-b border-slate-100">
                {[
                  { hour: '09:00', traffic: 45, gaze: 28 },
                  { hour: '11:00', traffic: 70, gaze: 52 },
                  { hour: '13:00', traffic: 92, gaze: 68 },
                  { hour: '15:00', traffic: 85, gaze: 60 },
                  { hour: '17:00', traffic: 100, gaze: 82 },
                  { hour: '19:00', traffic: 88, gaze: 64 },
                  { hour: '21:00', traffic: 50, gaze: 32 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      <div
                        className="w-1/2 bg-[#00E676] rounded-t transition-all hover:opacity-80"
                        style={{ height: `${item.traffic}%` }}
                        title={`Traffic: ${item.traffic}%`}
                      />
                      <div
                        className="w-1/2 bg-[#008A3E] rounded-t transition-all hover:opacity-80"
                        style={{ height: `${item.gaze}%` }}
                        title={`Gaze: ${item.gaze}%`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">{item.hour}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Performance Card */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Category Attention Distribution
                </h3>
                <p className="text-xs text-slate-400 mb-4">Share of total customer gaze duration</p>

                <div className="space-y-3">
                  {[
                    { category: 'Beverages & Soft Drinks', share: '34%', color: 'bg-[#00E676]' },
                    { category: 'Snacks & Confectionery', share: '26%', color: 'bg-emerald-600' },
                    { category: 'Dairy & Fresh Milk', share: '18%', color: 'bg-teal-500' },
                    { category: 'Personal Care & Beauty', share: '14%', color: 'bg-slate-700' },
                    { category: 'Bakery & Packaged Goods', share: '8%', color: 'bg-amber-500' },
                  ].map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{cat.category}</span>
                        <span>{cat.share}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full ${cat.color}`} style={{ width: cat.share }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Calculated via 14 Optical Sensors</span>
                <span className="text-[#008A3E] font-bold cursor-pointer hover:underline">
                  View Full Breakdown →
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Consumer Tracking */}
      {activeSubTab === 'tracking' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Store Footfall & Path Trajectory Analysis
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Track consumer entry pathways, aisle transit times, and bottleneck zones across store locations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-400">Peak Entry Window</span>
                <p className="text-lg font-bold text-slate-900 mt-0.5">5:00 PM – 7:30 PM</p>
                <span className="text-[10px] text-[#008A3E] font-bold">320 shoppers / hour</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-400">Avg Store Transit Time</span>
                <p className="text-lg font-bold text-slate-900 mt-0.5">14.2 Minutes</p>
                <span className="text-[10px] text-[#008A3E] font-bold">+1.4 mins vs average</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-400">Primary Aisle Bottleneck</span>
                <p className="text-lg font-bold text-slate-900 mt-0.5">Central Aisle 2 (Dairy)</p>
                <span className="text-[10px] text-amber-600 font-bold">High congestion point</span>
              </div>
            </div>

            {/* Path Flow Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Pathway Sequence</th>
                    <th className="py-3 px-4">Zone Entry Count</th>
                    <th className="py-3 px-4">Avg Dwell in Zone</th>
                    <th className="py-3 px-4">Flow Rate Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    { path: 'Main Entrance → Beverage Aisle → Checkout', count: '4,210', dwell: '3m 45s', status: 'Optimal' },
                    { path: 'Main Entrance → Central Aisle 1 → Snacks Bay', count: '3,890', dwell: '5m 12s', status: 'High Dwell' },
                    { path: 'Side Entrance → Personal Care → Checkout', count: '1,840', dwell: '2m 10s', status: 'Fast Transit' },
                    { path: 'Main Entrance → Dairy Sector → Frozen Foods', count: '2,950', dwell: '4m 30s', status: 'Optimal' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.path}</td>
                      <td className="py-3 px-4 font-mono">{row.count}</td>
                      <td className="py-3 px-4">{row.dwell}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-[#00E676]/15 text-[#008A3E] font-bold text-[10px] border border-[#00E676]/30">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Attention Analysis */}
      {activeSubTab === 'attention' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shelf Level Dwell Duration */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Gaze Duration Distribution
              </h3>
              <p className="text-xs text-slate-400 mb-4">Breakdown of eye contact duration per shelf tier</p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700">Eye-Level Tiers (Premium Zone)</span>
                    <span className="text-[#008A3E] font-bold">22.4s Avg</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#00E676]" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700">Touch Tiers (Middle Shelves)</span>
                    <span className="text-emerald-700 font-bold">14.1s Avg</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-600" style={{ width: '60%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700">Bottom Tiers (Lower Shelves)</span>
                    <span className="text-amber-600 font-bold">6.8s Avg</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Shopper Hesitation Index */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Hesitation Index & SKU Selection Rate
              </h3>
              <p className="text-xs text-slate-400 mb-4">Ratio of long gaze without item pickup</p>

              <div className="space-y-3">
                {[
                  { sku: 'Sparkling Water 500ml', dwell: '12s', hesitation: 'Low (12%)', rating: 'High Conversion' },
                  { sku: 'Energy Drink Sugar Free', dwell: '28s', hesitation: 'High (64%)', rating: 'Confusing Pricing' },
                  { sku: 'Organic Almond Milk 1L', dwell: '22s', hesitation: 'Medium (38%)', rating: 'Moderate' },
                  { sku: 'Dark Chocolate Bar 85%', dwell: '15s', hesitation: 'Low (18%)', rating: 'Impulse Pick' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{item.sku}</p>
                      <span className="text-[10px] text-slate-400">Gaze: {item.dwell}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-800">{item.hesitation}</span>
                      <p className="text-[10px] text-[#008A3E] font-bold">{item.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Heatmaps */}
      {activeSubTab === 'heatmaps' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>Interactive Store Layout Heatmap</span>
                </h3>
                <p className="text-xs text-slate-400">Visual spatial mapping of eye gaze intensity and foot traffic</p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-slate-700">Hot Zone (&gt;80% Gaze)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="text-slate-700">Warm Zone (40%-80%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#00E676]" />
                  <span className="text-slate-700">Cold Zone (&lt;40%)</span>
                </div>
              </div>
            </div>

            {/* Visual Store Floor Layout Canvas Representation */}
            <div className="relative aspect-[16/9] w-full bg-slate-950 rounded-2xl border border-slate-800 p-6 overflow-hidden flex flex-col justify-between">
              {/* Floor Plan Title */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-3 z-10">
                <span>FLOOR PLAN: MAIN RETAIL BAY (MUMBAI CENTRAL)</span>
                <span>OPTICAL GRID OVERLAY: ACTIVE</span>
              </div>

              {/* Grid of Interactive Zones */}
              <div className="grid grid-cols-4 gap-4 my-auto relative z-10 py-4">
                {[
                  { name: 'Aisle 1: Beverages', intensity: 'bg-rose-500/30 border-rose-500 text-rose-300', level: 'Hot Zone (94% Gaze)', skus: 'Endcap Sodas & Energy' },
                  { name: 'Aisle 2: Dairy & Milk', intensity: 'bg-amber-500/30 border-amber-500 text-amber-300', level: 'Warm Zone (68% Gaze)', skus: 'Cheeses & Fresh Milk' },
                  { name: 'Aisle 3: Snacks & Chips', intensity: 'bg-rose-500/30 border-rose-500 text-rose-300', level: 'Hot Zone (88% Gaze)', skus: 'Crisps & Confectionery' },
                  { name: 'Aisle 4: Bakery', intensity: 'bg-[#00E676]/20 border-[#00E676] text-[#00E676]', level: 'Cold Zone (28% Gaze)', skus: 'Breads & Cakes' },
                  { name: 'Aisle 5: Personal Care', intensity: 'bg-amber-500/30 border-amber-500 text-amber-300', level: 'Warm Zone (52% Gaze)', skus: 'Shampoo & Cosmetics' },
                  { name: 'Aisle 6: Frozen Foods', intensity: 'bg-[#00E676]/20 border-[#00E676] text-[#00E676]', level: 'Cold Zone (34% Gaze)', skus: 'Ice Creams & Ready Meals' },
                  { name: 'Checkout Impulse Bay', intensity: 'bg-rose-500/40 border-rose-500 text-rose-200', level: 'Super Hot (99% Gaze)', skus: 'Mints, Chocolates, Batteries' },
                  { name: 'Promotional Island', intensity: 'bg-amber-500/30 border-amber-500 text-amber-300', level: 'Warm Zone (72% Gaze)', skus: 'Seasonal Festival Offers' },
                ].map((zone, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedHeatmapZone(zone.name)}
                    className={`p-4 rounded-xl border backdrop-blur-md cursor-pointer transition-all hover:scale-105 ${zone.intensity}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-xs">{zone.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10">
                        {zone.level}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-80">{zone.skus}</p>
                  </div>
                ))}
              </div>

              {/* Floor Footer */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800/80 pt-3 z-10">
                <span>MAIN ENTRANCE ⬇</span>
                <span>CLICK ANY AISLE SECTOR TO DRILL DOWN</span>
                <span>CHECKOUT COUNTERS ⬆</span>
              </div>
            </div>

            {selectedHeatmapZone && (
              <div className="mt-4 p-4 rounded-xl bg-[#00E676]/10 border border-[#00E676]/30 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#008A3E]">Selected Sector: {selectedHeatmapZone}</span>
                  <p className="text-slate-600 mt-0.5">
                    Recommended action: Optimize SKU placement at eye level to maximize promotional impact.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedHeatmapZone(null)}
                  className="px-3 py-1 bg-[#00E676] text-slate-950 rounded-lg text-xs font-bold"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Behavior Insights */}
      {activeSubTab === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Repeat vs New Shoppers
              </h3>
              <p className="text-xs text-slate-400 mb-4">Visitor retention analysis</p>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Repeat Shoppers</span>
                    <span className="text-[#008A3E] font-bold">62%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00E676]" style={{ width: '62%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>New Visitors</span>
                    <span className="text-emerald-700 font-bold">38%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600" style={{ width: '38%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Aisle Drop-off Rate
              </h3>
              <p className="text-xs text-slate-400 mb-4">Visitors leaving without interaction</p>
              <div className="text-center py-4">
                <span className="text-3xl font-extrabold text-rose-500">18.4%</span>
                <p className="text-xs text-slate-400 mt-1">Average store bounce rate</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                AI Merchandising Score
              </h3>
              <p className="text-xs text-slate-400 mb-4">Overall shelf layout rating</p>
              <div className="text-center py-4">
                <span className="text-3xl font-extrabold text-[#008A3E]">88 / 100</span>
                <p className="text-xs text-slate-400 mt-1">High attention alignment</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
