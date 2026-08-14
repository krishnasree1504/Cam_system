// VideoAnalysis.tsx - Cleaned version
import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../lib/api';
import {
  Upload,
  Video,
  Play,
  CheckCircle2,
  AlertCircle,
  Download,
  Users,
  Eye,
  TrendingUp,
  Cpu,
  Clock,
  Sparkles,
  RefreshCw,
  FileText,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import { ConsumerAttention } from './ConsumerAttention';
import { ProductEngagement } from './ProductEngagement';
import { ShelfAttractionChart } from './ShelfAttractionChart';
import { RetailOptimization } from './RetailOptimization';
import ExportButtons from './ExportButtons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { ShelfMetricsTable } from './ShelfMetricsTable';
import { HeatmapOverlay } from './HeatmapOverlay';
import { JourneySummary } from './JourneySummary';
import { ShelfMetric, JourneyData } from '../../types/analytics';
import { Zone } from '../../types/zone';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export interface VideoAnalytics {
  totalPeople: number;
  uniquePeople: number;
  maxCrowd: number;
  avgCrowd: number;
  crowdPercentage: number;
  crowdLevel: string;
  avgConfidence: string;
  framesProcessed: number;
  videoDuration: string;
  processingTime: number;
  detectionSummary: {
    person: number;
    shoppingCart: number;
    otherObjects: number;
  };
  aiRecommendations: string[];
  // New product analytics fields
  totalProductsDetected: number;
  productsPerCategory: { [category: string]: number };
  mostFrequentProduct: string | null;
  averageProductConfidence: string;
  // New shelf and journey analytics fields
  shelfMetrics: ShelfMetric[];
  attentionScores: Record<string, number>;
  mostAttendedShelf?: string;
  journey?: JourneyData;
  // Retail optimization fields
  productDensity: Record<string, number>;
  insights: string[];
  optimizations: string[];
}

export const VideoAnalysisSection: React.FC = () => {
  // Zones for heatmap
  const [zones, setZones] = useState<Zone[]>([]);

  // Job & Upload State
  const [jobId, setJobId] = useState<string | null>(null);

  // Local File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    sizeFormatted: string;
    durationFormatted: string;
  } | null>(null);
  // Fetch zones when jobId changes
  useEffect(() => {
    if (jobId) {
      api.get(`/video/zones/${jobId}`).then(res => {
        setZones(res.data.zones || []);
      }).catch(err => {
        console.error('Failed to fetch zones:', err);
      });
    }
  }, [jobId]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>('');
  const [analytics, setAnalytics] = useState<VideoAnalytics | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Format File Size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Handle File Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processSelectedFile(files[0]);
    }
  };

  // Handle Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Process Selected File (metadata extraction)
  const processSelectedFile = (file: File) => {
    setSelectedFile(file);
    setJobId(null);
    setUploadSuccess(false);
    setUploadError(null);
    setAnalytics(null);
    setAnalysisError(null);
    const tempVideoUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.src = tempVideoUrl;
    tempVideo.onloadedmetadata = () => {
      const durSec = tempVideo.duration;
      let durStr = '0s';
      if (!isNaN(durSec)) {
        const mins = Math.floor(durSec / 60);
        const secs = Math.floor(durSec % 60);
        durStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
      }
      setFileDetails({
        name: file.name,
        sizeFormatted: formatFileSize(file.size),
        durationFormatted: durStr,
      });
      URL.revokeObjectURL(tempVideoUrl);
    };
    tempVideo.onerror = () => {
      setFileDetails({
        name: file.name,
        sizeFormatted: formatFileSize(file.size),
        durationFormatted: 'Unknown',
      });
      URL.revokeObjectURL(tempVideoUrl);
    };
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setFileDetails(null);
    setJobId(null);
    setUploadSuccess(false);
    setAnalytics(null);
    setUploadError(null);
    setAnalysisError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload Video Action
  const handleUploadVideo = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      const response = await api.post('/video/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data && response.data.jobId) {
        setJobId(response.data.jobId);
        setUploadSuccess(true);
      } else {
        throw new Error('Upload succeeded but no Job ID returned.');
      }
    } catch (err: any) {
      console.error('Video upload error:', err);
      setUploadError(err.response?.data?.message || err.message || 'Failed to upload video to server');
    } finally {
      setIsUploading(false);
    }
  };

  // Analyze Video Action
  const handleAnalyzeVideo = async () => {
    let activeJobId = jobId;
    if (!activeJobId && selectedFile) {
      // Auto upload if not done yet
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('video', selectedFile);
        const res = await api.post('/video/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data && res.data.jobId) {
          activeJobId = res.data.jobId;
          setJobId(activeJobId);
          setUploadSuccess(true);
        }
      } catch (uploadErr: any) {
        setIsUploading(false);
        setAnalysisError(uploadErr.response?.data?.message || 'Failed to upload video prior to analysis');
        return;
      } finally {
        setIsUploading(false);
      }
    }
    if (!activeJobId) {
      setAnalysisError('Please select and upload a video file first.');
      return;
    }
    setIsAnalyzing(true);
    setAnalysisError(null);
    const stages = [
      'Uploading & Preparing Video...',
      'Running YOLOv8 Object Detection Model...',
      'Detecting Shoppers & People...',
      'Tracking Individual Spatial Trajectories...',
      'Calculating Crowd Density & Attention Analytics...',
      'Generating Executive PDF Report...',
    ];
    let stageIdx = 0;
    setAnalysisStage(stages[0]);
    const interval = setInterval(() => {
      stageIdx++;
      if (stageIdx < stages.length) {
        setAnalysisStage(stages[stageIdx]);
      }
    }, 1200);
    try {
      const response = await api.post('/video/analyze', { jobId: activeJobId });
      clearInterval(interval);
      if (response.data && response.data.analytics) {
        setAnalytics(response.data.analytics);
      } else {
        throw new Error('Analysis completed but no analytics payload was returned.');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error('Video analysis error:', err);
      setAnalysisError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'YOLOv8 Video Analysis Failed'
      );
    } finally {
      setIsAnalyzing(false);
      setAnalysisStage('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#008A3E]" />
            <span>AI YOLOv8 Video Stream & Footfall Analysis</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Upload CCTV / MP4 retail recordings to run YOLOv8 object detection, track unique shoppers, evaluate crowd density, and generate executive PDF reports.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse" />
          <span>YOLOv8 Engine Active</span>
        </div>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/mp4,video/avi,video/quicktime,video/x-matroska,video/webm,.mp4,.avi,.mov,.mkv" className="hidden" />
        {!selectedFile ? (
          <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onClick={handleBrowseClick} className="border-2 border-dashed border-slate-300 hover:border-[#00E676] bg-slate-50/50 hover:bg-[#00E676]/5 p-8 rounded-2xl text-center cursor-pointer transition-all group flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#00E676]/15 text-[#008A3E] border border-[#00E676]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7 text-[#008A3E]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Click to Browse or Drag & Drop Video File</p>
              <p className="text-xs text-slate-500 mt-1">
                Supported Video Formats: <span className="font-semibold text-slate-700">MP4, AVI, MOV, MKV</span> (Up to 500MB)
              </p>
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }} className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 font-bold text-xs shadow-md shadow-[#00E676]/25 transition-all mt-2">
              Browse Computer
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-[#00E676]/15 border border-[#00E676]/30 text-[#008A3E] flex items-center justify-center shrink-0">
                  <Video className="w-6 h-6 text-[#008A3E]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-slate-900 truncate">{fileDetails?.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span><b>Size:</b> {fileDetails?.sizeFormatted}</span>
                    <span>•</span>
                    <span><b>Duration:</b> {fileDetails?.durationFormatted}</span>
                  </div>
                </div>
              </div>
              <button onClick={handleClearFile} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 transition-colors" title="Remove Selected Video">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                {uploadSuccess ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#008A3E] font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Upload Successful
                  </span>
                ) : isUploading ? (
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Uploading Video to Server...
                  </span>
                ) : (
                  <button onClick={handleUploadVideo} disabled={isUploading} className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors">
                    Upload Video
                  </button>
                )}
              </div>
              <button onClick={handleAnalyzeVideo} disabled={isAnalyzing} className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 transition-all ${!isAnalyzing ? 'bg-[#00E676] hover:bg-[#00c865] text-slate-950 shadow-[#00E676]/25 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Video...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Analyze Video</span>
                  </>
                )}
              </button>
            </div>
            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        )}
        {isAnalyzing && (
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#00E676] flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-[#00E676]" />
                <span>{analysisStage}</span>
              </span>
              <span className="text-slate-400 font-mono">Processing...</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00E676] to-emerald-400 rounded-full animate-pulse w-full" />
            </div>
          </div>
        )}
        {analysisError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Analysis Error Encountered</span>
            </div>
            <p>{analysisError}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {analytics && (
        <div className="space-y-6 animate-fadeIn">

        
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#00E676] font-extrabold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>YOLOv8 Analysis Complete</span>
              </div>
              <h3 className="text-lg font-extrabold">Video Analytics & Crowd Intelligence Metrics</h3>
            </div>
            <a href={`/api/video/report/${jobId}`} download={`CAMS_YOLOv8_Report_${jobId}.pdf`} className="px-5 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 font-extrabold text-xs shadow-md shadow-[#00E676]/25 flex items-center justify-center gap-2 transition-all shrink-0">
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total People</span>
                <Users className="w-4 h-4 text-[#008A3E]" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900">{analytics.totalPeople}</span>
              <p className="text-[11px] text-slate-500 mt-1">Unique Shoppers Tracked: <span className="font-bold text-slate-800">{analytics.uniquePeople}</span></p>
            </div>
            {/* Card 2 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Crowd %</span>
                <TrendingUp className="w-4 h-4 text-[#008A3E]" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900">{analytics.crowdPercentage}%</span>
              <p className="text-[11px] text-slate-500 mt-1">Occupancy ratio against store area capacity</p>
            </div>
            {/* Card 3 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Crowd Level</span>
                <ShieldCheck className="w-4 h-4 text-[#008A3E]" />
              </div>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${analytics.crowdLevel === 'Low' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : analytics.crowdLevel === 'Moderate' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-rose-100 text-rose-800 border-rose-300'}`}>{analytics.crowdLevel} Density</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Spatial congestion indicator</p>
            </div>
            {/* Card 4 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Maximum Crowd</span>
                <Eye className="w-4 h-4 text-[#008A3E]" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900">{analytics.maxCrowd}</span>
              <p className="text-[11px] text-slate-500 mt-1">Peak simultaneous count in single frame</p>
            </div>
            {/* Card 5 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Average Crowd</span>
                <Users className="w-4 h-4 text-[#008A3E]" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900">{analytics.avgCrowd}</span>
              <p className="text-[11px] text-slate-500 mt-1">Mean people per processed frame</p>
            </div>
            {/* Card 6 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Confidence</span>
                <Cpu className="w-4 h-4 text-[#008A3E]" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900">{analytics.avgConfidence}</span>
              <p className="text-[11px] text-slate-500 mt-1">YOLOv8 neural model detection accuracy</p>
            </div>
            {/* Card 7 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm sm:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Processing Time</span>
                <Clock className="w-4 h-4 text-[#008A3E]" />
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900">{analytics.processingTime}s</span>
                <span className="text-xs text-slate-500 font-medium">({analytics.framesProcessed} frames analyzed across {analytics.videoDuration})</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Hardware acceleration execution time</p>
            </div>

{/* Export Buttons */}
<ExportButtons analytics={analytics} jobId={jobId} />

{/* Product Analytics Charts */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
  <div className="bg-white p-4 rounded-2xl shadow-sm">
    <Bar
      data={{
        labels: Object.keys(analytics.productsPerCategory),
        datasets: [{
          label: 'Products per Category',
          data: Object.values(analytics.productsPerCategory),
          backgroundColor: 'rgba(0, 230, 118, 0.6)',
        }],
      }}
      options={{ maintainAspectRatio: false }}
    />
  </div>
  <div className="bg-white p-4 rounded-2xl shadow-sm">
    <Pie
      data={{
        labels: Object.keys(analytics.productsPerCategory),
        datasets: [{
          data: Object.values(analytics.productsPerCategory),
          backgroundColor: [
            '#00E676',
            '#66bb6a',
            '#ffb74d',
            '#ff8a65',
            '#ba68c8',
            '#42a5f5',
          ],
        }],
      }}
      options={{ maintainAspectRatio: false }}
    />
  </div>
</div>
{/* New Analytics Components */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
  <ConsumerAttention attentionScores={analytics.attentionScores} />
  <ProductEngagement productDensity={analytics.productDensity} />
  <ShelfAttractionChart attentionScores={analytics.attentionScores} />
  <RetailOptimization insights={analytics.insights} optimizations={analytics.optimizations} />
</div>
          </div>
          {/* Shelf Metrics Table */}
          {analytics.shelfMetrics && (
            <ShelfMetricsTable shelfMetrics={analytics.shelfMetrics} attentionScores={analytics.attentionScores} />
          )}
          {/* Heatmap Overlay */}
          {zones.length > 0 && analytics.attentionScores && (
            <HeatmapOverlay zones={zones} attentionScores={analytics.attentionScores} mostAttendedShelf={analytics.mostAttendedShelf} />
          )}
          {/* Journey Summary */}
          {analytics.journey && (
            <JourneySummary journey={analytics.journey} />
          )}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Detection Summary */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText className="w-4 h-4 text-[#008A3E]" />
                <span>Detection Summary Breakdown</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">Person / Shopper Detections</span>
                  <span className="font-extrabold text-slate-900">{analytics.detectionSummary?.person ?? 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">Shopping Cart / Basket</span>
                  <span className="font-extrabold text-slate-900">{analytics.detectionSummary?.shoppingCart ?? 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">Other Retail Objects</span>
                  <span className="font-extrabold text-slate-900">{analytics.detectionSummary?.otherObjects ?? 0}</span>
                </div>
              </div>
            </div>
            {/* Recommendations */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Sparkles className="w-4 h-4 text-[#008A3E]" />
                <span>AI Strategic Recommendations</span>
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                {(analytics.aiRecommendations || []).map((rec, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#00E676] mt-1.5 shrink-0" />
                    <p className="leading-relaxed font-medium">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
