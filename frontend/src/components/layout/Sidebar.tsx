import React from 'react';
import {
  LayoutDashboard,
  Store,
  Camera,
  BarChart2,
  Video,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Eye,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../common/UserAvatar';

export type NavTab = 'dashboard' | 'stores' | 'cameras' | 'analytics' | 'video' | 'reports' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stores' as NavTab, label: 'Stores', icon: Store },
    { id: 'cameras' as NavTab, label: 'Optical Sensors', icon: Camera },
    { id: 'analytics' as NavTab, label: 'Attention Analytics', icon: BarChart2 },
    { id: 'video' as NavTab, label: 'Video Analysis', icon: Video },
    { id: 'reports' as NavTab, label: 'Reports', icon: FileText },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-slate-200 text-slate-700 transition-all duration-300 ease-in-out flex flex-col shadow-sm ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#00E676]/15 border border-[#00E676]/40 text-[#008A3E] shadow-sm shrink-0">
            <Eye className="w-5 h-5 text-[#008A3E]" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h1 className="text-sm font-extrabold tracking-tight text-slate-900 leading-none">
                CAM SYSTEM
              </h1>
              <span className="text-[10px] font-bold text-[#008A3E] tracking-wider uppercase">
                Attention System
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-xs tracking-wide transition-all duration-200 group relative ${
                isActive
                  ? 'bg-[#00E676] text-slate-950 shadow-md shadow-[#00E676]/25 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-[#008A3E]'
                }`}
              />
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {/* Tooltip on Collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer Card */}
      {user && (
        <div className="p-3 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <UserAvatar name={user.name} size="md" />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[11px] font-medium text-slate-500 truncate">
                  {user.role || 'Admin'}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
