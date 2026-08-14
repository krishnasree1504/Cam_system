import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Shelf, Store } from '../types';
import { Modal } from '../components/common/Modal';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Store as StoreIcon,
  Camera,
  AlertCircle,
  Tag,
  Box,
} from 'lucide-react';

export const ShelvesPage: React.FC = () => {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShelf, setEditingShelf] = useState<Shelf | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formStoreId, setFormStoreId] = useState('');
  const [formCategory, setFormCategory] = useState('Beverages');
  const [formSection, setFormSection] = useState('Aisle 1');
  const [formProductCount, setFormProductCount] = useState(25);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchShelvesAndStores = async () => {
    try {
      const [shelvesRes, storesRes] = await Promise.all([
        api.get('/shelves', { params: { search, storeId: selectedStoreId } }),
        api.get('/stores'),
      ]);
      setShelves(shelvesRes.data);
      setStores(storesRes.data);
    } catch (err) {
      console.error('Failed to load shelves data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelvesAndStores();
  }, [search, selectedStoreId]);

  const handleOpenAdd = () => {
    setEditingShelf(null);
    setFormName('');
    setFormStoreId(stores[0]?.id || '');
    setFormCategory('Beverages');
    setFormSection('Aisle 1');
    setFormProductCount(25);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (shelf: Shelf) => {
    setEditingShelf(shelf);
    setFormName(shelf.name);
    setFormStoreId(shelf.storeId);
    setFormCategory(shelf.category);
    setFormSection(shelf.section);
    setFormProductCount(shelf.productCount);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete shelf "${name}"?`)) {
      try {
        await api.delete(`/shelves/${id}`);
        fetchShelvesAndStores();
      } catch (err) {
        alert('Failed to delete shelf');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formStoreId) {
      setFormError('Shelf Name and Store Branch selection are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingShelf) {
        await api.put(`/shelves/${editingShelf.id}`, {
          name: formName,
          storeId: formStoreId,
          category: formCategory,
          section: formSection,
          productCount: formProductCount,
        });
      } else {
        await api.post('/shelves', {
          name: formName,
          storeId: formStoreId,
          category: formCategory,
          section: formSection,
          productCount: formProductCount,
        });
      }
      setIsModalOpen(false);
      fetchShelvesAndStores();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save shelf');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#008A3E]" />
            <span>Merchandising Shelf Mapping</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize shelf sectors, product categories, aisle sections, and optical camera attachments.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 font-bold text-xs shadow-md shadow-[#00E676]/25 flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Shelf</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shelves, categories, section..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
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

      {/* Shelves Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">
          <span className="inline-block w-6 h-6 border-2 border-[#00E676]/30 border-t-[#00E676] rounded-full animate-spin mb-2" />
          <p>Loading shelf mappings...</p>
        </div>
      ) : shelves.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 shadow-sm">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No Shelves Found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or add a new shelf.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shelves.map((shelf) => (
            <div
              key={shelf.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {shelf.name}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                      <StoreIcon className="w-3 h-3 text-[#008A3E]" />
                      {shelf.storeName}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#00E676]/15 border border-[#00E676]/30 text-[#008A3E] font-bold text-[10px] shrink-0">
                    {shelf.category}
                  </span>
                </div>

                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Section / Aisle:
                    </span>
                    <span className="font-bold text-slate-800">
                      {shelf.section}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Box className="w-3.5 h-3.5" />
                      Stock Items:
                    </span>
                    <span className="font-bold text-slate-800">
                      {shelf.productCount} SKUs
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-[#008A3E]" />
                      Optical Camera:
                    </span>
                    <span className="font-bold text-[#008A3E]">
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
                    onClick={() => handleOpenEdit(shelf)}
                    className="p-1.5 text-slate-400 hover:text-[#008A3E] rounded-lg hover:bg-slate-100 transition-colors"
                    title="Edit Shelf"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(shelf.id, shelf.name)}
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

      {/* Add / Edit Shelf Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingShelf ? 'Edit Shelf Configuration' : 'Register Shelf Mapping'}
        subtitle="Specify category, aisle location, store branch, and SKU items count"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Shelf Name / Identification *
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
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
              value={formStoreId}
              onChange={(e) => setFormStoreId(e.target.value)}
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
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
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
                value={formSection}
                onChange={(e) => setFormSection(e.target.value)}
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
              value={formProductCount}
              onChange={(e) => setFormProductCount(Number(e.target.value))}
              min={0}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-[#00E676] text-slate-950 text-xs font-bold shadow-md disabled:opacity-50 hover:bg-[#00c865] transition-colors"
            >
              {isSubmitting ? 'Saving...' : editingShelf ? 'Update Shelf' : 'Add Shelf'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
