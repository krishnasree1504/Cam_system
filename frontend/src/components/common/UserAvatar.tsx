import React from 'react';

interface UserAvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = 'Alexandra Vance',
  size = 'md',
  className = '',
}) => {
  const initial = name.trim().charAt(0).toUpperCase() || 'A';

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs border-[1.5px]',
    md: 'w-9 h-9 text-sm border-2',
    lg: 'w-11 h-11 text-base border-2',
    xl: 'w-14 h-14 text-xl border-2',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-[#00E676]/10 border-[#00E676] text-[#00E676] flex items-center justify-center font-bold shrink-0 shadow-[0_0_12px_rgba(0,230,118,0.2)] ${className}`}
    >
      {initial}
    </div>
  );
};
