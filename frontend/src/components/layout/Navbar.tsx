import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavTab } from './Sidebar';
import { RoleBadge } from '../common/RoleBadge';
import { UserAvatar } from '../common/UserAvatar';
import {
  Bell,
  LogOut,
  Settings as SettingsIcon,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const pageTitles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Executive Command Center',
      subtitle: 'Real-time telemetry, store capacity, and attention mapping',
    },
    stores: {
      title: 'Store & Merchandising Management',
      subtitle: 'Manage physical store branches and shelf mapping sectors',
    },
    cameras: {
      title: 'Optical Sensor Feed Management',
      subtitle: 'Monitor shelf camera feeds, RTSP streams, and AI detection',
    },
    analytics: {
      title: 'Consumer Tracking & Behavioral Intelligence',
      subtitle: 'Foot traffic, gaze dwell attention, heatmaps, and shopper analytics',
    },
    video: {
      title: 'AI Video Analysis & Object Intelligence',
      subtitle: 'Upload local recordings for YOLOv8 object detection, footfall tracking, and PDF reports',
    },
    reports: {
      title: 'Enterprise Analytics & Export Reports',
      subtitle: 'Generate, schedule, and export comprehensive performance reports',
    },
    settings: {
      title: 'System Preferences & Identity Access',
      subtitle: 'Manage user access roles, security credentials, and node settings',
    },
  };

  const currentInfo = pageTitles[activeTab] || pageTitles.dashboard;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between transition-colors shadow-sm">
      {/* Title / Breadcrumb */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
          {currentInfo.title}
        </h2>
        <p className="text-xs text-slate-500 hidden sm:block">
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-4">
        {/* Quick System Health Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00E676]/15 border border-[#00E676]/40 text-[#008A3E] text-xs font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]"></span>
          </span>
          <span>Live Telemetry Active</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00E676] rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-fadeIn">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">
                  Notifications
                </span>
                <span className="text-xs text-[#008A3E] font-bold cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div className="p-3 text-xs hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 text-[#008A3E] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Camera Feed Reconnected</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    CAM-MUM-01 optical stream restored on Beverages Aisle.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">5 mins ago</span>
                </div>
                <div className="p-3 text-xs hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 text-amber-600 font-bold">
                    <Bell className="w-3.5 h-3.5" />
                    <span>Store Maintenance Alert</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Hyderabad Cyber Towers branch scheduled for sensor calibration.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <UserAvatar name={user.name} size="md" />
              <div className="text-left hidden md:block leading-tight">
                <span className="text-xs font-bold text-slate-900 block">
                  {user.name}
                </span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  {user.role || 'Admin'}
                </span>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fadeIn">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  <div className="mt-2">
                    <RoleBadge role={user.role} />
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4 text-slate-400" />
                    <span>Account Settings</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
