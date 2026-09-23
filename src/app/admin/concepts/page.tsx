"use client";

import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, Plus, Edit3, Trash2, Loader2, Save, X, 
  CheckCircle2, AlertCircle, ShieldCheck, Zap, Lock, Cpu 
} from 'lucide-react';
import { ConceptItem } from '../../../types/portfolio';

const emptyConcept: ConceptItem = {
  id: '',
  title_en: '',
  title_th: '',
  desc_en: '',
  desc_th: '',
  icon: 'ShieldCheck'
};

export default function AdminConceptsPage() {
  const [concepts, setConcepts] = useState<ConceptItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<ConceptItem>(emptyConcept);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const fetchConcepts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/concept', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setConcepts(json.data);
      }
    } catch {
      setStatus({ type: 'error', message: 'ไม่สามารถโหลดข้อมูลสถาปัตยกรรมได้' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConcepts();
  }, []);

  const openAdd = () => {
    setIsEdit(false);
    setFormData({
      ...emptyConcept,
      id: `cpt_${Date.now().toString().slice(-4)}`
    });
    setIsModalOpen(true);
  };

  const openEdit = (cpt: ConceptItem) => {
    setIsEdit(true);
    setFormData(cpt);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`คุณต้องการลบคอนเซปต์ "${name}" ใช่หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/concept?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setStatus({ type: 'success', message: 'ลบคอนเซปต์เรียบร้อยแล้ว' });
        fetchConcepts();
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
      const res = await fetch('/api/concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isEdit })
      });
      const json = await res.json();
      if (json.success) {
        setStatus({ type: 'success', message: isEdit ? 'อัปเดตคอนเซปต์สำเร็จ' : 'เพิ่มคอนเซปต์ใหม่สำเร็จ' });
        setIsModalOpen(false);
        fetchConcepts();
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
            <Lightbulb size={22} className="text-emerald-600" />
            <span>จัดการคอนเซปต์สถาปัตยกรรม (Concepts Manager)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            จัดการหลักการออกแบบทางวิศวกรรม IoT และจุดเด่นของระบบ
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>+ เพิ่มคอนเซปต์ใหม่</span>
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
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
          <p className="mt-2 text-xs text-slate-500 font-mono">กำลังโหลดคอนเซปต์...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {concepts.map(cpt => (
            <div
              key={cpt.id}
              className="bg-white border-2 border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-rose-400 flex items-center justify-center font-mono font-bold text-xs">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">ID: {cpt.id}</span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900">{cpt.title_th}</h3>
                <p className="text-[11px] font-mono text-slate-500">{cpt.title_en}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{cpt.desc_th}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEdit(cpt)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit3 size={13} />
                  <span>แก้ไข</span>
                </button>
                <button
                  onClick={() => handleDelete(cpt.id, cpt.title_th)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="ลบรายการ"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border-2 border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900">
                {isEdit ? 'แก้ไขคอนเซปต์' : 'เพิ่มคอนเซปต์ใหม่'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Concept ID *</label>
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
                  <label className="text-xs font-bold text-slate-800 block mb-1">ไอคอน (Icon Key)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">หัวข้อ (ภาษาไทย) *</label>
                <input
                  type="text"
                  required
                  value={formData.title_th}
                  onChange={e => setFormData({ ...formData, title_th: e.target.value, title_en: formData.title_en || e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">หัวข้อ (English)</label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={e => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">คำอธิบาย (ภาษาไทย)</label>
                <textarea
                  rows={3}
                  value={formData.desc_th}
                  onChange={e => setFormData({ ...formData, desc_th: e.target.value, desc_en: formData.desc_en || e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none resize-none"
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
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold shadow-xs hover:opacity-95 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกคอนเซปต์'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
