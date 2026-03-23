"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, Loader2, CheckCircle2, AlertCircle, LayoutDashboard, Server, 
  RefreshCw, LogOut, Settings, Link as LinkIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { convertToDirectLink } from '../../lib/utils/drive';

// ================= TYPES =================
interface ServiceData {
  id: string; title: string; description: string; icon: string; imageUrl: string; demoUrl?: string;
}
interface IntegrationData {
  id: string; title: string; description: string; imageUrl: string; tag: string; referenceUrl: string;
}
interface ConfigData {
  hero_badge: string; hero_title: string; hero_desc: string;
  hero_btn1_text: string; hero_btn1_link: string; hero_btn2_text: string; hero_btn2_link: string;
  why_badge: string; why_title: string;
  why1_title: string; why1_desc: string; why2_title: string; why2_desc: string;
  why3_title: string; why3_desc: string; why4_title: string; why4_desc: string;
  svc_badge: string; svc_title: string;
  port_badge: string; port_title: string; port_desc: string;
}

const emptySvc: ServiceData = { id: '', title: '', description: '', icon: '', imageUrl: '', demoUrl: '' };
const emptyInt: IntegrationData = { id: '', title: '', description: '', imageUrl: '', tag: '', referenceUrl: '' };
const emptyConf: ConfigData = { 
  hero_badge: 'Professional Technology Solutions', 
  hero_title: 'Transform Your Business with \nIntelligent Web & IoT Solutions', 
  hero_desc: 'Bridging the gap between digital platforms and physical hardware. We deliver seamless integration from web-based management software to smart hardware automation.', 
  hero_btn1_text: 'Explore Solutions', hero_btn1_link: '#services', 
  hero_btn2_text: 'Get a Quote', hero_btn2_link: '#contact',
  why_badge: 'WHY CHOOSE US', why_title: 'What Makes Us Different', 
  why1_title: 'Domain Expertise', why1_desc: 'Specialized professionals in full-stack web development and IoT hardware engineering.', 
  why2_title: 'Agile Delivery', why2_desc: 'Rapid deployment with flexible, on-the-fly adaptations to meet your strict deadlines.', 
  why3_title: 'Cost-Effective', why3_desc: 'Transparent pricing with high ROI on every digital innovation you receive.', 
  why4_title: 'Premium Support', why4_desc: 'Dedicated system maintenance and highly responsive technical consulting.',
  svc_badge: 'OUR SOLUTIONS', svc_title: 'Tailored Services for Your Business', 
  port_badge: 'INTEGRATIONS', port_title: 'Seamless Ecosystem Connectivity', 
  port_desc: 'Enhance your workflow flawlessly by connecting our custom-built platforms with the everyday tools you already trust.' 
};

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
      if (json.success && json.data) {
        setConfigData({
          ...emptyConf,
          ...json.data
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
      const payload = { ...intForm, imageUrl: convertToDirectLink(intForm.imageUrl), isEdit: isIntEdit };
      const res = await fetch('/api/integrations', { method: 'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'บันทึกโปรเจกต์เรียบร้อย!' });
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
    <div className={`p-4 mb-6 rounded-xl flex items-start gap-3 text-sm shadow-sm border ${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
      {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <div className="font-medium pt-0.5">{status.message}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12 font-sans selection:bg-brand-500/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-50 border border-brand-100 rounded-2xl"><LayoutDashboard className="w-8 h-8 text-brand-500" /></div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin CMS</h1>
              <p className="text-gray-500 text-sm mt-1">จัดการหน้าเว็บและบริการทั้งหมด</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl border border-red-200 font-semibold text-sm transition-colors">
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200 flex gap-6 overflow-x-auto">
          {[
            { id: 'services', label: 'บริการและผลงาน (Services)', icon: Server },
            { id: 'config', label: 'ตั้งค่าหน้าหลัก (Site Config)', icon: Settings },
            { id: 'integrations', label: 'ระบบการทำงานรวมกัน (Portfolio)', icon: LinkIcon }
          ].map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id as any); setStatus({ type: null, message: '' }); }}
              className={`flex items-center gap-2 px-4 py-3 font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === t.id ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* ================= SERVICES TAB ================= */}
        {activeTab === 'services' && (
          <div className="grid xl:grid-cols-12 gap-8">
            <div className="xl:col-span-4 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100 flex justify-between text-gray-900">
                <span>{isSvcEdit ? 'แก้ไขบริการและผลงาน' : 'เพิ่มบริการและผลงานใหม่'}</span>
                {isSvcEdit && <button type="button" onClick={() => { setSvcForm(emptySvc); setIsSvcEdit(false); }} className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">ยกเลิก</button>}
              </h2>
              {renderStatus()}
              <form onSubmit={handleSvcSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Service ID</label>
                    <input type="text" value={svcForm.id} onChange={(e) => setSvcForm({...svcForm, id: e.target.value})} readOnly={isSvcEdit} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Icon Name</label>
                    <input type="text" value={svcForm.icon} onChange={(e) => setSvcForm({...svcForm, icon: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title *</label>
                  <input required type="text" value={svcForm.title} onChange={(e) => setSvcForm({...svcForm, title: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description *</label>
                  <textarea required rows={3} value={svcForm.description} onChange={(e) => setSvcForm({...svcForm, description: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Image URL(s)</label>
                    <a href="https://drive.google.com/drive/folders/1l4tMjzpPTGsXduc2Cu-kgrKqfp3JfJMQ?usp=sharing" target="_blank" className="text-[10px] text-brand-600 font-semibold hover:underline bg-brand-50 px-2 py-0.5 rounded">📂 เปิดโฟลเดอร์ภาพ</a>
                  </div>
                  <textarea rows={3} value={svcForm.imageUrl} onChange={(e) => setSvcForm({...svcForm, imageUrl: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Demo URL</label>
                  <input type="url" value={svcForm.demoUrl} onChange={(e) => setSvcForm({...svcForm, demoUrl: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                </div>
                <button disabled={isSaving} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 mx-auto mt-6 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition-all">
                  {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />} บันทึกข้อมูลบริการและผลงาน
                </button>
              </form>
            </div>
            
            <div className="xl:col-span-8 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 min-h-[500px]">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">รายการบริการและผลงาน ({services.length})</h2>
                <button onClick={fetchServices} className="text-gray-400 hover:text-brand-500 transition-colors p-2 hover:bg-brand-50 rounded-lg"><RefreshCw className={`w-5 h-5 ${isLoadingSvc && 'animate-spin'}`} /></button>
              </div>
              <div className="space-y-4">
                {services.map(s => (
                  <div key={s.id} className="bg-gray-50 border border-gray-200 hover:border-brand-200 p-5 rounded-2xl flex justify-between items-start transition-colors group">
                    <div>
                      <h3 className="font-bold text-brand-600 text-lg mb-1 group-hover:text-brand-700">{s.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-2xl leading-relaxed">{s.description}</p>
                      <div className="flex gap-3 mt-3">
                        <span className="text-xs font-semibold bg-white border border-gray-200 text-gray-500 px-2.5 py-1 rounded-md">ID: {s.id}</span>
                        <span className="text-xs font-semibold bg-white border border-gray-200 text-gray-500 px-2.5 py-1 rounded-md">Icon: {s.icon}</span>
                      </div>
                    </div>
                    <button onClick={() => { setSvcForm(s); setIsSvcEdit(true); setStatus({type:null,message:''}); window.scrollTo(0,0); }} className="text-amber-600 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors border border-amber-200/50 ml-4 shrink-0">แก้ไข</button>
                  </div>
                ))}
                {services.length === 0 && !isLoadingSvc && (
                  <div className="text-center py-12 text-gray-400 font-medium">ยังไม่มีข้อมูลบริการและผลงาน</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= CONFIG TAB ================= */}
        {activeTab === 'config' && (
          <div className="max-w-4xl mx-auto pb-12">
            <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-100 text-gray-900">ตั้งค่าส่วนประกอบหน้าหลัก (Site Content)</h2>
            {renderStatus()}
            <form onSubmit={handleConfSubmit} className="space-y-8">
              
              {/* SECTION 1: HERO */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                <h3 className="text-lg font-bold mb-6 text-brand-600 border-b border-gray-100 pb-3">1. ส่วนหน้าหลัก (Hero Section)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ป้ายกำกับบนสุด (Badge)</label>
                    <input type="text" value={configData.hero_badge} onChange={e=>setConfigData({...configData, hero_badge: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">พาดหัวหลัก (Headline)</label>
                    <textarea rows={2} value={configData.hero_title} onChange={e=>setConfigData({...configData, hero_title: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">คำอธิบาย (Sub-headline)</label>
                    <textarea rows={2} value={configData.hero_desc} onChange={e=>setConfigData({...configData, hero_desc: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mt-6 bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <div className="col-span-2 text-sm font-bold text-gray-700">📌 ปุ่มหลัก (สีส้ม)</div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ข้อความเป้าหมาย</label><input type="text" value={configData.hero_btn1_text} onChange={e=>setConfigData({...configData, hero_btn1_text: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none py-2 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ลิงก์ URL</label><input type="text" value={configData.hero_btn1_link} onChange={e=>setConfigData({...configData, hero_btn1_link: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none py-2 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" /></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <div className="col-span-2 text-sm font-bold text-gray-700">📌 ปุ่มรอง (สีขาว)</div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ข้อความเป้าหมาย</label><input type="text" value={configData.hero_btn2_text} onChange={e=>setConfigData({...configData, hero_btn2_text: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none py-2 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ลิงก์ URL</label><input type="text" value={configData.hero_btn2_link} onChange={e=>setConfigData({...configData, hero_btn2_link: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none py-2 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" /></div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: WHY CHOOSE US */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                 <h3 className="text-lg font-bold mb-6 text-brand-600 border-b border-gray-100 pb-3">2. ทำไมถึงเลือกเรา (Why Choose Us)</h3>
                 <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ป้ายกำกับ (Badge)</label><input type="text" value={configData.why_badge} onChange={e=>setConfigData({...configData, why_badge: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">หัวข้อ (Title)</label><input type="text" value={configData.why_title} onChange={e=>setConfigData({...configData, why_title: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" /></div>
                 </div>
                 <div className="space-y-4">
                    {[1,2,3,4].map((i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 grid md:grid-cols-3 gap-4">
                            <div className="md:col-span-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ข้อที่ {i} - ชื่อจุดขาย</label><input type="text" value={(configData as any)[`why${i}_title`]} onChange={e=>setConfigData({...configData, [`why${i}_title`]: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                            <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ข้อที่ {i} - คำอธิบายสั้นๆ</label><input type="text" value={(configData as any)[`why${i}_desc`]} onChange={e=>setConfigData({...configData, [`why${i}_desc`]: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                        </div>
                    ))}
                 </div>
              </div>

              {/* SECTION 3 & 4 */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden space-y-4">
                   <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                   <h3 className="text-lg font-bold mb-4 text-brand-600 border-b border-gray-100 pb-3">3. บริการ (Services)</h3>
                   <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ป้ายกำกับ (Badge)</label><input type="text" value={configData.svc_badge} onChange={e=>setConfigData({...configData, svc_badge: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                   <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">หัวข้อสรุป (Title)</label><input type="text" value={configData.svc_title} onChange={e=>setConfigData({...configData, svc_title: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden space-y-4">
                   <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                   <h3 className="text-lg font-bold mb-4 text-brand-600 border-b border-gray-100 pb-3">4. ระบบเชื่อมต่อ (Integrations)</h3>
                   <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ป้ายกำกับ (Badge)</label><input type="text" value={configData.port_badge} onChange={e=>setConfigData({...configData, port_badge: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                   <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">หัวข้อสรุป (Title)</label><input type="text" value={configData.port_title} onChange={e=>setConfigData({...configData, port_title: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                   <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">คำอธิบาย</label><textarea rows={2} value={configData.port_desc} onChange={e=>setConfigData({...configData, port_desc: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                </div>
              </div>

              <div className="sticky bottom-6 z-[100]">
                 <button disabled={isSaving} className="w-full shadow-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(255,107,0,0.3)] transition-all text-lg">
                   {isSaving ? <Loader2 className="animate-spin w-6 h-6" /> : <Save className="w-6 h-6"/>} บันทึกการตั้งค่าหน้าเว็บทั้งหมด
                 </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= INTEGRATIONS (PORTFOLIO) TAB ================= */}
        {activeTab === 'integrations' && (
          <div className="grid xl:grid-cols-12 gap-8">
            <div className="xl:col-span-4 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100 flex justify-between text-gray-900">
                <span>{isIntEdit ? 'แก้ไขระบบการทำงาน' : 'เพิ่มระบบการทำงานใหม่'}</span>
                {isIntEdit && <button type="button" onClick={() => { setIntForm(emptyInt); setIsIntEdit(false); }} className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">ยกเลิก</button>}
              </h2>
              {renderStatus()}
              <form onSubmit={handleIntSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">PROJECT ID</label>
                    <input type="text" value={intForm.id} onChange={(e) => setIntForm({...intForm, id: e.target.value})} readOnly={isIntEdit} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">TAG NAME</label>
                    <input type="text" value={intForm.tag} onChange={(e) => setIntForm({...intForm, tag: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">TITLE *</label>
                  <input required type="text" value={intForm.title} onChange={(e) => setIntForm({...intForm, title: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">DESCRIPTION *</label>
                  <textarea required rows={3} value={intForm.description} onChange={(e) => setIntForm({...intForm, description: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">IMAGE URL(S)</label>
                    <a href="https://drive.google.com/drive/folders/1l4tMjzpPTGsXduc2Cu-kgrKqfp3JfJMQ?usp=sharing" target="_blank" className="text-[10px] text-brand-600 font-semibold hover:underline bg-brand-50 px-2 py-0.5 rounded">📂 เปิดโฟลเดอร์ภาพ</a>
                  </div>
                  <textarea rows={3} value={intForm.imageUrl} onChange={(e) => setIntForm({...intForm, imageUrl: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">REFERENCE URL</label>
                  <input type="url" placeholder="e.g. https://github.com/..." value={intForm.referenceUrl || ''} onChange={(e) => setIntForm({...intForm, referenceUrl: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                </div>
                <button disabled={isSaving} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 mx-auto mt-6 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition-all">
                  {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />} บันทึกข้อมูลระบบการทำงาน
                </button>
              </form>
            </div>
            
            <div className="xl:col-span-8 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 min-h-[500px]">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">รายการระบบการทำงาน ({integrations.length})</h2>
                <button onClick={fetchIntegrations} className="text-gray-400 hover:text-brand-500 transition-colors p-2 hover:bg-brand-50 rounded-lg"><RefreshCw className={`w-5 h-5 ${isLoadingInt && 'animate-spin'}`} /></button>
              </div>
              <div className="space-y-4">
                {integrations.map(int => (
                  <div key={int.id} className="bg-gray-50 border border-gray-200 hover:border-brand-200 p-5 rounded-2xl flex justify-between items-start transition-colors group">
                    <div>
                      <h3 className="font-bold text-brand-600 text-lg mb-1 group-hover:text-brand-700">{int.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-2xl leading-relaxed mt-2">{int.description}</p>
                      <div className="flex gap-3 mt-3">
                        <span className="text-xs font-semibold bg-white border border-gray-200 text-gray-500 px-2.5 py-1 rounded-md">ID: {int.id}</span>
                        <span className="text-xs font-semibold bg-white border border-gray-200 text-gray-500 px-2.5 py-1 rounded-md">Tag: {int.tag}</span>
                      </div>
                    </div>
                    <button onClick={() => { setIntForm(int); setIsIntEdit(true); setStatus({type:null,message:''}); window.scrollTo(0,0); }} className="text-amber-600 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors border border-amber-200/50 ml-4 shrink-0">แก้ไข</button>
                  </div>
                ))}
                {integrations.length === 0 && !isLoadingInt && (
                  <div className="text-center py-12 text-gray-400 font-medium">ยังไม่มีข้อมูลระบบการทำงาน</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
