import React, { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api';
import { Store } from '../types';
import {
  Upload,
  FileVideo,
  Play,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertCircle,
  Users,
  Eye,
  TrendingUp,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  Sliders,
  BarChart3,
  Maximize2,
  Cpu,
  Trash2,
  Store as StoreIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

import { ShelfAttractionChart } from '../components/analytics/ShelfAttractionChart';
import { ProductEngagement } from '../components/analytics/ProductEngagement';
import { RetailOptimization } from '../components/analytics/RetailOptimization';
import { ShelfMetricsTable } from '../components/analytics/ShelfMetricsTable';
import { JourneySummary } from '../components/analytics/JourneySummary';
import { HeatmapOverlay } from '../components/analytics/HeatmapOverlay';

export interface VideoDiagnostics {
  video?: {
    path?: string;
    exists?: boolean;
    opened?: boolean;
    width?: number;
    height?: number;
    fps?: number;
    totalFrames?: number;
  };
  personModel?: {
    path?: string;
    exists?: boolean;
    loaded?: boolean;
  };
  productModel?: {
    path?: string;
    exists?: boolean;
    loaded?: boolean;
    detectionsCount?: number;
  };
  tracking?: {
    rawDetectionsTotal?: number;
    uniqueTrackedCustomers?: number;
    validTracksCount?: number;
    averageTrackDurationSec?: number;
  };
  shelf?: {
    configuredZonesCount?: number;
    shelfVisitsCount?: number;
    totalDwellSeconds?: number;
  };
  annotatedFrames?: Array<{
    frameIdx: number;
    timeSec: number;
    filename: string;
    url: string;
  }>;
  quality?: {
    confidence?: string;
    notes?: string;
  };
  diagnosticSummaryText?: string;
}

// Types for Analytics Payload
export interface VideoAnalytics {
  totalPeople: number;
  uniquePeople: number;
  maxCrowd: number;
  minCrowd: number;
  avgCrowd: number;
  crowdPercentage: number;
  crowdLevel: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High' | string;
  entries: number;
  exits: number;
  totalFootfall: number;
  maxOccupancy: number;
  currentOccupancy: number;
  avgOccupancy: number;
  videoLength: string;
  fps: number;
  totalFrames: number;
  framesProcessed: number;
  resolution: string;
  totalObjects: number;
  peopleCount: number;
  shoppingCartsCount: number;
  otherObjectsCount: number;
  avgConfidence: string;
  minConfidence: string;
  maxConfidence: string;
  processingTime: number;
  detectionAccuracy: string;
  crowdOverTime: Array<{ time: string; peopleCount: number; occupancy: number; crowdPercentage: number }>;
  occupancyTrend: Array<{ time: string; occupancy: number; maxCapacity: number }>;
  detectionDistribution: Array<{ name: string; value: number; color: string }>;
  crowdHeatTimeline: Array<{ time: string; crowdPercentage: number; status: string }>;
  previewFrames: Array<{
    frameNumber: number;
    timestamp: string;
    detectedCount: number;
    boxes: Array<{ id: string; label: string; confidence: string; bbox: [number, number, number, number] }>;
  }>;
  aiSummary: string;
  aiRecommendations: string[];
  diagnostics?: VideoDiagnostics;
  shelfMetrics?: Record<string, {
    uniqueVisitorsCount: number;
    visits: number;
    averageDwellSeconds: number;
    totalDwellSeconds: number;
    peakOccupancy: number;
  }>;
  attentionScores?: Record<string, number>;
  mostAttendedShelf?: string;
  productDensity?: Record<string, number>;
  totalProductsDetected?: number;
  productsPerCategory?: Record<string, number>;
  mostFrequentProduct?: string;
  averageProductConfidence?: string;
  insights?: string[];
  optimizations?: any[];
  customerJourney?: {
    mostCommonPath: string;
    averageShelvesVisited: number;
    averageJourneyDurationSec?: number;
    totalVisits: number;
  };
}

const STAGES = [
  'Uploading Video...',
  'Loading YOLOv8 Model...',
  'Extracting Frames...',
  'Running Object Detection...',
  'Tracking People...',
  'Generating Analytics...',
  'Preparing Report...',
];

export const VideoAnalysisPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<number>(12);
  const [jobId, setJobId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<VideoAnalytics | null>(null);
  const [selectedFrameIdx, setSelectedFrameIdx] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get('/stores');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setStores(res.data);
          setSelectedStoreId(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch stores in VideoAnalysisPage', err);
      }
    };
    fetchStores();
  }, []);

  // Clean up object URLs on unmount or file change
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const handleFileSelect = (file: File) => {
    setErrorMessage(null);
    const validExts = ['.mp4', '.avi', '.mov', '.mkv'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExts.includes(ext)) {
      setErrorMessage(`Unsupported format "${ext}". Please upload MP4, AVI, MOV, or MKV.`);
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);
    setAnalytics(null);
    setJobId(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setVideoPreviewUrl(null);
    setAnalytics(null);
    setJobId(null);
    setIsAnalyzing(false);
    setIsUploading(false);
    setProgressPercent(0);
    setCurrentStageIndex(0);
    setErrorMessage(null);
  };

  const runAnalysisPipeline = async (activeJobId?: string) => {
    setIsAnalyzing(true);
    setProgressPercent(5);
    setCurrentStageIndex(1); // Loading YOLOv8 Model
    setEstimatedTime(10);

    // Progress Simulation Interval for smooth visual feedback
    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 92) {
          return 92;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        const stageIdx = Math.min(STAGES.length - 1, Math.floor((next / 100) * STAGES.length));
        setCurrentStageIndex(stageIdx);
        setEstimatedTime((t) => Math.max(1, t - 1));
        return next;
      });
    }, 400);

    try {
      const targetJobId = activeJobId || jobId || `job_demo_${Date.now()}`;
      const response = await fetch('/api/video/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: targetJobId }),
      });

      const resText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(resText);
      } catch {
        console.warn('Non-JSON response received from analyze endpoint:', resText);
      }

      clearInterval(interval);
      setProgressPercent(100);
      setCurrentStageIndex(STAGES.length - 1); // Preparing Report

      setTimeout(() => {
        if (data && data.analytics) {
          setAnalytics(data.analytics);
          if (data.jobId) setJobId(data.jobId);
        } else {
          const detailMsg = data?.error || data?.message || 'Analysis returned empty metrics. Please try again.';
          setErrorMessage(detailMsg);
        }
        setIsAnalyzing(false);
      }, 500);
    } catch (err: any) {
      clearInterval(interval);
      setIsAnalyzing(false);
      console.error('Analysis error:', err);
      setErrorMessage(`Failed to complete video analysis: ${err.message || 'Server error'}`);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);
    setProgressPercent(2);
    setCurrentStageIndex(0); // Uploading Video...

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);

      const uploadRes = await fetch('/api/video/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadText = await uploadRes.text();
      let uploadData: any = {};
      try {
        uploadData = JSON.parse(uploadText);
      } catch {
        console.warn('Non-JSON upload response received:', uploadText);
      }

      setIsUploading(false);

      if (uploadData && uploadData.jobId) {
        setJobId(uploadData.jobId);
        await runAnalysisPipeline(uploadData.jobId);
      } else {
        await runAnalysisPipeline();
      }
    } catch (err: any) {
      setIsUploading(false);
      console.error('Upload Error:', err);
      // Fallback: Proceed with analysis even if server storage fallback is triggered
      await runAnalysisPipeline();
    }
  };

  const handleUseSampleVideo = () => {
    handleReset();
    // Simulate selection of a sample store video file
    const mockFile = new File(['sample video content'], 'Retail_Store_Main_Aisle_Feed.mp4', {
      type: 'video/mp4',
    });
    setSelectedFile(mockFile);
    // Use an online sample video for preview playback
    setVideoPreviewUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    runAnalysisPipeline('job_sample_retail_1');
  };

  const handleDownloadReport = () => {
    const idToUse = jobId || 'default';
    window.open(`/api/video/report/${idToUse}`, '_blank');
  };

  // Helper for Crowd Status styling
  const getCrowdBadgeStyle = (level?: string, percentage: number = 0) => {
    if (percentage <= 20 || level === 'Very Low') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (percentage <= 40 || level === 'Low') {
      return 'bg-teal-50 text-teal-700 border-teal-200';
    }
    if (percentage <= 60 || level === 'Medium') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (percentage <= 80 || level === 'High') {
      return 'bg-orange-50 text-orange-700 border-orange-200';
    }
    return 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#00E676]/15 text-[#008A3E] border border-[#00E676]/40">
              YOLOv8 ByteTrack Model
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
              Offline Video Processing
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Recorded Video AI Analytics
          </h1>
          <p className="text-sm text-slate-500">
            Upload surveillance recordings to extract crowd density, shoppers tracking, footfall movement, and instant executive reports.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleUseSampleVideo}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-2 border border-slate-200"
          >
            <Sparkles className="w-4 h-4 text-[#008A3E]" />
            <span>Load Sample Video</span>
          </button>
          {analytics && (
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#00E676] hover:bg-[#00c865] text-slate-950 shadow-md shadow-[#00E676]/25 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-3 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs text-rose-600 underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. UPLOAD SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#00E676]/15 text-[#008A3E]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Upload Video File</h2>
              <p className="text-xs text-slate-500">Supports MP4, AVI, MOV, MKV up to 1 GB</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Store Location Selection */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <StoreIcon className="w-4 h-4 text-slate-500 shrink-0" />
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city})
                  </option>
                ))}
              </select>
            </div>

            {selectedFile && (
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 border border-slate-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete / Clear Video</span>
              </button>
            )}
          </div>
        </div>

        {!selectedFile ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
              dragOver
                ? 'border-[#00E676] bg-[#00E676]/5 scale-[1.01]'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".mp4,.avi,.mov,.mkv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#008A3E]">
              <FileVideo className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">
                Drag and drop your store recording video here
              </p>
              <p className="text-xs text-slate-500">
                or click <span className="text-[#008A3E] font-bold underline">Browse Files</span> from your device
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white border border-slate-200 text-slate-600">
                MP4
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white border border-slate-200 text-slate-600">
                AVI
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white border border-slate-200 text-slate-600">
                MOV
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white border border-slate-200 text-slate-600">
                MKV
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Video Player Preview / Thumbnail */}
            <div className="relative rounded-lg overflow-hidden bg-slate-900 aspect-video border border-slate-300 flex items-center justify-center group shadow-sm">
              {videoPreviewUrl ? (
                <video
                  src={videoPreviewUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                  <FileVideo className="w-10 h-10" />
                  <span className="text-xs font-bold">Video Selected</span>
                </div>
              )}
            </div>

            {/* Video Metadata Info */}
            <div className="space-y-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                  Ready for Analysis
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 truncate" title={selectedFile.name}>
                {selectedFile.name}
              </h3>
              <div className="text-xs text-slate-500 space-y-1 font-medium">
                <p>File Size: <span className="font-bold text-slate-700">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span></p>
                <p>Format: <span className="font-bold text-slate-700 uppercase">{selectedFile.name.split('.').pop()}</span></p>
                <p>Status: <span className="font-bold text-emerald-600">Loaded Locally</span></p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center md:col-span-1">
              <button
                disabled={isUploading || isAnalyzing}
                onClick={handleUploadAndAnalyze}
                className={`w-full py-3 px-5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                  isAnalyzing || isUploading
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#00E676] hover:bg-[#00c865] text-slate-950 shadow-md shadow-[#00E676]/25'
                }`}
              >
                {isAnalyzing || isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    <span>Processing AI Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Analyze Video with YOLOv8</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                disabled={isAnalyzing || isUploading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Choose Different File</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. ANALYSIS PROGRESS INDICATOR */}
      {(isAnalyzing || isUploading) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00E676] animate-ping" />
              <h3 className="text-sm font-bold text-slate-900">
                {STAGES[currentStageIndex]}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">
                Est. Remaining: <span className="text-slate-900 font-extrabold">{estimatedTime}s</span>
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-[#00E676]/15 text-[#008A3E] border border-[#00E676]/30">
                Model: yolov8n.pt
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-[#00E676] to-[#00B0FF] h-full rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-500">
              <span>Stage {currentStageIndex + 1} of {STAGES.length}</span>
              <span className="font-extrabold text-slate-900">{progressPercent}%</span>
            </div>
          </div>

          {/* Stepper Stage Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
            {STAGES.map((stg, idx) => {
              const isDone = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div
                  key={stg}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : isCurrent
                      ? 'bg-[#00E676]/10 border-[#00E676] text-slate-900 font-bold ring-2 ring-[#00E676]/20'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <p className="text-[10px] leading-tight font-medium truncate">{stg}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. RESULTS & ANALYTICS DASHBOARD */}
      {analytics && (
        <div className="space-y-8 animate-fadeIn">
          {/* Executive Summary Bar */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00E676]" />
                <span className="text-xs font-bold text-[#00E676] uppercase tracking-wider">
                  YOLOv8 Processing Complete
                </span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">
                Retail Video Intelligence Results
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                {analytics.aiSummary}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleDownloadReport}
                className="px-5 py-3 rounded-xl font-extrabold text-xs bg-[#00E676] text-slate-950 hover:bg-[#00c865] shadow-lg shadow-[#00E676]/25 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Executive PDF</span>
              </button>
            </div>
          </div>

          {/* 8 DASHBOARD KPI CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* 1. Total People */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total People</span>
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{analytics.totalPeople}</p>
              <p className="text-[11px] font-semibold text-emerald-600">
                Unique Tracked: <span className="font-extrabold text-slate-800">{analytics.uniquePeople}</span>
              </p>
            </div>

            {/* 2. Crowd Percentage */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crowd Percentage</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{analytics.crowdPercentage}%</p>
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getCrowdBadgeStyle(analytics.densityLevel, analytics.densityPercentage)}`}>
                  {analytics.crowdLevel} Crowd
                </span>
              </div>
            </div>

            {/* 3. Crowd Status */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crowd Status</span>
                <div className="p-2 rounded-xl bg-[#00E676]/15 text-[#008A3E]">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl font-extrabold text-slate-900">{analytics.crowdLevel} Crowd</p>
              <p className="text-[11px] font-medium text-slate-500">
                Peak: <span className="font-bold text-slate-900">{analytics.maxCrowd} people</span>
              </p>
            </div>

            {/* 4. Maximum Occupancy */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Occupancy</span>
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{analytics.maxOccupancy}</p>
              <p className="text-[11px] font-medium text-slate-500">
                Current: <span className="font-bold text-slate-800">{analytics.currentOccupancy}</span>
              </p>
            </div>

            {/* 5. Average Occupancy */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Occupancy</span>
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Sliders className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{analytics.avgOccupancy}</p>
              <p className="text-[11px] font-medium text-slate-500">
                Min Crowd: <span className="font-bold text-slate-800">{analytics.minDensity}</span>
              </p>
            </div>

            {/* 6. Total Footfall */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Footfall</span>
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{analytics.totalFootfall}</p>
              <p className="text-[11px] font-medium text-slate-500">
                In: <span className="font-bold text-emerald-600">{analytics.entries}</span> | Out: <span className="font-bold text-rose-500">{analytics.exits}</span>
              </p>
            </div>

            {/* 7. Detection Accuracy */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Accuracy</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{analytics.avgConfidence}</p>
              <p className="text-[11px] font-medium text-slate-500">
                Range: <span className="font-bold text-slate-800">{analytics.minConfidence} - {analytics.maxConfidence}</span>
              </p>
            </div>
          </div>

          {/* REPORT SECTION 1: CONSUMER ATTENTION ANALYSIS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  1. Consumer Attention Analysis
                </h3>
                <p className="text-xs text-slate-500">
                  Evaluation of shelf-zone attraction, visitor dwell time, and attention scoring derived from customer tracking.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <Eye className="w-5 h-5" />
              </div>
            </div>

            {/* Most Attractive Shelf Highlight Card */}
            {analytics.mostAttendedShelf && analytics.attentionScores && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏆</span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#00E676]">
                      Most Attractive Shelf
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-[#00E676] text-slate-950 shadow-sm">
                    {analytics.attentionScores[analytics.mostAttendedShelf] ?? 0}% Score
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-black capitalize text-white">
                      Shelf {analytics.mostAttendedShelf.replace('shelf', '')}
                    </h4>
                    <p className="text-xs text-slate-300">
                      Highest customer attraction score across all analyzed zones in this recording.
                    </p>
                  </div>

                  {analytics.shelfMetrics && analytics.shelfMetrics[analytics.mostAttendedShelf] && (
                    <div className="grid grid-cols-3 gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center shrink-0">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Visitors</p>
                        <p className="text-sm font-extrabold text-[#00E676]">
                          {analytics.shelfMetrics[analytics.mostAttendedShelf].uniqueVisitorsCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Avg Dwell</p>
                        <p className="text-sm font-extrabold text-white">
                          {analytics.shelfMetrics[analytics.mostAttendedShelf].averageDwellSeconds}s
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Visits</p>
                        <p className="text-sm font-extrabold text-sky-400">
                          {analytics.shelfMetrics[analytics.mostAttendedShelf].visits}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Spatial Heatmap Overlay */}
            {analytics.attentionScores && Object.keys(analytics.attentionScores).length > 0 && (
              <HeatmapOverlay
                attentionScores={analytics.attentionScores}
                mostAttendedShelf={analytics.mostAttendedShelf}
              />
            )}

            {/* Shelf Attraction Ranking Chart */}
            {analytics.attentionScores && Object.keys(analytics.attentionScores).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Shelf Attention Scores Ranking
                </h4>
                <ShelfAttractionChart attentionScores={analytics.attentionScores} />
              </div>
            )}

            {/* Shelf Metrics Detailed Table */}
            {analytics.shelfMetrics && Object.keys(analytics.shelfMetrics).length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Shelf Dwell & Visitor Metrics Breakdown
                </h4>
                <ShelfMetricsTable
                  shelfMetrics={Object.values(analytics.shelfMetrics)}
                  attentionScores={analytics.attentionScores}
                />
              </div>
            )}
          </div>

          {/* REPORT SECTION 2: PRODUCT ENGAGEMENT INTELLIGENCE */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  2. Product Engagement Intelligence
                </h3>
                <p className="text-xs text-slate-500">
                  Measurable product density and customer-product proximity interactions detected across shelf regions.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>

            {/* Product Engagement Density Chart */}
            {analytics.productDensity && Object.keys(analytics.productDensity).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Product Density Distribution by Shelf Zone
                </h4>
                <ProductEngagement productDensity={analytics.productDensity} />
              </div>
            )}

            {/* Product Detection Stats Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Total Products Detected</span>
                <p className="text-xl font-extrabold text-slate-900">
                  {analytics.totalProductsDetected ?? 0}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Top Product Category</span>
                <p className="text-xl font-extrabold text-slate-900 capitalize">
                  {analytics.mostFrequentProduct || 'SKU Items'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Avg Detection Confidence</span>
                <p className="text-xl font-extrabold text-emerald-600">
                  {analytics.averageProductConfidence || analytics.avgConfidence}
                </p>
              </div>
            </div>
          </div>

          {/* REPORT SECTION 3: RETAIL OPTIMIZATION */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  3. Retail Optimization Insights & Recommendations
                </h3>
                <p className="text-xs text-slate-500">
                  Data-backed merchandising and product-placement decisions based on observed shopper traffic.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            <RetailOptimization
              insights={analytics.insights || [analytics.aiSummary]}
              optimizations={analytics.optimizations || analytics.aiRecommendations}
            />
          </div>

          {/* REPORT SECTION 4: CONSUMER BEHAVIOR ANALYTICS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  4. Consumer Behavior Analytics
                </h3>
                <p className="text-xs text-slate-500">
                  Observable customer journeys, shelf visit patterns, dwell times, and footfall movement.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Customer Journey Summary */}
            <JourneySummary journey={analytics.customerJourney || null} />

            {/* People & Foot Traffic Intelligence */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Footfall & Crowd Density Breakdown
              </h4>
              <div className="divide-y divide-slate-200 text-xs font-semibold text-slate-700">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Total People Detections</span>
                  <span className="font-extrabold text-slate-900">{analytics.totalPeople}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Unique Tracked Shoppers</span>
                  <span className="font-extrabold text-[#008A3E]">{analytics.uniquePeople}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Maximum Crowd Size</span>
                  <span className="font-extrabold text-slate-900">{analytics.maxCrowd}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Minimum Crowd Size</span>
                  <span className="font-extrabold text-slate-900">{analytics.minCrowd}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Average Crowd Density</span>
                  <span className="font-extrabold text-slate-900">{analytics.avgCrowd} / frame</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Footfall Entries / Exits</span>
                  <span className="font-extrabold text-slate-900">{analytics.entries} in / {analytics.exits} out</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
