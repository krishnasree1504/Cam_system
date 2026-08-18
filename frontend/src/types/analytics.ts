export interface GazeObservation {
  customerId: number;
  direction: string; // UP, DOWN, LEFT, RIGHT, FORWARD, UNKNOWN
  confidence: number; // 0-1
  yaw?: number;
  pitch?: number;
}

export interface ShelfMetric {
  shelfId: string;
  name: string;
  visits: number;
  totalDwell: number; // seconds
  avgDwell: number; // seconds
  peakOccupancy: number;
  attentionScore: number; // 0-100
}

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
  totalProductsDetected: number;
  productsPerCategory: { [category: string]: number };
  mostFrequentProduct: string | null;
  averageProductConfidence: string;
  shelfMetrics: ShelfMetric[];
  attentionScores: Record<string, number>;
  mostAttendedShelf?: string;
  journey?: any;
  productDensity: Record<string, number>;
  insights: string[];
  optimizations: string[];
  // New fields for consumer attention dashboard
  processedVideoUrl?: string;
  gazeObservations?: GazeObservation[];
}
