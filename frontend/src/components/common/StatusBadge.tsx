import React from 'react';

type StatusType = 'Active' | 'Maintenance' | 'Inactive' | 'Restocking' | 'Offline' | 'Pending';

interface StatusBadgeProps {
  status: StatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colorClass = '';

  switch (status) {
    case 'Active':
      colorClass = 'bg-[#00E676]/15 text-[#008A3E] border-[#00E676]/40 font-semibold';
      break;
    case 'Maintenance':
    case 'Restocking':
    case 'Pending':
      colorClass = 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
      break;
    case 'Offline':
    case 'Inactive':
      colorClass = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border whitespace-nowrap ${colorClass}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'Active'
            ? 'bg-[#00E676] animate-pulse'
            : status === 'Offline' || status === 'Inactive'
            ? 'bg-rose-500'
            : 'bg-amber-500'
        }`}
      />
      {status}
    </span>
  );
};
