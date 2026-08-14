import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  icon,
  subtitle,
}) => {
  const valueStr = String(value);

  // Dynamic font scaling to guarantee long values never spill outside the card
  let valueFontSize = 'text-2xl sm:text-3xl';
  if (valueStr.length > 15) {
    valueFontSize = 'text-xs sm:text-sm font-bold';
  } else if (valueStr.length > 10) {
    valueFontSize = 'text-sm sm:text-base font-bold';
  } else if (valueStr.length > 7) {
    valueFontSize = 'text-base sm:text-lg font-extrabold';
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden min-w-0">
      <div className="flex items-start justify-between gap-2 min-w-0">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-snug line-clamp-2 min-w-0 break-words">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-xl bg-slate-50 text-[#008A3E] border border-slate-200 shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-1.5 min-w-0">
        <span className={`${valueFontSize} text-slate-900 tracking-tight break-words min-w-0 max-w-full`}>
          {value}
        </span>
        {trend && (
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
              trend.isPositive !== false
                ? 'text-[#008A3E] bg-[#00E676]/15 border-[#00E676]/30'
                : 'text-rose-700 bg-rose-50 border-rose-200'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-[11px] text-slate-500 font-medium line-clamp-1 break-words border-t border-slate-100 pt-2 min-w-0">
          {subtitle}
        </p>
      )}
    </div>
  );
};

