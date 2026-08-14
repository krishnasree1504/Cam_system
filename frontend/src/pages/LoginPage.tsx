import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onNavigateToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@cams.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(demoEmail, 'password123');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Quick login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10">
        {/* Left Branding Panel */}
        <div className="lg:col-span-5 bg-slate-950 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#00E676] text-slate-950 shadow-lg shadow-[#00E676]/30 font-bold">
                <Eye className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white tracking-tight">CAMS Portal</h1>
                <p className="text-xs text-[#00E676] font-bold">Enterprise Analytics</p>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <h2 className="text-2xl font-bold text-white leading-tight">
                Consumer Attention Mapping System
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Centralized telemetry dashboard for store operations, shelf topology, and optical sensor stream management.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span>Multi-tenant store & shelf infrastructure mapping</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span>Real-time optical camera sensor telemetry</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span>Role-based access controls for Admin, Manager & Analyst</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Secure Enterprise Login</span>
            <span>v1.0.4 Release</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials to access your system dashboard
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-600 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@cams.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
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
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676] transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.value)}
                    className="w-4 h-4 rounded text-[#00E676] focus:ring-[#00E676]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[#008A3E] font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 font-bold text-sm shadow-md shadow-[#00E676]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Login to System</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins Helper */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Instant Demo Accounts
                </p>
                <span className="text-[10px] text-slate-400 font-mono">Password: password123</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@cams.com')}
                  disabled={isLoading}
                  className="py-2.5 px-2 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 shadow-sm"
                >
                  <span>Admin</span>
                  <span className="text-[9px] text-purple-700 font-mono">admin@cams.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('manager@cams.com')}
                  disabled={isLoading}
                  className="py-2.5 px-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-900 text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 shadow-sm"
                >
                  <span>Store Mgr</span>
                  <span className="text-[9px] text-blue-700 font-mono">manager@cams.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('analyst@cams.com')}
                  disabled={isLoading}
                  className="py-2.5 px-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-[#008A3E] text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 shadow-sm"
                >
                  <span>Analyst</span>
                  <span className="text-[9px] text-emerald-800 font-mono">analyst@cams.com</span>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="text-[#008A3E] font-bold hover:underline"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal (UI only) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-[#008A3E] mb-3">
              <ShieldCheck className="w-6 h-6" />
              <h4 className="text-lg font-bold text-slate-900">Password Recovery</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Enter your registered business email below. A secure single-use password reset link will be dispatched to your inbox.
            </p>
            <input
              type="email"
              placeholder="name@cams.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 mb-4 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Reset link dispatched to email');
                  setShowForgotModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#00E676] text-xs text-slate-950 font-bold hover:bg-[#00c865]"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
