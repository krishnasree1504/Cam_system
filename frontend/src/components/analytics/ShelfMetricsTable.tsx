// src/components/analytics/ShelfMetricsTable.tsx
import React from 'react';
import { ShelfMetric } from '../../types/analytics';

interface Props {
  shelfMetrics: ShelfMetric[];
  attentionScores?: Record<string, number>;
}

export const ShelfMetricsTable: React.FC<Props> = ({ shelfMetrics, attentionScores }) => {
  const rows = shelfMetrics.map((metric, idx) => (
    <tr key={idx} className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-2 font-medium text-slate-700">Shelf {idx + 1}</td>
      <td className="px-4 py-2 text-center">{metric.uniqueVisitorsCount}</td>
      <td className="px-4 py-2 text-center">{metric.visits}</td>
      <td className="px-4 py-2 text-center">{metric.averageDwellSeconds}s</td>
      <td className="px-4 py-2 text-center">{metric.totalDwellSeconds}s</td>
      <td className="px-4 py-2 text-center">{metric.peakOccupancy}</td>
      <td className="px-4 py-2 text-center">
        {attentionScores && attentionScores[`shelf${idx + 1}`] !== undefined
          ? `${attentionScores[`shelf${idx + 1}`]}%`
          : '—'}
      </td>
    </tr>
  ));

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
          <tr>
            <th className="px-4 py-2">Shelf ID</th>
            <th className="px-4 py-2 text-center">Unique Visitors</th>
            <th className="px-4 py-2 text-center">Visits</th>
            <th className="px-4 py-2 text-center">Avg Dwell</th>
            <th className="px-4 py-2 text-center">Total Dwell</th>
            <th className="px-4 py-2 text-center">Peak Occupancy</th>
            <th className="px-4 py-2 text-center">Attention %</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">{rows}</tbody>
      </table>
    </div>
  );
};
