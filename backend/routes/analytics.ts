import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export const analyticsRouter = Router();

const uploadsDir = path.join(process.cwd(), 'backend', 'uploads');

function getLatestAnalytics() {
  try {
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const jsonFiles = files.filter((f) => f.startsWith('result_') && f.endsWith('.json'));
      if (jsonFiles.length > 0) {
        jsonFiles.sort((a, b) => fs.statSync(path.join(uploadsDir, b)).mtimeMs - fs.statSync(path.join(uploadsDir, a)).mtimeMs);
        const latestPath = path.join(uploadsDir, jsonFiles[0]);
        const raw = fs.readFileSync(latestPath, 'utf-8');
        return JSON.parse(raw);
      }
    }
  } catch (err) {
    console.warn('[Analytics Route] Error reading latest analytics file:', err);
  }

  // Real empty analytics state when no video has been processed yet
  return {
    totalPeople: 0,
    uniquePeople: 0,
    maxCrowd: 0,
    avgCrowd: 0,
    totalFootfall: 0,
    avgConfidence: '0%',
    shelfMetrics: {},
    attentionScores: {},
    mostAttendedShelf: null,
    productDensity: {},
    productEngagement: [],
    customerJourney: {
      mostCommonPath: 'No customer attention analysis available because no video has been processed yet.',
      averageShelvesVisited: 0,
      averageJourneyDurationSec: 0,
      totalVisits: 0,
    },
    insights: ['No customer attention analysis available. Please upload a video to analyze.'],
    optimizations: [],
    dataQuality: {
      confidence: 'Low',
      customersDetected: 0,
      validTracks: 0,
      notes: 'No video analysis results available yet.'
    },
    heatmapData: []
  };
}

// GET /api/analytics
analyticsRouter.get('/', (req: Request, res: Response) => {
  const data = getLatestAnalytics();
  const shelvesMetrics = data.shelfMetrics || {};
  const scores = data.attentionScores || {};

  const shelvesList = Object.keys(scores).map((key) => {
    const metric = shelvesMetrics[key] || {};
    return {
      shelfId: key,
      shelfName: key.replace('shelf', 'Shelf ').replace('_', ' '),
      attentionScore: scores[key],
      uniqueVisitors: metric.uniqueVisitorsCount || 0,
      totalVisits: metric.visits || 0,
      totalDwellSeconds: metric.totalDwellSeconds || 0,
      averageDwellSeconds: metric.averageDwellSeconds || 0,
      peakOccupancy: metric.peakOccupancy || 0,
      productDensity: data.productDensity?.[key] || 0,
    };
  });

  return res.json({
    summary: {
      totalCustomers: data.totalPeople || data.totalFootfall || 0,
      uniqueCustomers: data.uniquePeople || 0,
      totalVisits: data.customerJourney?.totalVisits || 0,
      averageDwellTime: data.mostAttendedShelf && data.shelfMetrics?.[data.mostAttendedShelf] ? data.shelfMetrics[data.mostAttendedShelf].averageDwellSeconds : 0,
      mostAttractiveShelf: data.mostAttendedShelf ? data.mostAttendedShelf.replace('shelf', 'Shelf ').replace('_', ' ') : 'N/A',
      totalProductsDetected: data.totalProductsDetected || 0,
    },
    shelves: shelvesList,
    customerJourney: data.customerJourney,
    insights: data.insights || [],
    optimizations: data.optimizations || [],
    dataQuality: data.dataQuality,
    heatmapData: data.heatmapData || []
  });
});

// GET /api/analytics/shelves
analyticsRouter.get('/shelves', (req: Request, res: Response) => {
  const data = getLatestAnalytics();
  const shelvesMetrics = data.shelfMetrics || {};
  const scores = data.attentionScores || {};

  const shelvesList = Object.keys(scores).map((key) => {
    const metric = shelvesMetrics[key] || {};
    return {
      shelfId: key,
      shelfName: key.replace('shelf', 'Shelf ').replace('_', ' '),
      attentionScore: scores[key],
      uniqueVisitors: metric.uniqueVisitorsCount || 0,
      totalVisits: metric.visits || 0,
      totalDwellSeconds: metric.totalDwellSeconds || 0,
      averageDwellSeconds: metric.averageDwellSeconds || 0,
      peakOccupancy: metric.peakOccupancy || 0,
      productDensity: data.productDensity?.[key] || 0,
    };
  });

  return res.json(shelvesList);
});

// GET /api/analytics/products
analyticsRouter.get('/products', (req: Request, res: Response) => {
  const data = getLatestAnalytics();
  const productEngagement = data.productEngagement || [];
  return res.json(productEngagement);
});

// GET /api/analytics/customers
analyticsRouter.get('/customers', (req: Request, res: Response) => {
  const data = getLatestAnalytics();
  return res.json({
    totalTrackedCustomers: data.uniquePeople || 0,
    totalFootfall: data.totalFootfall || 0,
    entries: data.entries || 0,
    exits: data.exits || 0,
    customerJourney: data.customerJourney || {
      mostCommonPath: 'No customer attention analysis available.',
      averageShelvesVisited: 0,
      averageJourneyDurationSec: 0,
      totalVisits: 0,
    },
  });
});

// GET /api/analytics/heatmap
analyticsRouter.get('/heatmap', (req: Request, res: Response) => {
  const data = getLatestAnalytics();
  return res.json({
    resolution: data.resolution || '1920x1080',
    points: data.heatmapData || [],
  });
});
