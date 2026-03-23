"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, Loader2, CheckCircle2, AlertCircle, LayoutDashboard, Server, PlusCircle,
  Edit2, XCircle, RefreshCw, LogOut, Settings, Link as LinkIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { convertToDirectLink } from '../../lib/utils/drive';

// ================= TYPES =================
interface ServiceData {
  id: string; title: string; description: string; icon: string; imageUrl: string; demoUrl?: string;
}
interface IntegrationData {
  id: string; title: string; description: string; icon: string; link: string;
}
interface ConfigData {
  hero_btn1_text: string; hero_btn1_link: string; hero_btn2_text: string; hero_btn2_link: string;
}

const emptySvc: ServiceData = { id: '', title: '', description: '', icon: '', imageUrl: '', demoUrl: '' };
const emptyInt: IntegrationData = { id: '', title: '', description: '', icon: '', link: '' };
const emptyConf: ConfigData = { hero_btn1_text: '', hero_btn1_link: '', hero_btn2_text: '', hero_btn2_link: '' };

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'services' | 'config' | 'integrations'>('services');

  // Shared State
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Services State
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isLoadingSvc, setIsLoadingSvc] = useState(false);
  const [svcForm, setSvcForm] = useState<ServiceData>(emptySvc);
  const [isSvcEdit, setIsSvcEdit] = useState(false);

  // Integrations State
  const [integrations, setIntegrations] = useState<IntegrationData[]>([]);
  const [isLoadingInt, setIsLoadingInt] = useState(false);
  const [intForm, setIntForm] = useState<IntegrationData>(emptyInt);
  const [isIntEdit, setIsIntEdit] = useState(false);

  // Config State
  const [configData, setConfigData] = useState<ConfigData>(emptyConf);
  const [isLoadingConf, setIsLoadingConf] = useState(false);

  // ================= FETCHING =================
  const fetchServices = async () => {
    setIsLoadingSvc(true);
    try {
      const res = await fetch('/api/services', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) setServices(json.data);
    } catch { } finally { setIsLoadingSvc(false); }
  };

  const fetchIntegrations = async () => {
    setIsLoadingInt(true);
    try {
      const res = await fetch('/api/integrations', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) setIntegrations(json.data);
    } catch { } finally { setIsLoadingInt(false); }
  };

  const fetchConfig = async () => {
    setIsLoadingConf(true);
    try {
      const res = await fetch('/api/config', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setConfigData({
          hero_btn1_text: json.data.hero_btn1_text || '',
          hero_btn1_link: json.data.hero_btn1_link || '',
          hero_btn2_text: json.data.hero_btn2_text || '',
          hero_btn2_link: json.data.hero_btn2_link || '',
        });
      }
    } catch { } finally { setIsLoadingConf(false); }
  };

  useEffect(() => {
    fetchServices();
    fetchIntegrations();
    fetchConfig();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch { }
  };

  // ================= HANDLERS =================
  const handleSvcSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus({ type: null, message: '' });
    try {
      const payload = { ...svcForm, imageUrl: convertToDirectLink(svcForm.imageUrl), isEdit: isSvcEdit };
      const res = await fetch('/api/services', { method: 'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'บันทึกบริการเรียบร้อย!' });
        setSvcForm(emptySvc); setIsSvcEdit(false); fetchServices();
      } else throw new Error(data.error);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'บันทึกไม่สำเร็จ' });
    } finally { setIsSaving(false); }
  };

  const handleIntSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus({ type: null, message: '' });
    try {
      const payload = { ...intForm, isEdit: isIntEdit };
      const res = await fetch('/api/integrations', { method: 'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'บันทึก Integration เรียบร้อย!' });
        setIntForm(emptyInt); setIsIntEdit(false); fetchIntegrations();
      } else throw new Error(data.error);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'บันทึกไม่สำเร็จ' });
    } finally { setIsSaving(false); }
  };

  const handleConfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus({ type: null, message: '' });
    try {
      const res = await fetch('/api/config', { method: 'POST', body: JSON.stringify(configData) });
      const data = await res.json();
      if (data.success) setStatus({ type: 'success', message: 'บันทึกการตั้งค่าเรียบร้อย!' });
      else throw new Error(data.error);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'บันทึกไม่สำเร็จ' });
    } finally { setIsSaving(false); }
  };

  // ================= RENDER TOOLS =================
  const renderStatus = () => status.type && (
    <div className={`p-4 mb-6 rounded-xl flex items-start gap-3 text-sm shadow border ${status.type === 'success' ? 'bg-teal-500/10 border-teal-500/20 text-teal-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
      {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <div className="font-medium pt-0.5">{status.message}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl"><LayoutDashboard className="w-8 h-8 text-teal-400" /></div>
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-400">Admin CMS</h1>
            <p className="text-slate-400">จัดการหน้าเว็บและบริการทั้งหมด</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-xl border border-red-500/20 font-semibold text-sm">
          <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">ออกจากระบบ</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-slate-800 flex gap-6 overflow-x-auto pb-[-1px]">
        {[
          { id: 'services', label: 'บริการหลัก (Services)', icon: Server },
          { id: 'config', label: 'ตั้งค่าหน้าหลัก (Site Config)', icon: Settings },
          { id: 'integrations', label: 'ระบบที่ใช้ร่วมกันได้', icon: LinkIcon }
        ].map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id as any); setStatus({ type: null, message: '' }); }}
            className={`flex items-center gap-2 px-4 py-3 font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === t.id ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* ================= SERVICES TAB ================= */}
        {activeTab === 'services' && (
          <div className="grid xl:grid-cols-12 gap-8">
            <div className="xl:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit sticky top-6">
              <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-slate-800 flex justify-between">
                <span>{isSvcEdit ? 'แก้ไขบริการ' : 'เพิ่มบริการใหม่'}</span>
                {isSvcEdit && <button onClick={() => { setSvcForm(emptySvc); setIsSvcEdit(false); }} className="text-xs px-3 py-1 bg-red-500/10 text-red-400 rounded-lg">ยกเลิก</button>}
              </h2>
              {renderStatus()}
              <form onSubmit={handleSvcSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Service ID</label>
                    <input type="text" value={svcForm.id} onChange={(e) => setSvcForm({...svcForm, id: e.target.value})} readOnly={isSvcEdit} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 mt-1 text-sm outline-none focus:border-teal-500 disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Icon Name</label>
                    <input type="text" value={svcForm.icon} onChange={(e) => setSvcForm({...svcForm, icon: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 mt-1 text-sm outline-none focus:border-teal-500" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Title *</label>
                  <input required type="text" value={svcForm.title} onChange={(e) => setSvcForm({...svcForm, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 mt-1 text-sm outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Description *</label>
                  <textarea required rows={3} value={svcForm.description} onChange={(e) => setSvcForm({...svcForm, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 mt-1 text-sm outline-none focus:border-teal-500" />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="text-xs font-semibold text-slate-400">Image URL(s)</label>
                    <a href="https://drive.google.com/drive/folders/1l4tMjzpPTGsXduc2Cu-kgrKqfp3JfJMQ?usp=sharing" target="_blank" className="text-[10px] text-teal-400 hover:underline">📂 เปิดโฟลเดอร์ภาพ</a>
                  </div>
                  <textarea rows={3} value={svcForm.imageUrl} onChange={(e) => setSvcForm({...svcForm, imageUrl: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Demo URL</label>
                  <input type="url" value={svcForm.demoUrl} onChange={(e) => setSvcForm({...svcForm, demoUrl: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 mt-1 text-sm outline-none focus:border-teal-500" />
                </div>
                <button disabled={isSaving} className="w-full bg-teal-500 text-slate-950 font-bold py-3 mx-auto mt-4 rounded-xl flex items-center justify-center gap-2">
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save />} บันทึก
                </button>
              </form>
            </div>
            
            <div className="xl:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[500px]">
              <div className="flex justify-between mb-6 pb-4 border-b border-slate-800">
                <h2 className="text-xl font-semibold">รายการบริการ ({services.length})</h2>
                <button onClick={fetchServices} className="text-slate-400 hover:text-white"><RefreshCw className={`w-5 h-5 ${isLoadingSvc && 'animate-spin'}`} /></button>
              </div>
              <div className="space-y-4">
                {services.map(s => (
                  <div key={s.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-teal-400">{s.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-1">{s.description}</p>
                      <p className="text-xs text-slate-500 mt-2">ID: {s.id} | Icon: {s.icon}</p>
                    </div>
                    <button onClick={() => { setSvcForm(s); setIsSvcEdit(true); setStatus({type:null,message:''}); window.scrollTo(0,0); }} className="text-sky-400 bg-sky-500/10 px-3 py-1.5 rounded-lg text-sm font-semibold">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= CONFIG TAB ================= */}
        {activeTab === 'config' && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-slate-800">ตั้งค่า Hero Section</h2>
            {renderStatus()}
            <form onSubmit={handleConfSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><h3 className="text-teal-400 font-semibold mb-2 text-sm border-b border-slate-800 pb-2">ปุ่มที่ 1 (ปุ่มหลัก)</h3></div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">ข้อความปุ่ม</label>
                  <input type="text" placeholder="e.g. ดูบริการของเรา" value={configData.hero_btn1_text} onChange={(e) => setConfigData({...configData, hero_btn1_text: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 mt-1 text-sm outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">ลิงก์ URL (หรือ #id)</label>
                  <input type="text" placeholder="e.g. #services" value={configData.hero_btn1_link} onChange={(e) => setConfigData({...configData, hero_btn1_link: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 mt-1 text-sm outline-none focus:border-teal-500" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><h3 className="text-sky-400 font-semibold mb-2 text-sm border-b border-slate-800 pb-2">ปุ่มที่ 2 (ปุ่มรอง)</h3></div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">ข้อความปุ่ม</label>
                  <input type="text" placeholder="e.g. ติดต่อสอบถาม" value={configData.hero_btn2_text} onChange={(e) => setConfigData({...configData, hero_btn2_text: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 mt-1 text-sm outline-none focus:border-sky-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">ลิงก์ URL (หรือ #id)</label>
                  <input type="text" placeholder="e.g. #contact" value={configData.hero_btn2_link} onChange={(e) => setConfigData({...configData, hero_btn2_link: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 mt-1 text-sm outline-none focus:border-sky-500" />
                </div>
              </div>

              <button disabled={isSaving} className="w-full bg-teal-500 text-slate-950 font-bold py-3 mx-auto mt-4 rounded-xl flex items-center justify-center gap-2">
                {isSaving ? <Loader2 className="animate-spin" /> : <Save />} บันทึกการตั้งค่า
              </button>
            </form>
          </div>
        )}

        {/* ================= INTEGRATIONS TAB ================= */}
        {activeTab === 'integrations' && (
          <div className="grid xl:grid-cols-12 gap-8">
            <div className="xl:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit sticky top-6">
              <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-slate-800 flex justify-between">
                <span>{isIntEdit ? 'แก้ไข Integration' : 'เพิ่ม Integration'}</span>
                {isIntEdit && <button onClick={() => { setIntForm(emptyInt); setIsIntEdit(false); }} className="text-xs px-3 py-1 bg-red-500/10 text-red-400 rounded-lg">ยกเลิก</button>}
              </h2>
              {renderStatus()}
              <form onSubmit={handleIntSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400">ID</label>
                    <input type="text" value={intForm.id} onChange={(e) => setIntForm({...intForm, id: e.target.value})} readOnly={isIntEdit} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 mt-1 text-sm outline-none disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Icon Name</label>
                    <input type="text" value={intForm.icon} onChange={(e) => setIntForm({...intForm, icon: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 mt-1 text-sm outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Title *</label>
                  <input required type="text" value={intForm.title} onChange={(e) => setIntForm({...intForm, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 mt-1 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Description *</label>
                  <textarea required rows={2} value={intForm.description} onChange={(e) => setIntForm({...intForm, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 mt-1 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Link URL</label>
                  <input type="url" value={intForm.link} onChange={(e) => setIntForm({...intForm, link: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 mt-1 text-sm outline-none" />
                </div>
                <button disabled={isSaving} className="w-full bg-teal-500 text-slate-950 font-bold py-3 mx-auto mt-4 rounded-xl flex items-center justify-center gap-2">
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save />} บันทึก
                </button>
              </form>
            </div>
            
            <div className="xl:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[500px]">
              <div className="flex justify-between mb-6 pb-4 border-b border-slate-800">
                <h2 className="text-xl font-semibold">Integrations ({integrations.length})</h2>
                <button onClick={fetchIntegrations} className="text-slate-400 hover:text-white"><RefreshCw className={`w-5 h-5 ${isLoadingInt && 'animate-spin'}`} /></button>
              </div>
              <div className="space-y-4">
                {integrations.map(int => (
                  <div key={int.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sky-400">{int.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-1">{int.description}</p>
                      <p className="text-xs text-slate-500 mt-2">ID: {int.id} | Link: {int.link}</p>
                    </div>
                    <button onClick={() => { setIntForm(int); setIsIntEdit(true); setStatus({type:null,message:''}); window.scrollTo(0,0); }} className="text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg text-sm font-semibold">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
