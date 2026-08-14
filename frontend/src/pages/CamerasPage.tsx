import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Camera, CameraStatus, Shelf, Store } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import {
  Camera as CameraIcon,
  Search,
  Plus,
  Edit2,
  Trash2,
  Video,
  Layers,
  Store as StoreIcon,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const CamerasPage: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [previewCamera, setPreviewCamera] = useState<Camera | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCameraCode, setFormCameraCode] = useState('');
  const [formStoreId, setFormStoreId] = useState('');
  const [formShelfId, setFormShelfId] = useState('');
  const [formStreamUrl, setFormStreamUrl] = useState('');
  const [formResolution, setFormResolution] = useState('1080p (1920x1080)');
  const [formFps, setFormFps] = useState(30);
  const [formStatus, setFormStatus] = useState<CameraStatus>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      const [camRes, storeRes, shelfRes] = await Promise.all([
        api.get('/cameras', {
          params: { search, storeId: selectedStoreId, status: statusFilter },
        }),
        api.get('/stores'),
        api.get('/shelves'),
      ]);
      setCameras(camRes.data);
      setStores(storeRes.data);
      setShelves(shelfRes.data);
    } catch (err) {
      console.error('Failed to load camera data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [search, selectedStoreId, statusFilter]);

  const handleOpenAdd = () => {
    setEditingCamera(null);
    setFormName('');
    setFormCameraCode(`CAM-${Math.floor(100 + Math.random() * 900)}`);
    setFormStoreId(stores[0]?.id || '');
    setFormShelfId('');
    setFormStreamUrl('rtsp://stream.cams.internal/live/ch1');
    setFormResolution('1080p (1920x1080)');
    setFormFps(30);
    setFormStatus('Active');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cam: Camera, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCamera(cam);
    setFormName(cam.name);
    setFormCameraCode(cam.cameraCode);
    setFormStoreId(cam.storeId);
    setFormShelfId(cam.shelfId || '');
    setFormStreamUrl(cam.streamUrl);
    setFormResolution(cam.resolution || '1080p');
    setFormFps(cam.fps || 30);
    setFormStatus(cam.status);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete camera "${name}"?`)) {
      try {
        await api.delete(`/cameras/${id}`);
        fetchAllData();
        if (previewCamera?.id === id) {
          setPreviewCamera(null);
        }
      } catch (err) {
        alert('Failed to delete camera');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formStoreId || !formStreamUrl) {
      setFormError('Camera Name, Store Branch, and Stream URL are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingCamera) {
        await api.put(`/cameras/${editingCamera.id}`, {
          name: formName,
          cameraCode: formCameraCode,
          storeId: formStoreId,
          shelfId: formShelfId || null,
          streamUrl: formStreamUrl,
          resolution: formResolution,
          fps: formFps,
          status: formStatus,
        });
      } else {
        await api.post('/cameras', {
          name: formName,
          cameraCode: formCameraCode,
          storeId: formStoreId,
          shelfId: formShelfId || null,
          streamUrl: formStreamUrl,
          resolution: formResolution,
          fps: formFps,
          status: formStatus,
        });
      }
      setIsModalOpen(false);
      fetchAllData();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save camera');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter shelves when storeId changes in modal
  const availableShelves = shelves.filter((s) => s.storeId === formStoreId);

  const filteredCameras = cameras.filter((cam) => {
    const matchesStore =
      selectedStoreId === 'All' || cam.storeId === selectedStoreId;
    const matchesStatus =
      statusFilter === 'All' ||
      cam.status.toLowerCase() === statusFilter.toLowerCase();
    const q = search.trim().toLowerCase();
    const matchesQuery =
      !q ||
      (cam.name && cam.name.toLowerCase().includes(q)) ||
      (cam.cameraCode && cam.cameraCode.toLowerCase().includes(q)) ||
      (cam.streamUrl && cam.streamUrl.toLowerCase().includes(q)) ||
      (cam.storeName && cam.storeName.toLowerCase().includes(q)) ||
      (cam.shelfName && cam.shelfName.toLowerCase().includes(q));
    return matchesStore && matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <CameraIcon className="w-5 h-5 text-[#008A3E]" />
            <span>Optical Sensor & Camera Stream Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor camera sensors, RTSP live feeds, resolution profiles, and shelf attachment.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#00E676] hover:bg-[#00c865] text-slate-950 font-bold text-xs shadow-md shadow-[#00E676]/25 flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Camera</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cameras, code, URL..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
          >
            <option value="All">All Store Locations</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-36 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active / Online</option>
            <option value="Offline">Offline</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Main Cameras Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">
          <span className="inline-block w-6 h-6 border-2 border-[#00E676]/30 border-t-[#00E676] rounded-full animate-spin mb-2" />
          <p>Loading optical cameras...</p>
        </div>
      ) : filteredCameras.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <CameraIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            No Cameras Registered
          </p>
          <p className="text-xs text-slate-400 mt-1">Adjust filters or register a new optical sensor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCameras.map((cam) => (
            <div
              key={cam.id}
              onClick={() => setPreviewCamera(cam)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between hover:border-[#00E676]"
            >
              <div>
                {/* Camera Top Info */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2.5 rounded-xl ${
                        cam.status === 'Active'
                          ? 'bg-[#00E676]/15 text-[#008A3E]'
                          : cam.status === 'Maintenance'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#008A3E] transition-colors">
                        {cam.name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">{cam.cameraCode}</span>
                    </div>
                  </div>

                  <StatusBadge status={cam.status} />
                </div>

                {/* RTSP & Location Info */}
                <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-slate-400 flex items-center gap-1">
                      <StoreIcon className="w-3.5 h-3.5 text-[#008A3E]" />
                      Store Node:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {cam.storeName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      Assigned Shelf:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {cam.shelfName || 'Unassigned'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-xl font-mono text-[10px] text-slate-500 truncate border border-slate-100">
                    {cam.streamUrl}
                  </div>
                </div>
              </div>

              {/* Bottom Specs & Actions */}
              <div className="pt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                  <span>{cam.resolution}</span>
                  <span>•</span>
                  <span>{cam.fps} FPS</span>
                </div>

                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleOpenEdit(cam, e)}
                    className="p-1.5 text-slate-400 hover:text-[#008A3E] rounded-lg hover:bg-slate-100 transition-colors"
                    title="Edit Camera"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(cam.id, cam.name, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Delete Camera"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Camera Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCamera ? 'Edit Camera Configuration' : 'Register Optical Camera'}
        subtitle="Configure camera code, stream URL, resolution profile and shelf mapping"
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
              Camera Name / Sensor Label *
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Beverages Aisle North Optical Sensor"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Camera Code
              </label>
              <input
                type="text"
                value={formCameraCode}
                onChange={(e) => setFormCameraCode(e.target.value)}
                placeholder="e.g. CAM-MUM-01"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as CameraStatus)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              >
                <option value="Active" className="bg-slate-900 text-white">Active (Online)</option>
                <option value="Offline" className="bg-slate-900 text-white">Offline</option>
                <option value="Maintenance" className="bg-slate-900 text-white">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Store Node *
              </label>
              <select
                value={formStoreId}
                onChange={(e) => {
                  setFormStoreId(e.target.value);
                  setFormShelfId('');
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                required
              >
                <option value="" disabled className="bg-slate-900 text-white">
                  Select Store Branch
                </option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Assigned Shelf
              </label>
              <select
                value={formShelfId}
                onChange={(e) => setFormShelfId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              >
                <option value="" className="bg-slate-900 text-white">Unassigned (None)</option>
                {availableShelves.map((sh) => (
                  <option key={sh.id} value={sh.id} className="bg-slate-900 text-white">
                    {sh.name} ({sh.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              RTSP / Video Stream URL *
            </label>
            <input
              type="text"
              value={formStreamUrl}
              onChange={(e) => setFormStreamUrl(e.target.value)}
              placeholder="rtsp://192.168.1.100:554/live/ch1"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Stream Resolution
              </label>
              <select
                value={formResolution}
                onChange={(e) => setFormResolution(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              >
                <option value="1080p (1920x1080)" className="bg-slate-900 text-white">1080p (FHD)</option>
                <option value="4K (3840x2160)" className="bg-slate-900 text-white">4K (UHD)</option>
                <option value="720p (1280x720)" className="bg-slate-900 text-white">720p (HD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Target Frame Rate (FPS)
              </label>
              <input
                type="number"
                value={formFps}
                onChange={(e) => setFormFps(Number(e.target.value))}
                min={1}
                max={120}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E676]"
              />
            </div>
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
              {isSubmitting ? 'Saving...' : editingCamera ? 'Update Camera' : 'Register Camera'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Stream Telemetry Preview Modal */}
      {previewCamera && (
        <Modal
          isOpen={Boolean(previewCamera)}
          onClose={() => setPreviewCamera(null)}
          title={`Camera Telemetry & AI Stream: ${previewCamera.name}`}
          subtitle={`Sensor Code: ${previewCamera.cameraCode}`}
          maxWidth="xl"
        >
          <div className="space-y-4">
            {/* Simulated Stream Viewer Box */}
            <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center group">
              <div className="absolute top-3 left-3 flex items-center gap-2 z-10 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full border border-slate-800 text-xs font-mono text-white">
                <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                <span>LIVE RTSP + AI OVERLAY</span>
              </div>

              {/* Simulated AI Bounding Box Overlay */}
              <div className="absolute inset-0 p-8 flex items-center justify-center z-10 pointer-events-none">
                <div className="border-2 border-dashed border-[#00E676] rounded-lg p-4 bg-[#00E676]/10 text-[#00E676] font-mono text-[10px] flex flex-col justify-between w-48 h-32 animate-pulse">
                  <div className="flex justify-between items-center">
                    <span className="bg-[#00E676] text-slate-950 px-1.5 py-0.5 rounded font-extrabold">
                      SHOULDERS / GAZE #042
                    </span>
                    <span>98.4% CONF</span>
                  </div>
                  <div className="text-right font-bold">
                    <span>DWELL: 14.2s</span>
                  </div>
                </div>
              </div>

              <div className="text-center p-6 space-y-2 z-0">
                <Video className="w-12 h-12 text-[#00E676] mx-auto animate-pulse" />
                <p className="text-xs font-mono text-slate-400">Connecting to RTSP Stream...</p>
                <p className="text-[11px] font-mono text-slate-500">{previewCamera.streamUrl}</p>
              </div>

              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-md border border-slate-800 z-10">
                {previewCamera.resolution} @ {previewCamera.fps} FPS
              </div>
            </div>

            {/* AI Detection Controls Bar */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <span className="font-semibold text-[#00E676] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
                AI Vision Detection Overlays
              </span>
              <div className="flex items-center gap-4 text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#00E676]" />
                  <span>Gaze Vectors</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#00E676]" />
                  <span>Shopper Bounding Boxes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#00E676]" />
                  <span>Pedestrian Flow Counter</span>
                </label>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px]">Store Node Location</span>
                <p className="font-bold text-white mt-0.5">
                  {previewCamera.storeName}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Attached Shelf Sector</span>
                <p className="font-bold text-white mt-0.5">
                  {previewCamera.shelfName || 'Unassigned'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Sensor Status</span>
                <div className="mt-1">
                  <StatusBadge status={previewCamera.status} />
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Last Heartbeat Ping</span>
                <p className="font-bold text-[#00E676] mt-0.5">
                  Connected (2ms latency)
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setPreviewCamera(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Close Stream
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
