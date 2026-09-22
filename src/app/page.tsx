"use client";

import React, { useEffect, useState } from 'react';
import {
  Settings, Monitor, Lightbulb, PhoneCall, CheckCircle,
  Menu, X, ChevronRight, Send, Code, Cpu, Wifi, Zap, RefreshCw, ArrowLeft,
  Mail, Phone, Facebook, MessageCircle, Settings2, Link as LinkIcon, Star, Sliders,
  Sparkles, ExternalLink, Layers, ArrowUpRight, Shield, Globe
} from 'lucide-react';

// Safe Lucide Icon Registry to avoid slow runtime require calls
const ICON_MAP: Record<string, any> = {
  Settings, Monitor, Lightbulb, PhoneCall, CheckCircle,
  Code, Cpu, Wifi, Zap, RefreshCw, Mail, Phone,
  Facebook, MessageCircle, Settings2, Star, Sliders,
  Sparkles, Layers, Shield, Globe
};

function getLucideIcon(iconName?: string) {
  if (!iconName) return Sparkles;
  return ICON_MAP[iconName] || (require('lucide-react') as any)[iconName] || Sparkles;
}

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'main' | 'detail'>('main');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, msg: '', isError: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'th'>('th');
  const [scrolled, setScrolled] = useState(false);

  // Scroll listener for Navbar Glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Site Data State
  const [siteData, setSiteData] = useState<any>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [navItems, setNavItems] = useState<any[]>([]);
  const [concepts, setConcepts] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [sectionItems, setSectionItems] = useState<any[]>([]);

  // Translation Helper
  const t = (key: string, fallback: string = '') => {
    return siteData[`${key}_${lang}`] || siteData[key] || fallback;
  };

  // Fetch Data on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configRes, servicesRes, integrationsRes, navRes, conceptRes, sectionsRes, sectionItemsRes] = await Promise.all([
          fetch('/api/config', { cache: 'no-store' }),
          fetch('/api/services', { cache: 'no-store' }),
          fetch('/api/integrations', { cache: 'no-store' }),
          fetch('/api/nav', { cache: 'no-store' }),
          fetch('/api/concept', { cache: 'no-store' }),
          fetch('/api/sections', { cache: 'no-store' }),
          fetch('/api/section-items', { cache: 'no-store' })
        ]);
        
        const [configJson, servicesJson, integrationsJson, navJson, conceptJson, sectionsJson, sectionItemsJson] = await Promise.all([
          configRes.json(),
          servicesRes.json(),
          integrationsRes.json(),
          navRes.json(),
          conceptRes.json(),
          sectionsRes.json(),
          sectionItemsRes.json()
        ]);

        if (configJson.success) setSiteData(configJson.data);
        if (servicesJson.success) setProjects(servicesJson.data);
        if (integrationsJson.success) setIntegrations(integrationsJson.data);
        if (navJson.success) setNavItems(navJson.data);
        if (conceptJson.success) setConcepts(conceptJson.data);
        if (sectionsJson.success) setSections(sectionsJson.data);
        if (sectionItemsJson.success) setSectionItems(sectionItemsJson.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Intersection Observer for Scroll Reveals
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, view]);

  const showToast = (msg: string, isError = false) => {
    setToast({ show: true, msg, isError });
    setTimeout(() => setToast({ show: false, msg: '', isError: false }), 3000);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 z-[9999] flex flex-col items-center justify-center p-6">
        <div className="relative w-16 h-16 mb-6">
          <div className="w-16 h-16 master-gear-spin">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="36" fill="none" stroke="#38bdf8" strokeWidth="6" strokeDasharray="12 6" />
              <circle cx="50" cy="50" r="18" fill="#2563eb" />
            </svg>
          </div>
          <div className="absolute inset-0 w-16 h-16 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
        </div>
        <p className="text-slate-400 font-mono font-medium tracking-widest text-xs uppercase animate-pulse">
          INITIALIZING ECOSYSTEM...
        </p>
      </div>
    );
  }

  const selectedProject = projects.find(p => String(p.id) === String(selectedProjectId));

  return (
    <div className="min-h-screen font-kanit bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-brand-500/30 selection:text-white">
      
      {/* --- NAVBAR --- */}
      <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-nav py-3 sm:py-4 shadow-lg shadow-black/40' 
          : 'bg-transparent py-4 sm:py-6 border-b border-white/[0.04]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group select-none" 
            onClick={() => { setView('main'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 master-gear-spin group-hover:scale-105 transition-transform flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
                <defs>
                  <linearGradient id="logoGearGradModern" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
                <g fill="url(#logoGearGradModern)">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                    <path key={deg} d="M92 5 Q100 0 108 5 L112 35 Q100 35 88 35 Z" transform={`rotate(${deg} 100 100)`} />
                  ))}
                  <circle cx="100" cy="100" r="70" />
                </g>
                <circle cx="100" cy="100" r="30" fill="#090d1a" />
                <circle cx="100" cy="100" r="14" fill="#38bdf8" />
              </svg>
            </div>
            <span className="font-montserrat text-xl sm:text-2xl font-black tracking-tight uppercase text-white">
              DEE<span className="text-accent-400">DEV</span><span className="text-brand-500">IOT</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 font-medium text-sm">
            {navItems.map(item => (
              <a 
                key={item.id} 
                href={item.href} 
                className="text-slate-300 hover:text-white transition-colors uppercase tracking-wider relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent-400 hover:after:w-full after:transition-all"
              >
                {lang === 'th' ? item.label_th : item.label_en}
              </a>
            ))}
            
            {/* Language Switcher */}
            <div className="flex bg-slate-900/90 p-1 rounded-xl items-center border border-white/10 shadow-inner">
              <button 
                onClick={() => setLang('th')} 
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === 'th' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                TH
              </button>
              <button 
                onClick={() => setLang('en')} 
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === 'en' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
            </div>

            {/* CTA Button */}
            <a 
              href={t('hero_btn1_link', '#contact')} 
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
            >
              {t('nav_btn', 'Contact Us')}
              <ChevronRight size={14} />
            </a>
          </nav>

          {/* Mobile Right Controls */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-3">
            {/* Quick Lang Switch */}
            <button 
              onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-bold text-accent-400 hover:text-white transition-colors"
              aria-label="Toggle language"
            >
              {lang.toUpperCase()}
            </button>

            {/* Hamburger Toggle */}
            <button 
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:text-white transition-all active:scale-95"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Sheet */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer Panel */}
        <div className={`absolute top-0 right-0 w-full max-w-sm h-full bg-slate-900/95 border-l border-white/10 shadow-2xl flex flex-col justify-between pt-24 pb-safe px-6 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Navigation</span>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-white/10">
                <button 
                  onClick={() => setLang('th')} 
                  className={`px-3 py-1 rounded text-xs font-bold ${lang === 'th' ? 'bg-brand-500 text-white' : 'text-slate-400'}`}
                >
                  TH
                </button>
                <button 
                  onClick={() => setLang('en')} 
                  className={`px-3 py-1 rounded text-xs font-bold ${lang === 'en' ? 'bg-brand-500 text-white' : 'text-slate-400'}`}
                >
                  EN
                </button>
              </div>
            </div>

            <nav className="flex flex-col space-y-3">
              {navItems.map(item => (
                <a 
                  key={item.id} 
                  href={item.href} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 text-base font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  <span>{lang === 'th' ? item.label_th : item.label_en}</span>
                  <ChevronRight size={18} className="text-slate-500" />
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <a 
              href={t('hero_btn1_link', '#contact')} 
              onClick={() => setMobileMenuOpen(false)} 
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
            >
              <span>{t('nav_btn', 'Contact Us')}</span>
              <Send size={16} />
            </a>
            <p className="text-[11px] text-center text-slate-500">
              © 2026 DEEDEVIOT Ecosystem. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* --- CONTENT VIEWS --- */}
      {view === 'main' ? (
        <main>
          {/* HERO SECTION */}
          <section className="relative min-h-[90vh] flex items-center pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden animate-mesh">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
                
                {/* Left Text Column */}
                <div className="w-full lg:w-3/5 text-center lg:text-left">
                  {/* High-tech Badge */}
                  <div className="reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 backdrop-blur-md mb-6 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]"></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                      {t('hero_badge', 'NEXT-GEN WEB APP & IOT ACCELERATOR')}
                    </span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="reveal delay-100 font-montserrat text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-[1.15] tracking-tight">
                    {lang === 'th' ? (
                      <>
                        ยกระดับธุรกิจของคุณ <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">
                          ด้วยโซลูชัน Web & IoT อัจฉริยะ
                        </span>
                      </>
                    ) : (
                      <>
                        Transform Business with <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">
                          Intelligent Web & IoT Solutions
                        </span>
                      </>
                    )}
                  </h1>

                  {/* Subtitle */}
                  <p className="reveal delay-200 text-base sm:text-lg lg:text-xl text-slate-300 mb-8 sm:mb-10 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                    {t('hero_sub', 'สร้างสรรค์ระบบคลาวด์และฮาร์ดแวร์ IoT ครบวงจรที่เชื่อมโยงกันอย่างแม่นยำ พร้อมขับเคลื่อนองค์กรสู่อนาคต')}
                  </p>

                  {/* Action Buttons */}
                  <div className="reveal delay-300 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
                    <a 
                      href={t('hero_btn1_link', '#contact')} 
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm sm:text-base tracking-wide uppercase shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                    >
                      <span>{t('hero_btn1_text', 'ปรึกษาผู้เชี่ยวชาญ')}</span>
                      <ChevronRight size={18} />
                    </a>
                    
                    <a 
                      href={t('hero_btn2_link', '#services')} 
                      className="w-full sm:w-auto px-8 py-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-slate-200 hover:text-white rounded-xl font-bold text-sm sm:text-base tracking-wide uppercase transition-all flex items-center justify-center backdrop-blur-md"
                    >
                      {t('hero_btn2_text', 'ดูผลงานของเรา')}
                    </a>
                  </div>
                </div>

                {/* Right Visual Graphic (Responsive & Scalable without overflow) */}
                <div className="w-full lg:w-2/5 flex justify-center mt-6 lg:mt-0">
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 max-w-full aspect-square flex items-center justify-center">
                    
                    {/* Ambient Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-transparent rounded-full blur-3xl animate-glow-pulse"></div>

                    {/* Central Engineered Gear */}
                    <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 master-gear-spin relative z-10">
                      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                        <defs>
                          <linearGradient id="heroGearGradNew" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="50%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#1e3a8a" />
                          </linearGradient>
                        </defs>
                        <g fill="url(#heroGearGradNew)">
                          {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                            <path key={deg} d="M90 10 Q100 0 110 10 L115 40 Q100 40 85 40 Z" transform={`rotate(${deg} 100 100)`} />
                          ))}
                          <circle cx="100" cy="100" r="75" />
                        </g>
                        <circle cx="100" cy="100" r="54" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="6 4" />
                        <circle cx="100" cy="100" r="34" fill="#080d1a" />
                        <circle cx="100" cy="100" r="14" fill="#38bdf8" className="animate-pulse" />
                      </svg>
                    </div>

                    {/* Floating Orbital Badges (Inside safe bounds) */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[
                        { Icon: Code, top: '2%', left: '50%', transform: '-translate-x-1/2' },
                        { Icon: Zap, top: '22%', right: '2%' },
                        { Icon: Cpu, bottom: '22%', right: '2%' },
                        { Icon: Wifi, bottom: '2%', left: '50%', transform: '-translate-x-1/2' },
                        { Icon: RefreshCw, bottom: '22%', left: '2%' },
                        { Icon: Sliders, top: '22%', left: '2%' },
                      ].map((item, idx) => (
                        <div 
                          key={idx} 
                          className={`absolute ${item.transform || ''} p-2.5 sm:p-3 rounded-xl sm:rounded-2xl glass-card border border-white/15 text-cyan-400 shadow-xl pointer-events-auto hover:scale-110 transition-transform animate-float-gentle`}
                          style={{ top: item.top, bottom: item.bottom, left: item.left, right: item.right, animationDelay: `${idx * 0.7}s` }}
                        >
                          <item.Icon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* CONCEPT SECTION */}
          <section id="concept" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-950/60 relative border-t border-white/[0.04]">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 sm:gap-16">
                
                <div className="lg:w-1/3 reveal text-center lg:text-left">
                  <span className="text-xs font-mono uppercase tracking-widest text-accent-400 mb-2 block">
                    Core Architecture
                  </span>
                  <h2 className="font-montserrat text-3xl sm:text-4xl font-black text-white mb-4 uppercase leading-tight">
                    {t('concept_title1', 'SMART')}{' '}
                    <span className="text-brand-500">{t('concept_title2', 'GEARING')}</span>
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                    {t('concept_description', 'ระบบของเราทำงานสอดประสานกันอย่างราบรื่นดั่งฟันเฟืองวิศวกรรมที่เที่ยงตรง')}
                  </p>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mx-auto lg:mx-0"></div>
                </div>

                <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                  {concepts.map((c, i) => {
                    const IconComp = getLucideIcon(c.icon);
                    return (
                      <div 
                        key={c.id || i} 
                        className={`reveal delay-${(i + 1) * 100} p-6 sm:p-8 rounded-2xl glass-card glass-card-hover group`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-blue-400/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                          <IconComp size={24} />
                        </div>
                        <h4 className="text-lg font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors">
                          {lang === 'th' ? c.title_th : c.title_en}
                        </h4>
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                          {lang === 'th' ? c.desc_th : c.desc_en}
                        </p>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          </section>

          {/* SOLUTIONS / SERVICES SECTION */}
          <section id="services" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-900/30 relative border-t border-white/[0.04]">
            <div className="max-w-7xl mx-auto">
              
              <div className="text-center mb-14 sm:mb-20 reveal">
                <span className="text-xs font-mono uppercase tracking-widest text-accent-400 mb-2 block">
                  {t('svc_badge', 'PORTFOLIO & SOLUTIONS')}
                </span>
                <h2 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 uppercase">
                  {t('solutions_title', 'Featured Works')}
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                  {t('solutions_description', 'ผลงานและโซลูชันที่ขับเคลื่อนด้วยระบบเทคโนโลยีของเรา')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {projects.length > 0 ? (
                  projects.map((p, i) => {
                    const firstImg = p.imageUrl ? p.imageUrl.split(',')[0].trim() : '';
                    return (
                      <div 
                        key={p.id || i} 
                        className={`reveal delay-${(i % 3) * 100 + 100} group glass-card glass-card-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col`}
                        onClick={() => { setSelectedProjectId(p.id || String(i)); setView('detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      >
                        {/* Image Preview */}
                        <div className="aspect-[16/10] overflow-hidden relative bg-slate-950">
                          {firstImg ? (
                            <img 
                              src={firstImg} 
                              alt={p.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                              <Monitor size={36} />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-cyan-300 border border-white/10 backdrop-blur-md">
                              {p.icon || 'PROJECT'}
                            </span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                              {p[`title_${lang}`] || p.title}
                            </h3>
                            <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                              {p[`description_${lang}`] || p.description}
                            </p>
                          </div>

                          {/* Action Link (Always visible for mobile touch ergonomics) */}
                          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                            <span>{lang === 'th' ? 'ดูรายละเอียด' : 'View Details'}</span>
                            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-16 px-4 glass-card rounded-2xl border-dashed border-slate-800 text-slate-400">
                    <Monitor size={40} className="mx-auto mb-3 opacity-30 text-slate-500" />
                    <p className="text-sm">No projects available yet. Connect Google Sheets to load content.</p>
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* INTEGRATIONS SECTION */}
          <section id="integrations" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-950 relative border-t border-white/[0.04]">
            <div className="max-w-7xl mx-auto">
              
              <div className="text-center mb-14 sm:mb-20 reveal">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2 block">
                  {t('port_badge', 'INTEGRATIONS')}
                </span>
                <h2 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 uppercase">
                  {t('integrations_title', 'Seamless Connectivity')}
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                  {t('port_desc', 'เชื่อมโยงแพลตฟอร์มของเรากับเครื่องมือและระบบฮาร์ดแวร์ของคุณ')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {integrations.length > 0 ? (
                  integrations.map((int, i) => (
                    <div 
                      key={int.id || i} 
                      className="reveal flex flex-col sm:flex-row gap-5 p-5 sm:p-6 rounded-2xl glass-card glass-card-hover group"
                    >
                      <div className="w-full sm:w-1/3 aspect-video sm:aspect-square rounded-xl overflow-hidden bg-slate-900 shrink-0">
                        <img 
                          src={int.imageUrl} 
                          alt={int.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent-400 mb-1.5 block">
                            {int.tag}
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                            {int[`title_${lang}`] || int.title}
                          </h3>
                          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                            {int[`description_${lang}`] || int.description}
                          </p>
                        </div>
                        {int.referenceUrl && (
                          <a 
                            href={int.referenceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider"
                          >
                            <span>Reference</span>
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 px-4 glass-card rounded-2xl border-dashed border-slate-800 text-slate-400">
                    <RefreshCw size={40} className="mx-auto mb-3 opacity-30 text-slate-500" />
                    <p className="text-sm">Integrating your favorite tools soon...</p>
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* DYNAMIC SECTIONS */}
          {sections.filter(s => s.is_active === 'TRUE').map((sec, idx) => (
            <section 
              key={sec.id} 
              id={sec.id} 
              className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 ${idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-950'} relative border-t border-white/[0.04]`}
            >
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14 sm:mb-20 reveal">
                  <h2 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 uppercase tracking-tight">
                    {lang === 'th' ? sec.title_th : sec.title_en}
                  </h2>
                  {(sec.subtitle_en || sec.subtitle_th) && (
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                      {lang === 'th' ? sec.subtitle_th : sec.subtitle_en}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {sectionItems.filter(item => item.section_id === sec.id).map((item, i) => {
                    const ItemIcon = getLucideIcon(item.icon);
                    return (
                      <div key={item.id || i} className="reveal p-6 sm:p-8 rounded-2xl glass-card glass-card-hover group">
                        {item.imageUrl ? (
                          <div className="aspect-[16/10] mb-5 rounded-xl overflow-hidden bg-slate-950">
                            <img 
                              src={item.imageUrl} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              alt={item.title_en} 
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <ItemIcon size={24} />
                          </div>
                        )}
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                          {lang === 'th' ? item.title_th : item.title_en}
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                          {lang === 'th' ? item.desc_th : item.desc_en}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          ))}

          {/* CONTACT SECTION */}
          <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-950 relative border-t border-white/[0.04]">
            <div className="max-w-5xl mx-auto">
              <div className="reveal relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700/80 via-indigo-800/80 to-slate-900 border border-blue-500/30 p-8 sm:p-14 md:p-16 text-center shadow-2xl">
                
                {/* Glow effects */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                  <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 mb-2 block">
                    Get in Touch
                  </span>
                  <h2 className="font-montserrat text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 uppercase tracking-tight">
                    {t('contact_title', 'READY TO POWER UP?')}
                  </h2>
                  <p className="text-blue-100/90 text-sm sm:text-lg mb-10 sm:mb-12 max-w-xl mx-auto font-light leading-relaxed">
                    {t('contact_description', 'ระบบและทีมงานของเราพร้อมให้คำปรึกษาและร่วมพัฒนาโซลูชันเพื่อคุณ')}
                  </p>
                  
                  {/* Responsive 4-card Touch Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                    
                    {/* Email Card */}
                    <a 
                      href={`mailto:${t('contact_email', 'hello@deedeviot.com')}`} 
                      className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-all group flex flex-col justify-between"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Mail size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-blue-200/60 uppercase tracking-widest block mb-1">Email</span>
                        <span className="text-white font-bold text-xs sm:text-sm truncate block">{t('contact_email', 'hello@deedeviot.com')}</span>
                      </div>
                    </a>

                    {/* Phone Card */}
                    <a 
                      href={`tel:${t('contact_phone', '02-123-4567')}`} 
                      className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-all group flex flex-col justify-between"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Phone size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-blue-200/60 uppercase tracking-widest block mb-1">Phone</span>
                        <span className="text-white font-bold text-xs sm:text-sm truncate block">{t('contact_phone', '02-123-4567')}</span>
                      </div>
                    </a>

                    {/* Facebook Card */}
                    <a 
                      href={t('facebook_url', 'https://facebook.com/deedeviot')} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-all group flex flex-col justify-between"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Facebook size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-blue-200/60 uppercase tracking-widest block mb-1">Facebook</span>
                        <span className="text-white font-bold text-xs sm:text-sm truncate block">{t('contact_facebook', 'DeeDevIOT Page')}</span>
                      </div>
                    </a>

                    {/* LINE Card */}
                    <a 
                      href={`https://line.me/ti/p/~${t('contact_line', '@DEEDEVIOT')?.replace('@','')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-all group flex flex-col justify-between"
                    >
                      <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <MessageCircle size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-blue-200/60 uppercase tracking-widest block mb-1">Line</span>
                        <span className="text-white font-bold text-xs sm:text-sm truncate block">{t('contact_line', '@DEEDEVIOT')}</span>
                      </div>
                    </a>

                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-12 sm:py-16 bg-slate-950 border-t border-white/[0.06] px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
              <div className="font-montserrat text-xl font-black text-white tracking-tight uppercase">
                DEE<span className="text-accent-400">DEV</span><span className="text-brand-500">IOT</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-xs tracking-wider uppercase">
                <span>{t('footer_bio', '© 2026 DEEDEVIOT ACCELERATOR. ALL RIGHTS RESERVED.')}</span>
                <a 
                  href="/login" 
                  className="p-2 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-white/5 transition-all" 
                  aria-label="Admin Login"
                >
                  <Settings size={16} />
                </a>
              </div>
            </div>
          </footer>
        </main>
      ) : (
        /* PROJECT DETAIL VIEW */
        <main className="pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* Back Pill Button */}
          <button 
            onClick={() => { setView('main'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-semibold mb-8 px-5 py-2.5 rounded-full bg-slate-900 border border-white/10 hover:border-white/20 transition-all active:scale-95 text-xs sm:text-sm"
          >
            <ArrowLeft size={16} />
            <span>{t('back_btn', 'Back to Projects')}</span>
          </button>

          {selectedProject ? (
            <article className="space-y-8 animate-fade-in-up">
              
              {/* Media Container (Video or Multi-image) */}
              <div className="space-y-4">
                {selectedProject.videoUrls && selectedProject.videoUrls.split(',').filter((u: string) => u.trim()).length > 0 ? (
                  <div className="space-y-4">
                    {selectedProject.videoUrls.split(',').filter((u: string) => u.trim()).map((url: string, index: number) => (
                      <div key={index} className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
                        <iframe 
                          src={url.trim()} 
                          className="w-full h-full border-none" 
                          allow="autoplay; encrypted-media" 
                          allowFullScreen
                          title={`${selectedProject.title} Video ${index + 1}`}
                        ></iframe>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedProject.imageUrl && selectedProject.imageUrl.split(',').filter((u: string) => u.trim()).map((url: string, index: number) => (
                      <div key={index} className="rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-white/10">
                        <img 
                          src={url.trim()} 
                          className="w-full h-auto object-cover" 
                          alt={`${selectedProject.title} ${index + 1}`} 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Meta & Description */}
              <div className="p-6 sm:p-10 rounded-2xl glass-card space-y-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {selectedProject.icon || selectedProject.tag || 'FEATURED WORK'}
                </span>

                <h1 className="font-montserrat text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
                  {selectedProject[`title_${lang}`] || selectedProject.title}
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-kanit">
                  {selectedProject[`description_${lang}`] || selectedProject.description}
                </p>

                {/* External Action Links */}
                {(selectedProject.demoUrl || selectedProject.referenceUrl) && (
                  <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                    {selectedProject.demoUrl && (
                      <a 
                        href={selectedProject.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                      >
                        <Monitor size={18} />
                        <span>View Live Demo</span>
                      </a>
                    )}
                    {selectedProject.referenceUrl && (
                      <a 
                        href={selectedProject.referenceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
                      >
                        <LinkIcon size={18} />
                        <span>Source Reference</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

            </article>
          ) : (
            <div className="text-center py-24 glass-card rounded-2xl text-slate-400">
              <Monitor size={48} className="mx-auto mb-4 opacity-30 text-slate-500" />
              <p className="text-base font-semibold">Project Not Found</p>
            </div>
          )}
        </main>
      )}

      {/* --- TOAST NOTIFICATION --- */}
      <div className={`fixed bottom-6 right-4 sm:right-6 z-[200] px-5 py-3 rounded-xl flex items-center gap-3 text-white text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-md transition-all duration-300 ${
        toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
      } ${toast.isError ? 'bg-red-500/90 border border-red-400/30' : 'bg-emerald-600/90 border border-emerald-400/30'}`}>
        {toast.isError ? <Settings size={18} /> : <CheckCircle size={18} />}
        <span>{toast.msg}</span>
      </div>

    </div>
  );
}
