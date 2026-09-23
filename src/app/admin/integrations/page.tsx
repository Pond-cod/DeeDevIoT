"use client";

import React, { useState, useEffect } from 'react';
import { 
  Link as LinkIcon, Plus, Edit3, Trash2, ExternalLink, 
  Loader2, Save, X, Search, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { IntegrationData } from '../../../types/portfolio';
import AdminImagePreview from '../../../components/admin/AdminImagePreview';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import { convertToDirectLink } from '../../../lib/utils/drive';

const emptyIntegration: IntegrationData = {
  id: '',
  title: '',
  description: '',
  title_th: '',
  description_th: '',
  imageUrl: '',
  tag: 'Hardware',
  referenceUrl: '',
  manualUrl: ''
};

export default function AdminIntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<IntegrationData>(emptyIntegration);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const fetchIntegrations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/integrations', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setIntegrations(json.data);
      }
    } catch {
      setStatus({ type: 'error', message: 'ไม่สามารถโหลดข้อมูลระบบเชื่อมต่อได้' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      ...emptyIntegration,
      id: `int_${Date.now().toString().slice(-4)}`
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: IntegrationData) => {
    setIsEdit(true);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`คุณต้องการลบเทคโนโลยี "${name}" (ID: ${id}) ใช่หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/integrations?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setStatus({ type: 'success', message: 'ลบรายการเรียบร้อยแล้ว' });
        fetchIntegrations();
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
      const payload = {
        ...formData,
        imageUrl: convertToDirectLink(formData.imageUrl),
        isEdit
      };

      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success) {
        setStatus({ type: 'success', message: isEdit ? 'อัปเดตข้อมูลสำเร็จ' : 'เพิ่มข้อมูลใหม่สำเร็จ' });
        setIsModalOpen(false);
        fetchIntegrations();
      } else {
        setStatus({ type: 'error', message: json.error || 'บันทึกไม่สำเร็จ' });
      }
    } catch {
      setStatus({ type: 'error', message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = integrations.filter(it => {
    const q = searchQuery.toLowerCase();
    return it.title.toLowerCase().includes(q) || 
           (it.title_th && it.title_th.toLowerCase().includes(q)) ||
           it.description.toLowerCase().includes(q) ||
           it.tag.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <LinkIcon size={22} className="text-[#EA580C]" />
            <span>จัดการเทคโนโลยีและอุปกรณ์ (Integrations Manager)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            จัดการอุปกรณ์ฮาร์ดแวร์ เซนเซอร์ และระบบเชื่อมต่อที่รองรับ
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>+ เพิ่มรายการใหม่</span>
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

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="ค้นหาชื่ออุปกรณ์, โปรโตคอล, หรือแท็ก..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-xs text-slate-900 font-medium outline-none focus:border-[#EA580C] transition-all"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#EA580C]" />
          <p className="mt-2 text-xs text-slate-500 font-mono">กำลังโหลดรายการเชื่อมต่อ...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-slate-200 p-8 space-y-2">
          <LinkIcon size={32} className="text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">ไม่พบรายการ</h3>
          <p className="text-xs text-slate-400">ยังไม่มีรายการเทคโนโลยีเชื่อมต่อ หรือไม่ตรงกับคำค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-white border-2 border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden">
                  <ImageWithFallback
                    src={item.imageUrl}
                    alt={item.title_th || item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {item.tag || 'Hardware'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 truncate">ID: {item.id}</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 truncate">
                    {item.title_th || item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description_th || item.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {item.referenceUrl ? (
                  <a
                    href={item.referenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 font-bold flex items-center gap-1 hover:underline text-[11px]"
                  >
                    <span>Reference URL</span>
                    <ExternalLink size={12} />
                  </a>
                ) : <span />}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>แก้ไข</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title_th || item.title)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="ลบรายการ"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto border-2 border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900">
                {isEdit ? 'แก้ไขรายการเชื่อมต่อ' : 'เพิ่มรายการเชื่อมต่อใหม่'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">ID *</label>
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
                  <label className="text-xs font-bold text-slate-800 block mb-1">แท็กหมวดหมู่ (Tag) *</label>
                  <input
                    type="text"
                    required
                    value={formData.tag}
                    onChange={e => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="เช่น ESP32, Modbus, MQTT"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">ชื่อรายการ (ภาษาไทย) *</label>
                <input
                  type="text"
                  required
                  value={formData.title_th || ''}
                  onChange={e => setFormData({ ...formData, title_th: e.target.value, title: formData.title || e.target.value })}
                  placeholder="เช่น บอร์ดสื่อสาร ESP32 Wi-Fi / BLE"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">ชื่อรายการ (English)</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. ESP32 Microcontroller Platform"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">รายละเอียด (ภาษาไทย)</label>
                <textarea
                  rows={3}
                  value={formData.description_th || ''}
                  onChange={e => setFormData({ ...formData, description_th: e.target.value, description: formData.description || e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none resize-none"
                />
              </div>

              {/* Image URL with AdminImagePreview */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">ลิงก์รูปภาพ (Google Drive / Facebook CDN)</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/d/... หรือ URL รูปภาพ"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
                {formData.imageUrl && <AdminImagePreview url={formData.imageUrl} />}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">ลิงก์อ้างอิง (Reference URL)</label>
                <input
                  type="text"
                  value={formData.referenceUrl}
                  onChange={e => setFormData({ ...formData, referenceUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
              </div>

              {/* Submit */}
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
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-xs hover:opacity-95 flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
