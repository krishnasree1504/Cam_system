import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { User, UserRole, Store } from '../types';
import { RoleBadge } from '../components/common/RoleBadge';
import { Modal } from '../components/common/Modal';
import {
  Settings,
  User as UserIcon,
  Users as UsersIcon,
  Lock,
  Bell,
  Check,
  AlertCircle,
  Save,
  Key,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Store as StoreIcon,
  Cpu,
} from 'lucide-react';

type SettingsTab = 'profile' | 'users' | 'system';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<SettingsTab>('profile');

  // --- PROFILE & PASSWORD STATE ---
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [cameraOfflineAlerts, setCameraOfflineAlerts] = useState(true);
  const [storeMaintenanceAlerts, setStoreMaintenanceAlerts] = useState(true);

  // --- USER MANAGEMENT STATE ---
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // User Modals & Form
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formUserName, setFormUserName] = useState('');
  const [formUserEmail, setFormUserEmail] = useState('');
  const [formUserPassword, setFormUserPassword] = useState('');
  const [formUserRole, setFormUserRole] = useState<UserRole>('Store Manager');
  const [formAssignedStoreId, setFormAssignedStoreId] = useState('');
  const [formUserPhone, setFormUserPhone] = useState('');
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [userFormError, setUserFormError] = useState<string | null>(null);

  // Fetch users & stores when on Users sub-tab
  const fetchUsersAndStores = async () => {
    try {
      const [userRes, storeRes] = await Promise.all([
        api.get('/users', { params: { search: userSearch, role: roleFilter } }),
        api.get('/stores'),
      ]);
      setUsers(userRes.data);
      setStores(storeRes.data);
    } catch (err) {
      console.error('Failed to load users data', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'users') {
      fetchUsersAndStores();
    }
  }, [activeSubTab, userSearch, roleFilter]);

  // Profile Handlers
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdatingProfile(true);
    setProfileMsg(null);

    try {
      const res = await api.put(`/users/${user.id}`, { name, email, phone });
      updateUser(res.data);
      setProfileMsg({ type: 'success', text: 'Profile details updated successfully.' });
    } catch (err: any) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile details.',
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMsg(null);

    try {
      await api.put(`/users/${user.id}`, { password: newPassword });
      setPasswordMsg({ type: 'success', text: 'Password credentials updated.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password.',
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // User Management Handlers
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setFormUserName('');
    setFormUserEmail('');
    setFormUserPassword('');
    setFormUserRole('Store Manager');
    setFormAssignedStoreId('');
    setFormUserPhone('');
    setUserFormError(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (u: User) => {
    setEditingUser(u);
    setFormUserName(u.name);
    setFormUserEmail(u.email);
    setFormUserPassword('');
    setFormUserRole(u.role);
    setFormAssignedStoreId(u.assignedStoreId || '');
    setFormUserPhone(u.phone || '');
    setUserFormError(null);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (id === user?.id) {
      alert('You cannot delete your own logged-in account.');
      return;
    }

    if (window.confirm(`Are you sure you want to remove user "${name}"?`)) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsersAndStores();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUserName || !formUserEmail) {
      setUserFormError('Full Name and Email Address are required.');
      return;
    }

    if (!editingUser && !formUserPassword) {
      setUserFormError('Password is required for new user creation.');
      return;
    }

    setIsSubmittingUser(true);
    setUserFormError(null);

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, {
          name: formUserName,
          email: formUserEmail,
          role: formUserRole,
          assignedStoreId: formAssignedStoreId || null,
          phone: formUserPhone,
          password: formUserPassword || undefined,
        });
      } else {
        await api.post('/users', {
          name: formUserName,
          email: formUserEmail,
          password: formUserPassword,
          role: formUserRole,
          assignedStoreId: formAssignedStoreId || null,
          phone: formUserPhone,
        });
      }
      setIsUserModalOpen(false);
      fetchUsersAndStores();
    } catch (err: any) {
      setUserFormError(err.response?.data?.message || 'Failed to save user');
    } finally {
      setIsSubmittingUser(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#008A3E]" />
            <span>System Preferences & Identity Access</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure operator profile, system user roles, password security, and node alert triggers.
          </p>
        </div>

        {activeSubTab === 'users' && user?.role === 'Admin' && (
          <button
            onClick={handleOpenAddUser}
            className="px-4 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 font-bold text-xs shadow-md shadow-[#00E676]/25 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New User</span>
          </button>
        )}
      </div>

      {/* Internal Sub-Tab Switcher */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm flex items-center gap-2">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'profile'
              ? 'bg-[#00E676] text-slate-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile & Security</span>
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'users'
              ? 'bg-[#00E676] text-slate-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UsersIcon className="w-4 h-4" />
          <span>User Role Management</span>
        </button>

        <button
          onClick={() => setActiveSubTab('system')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'system'
              ? 'bg-[#00E676] text-slate-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>System Build & Node Health</span>
        </button>
      </div>

      {/* SUB-TAB 1: PROFILE & SECURITY */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {/* Profile Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <UserIcon className="w-4 h-4 text-[#008A3E]" />
                <span>Operator Profile Details</span>
              </h2>

              {profileMsg && (
                <div
                  className={`p-3 rounded-lg text-xs mb-4 flex items-center gap-2 ${
                    profileMsg.type === 'success'
                      ? 'bg-emerald-50 text-[#008A3E] font-bold border border-emerald-200'
                      : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}
                >
                  {profileMsg.type === 'success' ? (
                    <Check className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Contact
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2831"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="px-4 py-2 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 text-xs font-bold shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <Lock className="w-4 h-4 text-[#008A3E]" />
                <span>Password & Security Credentials</span>
              </h2>

              {passwordMsg && (
                <div
                  className={`p-3 rounded-lg text-xs mb-4 flex items-center gap-2 ${
                    passwordMsg.type === 'success'
                      ? 'bg-emerald-50 text-[#008A3E] font-bold border border-emerald-200'
                      : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}
                >
                  {passwordMsg.type === 'success' ? (
                    <Check className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="px-4 py-2 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 text-xs font-bold shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{isUpdatingPassword ? 'Updating...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* User Access Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Current Access Scope
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">User Role</span>
                  <div className="mt-1">
                    <RoleBadge role={user?.role || 'Admin'} />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Assigned Store Node</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {user?.assignedStoreName || 'Global Access (All Stores)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Telemetry Alert Preferences */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#008A3E]" />
                <span>Notification Settings</span>
              </h3>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-700 font-semibold">
                    Camera Disconnect Alerts
                  </span>
                  <input
                    type="checkbox"
                    checked={cameraOfflineAlerts}
                    onChange={(e) => setCameraOfflineAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-[#00E676] focus:ring-[#00E676]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-700 font-semibold">
                    Store Maintenance Alerts
                  </span>
                  <input
                    type="checkbox"
                    checked={storeMaintenanceAlerts}
                    onChange={(e) => setStoreMaintenanceAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-[#00E676] focus:ring-[#00E676]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-700 font-semibold">
                    Daily Telemetry Email Summary
                  </span>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-[#00E676] focus:ring-[#00E676]"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: USER ROLE MANAGEMENT */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users, email, role..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              >
                <option value="All">All User Roles</option>
                <option value="Admin">Admin</option>
                <option value="Store Manager">Store Manager</option>
                <option value="Analyst">Analyst</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loadingUsers ? (
              <div className="p-12 text-center text-xs text-slate-500">
                <span className="inline-block w-6 h-6 border-2 border-[#00E676]/30 border-t-[#00E676] rounded-full animate-spin mb-2" />
                <p>Loading operator accounts...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <UsersIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No Users Found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">User Profile</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Assigned Store</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Created Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#00E676]/15 text-[#008A3E] flex items-center justify-center font-extrabold text-xs shrink-0 ring-2 ring-[#00E676]/30">
                              <UserIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {u.id === user?.id && (
                                  <span className="text-[10px] bg-[#00E676]/15 text-[#008A3E] font-bold px-1.5 py-0.5 rounded border border-[#00E676]/30">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3" />
                                {u.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <RoleBadge role={u.role} />
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <StoreIcon className="w-3.5 h-3.5 text-[#008A3E] shrink-0" />
                            <span>{u.assignedStoreName || 'Global Access (All Stores)'}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{u.phone || 'N/A'}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditUser(u)}
                              className="p-1.5 text-slate-400 hover:text-[#008A3E] rounded-lg hover:bg-slate-100 transition-colors"
                              title="Edit User"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {user?.role === 'Admin' && u.id !== user.id && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SYSTEM BUILD & NODE HEALTH */}
      {activeSubTab === 'system' && (
        <div className="space-y-6">
          <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-[#00E676] font-bold text-sm uppercase tracking-wider">
                <Cpu className="w-5 h-5" />
                <span>Consumer Attention Mapping System (CAMS) Build Info</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#00E676]/20 text-[#00E676] text-xs font-mono font-bold border border-[#00E676]/30">
                SYSTEM HEALTH: 100% ONLINE
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              CAMS Enterprise Node is running on Google Cloud Run with Vite/React frontend and Express backend services.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Database Engine</span>
                <p className="text-sm font-bold text-white mt-1">SQLite / Prisma</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">API Gateway</span>
                <p className="text-sm font-bold text-white mt-1">Express v4 / Axios</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">System Version</span>
                <p className="text-sm font-bold text-white mt-1">v1.0.4 Enterprise</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit User Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={editingUser ? 'Edit User Credentials' : 'Create Operator Account'}
        subtitle="Manage user role, assigned store node, contact info and password"
      >
        <form onSubmit={handleUserSubmit} className="space-y-4">
          {userFormError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{userFormError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formUserName}
              onChange={(e) => setFormUserName(e.target.value)}
              placeholder="e.g. Dr. Robert Vance"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formUserEmail}
              onChange={(e) => setFormUserEmail(e.target.value)}
              placeholder="name@cams.com"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {editingUser ? 'New Password (Leave blank to keep existing)' : 'Account Password *'}
            </label>
            <input
              type="password"
              value={formUserPassword}
              onChange={(e) => setFormUserPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              required={!editingUser}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                System Role
              </label>
              <select
                value={formUserRole}
                onChange={(e) => setFormUserRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              >
                <option value="Admin">Admin</option>
                <option value="Store Manager">Store Manager</option>
                <option value="Analyst">Analyst</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Store
              </label>
              <select
                value={formAssignedStoreId}
                onChange={(e) => setFormAssignedStoreId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              >
                <option value="">Global Access (All Stores)</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Contact Number
            </label>
            <input
              type="text"
              value={formUserPhone}
              onChange={(e) => setFormUserPhone(e.target.value)}
              placeholder="+1 (555) 019-2831"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUserModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingUser}
              className="px-4 py-2 rounded-xl bg-[#00E676] text-slate-950 text-xs font-bold shadow-md disabled:opacity-50"
            >
              {isSubmittingUser ? 'Saving...' : editingUser ? 'Update Credentials' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
