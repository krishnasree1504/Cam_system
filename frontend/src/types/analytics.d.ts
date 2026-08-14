// src/types/analytics.d.ts
export interface ShelfMetric {
  uniqueVisitorsCount: number;
  visits: number;
  averageDwellSeconds: number;
  totalDwellSeconds: number;
  peakOccupancy: number;
  attentionScore?: number;
}

export interface JourneyData {
  mostCommonPath: string;
  averageShelvesVisited: number;
  totalVisits: number;
  averageJourneyDurationSec?: number;
}
