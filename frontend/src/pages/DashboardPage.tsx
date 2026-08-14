import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { SystemStats, Store, Shelf, Camera, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { StoreManagerDashboard } from '../components/dashboard/StoreManagerDashboard';
import { AnalystDashboard } from '../components/dashboard/AnalystDashboard';
import { NavTab } from '../components/layout/Sidebar';

interface DashboardPageProps {
  onNavigateTab?: (tab: NavTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, storesRes, shelvesRes, camerasRes, usersRes] = await Promise.all([
        api.get('/dashboard/stats').catch(() => ({ data: null })),
        api.get('/stores').catch(() => ({ data: [] })),
        api.get('/shelves').catch(() => ({ data: [] })),
        api.get('/cameras').catch(() => ({ data: [] })),
        api.get('/users').catch(() => ({ data: [] })),
      ]);
      setStats(statsRes.data);
      setStores(storesRes.data || []);
      setShelves(shelvesRes.data || []);
      setCameras(camerasRes.data || []);
      setUsersList(usersRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } fontFinally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchDashboardData().then(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#00E676]/30 border-t-[#00E676] rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Loading {user?.role || 'System'} Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Render role-specific dashboard
  const userRole = user?.role || 'Admin';

  if (userRole === 'Store Manager') {
    return (
      <StoreManagerDashboard
        currentUser={user}
        stores={stores}
        shelves={shelves}
        cameras={cameras}
      />
    );
  }

  if (userRole === 'Analyst') {
    return (
      <AnalystDashboard
        stores={stores}
        shelves={shelves}
        cameras={cameras}
      />
    );
  }

  // Default to Admin Dashboard
  return (
    <AdminDashboard
      stats={stats}
      stores={stores}
      shelves={shelves}
      cameras={cameras}
      usersList={usersList}
    />
  );
};
