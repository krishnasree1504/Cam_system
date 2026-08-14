import React from 'react';
import { FileText, FileSpreadsheet, FileJson2 } from 'lucide-react';
import { VideoAnalytics } from './VideoAnalysis';

interface ExportButtonsProps {
  analytics: VideoAnalytics;
  jobId: string | null;
}

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/** Generate CSV content for product analytics */
const generateCSV = (analytics: VideoAnalytics): string => {
  const rows: string[] = [];
  rows.push('Metric,Value');
  rows.push(`Total Products Detected,${analytics.totalProductsDetected}`);
  rows.push(`Most Frequent Product,${analytics.mostFrequentProduct ?? ''}`);
  rows.push(`Average Product Confidence,${analytics.averageProductConfidence}`);
  rows.push('');
  rows.push('Category,Count');
  Object.entries(analytics.productsPerCategory).forEach(([category, count]) => {
    rows.push(`${category},${count}`);
  });
  return rows.join('\n');
};

/** ExportButtons component */
const ExportButtons: React.FC<ExportButtonsProps> = ({ analytics, jobId }) => {
  const handleCSVExport = () => {
    const csv = generateCSV(analytics);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, 'product_analytics.csv');
  };

  const handleJSONExport = () => {
    const json = JSON.stringify(analytics, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    triggerDownload(blob, 'product_analytics.json');
  };

  const pdfReportLink = jobId ? `/api/video/report/${jobId}` : '#';

  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={handleCSVExport}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 font-bold text-xs shadow-md shadow-[#00E676]/25 transition-all"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span>Export CSV</span>
      </button>

      <button
        onClick={handleJSONExport}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 font-bold text-xs shadow-md shadow-[#00E676]/25 transition-all"
      >
        <FileJson2 className="w-4 h-4" />
        <span>Export JSON</span>
      </button>

      <a
        href={pdfReportLink}
        download={jobId ? `CAMS_YOLOv8_Report_${jobId}.pdf` : undefined}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 font-bold text-xs shadow-md shadow-[#00E676]/25 transition-all"
      >
        <FileText className="w-4 h-4" />
        <span>Export PDF</span>
      </a>
    </div>
  );
};

export default ExportButtons;
