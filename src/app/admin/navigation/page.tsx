"use client";

import React, { useState, useEffect } from 'react';
import { 
  Link as LinkIcon, Plus, Edit3, Trash2, Loader2, 
  Save, X, CheckCircle2, AlertCircle, ExternalLink 
} from 'lucide-react';
import { NavData } from '../../../types/portfolio';

const emptyNav: NavData = {
  id: '',
  label_en: '',
  label_th: '',
  href: ''
};

export default function AdminNavigationPage() {
  const [navLinks, setNavLinks] = useState<NavData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<NavData>(emptyNav);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const fetchNav = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/nav', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setNavLinks(json.data);
      }
    } catch {
      setStatus({ type: 'error', message: 'ไม่สามารถโหลดลิงก์เมนูได้' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNav();
  }, []);

  const openAdd = () => {
    setIsEdit(false);
    setFormData({
      ...emptyNav,
      id: `nav_${Date.now().toString().slice(-4)}`
    });
    setIsModalOpen(true);
  };

  const openEdit = (nav: NavData) => {
    setIsEdit(true);
    setFormData(nav);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`คุณต้องการลบลิงก์เมนู "${name}" ใช่หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/nav?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setStatus({ type: 'success', message: 'ลบเมนูเรียบร้อยแล้ว' });
        fetchNav();
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
      const res = await fetch('/api/nav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isEdit })
      });
      const json = await res.json();
      if (json.success) {
        setStatus({ type: 'success', message: isEdit ? 'อัปเดตเมนูสำเร็จ' : 'เพิ่มเมนูใหม่สำเร็จ' });
        setIsModalOpen(false);
        fetchNav();
      } else {
        setStatus({ type: 'error', message: json.error || 'บันทึกไม่สำเร็จ' });
      }
    } catch {
      setStatus({ type: 'error', message: 'เกิดข้อผิดพลาดในการบันทึก' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <LinkIcon size={22} className="text-purple-600" />
            <span>จัดการลิงก์เมนูนำทาง (Navigation Manager)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            จัดการลิงก์ใน Navigation Bar และเส้นทาง URL
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:opacity-95 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>+ เพิ่มลิงก์เมนู</span>
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

      {/* List */}
      {isLoading ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-2 text-xs text-slate-500 font-mono">กำลังโหลดเมนู...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {navLinks.map((item, idx) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-mono font-bold text-slate-400">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      {item.label_th || item.label_en}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                      <span>{item.label_en}</span>
                      <span>•</span>
                      <span className="text-sky-600 font-bold">{item.href}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>แก้ไข</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.label_th || item.label_en)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="ลบ"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border-2 border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900">
                {isEdit ? 'แก้ไขลิงก์เมนู' : 'เพิ่มลิงก์เมนูใหม่'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Nav ID *</label>
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
                <label className="text-xs font-bold text-slate-800 block mb-1">ชื่อเมนู (ภาษาไทย) *</label>
                <input
                  type="text"
                  required
                  value={formData.label_th}
                  onChange={e => setFormData({ ...formData, label_th: e.target.value, label_en: formData.label_en || e.target.value })}
                  placeholder="เช่น บริการโซลูชัน"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">ชื่อเมนู (English)</label>
                <input
                  type="text"
                  value={formData.label_en}
                  onChange={e => setFormData({ ...formData, label_en: e.target.value })}
                  placeholder="e.g. Services"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">เส้นทาง / URL (เช่น /services หรือ #contact) *</label>
                <input
                  type="text"
                  required
                  value={formData.href}
                  onChange={e => setFormData({ ...formData, href: e.target.value })}
                  placeholder="/services หรือ /showcase"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none font-mono"
                />
              </div>

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
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-xs font-bold shadow-xs hover:opacity-95 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกเมนู'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
