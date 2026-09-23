"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Save, Loader2, CheckCircle2, AlertCircle, LayoutDashboard, Server, 
  RefreshCw, LogOut, Settings, Link as LinkIcon, Trash2, Search,
  Menu as MenuIcon, X, Type, Zap, Lightbulb, Star, Phone, Globe, ChevronRight, Plus, 
  FileText, Image as ImageIcon, ExternalLink, ShieldCheck, FolderPlus,
  Layers, ArrowUpRight, Check, HelpCircle, Info, Edit3, ArrowLeft,
  Sliders, Eye, Sparkles, Mail, MessageSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { convertToDirectLink } from '../../lib/utils/drive';

// ================= TYPES =================
interface ServiceData {
  id: string; 
  title: string; 
  description: string; 
  title_th?: string; 
  description_th?: string; 
  icon: string; 
  imageUrl: string; 
  demoUrl?: string; 
  videoUrls?: string;
  manualUrl?: string;
}

interface IntegrationData {
  id: string; 
  title: string; 
  description: string; 
  title_th?: string; 
  description_th?: string; 
  imageUrl: string; 
  tag: string; 
  referenceUrl: string;
  manualUrl?: string;
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
  why_badge_en: string; why_badge_th: string;
  why_choose_title_en: string; why_choose_title_th: string;
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

const emptySvc: ServiceData = { id: '', title: '', description: '', title_th: '', description_th: '', icon: '', imageUrl: '', demoUrl: '', videoUrls: '', manualUrl: '' };
const emptyInt: IntegrationData = { id: '', title: '', description: '', title_th: '', description_th: '', imageUrl: '', tag: '', referenceUrl: '', manualUrl: '' };
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
  why_badge_en: '', why_badge_th: '',
  why_choose_title_en: '', why_choose_title_th: '',
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

// Categorized navigation structure for clear separation
interface MenuCategory {
  categoryTitle: string;
  categoryDesc?: string;
  items: {
    id: string;
    label: string;
    labelEn: string;
    icon: any;
    countKey?: 'services' | 'integrations' | 'concepts' | 'sections' | 'nav';
  }[];
}

export default function AdminDashboard() {
  const router = useRouter();

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

  // Clearly separated menu groups
  const MENU_CATEGORIES: MenuCategory[] = [
    {
      categoryTitle: 'ข้อมูลหลัก & ผลงาน',
      categoryDesc: 'จัดการผลงานจริงและระบบที่พัฒนา',
      items: [
        { id: 'dashboard', label: 'ภาพรวมระบบ', labelEn: 'Overview', icon: LayoutDashboard },
        { id: 'services', label: 'บริการและผลงานจริง', labelEn: 'Services & Works', icon: Server, countKey: 'services' },
        { id: 'integrations', label: 'ระบบการทำงาน / IoT', labelEn: 'Portfolio Systems', icon: LinkIcon, countKey: 'integrations' },
      ]
    },
    {
      categoryTitle: 'เนื้อหาหน้าเว็บไซต์',
      categoryDesc: 'จัดการข้อความ รูปภาพ และส่วนต่างๆ ของ Landing Page',
      items: [
        { id: 'hero', label: 'ส่วนหลักหน้าแรก', labelEn: 'Hero Section', icon: Zap },
        { id: 'nav', label: 'เมนูนำทาง (Header)', labelEn: 'Navigation', icon: Type, countKey: 'nav' },
        { id: 'concept', label: 'จุดเด่น & คอนเซปต์', labelEn: 'Concepts', icon: Lightbulb, countKey: 'concepts' },
        { id: 'sections', label: 'ส่วนเสริมหน้าเว็บ', labelEn: 'Custom Sections', icon: FolderPlus, countKey: 'sections' },
        { id: 'titles', label: 'หัวข้อเนื้อหา', labelEn: 'Section Titles', icon: Star },
      ]
    },
    {
      categoryTitle: 'ข้อมูลติดต่อ & การแสดงผล',
      categoryDesc: 'ช่องทางติดต่อและส่วนล่างของเว็บไซต์',
      items: [
        { id: 'contact', label: 'ข้อมูลการติดต่อ', labelEn: 'Contact Info', icon: Phone },
        { id: 'footer', label: 'ส่วนท้ายเว็บ (Footer)', labelEn: 'Footer & Links', icon: Globe },
      ]
    }
  ];

  // ================= FETCHING =================
  const fetchServices = async () => {
    setIsLoadingSvc(true);
    try {
      const res = await fetch('/api/services', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setServices(json.data);
    } catch { } finally { setIsLoadingSvc(false); }
  };

  const fetchIntegrations = async () => {
    setIsLoadingInt(true);
    try {
      const res = await fetch('/api/integrations', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setIntegrations(json.data);
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
      if (json.success && Array.isArray(json.data)) setNavItems(json.data);
    } catch { }
  };

  const fetchConcepts = async () => {
    try {
      const res = await fetch('/api/concept', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setConcepts(json.data);
    } catch { }
  };

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/sections', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setSections(json.data);
    } catch { }
  };

  const fetchSectionItems = async () => {
    try {
      const res = await fetch('/api/section-items', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setSectionItems(json.data);
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
        setStatus({ type: 'success', message: 'บันทึกบริการ/ผลงานเรียบร้อยแล้ว!' });
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
        setStatus({ type: 'success', message: 'บันทึกระบบงานเรียบร้อยแล้ว!' });
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
        setStatus({ type: 'success', message: 'บันทึกการตั้งค่าเรียบร้อยแล้ว!' });
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
        setStatus({ type: 'success', message: 'บันทึกเมนูเรียบร้อยแล้ว!' });
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
        setStatus({ type: 'success', message: 'บันทึกคอนเซปต์เรียบร้อยแล้ว!' });
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
        setStatus({ type: 'success', message: 'บันทึกส่วนเสริมเรียบร้อยแล้ว!' });
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
        setStatus({ type: 'success', message: 'บันทึกรายการย่อยเรียบร้อยแล้ว!' });
        setSectionItemForm(emptySectionItem); setIsSectionItemEdit(false); fetchSectionItems();
      } else throw new Error(data.error);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'บันทึกไม่สำเร็จ' });
    } finally { setIsSaving(false); }
  };

  const handleDeleteSvc = async (id: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผลงานรหัส ${id}?`)) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'ลบผลงานเรียบร้อยแล้ว!' });
        fetchServices();
      } else throw new Error(data.error);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'ลบไม่สำเร็จ' });
    } finally { setIsSaving(false); }
  };

  const handleDeleteInt = async (id: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรายการรหัส ${id}?`)) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/integrations?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'ลบรายการเรียบร้อยแล้ว!' });
        fetchIntegrations();
      } else throw new Error(data.error);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'ลบไม่สำเร็จ' });
    } finally { setIsSaving(false); }
  };

  const handleDeleteNav = async (id: string) => {
    if (!confirm(`ยืนยันการลบเมนูรหัส ${id}?`)) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/nav?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { fetchNav(); setStatus({ type: 'success', message: 'ลบเมนูเรียบร้อยแล้ว!' }); }
      else throw new Error(data.error);
    } catch (err: any) { setStatus({ type: 'error', message: err.message }); }
    finally { setIsSaving(false); }
  };

  const handleDeleteConcept = async (id: string) => {
    if (!confirm(`ยืนยันการลบคอนเซปต์รหัส ${id}?`)) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/concept?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { fetchConcepts(); setStatus({ type: 'success', message: 'ลบคอนเซปต์เรียบร้อยแล้ว!' }); }
      else throw new Error(data.error);
    } catch (err: any) { setStatus({ type: 'error', message: err.message }); }
    finally { setIsSaving(false); }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm(`ยืนยันการลบส่วนเสริมรหัส ${id}?`)) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/sections?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { fetchSections(); setStatus({ type: 'success', message: 'ลบส่วนเสริมเรียบร้อยแล้ว!' }); }
      else throw new Error(data.error);
    } catch (err: any) { setStatus({ type: 'error', message: err.message }); }
    finally { setIsSaving(false); }
  };

  const handleDeleteSectionItem = async (id: string) => {
    if (!confirm(`ยืนยันการลบรายการย่อยรหัส ${id}?`)) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/section-items?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { fetchSectionItems(); setStatus({ type: 'success', message: 'ลบรายการย่อยเรียบร้อยแล้ว!' }); }
      else throw new Error(data.error);
    } catch (err: any) { setStatus({ type: 'error', message: err.message }); }
    finally { setIsSaving(false); }
  };

  // Helper count getter
  const getItemCount = (key?: string) => {
    if (key === 'services') return services.length;
    if (key === 'integrations') return integrations.length;
    if (key === 'concepts') return concepts.length;
    if (key === 'sections') return sections.length;
    if (key === 'nav') return navItems.length;
    return undefined;
  };

  // Find active menu info
  let activeMenuTitle = 'ภาพรวมระบบ';
  let activeMenuSubtitle = 'Overview';
  for (const cat of MENU_CATEGORIES) {
    const found = cat.items.find(i => i.id === activeMenu);
    if (found) {
      activeMenuTitle = found.label;
      activeMenuSubtitle = found.labelEn;
      break;
    }
  }

  // ================= RENDER STATUS TOAST =================
  const renderStatus = () => status.type && (
    <div className={`px-4 py-2 rounded-xl border-2 text-xs flex items-center gap-2 shadow-md transition-all font-bold ${
      status.type === 'success' 
        ? 'bg-emerald-50 border-emerald-400 text-emerald-950' 
        : 'bg-rose-50 border-rose-400 text-rose-950'
    }`}>
      {status.type === 'success' ? (
        <CheckCircle2 size={16} className="text-[#059669] shrink-0" />
      ) : (
        <AlertCircle size={16} className="text-[#E11D48] shrink-0" />
      )}
      <span>{status.message}</span>
      <button onClick={() => setStatus({ type: null, message: '' })} className="ml-1 text-slate-500 hover:text-slate-900">
        <X size={13} />
      </button>
    </div>
  );

  // Category theme styling for distinct visual differentiation
  const CATEGORY_THEMES = [
    {
      badge: 'bg-rose-100 text-rose-950 border-rose-300',
      activeBg: 'bg-rose-50 text-[#E11D48] border-2 border-rose-300 shadow-sm font-bold',
      activeIcon: 'text-[#E11D48]',
      activeSub: 'text-[#EA580C] font-semibold',
      indicator: 'bg-[#E11D48]',
    },
    {
      badge: 'bg-sky-100 text-sky-950 border-sky-300',
      activeBg: 'bg-sky-50 text-[#0284C7] border-2 border-sky-300 shadow-sm font-bold',
      activeIcon: 'text-[#0284C7]',
      activeSub: 'text-[#0284C7] font-semibold',
      indicator: 'bg-[#0284C7]',
    },
    {
      badge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      activeBg: 'bg-emerald-50 text-[#059669] border-2 border-emerald-300 shadow-sm font-bold',
      activeIcon: 'text-[#059669]',
      activeSub: 'text-[#059669] font-semibold',
      indicator: 'bg-[#059669]',
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] font-sans antialiased flex flex-col lg:flex-row relative">
      
      {/* Light Tech Grid Background (matching front-end) */}
      <div className="fixed inset-0 bg-tech-grid-light opacity-60 pointer-events-none z-0" />

      {/* Ambient Radial Halos (matching front-end) */}
      <div className="fixed top-0 right-0 w-[550px] h-[400px] bg-rose-100/40 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[350px] bg-sky-100/40 blur-[130px] pointer-events-none -z-10" />

      {/* Mobile Drawer Backdrop */}
      {isMobileDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* ================= SIDEBAR (DESKTOP & MOBILE DRAWER) ================= */}
      <aside className={`
        fixed lg:sticky top-0 inset-y-0 left-0 z-50 lg:z-30
        h-screen bg-white/95 backdrop-blur-md border-r-2 border-slate-200/90
        flex flex-col shadow-sm transition-all duration-300
        ${isMobileDrawerOpen ? 'translate-x-0 w-[85vw] max-w-xs' : '-translate-x-full lg:translate-x-0'}
        ${isSidebarOpen ? 'lg:w-72' : 'lg:w-20'}
      `}>
        {/* Brand Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b-2 border-slate-200/90 h-18 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group focus:outline-none overflow-hidden">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200 bg-white p-0.5 shadow-2xs flex items-center justify-center shrink-0 group-hover:border-[#E11D48] transition-colors">
              <img src="/logo.jpg" alt="DeeDevIoT" className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform" />
            </div>
            {(isSidebarOpen || isMobileDrawerOpen) && (
              <div className="font-mono text-base tracking-wider font-bold truncate">
                <span className="text-slate-950 group-hover:text-[#E11D48] transition-colors font-extrabold">DEEDEV</span>
                <span className="text-[#EA580C] mx-0.5 font-black">/</span>
                <span className="bg-gradient-to-r from-[#E11D48] to-[#EA580C] bg-clip-text text-transparent font-black">ADMIN</span>
              </div>
            )}
          </Link>

          <div className="flex items-center gap-1">
            {/* Mobile close button */}
            <button 
              onClick={() => setIsMobileDrawerOpen(false)} 
              className="lg:hidden p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center touch-target"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            {/* Desktop collapse toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title={isSidebarOpen ? "ย่อเมนู" : "ขยายเมนู"}
            >
              {isSidebarOpen ? <X size={16} /> : <MenuIcon size={16} />}
            </button>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="flex-1 overflow-y-auto p-3.5 space-y-6 text-xs">
          {MENU_CATEGORIES.map((category, catIdx) => {
            const theme = CATEGORY_THEMES[catIdx] || CATEGORY_THEMES[0];

            return (
              <div key={catIdx} className="space-y-2">
                {(isSidebarOpen || isMobileDrawerOpen) && (
                  <div className="px-2 pt-1 pb-1">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider mb-1 shadow-2xs border ${theme.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${theme.indicator}`} />
                      <span>{category.categoryTitle}</span>
                    </div>
                    {category.categoryDesc && (
                      <p className="text-[10px] text-slate-500 hidden xl:block font-medium">
                        {category.categoryDesc}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.id;
                    const count = getItemCount(item.countKey);

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveMenu(item.id);
                          setStatus({ type: null, message: '' });
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                          isActive
                            ? theme.activeBg
                            : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-semibold border-2 border-transparent'
                        }`}
                        title={!isSidebarOpen && !isMobileDrawerOpen ? `${item.label} (${item.labelEn})` : undefined}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <Icon 
                            size={18} 
                            className={`shrink-0 transition-colors ${
                              isActive ? theme.activeIcon : 'text-slate-500 group-hover:text-slate-800'
                            }`} 
                          />
                          {(isSidebarOpen || isMobileDrawerOpen) && (
                            <div className="truncate">
                              <span className="block text-xs truncate leading-tight">{item.label}</span>
                              <span className={`block text-[10px] font-mono ${isActive ? theme.activeSub : 'text-slate-500'}`}>
                                {item.labelEn}
                              </span>
                            </div>
                          )}
                        </div>

                        {(isSidebarOpen || isMobileDrawerOpen) && count !== undefined && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ml-2 shadow-2xs ${
                            isActive
                              ? 'bg-slate-950 text-white'
                              : 'bg-slate-200 text-slate-800 border border-slate-300'
                          }`}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="p-3.5 border-t-2 border-slate-200/90 bg-slate-50/70 space-y-2 shrink-0">
          {/* Quick link to front-end */}
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-900 hover:text-[#E11D48] bg-white hover:bg-slate-100 border-2 border-slate-300 hover:border-slate-400 transition-all shadow-xs"
            title="เปิดดูเว็บไซต์หน้าบ้านในแท็บใหม่"
          >
            <ExternalLink size={14} className="text-slate-600 shrink-0" />
            {(isSidebarOpen || isMobileDrawerOpen) && <span>ดูหน้าเว็บจริง</span>}
          </Link>

          {/* Quick link to HTML Showcase */}
          <a
            href="https://html-show.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-amber-950 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 hover:border-amber-400 transition-all shadow-xs"
            title="เปิดดูเว็บแนะนำรวมตัวอย่าง HTML (html-show.vercel.app)"
          >
            <Sparkles size={14} className="text-[#EA580C] shrink-0" />
            {(isSidebarOpen || isMobileDrawerOpen) && <span>รวมตัวอย่าง HTML ↗</span>}
          </a>

          {/* Logout */}
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-800 hover:text-rose-950 bg-rose-50 hover:bg-rose-100 transition-colors border-2 border-rose-200 hover:border-rose-300 shadow-xs"
            title="ออกจากระบบ"
          >
            <LogOut size={14} className="shrink-0" />
            {(isSidebarOpen || isMobileDrawerOpen) && <span>ออกจากระบบ</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen relative z-10">
        
        {/* Top Navbar */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-slate-200/90 z-20 px-4 sm:px-8 py-3 flex items-center justify-between min-h-[64px] gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl border-2 border-slate-300 bg-white text-slate-800 hover:text-slate-950 shadow-xs min-h-[44px] min-w-[44px] flex items-center justify-center touch-target"
              aria-label="เปิดเมนู"
            >
              <MenuIcon size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono font-semibold hidden sm:inline">CONTROL PANEL /</span>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
                  <span>{activeMenuTitle}</span>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">({activeMenuSubtitle})</span>
                </h2>
              </div>
              <p className="text-[11px] text-slate-600 font-medium hidden md:block">
                ระบบจัดการเนื้อหา DeeDev IOT เชื่อมต่อกับ Google Sheets อัตโนมัติ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-100/90 border-2 border-emerald-300 rounded-full text-[11px] font-bold text-emerald-900 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Google Sheets Online</span>
            </div>

            {/* Status Toast */}
            {renderStatus()}
          </div>
        </header>

        {/* Page Container */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">

          {/* ================= 01. DASHBOARD OVERVIEW ================= */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Welcome Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-rose-500/15 via-orange-500/10 to-amber-500/15 border-2 border-rose-300 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="max-w-2xl relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white text-[#E11D48] border-2 border-rose-200 shadow-xs">
                    <Sparkles size={13} />
                    <span>DEEDEV IOT BACKOFFICE</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                    ยินดีต้อนรับสู่ระบบหลังบ้าน DeeDev IOT
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    จัดการข้อมูลบริการ ผลงานจริง ระบบเชื่อมต่อ และเนื้อหาหน้าเว็บไซต์ได้อย่างสะดวกและปลอดภัย ข้อมูลจะถูกบันทึกและซิงก์ตรงเข้าสู่ Google Sheets แบบเรียลไทม์
                  </p>
                </div>

                <div className="absolute right-6 -bottom-8 opacity-15 hidden md:block pointer-events-none">
                  <Server size={200} className="text-rose-600" />
                </div>
              </div>

              {/* Metrics Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metric 1: Services */}
                <div 
                  onClick={() => setActiveMenu('services')}
                  className="bg-white p-5 rounded-2xl border-2 border-rose-300 hover:border-rose-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-11 h-11 rounded-xl bg-rose-100 text-[#E11D48] border border-rose-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Server size={20} />
                    </div>
                    <span className="text-3xl font-black text-slate-950 font-mono">{services.length}</span>
                  </div>
                  <h3 className="font-bold text-slate-950 text-sm group-hover:text-[#E11D48] transition-colors">
                    บริการและผลงานจริง
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">Services & Real Works</p>
                  <div className="mt-3 pt-3 border-t-2 border-slate-100 flex items-center justify-between text-xs text-rose-700 font-bold group-hover:text-[#E11D48]">
                    <span>จัดการข้อมูล</span>
                    <ChevronRight size={15} />
                  </div>
                </div>

                {/* Metric 2: Portfolio */}
                <div 
                  onClick={() => setActiveMenu('integrations')}
                  className="bg-white p-5 rounded-2xl border-2 border-amber-300 hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 text-[#EA580C] border border-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <LinkIcon size={20} />
                    </div>
                    <span className="text-3xl font-black text-slate-950 font-mono">{integrations.length}</span>
                  </div>
                  <h3 className="font-bold text-slate-950 text-sm group-hover:text-[#EA580C] transition-colors">
                    ระบบการทำงาน / IoT
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">Portfolio & Systems</p>
                  <div className="mt-3 pt-3 border-t-2 border-slate-100 flex items-center justify-between text-xs text-amber-700 font-bold group-hover:text-[#EA580C]">
                    <span>จัดการข้อมูล</span>
                    <ChevronRight size={15} />
                  </div>
                </div>

                {/* Metric 3: Concepts */}
                <div 
                  onClick={() => setActiveMenu('concept')}
                  className="bg-white p-5 rounded-2xl border-2 border-sky-300 hover:border-sky-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-11 h-11 rounded-xl bg-sky-100 text-[#0284C7] border border-sky-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Lightbulb size={20} />
                    </div>
                    <span className="text-3xl font-black text-slate-950 font-mono">{concepts.length}</span>
                  </div>
                  <h3 className="font-bold text-slate-950 text-sm group-hover:text-[#0284C7] transition-colors">
                    จุดเด่นและคอนเซปต์
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">Core Features & USP</p>
                  <div className="mt-3 pt-3 border-t-2 border-slate-100 flex items-center justify-between text-xs text-sky-700 font-bold group-hover:text-[#0284C7]">
                    <span>จัดการข้อมูล</span>
                    <ChevronRight size={15} />
                  </div>
                </div>

                {/* Metric 4: Connection */}
                <div className="bg-white p-5 rounded-2xl border-2 border-emerald-300 shadow-xs">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#059669] border border-emerald-200 flex items-center justify-center">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-600 text-white font-mono font-bold shadow-2xs">
                      ACTIVE
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-950 text-sm">
                    Google Sheets เชื่อมต่อปกติ
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">บันทึกข้อมูลแบบเรียลไทม์</p>
                  <div className="mt-3 pt-3 border-t-2 border-slate-100 flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>พร้อมรับคำสั่งแก้ไข</span>
                  </div>
                </div>

              </div>

              {/* Quick Navigation Shortcuts */}
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-950">
                      ทางลัดจัดการข้อมูล (Direct Shortcuts)
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      คลิกเพื่อไปยังส่วนที่ต้องการปรับปรุงได้อย่างรวดเร็ว
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">FAST ACCESS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  
                  <button 
                    onClick={() => setActiveMenu('services')}
                    className="p-4 border-2 border-slate-200 rounded-xl bg-slate-50/70 hover:bg-white hover:border-rose-300 hover:shadow-md transition-all text-left flex items-start justify-between group"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-extrabold text-slate-950 block group-hover:text-[#E11D48] transition-colors">
                        จัดการบริการและผลงานจริง
                      </span>
                      <span className="text-[11px] text-slate-600 font-medium block leading-normal">
                        เพิ่ม/แก้ไข ภาพปก, ลิงก์ดูงานจริง, และคู่มือ
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-[#E11D48] shrink-0 mt-0.5" />
                  </button>

                  <button 
                    onClick={() => setActiveMenu('integrations')}
                    className="p-4 border-2 border-slate-200 rounded-xl bg-slate-50/70 hover:bg-white hover:border-amber-300 hover:shadow-md transition-all text-left flex items-start justify-between group"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-extrabold text-slate-950 block group-hover:text-[#EA580C] transition-colors">
                        จัดการระบบ IoT & Portfolio
                      </span>
                      <span className="text-[11px] text-slate-600 font-medium block leading-normal">
                        แก้ไขแท็กเทคโนโลยี, ลิงก์ระบบ, ภาพตัวอย่าง
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-[#EA580C] shrink-0 mt-0.5" />
                  </button>

                  <button 
                    onClick={() => setActiveMenu('hero')}
                    className="p-4 border-2 border-slate-200 rounded-xl bg-slate-50/70 hover:bg-white hover:border-rose-300 hover:shadow-md transition-all text-left flex items-start justify-between group"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-extrabold text-slate-950 block group-hover:text-[#E11D48] transition-colors">
                        แก้ไขพาดหัวหลักหน้าแรก (Hero)
                      </span>
                      <span className="text-[11px] text-slate-600 font-medium block leading-normal">
                        เปลี่ยนข้อความพาดหัวและปุ่มติดต่อหลัก
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-[#E11D48] shrink-0 mt-0.5" />
                  </button>

                  <button 
                    onClick={() => setActiveMenu('contact')}
                    className="p-4 border-2 border-slate-200 rounded-xl bg-slate-50/70 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all text-left flex items-start justify-between group"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-extrabold text-slate-950 block group-hover:text-[#059669] transition-colors">
                        ข้อมูลการติดต่อ & LINE
                      </span>
                      <span className="text-[11px] text-slate-600 font-medium block leading-normal">
                        อัปเดต LINE ID, เบอร์โทรศัพท์, อีเมล, Facebook
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-[#059669] shrink-0 mt-0.5" />
                  </button>

                  <button 
                    onClick={() => setActiveMenu('concept')}
                    className="p-4 border-2 border-slate-200 rounded-xl bg-slate-50/70 hover:bg-white hover:border-sky-300 hover:shadow-md transition-all text-left flex items-start justify-between group"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-extrabold text-slate-950 block group-hover:text-[#0284C7] transition-colors">
                        จุดเด่นและคอนเซปต์
                      </span>
                      <span className="text-[11px] text-slate-600 font-medium block leading-normal">
                        จัดการ 4-6 จุดเด่นสำคัญและฟีเจอร์หลัก
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-[#0284C7] shrink-0 mt-0.5" />
                  </button>

                  <button 
                    onClick={() => setActiveMenu('titles')}
                    className="p-4 border-2 border-slate-200 rounded-xl bg-slate-50/70 hover:bg-white hover:border-amber-300 hover:shadow-md transition-all text-left flex items-start justify-between group"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-extrabold text-slate-950 block group-hover:text-[#EA580C] transition-colors">
                        หัวข้อเว็บไซต์ & Footer
                      </span>
                      <span className="text-[11px] text-slate-600 font-medium block leading-normal">
                        ปรับแก้ข้อความพาดหัวโซนบริการและคำอธิบาย
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-[#EA580C] shrink-0 mt-0.5" />
                  </button>

                </div>
              </div>

              {/* Sync Tips Banner */}
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 sm:p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-200/80 text-emerald-900 border border-emerald-300 flex items-center justify-center shrink-0">
                  <Sparkles size={20} />
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="font-extrabold text-emerald-950 text-sm">
                    ข้อแนะนำในการจัดการข้อมูล
                  </h4>
                  <p className="text-emerald-900 font-medium leading-relaxed">
                    เมื่อคุณทำการบันทึกข้อมูลในแต่ละหัวข้อ ระบบจะทำการบันทึกลง Google Sheets ทันทีและอัปเดตหน้าบ้านให้คุณแบบ Real-time หากข้อมูลยังไม่แสดงในหน้าเว็บ กรุณารอสักครู่หรือกดปุ่ม &quot;ซิงก์ข้อมูล&quot; ด้านบน
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ================= 02. SERVICES & REAL WORKS ================= */}
          {activeMenu === 'services' && (
            <div className="grid xl:grid-cols-12 gap-6 items-start">
              
              {/* Form Column */}
              <div className="xl:col-span-5 bg-white border-2 border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-100">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                      <Server size={18} className="text-[#E11D48]" />
                      <span>{isSvcEdit ? 'แก้ไขบริการ / ผลงานเดิม' : 'เพิ่มบริการ / ผลงานใหม่'}</span>
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {isSvcEdit ? `รหัสผลงาน: ${svcForm.id} (ระบบจะอัปเดตข้อมูลทับแถวเดิมใน Google Sheets)` : 'กรอกรายละเอียดเพื่อบันทึกลง Google Sheets'}
                    </p>
                  </div>
                  {isSvcEdit && (
                    <button 
                      type="button" 
                      onClick={() => { 
                        setSvcForm(emptySvc); 
                        setIsSvcEdit(false); 
                        setSvcImageUrls(['']); 
                        setSvcVideoUrls(['']); 
                      }} 
                      className="text-xs text-rose-900 hover:text-rose-950 font-bold px-3 py-1 rounded-lg bg-rose-100 border-2 border-rose-300 shadow-2xs hover:bg-rose-200 transition-colors"
                    >
                      ยกเลิกแก้ไข
                    </button>
                  )}
                </div>

                {isSvcEdit && (
                  <div className="mb-4 p-3 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                      <span className="text-xs font-bold text-amber-950 truncate">
                        กำลังแก้ไข: <span className="underline">{svcForm.title_th || svcForm.title}</span> (#{svcForm.id})
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { 
                        setSvcForm(emptySvc); 
                        setIsSvcEdit(false); 
                        setSvcImageUrls(['']); 
                        setSvcVideoUrls(['']); 
                      }} 
                      className="text-[11px] text-amber-900 hover:text-amber-950 font-bold px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 shrink-0 ml-2"
                    >
                      เคลียร์ฟอร์ม
                    </button>
                  </div>
                )}

                <form onSubmit={handleSvcSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        รหัส ID (เว้นว่างเพื่อสร้างอัตโนมัติ)
                      </label>
                      <input 
                        type="text" 
                        value={svcForm.id} 
                        onChange={(e) => setSvcForm({...svcForm, id: e.target.value})} 
                        placeholder="เช่น svc-1" 
                        readOnly={isSvcEdit} 
                        className={`w-full border-2 rounded-xl px-3 py-2 text-xs font-medium outline-none transition-all ${
                          isSvcEdit 
                            ? 'bg-amber-50/80 border-amber-300 text-amber-950 cursor-not-allowed font-bold' 
                            : 'bg-slate-50 border-slate-200 text-slate-950 hover:border-slate-300 focus:bg-white focus:border-[#E11D48]'
                        }`} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        หมวดหมู่ / ไอคอน
                      </label>
                      <input 
                        type="text" 
                        value={svcForm.icon} 
                        onChange={(e) => setSvcForm({...svcForm, icon: e.target.value})} 
                        placeholder="IoT / Web / System" 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#E11D48] transition-all" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      ชื่อผลงาน (ภาษาไทย) <span className="text-[#E11D48]">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={svcForm.title_th || ''} 
                      onChange={(e) => setSvcForm({...svcForm, title_th: e.target.value})} 
                      placeholder="เช่น ระบบควบคุมไฟอัจฉริยะ IoT" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#E11D48] transition-all" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      ชื่อผลงาน (English) <span className="text-[#E11D48]">*</span>
                    </label>
                    <input 
                      required 
                      type="text" 
                      value={svcForm.title} 
                      onChange={(e) => setSvcForm({...svcForm, title: e.target.value})} 
                      placeholder="e.g. Smart IoT Lighting Controller" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#E11D48] transition-all" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      รายละเอียด (ภาษาไทย)
                    </label>
                    <textarea 
                      rows={2} 
                      value={svcForm.description_th || ''} 
                      onChange={(e) => setSvcForm({...svcForm, description_th: e.target.value})} 
                      placeholder="อธิบายการทำงานและประโยชน์ของผลงาน..." 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#E11D48] transition-all leading-relaxed" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      รายละเอียด (English) <span className="text-[#E11D48]">*</span>
                    </label>
                    <textarea 
                      required 
                      rows={2} 
                      value={svcForm.description} 
                      onChange={(e) => setSvcForm({...svcForm, description: e.target.value})} 
                      placeholder="System specifications and architecture details..." 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#E11D48] transition-all leading-relaxed" 
                    />
                  </div>

                  {/* Cover Image Input + Thumbnail Preview */}
                  <div className="pt-2 border-t-2 border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <ImageIcon size={15} className="text-[#059669]" />
                        <span>ลิงก์รูปภาพปก (Cover Image URL)</span>
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setSvcImageUrls([...svcImageUrls, ''])} 
                        className="text-xs text-[#E11D48] hover:underline font-extrabold"
                      >
                        + เพิ่มรูปภาพ
                      </button>
                    </div>

                    <div className="space-y-2">
                      {svcImageUrls.map((url, i) => (
                        <div key={i} className="space-y-1">
                          <input 
                            type="text" 
                            value={url} 
                            onChange={(e) => { 
                              const arr = [...svcImageUrls]; 
                              arr[i] = e.target.value; 
                              setSvcImageUrls(arr); 
                            }} 
                            placeholder="https://drive.google.com/... หรือ Direct Link รูปภาพ" 
                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-emerald-500 transition-all" 
                          />
                          {url.trim() && (
                            <div className="flex items-center gap-2.5 p-2 bg-slate-100 rounded-xl border-2 border-slate-200">
                              <img 
                                src={convertToDirectLink(url)} 
                                alt="preview" 
                                className="w-12 h-12 object-cover rounded-lg bg-white border-2 border-slate-300 shrink-0" 
                                onError={(e) => (e.currentTarget.style.display = 'none')} 
                              />
                              <span className="text-[11px] text-slate-700 font-bold truncate">
                                ตัวอย่างรูปภาพ (Direct Preview)
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                      รองรับลิงก์ Google Drive โดยตรง (ระบบแปลงให้ทันที)
                    </span>
                  </div>

                  {/* Content / Demo Link */}
                  <div>
                    <label className="text-xs font-bold text-sky-900 block mb-1 flex items-center gap-1.5">
                      <ExternalLink size={15} className="text-[#0284C7]" />
                      <span>ลิงก์เปิดดูเนื้อหา / Live Demo URL</span>
                    </label>
                    <input 
                      type="text" 
                      value={svcForm.demoUrl || ''} 
                      onChange={(e) => setSvcForm({...svcForm, demoUrl: e.target.value})} 
                      placeholder="https://your-project.vercel.app" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all" 
                    />
                  </div>

                  {/* Manual / Documentation Link */}
                  <div>
                    <label className="text-xs font-bold text-amber-900 block mb-1 flex items-center gap-1.5">
                      <FileText size={15} className="text-[#EA580C]" />
                      <span>ลิงก์คู่มือการใช้งาน (Manual / Docs URL)</span>
                    </label>
                    <input 
                      type="text" 
                      value={svcForm.manualUrl || ''} 
                      onChange={(e) => setSvcForm({...svcForm, manualUrl: e.target.value})} 
                      placeholder="https://docs.google.com/... หรือ ลิงก์ PDF" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#EA580C] transition-all" 
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    disabled={isSaving} 
                    className={`w-full py-3.5 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4 shadow-md hover:shadow-lg ${
                      isSvcEdit 
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 ring-2 ring-amber-300' 
                        : 'bg-gradient-to-r from-[#E11D48] to-[#EA580C] hover:opacity-95'
                    }`}
                  >
                    {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={15} />} 
                    <span>{isSvcEdit ? '✓ อัปเดตข้อมูลผลงานเดิม (Update Work)' : '+ บันทึกลง Google Sheets (Add New)'}</span>
                  </button>
                </form>
              </div>

              {/* List Column */}
              <div className="xl:col-span-7 bg-white border-2 border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b-2 border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-950 text-sm">
                      รายการผลงานจริงทั้งหมด ({services.length})
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium">
                      แสดงผลงานที่ดึงมาจากแท็บ Services ใน Google Sheets
                    </p>
                  </div>
                  <div className="relative w-full sm:w-56">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="ค้นหาชื่อผลงาน, รหัส..." 
                      value={svcSearch} 
                      onChange={(e) => setSvcSearch(e.target.value)} 
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#E11D48]" 
                    />
                  </div>
                </div>

                {isLoadingSvc ? (
                  <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin w-6 h-6 text-[#E11D48]" />
                    <span className="font-bold">กำลังโหลดข้อมูลจาก Google Sheets...</span>
                  </div>
                ) : services.length === 0 ? (
                  <div className="p-12 text-center text-slate-600 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/70">
                    <Server size={36} className="mx-auto text-slate-400 mb-2" />
                    <p className="font-bold text-slate-900">ยังไม่มีข้อมูลบริการหรือผลงาน</p>
                    <p className="text-xs text-slate-500 mt-1">สามารถเพิ่มข้อมูลผ่านฟอร์มด้านซ้ายได้ทันที</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {services
                      .filter(svc => 
                        svc.title.toLowerCase().includes(svcSearch.toLowerCase()) || 
                        (svc.title_th && svc.title_th.toLowerCase().includes(svcSearch.toLowerCase())) || 
                        svc.id.toLowerCase().includes(svcSearch.toLowerCase())
                      )
                      .map(svc => {
                        const isCurrentlyEditing = isSvcEdit && svcForm.id === svc.id;
                        return (
                          <div 
                            key={svc.id} 
                            className={`p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start gap-4 transition-all shadow-xs ${
                              isCurrentlyEditing 
                                ? 'bg-amber-50/80 border-2 border-amber-400 ring-2 ring-amber-300/70 shadow-md' 
                                : 'bg-white hover:bg-slate-50/90 border-2 border-slate-200/90 hover:border-slate-300'
                            }`}
                          >
                            {/* Thumbnail on left */}
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              {svc.imageUrl ? (
                                <img 
                                  src={convertToDirectLink(svc.imageUrl.split(',')[0])} 
                                  alt="thumb" 
                                  className="w-14 h-14 rounded-lg object-cover bg-white border-2 border-slate-300 shrink-0 shadow-2xs"
                                  onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-lg bg-slate-100 text-slate-400 border-2 border-slate-200 flex items-center justify-center shrink-0">
                                  <ImageIcon size={20} />
                                </div>
                              )}

                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-extrabold text-slate-950 text-xs">
                                    {svc.title_th || svc.title}
                                  </span>
                                  {svc.title_th && svc.title && (
                                    <span className="text-slate-600 text-[11px] font-medium">({svc.title})</span>
                                  )}
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-rose-100 text-rose-950 border border-rose-300 font-bold">
                                    {svc.icon || 'Service'}
                                  </span>
                                  <span className="text-slate-600 text-[10px] font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                    #{svc.id}
                                  </span>
                                  {isCurrentlyEditing && (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-950 border border-amber-300 animate-pulse">
                                      กำลังแก้ไขอยู่นี้
                                    </span>
                                  )}
                                </div>

                                <p className="text-[11px] text-slate-700 font-medium line-clamp-2 leading-relaxed">
                                  {svc.description_th || svc.description}
                                </p>

                                <div className="flex flex-wrap gap-2 text-[10px] pt-1">
                                  {svc.imageUrl && (
                                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold flex items-center gap-1 shadow-2xs">
                                      <ImageIcon size={12} /> มีภาพประกอบ
                                    </span>
                                  )}
                                  {svc.demoUrl && (
                                    <a 
                                      href={svc.demoUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-950 border border-sky-300 font-bold flex items-center gap-1 hover:underline shadow-2xs"
                                    >
                                      <ExternalLink size={12} /> เปิดดูเนื้อหา
                                    </a>
                                  )}
                                  {svc.manualUrl && (
                                    <a 
                                      href={svc.manualUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 border border-amber-300 font-bold flex items-center gap-1 hover:underline shadow-2xs"
                                    >
                                      <FileText size={12} /> ดูคู่มือ
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 shrink-0 self-end sm:self-start">
                              <button 
                                onClick={() => { 
                                  setSvcForm(svc); 
                                  setSvcImageUrls(svc.imageUrl ? svc.imageUrl.split(',').map(u=>u.trim()) : ['']); 
                                  setSvcVideoUrls(svc.videoUrls ? svc.videoUrls.split(',').map(u=>u.trim()) : ['']); 
                                  setIsSvcEdit(true); 
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} 
                                className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors ${
                                  isCurrentlyEditing 
                                    ? 'bg-amber-500 text-white border-amber-600' 
                                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-900'
                                }`}
                              >
                                <Edit3 size={13} />
                                <span>{isCurrentlyEditing ? 'แก้ไขอยู่' : 'แก้ไข'}</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteSvc(svc.id)} 
                                className="px-3 py-1.5 rounded-lg border-2 border-rose-300 bg-rose-100 hover:bg-rose-200 text-rose-950 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                              >
                                <Trash2 size={13} />
                                <span>ลบ</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================= 03. PORTFOLIO & IOT SYSTEMS ================= */}
          {activeMenu === 'integrations' && (
            <div className="grid xl:grid-cols-12 gap-6 items-start">
              
              {/* Form Column */}
              <div className="xl:col-span-5 bg-white border-2 border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-100">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                      <LinkIcon size={18} className="text-[#EA580C]" />
                      <span>{isIntEdit ? 'แก้ไขระบบงาน / IoT เดิม' : 'เพิ่มระบบงาน / IoT ใหม่'}</span>
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {isIntEdit ? `รหัสระบบ: ${intForm.id} (ระบบจะอัปเดตข้อมูลทับแถวเดิมใน Google Sheets)` : 'กรอกข้อมูลเพื่อบันทึกลงแท็บ Integrations'}
                    </p>
                  </div>
                  {isIntEdit && (
                    <button 
                      type="button" 
                      onClick={() => { setIntForm(emptyInt); setIsIntEdit(false); }} 
                      className="text-xs text-rose-900 hover:text-rose-950 font-bold px-3 py-1 rounded-lg bg-rose-100 border-2 border-rose-300 shadow-2xs hover:bg-rose-200 transition-colors"
                    >
                      ยกเลิกแก้ไข
                    </button>
                  )}
                </div>

                {isIntEdit && (
                  <div className="mb-4 p-3 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                      <span className="text-xs font-bold text-amber-950 truncate">
                        กำลังแก้ไข: <span className="underline">{intForm.title_th || intForm.title}</span> (#{intForm.id})
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { setIntForm(emptyInt); setIsIntEdit(false); }} 
                      className="text-[11px] text-amber-900 hover:text-amber-950 font-bold px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 shrink-0 ml-2"
                    >
                      เคลียร์ฟอร์ม
                    </button>
                  </div>
                )}

                <form onSubmit={handleIntSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        รหัส ID (เว้นว่างเพื่อสร้างอัตโนมัติ)
                      </label>
                      <input 
                        type="text" 
                        value={intForm.id} 
                        onChange={(e) => setIntForm({...intForm, id: e.target.value})} 
                        placeholder="เช่น int-1" 
                        readOnly={isIntEdit} 
                        className={`w-full border-2 rounded-xl px-3 py-2 text-xs font-medium outline-none transition-all ${
                          isIntEdit 
                            ? 'bg-amber-50/80 border-amber-300 text-amber-950 cursor-not-allowed font-bold' 
                            : 'bg-slate-50 border-slate-200 text-slate-950 hover:border-slate-300 focus:bg-white focus:border-[#EA580C]'
                        }`} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        หมวดหมู่ / แท็กเทคโนโลยี
                      </label>
                      <input 
                        type="text" 
                        value={intForm.tag} 
                        onChange={(e) => setIntForm({...intForm, tag: e.target.value})} 
                        placeholder="ESP32-C3 / Next.js / MQTT" 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#EA580C] transition-all" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      ชื่อระบบงาน (ภาษาไทย) <span className="text-[#EA580C]">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={intForm.title_th || ''} 
                      onChange={(e) => setIntForm({...intForm, title_th: e.target.value})} 
                      placeholder="เช่น ระบบตรวจวัดสิ่งแวดล้อมและแจ้งเตือน LINE" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#EA580C] transition-all" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      ชื่อระบบงาน (English) <span className="text-[#EA580C]">*</span>
                    </label>
                    <input 
                      required 
                      type="text" 
                      value={intForm.title} 
                      onChange={(e) => setIntForm({...intForm, title: e.target.value})} 
                      placeholder="e.g. Environmental Sensor Unit" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#EA580C] transition-all" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      รายละเอียด (ภาษาไทย)
                    </label>
                    <textarea 
                      rows={2} 
                      value={intForm.description_th || ''} 
                      onChange={(e) => setIntForm({...intForm, description_th: e.target.value})} 
                      placeholder="อธิบายการเชื่อมต่อ ฟังก์ชัน และฮาร์ดแวร์..." 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#EA580C] transition-all leading-relaxed" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      รายละเอียด (English)
                    </label>
                    <textarea 
                      rows={2} 
                      value={intForm.description} 
                      onChange={(e) => setIntForm({...intForm, description: e.target.value})} 
                      placeholder="Technical implementation and hardware sensors..." 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#EA580C] transition-all leading-relaxed" 
                    />
                  </div>

                  {/* Cover Image */}
                  <div className="pt-2 border-t-2 border-slate-100">
                    <label className="text-xs font-bold text-emerald-900 block mb-1 flex items-center gap-1.5">
                      <ImageIcon size={15} className="text-[#059669]" />
                      <span>ลิงก์รูปภาพปก (Cover Image URL)</span>
                    </label>
                    <input 
                      type="text" 
                      value={intForm.imageUrl} 
                      onChange={(e) => setIntForm({...intForm, imageUrl: e.target.value})} 
                      placeholder="https://drive.google.com/... หรือ Direct URL" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-emerald-500 transition-all" 
                    />
                    {intForm.imageUrl && (
                      <div className="mt-2 flex items-center gap-2.5 p-2 bg-slate-100 rounded-xl border-2 border-slate-200">
                        <img 
                          src={convertToDirectLink(intForm.imageUrl)} 
                          alt="preview" 
                          className="w-12 h-12 object-cover rounded-lg bg-white border-2 border-slate-300 shrink-0 shadow-2xs" 
                          onError={(e) => (e.currentTarget.style.display = 'none')} 
                        />
                        <span className="text-[11px] text-slate-700 font-bold truncate">ตัวอย่างรูปภาพ (Direct Preview)</span>
                      </div>
                    )}
                  </div>

                  {/* Reference URL */}
                  <div>
                    <label className="text-xs font-bold text-sky-900 block mb-1 flex items-center gap-1.5">
                      <ExternalLink size={15} className="text-[#0284C7]" />
                      <span>ลิงก์ระบบจริง / Reference URL</span>
                    </label>
                    <input 
                      type="text" 
                      value={intForm.referenceUrl} 
                      onChange={(e) => setIntForm({...intForm, referenceUrl: e.target.value})} 
                      placeholder="https://demo.example.com" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all" 
                    />
                  </div>

                  {/* Manual URL */}
                  <div>
                    <label className="text-xs font-bold text-amber-900 block mb-1 flex items-center gap-1.5">
                      <FileText size={15} className="text-[#EA580C]" />
                      <span>ลิงก์คู่มือ / Document URL</span>
                    </label>
                    <input 
                      type="text" 
                      value={intForm.manualUrl || ''} 
                      onChange={(e) => setIntForm({...intForm, manualUrl: e.target.value})} 
                      placeholder="https://docs.example.com" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#EA580C] transition-all" 
                    />
                  </div>

                  <button 
                    disabled={isSaving} 
                    className={`w-full py-3.5 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4 shadow-md hover:shadow-lg ${
                      isIntEdit 
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 ring-2 ring-amber-300' 
                        : 'bg-gradient-to-r from-[#EA580C] to-[#E11D48] hover:opacity-95'
                    }`}
                  >
                    {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={15} />} 
                    <span>{isIntEdit ? '✓ อัปเดตข้อมูลระบบเดิม (Update System)' : '+ บันทึกลง Google Sheets (Add New)'}</span>
                  </button>
                </form>
              </div>

              {/* List Column */}
              <div className="xl:col-span-7 bg-white border-2 border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b-2 border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-950 text-sm">
                      รายการระบบการทำงานจริง ({integrations.length})
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium">
                      แสดงรายการโปรเจกต์และระบบเชื่อมต่อในแท็บ Integrations
                    </p>
                  </div>
                  <div className="relative w-full sm:w-56">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="ค้นหาชื่อโปรเจกต์..." 
                      value={intSearch} 
                      onChange={(e) => setIntSearch(e.target.value)} 
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#EA580C]" 
                    />
                  </div>
                </div>

                {isLoadingInt ? (
                  <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin w-6 h-6 text-[#EA580C]" />
                    <span className="font-bold">กำลังโหลดข้อมูลจาก Google Sheets...</span>
                  </div>
                ) : integrations.length === 0 ? (
                  <div className="p-12 text-center text-slate-600 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/70">
                    <LinkIcon size={36} className="mx-auto text-slate-400 mb-2" />
                    <p className="font-bold text-slate-900">ยังไม่มีข้อมูลระบบการทำงาน</p>
                    <p className="text-xs text-slate-500 mt-1">สามารถเพิ่มข้อมูลผ่านฟอร์มด้านซ้ายได้ทันที</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {integrations
                      .filter(item => 
                        item.title.toLowerCase().includes(intSearch.toLowerCase()) || 
                        (item.title_th && item.title_th.toLowerCase().includes(intSearch.toLowerCase())) || 
                        item.id.toLowerCase().includes(intSearch.toLowerCase())
                      )
                      .map(item => {
                        const isCurrentlyEditing = isIntEdit && intForm.id === item.id;
                        return (
                          <div 
                            key={item.id} 
                            className={`p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start gap-4 transition-all shadow-xs ${
                              isCurrentlyEditing 
                                ? 'bg-amber-50/80 border-2 border-amber-400 ring-2 ring-amber-300/70 shadow-md' 
                                : 'bg-white hover:bg-slate-50/90 border-2 border-slate-200/90 hover:border-slate-300'
                            }`}
                          >
                            {/* Thumbnail on left */}
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              {item.imageUrl ? (
                                <img 
                                  src={convertToDirectLink(item.imageUrl.split(',')[0])} 
                                  alt="thumb" 
                                  className="w-14 h-14 rounded-lg object-cover bg-white border-2 border-slate-300 shrink-0 shadow-2xs"
                                  onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-lg bg-slate-100 text-slate-400 border-2 border-slate-200 flex items-center justify-center shrink-0">
                                  <ImageIcon size={20} />
                                </div>
                              )}

                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-extrabold text-slate-950 text-xs">
                                    {item.title_th || item.title}
                                  </span>
                                  {item.title_th && item.title && (
                                    <span className="text-slate-600 text-[11px] font-medium">({item.title})</span>
                                  )}
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-amber-100 text-amber-950 border border-amber-300 font-bold">
                                    {item.tag || 'System'}
                                  </span>
                                  <span className="text-slate-600 text-[10px] font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                    #{item.id}
                                  </span>
                                  {isCurrentlyEditing && (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-950 border border-amber-300 animate-pulse">
                                      กำลังแก้ไขอยู่นี้
                                    </span>
                                  )}
                                </div>

                                <p className="text-[11px] text-slate-700 font-medium line-clamp-2 leading-relaxed">
                                  {item.description_th || item.description}
                                </p>

                                <div className="flex flex-wrap gap-2 text-[10px] pt-1">
                                  {item.imageUrl && (
                                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold flex items-center gap-1 shadow-2xs">
                                      <ImageIcon size={12} /> มีภาพประกอบ
                                    </span>
                                  )}
                                  {item.referenceUrl && (
                                    <a 
                                      href={item.referenceUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-950 border border-sky-300 font-bold flex items-center gap-1 hover:underline shadow-2xs"
                                    >
                                      <ExternalLink size={12} /> ลิงก์ระบบ
                                    </a>
                                  )}
                                  {item.manualUrl && (
                                    <a 
                                      href={item.manualUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 border border-amber-300 font-bold flex items-center gap-1 hover:underline shadow-2xs"
                                    >
                                      <FileText size={12} /> ดูคู่มือ
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 shrink-0 self-end sm:self-start">
                              <button 
                                onClick={() => { 
                                  setIntForm(item); 
                                  setIsIntEdit(true); 
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} 
                                className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors ${
                                  isCurrentlyEditing 
                                    ? 'bg-amber-500 text-white border-amber-600' 
                                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-900'
                                }`}
                              >
                                <Edit3 size={13} />
                                <span>{isCurrentlyEditing ? 'แก้ไขอยู่' : 'แก้ไข'}</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteInt(item.id)} 
                                className="px-3 py-1.5 rounded-lg border-2 border-rose-300 bg-rose-100 hover:bg-rose-200 text-rose-950 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                              >
                                <Trash2 size={13} />
                                <span>ลบ</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================= 04. HERO SECTION CONFIG ================= */}
          {activeMenu === 'hero' && (
            <div className="max-w-4xl mx-auto bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="pb-4 mb-6 border-b-2 border-slate-100">
                <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                  <Zap size={18} className="text-[#E11D48]" />
                  <span>แก้ไขเนื้อหาส่วนหลักหน้าแรก (Hero Section)</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  กำหนดข้อความป้าย Badge, พาดหัวหลัก, คำโปรย และปุ่ม Action ที่แสดงบนส่วนบนสุดของหน้าเว็บ
                </p>
              </div>

              <form onSubmit={handleConfSubmit} className="space-y-6 text-xs">
                
                {/* Badges */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-950 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                    <span>ข้อความป้ายกำกับ (Badge Label)</span>
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        ข้อความภาษาไทย
                      </label>
                      <input 
                        type="text" 
                        value={configData.hero_badge_th} 
                        onChange={e => setConfigData({...configData, hero_badge_th: e.target.value})} 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#E11D48] transition-all" 
                        placeholder="เช่น ผู้เชี่ยวชาญด้านระบบ IoT & AI"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        English Badge
                      </label>
                      <input 
                        type="text" 
                        value={configData.hero_badge_en} 
                        onChange={e => setConfigData({...configData, hero_badge_en: e.target.value})} 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#E11D48] transition-all" 
                        placeholder="e.g. Next-Gen IoT Solutions"
                      />
                    </div>
                  </div>
                </div>

                {/* Main Headlines */}
                <div className="space-y-3 pt-4 border-t-2 border-slate-100">
                  <h4 className="font-extrabold text-slate-950 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                    <span>พาดหัวหลัก (Main Headline)</span>
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        พาดหัวหลัก (ภาษาไทย)
                      </label>
                      <textarea 
                        rows={3} 
                        value={configData.hero_headline_th} 
                        onChange={e => setConfigData({...configData, hero_headline_th: e.target.value})} 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#EA580C] transition-all leading-relaxed" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Headline (English)
                      </label>
                      <textarea 
                        rows={3} 
                        value={configData.hero_headline_en} 
                        onChange={e => setConfigData({...configData, hero_headline_en: e.target.value})} 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#EA580C] transition-all leading-relaxed" 
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-headline */}
                <div className="space-y-3 pt-4 border-t-2 border-slate-100">
                  <h4 className="font-extrabold text-slate-950 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span>คำโปรยรอง (Sub-headline)</span>
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        คำโปรย (ภาษาไทย)
                      </label>
                      <textarea 
                        rows={3} 
                        value={configData.hero_sub_th} 
                        onChange={e => setConfigData({...configData, hero_sub_th: e.target.value})} 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all leading-relaxed" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Sub-headline (English)
                      </label>
                      <textarea 
                        rows={3} 
                        value={configData.hero_sub_en} 
                        onChange={e => setConfigData({...configData, hero_sub_en: e.target.value})} 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all leading-relaxed" 
                      />
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-4 pt-4 border-t-2 border-slate-100">
                  <h4 className="font-extrabold text-slate-950 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>ปุ่มกระตุ้นการตัดสินใจ (Call to Action Buttons)</span>
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50/70 rounded-xl border-2 border-slate-200 space-y-2.5">
                      <span className="font-extrabold text-slate-950 block text-xs">ปุ่มหลัก (Primary CTA)</span>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">ข้อความบนปุ่ม (TH)</label>
                        <input 
                          type="text" 
                          value={configData.hero_btn1_text_th} 
                          onChange={e => setConfigData({...configData, hero_btn1_text_th: e.target.value})} 
                          className="w-full bg-white border-2 border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:border-[#E11D48]" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">ลิงก์ปลายทาง (Link)</label>
                        <input 
                          type="text" 
                          value={configData.hero_btn1_link} 
                          onChange={e => setConfigData({...configData, hero_btn1_link: e.target.value})} 
                          className="w-full bg-white border-2 border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-950 font-mono font-medium outline-none hover:border-slate-300 focus:border-[#E11D48]" 
                          placeholder="#contact หรือ /services" 
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/70 rounded-xl border-2 border-slate-200 space-y-2.5">
                      <span className="font-extrabold text-slate-950 block text-xs">ปุ่มรอง (Secondary CTA)</span>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">ข้อความบนปุ่ม (TH)</label>
                        <input 
                          type="text" 
                          value={configData.hero_btn2_text_th} 
                          onChange={e => setConfigData({...configData, hero_btn2_text_th: e.target.value})} 
                          className="w-full bg-white border-2 border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:border-[#EA580C]" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">ลิงก์ปลายทาง (Link)</label>
                        <input 
                          type="text" 
                          value={configData.hero_btn2_link} 
                          onChange={e => setConfigData({...configData, hero_btn2_link: e.target.value})} 
                          className="w-full bg-white border-2 border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-950 font-mono font-medium outline-none hover:border-slate-300 focus:border-[#EA580C]" 
                          placeholder="#works หรือ /portfolio" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  disabled={isSaving} 
                  className="w-full py-3.5 bg-gradient-to-r from-[#E11D48] to-[#EA580C] hover:opacity-95 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-6 shadow-md hover:shadow-lg"
                >
                  {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={15} />} 
                  <span>บันทึกส่วน HERO SECTION ลง GOOGLE SHEETS</span>
                </button>
              </form>
            </div>
          )}

          {/* ================= 05. NAVIGATION / HEADER ================= */}
          {activeMenu === 'nav' && (
            <div className="grid xl:grid-cols-12 gap-6 items-start">
              
              {/* Form */}
              <div className="xl:col-span-5 bg-white border-2 border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                    <Type size={18} className="text-[#0284C7]" />
                    <span>{isNavEdit ? 'แก้ไขเมนู Header เดิม' : 'เพิ่มเมนู Header ใหม่'}</span>
                  </h3>
                  {isNavEdit && (
                    <button 
                      type="button" 
                      onClick={() => { setNavForm(emptyNav); setIsNavEdit(false); }} 
                      className="text-xs text-rose-900 hover:text-rose-950 font-bold px-3 py-1 rounded-lg bg-rose-100 border-2 border-rose-300 shadow-2xs hover:bg-rose-200 transition-colors"
                    >
                      ยกเลิกแก้ไข
                    </button>
                  )}
                </div>

                {isNavEdit && (
                  <div className="mb-4 p-3 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                      <span className="text-xs font-bold text-amber-950 truncate">
                        กำลังแก้ไขเมนู: <span className="underline">{navForm.label_th || navForm.label_en}</span> (#{navForm.id})
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { setNavForm(emptyNav); setIsNavEdit(false); }} 
                      className="text-[11px] text-amber-900 hover:text-amber-950 font-bold px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 shrink-0 ml-2"
                    >
                      เคลียร์ฟอร์ม
                    </button>
                  </div>
                )}

                <form onSubmit={handleNavSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      รหัสเมนู ID (เว้นว่างเพื่อสร้างอัตโนมัติ)
                    </label>
                    <input 
                      type="text" 
                      value={navForm.id} 
                      onChange={e => setNavForm({...navForm, id: e.target.value})} 
                      placeholder="เช่น nav-1" 
                      readOnly={isNavEdit} 
                      className={`w-full border-2 rounded-xl px-3 py-2 text-xs font-medium outline-none transition-all ${
                        isNavEdit 
                          ? 'bg-amber-50/80 border-amber-300 text-amber-950 cursor-not-allowed font-bold' 
                          : 'bg-slate-50 border-slate-200 text-slate-950 hover:border-slate-300 focus:bg-white focus:border-[#0284C7]'
                      }`} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      ชื่อเมนู (ภาษาไทย)
                    </label>
                    <input 
                      type="text" 
                      value={navForm.label_th} 
                      onChange={e => setNavForm({...navForm, label_th: e.target.value})} 
                      placeholder="บริการที่รับทำ" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      ชื่อเมนู (English) <span className="text-[#0284C7]">*</span>
                    </label>
                    <input 
                      required 
                      type="text" 
                      value={navForm.label_en} 
                      onChange={e => setNavForm({...navForm, label_en: e.target.value})} 
                      placeholder="Services" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      ลิงก์ปลายทาง (HREF) <span className="text-[#0284C7]">*</span>
                    </label>
                    <input 
                      required 
                      type="text" 
                      value={navForm.href} 
                      onChange={e => setNavForm({...navForm, href: e.target.value})} 
                      placeholder="#services หรือ /services" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-mono font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all" 
                    />
                  </div>

                  <button 
                    disabled={isSaving} 
                    className={`w-full py-3.5 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4 shadow-md hover:shadow-lg ${
                      isNavEdit 
                        ? 'bg-gradient-to-r from-amber-500 to-sky-600 hover:from-amber-600 hover:to-sky-700 ring-2 ring-amber-300' 
                        : 'bg-gradient-to-r from-[#0284C7] to-[#E11D48] hover:opacity-95'
                    }`}
                  >
                    {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={15} />} 
                    <span>{isNavEdit ? '✓ อัปเดตเมนูเดิม (Update Nav)' : '+ บันทึกเมนูใหม่ลง Google Sheets (Add New)'}</span>
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="xl:col-span-7 bg-white border-2 border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
                <h3 className="font-extrabold text-slate-950 text-sm mb-4 pb-3 border-b-2 border-slate-100">
                  รายการเมนูบน Header ({navItems.length})
                </h3>

                {navItems.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/70">
                    ยังไม่มีข้อมูลเมนูในระบบ
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {navItems.map(item => {
                      const isCurrentlyEditing = isNavEdit && navForm.id === item.id;
                      return (
                        <div 
                          key={item.id} 
                          className={`p-3.5 rounded-xl flex justify-between items-center text-xs transition-all shadow-xs ${
                            isCurrentlyEditing 
                              ? 'bg-amber-50/80 border-2 border-amber-400 ring-2 ring-amber-300/70 shadow-md' 
                              : 'bg-white hover:bg-slate-50/90 border-2 border-slate-200/90 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-950">
                                {item.label_th || item.label_en}
                              </span>
                              <span className="text-slate-600 font-mono text-[11px] font-bold ml-2">
                                ({item.label_en}) &bull; {item.href}
                              </span>
                              <span className="text-slate-600 text-[10px] font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                #{item.id}
                              </span>
                              {isCurrentlyEditing && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-950 border border-amber-300 animate-pulse">
                                  กำลังแก้ไขอยู่นี้
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button 
                              onClick={() => { 
                                setNavForm(item); 
                                setIsNavEdit(true); 
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }} 
                              className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold shadow-xs transition-colors ${
                                isCurrentlyEditing 
                                  ? 'bg-amber-500 text-white border-amber-600' 
                                  : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-900'
                              }`}
                            >
                              {isCurrentlyEditing ? 'แก้ไขอยู่' : 'แก้ไข'}
                            </button>
                            <button 
                              onClick={() => handleDeleteNav(item.id)} 
                              className="px-3 py-1.5 rounded-lg border-2 border-rose-300 bg-rose-100 hover:bg-rose-200 text-rose-950 text-xs font-bold shadow-xs"
                            >
                              ลบ
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================= 06. CONCEPTS & HIGHLIGHTS ================= */}
          {activeMenu === 'concept' && (
            <div className="grid xl:grid-cols-12 gap-6 items-start">
              
              {/* Form */}
              <div className="xl:col-span-5 bg-white border-2 border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                    <Lightbulb size={18} className="text-[#0284C7]" />
                    <span>{isConceptEdit ? 'แก้ไขจุดเด่น / คอนเซปต์เดิม' : 'เพิ่มคอนเซปต์ใหม่'}</span>
                  </h3>
                  {isConceptEdit && (
                    <button 
                      type="button" 
                      onClick={() => { setConceptForm(emptyConcept); setIsConceptEdit(false); }} 
                      className="text-xs text-rose-900 hover:text-rose-950 font-bold px-3 py-1 rounded-lg bg-rose-100 border-2 border-rose-300 shadow-2xs hover:bg-rose-200 transition-colors"
                    >
                      ยกเลิกแก้ไข
                    </button>
                  )}
                </div>

                {isConceptEdit && (
                  <div className="mb-4 p-3 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                      <span className="text-xs font-bold text-amber-950 truncate">
                        กำลังแก้ไขคอนเซปต์: <span className="underline">{conceptForm.title_th || conceptForm.title_en}</span> (#{conceptForm.id})
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { setConceptForm(emptyConcept); setIsConceptEdit(false); }} 
                      className="text-[11px] text-amber-900 hover:text-amber-950 font-bold px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 shrink-0 ml-2"
                    >
                      เคลียร์ฟอร์ม
                    </button>
                  </div>
                )}

                <form onSubmit={handleConceptSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        รหัส ID (เว้นว่างเพื่อสร้างอัตโนมัติ)
                      </label>
                      <input 
                        type="text" 
                        value={conceptForm.id} 
                        onChange={e => setConceptForm({...conceptForm, id: e.target.value})} 
                        placeholder="เช่น concept-1" 
                        readOnly={isConceptEdit} 
                        className={`w-full border-2 rounded-xl px-3 py-2 text-xs font-medium outline-none transition-all ${
                          isConceptEdit 
                            ? 'bg-amber-50/80 border-amber-300 text-amber-950 cursor-not-allowed font-bold' 
                            : 'bg-slate-50 border-slate-200 text-slate-950 hover:border-slate-300 focus:bg-white focus:border-[#0284C7]'
                        }`} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        ไอคอน (Icon Name)
                      </label>
                      <input 
                        type="text" 
                        value={conceptForm.icon} 
                        onChange={e => setConceptForm({...conceptForm, icon: e.target.value})} 
                        placeholder="Cpu / Shield / Zap" 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      หัวข้อ (ภาษาไทย)
                    </label>
                    <input 
                      type="text" 
                      value={conceptForm.title_th} 
                      onChange={e => setConceptForm({...conceptForm, title_th: e.target.value})} 
                      placeholder="ความเสถียรระดับโรงงานอุตสาหกรรม" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      หัวข้อ (English) <span className="text-[#0284C7]">*</span>
                    </label>
                    <input 
                      required 
                      type="text" 
                      value={conceptForm.title_en} 
                      onChange={e => setConceptForm({...conceptForm, title_en: e.target.value})} 
                      placeholder="Industrial Grade Stability" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      คำอธิบาย (ภาษาไทย)
                    </label>
                    <textarea 
                      rows={2} 
                      value={conceptForm.desc_th} 
                      onChange={e => setConceptForm({...conceptForm, desc_th: e.target.value})} 
                      placeholder="คำอธิบายสั้นๆ เกี่ยวกับจุดเด่นนี้..." 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all leading-relaxed" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      คำอธิบาย (English)
                    </label>
                    <textarea 
                      rows={2} 
                      value={conceptForm.desc_en} 
                      onChange={e => setConceptForm({...conceptForm, desc_en: e.target.value})} 
                      placeholder="Short description..." 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all leading-relaxed" 
                    />
                  </div>

                  <button 
                    disabled={isSaving} 
                    className={`w-full py-3.5 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4 shadow-md hover:shadow-lg ${
                      isConceptEdit 
                        ? 'bg-gradient-to-r from-amber-500 to-sky-600 hover:from-amber-600 hover:to-sky-700 ring-2 ring-amber-300' 
                        : 'bg-gradient-to-r from-[#0284C7] to-[#E11D48] hover:opacity-95'
                    }`}
                  >
                    {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={15} />} 
                    <span>{isConceptEdit ? '✓ อัปเดตคอนเซปต์เดิม (Update Concept)' : '+ บันทึกคอนเซปต์ใหม่ลง Google Sheets (Add New)'}</span>
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="xl:col-span-7 bg-white border-2 border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
                <h3 className="font-extrabold text-slate-950 text-sm mb-4 pb-3 border-b-2 border-slate-100">
                  รายการจุดเด่น & คอนเซปต์ ({concepts.length})
                </h3>

                {concepts.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/70">
                    ยังไม่มีข้อมูลคอนเซปต์ในระบบ
                  </div>
                ) : (
                  <div className="space-y-3">
                    {concepts.map(c => {
                      const isCurrentlyEditing = isConceptEdit && conceptForm.id === c.id;
                      return (
                        <div 
                          key={c.id} 
                          className={`p-4 rounded-xl flex justify-between items-start text-xs transition-all shadow-xs ${
                            isCurrentlyEditing 
                              ? 'bg-amber-50/80 border-2 border-amber-400 ring-2 ring-amber-300/70 shadow-md' 
                              : 'bg-white hover:bg-slate-50/90 border-2 border-slate-200/90 hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-1 flex-1 pr-3">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-950">
                                {c.title_th || c.title_en}
                              </span>
                              {c.title_th && c.title_en && (
                                <span className="text-slate-600 text-[11px] font-medium">({c.title_en})</span>
                              )}
                              <span className="px-2 py-0.5 rounded text-[10px] bg-sky-100 text-sky-950 border border-sky-300 font-mono font-bold">
                                {c.icon || 'Feature'}
                              </span>
                              <span className="text-slate-600 text-[10px] font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                #{c.id}
                              </span>
                              {isCurrentlyEditing && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-950 border border-amber-300 animate-pulse">
                                  กำลังแก้ไขอยู่นี้
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                              {c.desc_th || c.desc_en}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button 
                              onClick={() => { 
                                setConceptForm(c); 
                                setIsConceptEdit(true); 
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }} 
                              className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold shadow-xs transition-colors ${
                                isCurrentlyEditing 
                                  ? 'bg-amber-500 text-white border-amber-600' 
                                  : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-900'
                              }`}
                            >
                              {isCurrentlyEditing ? 'แก้ไขอยู่' : 'แก้ไข'}
                            </button>
                            <button 
                              onClick={() => handleDeleteConcept(c.id)} 
                              className="px-3 py-1.5 rounded-lg border-2 border-rose-300 bg-rose-100 hover:bg-rose-200 text-rose-950 text-xs font-bold shadow-xs"
                            >
                              ลบ
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================= 07. CUSTOM SECTIONS ================= */}
          {activeMenu === 'sections' && (
            <div className="space-y-6">
              
              <div className="grid xl:grid-cols-12 gap-6 items-start">
                
                {/* Section Form */}
                <div className="xl:col-span-5 bg-white border-2 border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-100">
                    <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                      <FolderPlus size={18} className="text-[#E11D48]" />
                      <span>{isSectionEdit ? 'แก้ไขส่วนเสริมเดิม' : 'เพิ่มส่วนเสริมใหม่'}</span>
                    </h3>
                    {isSectionEdit && (
                      <button 
                        type="button" 
                        onClick={() => { setSectionForm(emptySection); setIsSectionEdit(false); }} 
                        className="text-xs text-rose-900 hover:text-rose-950 font-bold px-3 py-1 rounded-lg bg-rose-100 border-2 border-rose-300 shadow-2xs hover:bg-rose-200 transition-colors"
                      >
                        ยกเลิกแก้ไข
                      </button>
                    )}
                  </div>

                  {isSectionEdit && (
                    <div className="mb-4 p-3 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                        <span className="text-xs font-bold text-amber-950 truncate">
                          กำลังแก้ไขส่วนเสริม: <span className="underline">{sectionForm.title_th || sectionForm.title_en}</span> (#{sectionForm.id})
                        </span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => { setSectionForm(emptySection); setIsSectionEdit(false); }} 
                        className="text-[11px] text-amber-900 hover:text-amber-950 font-bold px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 shrink-0 ml-2"
                      >
                        เคลียร์ฟอร์ม
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSectionSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        รหัสส่วนเสริม ID (เว้นว่างเพื่อสร้างอัตโนมัติ)
                      </label>
                      <input 
                        type="text" 
                        value={sectionForm.id} 
                        onChange={e => setSectionForm({...sectionForm, id: e.target.value})} 
                        placeholder="เช่น custom-section-1" 
                        readOnly={isSectionEdit} 
                        className={`w-full border-2 rounded-xl px-3 py-2 text-xs font-medium outline-none transition-all ${
                          isSectionEdit 
                            ? 'bg-amber-50/80 border-amber-300 text-amber-950 cursor-not-allowed font-bold' 
                            : 'bg-slate-50 border-slate-200 text-slate-950 hover:border-slate-300 focus:bg-white focus:border-[#E11D48]'
                        }`} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        ชื่อหัวข้อ (ภาษาไทย)
                      </label>
                      <input 
                        type="text" 
                        value={sectionForm.title_th} 
                        onChange={e => setSectionForm({...sectionForm, title_th: e.target.value})} 
                        placeholder="เทคโนโลยีที่เราเลือกใช้" 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#E11D48] transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Title (English) <span className="text-[#E11D48]">*</span>
                      </label>
                      <input 
                        required 
                        type="text" 
                        value={sectionForm.title_en} 
                        onChange={e => setSectionForm({...sectionForm, title_en: e.target.value})} 
                        placeholder="Technology Stack" 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#E11D48] transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        คำโปรยย่อย (Subtitle)
                      </label>
                      <input 
                        type="text" 
                        value={sectionForm.subtitle_th} 
                        onChange={e => setSectionForm({...sectionForm, subtitle_th: e.target.value})} 
                        placeholder="Hardware และ Cloud Platform ที่ทันสมัย" 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#E11D48] transition-all" 
                      />
                    </div>

                    <button 
                      disabled={isSaving} 
                      className={`w-full py-3.5 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4 shadow-md hover:shadow-lg ${
                        isSectionEdit 
                          ? 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 ring-2 ring-amber-300' 
                          : 'bg-gradient-to-r from-[#E11D48] to-[#EA580C] hover:opacity-95'
                      }`}
                    >
                      {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={15} />} 
                      <span>{isSectionEdit ? '✓ อัปเดตส่วนเสริมเดิม (Update Section)' : '+ บันทึกส่วนเสริมใหม่ลง Google Sheets (Add New)'}</span>
                    </button>
                  </form>
                </div>

                {/* Section List */}
                <div className="xl:col-span-7 bg-white border-2 border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-950 text-sm mb-4 pb-3 border-b-2 border-slate-100">
                    รายการส่วนเสริมทั้งหมด ({sections.length})
                  </h3>

                  {sections.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/70">
                      ยังไม่มีข้อมูลส่วนเสริมในระบบ
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sections.map(s => {
                        const isCurrentlyEditing = isSectionEdit && sectionForm.id === s.id;
                        return (
                          <div 
                            key={s.id} 
                            onClick={() => setSelectedSectionId(s.id)}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center text-xs ${
                              isCurrentlyEditing 
                                ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300/70 shadow-md'
                                : selectedSectionId === s.id 
                                  ? 'bg-rose-50/90 border-rose-400 shadow-sm ring-2 ring-rose-200/60' 
                                  : 'bg-white hover:bg-slate-50/90 border-slate-200/90 hover:border-slate-300 shadow-2xs'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-950">
                                  {s.title_th || s.title_en}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-800 border border-slate-300">
                                  #{s.id}
                                </span>
                                {isCurrentlyEditing && (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-950 border border-amber-300 animate-pulse">
                                    กำลังแก้ไขอยู่นี้
                                  </span>
                                )}
                              </div>
                              <span className="text-slate-600 text-[11px] font-medium block mt-0.5">
                                {s.subtitle_th || s.subtitle_en}
                              </span>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setSectionForm(s); 
                                  setIsSectionEdit(true); 
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} 
                                className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold shadow-xs transition-colors ${
                                  isCurrentlyEditing 
                                    ? 'bg-amber-500 text-white border-amber-600' 
                                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-900'
                                }`}
                              >
                                {isCurrentlyEditing ? 'แก้ไขอยู่' : 'แก้ไข'}
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteSection(s.id); }} 
                                className="px-3 py-1.5 rounded-lg border-2 border-rose-300 bg-rose-100 hover:bg-rose-200 text-rose-950 text-xs font-bold shadow-xs"
                              >
                                ลบ
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* Sub-items manager for selected section */}
              {selectedSectionId && (
                <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-100">
                    <div>
                      <h4 className="font-extrabold text-slate-950 text-sm flex items-center gap-2">
                        <Layers size={18} className="text-[#E11D48]" />
                        <span>จัดการรายการย่อยในหมวด: #{selectedSectionId}</span>
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        เพิ่มไอเทมย่อยที่จะแสดงเป็นการ์ดในส่วนเสริมนี้
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSectionItemEdit && (
                        <button 
                          type="button" 
                          onClick={() => { setSectionItemForm(emptySectionItem); setIsSectionItemEdit(false); }} 
                          className="text-xs font-bold text-rose-900 hover:text-rose-950 px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 border border-rose-300 shadow-2xs transition-colors"
                        >
                          ยกเลิกแก้ไขรายการ
                        </button>
                      )}
                      <button 
                        onClick={() => setSelectedSectionId(null)} 
                        className="text-xs font-bold text-slate-800 hover:text-slate-950 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 shadow-2xs"
                      >
                        ปิดส่วนนี้
                      </button>
                    </div>
                  </div>

                  {isSectionItemEdit && (
                    <div className="mb-4 p-3 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                        <span className="text-xs font-bold text-amber-950 truncate">
                          กำลังแก้ไขรายการ: <span className="underline">{sectionItemForm.title_th || sectionItemForm.title_en}</span> (#{sectionItemForm.id})
                        </span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => { setSectionItemForm(emptySectionItem); setIsSectionItemEdit(false); }} 
                        className="text-[11px] text-amber-900 hover:text-amber-950 font-bold px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 shrink-0 ml-2"
                      >
                        เคลียร์ฟอร์ม
                      </button>
                    </div>
                  )}

                  {/* Sub-item form */}
                  <form onSubmit={handleSectionItemSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-slate-50/90 p-4 rounded-xl border-2 border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        หัวข้อย่อย (ภาษาไทย)
                      </label>
                      <input 
                        required 
                        type="text" 
                        value={sectionItemForm.title_th} 
                        onChange={e => setSectionItemForm({...sectionItemForm, title_th: e.target.value})} 
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:border-[#E11D48] transition-all" 
                        placeholder="เช่น ESP32-C3 Controller"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        ลิงก์รูปภาพ (Image URL)
                      </label>
                      <input 
                        type="text" 
                        value={sectionItemForm.imageUrl} 
                        onChange={e => setSectionItemForm({...sectionItemForm, imageUrl: e.target.value})} 
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:border-[#E11D48] transition-all" 
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex items-end">
                      <button 
                        disabled={isSaving} 
                        className={`w-full py-2.5 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 ${
                          isSectionItemEdit 
                            ? 'bg-gradient-to-r from-amber-500 to-rose-600 ring-2 ring-amber-300' 
                            : 'bg-gradient-to-r from-[#E11D48] to-[#EA580C] hover:opacity-95'
                        }`}
                      >
                        {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : null}
                        <span>{isSectionItemEdit ? '✓ อัปเดตรายการเดิม' : '+ เพิ่มรายการย่อย'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Sub-items list */}
                  <div className="space-y-2">
                    {sectionItems.filter(it => it.section_id === selectedSectionId).map(it => {
                      const isItemEditing = isSectionItemEdit && sectionItemForm.id === it.id;
                      return (
                        <div 
                          key={it.id} 
                          className={`p-3.5 rounded-xl flex justify-between items-center text-xs transition-all ${
                            isItemEditing 
                              ? 'bg-amber-50/80 border-2 border-amber-400 ring-2 ring-amber-300/70 shadow-md' 
                              : 'bg-white border-2 border-slate-200 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-950">{it.title_th || it.title_en}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">#{it.id}</span>
                            {isItemEditing && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-950 border border-amber-300 animate-pulse">
                                กำลังแก้ไขอยู่นี้
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { setSectionItemForm(it); setIsSectionItemEdit(true); }} 
                              className={`px-2.5 py-1 rounded-lg border text-xs font-bold shadow-2xs transition-colors ${
                                isItemEditing 
                                  ? 'bg-amber-500 text-white border-amber-600' 
                                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900'
                              }`}
                            >
                              {isItemEditing ? 'แก้ไขอยู่' : 'แก้ไข'}
                            </button>
                            <button 
                              onClick={() => handleDeleteSectionItem(it.id)} 
                              className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-950 text-xs font-bold shadow-2xs"
                            >
                              ลบ
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================= 08. SITE TITLES & HEADINGS ================= */}
          {activeMenu === 'titles' && (
            <div className="max-w-4xl mx-auto bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="pb-4 mb-6 border-b-2 border-slate-100">
                <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2.5">
                  <Star size={20} className="text-[#EA580C]" />
                  <span>แก้ไขหัวข้อและคำอธิบายของแต่ละส่วน (Section Titles)</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  ปรับแต่งข้อความส่วนหัวของโซนบริการ ผลงานจริง เหตุผลที่ควรเลือกเรา และ Call-to-Action
                </p>
              </div>

              <form onSubmit={handleConfSubmit} className="space-y-5 text-xs">
                
                {/* Services Zone */}
                <div className="p-5 bg-slate-50/90 rounded-xl border-2 border-slate-200 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-extrabold text-slate-950 text-xs">โซนบริการ (Services Zone)</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">หัวข้อบริการ (Services Title TH)</label>
                      <input 
                        type="text" 
                        value={configData.solutions_title_th} 
                        onChange={e => setConfigData({...configData, solutions_title_th: e.target.value})} 
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:border-[#EA580C] transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">คำอธิบายบริการ (Description TH)</label>
                      <input 
                        type="text" 
                        value={configData.solutions_description_th} 
                        onChange={e => setConfigData({...configData, solutions_description_th: e.target.value})} 
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:border-[#EA580C] transition-all" 
                      />
                    </div>
                  </div>
                </div>

                {/* Portfolio Zone */}
                <div className="p-5 bg-slate-50/90 rounded-xl border-2 border-slate-200 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="font-extrabold text-slate-950 text-xs">โซนผลงานจริง (Portfolio Zone)</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">หัวข้อผลงาน (Portfolio Title TH)</label>
                      <input 
                        type="text" 
                        value={configData.integrations_title_th} 
                        onChange={e => setConfigData({...configData, integrations_title_th: e.target.value})} 
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:border-[#EA580C] transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">คำอธิบายผลงาน (Description TH)</label>
                      <input 
                        type="text" 
                        value={configData.port_desc_th} 
                        onChange={e => setConfigData({...configData, port_desc_th: e.target.value})} 
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:border-[#EA580C] transition-all" 
                      />
                    </div>
                  </div>
                </div>

                {/* Why Choose & CTA */}
                <div className="p-5 bg-slate-50/90 rounded-xl border-2 border-slate-200 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                    <span className="font-extrabold text-slate-950 text-xs">ทำไมต้องเลือกเรา & แบนเนอร์ติดต่อ</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">หัวข้อ Why Choose Us (TH)</label>
                      <input 
                        type="text" 
                        value={configData.why_choose_title_th} 
                        onChange={e => setConfigData({...configData, why_choose_title_th: e.target.value})} 
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:border-[#EA580C] transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">ข้อความหัวข้อแบนเนอร์ CTA (TH)</label>
                      <input 
                        type="text" 
                        value={configData.cta_heading_th} 
                        onChange={e => setConfigData({...configData, cta_heading_th: e.target.value})} 
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:border-[#EA580C] transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={isSaving} 
                  className="w-full py-3.5 bg-gradient-to-r from-[#EA580C] to-[#E11D48] hover:opacity-95 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-6 shadow-md hover:shadow-lg"
                >
                  {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />} 
                  <span>บันทึกหัวข้อเนื้อหา</span>
                </button>
              </form>
            </div>
          )}

          {/* ================= 09. CONTACT INFORMATION ================= */}
          {activeMenu === 'contact' && (
            <div className="max-w-4xl mx-auto bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="pb-4 mb-6 border-b-2 border-slate-100">
                <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2.5">
                  <Phone size={20} className="text-[#059669]" />
                  <span>แก้ไขข้อมูลการติดต่อ (Contact Information)</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  ปรับปรุงช่องทางการติดต่อ อีเมล เบอร์โทรศัพท์ LINE Official และลิงก์ Facebook
                </p>
              </div>

              <form onSubmit={handleConfSubmit} className="space-y-6 text-xs">
                
                {/* Contact channels */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-rose-50/50 p-3.5 rounded-xl border-2 border-rose-200">
                    <label className="block text-xs font-extrabold text-rose-950 mb-1.5 flex items-center gap-1.5">
                      <Mail size={14} className="text-rose-600" />
                      <span>อีเมล (Email)</span>
                    </label>
                    <input 
                      type="text" 
                      value={configData.contact_email} 
                      onChange={e => setConfigData({...configData, contact_email: e.target.value})} 
                      className="w-full bg-white border-2 border-rose-200 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-medium outline-none hover:border-rose-300 focus:border-[#E11D48] transition-all" 
                      placeholder="contact@deedeviot.com"
                    />
                  </div>

                  <div className="bg-amber-50/50 p-3.5 rounded-xl border-2 border-amber-200">
                    <label className="block text-xs font-extrabold text-amber-950 mb-1.5 flex items-center gap-1.5">
                      <Phone size={14} className="text-amber-600" />
                      <span>เบอร์โทรศัพท์ (Phone)</span>
                    </label>
                    <input 
                      type="text" 
                      value={configData.contact_phone} 
                      onChange={e => setConfigData({...configData, contact_phone: e.target.value})} 
                      className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-medium outline-none hover:border-amber-300 focus:border-[#EA580C] transition-all" 
                      placeholder="08x-xxx-xxxx"
                    />
                  </div>

                  <div className="bg-emerald-50/50 p-3.5 rounded-xl border-2 border-emerald-200">
                    <label className="block text-xs font-extrabold text-emerald-950 mb-1.5 flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-emerald-600" />
                      <span>LINE Official ID</span>
                    </label>
                    <input 
                      type="text" 
                      value={configData.contact_line} 
                      onChange={e => setConfigData({...configData, contact_line: e.target.value})} 
                      className="w-full bg-white border-2 border-emerald-200 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-medium outline-none hover:border-emerald-300 focus:border-[#059669] transition-all" 
                      placeholder="@DEEDEVIOT"
                    />
                  </div>
                </div>

                {/* Facebook */}
                <div className="bg-sky-50/50 p-3.5 rounded-xl border-2 border-sky-200">
                  <label className="block text-xs font-extrabold text-sky-950 mb-1.5 flex items-center gap-1.5">
                    <Globe size={14} className="text-sky-600" />
                    <span>Facebook Page URL</span>
                  </label>
                  <input 
                    type="text" 
                    value={configData.facebook_url} 
                    onChange={e => setConfigData({...configData, facebook_url: e.target.value})} 
                    className="w-full bg-white border-2 border-sky-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-medium outline-none hover:border-sky-300 focus:border-[#0284C7] transition-all" 
                    placeholder="https://facebook.com/deedeviot"
                  />
                </div>

                {/* Contact titles */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t-2 border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      หัวข้อส่วนติดต่อ (Contact Title TH)
                    </label>
                    <input 
                      type="text" 
                      value={configData.contact_title_th} 
                      onChange={e => setConfigData({...configData, contact_title_th: e.target.value})} 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#059669] transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      คำอธิบายส่วนติดต่อ (Contact Description TH)
                    </label>
                    <input 
                      type="text" 
                      value={configData.contact_description_th} 
                      onChange={e => setConfigData({...configData, contact_description_th: e.target.value})} 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#059669] transition-all" 
                    />
                  </div>
                </div>

                <button 
                  disabled={isSaving} 
                  className="w-full py-3.5 bg-gradient-to-r from-[#059669] to-[#0284C7] hover:opacity-95 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-6 shadow-md hover:shadow-lg"
                >
                  {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />} 
                  <span>บันทึกข้อมูลติดต่อ</span>
                </button>
              </form>
            </div>
          )}

          {/* ================= 10. FOOTER CONFIG ================= */}
          {activeMenu === 'footer' && (
            <div className="max-w-4xl mx-auto bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="pb-4 mb-6 border-b-2 border-slate-100">
                <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2.5">
                  <Globe size={20} className="text-[#0284C7]" />
                  <span>แก้ไขข้อมูลส่วนท้ายเว็บไซต์ (Footer Configuration)</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  ปรับแต่งคำแนะนำแนะนำบริษัทและลิขสิทธิ์ด้านล่างสุดของเว็บไซต์
                </p>
              </div>

              <form onSubmit={handleConfSubmit} className="space-y-5 text-xs">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      คำแนะนำบริษัทสั้นๆ (ภาษาไทย)
                    </label>
                    <textarea 
                      rows={3} 
                      value={configData.footer_bio_th} 
                      onChange={e => setConfigData({...configData, footer_bio_th: e.target.value})} 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all leading-relaxed" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Short Bio (English)
                    </label>
                    <textarea 
                      rows={3} 
                      value={configData.footer_bio_en} 
                      onChange={e => setConfigData({...configData, footer_bio_en: e.target.value})} 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all leading-relaxed" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Facebook Page Link
                  </label>
                  <input 
                    type="text" 
                    value={configData.facebook_url} 
                    onChange={e => setConfigData({...configData, facebook_url: e.target.value})} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-medium outline-none hover:border-slate-300 focus:bg-white focus:border-[#0284C7] transition-all" 
                  />
                </div>

                <button 
                  disabled={isSaving} 
                  className="w-full py-3.5 bg-gradient-to-r from-[#0284C7] to-[#E11D48] hover:opacity-95 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-6 shadow-md hover:shadow-lg"
                >
                  {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />} 
                  <span>บันทึกส่วน FOOTER</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
