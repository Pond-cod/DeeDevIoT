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
  id: string; title: string; description: string; title_th?: string; description_th?: string; icon: string; imageUrl: string; demoUrl?: string;
}
interface IntegrationData {
  id: string; title: string; description: string; title_th?: string; description_th?: string; imageUrl: string; tag: string; referenceUrl: string;
}
interface ConfigData {
  hero_badge_en: string; hero_badge_th: string;
  hero_headline_en: string; hero_headline_th: string;
  hero_sub_en: string; hero_sub_th: string;
  hero_btn1_text_en: string; hero_btn1_text_th: string;
  hero_btn1_link: string; 
  hero_btn2_text_en: string; hero_btn2_text_th: string;
  hero_btn2_link: string; 
  why_badge_en: string; why_badge_th: string;
  why_choose_title_en: string; why_choose_title_th: string;
  why1_title_en: string; why1_title_th: string;
  why1_desc_en: string; why1_desc_th: string;
  why2_title_en: string; why2_title_th: string;
  why2_desc_en: string; why2_desc_th: string;
  why3_title_en: string; why3_title_th: string;
  why3_desc_en: string; why3_desc_th: string;
  why4_title_en: string; why4_title_th: string;
  why4_desc_en: string; why4_desc_th: string;
  svc_badge_en: string; svc_badge_th: string;
  solutions_title_en: string; solutions_title_th: string;
  port_badge_en: string; port_badge_th: string;
  integrations_title_en: string; integrations_title_th: string;
  port_desc_en: string; port_desc_th: string;
  cta_heading_en: string; cta_heading_th: string;
  footer_bio_en: string; footer_bio_th: string;
  facebook_url: string;
  concept_title1_en: string; concept_title1_th: string;
  concept_title2_en: string; concept_title2_th: string;
  concept_description_en: string; concept_description_th: string;
  concept_c1t_en: string; concept_c1t_th: string;
  concept_c1d_en: string; concept_c1d_th: string;
  concept_c2t_en: string; concept_c2t_th: string;
  concept_c2d_en: string; concept_c2d_th: string;
  concept_c3t_en: string; concept_c3t_th: string;
  concept_c3d_en: string; concept_c3d_th: string;
  contact_title_en: string; contact_title_th: string;
  contact_description_en: string; contact_description_th: string;
  contact_email: string;
  contact_phone: string;
  contact_facebook_en: string; contact_facebook_th: string;
  contact_line: string;
}

const emptySvc: ServiceData = { id: '', title: '', description: '', title_th: '', description_th: '', icon: '', imageUrl: '', demoUrl: '' };
const emptyInt: IntegrationData = { id: '', title: '', description: '', title_th: '', description_th: '', imageUrl: '', tag: '', referenceUrl: '' };
const emptyConf: ConfigData = { 
  hero_badge_en: 'Professional Technology Solutions', hero_badge_th: 'พรีเมียมเทคโนโลยีโซลูชัน',
  hero_headline_en: 'Transform Your Business with \nIntelligent Web & IoT Solutions', hero_headline_th: 'ยกระดับธุรกิจของคุณด้วย โซลูชัน Web App & IoT อัจฉริยะ',
  hero_sub_en: 'Bridging the gap between digital platforms and physical hardware. We deliver seamless integration from web-based management software to smart hardware automation.', hero_sub_th: 'จากซอฟต์แวร์จัดการบนเว็บ สู่การควบคุมบอร์ด Arduino/ESP32 ไร้รอยต่อ',
  hero_btn1_text_en: 'Explore Solutions', hero_btn1_text_th: 'ดูโซลูชันของเรา',
  hero_btn1_link: '#services', 
  hero_btn2_text_en: 'Get a Quote', hero_btn2_text_th: 'ขอใบเสนอราคา',
  hero_btn2_link: '#contact',
  why_badge_en: 'WHY CHOOSE US', why_badge_th: 'ทำไมถึงต้องเลือกเรา',
  why_choose_title_en: 'What Makes Us Different', why_choose_title_th: 'ความแตกต่างที่ทำให้เราโดดเด่น',
  why1_title_en: 'Domain Expertise', why1_title_th: 'ความเชี่ยวชาญเฉพาะด้าน',
  why1_desc_en: 'Specialized professionals in full-stack web development and IoT hardware engineering.', why1_desc_th: 'ทีมงานมืออาชีพที่มีความเชี่ยวชาญทั้งด้าน Web Development และ IoT Hardware',
  why2_title_en: 'Agile Delivery', why2_title_th: 'การส่งมอบที่รวดเร็ว',
  why2_desc_en: 'Rapid deployment with flexible, on-the-fly adaptations to meet your strict deadlines.', why2_desc_th: 'พัฒนาและส่งมอบงานได้อย่างรวดเร็ว พร้อมยืดหยุ่นปรับเปลี่ยนตามความต้องการ',
  why3_title_en: 'Cost-Effective', why3_title_th: 'คุ้มค่าการลงทุน',
  why3_desc_en: 'Transparent pricing with high ROI on every digital innovation you receive.', why3_desc_th: 'ราคาโปร่งใส ให้ผลตอบแทนคุ้มค่าในทุกนวัตกรรมดิจิทัลที่คุณได้รับ',
  why4_title_en: 'Premium Support', why4_title_th: 'บริการดูแลหลังการขาย',
  why4_desc_en: 'Dedicated system maintenance and highly responsive technical consulting.', why4_desc_th: 'ดูแลรักษาระบบอย่างใกล้ชิด พร้อมให้คำปรึกษาทางเทคนิคอย่างรวดเร็ว',
  svc_badge_en: 'OUR SOLUTIONS', svc_badge_th: 'โซลูชันของเรา',
  solutions_title_en: 'Tailored Services for Your Business', solutions_title_th: 'บริการที่ออกแบบมาเพื่อธุรกิจคุณโดยเฉพาะ',
  port_badge_en: 'INTEGRATIONS', port_badge_th: 'ผลงานของเรา',
  integrations_title_en: 'Seamless Ecosystem Connectivity', integrations_title_th: 'ทำงานร่วมกับแพลตฟอร์มอื่นอย่างไร้รอยต่อ',
  port_desc_en: 'Enhance your workflow flawlessly by connecting our custom-built platforms with the everyday tools you already trust.', port_desc_th: 'เพิ่มประสิทธิภาพการทำงานด้วยการเชื่อมต่อแพลตฟอร์มของเรากับเครื่องมือที่คุณคุ้นเคย',
  cta_heading_en: 'Ready to Start Your Next Big Project?', cta_heading_th: 'พร้อมเริ่มพัฒนาโปรเจกต์ของคุณแล้วหรือยัง?',
  footer_bio_en: 'Your trusted tech partner in turning innovative ideas into powerful, real-world Web & Hardware platforms.', footer_bio_th: 'พาร์ทเนอร์ที่พร้อมสานต่อไอเดียของคุณให้กลายเป็นแพลตฟอร์มที่ใช้งานได้จริง',
  facebook_url: 'https://facebook.com/deedeviot',
  concept_title1_en: 'SMART', concept_title1_th: 'สมาร์ท',
  concept_title2_en: 'GEARING', concept_title2_th: 'เกียร์ริ่ง',
  concept_description_en: 'Our systems work in harmony like precision-engineered gears.', concept_description_th: 'ระบบของเราทำงานร่วมกันอย่างสมบูรณ์แบบ เหมือนฟันเฟืองที่ผ่านการวิศวกรรมมาอย่างแม่นยำ',
  concept_c1t_en: 'Precision Eng.', concept_c1t_th: 'ความแม่นยำสูง',
  concept_c1d_en: 'Every line of code and IoT component is designed for perfect harmony.', concept_c1d_th: 'ทุกบรรทัดของโค้ดและส่วนประกอบ IoT ถูกออกแบบมาเพื่อความสอดคล้องที่ลงตัว',
  concept_c2t_en: 'High Velocity', concept_c2t_th: 'ความเร็วสูงสุด',
  concept_c2d_en: 'Accelerate your business with high-performance systems.', concept_c2d_th: 'เร่งสปีดธุรกิจของคุณด้วยระบบที่มีประสิทธิภาพและรวดเร็ว',
  concept_c3t_en: 'Steady Growth', concept_c3t_th: 'การเติบโตที่มั่นคง',
  concept_c3d_en: 'Reliable tech that ensures your business thrives consistently.', concept_c3d_th: 'เทคโนโลยีที่เชื่อถือได้ เพื่อให้มั่นใจว่าธุรกิจของคุณจะเติบโตอย่างต่อเนื่อง',
  contact_title_en: 'READY TO POWER UP?', contact_title_th: 'พร้อมที่จะขับเคลื่อนไปข้างหน้าหรือยัง?',
  contact_description_en: 'Our gears are ready. Let us power your success.', contact_description_th: 'ฟันเฟืองของเราพร้อมแล้ว ให้เราเป็นส่วนหนึ่งในความสำเร็จของคุณ',
  contact_email: 'hello@deedeviot.com',
  contact_phone: '02-123-4567',
  contact_facebook_en: 'DeeDevIOT Page', contact_facebook_th: 'เพจ DeeDevIOT',
  contact_line: '@DEEDEVIOT'
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title (EN) *</label>
                    <input required type="text" value={svcForm.title} onChange={(e) => setSvcForm({...svcForm, title: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title (TH)</label>
                    <input type="text" value={svcForm.title_th} onChange={(e) => setSvcForm({...svcForm, title_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-thai" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description (EN) *</label>
                    <textarea required rows={3} value={svcForm.description} onChange={(e) => setSvcForm({...svcForm, description: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description (TH)</label>
                    <textarea rows={3} value={svcForm.description_th} onChange={(e) => setSvcForm({...svcForm, description_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-thai" />
                  </div>
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
                      <h3 className="font-bold text-brand-600 text-lg mb-1 group-hover:text-brand-700">{s.title} {s.title_th && <span className="text-gray-400 font-normal">/ {s.title_th}</span>}</h3>
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
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ป้ายกำกับบนสุด (Badge EN)</label>
                      <input type="text" value={configData.hero_badge_en} onChange={e=>setConfigData({...configData, hero_badge_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ป้ายกำกับบนสุด (Badge TH)</label>
                      <input type="text" value={configData.hero_badge_th} onChange={e=>setConfigData({...configData, hero_badge_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">พาดหัวหลัก (Headline EN)</label>
                      <textarea rows={2} value={configData.hero_headline_en} onChange={e=>setConfigData({...configData, hero_headline_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">พาดหัวหลัก (Headline TH)</label>
                      <textarea rows={2} value={configData.hero_headline_th} onChange={e=>setConfigData({...configData, hero_headline_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-thai" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">คำอธิบาย (Sub-headline EN)</label>
                      <textarea rows={2} value={configData.hero_sub_en} onChange={e=>setConfigData({...configData, hero_sub_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">คำอธิบาย (Sub-headline TH)</label>
                      <textarea rows={2} value={configData.hero_sub_th} onChange={e=>setConfigData({...configData, hero_sub_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-thai" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 mt-6 bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <div className="col-span-3 text-sm font-bold text-gray-700">📌 ปุ่มหลัก (สีหลัก)</div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ข้อความเป้าหมาย (EN)</label><input type="text" value={configData.hero_btn1_text_en} onChange={e=>setConfigData({...configData, hero_btn1_text_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ข้อความเป้าหมาย (TH)</label><input type="text" value={configData.hero_btn1_text_th} onChange={e=>setConfigData({...configData, hero_btn1_text_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ลิงก์ URL</label><input type="text" value={configData.hero_btn1_link} onChange={e=>setConfigData({...configData, hero_btn1_link: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <div className="col-span-3 text-sm font-bold text-gray-700">📌 ปุ่มรอง (สีรอง)</div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ข้อความเป้าหมาย (EN)</label><input type="text" value={configData.hero_btn2_text_en} onChange={e=>setConfigData({...configData, hero_btn2_text_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ข้อความเป้าหมาย (TH)</label><input type="text" value={configData.hero_btn2_text_th} onChange={e=>setConfigData({...configData, hero_btn2_text_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ลิงก์ URL</label><input type="text" value={configData.hero_btn2_link} onChange={e=>setConfigData({...configData, hero_btn2_link: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: CONCEPT (GEARING) */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                 <h3 className="text-lg font-bold mb-6 text-brand-600 border-b border-gray-100 pb-3">2. แนวคิดของแบรนด์ (Brand Concept - Gearing)</h3>
                 <div className="grid md:grid-cols-2 gap-4 mb-6">
                     <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">หัวข้อ (Title EN)</label><input type="text" value={configData.concept_title1_en} onChange={e=>setConfigData({...configData, concept_title1_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-bold" /></div>
                     <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">หัวข้อ (Title TH)</label><input type="text" value={configData.concept_title1_th} onChange={e=>setConfigData({...configData, concept_title1_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai font-bold" /></div>
                 </div>
                 <div className="grid md:grid-cols-2 gap-4 mb-6">
                     <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">หัวข้อรอง (Subtitle EN)</label><input type="text" value={configData.concept_title2_en} onChange={e=>setConfigData({...configData, concept_title2_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-bold text-brand-500" /></div>
                     <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">หัวข้อรอง (Subtitle TH)</label><input type="text" value={configData.concept_title2_th} onChange={e=>setConfigData({...configData, concept_title2_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai font-bold text-brand-500" /></div>
                 </div>
                 <div className="grid md:grid-cols-2 gap-4 mb-8 pb-8 border-b border-gray-100">
                     <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">คำอธิบายรวม (Description EN)</label><textarea rows={2} value={configData.concept_description_en} onChange={e=>setConfigData({...configData, concept_description_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                     <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">คำอธิบายรวม (Description TH)</label><textarea rows={2} value={configData.concept_description_th} onChange={e=>setConfigData({...configData, concept_description_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" /></div>
                 </div>

                 <div className="space-y-4">
                     <div className="font-bold text-sm text-gray-400 mb-2">📌 การนำเสนอรูปประโยคแบบฟันเฟือง (Gearing Cards - 3 items)</div>
                     {[1,2,3].map((i) => (
                        <div key={`c${i}`} className="bg-brand-50/50 p-4 rounded-xl border border-brand-100/50 grid md:grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-brand-600 uppercase tracking-wider">Card {i} - Title (EN)</label><input type="text" value={(configData as any)[`concept_c${i}t_en`]} onChange={e=>setConfigData({...configData, [`concept_c${i}t_en`]: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                            <div><label className="text-xs font-bold text-brand-600 uppercase tracking-wider">Card {i} - Title (TH)</label><input type="text" value={(configData as any)[`concept_c${i}t_th`]} onChange={e=>setConfigData({...configData, [`concept_c${i}t_th`]: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" /></div>
                            <div><label className="text-xs font-bold text-brand-600 uppercase tracking-wider">Card {i} - Desc (EN)</label><input type="text" value={(configData as any)[`concept_c${i}d_en`]} onChange={e=>setConfigData({...configData, [`concept_c${i}d_en`]: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                            <div><label className="text-xs font-bold text-brand-600 uppercase tracking-wider">Card {i} - Desc (TH)</label><input type="text" value={(configData as any)[`concept_c${i}d_th`]} onChange={e=>setConfigData({...configData, [`concept_c${i}d_th`]: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" /></div>
                        </div>
                     ))}

                     <div className="mt-8 pt-8 border-t border-gray-100 font-bold text-sm text-gray-400 mb-2">📌 ทำไมถึงเลือกเรา (Why Choose Us - Optional fields used in some sections)</div>
                     {[1,2,3,4].map((i) => (
                         <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 grid md:grid-cols-2 gap-4 opacity-70">
                             <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Item {i} - Title (EN)</label><input type="text" value={(configData as any)[`why${i}_title_en`]} onChange={e=>setConfigData({...configData, [`why${i}_title_en`]: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                             <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Item {i} - Title (TH)</label><input type="text" value={(configData as any)[`why${i}_title_th`]} onChange={e=>setConfigData({...configData, [`why${i}_title_th`]: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" /></div>
                             <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Item {i} - Desc (EN)</label><input type="text" value={(configData as any)[`why${i}_desc_en`]} onChange={e=>setConfigData({...configData, [`why${i}_desc_en`]: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                             <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Item {i} - Desc (TH)</label><input type="text" value={(configData as any)[`why${i}_desc_th`]} onChange={e=>setConfigData({...configData, [`why${i}_desc_th`]: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" /></div>
                         </div>
                     ))}
                  </div>
              </div>

              {/* SECTION 3 & 4 */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden space-y-4">
                   <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                   <h3 className="text-lg font-bold mb-4 text-brand-600 border-b border-gray-100 pb-3">3. บริการ (Services)</h3>
                   <div className="grid md:grid-cols-2 gap-4">
                       <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ป้ายกำกับ (Badge EN)</label><input type="text" value={configData.svc_badge_en} onChange={e=>setConfigData({...configData, svc_badge_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                       <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ป้ายกำกับ (Badge TH)</label><input type="text" value={configData.svc_badge_th} onChange={e=>setConfigData({...configData, svc_badge_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" /></div>
                   </div>
                   <div className="grid md:grid-cols-2 gap-4 mt-4">
                       <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">หัวข้อสรุป (Title EN)</label><input type="text" value={configData.solutions_title_en} onChange={e=>setConfigData({...configData, solutions_title_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                       <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">หัวข้อสรุป (Title TH)</label><input type="text" value={configData.solutions_title_th} onChange={e=>setConfigData({...configData, solutions_title_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" /></div>
                   </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden space-y-4">
                   <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                   <h3 className="text-lg font-bold mb-4 text-brand-600 border-b border-gray-100 pb-3">4. ระบบเชื่อมต่อ (Integrations)</h3>
                   <div className="grid md:grid-cols-2 gap-4">
                       <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ป้ายกำกับ (Badge EN)</label><input type="text" value={configData.port_badge_en} onChange={e=>setConfigData({...configData, port_badge_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                       <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ป้ายกำกับ (Badge TH)</label><input type="text" value={configData.port_badge_th} onChange={e=>setConfigData({...configData, port_badge_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" /></div>
                   </div>
                   <div className="grid md:grid-cols-2 gap-4">
                       <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">หัวข้อสรุป (Title EN)</label><input type="text" value={configData.integrations_title_en} onChange={e=>setConfigData({...configData, integrations_title_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                       <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">หัวข้อสรุป (Title TH)</label><input type="text" value={configData.integrations_title_th} onChange={e=>setConfigData({...configData, integrations_title_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" /></div>
                   </div>
                   <div className="grid md:grid-cols-2 gap-4">
                       <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">คำอธิบาย (EN)</label><textarea rows={2} value={configData.port_desc_en} onChange={e=>setConfigData({...configData, port_desc_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                       <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">คำอธิบาย (TH)</label><textarea rows={2} value={configData.port_desc_th} onChange={e=>setConfigData({...configData, port_desc_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" /></div>
                   </div>
                </div>
              </div>

               {/* SECTION 5: CONTACT & FOOTER BIO */}
               <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden space-y-4">
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                  <h3 className="text-lg font-bold mb-4 text-brand-600 border-b border-gray-100 pb-3">5. ติดต่อเรา และ Footer Bio</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Title (EN)</label><input type="text" value={configData.contact_title_en} onChange={e=>setConfigData({...configData, contact_title_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Title (TH)</label><input type="text" value={configData.contact_title_th} onChange={e=>setConfigData({...configData, contact_title_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" /></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Desc (EN)</label><textarea rows={2} value={configData.contact_description_en} onChange={e=>setConfigData({...configData, contact_description_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Desc (TH)</label><textarea rows={2} value={configData.contact_description_th} onChange={e=>setConfigData({...configData, contact_description_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" /></div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">📌 Contact Details & Social</div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label><input type="text" value={configData.contact_email} onChange={e=>setConfigData({...configData, contact_email: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label><input type="text" value={configData.contact_phone} onChange={e=>setConfigData({...configData, contact_phone: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Facebook UI Text (EN)</label><input type="text" value={configData.contact_facebook_en} onChange={e=>setConfigData({...configData, contact_facebook_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Facebook UI Text (TH)</label><input type="text" value={configData.contact_facebook_th} onChange={e=>setConfigData({...configData, contact_facebook_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 font-thai" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Line ID</label><input type="text" value={configData.contact_line} onChange={e=>setConfigData({...configData, contact_line: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Facebook Page URL</label><input type="text" value={configData.facebook_url} onChange={e=>setConfigData({...configData, facebook_url: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500" /></div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">CTA Footer Title (EN)</label><input type="text" value={configData.cta_heading_en} onChange={e=>setConfigData({...configData, cta_heading_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">CTA Footer Title (TH)</label><input type="text" value={configData.cta_heading_th} onChange={e=>setConfigData({...configData, cta_heading_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 font-thai" /></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Footer Bio (EN)</label><textarea rows={2} value={configData.footer_bio_en} onChange={e=>setConfigData({...configData, footer_bio_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Footer Bio (TH)</label><textarea rows={2} value={configData.footer_bio_th} onChange={e=>setConfigData({...configData, footer_bio_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 font-thai" /></div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">TITLE (EN) *</label>
                    <input required type="text" value={intForm.title} onChange={(e) => setIntForm({...intForm, title: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">TITLE (TH)</label>
                    <input type="text" value={intForm.title_th} onChange={(e) => setIntForm({...intForm, title_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-thai" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">DESCRIPTION (EN) *</label>
                    <textarea required rows={3} value={intForm.description} onChange={(e) => setIntForm({...intForm, description: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">DESCRIPTION (TH)</label>
                    <textarea rows={3} value={intForm.description_th} onChange={(e) => setIntForm({...intForm, description_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-thai" />
                  </div>
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
                      <h3 className="font-bold text-brand-600 text-lg mb-1 group-hover:text-brand-700">{int.title} {int.title_th && <span className="text-gray-400 font-normal">/ {int.title_th}</span>}</h3>
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
