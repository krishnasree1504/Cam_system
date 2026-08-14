import React from 'react';
import { UserRole } from '../../types';
import { ShieldCheck, Store, LineChart } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, showIcon = true }) => {
  let styleClass = '';
  let IconComponent = ShieldCheck;

  switch (role) {
    case 'Admin':
      styleClass = 'bg-purple-50 text-purple-700 border border-purple-200 font-semibold';
      IconComponent = ShieldCheck;
      break;
    case 'Store Manager':
      styleClass = 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold';
      IconComponent = Store;
      break;
    case 'Analyst':
      styleClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold';
      IconComponent = LineChart;
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${styleClass}`}>
      {showIcon && <IconComponent className="w-3.5 h-3.5" />}
      {role}
    </span>
  );
};
