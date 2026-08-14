import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Store } from '../types';
import {
  FileText,
  Download,
  CheckCircle2,
  FileCheck,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface GeneratedReport {
  id: string;
  title: string;
  type: string;
  storeName: string;
  format: 'PDF' | 'CSV' | 'XLSX' | 'JSON';
  size: string;
  generatedAt: string;
  status: 'Ready' | 'Generating' | 'Failed';
}

export const ReportsPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get('/stores');
        if (Array.isArray(res.data)) {
          setStores(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch stores in ReportsPage', err);
      }
    };
    fetchStores();
  }, []);
  const [reports, setReports] = useState<GeneratedReport[]>([
    {
      id: 'REP-2026-001',
      title: 'Q1 Store Attention & Merchandising Audit',
      type: 'Executive Overview',
      storeName: 'All Stores (Global)',
      format: 'PDF',
      size: '4.8 MB',
      generatedAt: 'Today, 10:30 AM',
      status: 'Ready',
    },
    {
      id: 'REP-2026-002',
      title: 'Mumbai Central Footfall & Dwell Log',
      type: 'Consumer Attention & Dwell',
      storeName: 'Mumbai Central Flagship',
      format: 'CSV',
      size: '1.2 MB',
      generatedAt: 'Yesterday, 04:15 PM',
      status: 'Ready',
    },
    {
      id: 'REP-2026-003',
      title: 'Delhi Select Citywalk Optical Sensor Health',
      type: 'Camera Telemetry Health',
      storeName: 'Delhi Select Citywalk',
      format: 'XLSX',
      size: '850 KB',
      generatedAt: 'Jul 26, 2026',
      status: 'Ready',
    },
    {
      id: 'REP-2026-004',
      title: 'Monthly SKU Conversion & Hesitation Summary',
      type: 'SKU Performance',
      storeName: 'Bengaluru Indiranagar',
      format: 'PDF',
      size: '3.1 MB',
      generatedAt: 'Jul 24, 2026',
      status: 'Ready',
    },
  ]);

  // Form State
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('Executive Overview');
  const [selectedStore, setSelectedStore] = useState('All');
  const [dateRange, setDateRange] = useState('7d');
  const [exportFormat, setExportFormat] = useState<'PDF' | 'CSV' | 'XLSX' | 'JSON'>('PDF');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [latestReport, setLatestReport] = useState<GeneratedReport | null>(null);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setSuccessMessage(null);

    setTimeout(() => {
      const newReport: GeneratedReport = {
        id: `REP-2026-00${reports.length + 1}`,
        title: reportTitle || `${reportType} (${selectedStore})`,
        type: reportType,
        storeName: selectedStore === 'All' ? 'All Stores (Global)' : selectedStore,
        format: exportFormat,
        size: '2.4 MB',
        generatedAt: 'Just now',
        status: 'Ready',
      };

      setReports([newReport, ...reports]);
      setLatestReport(newReport);
      setIsGenerating(false);
      setSuccessMessage(`Report "${newReport.title}" generated successfully! Downloading file...`);
      setReportTitle('');

      // Auto trigger download
      const downloadUrl = `/api/download-report?id=${encodeURIComponent(newReport.id)}&format=${encodeURIComponent(newReport.format)}&title=${encodeURIComponent(newReport.title)}&store=${encodeURIComponent(newReport.storeName)}&type=${encodeURIComponent(newReport.type)}`;
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${newReport.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${newReport.format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#008A3E]" />
            <span>Enterprise Analytics & Export Reports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate custom data exports, executive PDF briefs, raw CSV logs, and scheduled automated digests.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
          <span>Report Engine Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Custom Report Generator */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-[#008A3E]" />
            <span>Generate Custom Report</span>
          </h2>

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[#008A3E] font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleGenerateReport} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Report Identifier / Title (Optional)
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="e.g. Weekly Executive Merchandising Brief"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              >
                <option value="Executive Overview">Executive Overview & Insights</option>
                <option value="Consumer Attention & Dwell">Consumer Attention & Dwell Logs</option>
                <option value="Merchandising Efficiency">Merchandising Efficiency & Shelf SKUs</option>
                <option value="Camera Telemetry Health">Camera Telemetry Uptime & Sensor Logs</option>
                <option value="SKU Performance">SKU Conversion & Hesitation Breakdown</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Store Node
                </label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                >
                  <option value="All">All Stores (Global)</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="quarter">Current Quarter</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Export Format
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { fmt: 'PDF', icon: FileCheck, label: 'PDF' },
                  { fmt: 'CSV', icon: FileSpreadsheet, label: 'CSV' },
                  { fmt: 'XLSX', icon: FileSpreadsheet, label: 'Excel' },
                  { fmt: 'JSON', icon: FileCode, label: 'JSON' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = exportFormat === item.fmt;
                  return (
                    <button
                      type="button"
                      key={item.fmt}
                      onClick={() => setExportFormat(item.fmt as any)}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        isSel
                          ? 'border-[#00E676] bg-[#00E676]/15 text-[#008A3E] font-extrabold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 font-bold text-xs shadow-md shadow-[#00E676]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Compiling Telemetry Data...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Generate & Export Report</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Recent Generated Reports List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#008A3E]" />
                <span>Generated Reports Directory</span>
              </h2>
              <span className="text-xs text-slate-400 font-semibold">{reports.length} Reports Ready</span>
            </div>

            <div className="divide-y divide-slate-100">
              {reports.map((rep) => (
                <div key={rep.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{rep.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#00E676]/15 text-[#008A3E] border border-[#00E676]/30">
                        {rep.format}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{rep.storeName}</span>
                      <span>•</span>
                      <span>{rep.size}</span>
                      <span>•</span>
                      <span>{rep.generatedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`/api/download-report?id=${encodeURIComponent(rep.id)}&format=${encodeURIComponent(rep.format)}&title=${encodeURIComponent(rep.title)}&store=${encodeURIComponent(rep.storeName)}&type=${encodeURIComponent(rep.type)}`}
                      download={`${rep.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${rep.format.toLowerCase()}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#00E676] hover:text-slate-950 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
