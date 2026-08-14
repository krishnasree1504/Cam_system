import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Store, User, UserRole } from '../types';
import { RoleBadge } from '../components/common/RoleBadge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import {
  Users as UsersIcon,
  User as UserIcon,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Store as StoreIcon,
  ShieldCheck,
  AlertCircle,
  Phone,
  Lock,
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('Store Manager');
  const [formAssignedStoreId, setFormAssignedStoreId] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchUsersAndStores = async () => {
    try {
      const [userRes, storeRes] = await Promise.all([
        api.get('/users', { params: { search, role: roleFilter } }),
        api.get('/stores'),
      ]);
      setUsers(userRes.data);
      setStores(storeRes.data);
    } catch (err) {
      console.error('Failed to load users data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndStores();
  }, [search, roleFilter]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('Store Manager');
    setFormAssignedStoreId('');
    setFormPhone('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormPassword(''); // blank unless changing
    setFormRole(u.role);
    setFormAssignedStoreId(u.assignedStoreId || '');
    setFormPhone(u.phone || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === currentUser?.id) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      setFormError('Full Name and Email Address are required.');
      return;
    }

    if (!editingUser && !formPassword) {
      setFormError('Password is required for new user creation.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, {
          name: formName,
          email: formEmail,
          role: formRole,
          assignedStoreId: formAssignedStoreId || null,
          phone: formPhone,
          password: formPassword || undefined,
        });
      } else {
        await api.post('/users', {
          name: formName,
          email: formEmail,
          password: formPassword,
          role: formRole,
          assignedStoreId: formAssignedStoreId || null,
          phone: formPhone,
        });
      }
      setIsModalOpen(false);
      fetchUsersAndStores();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-indigo-600" />
            <span>User Role & Identity Access</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage System Admins, Store Managers, Analysts, and assigned branch nodes.
          </p>
        </div>

        {currentUser?.role === 'Admin' && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New User</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users, email, role..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All User Roles</option>
            <option value="Admin">Admin</option>
            <option value="Store Manager">Store Manager</option>
            <option value="Analyst">Analyst</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <span className="inline-block w-6 h-6 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-2" />
            <p>Loading operator accounts...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <UsersIcon className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Users Found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">User Profile</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Assigned Store</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 ring-2 ring-indigo-500/20">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.id === currentUser?.id && (
                              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold px-1.5 py-0.5 rounded">
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

                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <StoreIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{u.assignedStoreName || 'Global Access (All Stores)'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
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
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {currentUser?.role === 'Admin' && u.id !== currentUser.id && (
                          <button
                            onClick={() => handleDelete(u.id, u.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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

      {/* Create / Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User Credentials' : 'Create Operator Account'}
        subtitle="Manage user role, assigned store node, contact info and password"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Dr. Robert Vance"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="name@cams.com"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {editingUser ? 'New Password (Leave blank to keep existing)' : 'Account Password *'}
            </label>
            <input
              type="password"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required={!editingUser}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                System Role
              </label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Admin">Admin</option>
                <option value="Store Manager">Store Manager</option>
                <option value="Analyst">Analyst</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Store
              </label>
              <select
                value={formAssignedStoreId}
                onChange={(e) => setFormAssignedStoreId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Contact Number
            </label>
            <input
              type="text"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="+1 (555) 019-2831"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingUser ? 'Update Credentials' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
