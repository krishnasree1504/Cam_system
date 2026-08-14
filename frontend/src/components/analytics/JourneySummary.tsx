// src/components/analytics/JourneySummary.tsx
import React from 'react';
import { JourneyData } from '../../types/analytics';

interface Props {
  journey: JourneyData | null;
}

export const JourneySummary: React.FC<Props> = ({ journey }) => {
  if (!journey) return null;
  const { mostCommonPath, averageShelvesVisited, totalVisits, averageJourneyDurationSec } = journey;
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
      <h3 className="text-sm font-bold text-slate-900">Customer Journey Summary</h3>
      <p className="text-xs text-slate-600">
        <span className="font-medium">Most Common Path:</span> {mostCommonPath}
      </p>
      <p className="text-xs text-slate-600">
        <span className="font-medium">Avg Shelves per Journey:</span> {averageShelvesVisited}
      </p>
      <p className="text-xs text-slate-600">
        <span className="font-medium">Total Visits:</span> {totalVisits}
      </p>
      {averageJourneyDurationSec !== undefined && (
        <p className="text-xs text-slate-600">
          <span className="font-medium">Avg Journey Duration:</span> {averageJourneyDurationSec}s
        </p>
      )}
    </div>
  );
};
