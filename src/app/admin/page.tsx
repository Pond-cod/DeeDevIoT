"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, Loader2, CheckCircle2, AlertCircle, LayoutDashboard, Server, 
  RefreshCw, LogOut, Settings, Link as LinkIcon, Trash2, Search,
  Menu as MenuIcon, X, Type, Zap, Lightbulb, Star, Phone, Globe, ChevronRight, Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { convertToDirectLink } from '../../lib/utils/drive';

// ================= TYPES =================
interface ServiceData {
  id: string; title: string; description: string; title_th?: string; description_th?: string; icon: string; imageUrl: string; demoUrl?: string; videoUrls?: string;
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
  svc_badge_en: string; svc_badge_th: string;
  solutions_title_en: string; solutions_title_th: string;
  solutions_description_en: string; solutions_description_th: string;
  port_badge_en: string; port_badge_th: string;
  integrations_title_en: string; integrations_title_th: string;
  port_desc_en: string; port_desc_th: string;
  cta_heading_en: string; cta_heading_th: string;
  footer_bio_en: string; footer_bio_th: string;
  facebook_url: string;
  contact_title_en: string; contact_title_th: string;
  contact_description_en: string; contact_description_th: string;
  contact_email: string;
  contact_phone: string;
  contact_facebook_en: string; contact_facebook_th: string;
  contact_line: string;
  nav_btn_en: string; nav_btn_th: string;
  back_btn_en: string; back_btn_th: string;
}

interface NavData { id: string; label_en: string; label_th: string; href: string; }
interface ConceptData { id: string; title_en: string; title_th: string; desc_en: string; desc_th: string; icon: string; }
interface SectionData { id: string; title_en: string; title_th: string; subtitle_en: string; subtitle_th: string; is_active: string; }
interface SectionItemData { id: string; section_id: string; title_en: string; title_th: string; desc_en: string; desc_th: string; icon: string; imageUrl: string; }

const emptySvc: ServiceData = { id: '', title: '', description: '', title_th: '', description_th: '', icon: '', imageUrl: '', demoUrl: '', videoUrls: '' };
const emptyInt: IntegrationData = { id: '', title: '', description: '', title_th: '', description_th: '', imageUrl: '', tag: '', referenceUrl: '' };
const emptyConf: ConfigData = { 
  hero_badge_en: '', hero_badge_th: '',
  hero_headline_en: '', hero_headline_th: '',
  hero_sub_en: '', hero_sub_th: '',
  hero_btn1_text_en: '', hero_btn1_text_th: '',
  hero_btn1_link: '', 
  hero_btn2_text_en: '', hero_btn2_text_th: '',
  hero_btn2_link: '', 
  svc_badge_en: '', svc_badge_th: '',
  solutions_title_en: '', solutions_title_th: '',
  solutions_description_en: '', solutions_description_th: '',
  port_badge_en: '', port_badge_th: '',
  integrations_title_en: '', integrations_title_th: '',
  port_desc_en: '', port_desc_th: '',
  cta_heading_en: '', cta_heading_th: '',
  footer_bio_en: '', footer_bio_th: '',
  facebook_url: '',
  contact_title_en: '', contact_title_th: '',
  contact_description_en: '', contact_description_th: '',
  contact_email: '',
  contact_phone: '',
  contact_facebook_en: '', contact_facebook_th: '',
  contact_line: '',
  nav_btn_en: '', nav_btn_th: '',
  back_btn_en: '', back_btn_th: '',
};

const emptyNav: NavData = { id: '', label_en: '', label_th: '', href: '' };
const emptyConcept: ConceptData = { id: '', title_en: '', title_th: '', desc_en: '', desc_th: '', icon: '' };
const emptySection: SectionData = { id: '', title_en: '', title_th: '', subtitle_en: '', subtitle_th: '', is_active: 'TRUE' };
const emptySectionItem: SectionItemData = { id: '', section_id: '', title_en: '', title_th: '', desc_en: '', desc_th: '', icon: '', imageUrl: '' };

export default function AdminDashboard() {
  const router = useRouter();
  
  const MENU_ITEMS = [
    { id: 'dashboard', label: 'ภาพรวมระบบ (Overview)', icon: LayoutDashboard },
    { id: 'services', label: 'บริการและผลงาน (Services)', icon: Server },
    { id: 'integrations', label: 'ระบบการทำงาน (Portfolio)', icon: LinkIcon },
    { divider: true },
    { id: 'nav', label: 'เมนูและส่วนหัว (Header)', icon: Type },
    { id: 'hero', label: 'ส่วนหลัก (Hero Section)', icon: Zap },
    { id: 'concept', label: 'คอนเซปต์ (Concept)', icon: Lightbulb },
    { id: 'sections', label: 'ส่วนเสริม (Site Sections)', icon: Settings },
    { id: 'titles', label: 'หัวข้อเนื้อหา (Site Titles)', icon: Star },
    { id: 'contact', label: 'ข้อมูลติดต่อ (Contact)', icon: Phone },
    { id: 'footer', label: 'ฟุตเตอร์ (Footer)', icon: Globe },
  ];
  // Shared State
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Services State
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isLoadingSvc, setIsLoadingSvc] = useState(false);
  const [svcForm, setSvcForm] = useState<ServiceData>(emptySvc);
  const [isSvcEdit, setIsSvcEdit] = useState(false);
  const [svcImageUrls, setSvcImageUrls] = useState<string[]>(['']);
  const [svcVideoUrls, setSvcVideoUrls] = useState<string[]>(['']);

  // Integrations State
  const [integrations, setIntegrations] = useState<IntegrationData[]>([]);
  const [isLoadingInt, setIsLoadingInt] = useState(false);
  const [intForm, setIntForm] = useState<IntegrationData>(emptyInt);
  const [isIntEdit, setIsIntEdit] = useState(false);

  // Config State
  const [configData, setConfigData] = useState<ConfigData>(emptyConf);
  const [isLoadingConf, setIsLoadingConf] = useState(false);

  // Search State
  const [svcSearch, setSvcSearch] = useState('');
  const [intSearch, setIntSearch] = useState('');

  // Nav Dynamic State
  const [navItems, setNavItems] = useState<NavData[]>([]);
  const [navForm, setNavForm] = useState<NavData>(emptyNav);
  const [isNavEdit, setIsNavEdit] = useState(false);

  // Concept Dynamic State
  const [concepts, setConcepts] = useState<ConceptData[]>([]);
  const [conceptForm, setConceptForm] = useState<ConceptData>(emptyConcept);
  const [isConceptEdit, setIsConceptEdit] = useState(false);

  // Sections Dynamic State
  const [sections, setSections] = useState<SectionData[]>([]);
  const [sectionForm, setSectionForm] = useState<SectionData>(emptySection);
  const [isSectionEdit, setIsSectionEdit] = useState(false);

  // Section Items Dynamic State
  const [sectionItems, setSectionItems] = useState<SectionItemData[]>([]);
  const [sectionItemForm, setSectionItemForm] = useState<SectionItemData>(emptySectionItem);
  const [isSectionItemEdit, setIsSectionItemEdit] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

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
        setConfigData({ ...emptyConf, ...json.data });
      }
    } catch { } finally { setIsLoadingConf(false); }
  };

  const fetchNav = async () => {
    try {
      const res = await fetch('/api/nav', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) setNavItems(json.data);
    } catch { }
  };

  const fetchConcepts = async () => {
    try {
      const res = await fetch('/api/concept', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) setConcepts(json.data);
    } catch { }
  };

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/sections', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) setSections(json.data);
    } catch { }
  };

  const fetchSectionItems = async () => {
    try {
      const res = await fetch('/api/section-items', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) setSectionItems(json.data);
    } catch { }
  };

  useEffect(() => {
    fetchServices();
    fetchIntegrations();
    fetchConfig();
    fetchNav();
    fetchConcepts();
    fetchSections();
    fetchSectionItems();
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
      const imageUrl = svcImageUrls.filter(u => u.trim()).map(u => convertToDirectLink(u.trim())).join(',');
      const videoUrls = svcVideoUrls.filter(u => u.trim()).join(',');
      const payload = { ...svcForm, imageUrl, videoUrls, isEdit: isSvcEdit };
      const res = await fetch('/api/services', { method: 'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'บันทึกบริการเรียบร้อย!' });
        setSvcForm(emptySvc); setIsSvcEdit(false);
        setSvcImageUrls(['']); setSvcVideoUrls(['']);
        fetchServices();
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
      if (data.success) {
        setStatus({ type: 'success', message: 'บันทึกการตั้งค่าเรียบร้อย!' });
        fetchConfig();
      } else throw new Error(data.error);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'บันทึกไม่สำเร็จ' });
    } finally { setIsSaving(false); }
  };

  const handleNavSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus({ type: null, message: '' });
    try {
      const res = await fetch('/api/nav', { method: 'POST', body: JSON.stringify({ ...navForm, isEdit: isNavEdit }) });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'บันทึกเมนูเรียบร้อย!' });
        setNavForm(emptyNav); setIsNavEdit(false); fetchNav();
      } else throw new Error(data.error);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'บันทึกไม่สำเร็จ' });
    } finally { setIsSaving(false); }
  };

  const handleConceptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus({ type: null, message: '' });
    try {
      const res = await fetch('/api/concept', { method: 'POST', body: JSON.stringify({ ...conceptForm, isEdit: isConceptEdit }) });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'บันทึกคอนเซปต์เรียบร้อย!' });
        setConceptForm(emptyConcept); setIsConceptEdit(false); fetchConcepts();
      } else throw new Error(data.error);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'บันทึกไม่สำเร็จ' });
    } finally { setIsSaving(false); }
  };

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus({ type: null, message: '' });
    try {
      const res = await fetch('/api/sections', { method: 'POST', body: JSON.stringify({ ...sectionForm, isEdit: isSectionEdit }) });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'บันทึกส่วนเสริมเรียบร้อย!' });
        setSectionForm(emptySection); setIsSectionEdit(false); fetchSections();
      } else throw new Error(data.error);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'บันทึกไม่สำเร็จ' });
    } finally { setIsSaving(false); }
  };

  const handleSectionItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus({ type: null, message: '' });
    try {
      const payload = { ...sectionItemForm, section_id: selectedSectionId, imageUrl: convertToDirectLink(sectionItemForm.imageUrl), isEdit: isSectionItemEdit };
      const res = await fetch('/api/section-items', { method: 'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'บันทึกข้อมูลเรียบร้อย!' });
        setSectionItemForm(emptySectionItem); setIsSectionItemEdit(false); fetchSectionItems();
      } else throw new Error(data.error);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'บันทึกไม่สำเร็จ' });
    } finally { setIsSaving(false); }
  };

  const handleDeleteSvc = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบริการนี้?')) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'ลบบริการเรียบร้อย!' });
        fetchServices();
      } else throw new Error(data.error);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'ลบไม่สำเร็จ' });
    } finally { setIsSaving(false); }
  };

  const handleDeleteInt = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโปรเจกต์นี้?')) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/integrations?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'ลบโปรเจกต์เรียบร้อย!' });
        fetchIntegrations();
      } else throw new Error(data.error);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'ลบไม่สำเร็จ' });
    } finally { setIsSaving(false); }
  };

  const handleDeleteNav = async (id: string) => {
    if (!confirm('ยืนยันหน้าลบเมนู?')) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/nav?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { fetchNav(); setStatus({ type: 'success', message: 'ลบเมนูเรียบร้อย!' }); }
      else throw new Error(data.error);
    } catch (err: any) { setStatus({ type: 'error', message: err.message }); }
    finally { setIsSaving(false); }
  };

  const handleDeleteConcept = async (id: string) => {
    if (!confirm('ยืนยันหน้าลบคอนเซปต์?')) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/concept?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { fetchConcepts(); setStatus({ type: 'success', message: 'ลบคอนเซปต์เรียบร้อย!' }); }
      else throw new Error(data.error);
    } catch (err: any) { setStatus({ type: 'error', message: err.message }); }
    finally { setIsSaving(false); }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('ยืนยันหน้าลบส่วนเสริม?')) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/sections?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { fetchSections(); setStatus({ type: 'success', message: 'ลบส่วนเสริมเรียบร้อย!' }); }
      else throw new Error(data.error);
    } catch (err: any) { setStatus({ type: 'error', message: err.message }); }
    finally { setIsSaving(false); }
  };

  const handleDeleteSectionItem = async (id: string) => {
    if (!confirm('ยืนยันหน้าลบรายการ?')) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/section-items?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { fetchSectionItems(); setStatus({ type: 'success', message: 'ลบรายการเรียบร้อย!' }); }
      else throw new Error(data.error);
    } catch (err: any) { setStatus({ type: 'error', message: err.message }); }
    finally { setIsSaving(false); }
  };

  // ================= RENDER TOOLS =================
  const renderStatus = () => status.type && (
    <div className={`p-4 mb-6 rounded-xl flex items-start gap-3 text-sm shadow-sm border ${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
      {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <div className="font-medium pt-0.5">{status.message}</div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans selection:bg-brand-500/20">
      {/* --- Sidebar --- */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-50 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-50 h-24">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 master-gear-spin flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
                  <defs>
                    <linearGradient id="adminLogoGearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD200" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                  <g fill="url(#adminLogoGearGrad)">
                     {[0,45,90,135,180,225,270,315].map(deg => (
                       <path key={deg} d="M92 5 Q100 0 108 5 L112 35 Q100 35 88 35 Z" transform={`rotate(${deg} 100 100)`} />
                     ))}
                     <circle cx="100" cy="100" r="70" />
                  </g>
                  <circle cx="100" cy="100" r="30" fill="#1D4ED8" />
                  <circle cx="100" cy="100" r="10" fill="white" />
                </svg>
              </div>
              <div>
                <h1 className="font-extrabold text-gray-900 leading-tight text-lg">Admin CMS</h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Control Panel</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 master-gear-spin flex items-center justify-center mx-auto">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
                  <defs>
                    <linearGradient id="adminLogoGearGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD200" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                  <g fill="url(#adminLogoGearGradSmall)">
                     {[0,45,90,135,180,225,270,315].map(deg => (
                       <path key={deg} d="M92 5 Q100 0 108 5 L112 35 Q100 35 88 35 Z" transform={`rotate(${deg} 100 100)`} />
                     ))}
                     <circle cx="100" cy="100" r="70" />
                  </g>
                  <circle cx="100" cy="100" r="30" fill="#1D4ED8" />
                  <circle cx="100" cy="100" r="10" fill="white" />
                </svg>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {MENU_ITEMS.map((item, idx) => {
            if ('divider' in item) return <div key={idx} className="h-px bg-gray-100 my-4 mx-2" />;
            const Icon = item.icon as any;
            const isActive = activeMenu === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveMenu(item.id!); setStatus({type:null,message:''}); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${isActive ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'group-hover:text-brand-500'}`} />
                {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
                {isActive && isSidebarOpen && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50 space-y-2">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center justify-center p-2.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-all">
            {isSidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm ${!isSidebarOpen && 'justify-center'}`}>
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>ออกจากระบบ</span>}
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 overflow-y-auto relative bg-gray-50/50">
        {/* Sticky Sub-Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 px-8 py-5 flex justify-between items-center h-24">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{activeMenu.replace('_', ' ')}</h2>
            <p className="text-xs text-gray-400 font-bold tracking-widest mt-1">DEEDEV IOT MANAGEMENT SYSTEM</p>
          </div>
          <div className="flex items-center gap-4">
             {renderStatus()}
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">

        {/* ================= DASHBOARD ================= */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Server className="w-6 h-6" /></div>
                    <span className="text-2xl font-black text-gray-900">{services.length}</span>
                 </div>
                 <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">บริการและผลงานทั้งหมด</h3>
                 <p className="text-xs text-gray-400 mt-1">Total Services & Works</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><LinkIcon className="w-6 h-6" /></div>
                    <span className="text-2xl font-black text-gray-900">{integrations.length}</span>
                 </div>
                 <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">ระบบที่เชื่อมต่อทั้งหมด</h3>
                 <p className="text-xs text-gray-400 mt-1">Total Portfolio Integrations</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm bg-gradient-to-br from-brand-500 to-indigo-600 text-white border-none">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/20 text-white rounded-xl"><Globe className="w-6 h-6" /></div>
                    <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded">Live Site</span>
                 </div>
                 <h3 className="font-bold text-sm uppercase tracking-wider">สถานะการแสดงผลหน้าบ้าน</h3>
                 <p className="text-xs text-white/70 mt-1">เชื่อมต่อกับ Google Sheets เรียบร้อย</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
               <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-4 uppercase tracking-tight">Recent Activity & Quick Links</h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <button onClick={()=>setActiveMenu('services')} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-left">
                     <div className="w-10 h-10 bg-brand-50 text-brand-500 rounded-lg flex items-center justify-center font-bold">1</div>
                     <div><p className="font-bold text-sm text-gray-900">จัดการบริการและผลงาน</p><p className="text-xs text-gray-400">เพิ่ม/ลบ/แก้ไข รายละเอียดบริการ</p></div>
                  </button>
                  <button onClick={()=>setActiveMenu('hero')} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-left">
                     <div className="w-10 h-10 bg-brand-50 text-brand-500 rounded-lg flex items-center justify-center font-bold">2</div>
                     <div><p className="font-bold text-sm text-gray-900">แก้ไขหน้าแรก (Hero Section)</p><p className="text-xs text-gray-400">เปลี่ยนพาดหัวและคำโปรยหน้าหลัก</p></div>
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* ================= SERVICES ================= */}
        {activeMenu === 'services' && (
          <div className="grid xl:grid-cols-12 gap-8 animate-fade-in">
            <div className="xl:col-span-4 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100 flex justify-between text-gray-900">
                <span>{isSvcEdit ? 'แก้ไขบริการและผลงาน' : 'เพิ่มบริการและผลงานใหม่'}</span>
                {isSvcEdit && <button type="button" onClick={() => { setSvcForm(emptySvc); setIsSvcEdit(false); setSvcImageUrls(['']); setSvcVideoUrls(['']); }} className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">ยกเลิก</button>}
              </h2>
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
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title (TH) *</label>
                    <input required type="text" value={svcForm.title_th} onChange={(e) => setSvcForm({...svcForm, title_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-thai" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description (EN) *</label>
                    <textarea required rows={3} value={svcForm.description} onChange={(e) => setSvcForm({...svcForm, description: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description (TH) *</label>
                    <textarea required rows={3} value={svcForm.description_th} onChange={(e) => setSvcForm({...svcForm, description_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-thai" />
                  </div>
                </div>

                {/* IMAGE URLs - Multiple */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Image URL</label>
                    <button type="button" onClick={() => setSvcImageUrls([...svcImageUrls, ''])} className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-bold px-2 py-1 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors">
                      <Plus className="w-3 h-3" /> เพิ่มภาพ
                    </button>
                  </div>
                  <div className="space-y-2">
                    {svcImageUrls.map((url, i) => (
                      <div key={i} className="flex gap-2">
                        <textarea rows={2} value={url} onChange={(e) => { const arr = [...svcImageUrls]; arr[i] = e.target.value; setSvcImageUrls(arr); }} placeholder="https://drive.google.com/... หรือ URL รูปภาพ" className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-none" />
                        {svcImageUrls.length > 1 && (
                          <button type="button" onClick={() => setSvcImageUrls(svcImageUrls.filter((_, j) => j !== i))} className="self-start mt-1 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* VIDEO URLs - Multiple */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Video URL</label>
                    <button type="button" onClick={() => setSvcVideoUrls([...svcVideoUrls, ''])} className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-bold px-2 py-1 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                      <Plus className="w-3 h-3" /> เพิ่มวิดีโอ
                    </button>
                  </div>
                  <div className="space-y-2">
                    {svcVideoUrls.map((url, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" value={url} onChange={(e) => { const arr = [...svcVideoUrls]; arr[i] = e.target.value; setSvcVideoUrls(arr); }} placeholder="https://drive.google.com/... หรือ YouTube URL" className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                        {svcVideoUrls.length > 1 && (
                          <button type="button" onClick={() => setSvcVideoUrls(svcVideoUrls.filter((_, j) => j !== i))} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* REFERENCE URL */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Reference URL</label>
                  <input type="text" placeholder="e.g. https://github.com/..." value={svcForm.demoUrl || ''} onChange={(e) => setSvcForm({...svcForm, demoUrl: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                </div>

                <button disabled={isSaving} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 mx-auto mt-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all">
                  {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />} บันทึกข้อมูล
                </button>
              </form>
            </div>
            
            <div className="xl:col-span-8 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 min-h-[500px]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-100 gap-4">
                <h2 className="text-xl font-bold text-gray-900 uppercase">รายการบริการ ({services.length})</h2>
                <div className="relative flex-grow md:w-64">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input type="text" placeholder="ค้นหาบริการ..." value={svcSearch} onChange={(e) => setSvcSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-brand-500 transition-all" />
                </div>
              </div>
              <div className="space-y-4">
                {services
                  .filter(svc => svc.title.toLowerCase().includes(svcSearch.toLowerCase()) || (svc.title_th && svc.title_th.toLowerCase().includes(svcSearch.toLowerCase())) || svc.id.toLowerCase().includes(svcSearch.toLowerCase()))
                  .map(svc => (
                  <div key={svc.id} className="bg-gray-50 border border-gray-200 hover:border-brand-200 p-5 rounded-2xl flex justify-between items-start transition-all group text-left">
                    <div>
                      <h3 className="font-bold text-brand-600 text-lg mb-1 group-hover:text-brand-700">{svc.title} {svc.title_th && <span className="text-gray-400 font-normal">/ {svc.title_th}</span>}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-2xl leading-relaxed mt-2">{svc.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4 shrink-0">
                      <button onClick={() => { setSvcForm(svc); setSvcImageUrls(svc.imageUrl ? svc.imageUrl.split(',').map(u=>u.trim()) : ['']); setSvcVideoUrls(svc.videoUrls ? svc.videoUrls.split(',').map(u=>u.trim()) : ['']); setIsSvcEdit(true); window.scrollTo(0,0); }} className="text-amber-600 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors border border-amber-200/50">แก้ไข</button>
                      <button onClick={() => handleDeleteSvc(svc.id)} className="text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-xl shadow-sm transition-colors border border-red-200/50"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= INTEGRATIONS ================= */}
        {activeMenu === 'integrations' && (
          <div className="grid xl:grid-cols-12 gap-8 animate-fade-in">
            <div className="xl:col-span-4 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100 flex justify-between text-gray-900">
                <span>{isIntEdit ? 'แก้ไขระบบการทำงาน' : 'เพิ่มระบบการทำงานใหม่'}</span>
                {isIntEdit && <button type="button" onClick={() => { setIntForm(emptyInt); setIsIntEdit(false); }} className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">ยกเลิก</button>}
              </h2>
              <form onSubmit={handleIntSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project ID</label>
                    <input type="text" value={intForm.id} onChange={(e) => setIntForm({...intForm, id: e.target.value})} readOnly={isIntEdit} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tag Name</label>
                    <input type="text" value={intForm.tag} onChange={(e) => setIntForm({...intForm, tag: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title (EN) *</label>
                    <input required type="text" value={intForm.title} onChange={(e) => setIntForm({...intForm, title: e.target.value})} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title (TH) *</label>
                    <input required type="text" value={intForm.title_th} onChange={(e) => setIntForm({...intForm, title_th: e.target.value})} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description (EN) *</label>
                     <textarea required rows={3} value={intForm.description} onChange={(e) => setIntForm({...intForm, description: e.target.value})} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description (TH) *</label>
                     <textarea required rows={3} value={intForm.description_th} onChange={(e) => setIntForm({...intForm, description_th: e.target.value})} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" />
                   </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Image URL</label>
                  <textarea rows={3} value={intForm.imageUrl} onChange={(e) => setIntForm({...intForm, imageUrl: e.target.value})} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">REFERENCE URL</label>
                  <input type="url" placeholder="e.g. https://github.com/..." value={intForm.referenceUrl || ''} onChange={(e) => setIntForm({...intForm, referenceUrl: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" />
                </div>
                <button disabled={isSaving} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 mx-auto mt-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all">
                  {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />} บันทึกข้อมูลระบบ
                </button>
              </form>
            </div>
            
            <div className="xl:col-span-8 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 min-h-[500px]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-100 gap-4">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">รายการระบบ ({integrations.length})</h2>
                <div className="relative flex-grow md:w-64">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input type="text" placeholder="ค้นหา..." value={intSearch} onChange={(e) => setIntSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-brand-500 transition-all" />
                </div>
              </div>
              <div className="space-y-4">
                {integrations
                  .filter(int => int.title.toLowerCase().includes(intSearch.toLowerCase()) || (int.title_th && int.title_th.toLowerCase().includes(intSearch.toLowerCase())) || int.id.toLowerCase().includes(intSearch.toLowerCase()))
                  .map(int => (
                  <div key={int.id} className="bg-gray-50 border border-gray-200 hover:border-brand-200 p-5 rounded-2xl flex justify-between items-start transition-all group text-left">
                    <div>
                      <h3 className="font-bold text-brand-600 text-lg mb-1 group-hover:text-brand-700">{int.title} {int.title_th && <span className="text-gray-400 font-normal">/ {int.title_th}</span>}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-2xl leading-relaxed mt-2">{int.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4 shrink-0">
                      <button onClick={() => { setIntForm(int); setIsIntEdit(true); window.scrollTo(0,0); }} className="text-amber-600 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors border border-amber-200/50">แก้ไข</button>
                      <button onClick={() => handleDeleteInt(int.id)} className="text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-xl shadow-sm transition-colors border border-red-200/50"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= HEADER & NAV ================= */}
        {activeMenu === 'nav' && (
          <div className="grid xl:grid-cols-12 gap-8 animate-fade-in">
            <div className="xl:col-span-4 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100 flex justify-between text-gray-900">
                <span>{isNavEdit ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}</span>
                {isNavEdit && <button type="button" onClick={() => { setNavForm(emptyNav); setIsNavEdit(false); }} className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">ยกเลิก</button>}
              </h2>
              <form onSubmit={handleNavSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Label (EN) *</label>
                    <input required type="text" value={navForm.label_en} onChange={(e) => setNavForm({...navForm, label_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Label (TH) *</label>
                    <input required type="text" value={navForm.label_th} onChange={(e) => setNavForm({...navForm, label_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Href (Link/Anchor) *</label>
                  <input required type="text" value={navForm.href} onChange={(e) => setNavForm({...navForm, href: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-mono" placeholder="#section-id or /page" />
                </div>
                <button disabled={isSaving} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 mx-auto mt-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all">
                  {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />} บันทึกเมนู
                </button>
              </form>

              <div className="mt-10 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Header Settings</h3>
                <form onSubmit={handleConfSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Button Text (EN)</label>
                      <input type="text" value={configData.nav_btn_en} onChange={e=>setConfigData({...configData, nav_btn_en: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1 text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Button Text (TH)</label>
                      <input type="text" value={configData.nav_btn_th} onChange={e=>setConfigData({...configData, nav_btn_th: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1 text-xs font-thai" />
                    </div>
                  </div>
                  <button disabled={isSaving} className="w-full bg-gray-900 text-white py-2 rounded-lg text-xs font-bold">บันทึกส่วนหัว</button>
                </form>
              </div>
            </div>
            
            <div className="xl:col-span-8 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 min-h-[500px]">
              <h2 className="text-xl font-bold text-gray-900 uppercase mb-6 pb-4 border-b border-gray-100 uppercase tracking-tight">รายการเมนู ({navItems.length})</h2>
              <div className="space-y-4">
                {navItems.map(nav => (
                  <div key={nav.id} className="bg-gray-50 border border-gray-200 p-5 rounded-2xl flex justify-between items-center transition-all group">
                    <div>
                      <h3 className="font-bold text-brand-600 text-lg">{nav.label_en} <span className="text-gray-400 font-normal">/ {nav.label_th}</span></h3>
                      <p className="text-xs text-brand-500 font-mono mt-1">{nav.href}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setNavForm(nav); setIsNavEdit(true); window.scrollTo(0,0); }} className="text-amber-600 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl text-sm font-bold border border-amber-200/50">แก้ไข</button>
                      <button onClick={() => handleDeleteNav(nav.id)} className="text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-xl border border-red-200/50"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= HERO SECTION ================= */}
        {activeMenu === 'hero' && (
          <form onSubmit={handleConfSubmit} className="max-w-4xl mx-auto space-y-8 animate-fade-in">
             <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6">
                <h3 className="text-xl font-black text-gray-900 border-b border-gray-50 pb-4 uppercase tracking-tight">ข้อความส่วนต้อนรับ (Hero Section)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Badge (EN/TH)</label>
                      <input type="text" value={configData.hero_badge_en} onChange={e=>setConfigData({...configData, hero_badge_en: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-brand-500 transition-all outline-none" placeholder="EN" />
                      <input type="text" value={configData.hero_badge_th} onChange={e=>setConfigData({...configData, hero_badge_th: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-brand-500 transition-all outline-none font-thai" placeholder="TH" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Headline (EN/TH)</label>
                      <textarea rows={3} value={configData.hero_headline_en} onChange={e=>setConfigData({...configData, hero_headline_en: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-brand-500 transition-all outline-none" placeholder="EN" />
                      <textarea rows={3} value={configData.hero_headline_th} onChange={e=>setConfigData({...configData, hero_headline_th: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-brand-500 transition-all outline-none font-thai" placeholder="TH" />
                   </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Sub-headline (EN/TH)</label>
                      <textarea rows={4} value={configData.hero_sub_en} onChange={e=>setConfigData({...configData, hero_sub_en: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-brand-500 transition-all outline-none" placeholder="EN" />
                      <textarea rows={4} value={configData.hero_sub_th} onChange={e=>setConfigData({...configData, hero_sub_th: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-brand-500 transition-all outline-none font-thai" placeholder="TH" />
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-3">
                         <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Button 1: Text & Link</label>
                         <div className="grid grid-cols-2 gap-3">
                            <input type="text" value={configData.hero_btn1_text_en} onChange={e=>setConfigData({...configData, hero_btn1_text_en: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs" placeholder="Btn 1 (EN)" />
                            <input type="text" value={configData.hero_btn1_text_th} onChange={e=>setConfigData({...configData, hero_btn1_text_th: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-thai" placeholder="Btn 1 (TH)" />
                         </div>
                         <input type="text" value={configData.hero_btn1_link} onChange={e=>setConfigData({...configData, hero_btn1_link: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-brand-600 font-bold" placeholder="Link (e.g. #services)" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-xs font-bold text-brand-500 uppercase tracking-widest">Button 2: Text & Link</label>
                         <div className="grid grid-cols-2 gap-3">
                            <input type="text" value={configData.hero_btn2_text_en} onChange={e=>setConfigData({...configData, hero_btn2_text_en: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs" placeholder="Btn 2 (EN)" />
                            <input type="text" value={configData.hero_btn2_text_th} onChange={e=>setConfigData({...configData, hero_btn2_text_th: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-thai" placeholder="Btn 2 (TH)" />
                         </div>
                         <input type="text" value={configData.hero_btn2_link} onChange={e=>setConfigData({...configData, hero_btn2_link: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-brand-600 font-bold" placeholder="Link (e.g. #contact)" />
                      </div>
                   </div>
                </div>
             </div>
             <button disabled={isSaving} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-5 rounded-3xl flex items-center justify-center gap-2 shadow-xl shadow-brand-500/20 transition-all text-xl">
               {isSaving ? <Loader2 className="animate-spin w-7 h-7" /> : <Save className="w-7 h-7"/>} บันทึก Hero Section
             </button>
          </form>
        )}

        {/* ================= CONCEPT SECTION ================= */}
        {activeMenu === 'concept' && (
          <div className="grid xl:grid-cols-12 gap-8 animate-fade-in text-left">
            <div className="xl:col-span-4 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100 flex justify-between text-gray-900 uppercase">
                <span>{isConceptEdit ? 'แก้ไขคอนเซปต์' : 'เพิ่มหัวข้อคอนเซปต์ใหม่'}</span>
                {isConceptEdit && <button type="button" onClick={() => { setConceptForm(emptyConcept); setIsConceptEdit(false); }} className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">ยกเลิก</button>}
              </h2>
              <form onSubmit={handleConceptSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Icon Name (Lucide)</label>
                  <input type="text" value={conceptForm.icon} onChange={(e) => setConceptForm({...conceptForm, icon: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-mono" placeholder="e.g. Zap, Cpu, Code" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title (EN) *</label>
                    <input required type="text" value={conceptForm.title_en} onChange={(e) => setConceptForm({...conceptForm, title_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title (TH) *</label>
                    <input required type="text" value={conceptForm.title_th} onChange={(e) => setConceptForm({...conceptForm, title_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Desc (EN) *</label>
                    <textarea required rows={3} value={conceptForm.desc_en} onChange={(e) => setConceptForm({...conceptForm, desc_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Desc (TH) *</label>
                    <textarea required rows={3} value={conceptForm.desc_th} onChange={(e) => setConceptForm({...conceptForm, desc_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm outline-none focus:border-brand-500 transition-all font-thai" />
                  </div>
                </div>
                <button disabled={isSaving} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 mx-auto mt-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all">
                  {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />} บันทึกคอนเซปต์
                </button>
              </form>
            </div>
            
            <div className="xl:col-span-8 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 min-h-[500px]">
              <h2 className="text-xl font-bold text-gray-900 uppercase mb-6 pb-4 border-b border-gray-100 uppercase tracking-tight">รายการคอนเซปต์ ({concepts.length})</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {concepts.map(concept => (
                  <div key={concept.id} className="bg-gray-50 border border-gray-200 p-6 rounded-3xl flex flex-col justify-between transition-all group hover:border-brand-200">
                    <div>
                      <h3 className="font-bold text-brand-600 text-lg mb-2">{concept.title_en} <span className="text-gray-400 font-normal">/ {concept.title_th}</span></h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{concept.desc_en}</p>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <button onClick={() => { setConceptForm(concept); setIsConceptEdit(true); window.scrollTo(0,0); }} className="flex-grow text-amber-600 bg-amber-50 hover:bg-amber-100 py-2 rounded-xl text-xs font-bold border border-amber-200/50">แก้ไข</button>
                      <button onClick={() => handleDeleteConcept(concept.id)} className="text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-xl border border-red-200/50"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SITE SECTIONS ================= */}
        {activeMenu === 'sections' && (
          <div className="grid xl:grid-cols-12 gap-8 animate-fade-in text-left">
            <div className="xl:col-span-4 space-y-6">
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 h-fit">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100 flex justify-between text-gray-900 uppercase">
                  <span>{isSectionEdit ? 'แก้ไขส่วนหลัก' : 'เพิ่มส่วนหลักใหม่'}</span>
                  {isSectionEdit && <button type="button" onClick={() => { setSectionForm(emptySection); setIsSectionEdit(false); }} className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">ยกเลิก</button>}
                </h2>
                <form onSubmit={handleSectionSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Section Title (EN)</label>
                      <input required type="text" value={sectionForm.title_en} onChange={(e) => setSectionForm({...sectionForm, title_en: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Section Title (TH)</label>
                      <input required type="text" value={sectionForm.title_th} onChange={(e) => setSectionForm({...sectionForm, title_th: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1.5 text-sm font-thai" />
                    </div>
                  </div>
                  <button disabled={isSaving} className="w-full bg-gray-900 text-white font-bold py-3 mx-auto mt-4 rounded-xl flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> บันทึกส่วนหลัก
                  </button>
                </form>
              </div>

              {selectedSectionId && (
                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 h-fit animate-fade-in-up">
                  <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100 flex justify-between text-gray-900 uppercase">
                    <span>{isSectionItemEdit ? 'แก้ไขรายการย่อย' : 'เพิ่มรายการย่อย'}</span>
                  </h2>
                  <form onSubmit={handleSectionItemSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input required type="text" value={sectionItemForm.title_en} onChange={(e) => setSectionItemForm({...sectionItemForm, title_en: e.target.value})} className="w-full border rounded-xl px-4 py-2 text-sm" placeholder="Title (EN)" />
                      <input required type="text" value={sectionItemForm.title_th} onChange={(e) => setSectionItemForm({...sectionItemForm, title_th: e.target.value})} className="w-full border rounded-xl px-4 py-2 text-sm font-thai" placeholder="Title (TH)" />
                    </div>
                    <textarea rows={2} value={sectionItemForm.desc_en} onChange={(e) => setSectionItemForm({...sectionItemForm, desc_en: e.target.value})} className="w-full border rounded-xl px-4 py-2 text-sm" placeholder="Description (EN)" />
                    <textarea rows={2} value={sectionItemForm.desc_th} onChange={(e) => setSectionItemForm({...sectionItemForm, desc_th: e.target.value})} className="w-full border rounded-xl px-4 py-2 text-sm font-thai" placeholder="Description (TH)" />
                    <input type="text" value={sectionItemForm.imageUrl} onChange={(e) => setSectionItemForm({...sectionItemForm, imageUrl: e.target.value})} className="w-full border rounded-xl px-4 py-2 text-sm font-mono" placeholder="Image URL (Drive/Web)" />
                    <button disabled={isSaving} className="w-full bg-brand-500 text-white font-bold py-3 mx-auto mt-2 rounded-xl flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" /> บันทึกรายการย่อย
                    </button>
                  </form>
                </div>
              )}
            </div>
            
            <div className="xl:col-span-8 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 min-h-[500px]">
              <h2 className="text-xl font-bold text-gray-900 uppercase mb-6 pb-4 border-b border-gray-100 uppercase tracking-tight">ผังเว็บไซต์และส่วนเสริม</h2>
              <div className="space-y-6">
                {sections.map(sec => (
                  <div key={sec.id} className={`border p-6 rounded-3xl transition-all ${selectedSectionId === sec.id ? 'border-brand-500 bg-brand-50/20 ring-4 ring-brand-500/5' : 'border-gray-100 hover:border-brand-200 bg-gray-50'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div onClick={() => setSelectedSectionId(sec.id)} className="cursor-pointer">
                        <h3 className="font-bold text-gray-900 text-xl">{sec.title_en} <span className="text-gray-400 font-normal">/ {sec.title_th}</span></h3>
                        <p className="text-xs text-brand-500 font-bold uppercase tracking-widest mt-1">Section ID: {sec.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setSectionForm(sec); setIsSectionEdit(true); }} className="text-amber-600 bg-white-50 p-2 rounded-xl border border-amber-100 hover:bg-amber-50 transition-colors"><Settings className="w-5 h-5" /></button>
                        <button onClick={() => handleDeleteSection(sec.id)} className="text-red-500 bg-white-50 p-2 rounded-xl border border-red-100 hover:bg-red-50 transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>

                    {selectedSectionId === sec.id && (
                      <div className="grid md:grid-cols-2 gap-4 mt-6 animate-fade-in animate-slide-up">
                        {sectionItems.filter(item => item.section_id === sec.id).map(item => (
                          <div key={item.id} className="bg-white border border-gray-100 p-4 rounded-2xl flex gap-4 shadow-sm group">
                             {item.imageUrl && <img src={item.imageUrl} className="w-16 h-16 rounded-xl object-cover" />}
                             <div className="flex-grow">
                                <h4 className="font-bold text-gray-900 text-sm">{item.title_en}</h4>
                                <p className="text-[11px] text-gray-400 line-clamp-2">{item.desc_en}</p>
                                <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button onClick={()=> { setSectionItemForm(item); setIsSectionItemEdit(true); }} className="text-amber-600 text-xs font-bold">แก้ไข</button>
                                   <button onClick={()=> handleDeleteSectionItem(item.id)} className="text-red-500 text-xs font-bold">ลบออก</button>
                                </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SITE TITLES ================= */}
        {activeMenu === 'titles' && (
          <form onSubmit={handleConfSubmit} className="max-w-4xl mx-auto space-y-8 animate-fade-in text-left">
             <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6 text-left">
                <h3 className="text-xl font-black text-gray-900 border-b border-gray-50 pb-4 uppercase tracking-tight text-left">หัวข้อและการเน้นย้ำ (Site Titles & Badges)</h3>
                <div className="space-y-6 text-left">
                   <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 space-y-4 text-left">
                      <p className="text-xs font-black text-amber-600 uppercase tracking-widest text-left">Section: Services</p>
                      <div className="grid md:grid-cols-2 gap-4 text-left">
                         <input type="text" value={configData.svc_badge_en} onChange={e=>setConfigData({...configData, svc_badge_en: e.target.value})} className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 text-sm" placeholder="Badge (EN)" />
                         <input type="text" value={configData.svc_badge_th} onChange={e=>setConfigData({...configData, svc_badge_th: e.target.value})} className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 text-sm font-thai" placeholder="Badge (TH)" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-left">
                         <input type="text" value={configData.solutions_title_en} onChange={e=>setConfigData({...configData, solutions_title_en: e.target.value})} className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 text-sm" placeholder="Title (EN)" />
                         <input type="text" value={configData.solutions_title_th} onChange={e=>setConfigData({...configData, solutions_title_th: e.target.value})} className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 text-sm font-thai" placeholder="Title (TH)" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-left">
                         <textarea rows={2} value={configData.solutions_description_en} onChange={e=>setConfigData({...configData, solutions_description_en: e.target.value})} className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 text-sm" placeholder="Description (EN)" />
                         <textarea rows={2} value={configData.solutions_description_th} onChange={e=>setConfigData({...configData, solutions_description_th: e.target.value})} className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 text-sm font-thai" placeholder="Description (TH)" />
                      </div>
                   </div>

                   <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 space-y-4 text-left">
                      <p className="text-xs font-black text-purple-600 uppercase tracking-widest text-left">Section: Portfolio / Integrations</p>
                      <div className="grid md:grid-cols-2 gap-4 text-left">
                         <input type="text" value={configData.port_badge_en} onChange={e=>setConfigData({...configData, port_badge_en: e.target.value})} className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2 text-sm" placeholder="Badge (EN)" />
                         <input type="text" value={configData.port_badge_th} onChange={e=>setConfigData({...configData, port_badge_th: e.target.value})} className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2 text-sm font-thai" placeholder="Badge (TH)" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-left">
                         <input type="text" value={configData.integrations_title_en} onChange={e=>setConfigData({...configData, integrations_title_en: e.target.value})} className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2 text-sm" placeholder="Title (EN)" />
                         <input type="text" value={configData.integrations_title_th} onChange={e=>setConfigData({...configData, integrations_title_th: e.target.value})} className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2 text-sm font-thai" placeholder="Title (TH)" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-left">
                         <textarea rows={2} value={configData.port_desc_en} onChange={e=>setConfigData({...configData, port_desc_en: e.target.value})} className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2 text-sm" placeholder="Description (EN)" />
                         <textarea rows={2} value={configData.port_desc_th} onChange={e=>setConfigData({...configData, port_desc_th: e.target.value})} className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2 text-sm font-thai" placeholder="Description (TH)" />
                      </div>
                   </div>
                </div>
             </div>

             <button disabled={isSaving} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-5 rounded-3xl flex items-center justify-center gap-2 shadow-xl transition-all">
                {isSaving ? <Loader2 className="animate-spin w-7 h-7" /> : <Save className="w-7 h-7"/>} บันทึกหัวข้อทั้งหมด
             </button>
          </form>
        )}

        {/* ================= CONTACT INFO ================= */}
        {activeMenu === 'contact' && (
          <form onSubmit={handleConfSubmit} className="max-w-4xl mx-auto space-y-8 animate-fade-in bg-white p-8 rounded-3xl border border-gray-200 shadow-xl text-left">
             <h3 className="text-xl font-black text-gray-900 border-b border-gray-50 pb-4 uppercase tracking-tight text-left">ข้อมูลติดต่อ (Contact Information)</h3>
             <div className="grid md:grid-cols-2 gap-6 text-left">
                <div><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title (EN)</label><input type="text" value={configData.contact_title_en} onChange={e=>setConfigData({...configData, contact_title_en: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-2" /></div>
                <div><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title (TH)</label><input type="text" value={configData.contact_title_th} onChange={e=>setConfigData({...configData, contact_title_th: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-2 font-thai" /></div>
             </div>
             <div className="grid md:grid-cols-2 gap-6 text-left">
                <div><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description (EN)</label><textarea rows={3} value={configData.contact_description_en} onChange={e=>setConfigData({...configData, contact_description_en: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-2" /></div>
                <div><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description (TH)</label><textarea rows={3} value={configData.contact_description_th} onChange={e=>setConfigData({...configData, contact_description_th: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-2 font-thai" /></div>
             </div>
             <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-50 text-left">
                <div><label className="text-xs font-bold text-gray-400 uppercase">Email</label><input type="text" value={configData.contact_email} onChange={e=>setConfigData({...configData, contact_email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-2 text-sm" /></div>
                <div><label className="text-xs font-bold text-gray-400 uppercase">Phone</label><input type="text" value={configData.contact_phone} onChange={e=>setConfigData({...configData, contact_phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-2 text-sm" /></div>
                <div><label className="text-xs font-bold text-gray-400 uppercase">Line ID</label><input type="text" value={configData.contact_line} onChange={e=>setConfigData({...configData, contact_line: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-2 text-sm" /></div>
             </div>
             <button disabled={isSaving} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all text-left">
                {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />} บันทึกข้อมูลติดต่อ
             </button>
          </form>
        )}

        {/* ================= FOOTER BIO & CTA ================= */}
        {activeMenu === 'footer' && (
          <form onSubmit={handleConfSubmit} className="max-w-4xl mx-auto space-y-8 animate-fade-in bg-white p-8 rounded-3xl border border-gray-200 shadow-xl text-left">
             <h3 className="text-xl font-black text-gray-900 border-b border-gray-50 pb-4 uppercase tracking-tight text-left">ฟุตเตอร์และป้ายกำกับ (Footer & Call to Action)</h3>
             <div className="grid md:grid-cols-2 gap-6 text-left">
                <div><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">CTA Heading (EN)</label><input type="text" value={configData.cta_heading_en} onChange={e=>setConfigData({...configData, cta_heading_en: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-2 font-bold" /></div>
                <div><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">CTA Heading (TH)</label><input type="text" value={configData.cta_heading_th} onChange={e=>setConfigData({...configData, cta_heading_th: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-2 font-thai font-bold" /></div>
             </div>
             <div className="grid md:grid-cols-2 gap-6 text-left">
                <div><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Facebook Display Name (EN)</label><input type="text" value={configData.contact_facebook_en} onChange={e=>setConfigData({...configData, contact_facebook_en: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-2" /></div>
                <div><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Facebook Display Name (TH)</label><input type="text" value={configData.contact_facebook_th} onChange={e=>setConfigData({...configData, contact_facebook_th: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-2 font-thai" /></div>
             </div>
             <div className="pt-2 text-left"><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Facebook URL</label><input type="text" value={configData.facebook_url} onChange={e=>setConfigData({...configData, facebook_url: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-2 text-brand-500 font-bold" /></div>
             <div className="grid md:grid-cols-2 gap-6 text-left">
                <div><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Footer Bio (EN)</label><textarea rows={3} value={configData.footer_bio_en} onChange={e=>setConfigData({...configData, footer_bio_en: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-2 text-sm" /></div>
                <div><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Footer Bio (TH)</label><textarea rows={3} value={configData.footer_bio_th} onChange={e=>setConfigData({...configData, footer_bio_th: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mt-2 text-sm font-thai" /></div>
             </div>
             <button disabled={isSaving} className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all text-left">
                {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />} บันทึกฟุตเตอร์และโซเชียล
             </button>
          </form>
        )}
      </div>
      </main>
    </div>
  );
}
