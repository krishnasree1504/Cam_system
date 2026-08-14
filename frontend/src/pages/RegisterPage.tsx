import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, Store } from '../types';
import { api } from '../lib/api';
import { Eye, Lock, Mail, User as UserIcon, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle, Store as StoreIcon } from 'lucide-react';

interface RegisterPageProps {
  onNavigateToLogin: () => void;
}

const FALLBACK_STORES: Store[] = [
  { id: 'str-1', name: 'Mumbai Central Flagship', storeCode: 'ST-MH-001', address: '', city: 'Mumbai', state: 'MH', managerName: '', status: 'Active', shelfCount: 3, cameraCount: 3, createdAt: '' },
  { id: 'str-2', name: 'Bengaluru Tech Park', storeCode: 'ST-KA-002', address: '', city: 'Bengaluru', state: 'KA', managerName: '', status: 'Active', shelfCount: 2, cameraCount: 2, createdAt: '' },
  { id: 'str-3', name: 'Delhi Connaught Plaza', storeCode: 'ST-DL-003', address: '', city: 'New Delhi', state: 'DL', managerName: '', status: 'Active', shelfCount: 2, cameraCount: 2, createdAt: '' },
  { id: 'str-4', name: 'Hyderabad Cyber Towers', storeCode: 'ST-TS-004', address: '', city: 'Hyderabad', state: 'TS', managerName: '', status: 'Maintenance', shelfCount: 1, cameraCount: 1, createdAt: '' },
];

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateToLogin }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Store Manager');
  const [stores, setStores] = useState<Store[]>(FALLBACK_STORES);
  const [assignedStoreId, setAssignedStoreId] = useState<string>('str-1');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get('/stores');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setStores(res.data);
          setAssignedStoreId(res.data[0].id);
        }
      } catch (err) {
        // Fallback stores already set
      }
    };
    fetchStores();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (role === 'Store Manager' && !assignedStoreId) {
      setError('Please select an Assigned Store for the Store Manager role');
      return;
    }

    const selectedStore = stores.find((s) => s.id === assignedStoreId);
    const storeName = selectedStore ? selectedStore.name : 'Store 1';

    setError(null);
    setIsLoading(true);
    try {
      await register(
        fullName,
        email,
        password,
        role,
        role === 'Store Manager' ? assignedStoreId : undefined,
        role === 'Store Manager' ? storeName : undefined
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10">
        {/* Left Branding Panel */}
        <div className="lg:col-span-5 bg-slate-950 p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#00E676] text-slate-950 font-bold shadow-lg shadow-[#00E676]/30">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-lg font-extrabold text-white">CAMS Portal</span>
            </div>

            <div className="mt-8 space-y-3">
              <h2 className="text-xl font-bold text-white">Create Enterprise Identity</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Register a new operator account for the Consumer Attention Mapping System. Access store nodes and sensor management.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-xs font-bold text-purple-400">Admin Role</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Full system administration, user management & security policies.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-xs font-bold text-blue-400">Store Manager Role</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Direct management of assigned store layout, shelves, and cameras.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-xs font-bold text-[#00E676]">Analyst Role</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Read-only auditing, reporting, and activity log telemetry access.</p>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToLogin}
            className="mt-6 flex items-center gap-2 text-xs font-bold text-[#00E676] hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill in your details below to register your user account
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-600 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Robert Vance"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  System User Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                  >
                    <option value="Admin">Admin (Full System Control)</option>
                    <option value="Store Manager">Store Manager (Store Node Level)</option>
                    <option value="Analyst">Analyst (Auditing & Reporting)</option>
                  </select>
                </div>
              </div>

              {role === 'Store Manager' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Assigned Store <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <StoreIcon className="w-4 h-4" />
                    </div>
                    <select
                      value={assignedStoreId}
                      onChange={(e) => setAssignedStoreId(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                    >
                      {stores.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 font-bold text-sm shadow-md shadow-[#00E676]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-[#008A3E] font-bold hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
