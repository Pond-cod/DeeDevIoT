"use client";

import React, { useState, useEffect } from 'react';
import { 
  Layers, Plus, Edit3, Trash2, Loader2, Save, X, 
  CheckCircle2, AlertCircle, Eye, EyeOff, FolderPlus 
} from 'lucide-react';
import { SectionData, SectionItemData } from '../../../types/portfolio';
import AdminImagePreview from '../../../components/admin/AdminImagePreview';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import { convertToDirectLink } from '../../../lib/utils/drive';

const emptySection: SectionData = {
  id: '',
  title_en: '',
  title_th: '',
  subtitle_en: '',
  subtitle_th: '',
  is_active: 'TRUE'
};

const emptyItem: SectionItemData = {
  id: '',
  section_id: '',
  title_en: '',
  title_th: '',
  desc_en: '',
  desc_th: '',
  icon: 'Layers',
  imageUrl: ''
};

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [items, setItems] = useState<SectionItemData[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Section Modal
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isSectionEdit, setIsSectionEdit] = useState(false);
  const [sectionForm, setSectionForm] = useState<SectionData>(emptySection);

  // Item Modal
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isItemEdit, setIsItemEdit] = useState(false);
  const [itemForm, setItemForm] = useState<SectionItemData>(emptyItem);

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [secRes, itmRes] = await Promise.all([
        fetch('/api/sections', { cache: 'no-store' }),
        fetch('/api/section-items', { cache: 'no-store' })
      ]);
      const [secJson, itmJson] = await Promise.all([secRes.json(), itmRes.json()]);

      if (secJson.success && Array.isArray(secJson.data)) {
        setSections(secJson.data);
        if (secJson.data.length > 0 && !selectedSectionId) {
          setSelectedSectionId(secJson.data[0].id);
        }
      }
      if (itmJson.success && Array.isArray(itmJson.data)) {
        setItems(itmJson.data);
      }
    } catch {
      setStatus({ type: 'error', message: 'ไม่สามารถโหลดข้อมูลเซกชันได้' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddSection = () => {
    setIsSectionEdit(false);
    setSectionForm({
      ...emptySection,
      id: `sec_${Date.now().toString().slice(-4)}`
    });
    setIsSectionModalOpen(true);
  };

  const openEditSection = (sec: SectionData) => {
    setIsSectionEdit(true);
    setSectionForm(sec);
    setIsSectionModalOpen(true);
  };

  const handleDeleteSection = async (id: string, name: string) => {
    if (!confirm(`คุณต้องการลบเซกชัน "${name}" (ID: ${id}) ใช่หรือไม่? รายการย่อยทั้งหมดจะถูกลบไปด้วย`)) return;
    try {
      const res = await fetch(`/api/sections?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setStatus({ type: 'success', message: 'ลบเซกชันเรียบร้อยแล้ว' });
        fetchData();
      } else {
        setStatus({ type: 'error', message: json.error || 'ลบไม่สำเร็จ' });
      }
    } catch {
      setStatus({ type: 'error', message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
    }
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sectionForm, isEdit: isSectionEdit })
      });
      const json = await res.json();
      if (json.success) {
        setStatus({ type: 'success', message: isSectionEdit ? 'อัปเดตเซกชันสำเร็จ' : 'สร้างเซกชันใหม่สำเร็จ' });
        setIsSectionModalOpen(false);
        fetchData();
      } else {
        setStatus({ type: 'error', message: json.error || 'บันทึกไม่สำเร็จ' });
      }
    } catch {
      setStatus({ type: 'error', message: 'เกิดข้อผิดพลาดในการบันทึก' });
    } finally {
      setIsSaving(false);
    }
  };

  const openAddItem = () => {
    if (!selectedSectionId) {
      alert('กรุณาเลือกหรือสร้างเซกชันหลักก่อน');
      return;
    }
    setIsItemEdit(false);
    setItemForm({
      ...emptyItem,
      id: `itm_${Date.now().toString().slice(-4)}`,
      section_id: selectedSectionId
    });
    setIsItemModalOpen(true);
  };

  const openEditItem = (it: SectionItemData) => {
    setIsItemEdit(true);
    setItemForm(it);
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`คุณต้องการลบรายการย่อย "${name}" (ID: ${id}) ใช่หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/section-items?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setStatus({ type: 'success', message: 'ลบรายการย่อยสำเร็จ' });
        fetchData();
      } else {
        setStatus({ type: 'error', message: json.error || 'ลบไม่สำเร็จ' });
      }
    } catch {
      setStatus({ type: 'error', message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...itemForm,
        section_id: selectedSectionId,
        imageUrl: convertToDirectLink(itemForm.imageUrl),
        isEdit: isItemEdit
      };
      const res = await fetch('/api/section-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setStatus({ type: 'success', message: isItemEdit ? 'อัปเดตรายการสำเร็จ' : 'เพิ่มรายการใหม่สำเร็จ' });
        setIsItemModalOpen(false);
        fetchData();
      } else {
        setStatus({ type: 'error', message: json.error || 'บันทึกไม่สำเร็จ' });
      }
    } catch {
      setStatus({ type: 'error', message: 'เกิดข้อผิดพลาดในการบันทึก' });
    } finally {
      setIsSaving(false);
    }
  };

  const currentSectionItems = items.filter(it => it.section_id === selectedSectionId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Layers size={22} className="text-sky-600" />
            <span>จัดการเซกชันเนื้อหา (CMS Sections & Items)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            จัดการหัวข้อเนื้อหาแบบไดนามิก และรายการย่อยบนเว็บไซต์
          </p>
        </div>

        <button
          onClick={openAddSection}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:opacity-95 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <FolderPlus size={16} />
          <span>+ สร้างเซกชันหลักใหม่</span>
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

      {/* Sections Selector Pills */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-200/90 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-500 block">เลือกเซกชันหลักที่ต้องการจัดการ:</span>
        <div className="flex flex-wrap items-center gap-2">
          {sections.map(sec => {
            const active = sec.id === selectedSectionId;
            return (
              <div
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border-2 ${
                  active
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{sec.title_th || sec.title_en}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {items.filter(it => it.section_id === sec.id).length}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditSection(sec);
                  }}
                  className="p-1 hover:bg-white/20 rounded"
                  title="แก้ไขหัวข้อเซกชัน"
                >
                  <Edit3 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Section Header & Sub-items */}
      {selectedSectionId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900">
              รายการย่อยในเซกชันนี้ ({currentSectionItems.length} รายการ)
            </h2>
            <button
              onClick={openAddItem}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus size={14} />
              <span>+ เพิ่มรายการย่อย</span>
            </button>
          </div>

          {currentSectionItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-slate-200 p-8 space-y-2">
              <Layers size={32} className="text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">ยังไม่มีรายการย่อยในเซกชันนี้</h3>
              <p className="text-xs text-slate-400">กดปุ่ม &quot;+ เพิ่มรายการย่อย&quot; เพื่อเริ่มต้นใส่ข้อมูล</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSectionItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white border-2 border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3.5">
                    {item.imageUrl && (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden">
                        <ImageWithFallback
                          src={item.imageUrl}
                          alt={item.title_th || item.title_en}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                          {item.icon || 'Item'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 truncate">ID: {item.id}</span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 truncate">
                        {item.title_th || item.title_en}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.desc_th || item.desc_en}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditItem(item)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>แก้ไข</span>
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id, item.title_th || item.title_en)}
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
        </div>
      )}

      {/* Section Modal */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border-2 border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900">
                {isSectionEdit ? 'แก้ไขเซกชัน' : 'สร้างเซกชันใหม่'}
              </h2>
              <button onClick={() => setIsSectionModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Section ID *</label>
                <input
                  type="text"
                  required
                  disabled={isSectionEdit}
                  value={sectionForm.id}
                  onChange={e => setSectionForm({ ...sectionForm, id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-mono text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">ชื่อเซกชัน (ภาษาไทย) *</label>
                <input
                  type="text"
                  required
                  value={sectionForm.title_th}
                  onChange={e => setSectionForm({ ...sectionForm, title_th: e.target.value, title_en: sectionForm.title_en || e.target.value })}
                  placeholder="เช่น ผลงานไฮไลต์พิเศษ"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">ชื่อเซกชัน (English)</label>
                <input
                  type="text"
                  value={sectionForm.title_en}
                  onChange={e => setSectionForm({ ...sectionForm, title_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">คำบรรยายเซกชัน (ภาษาไทย)</label>
                <textarea
                  rows={2}
                  value={sectionForm.subtitle_th}
                  onChange={e => setSectionForm({ ...sectionForm, subtitle_th: e.target.value, subtitle_en: sectionForm.subtitle_en || e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {isSectionEdit ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(sectionForm.id, sectionForm.title_th || sectionForm.title_en)}
                    className="text-xs font-bold text-rose-500 hover:underline"
                  >
                    ลบเซกชันนี้
                  </button>
                ) : <span />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSectionModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white text-xs font-bold shadow-xs hover:opacity-95 flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกเซกชัน'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border-2 border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900">
                {isItemEdit ? 'แก้ไขรายการย่อย' : 'เพิ่มรายการย่อยใหม่'}
              </h2>
              <button onClick={() => setIsItemModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Item ID *</label>
                  <input
                    type="text"
                    required
                    disabled={isItemEdit}
                    value={itemForm.id}
                    onChange={e => setItemForm({ ...itemForm, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">ไอคอน / ป้ายกำกับ</label>
                  <input
                    type="text"
                    value={itemForm.icon}
                    onChange={e => setItemForm({ ...itemForm, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">ชื่อรายการ (ภาษาไทย) *</label>
                <input
                  type="text"
                  required
                  value={itemForm.title_th}
                  onChange={e => setItemForm({ ...itemForm, title_th: e.target.value, title_en: itemForm.title_en || e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">ชื่อรายการ (English)</label>
                <input
                  type="text"
                  value={itemForm.title_en}
                  onChange={e => setItemForm({ ...itemForm, title_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">รายละเอียด (ภาษาไทย)</label>
                <textarea
                  rows={2}
                  value={itemForm.desc_th}
                  onChange={e => setItemForm({ ...itemForm, desc_th: e.target.value, desc_en: itemForm.desc_en || e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">ลิงก์รูปภาพ (Google Drive / Facebook CDN)</label>
                <input
                  type="text"
                  value={itemForm.imageUrl}
                  onChange={e => setItemForm({ ...itemForm, imageUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/d/... หรือ URL รูปภาพ"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
                {itemForm.imageUrl && <AdminImagePreview url={itemForm.imageUrl} />}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white text-xs font-bold shadow-xs hover:opacity-95 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกรายการ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
