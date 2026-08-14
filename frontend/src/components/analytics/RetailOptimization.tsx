import React from 'react';

export type OptimizationItem =
  | string
  | {
      observation?: string;
      supportingMetric?: string;
      recommendation?: string;
      confidence?: string;
    };

type RetailOptimizationProps = {
  insights?: string[];
  optimizations?: OptimizationItem[];
};

export const RetailOptimization: React.FC<RetailOptimizationProps> = ({ insights, optimizations }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <span>💡</span> AI Strategic Insights
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
          {insights &&
            insights.map((insight, idx) => (
              <li key={idx} className="leading-relaxed">
                {typeof insight === 'string' ? insight : (insight as any)?.recommendation || (insight as any)?.observation || JSON.stringify(insight)}
              </li>
            ))}
        </ul>
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span>🎯</span> Optimization Recommendations
        </h3>
        <div className="space-y-3">
          {optimizations &&
            optimizations.map((opt, idx) => {
              if (typeof opt === 'string') {
                return (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700">
                    {opt}
                  </div>
                );
              }

              return (
                <div key={idx} className="p-3.5 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-1.5">
                  {opt.observation && (
                    <p className="font-semibold text-slate-900 text-sm">{opt.observation}</p>
                  )}
                  {opt.recommendation && (
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-amber-800 font-bold">Actionable Strategy:</strong> {opt.recommendation}
                    </p>
                  )}
                  {opt.supportingMetric && (
                    <p className="text-[11px] text-slate-500">
                      <strong className="font-medium text-slate-600">Metric Evidence:</strong> {opt.supportingMetric}
                    </p>
                  )}
                  {opt.confidence && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300/50">
                      {opt.confidence} Confidence
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

