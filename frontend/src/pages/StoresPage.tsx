import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Store, StoreStatus, Shelf } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import {
  Store as StoreIcon,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  UserCheck,
  Layers,
  Camera,
  AlertCircle,
  Tag,
  Box,
} from 'lucide-react';

type StoreTab = 'stores' | 'shelves';

export const StoresPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StoreTab>('stores');

  // Stores State
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [storeSearch, setStoreSearch] = useState('');
  const [storeStatusFilter, setStoreStatusFilter] = useState('All');

  // Store Modals
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [selectedStoreDetails, setSelectedStoreDetails] = useState<Store | null>(null);

  // Store Form
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('');
  const [formManager, setFormManager] = useState('');
  const [formStatus, setFormStatus] = useState<StoreStatus>('Active');
  const [isSubmittingStore, setIsSubmittingStore] = useState(false);
  const [storeFormError, setStoreFormError] = useState<string | null>(null);

  // Shelves State
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loadingShelves, setLoadingShelves] = useState(true);
  const [shelfSearch, setShelfSearch] = useState('');
  const [selectedStoreIdFilter, setSelectedStoreIdFilter] = useState('All');

  // Shelf Modals
  const [isShelfModalOpen, setIsShelfModalOpen] = useState(false);
  const [editingShelf, setEditingShelf] = useState<Shelf | null>(null);

  // Shelf Form
  const [shelfName, setShelfName] = useState('');
  const [shelfStoreId, setShelfStoreId] = useState('');
  const [shelfCategory, setShelfCategory] = useState('Beverages');
  const [shelfSection, setShelfSection] = useState('Aisle 1');
  const [shelfProductCount, setShelfProductCount] = useState(25);
  const [isSubmittingShelf, setIsSubmittingShelf] = useState(false);
  const [shelfFormError, setShelfFormError] = useState<string | null>(null);

  // Fetch Stores
  const fetchStores = async () => {
    try {
      const res = await api.get('/stores', {
        params: { search: storeSearch, status: storeStatusFilter },
      });
      setStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores', err);
    } finally {
      setLoadingStores(false);
    }
  };

  // Fetch Shelves
  const fetchShelves = async () => {
    try {
      const res = await api.get('/shelves', {
        params: { search: shelfSearch, storeId: selectedStoreIdFilter },
      });
      setShelves(res.data);
    } catch (err) {
      console.error('Failed to fetch shelves', err);
    } finally {
      setLoadingShelves(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [storeSearch, storeStatusFilter]);

  useEffect(() => {
    fetchShelves();
  }, [shelfSearch, selectedStoreIdFilter]);

  // --- STORE HANDLERS ---
  const handleOpenAddStore = () => {
    setEditingStore(null);
    setFormName('');
    setFormCode('');
    setFormAddress('');
    setFormCity('');
    setFormState('');
    setFormManager('Unassigned');
    setFormStatus('Active');
    setStoreFormError(null);
    setIsStoreModalOpen(true);
  };

  const handleOpenEditStore = (store: Store, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStore(store);
    setFormName(store.name);
    setFormCode(store.storeCode);
    setFormAddress(store.address);
    setFormCity(store.city);
    setFormState(store.state);
    setFormManager(store.managerName);
    setFormStatus(store.status);
    setStoreFormError(null);
    setIsStoreModalOpen(true);
  };

  const handleDeleteStore = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete store "${name}"? This action removes associated shelves.`)) {
      try {
        await api.delete(`/stores/${id}`);
        fetchStores();
        fetchShelves();
        if (selectedStoreDetails?.id === id) {
          setSelectedStoreDetails(null);
        }
      } catch (err) {
        alert('Failed to delete store');
      }
    }
  };

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formAddress || !formCity || !formState) {
      setStoreFormError('Name, Address, City, and State are required fields.');
      return;
    }

    setIsSubmittingStore(true);
    setStoreFormError(null);

    try {
      if (editingStore) {
        await api.put(`/stores/${editingStore.id}`, {
          name: formName,
          storeCode: formCode,
          address: formAddress,
          city: formCity,
          state: formState,
          managerName: formManager,
          status: formStatus,
        });
      } else {
        await api.post('/stores', {
          name: formName,
          storeCode: formCode,
          address: formAddress,
          city: formCity,
          state: formState,
          managerName: formManager,
          status: formStatus,
        });
      }
      setIsStoreModalOpen(false);
      fetchStores();
    } catch (err: any) {
      setStoreFormError(err.response?.data?.message || 'Failed to save store');
    } finally {
      setIsSubmittingStore(false);
    }
  };

  // --- SHELF HANDLERS ---
  const handleOpenAddShelf = () => {
    setEditingShelf(null);
    setShelfName('');
    setShelfStoreId(stores[0]?.id || '');
    setShelfCategory('Beverages');
    setShelfSection('Aisle 1');
    setShelfProductCount(25);
    setShelfFormError(null);
    setIsShelfModalOpen(true);
  };

  const handleOpenEditShelf = (shelf: Shelf, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingShelf(shelf);
    setShelfName(shelf.name);
    setShelfStoreId(shelf.storeId);
    setShelfCategory(shelf.category);
    setShelfSection(shelf.section);
    setShelfProductCount(shelf.productCount);
    setShelfFormError(null);
    setIsShelfModalOpen(true);
  };

  const handleDeleteShelf = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete shelf "${name}"?`)) {
      try {
        await api.delete(`/shelves/${id}`);
        fetchShelves();
        fetchStores();
      } catch (err) {
        alert('Failed to delete shelf');
      }
    }
  };

  const handleShelfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shelfName || !shelfStoreId) {
      setShelfFormError('Shelf Name and Store Selection are required.');
      return;
    }

    setIsSubmittingShelf(true);
    setShelfFormError(null);

    try {
      if (editingShelf) {
        await api.put(`/shelves/${editingShelf.id}`, {
          name: shelfName,
          storeId: shelfStoreId,
          category: shelfCategory,
          section: shelfSection,
          productCount: shelfProductCount,
        });
      } else {
        await api.post('/shelves', {
          name: shelfName,
          storeId: shelfStoreId,
          category: shelfCategory,
          section: shelfSection,
          productCount: shelfProductCount,
        });
      }
      setIsShelfModalOpen(false);
      fetchShelves();
      fetchStores();
    } catch (err: any) {
      setShelfFormError(err.response?.data?.message || 'Failed to save shelf');
    } finally {
      setIsSubmittingShelf(false);
    }
  };

  const filteredStores = stores.filter((store) => {
    const matchesStatus =
      storeStatusFilter === 'All' || store.status === storeStatusFilter;
    const q = storeSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      (store.name && store.name.toLowerCase().includes(q)) ||
      (store.storeCode && store.storeCode.toLowerCase().includes(q)) ||
      (store.id && store.id.toLowerCase().includes(q)) ||
      (store.city && store.city.toLowerCase().includes(q)) ||
      (store.state && store.state.toLowerCase().includes(q)) ||
      (store.address && store.address.toLowerCase().includes(q)) ||
      (store.managerName && store.managerName.toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
  });

  const filteredShelves = shelves.filter((shelf) => {
    const matchesStore =
      selectedStoreIdFilter === 'All' || shelf.storeId === selectedStoreIdFilter;
    const q = shelfSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      (shelf.name && shelf.name.toLowerCase().includes(q)) ||
      (shelf.category && shelf.category.toLowerCase().includes(q)) ||
      (shelf.section && shelf.section.toLowerCase().includes(q)) ||
      (shelf.storeName && shelf.storeName.toLowerCase().includes(q));
    return matchesStore && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <StoreIcon className="w-5 h-5 text-[#008A3E]" />
            <span>Store & Merchandising Shelf Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage physical retail store branches, assigned store managers, shelf sector mappings, and stock SKUs.
          </p>
        </div>

        {activeTab === 'stores' ? (
          <button
            onClick={handleOpenAddStore}
            className="px-4 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 font-bold text-xs shadow-md shadow-[#00E676]/25 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Store</span>
          </button>
        ) : (
          <button
            onClick={handleOpenAddShelf}
            className="px-4 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 font-bold text-xs shadow-md shadow-[#00E676]/25 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Shelf</span>
          </button>
        )}
      </div>

      {/* Internal Sub-Tab Switcher */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm flex items-center gap-2">
        <button
          onClick={() => setActiveTab('stores')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'stores'
              ? 'bg-[#00E676] text-slate-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <StoreIcon className="w-4 h-4" />
          <span>Stores List ({stores.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shelves')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'shelves'
              ? 'bg-[#00E676] text-slate-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Shelf Sector Mapping ({shelves.length})</span>
        </button>
      </div>

      {/* TAB 1: STORES LIST */}
      {activeTab === 'stores' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                placeholder="Search stores, cities, manager..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={storeStatusFilter}
                onChange={(e) => setStoreStatusFilter(e.target.value)}
                className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Stores</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Stores Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loadingStores ? (
              <div className="p-12 text-center text-xs text-slate-500">
                <span className="inline-block w-6 h-6 border-2 border-[#00E676]/30 border-t-[#00E676] rounded-full animate-spin mb-2" />
                <p>Loading stores directory...</p>
              </div>
            ) : filteredStores.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <StoreIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No Stores Found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Store Name & ID</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Manager</th>
                      <th className="py-3.5 px-4 text-center">Shelves</th>
                      <th className="py-3.5 px-4 text-center">Cameras</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredStores.map((store) => (
                      <tr
                        key={store.id}
                        onClick={() => setSelectedStoreDetails(store)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-medium">
                          <div className="font-bold text-slate-900 group-hover:text-[#008A3E] transition-colors">
                            {store.name}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{store.storeCode}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-[#008A3E] shrink-0" />
                            <span>{store.city}, {store.state}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[180px]">
                            {store.address}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-medium text-slate-800">
                            <UserCheck className="w-3.5 h-3.5 text-[#008A3E]" />
                            <span>{store.managerName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[11px] border border-slate-200">
                            <Layers className="w-3 h-3 text-slate-500" />
                            {store.shelfCount}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00E676]/15 text-[#008A3E] font-bold text-[11px] border border-[#00E676]/30">
                            <Camera className="w-3 h-3 text-[#008A3E]" />
                            {store.cameraCount}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={store.status} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => handleOpenEditStore(store, e)}
                              className="p-1.5 text-slate-400 hover:text-[#008A3E] rounded-lg hover:bg-slate-100 transition-colors"
                              title="Edit Store"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteStore(store.id, store.name, e)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Delete Store"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

      {/* TAB 2: SHELVES LIST */}
      {activeTab === 'shelves' && (
        <div className="space-y-4">
          {/* Shelves Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={shelfSearch}
                onChange={(e) => setShelfSearch(e.target.value)}
                placeholder="Search shelves, categories, section..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={selectedStoreIdFilter}
                onChange={(e) => setSelectedStoreIdFilter(e.target.value)}
                className="w-full sm:w-52 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              >
                <option value="All">All Store Locations</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.storeCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Shelves Grid */}
          {loadingShelves ? (
            <div className="p-12 text-center text-xs text-slate-500">
              <span className="inline-block w-6 h-6 border-2 border-[#00E676]/30 border-t-[#00E676] rounded-full animate-spin mb-2" />
              <p>Loading shelf mappings...</p>
            </div>
          ) : filteredShelves.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No Shelves Found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredShelves.map((shelf) => (
                <div
                  key={shelf.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:border-[#00E676]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">
                          {shelf.name}
                        </h3>
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                          <StoreIcon className="w-3 h-3 text-[#008A3E]" />
                          {shelf.storeName}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#00E676]/15 text-[#008A3E] font-bold text-[10px] shrink-0 border border-[#00E676]/30">
                        {shelf.category}
                      </span>
                    </div>

                    <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          Section / Aisle:
                        </span>
                        <span className="font-semibold text-slate-800">
                          {shelf.section}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Box className="w-3.5 h-3.5" />
                          Stock Items:
                        </span>
                        <span className="font-semibold text-slate-800">
                          {shelf.productCount} SKUs
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5 text-[#008A3E]" />
                          Optical Camera:
                        </span>
                        <span className="font-semibold text-[#008A3E]">
                          {shelf.cameraName || 'Unassigned'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Updated {new Date(shelf.updatedAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleOpenEditShelf(shelf, e)}
                        className="p-1.5 text-slate-400 hover:text-[#008A3E] rounded-lg hover:bg-slate-100 transition-colors"
                        title="Edit Shelf"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteShelf(shelf.id, shelf.name, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Delete Shelf"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Store Modal */}
      <Modal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        title={editingStore ? 'Edit Store Details' : 'Register New Store Branch'}
        subtitle="Configure store address, code, assigned manager and status"
      >
        <form onSubmit={handleStoreSubmit} className="space-y-4">
          {storeFormError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{storeFormError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Store Name *
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Mumbai Central Flagship"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Store Code / ID
              </label>
              <input
                type="text"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                placeholder="e.g. ST-MH-001"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as StoreStatus)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              >
                <option value="Active" className="bg-slate-900 text-white">Active</option>
                <option value="Maintenance" className="bg-slate-900 text-white">Maintenance</option>
                <option value="Inactive" className="bg-slate-900 text-white">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Street Address *
            </label>
            <input
              type="text"
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              placeholder="e.g. Lower Parel, Senapati Bapat Marg"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                City *
              </label>
              <input
                type="text"
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                State / Region *
              </label>
              <input
                type="text"
                value={formState}
                onChange={(e) => setFormState(e.target.value)}
                placeholder="e.g. MH"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Store Manager Name
            </label>
            <input
              type="text"
              value={formManager}
              onChange={(e) => setFormManager(e.target.value)}
              placeholder="e.g. Rajesh Sharma"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsStoreModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingStore}
              className="px-4 py-2 rounded-xl bg-[#00E676] text-slate-950 text-xs font-bold shadow-md disabled:opacity-50 hover:bg-[#00c865] transition-colors"
            >
              {isSubmittingStore ? 'Saving...' : editingStore ? 'Update Store' : 'Add Store'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Shelf Modal */}
      <Modal
        isOpen={isShelfModalOpen}
        onClose={() => setIsShelfModalOpen(false)}
        title={editingShelf ? 'Edit Shelf Configuration' : 'Register Shelf Mapping'}
        subtitle="Specify category, aisle location, store branch, and SKU items count"
      >
        <form onSubmit={handleShelfSubmit} className="space-y-4">
          {shelfFormError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{shelfFormError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Shelf Name / Identification *
            </label>
            <input
              type="text"
              value={shelfName}
              onChange={(e) => setShelfName(e.target.value)}
              placeholder="e.g. Endcap Display Shelf A1"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Store Branch *
            </label>
            <select
              value={shelfStoreId}
              onChange={(e) => setShelfStoreId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              required
            >
              <option value="" disabled className="bg-slate-900 text-white">
                Select Store Location
              </option>
              {stores.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Product Category
              </label>
              <select
                value={shelfCategory}
                onChange={(e) => setShelfCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              >
                <option value="Beverages" className="bg-slate-900 text-white">Beverages</option>
                <option value="Snacks & Chips" className="bg-slate-900 text-white">Snacks & Chips</option>
                <option value="Dairy & Milk" className="bg-slate-900 text-white">Dairy & Milk</option>
                <option value="Bakery" className="bg-slate-900 text-white">Bakery</option>
                <option value="Personal Care" className="bg-slate-900 text-white">Personal Care</option>
                <option value="Frozen Foods" className="bg-slate-900 text-white">Frozen Foods</option>
                <option value="Confectionery" className="bg-slate-900 text-white">Confectionery</option>
                <option value="Produce" className="bg-slate-900 text-white">Produce</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Section / Aisle
              </label>
              <input
                type="text"
                value={shelfSection}
                onChange={(e) => setShelfSection(e.target.value)}
                placeholder="e.g. Aisle 3 Bay B"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Estimated Product Units / SKUs
            </label>
            <input
              type="number"
              value={shelfProductCount}
              onChange={(e) => setShelfProductCount(Number(e.target.value))}
              min={0}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsShelfModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingShelf}
              className="px-4 py-2 rounded-xl bg-[#00E676] text-slate-950 text-xs font-bold shadow-md disabled:opacity-50 hover:bg-[#00c865] transition-colors"
            >
              {isSubmittingShelf ? 'Saving...' : editingShelf ? 'Update Shelf' : 'Add Shelf'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Store Details Drawer */}
      {selectedStoreDetails && (
        <Modal
          isOpen={Boolean(selectedStoreDetails)}
          onClose={() => setSelectedStoreDetails(null)}
          title={`Store Details: ${selectedStoreDetails.name}`}
          subtitle={`Node Code: ${selectedStoreDetails.storeCode}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block text-[11px]">Location Address</span>
                <span className="font-bold text-white mt-0.5 block">
                  {selectedStoreDetails.address}, {selectedStoreDetails.city}, {selectedStoreDetails.state}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Store Manager</span>
                <span className="font-bold text-white mt-0.5 block">
                  {selectedStoreDetails.managerName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Node Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedStoreDetails.status} />
                </div>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Creation Date</span>
                <span className="font-medium text-slate-200 mt-0.5 block">
                  {new Date(selectedStoreDetails.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-slate-700 bg-slate-800 flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#00E676]/15 text-[#00E676]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Total Shelves</span>
                  <p className="text-lg font-bold text-white">
                    {selectedStoreDetails.shelfCount} Shelves
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-700 bg-slate-800 flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#00E676]/15 text-[#00E676]">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Active Cameras</span>
                  <p className="text-lg font-bold text-white">
                    {selectedStoreDetails.cameraCount} Optical Sensors
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedStoreDetails(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
