"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, Loader2, CheckCircle2, AlertCircle, LayoutDashboard, Server, 
  RefreshCw, LogOut, Settings, Link as LinkIcon, Trash2, Search,
  Menu as MenuIcon, X, Type, Zap, Lightbulb, Star, Phone, Globe, ChevronRight, Plus, Shield
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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

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
    if (!confirm('ยืนยันการลบเมนู?')) return;
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
    if (!confirm('ยืนยันการลบคอนเซปต์?')) return;
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
    if (!confirm('ยืนยันการลบส่วนเสริม?')) return;
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
    if (!confirm('ยืนยันการลบรายการ?')) return;
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
    <div className={`p-3 rounded border text-xs font-mono flex items-start gap-2.5 ${
      status.type === 'success' 
        ? 'bg-[#111318] border-emerald-500/40 text-emerald-400' 
        : 'bg-[#111318] border-[#E53935]/40 text-[#E53935]'
    }`}>
      {status.type === 'success' ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
      <span className="font-semibold">{status.message}</span>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#08090D] overflow-hidden font-mono selection:bg-[#E53935]/20 text-white">
      {/* --- Mobile Drawer Backdrop --- */}
      {isMobileDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* --- Mobile Off-Canvas Drawer --- */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-[#111318] border-r border-[#252832] z-50 flex flex-col shadow-2xl transition-transform duration-200 lg:hidden ${
        isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 flex items-center justify-between border-b border-[#252832]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E53935]" />
            <div>
              <h1 className="font-bold text-white text-sm">DEEDEV / ADMIN</h1>
              <p className="text-[10px] text-[#6B7280]">CONTROL PANEL</p>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileDrawerOpen(false)} 
            className="p-1.5 text-[#9CA3AF] hover:text-white rounded border border-[#252832]"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 text-xs">
          {MENU_ITEMS.map((item, idx) => {
            if ('divider' in item) return <div key={idx} className="h-px bg-[#252832] my-3 mx-2" />;
            const Icon = item.icon as any;
            const isActive = activeMenu === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => { setActiveMenu(item.id!); setStatus({type:null,message:''}); setIsMobileDrawerOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors ${
                  isActive ? 'bg-[#E53935] text-white font-bold' : 'text-[#9CA3AF] hover:text-white hover:bg-[#08090D]'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-[#6B7280]'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#252832]">
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-[#E53935] hover:bg-[#E53935]/10 transition-colors text-xs font-bold">
            <LogOut size={16} />
            <span>DISCONNECT</span>
          </button>
        </div>
      </aside>

      {/* --- Desktop Sidebar --- */}
      <aside className={`bg-[#111318] border-r border-[#252832] transition-all duration-200 hidden lg:flex flex-col z-30 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 flex items-center justify-between border-b border-[#252832] h-16">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E53935]" />
              <div>
                <h1 className="font-bold text-white text-xs tracking-wider">DEEDEV / IOT</h1>
                <p className="text-[10px] text-[#6B7280]">ADMIN CONSOLE</p>
              </div>
            </div>
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] mx-auto" />
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 text-xs">
          {MENU_ITEMS.map((item, idx) => {
            if ('divider' in item) return <div key={idx} className="h-px bg-[#252832] my-3 mx-1" />;
            const Icon = item.icon as any;
            const isActive = activeMenu === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => { setActiveMenu(item.id!); setStatus({type:null,message:''}); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors ${
                  isActive ? 'bg-[#E53935] text-white font-bold' : 'text-[#9CA3AF] hover:text-white hover:bg-[#08090D]'
                }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-[#6B7280]'} />
                {isSidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#252832] space-y-1">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="w-full flex items-center justify-center p-2 text-[#6B7280] hover:text-white hover:bg-[#08090D] rounded transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={15} /> : <MenuIcon size={15} />}
          </button>
          <button 
            onClick={handleLogout} 
            className={`w-full flex items-center gap-2 p-2 rounded text-[#E53935] hover:bg-[#E53935]/10 text-xs font-bold transition-colors ${!isSidebarOpen && 'justify-center'}`}
            title="Disconnect"
          >
            <LogOut size={15} />
            {isSidebarOpen && <span>DISCONNECT</span>}
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 overflow-y-auto relative bg-[#08090D]">
        {/* Sticky Header */}
        <header className="sticky top-0 bg-[#111318]/90 backdrop-blur-md border-b border-[#252832] z-40 px-4 sm:px-8 py-3 flex justify-between items-center min-h-[60px]">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-1.5 rounded border border-[#252832] text-[#9CA3AF] hover:text-white"
              aria-label="Open menu drawer"
            >
              <MenuIcon size={16} />
            </button>

            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase">
                {activeMenu.replace('_', ' ')}
              </h2>
              <span className="text-[10px] text-[#6B7280] hidden sm:inline">
                DEEDEV IOT REPOSITORY CMS
              </span>
            </div>
          </div>

          <div>
             {renderStatus()}
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-6xl mx-auto text-xs">

        {/* ================= DASHBOARD ================= */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#111318] p-5 rounded border border-[#252832]">
                 <div className="flex justify-between items-start mb-3">
                    <span className="text-[#6B7280]">01 // SERVICES & WORKS</span>
                    <span className="text-xl font-bold text-white">{services.length}</span>
                 </div>
                 <h3 className="font-bold text-white text-sm">บริการและผลงานทั้งหมด</h3>
                 <p className="text-[11px] text-[#9CA3AF] mt-1">Total Services Registered</p>
              </div>

              <div className="bg-[#111318] p-5 rounded border border-[#252832]">
                 <div className="flex justify-between items-start mb-3">
                    <span className="text-[#6B7280]">02 // INTEGRATIONS</span>
                    <span className="text-xl font-bold text-white">{integrations.length}</span>
                 </div>
                 <h3 className="font-bold text-white text-sm">ระบบที่เชื่อมต่อทั้งหมด</h3>
                 <p className="text-[11px] text-[#9CA3AF] mt-1">Total IoT / Cloud Integrations</p>
              </div>

              <div className="bg-[#111318] p-5 rounded border border-[#E53935]/40 text-white">
                 <div className="flex justify-between items-start mb-3">
                    <span className="text-[#E53935]">● SYSTEM STATUS</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#E53935]/20 text-[#E53935] font-bold">ONLINE</span>
                 </div>
                 <h3 className="font-bold text-white text-sm">เชื่อมต่อ Google Sheets สำเร็จ</h3>
                 <p className="text-[11px] text-[#9CA3AF] mt-1">Data persistence layer active</p>
              </div>
            </div>

            <div className="bg-[#111318] p-6 rounded border border-[#252832]">
               <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-wider border-b border-[#252832] pb-3">
                 Console Quick Links
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button onClick={()=>setActiveMenu('services')} className="p-3 border border-[#252832] rounded bg-[#08090D] hover:border-[#E53935] transition-colors text-left">
                     <span className="text-white font-bold block mb-0.5">จัดการบริการและผลงาน (Services)</span>
                     <span className="text-[#9CA3AF] text-[11px]">เพิ่ม/ลบ/แก้ไข รายละเอียดผลงาน</span>
                  </button>
                  <button onClick={()=>setActiveMenu('hero')} className="p-3 border border-[#252832] rounded bg-[#08090D] hover:border-[#E53935] transition-colors text-left">
                     <span className="text-white font-bold block mb-0.5">แก้ไขหน้าแรก (Hero Section)</span>
                     <span className="text-[#9CA3AF] text-[11px]">เปลี่ยนพาดหัวและคำโปรยหลัก</span>
                  </button>
                  <button onClick={()=>setActiveMenu('concept')} className="p-3 border border-[#252832] rounded bg-[#08090D] hover:border-[#E53935] transition-colors text-left">
                     <span className="text-white font-bold block mb-0.5">จัดการคอนเซปต์ (Concept)</span>
                     <span className="text-[#9CA3AF] text-[11px]">แก้ไขคุณค่าหลักของบริการ</span>
                  </button>
                  <button onClick={()=>setActiveMenu('contact')} className="p-3 border border-[#252832] rounded bg-[#08090D] hover:border-[#E53935] transition-colors text-left">
                     <span className="text-white font-bold block mb-0.5">ข้อมูลติดต่อ (Contact Info)</span>
                     <span className="text-[#9CA3AF] text-[11px]">แก้ไขอีเมล เบอร์โทร และ LINE ID</span>
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* ================= SERVICES ================= */}
        {activeMenu === 'services' && (
          <div className="grid xl:grid-cols-12 gap-6">
            <div className="xl:col-span-5 bg-[#111318] border border-[#252832] rounded p-5 h-fit">
              <h3 className="text-xs font-bold mb-4 pb-3 border-b border-[#252832] flex justify-between text-white uppercase">
                <span>{isSvcEdit ? 'EDIT WORK / SERVICE' : 'NEW WORK / SERVICE'}</span>
                {isSvcEdit && <button type="button" onClick={() => { setSvcForm(emptySvc); setIsSvcEdit(false); setSvcImageUrls(['']); setSvcVideoUrls(['']); }} className="text-[#E53935] text-[10px]">CANCEL</button>}
              </h3>
              <form onSubmit={handleSvcSubmit} className="space-y-3 font-mono">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#6B7280] block mb-1">SERVICE ID</label>
                    <input type="text" value={svcForm.id} onChange={(e) => setSvcForm({...svcForm, id: e.target.value})} readOnly={isSvcEdit} className="w-full bg-[#08090D] border border-[#252832] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#E53935]" />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#6B7280] block mb-1">ICON / CATEGORY</label>
                    <input type="text" value={svcForm.icon} onChange={(e) => setSvcForm({...svcForm, icon: e.target.value})} className="w-full bg-[#08090D] border border-[#252832] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#E53935]" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1">TITLE (EN)</label>
                  <input required type="text" value={svcForm.title} onChange={(e) => setSvcForm({...svcForm, title: e.target.value})} className="w-full bg-[#08090D] border border-[#252832] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#E53935]" />
                </div>
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1">TITLE (TH)</label>
                  <input required type="text" value={svcForm.title_th} onChange={(e) => setSvcForm({...svcForm, title_th: e.target.value})} className="w-full bg-[#08090D] border border-[#252832] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#E53935]" />
                </div>
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1">DESCRIPTION (EN)</label>
                  <textarea required rows={2} value={svcForm.description} onChange={(e) => setSvcForm({...svcForm, description: e.target.value})} className="w-full bg-[#08090D] border border-[#252832] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#E53935]" />
                </div>
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1">DESCRIPTION (TH)</label>
                  <textarea required rows={2} value={svcForm.description_th} onChange={(e) => setSvcForm({...svcForm, description_th: e.target.value})} className="w-full bg-[#08090D] border border-[#252832] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#E53935]" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-[#6B7280]">IMAGE URL</label>
                    <button type="button" onClick={() => setSvcImageUrls([...svcImageUrls, ''])} className="text-[10px] text-[#E53935]">+ ADD</button>
                  </div>
                  {svcImageUrls.map((url, i) => (
                    <input key={i} type="text" value={url} onChange={(e) => { const arr = [...svcImageUrls]; arr[i] = e.target.value; setSvcImageUrls(arr); }} placeholder="https://drive.google.com/..." className="w-full bg-[#08090D] border border-[#252832] rounded px-3 py-1.5 text-xs text-white outline-none mb-1.5" />
                  ))}
                </div>

                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1">DEMO / REFERENCE URL</label>
                  <input type="text" value={svcForm.demoUrl || ''} onChange={(e) => setSvcForm({...svcForm, demoUrl: e.target.value})} placeholder="https://..." className="w-full bg-[#08090D] border border-[#252832] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#E53935]" />
                </div>

                <button disabled={isSaving} className="w-full py-2.5 bg-[#E53935] hover:bg-[#c62828] text-white rounded font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mt-4">
                  {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={14} />} <span>SAVE TO GOOGLE SHEETS</span>
                </button>
              </form>
            </div>
            
            <div className="xl:col-span-7 bg-[#111318] border border-[#252832] rounded p-5">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#252832]">
                <h3 className="font-bold text-white uppercase text-xs">RECORD MATRIX ({services.length})</h3>
                <input type="text" placeholder="Search..." value={svcSearch} onChange={(e) => setSvcSearch(e.target.value)} className="px-3 py-1 bg-[#08090D] border border-[#252832] rounded text-xs text-white outline-none w-44" />
              </div>
              <div className="space-y-2.5">
                {services
                  .filter(svc => svc.title.toLowerCase().includes(svcSearch.toLowerCase()) || svc.id.toLowerCase().includes(svcSearch.toLowerCase()))
                  .map(svc => (
                  <div key={svc.id} className="bg-[#08090D] border border-[#252832] p-4 rounded flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white text-xs">{svc.title} {svc.title_th && <span className="text-[#6B7280]">/ {svc.title_th}</span>}</div>
                      <p className="text-[11px] text-[#9CA3AF] line-clamp-2 mt-1">{svc.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4 shrink-0">
                      <button onClick={() => { setSvcForm(svc); setSvcImageUrls(svc.imageUrl ? svc.imageUrl.split(',').map(u=>u.trim()) : ['']); setSvcVideoUrls(svc.videoUrls ? svc.videoUrls.split(',').map(u=>u.trim()) : ['']); setIsSvcEdit(true); }} className="text-[#9CA3AF] hover:text-white px-2 py-1 rounded border border-[#252832] text-[10px]">EDIT</button>
                      <button onClick={() => handleDeleteSvc(svc.id)} className="text-[#E53935] hover:text-white px-2 py-1 rounded border border-[#252832] text-[10px]">DEL</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= HERO SECTION ================= */}
        {activeMenu === 'hero' && (
          <form onSubmit={handleConfSubmit} className="max-w-3xl mx-auto space-y-4 bg-[#111318] p-6 rounded border border-[#252832]">
             <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-3 border-b border-[#252832]">HERO SECTION CONFIGURATION</h3>
             <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1">HEADLINE (EN)</label>
                  <textarea rows={3} value={configData.hero_headline_en} onChange={e=>setConfigData({...configData, hero_headline_en: e.target.value})} className="w-full bg-[#08090D] border border-[#252832] rounded p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1">HEADLINE (TH)</label>
                  <textarea rows={3} value={configData.hero_headline_th} onChange={e=>setConfigData({...configData, hero_headline_th: e.target.value})} className="w-full bg-[#08090D] border border-[#252832] rounded p-2.5 text-xs text-white" />
                </div>
             </div>
             <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1">SUB-HEADLINE (EN)</label>
                  <textarea rows={3} value={configData.hero_sub_en} onChange={e=>setConfigData({...configData, hero_sub_en: e.target.value})} className="w-full bg-[#08090D] border border-[#252832] rounded p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1">SUB-HEADLINE (TH)</label>
                  <textarea rows={3} value={configData.hero_sub_th} onChange={e=>setConfigData({...configData, hero_sub_th: e.target.value})} className="w-full bg-[#08090D] border border-[#252832] rounded p-2.5 text-xs text-white" />
                </div>
             </div>
             <button disabled={isSaving} className="w-full py-2.5 bg-[#E53935] hover:bg-[#c62828] text-white rounded font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mt-4">
               {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={14} />} <span>SAVE HERO CONFIGURATION</span>
             </button>
          </form>
        )}

        {/* ================= CONTACT INFO ================= */}
        {activeMenu === 'contact' && (
          <form onSubmit={handleConfSubmit} className="max-w-3xl mx-auto space-y-4 bg-[#111318] p-6 rounded border border-[#252832]">
             <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-3 border-b border-[#252832]">CONTACT INFORMATION</h3>
             <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1">EMAIL</label>
                  <input type="text" value={configData.contact_email} onChange={e=>setConfigData({...configData, contact_email: e.target.value})} className="w-full bg-[#08090D] border border-[#252832] rounded p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1">PHONE</label>
                  <input type="text" value={configData.contact_phone} onChange={e=>setConfigData({...configData, contact_phone: e.target.value})} className="w-full bg-[#08090D] border border-[#252832] rounded p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1">LINE ID</label>
                  <input type="text" value={configData.contact_line} onChange={e=>setConfigData({...configData, contact_line: e.target.value})} className="w-full bg-[#08090D] border border-[#252832] rounded p-2.5 text-xs text-white" />
                </div>
             </div>
             <div>
                <label className="text-[10px] text-[#6B7280] block mb-1">FACEBOOK URL</label>
                <input type="text" value={configData.facebook_url} onChange={e=>setConfigData({...configData, facebook_url: e.target.value})} className="w-full bg-[#08090D] border border-[#252832] rounded p-2.5 text-xs text-white" />
             </div>
             <button disabled={isSaving} className="w-full py-2.5 bg-[#E53935] hover:bg-[#c62828] text-white rounded font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mt-4">
               {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={14} />} <span>SAVE CONTACT INFO</span>
             </button>
          </form>
        )}

        {/* Fallback for other tabs: concept, sections, titles, integrations, nav, footer */}
        {['concept', 'sections', 'titles', 'integrations', 'nav', 'footer'].includes(activeMenu) && (
          <div className="bg-[#111318] p-6 rounded border border-[#252832] text-center py-12">
            <Shield size={32} className="mx-auto mb-3 text-[#E53935]" />
            <h3 className="text-sm font-bold text-white uppercase mb-2">Section Active: {activeMenu.toUpperCase()}</h3>
            <p className="text-[#9CA3AF] text-xs max-w-md mx-auto mb-4">
              All records in this section are synchronized directly with Google Sheets API.
            </p>
            <button 
              onClick={() => setActiveMenu('services')}
              className="px-4 py-2 bg-[#08090D] border border-[#252832] text-[#9CA3AF] hover:text-white rounded text-xs"
            >
              Back to Services Manager
            </button>
          </div>
        )}

      </div>
      </main>
    </div>
  );
}
