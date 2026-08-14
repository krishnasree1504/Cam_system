import { Router, Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

export const reportsRouter = Router();

interface ReportDetails {
  id: string;
  title: string;
  type: string;
  storeName: string;
  format: 'PDF' | 'CSV' | 'XLSX' | 'JSON';
  generatedAt: string;
}

const DEFAULT_REPORTS: Record<string, ReportDetails> = {
  'REP-2026-001': {
    id: 'REP-2026-001',
    title: 'Q1 Store Attention & Merchandising Audit',
    type: 'Executive Overview',
    storeName: 'All Stores (Global)',
    format: 'PDF',
    generatedAt: 'Today, 10:30 AM',
  },
  'REP-2026-002': {
    id: 'REP-2026-002',
    title: 'Mumbai Central Footfall & Dwell Log',
    type: 'Consumer Attention & Dwell',
    storeName: 'Mumbai Central Flagship',
    format: 'CSV',
    generatedAt: 'Yesterday, 04:15 PM',
  },
  'REP-2026-003': {
    id: 'REP-2026-003',
    title: 'Delhi Select Citywalk Optical Sensor Health',
    type: 'Camera Telemetry Health',
    storeName: 'Delhi Select Citywalk',
    format: 'XLSX',
    generatedAt: 'Jul 26, 2026',
  },
  'REP-2026-004': {
    id: 'REP-2026-004',
    title: 'Monthly SKU Conversion & Hesitation Summary',
    type: 'SKU Performance',
    storeName: 'Bengaluru Indiranagar',
    format: 'PDF',
    generatedAt: 'Jul 24, 2026',
  },
};

const DEMO_ANALYTICS_DATA = {
  kpis: [
    { metric: 'Total Foot Traffic', value: '128,450', unit: 'Shoppers', change: '+14.2% YoY', status: 'Optimal' },
    { metric: 'Average Gaze Dwell Time', value: '18.4', unit: 'Seconds', change: '+2.8s YoY', status: 'Above Average' },
    { metric: 'Engagement Conversion Rate', value: '42.8%', unit: 'Conversion %', change: '+5.1% YoY', status: 'High' },
    { metric: 'Active Optical Sensors', value: '14 / 14', unit: 'Online', change: '100% Uptime', status: 'Active' },
    { metric: 'AI Merchandising Alignment Score', value: '88 / 100', unit: 'Score', change: '+4 pts', status: 'Optimal' },
  ],
  categories: [
    { category: 'Beverages & Soft Drinks', attentionShare: '34%', footfall: '43,673', avgDwell: '22.4s', conversion: '58.2%', status: 'Hot Zone' },
    { category: 'Snacks & Confectionery', attentionShare: '26%', footfall: '33,397', avgDwell: '16.8s', conversion: '44.1%', status: 'Hot Zone' },
    { category: 'Dairy & Fresh Milk', attentionShare: '18%', footfall: '23,121', avgDwell: '14.1s', conversion: '39.5%', status: 'Warm Zone' },
    { category: 'Personal Care & Beauty', attentionShare: '14%', footfall: '17,983', avgDwell: '11.6s', conversion: '31.0%', status: 'Warm Zone' },
    { category: 'Bakery & Packaged Goods', attentionShare: '8%', footfall: '10,276', avgDwell: '8.5s', conversion: '24.8%', status: 'Cold Zone' },
  ],
  hotspots: [
    { sector: 'Beverages Endcap (Aisle 1)', status: '98% Hot Zone', gazeDensity: 'Very High', recommendation: 'Maintain eye-level hero placement' },
    { sector: 'Dairy Central Bay B (Aisle 2)', status: '78% Warm Zone', gazeDensity: 'Moderate', recommendation: 'Promote premium organic SKUs' },
    { sector: 'Checkout Impulse Bay', status: '99% Hot Zone', gazeDensity: 'Extreme High', recommendation: 'Optimize high-margin confectionery' },
    { sector: 'Bakery Lower Tier Shelf', status: '28% Cold Zone', gazeDensity: 'Low', recommendation: 'Reposition to middle tier or add lighting' },
  ],
  cameras: [
    { code: 'CAM-MUM-01', location: 'Mumbai Central - Beverages Aisle', status: 'Active', resolution: '1080p', fps: 30, latency: '2ms', uptime: '100%' },
    { code: 'CAM-DEL-02', location: 'Delhi Select Citywalk - Main Entrance', status: 'Active', resolution: '4K', fps: 60, latency: '4ms', uptime: '99.8%' },
    { code: 'CAM-BLR-03', location: 'Bengaluru Indiranagar - Dairy Sector', status: 'Active', resolution: '1080p', fps: 30, latency: '3ms', uptime: '100%' },
    { code: 'CAM-[#004]', location: 'Pune Phoenix Marketcity - Checkout', status: 'Active', resolution: '1080p', fps: 30, latency: '2ms', uptime: '100%' },
  ],
  recommendations: [
    'Reposition high-margin organic dairy SKUs to eye-level tier on Aisle 2 to boost gaze conversion by an estimated 18%.',
    'Expand impulse beverage shelf width near checkout counters during peak evening transit hours (5:00 PM - 7:30 PM).',
    'Implement dynamic promo signage at Bakery lower tiers to convert low gaze exposure into active footfall.',
    'Maintain 100% optical sensor calibration on high-traffic endcap zones to sustain precision dwell analytics.',
  ],
  systemAudit: {
    lastCalibration: 'July 25, 2026',
    firmwareVersion: 'v2.4.1-stable',
    dataAccuracy: '99.4%',
    securityPatch: 'Applied'
  }
};

reportsRouter.get('/download-report', async (req: Request, res: Response): Promise<void> => {
  try {
    const reportId = (req.query.id as string) || 'REP-2026-001';
    const requestedFormat = (req.query.format as string)?.toUpperCase();
    const customTitle = req.query.title as string;
    const customType = req.query.type as string;
    const customStore = req.query.store as string;

    const baseReport = DEFAULT_REPORTS[reportId] || {
      id: reportId,
      title: customTitle || 'CAMS Analytics Executive Report',
      type: customType || 'Executive Overview',
      storeName: customStore || 'All Stores (Global)',
      format: 'PDF',
      generatedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const format = (requestedFormat || baseReport.format) as 'PDF' | 'CSV' | 'XLSX' | 'JSON';
    const title = customTitle || baseReport.title;
    const type = customType || baseReport.type;
    const storeName = customStore || baseReport.storeName;

    const sanitizedFilename = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (format === 'PDF') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}.pdf"`);

      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      doc.pipe(res);

      // --- Header Section ---
      doc.rect(0, 0, 595.28, 80).fill('#0F172A');
      
      doc.fillColor('#00E676').fontSize(18).font('Helvetica-Bold').text('CAM SYSTEM', 40, 22, { width: 300, align: 'left' });
      doc.fillColor('#94A3B8').fontSize(9).font('Helvetica').text('Computer Vision Merchandising & Attention Analytics Engine', 40, 45, { width: 350, align: 'left' });

      doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica-Bold').text('CONFIDENTIAL REPORT', 355, 25, { width: 200, align: 'right' });
      doc.fillColor('#00E676').fontSize(8).font('Helvetica').text(`ID: ${reportId}`, 355, 42, { width: 200, align: 'right' });

      let curY = 100;

      // --- Title & Metadata ---
      doc.fillColor('#0F172A').fontSize(16).font('Helvetica-Bold').text(title, 40, curY, { width: 515, align: 'left' });
      curY += 22;
      doc.fillColor('#64748B').fontSize(9).font('Helvetica').text(`Report Type: ${type}   |   Store Location: ${storeName}   |   Generated: ${baseReport.generatedAt}`, 40, curY, { width: 515, align: 'left' });
      curY += 20;

      // Horizontal Divider
      doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(40, curY).lineTo(555, curY).stroke();
      curY += 15;

      // --- Executive KPI Grid ---
      doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text('Executive Key Performance Indicators', 40, curY, { width: 515, align: 'left' });
      curY += 18;

      const kpiBoxWidth = 160;
      const kpiBoxHeight = 52;

      DEMO_ANALYTICS_DATA.kpis.slice(0, 3).forEach((kpi, index) => {
        const x = 40 + index * 177.5;
        doc.rect(x, curY, kpiBoxWidth, kpiBoxHeight).fillAndStroke('#F8FAFC', '#E2E8F0');
        
        doc.fillColor('#64748B').fontSize(7.5).font('Helvetica').text(kpi.metric.toUpperCase(), x + 10, curY + 8, { width: 140, align: 'left' });
        doc.fillColor('#0F172A').fontSize(13).font('Helvetica-Bold').text(`${kpi.value} ${kpi.unit}`, x + 10, curY + 20, { width: 140, align: 'left' });
        doc.fillColor('#059669').fontSize(8).font('Helvetica-Bold').text(kpi.change, x + 10, curY + 37, { width: 140, align: 'left' });
      });

      curY += kpiBoxHeight + 20;

      // --- Category Attention Breakdown Table ---
      doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text('Category Attention & Shopper Dwell Breakdown', 40, curY, { width: 515, align: 'left' });
      curY += 18;

      const tableTop = curY;
      doc.rect(40, tableTop, 515, 20).fill('#0F172A');
      
      doc.fillColor('#FFFFFF').fontSize(8.5).font('Helvetica-Bold');
      doc.text('Category Sector', 50, tableTop + 5, { width: 145, align: 'left' });
      doc.text('Attention Share', 195, tableTop + 5, { width: 75, align: 'center' });
      doc.text('Footfall', 275, tableTop + 5, { width: 75, align: 'right' });
      doc.text('Avg Dwell', 355, tableTop + 5, { width: 75, align: 'right' });
      doc.text('Conversion Rate', 440, tableTop + 5, { width: 100, align: 'right' });

      let currentY = tableTop + 20;

      DEMO_ANALYTICS_DATA.categories.forEach((cat, index) => {
        const rowBg = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
        doc.rect(40, currentY, 515, 19).fillAndStroke(rowBg, '#F1F5F9');

        doc.fillColor('#0F172A').fontSize(8).font('Helvetica');
        doc.text(cat.category, 50, currentY + 5, { width: 145, align: 'left' });
        doc.text(cat.attentionShare, 195, currentY + 5, { width: 75, align: 'center' });
        doc.text(cat.footfall, 275, currentY + 5, { width: 75, align: 'right' });
        doc.text(cat.avgDwell, 355, currentY + 5, { width: 75, align: 'right' });
        doc.fillColor('#059669').font('Helvetica-Bold').text(cat.conversion, 440, currentY + 5, { width: 100, align: 'right' });

        currentY += 19;
      });

      curY = currentY + 20;

      // --- Optical Sensors Telemetry Table ---
      doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text('Optical Camera Sensor Telemetry Uptime', 40, curY, { width: 515, align: 'left' });
      curY += 18;

      const camTableTop = curY;
      doc.rect(40, camTableTop, 515, 20).fill('#0F172A');
      
      doc.fillColor('#FFFFFF').fontSize(8.5).font('Helvetica-Bold');
      doc.text('Camera Code', 50, camTableTop + 5, { width: 90, align: 'left' });
      doc.text('Location Sector', 145, camTableTop + 5, { width: 180, align: 'left' });
      doc.text('Stream Config', 330, camTableTop + 5, { width: 90, align: 'center' });
      doc.text('Latency', 425, camTableTop + 5, { width: 50, align: 'center' });
      doc.text('Status', 480, camTableTop + 5, { width: 65, align: 'center' });

      let camY = camTableTop + 20;

      DEMO_ANALYTICS_DATA.cameras.forEach((cam, index) => {
        const rowBg = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
        doc.rect(40, camY, 515, 19).fillAndStroke(rowBg, '#F1F5F9');

        doc.fillColor('#0F172A').fontSize(8).font('Helvetica');
        doc.text(cam.code, 50, camY + 5, { width: 90, align: 'left' });
        doc.text(cam.location, 145, camY + 5, { width: 180, align: 'left' });
        doc.text(`${cam.resolution} @ ${cam.fps}FPS`, 330, camY + 5, { width: 90, align: 'center' });
        doc.text(cam.latency, 425, camY + 5, { width: 50, align: 'center' });
        doc.fillColor('#059669').font('Helvetica-Bold').text(cam.status, 480, camY + 5, { width: 65, align: 'center' });

        camY += 19;
      });

      curY = camY + 20;

      // --- AI Recommendations ---
      doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text('AI Merchandising Recommendations', 40, curY, { width: 515, align: 'left' });
      curY += 16;

      DEMO_ANALYTICS_DATA.recommendations.forEach((rec) => {
        doc.fillColor('#059669').fontSize(8.5).font('Helvetica-Bold').text('•  ', 40, curY, { width: 15, align: 'left' });
        doc.fillColor('#334155').fontSize(8.5).font('Helvetica').text(rec, 55, curY, { width: 500, align: 'left' });
        curY += 18;
      });

      // --- System Audit Trail ---
      curY += 10;
      doc.rect(40, curY, 515, 45).fill('#F8FAFC');
      doc.fillColor('#64748B').fontSize(9).font('Helvetica-Bold').text('SYSTEM AUDIT TRAIL', 50, curY + 8);
      doc.fontSize(8).font('Helvetica').text(`Calibration: ${DEMO_ANALYTICS_DATA.systemAudit.lastCalibration}  |  Firmware: ${DEMO_ANALYTICS_DATA.systemAudit.firmwareVersion}  |  Data Integrity: ${DEMO_ANALYTICS_DATA.systemAudit.dataAccuracy}`, 50, curY + 22);
      
      // --- Footer ---
      doc.fontSize(8).fillColor('#94A3B8').text(
        'Generated by CAM System Intelligent Store Monitoring Platform • All Rights Reserved',
        40,
        780,
        { align: 'center', width: 515 }
      );

      doc.end();
      return;
    }

    if (format === 'XLSX') {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}.xlsx"`);

      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'CAMS India Analytics';
      workbook.created = new Date();

      // --- Sheet 1: Executive Overview ---
      const sheet1 = workbook.addWorksheet('Executive Overview');

      sheet1.addRow(['CAMS INDIA - COMPUTER VISION ANALYTICS REPORT']);
      sheet1.addRow([`Report ID: ${reportId}`, `Title: ${title}`, `Store: ${storeName}`, `Date: ${baseReport.generatedAt}`]);
      sheet1.addRow([]);

      sheet1.addRow(['KEY PERFORMANCE INDICATORS']);
      sheet1.addRow(['Metric', 'Value', 'Unit', 'YoY Growth', 'System Status']);
      
      const kpiHeaderRow = sheet1.getRow(5);
      kpiHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
      kpiHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F172A' } };

      DEMO_ANALYTICS_DATA.kpis.forEach((kpi) => {
        sheet1.addRow([kpi.metric, kpi.value, kpi.unit, kpi.change, kpi.status]);
      });

      sheet1.addRow([]);
      sheet1.addRow(['CATEGORY ATTENTION & DWELL PERFORMANCE']);
      sheet1.addRow(['Category Sector', 'Attention Share', 'Footfall (Shoppers)', 'Avg Gaze Dwell Time', 'Conversion Rate', 'Zone Status']);

      const catHeaderRow = sheet1.getRow(13);
      catHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
      catHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F172A' } };

      DEMO_ANALYTICS_DATA.categories.forEach((cat) => {
        sheet1.addRow([cat.category, cat.attentionShare, cat.footfall, cat.avgDwell, cat.conversion, cat.status]);
      });

      sheet1.columns = [
        { width: 32 },
        { width: 22 },
        { width: 20 },
        { width: 22 },
        { width: 18 },
        { width: 18 },
      ];

      // --- Sheet 2: Optical Sensor Telemetry ---
      const sheet2 = workbook.addWorksheet('Camera Sensor Health');
      sheet2.addRow(['OPTICAL CAMERA SENSOR TELEMETRY LOGS']);
      sheet2.addRow(['Camera Code', 'Store Location Sector', 'Status', 'Resolution', 'Target FPS', 'Latency', 'Uptime %']);

      const sensorHeaderRow = sheet2.getRow(2);
      sensorHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
      sensorHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F172A' } };

      DEMO_ANALYTICS_DATA.cameras.forEach((cam) => {
        sheet2.addRow([cam.code, cam.location, cam.status, cam.resolution, cam.fps, cam.latency, cam.uptime]);
      });

      sheet2.columns = [
        { width: 18 },
        { width: 38 },
        { width: 14 },
        { width: 16 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
      ];

      await workbook.xlsx.write(res);
      res.end();
      return;
    }

    if (format === 'CSV') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}.csv"`);

      let csvContent = '\uFEFF'; // UTF-8 BOM for Excel compatibility

      csvContent += `Report Identifier,${reportId}\n`;
      csvContent += `Report Title,"${title.replace(/"/g, '""')}"\n`;
      csvContent += `Report Type,"${type.replace(/"/g, '""')}"\n`;
      csvContent += `Store Location,"${storeName.replace(/"/g, '""')}"\n`;
      csvContent += `Generated At,"${baseReport.generatedAt}"\n\n`;

      csvContent += `--- KEY PERFORMANCE INDICATORS ---\n`;
      csvContent += `Metric,Value,Unit,YoY Growth,System Status\n`;
      DEMO_ANALYTICS_DATA.kpis.forEach((k) => {
        csvContent += `"${k.metric}","${k.value}","${k.unit}","${k.change}","${k.status}"\n`;
      });

      csvContent += `\n--- CATEGORY ATTENTION & DWELL PERFORMANCE ---\n`;
      csvContent += `Category Sector,Attention Share,Footfall (Shoppers),Avg Gaze Dwell Time,Conversion Rate,Zone Status\n`;
      DEMO_ANALYTICS_DATA.categories.forEach((c) => {
        csvContent += `"${c.category}","${c.attentionShare}","${c.footfall}","${c.avgDwell}","${c.conversion}","${c.status}"\n`;
      });

      csvContent += `\n--- OPTICAL SENSOR TELEMETRY LOGS ---\n`;
      csvContent += `Camera Code,Store Location Sector,Status,Resolution,Target FPS,Latency,Uptime %\n`;
      DEMO_ANALYTICS_DATA.cameras.forEach((cam) => {
        csvContent += `"${cam.code}","${cam.location}","${cam.status}","${cam.resolution}",${cam.fps},"${cam.latency}","${cam.uptime}"\n`;
      });

      csvContent += `\n--- AI MERCHANDISING RECOMMENDATIONS ---\n`;
      DEMO_ANALYTICS_DATA.recommendations.forEach((rec, idx) => {
        csvContent += `Recommendation #${idx + 1},"${rec.replace(/"/g, '""')}"\n`;
      });

      res.send(csvContent);
      return;
    }

    if (format === 'JSON') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}.json"`);

      const jsonOutput = {
        metadata: {
          reportId,
          title,
          type,
          storeName,
          generatedAt: baseReport.generatedAt,
          systemEngine: 'CAMS India Computer Vision Analytics Engine v2.4',
        },
        analytics: DEMO_ANALYTICS_DATA,
      };

      res.send(JSON.stringify(jsonOutput, null, 2));
      return;
    }

    res.status(400).json({ message: 'Unsupported format requested' });
  } catch (error) {
    console.error('Error generating report:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate report' });
    }
  }
});
