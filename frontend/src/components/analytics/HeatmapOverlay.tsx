import React from 'react';

export interface Zone {
  id: string;
  name: string;
  category?: string;
  points?: Array<{ x: number; y: number }>;
}

interface Props {
  zones?: Zone[];
  attentionScores: Record<string, number>;
  mostAttendedShelf?: string;
}

// Map score (0-100) to heat color gradient
const getScoreStyle = (score: number) => {
  if (score >= 80) {
    return {
      bg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-900 dark:text-emerald-300',
      badge: 'bg-emerald-500 text-white',
      heat: 'from-emerald-500/30 to-emerald-500/5',
      label: 'High Attention',
    };
  } else if (score >= 50) {
    return {
      bg: 'bg-amber-500/20 border-amber-500/50 text-amber-900 dark:text-amber-300',
      badge: 'bg-amber-500 text-white',
      heat: 'from-amber-500/30 to-amber-500/5',
      label: 'Moderate Attention',
    };
  } else {
    return {
      bg: 'bg-slate-500/10 border-slate-300 text-slate-700 dark:text-slate-400',
      badge: 'bg-slate-400 text-white',
      heat: 'from-slate-400/20 to-slate-400/5',
      label: 'Low Attention',
    };
  }
};

export const HeatmapOverlay: React.FC<Props> = ({
  zones,
  attentionScores,
  mostAttendedShelf,
}) => {
  const displayZones: Zone[] = zones && zones.length > 0
    ? zones
    : Object.keys(attentionScores || {}).map((key) => ({
        id: key,
        name: key.replace('shelf', 'Shelf ').replace('_', ' '),
        category: 'Store Zone',
      }));

  if (!displayZones || displayZones.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Shelf Spatial Attention Heatmap
        </h4>
        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span> Low
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayZones.map((zone) => {
          const score = attentionScores[zone.id] ?? 0;
          const style = getScoreStyle(score);
          const isMost = mostAttendedShelf && zone.id === mostAttendedShelf;

          return (
            <div
              key={zone.id}
              className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-200 bg-gradient-to-br ${style.heat} ${style.bg} ${
                isMost ? 'ring-2 ring-[#00E676] shadow-md scale-[1.02]' : ''
              }`}
            >
              {isMost && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#00E676] text-slate-950 shadow-sm">
                  Hotspot
                </div>
              )}

              <div className="space-y-2">
                <div className="text-xs font-extrabold capitalize text-slate-900">
                  {zone.name}
                </div>
                {zone.category && (
                  <div className="text-[10px] font-semibold text-slate-500 truncate">
                    {zone.category}
                  </div>
                )}

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-2xl font-black text-slate-900">
                    {score}%
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${style.badge}`}>
                    {style.label}
                  </span>
                </div>

                {/* Progress heat indicator bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#00E676] transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
