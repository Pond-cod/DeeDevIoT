"use client";

import React, { useState, useEffect } from 'react';
import { 
  Server, Plus, Edit3, Trash2, ExternalLink, FileText, 
  Loader2, Save, X, Search, CheckCircle2, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { ServiceData } from '../../../types/portfolio';
import AdminImagePreview from '../../../components/admin/AdminImagePreview';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import { convertToDirectLink } from '../../../lib/utils/drive';

const emptyService: ServiceData = {
  id: '',
  title: '',
  description: '',
  title_th: '',
  description_th: '',
  icon: 'IoT Solution',
  imageUrl: '',
  demoUrl: '',
  videoUrls: '',
  manualUrl: ''
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<ServiceData>(emptyService);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [videoUrls, setVideoUrls] = useState<string[]>(['']);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Load services
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/services', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setServices(json.data);
      }
    } catch {
      setStatus({ type: 'error', message: 'ไม่สามารถโหลดข้อมูลบริการได้' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      ...emptyService,
      id: `svc_${Date.now().toString().slice(-4)}`
    });
    setImageUrls(['']);
    setVideoUrls(['']);
    setIsModalOpen(true);
  };

  const openEditModal = (svc: ServiceData) => {
    setIsEdit(true);
    setFormData(svc);
    const imgs = svc.imageUrl ? svc.imageUrl.split(',').map(u => u.trim()).filter(Boolean) : [''];
    setImageUrls(imgs.length > 0 ? imgs : ['']);
    const vids = svc.videoUrls ? svc.videoUrls.split(',').map(u => u.trim()).filter(Boolean) : [''];
    setVideoUrls(vids.length > 0 ? vids : ['']);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`คุณต้องการลบบริการ "${name}" (ID: ${id}) ใช่หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/services?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setStatus({ type: 'success', message: 'ลบบริการเรียบร้อยแล้ว' });
        fetchServices();
      } else {
        setStatus({ type: 'error', message: json.error || 'ลบไม่สำเร็จ' });
      }
    } catch {
      setStatus({ type: 'error', message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const joinedImages = imageUrls
        .map(u => u.trim())
        .filter(Boolean)
        .map(u => convertToDirectLink(u))
        .join(',');

      const joinedVideos = videoUrls
        .map(u => u.trim())
        .filter(Boolean)
        .join(',');

      const payload = {
        ...formData,
        imageUrl: joinedImages,
        videoUrls: joinedVideos,
        isEdit
      };

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success) {
        setStatus({ type: 'success', message: isEdit ? 'อัปเดตบริการสำเร็จแล้ว' : 'เพิ่มบริการใหม่สำเร็จแล้ว' });
        setIsModalOpen(false);
        fetchServices();
      } else {
        setStatus({ type: 'error', message: json.error || 'บันทึกไม่สำเร็จ' });
      }
    } catch {
      setStatus({ type: 'error', message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = services.filter(s => {
    const q = searchQuery.toLowerCase();
    return s.title.toLowerCase().includes(q) || 
           (s.title_th && s.title_th.toLowerCase().includes(q)) ||
           s.description.toLowerCase().includes(q) ||
           s.icon.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Server size={22} className="text-[#E11D48]" />
            <span>จัดการบริการและโซลูชัน (Services Manager)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            เพิ่ม ลบ และแก้ไขบริการ IoT, Web Platform และตัวอย่างรูปภาพ
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#EA580C] hover:opacity-95 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>+ เพิ่มบริการใหม่</span>
        </button>
      </div>

      {/* Status Toast */}
      {status.type && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{status.message}</span>
          </div>
          <button onClick={() => setStatus({ type: null, message: '' })} className="text-slate-400 hover:text-slate-700">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="ค้นหาชื่อบริการ, ประเภท, หรือคำอธิบาย..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-xs text-slate-900 font-medium outline-none focus:border-[#E11D48] transition-all"
        />
      </div>

      {/* Services List Table / Cards */}
      {isLoading ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#E11D48]" />
          <p className="mt-2 text-xs text-slate-500 font-mono">กำลังโหลดข้อมูลบริการ...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-slate-200 p-8 space-y-2">
          <Server size={32} className="text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">ไม่พบบริการ</h3>
          <p className="text-xs text-slate-400">ยังไม่มีรายการบริการ หรือไม่ตรงกับคำค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(svc => {
            const firstImg = svc.imageUrl ? svc.imageUrl.split(',')[0].trim() : '';
            return (
              <div
                key={svc.id}
                className="bg-white border-2 border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden">
                    <ImageWithFallback
                      src={firstImg}
                      alt={svc.title_th || svc.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-[#E11D48] border border-rose-200">
                        {svc.icon || 'Solution'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 truncate">ID: {svc.id}</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 truncate">
                      {svc.title_th || svc.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {svc.description_th || svc.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    {svc.demoUrl && <span className="text-sky-600 font-bold">✓ Live Demo</span>}
                    {svc.manualUrl && <span className="text-amber-600 font-bold">✓ Manual</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(svc)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>แก้ไข</span>
                    </button>
                    <button
                      onClick={() => handleDelete(svc.id, svc.title_th || svc.title)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="ลบรายการ"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border-2 border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900">
                {isEdit ? 'แก้ไขข้อมูลบริการ' : 'เพิ่มบริการใหม่'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Service ID *</label>
                  <input
                    type="text"
                    required
                    disabled={isEdit}
                    value={formData.id}
                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">หมวดหมู่ / ไอคอน *</label>
                  <input
                    type="text"
                    required
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="เช่น IoT Solution, Web Platform"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">ชื่อบริการ (ภาษาไทย) *</label>
                <input
                  type="text"
                  required
                  value={formData.title_th || ''}
                  onChange={e => setFormData({ ...formData, title_th: e.target.value, title: formData.title || e.target.value })}
                  placeholder="เช่น ระบบสั่งอาหารออนไลน์ผ่าน LINE LIFF"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">ชื่อบริการ (English)</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. LINE LIFF Online Food Ordering"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">รายละเอียดบริการ (ภาษาไทย)</label>
                <textarea
                  rows={3}
                  value={formData.description_th || ''}
                  onChange={e => setFormData({ ...formData, description_th: e.target.value, description: formData.description || e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none resize-none"
                />
              </div>

              {/* Image URLs with AdminImagePreview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    รูปภาพปก & แกลเลอรี (Google Drive / Facebook CDN)
                  </label>
                  <button
                    type="button"
                    onClick={() => setImageUrls([...imageUrls, ''])}
                    className="text-xs font-bold text-[#E11D48] hover:underline"
                  >
                    + เพิ่มรูปภาพ
                  </button>
                </div>

                {imageUrls.map((url, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={url}
                        onChange={e => {
                          const arr = [...imageUrls];
                          arr[idx] = e.target.value;
                          setImageUrls(arr);
                        }}
                        placeholder="https://drive.google.com/file/d/... หรือ URL รูปภาพ"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                      />
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    {url.trim() && <AdminImagePreview url={url} />}
                  </div>
                ))}
              </div>

              {/* External links */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">ลิงก์ระบบจริง / Live Demo</label>
                  <input
                    type="text"
                    value={formData.demoUrl || ''}
                    onChange={e => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://your-demo.app"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">ลิงก์คู่มือ / Manual (PDF / Docs)</label>
                  <input
                    type="text"
                    value={formData.manualUrl || ''}
                    onChange={e => setFormData({ ...formData, manualUrl: e.target.value })}
                    placeholder="https://docs.google.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#EA580C] text-white text-xs font-bold shadow-xs hover:opacity-95 flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  <span>{isSaving ? 'กำลังบันทึกลงชีต...' : 'บันทึกข้อมูลบริการ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
