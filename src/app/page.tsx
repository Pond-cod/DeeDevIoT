"use client";

import React, { useEffect, useState, useRef, ComponentType } from 'react';
import {
  Settings, Monitor, Lightbulb, PhoneCall, CheckCircle,
  Menu, X, ChevronRight, Send, Code, Cpu, Wifi, Zap, RefreshCw, ArrowLeft,
  Mail, Phone, Facebook, MessageCircle, Settings2, Link as LinkIcon, Star, Sliders,
  Sparkles, ExternalLink, Layers, ArrowUpRight, Shield, Globe, ArrowDown,
  TrendingUp, Users, Award, Briefcase, MapPin, Clock
} from 'lucide-react';

// Safe Lucide Icon Registry
const ICON_MAP: Record<string, any> = {
  Settings, Monitor, Lightbulb, PhoneCall, CheckCircle,
  Code, Cpu, Wifi, Zap, RefreshCw, Mail, Phone,
  Facebook, MessageCircle, Settings2, Star, Sliders,
  Sparkles, Layers, Shield, Globe, TrendingUp, Users, Award, Briefcase
};

function getLucideIcon(iconName?: string) {
  if (!iconName) return Sparkles;
  return ICON_MAP[iconName] || (require('lucide-react') as any)[iconName] || Sparkles;
}

// Count-up hook
function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    setCount(0);
    let start = 0;
    const step = Math.max(1, Math.ceil(target / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

// Separate component so hook is not called inside .map()
function StatItem({ value, suffix, label, icon: Icon, active }: {
  value: number; suffix: string; label: string;
  icon: ComponentType<{ size?: number }>; active: boolean;
}) {
  const count = useCountUp(value, 1800, active);
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center mb-3 text-indigo-400 group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      <div className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-black text-white tabular-nums tracking-tight">
        {count}{suffix}
      </div>
      <div className="text-zinc-400 text-xs sm:text-sm mt-1.5 font-medium">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'main' | 'detail'>('main');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, msg: '', isError: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'th'>('th');
  const [scrolled, setScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Stats counter visibility
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, [loading]);

  // Site Data State
  const [siteData, setSiteData] = useState<any>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [navItems, setNavItems] = useState<any[]>([]);
  const [concepts, setConcepts] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [sectionItems, setSectionItems] = useState<any[]>([]);

  const t = (key: string, fallback: string = '') =>
    siteData[`${key}_${lang}`] || siteData[key] || fallback;

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
          configRes.json(), servicesRes.json(), integrationsRes.json(),
          navRes.json(), conceptRes.json(), sectionsRes.json(), sectionItemsRes.json()
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

  // Scroll reveal observer
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, view]);

  const showToast = (msg: string, isError = false) => {
    setToast({ show: true, msg, isError });
    setTimeout(() => setToast({ show: false, msg: '', isError: false }), 3000);
  };

  // Modern Minimal Loading Screen (No Gears)
  if (loading) {
    return (
      <div className="fixed inset-0 bg-zinc-950 z-[9999] flex flex-col items-center justify-center p-6">
        <div className="relative w-14 h-14 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl animate-pulse" />
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin" />
          <Sparkles className="w-5 h-5 text-violet-400 absolute animate-pulse" />
        </div>
        <p className="text-zinc-400 font-montserrat font-semibold tracking-widest text-xs uppercase animate-pulse">
          DEEDEV IOT
        </p>
      </div>
    );
  }

  const selectedProject = projects.find(p => String(p.id) === String(selectedProjectId));
  const featuredProject = projects[0] || null;
  const gridProjects = projects.slice(1);

  // Stats data
  const stats = [
    { value: parseInt(t('stat1_value', '15')), suffix: t('stat1_suffix', '+'), label: t('stat1_label', 'โปรเจกต์ที่สำเร็จ'), icon: Briefcase },
    { value: parseInt(t('stat2_value', '5')), suffix: t('stat2_suffix', '+'), label: t('stat2_label', 'ปีประสบการณ์'), icon: Clock },
    { value: parseInt(t('stat3_value', '30')), suffix: t('stat3_suffix', '+'), label: t('stat3_label', 'ลูกค้าที่ไว้วางใจ'), icon: Users },
    { value: parseInt(t('stat4_value', '100')), suffix: t('stat4_suffix', '%'), label: t('stat4_label', 'ความพึงพอใจ'), icon: Award },
  ];

  return (
    <div className="min-h-screen font-kanit bg-zinc-950 text-zinc-100 overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">

      {/* ─── NAVBAR ─── */}
      <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-nav py-3 sm:py-3.5 shadow-xl shadow-black/50'
          : 'bg-transparent py-4 sm:py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

          {/* Sleek Minimalist Brand Logo (Text-Only / Minimal Badge) */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            onClick={() => { setView('main'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            </div>
            <span className="font-montserrat text-lg sm:text-xl font-black tracking-tight uppercase text-white">
              DEE<span className="text-violet-400">DEV</span><span className="text-indigo-400">IOT</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 font-medium text-sm">
            {navItems.map(item => (
              <a
                key={item.id}
                href={item.href}
                className="text-zinc-300 hover:text-white transition-colors tracking-wide relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-indigo-400 hover:after:w-full after:transition-all after:duration-300"
              >
                {lang === 'th' ? item.label_th : item.label_en}
              </a>
            ))}
            <div className="flex bg-zinc-900/80 p-0.5 rounded-lg border border-zinc-800">
              <button onClick={() => setLang('th')} className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${lang === 'th' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}>TH</button>
              <button onClick={() => setLang('en')} className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}>EN</button>
            </div>
            <a
              href="#contact"
              className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-1.5"
            >
              {t('nav_btn', 'ติดต่อเรา')}
              <ChevronRight size={13} />
            </a>
          </nav>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-indigo-400"
            >{lang.toUpperCase()}</button>
            <button
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 w-full max-w-xs h-full bg-zinc-900/98 border-l border-zinc-800 shadow-2xl flex flex-col pt-20 pb-8 px-6 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-zinc-800">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Navigation</span>
            <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
              <button onClick={() => setLang('th')} className={`px-3 py-1 rounded text-xs font-bold ${lang === 'th' ? 'bg-indigo-600 text-white' : 'text-zinc-400'}`}>TH</button>
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded text-xs font-bold ${lang === 'en' ? 'bg-indigo-600 text-white' : 'text-zinc-400'}`}>EN</button>
            </div>
          </div>
          <nav className="flex flex-col space-y-1 flex-1">
            {navItems.map(item => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-zinc-800/60 text-zinc-200 hover:text-white font-semibold transition-colors"
              >
                <span>{lang === 'th' ? item.label_th : item.label_en}</span>
                <ChevronRight size={16} className="text-zinc-500" />
              </a>
            ))}
          </nav>
          <div className="pt-5 border-t border-zinc-800">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Send size={15} />
              <span>{t('nav_btn', 'ติดต่อเรา')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── CONTENT VIEWS ─── */}
      {view === 'main' ? (
        <main>

          {/* ═══ 1. HERO SECTION ═══ */}
          <section className="relative min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden animate-mesh">

            {/* Background grid pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            {/* Ambient glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/12 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

              {/* Badge */}
              <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 backdrop-blur-md mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-200">
                  {t('hero_badge', 'Web & IoT Solution Partner')}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="reveal delay-100 font-montserrat text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-[1.12] tracking-tight">
                {lang === 'th' ? (
                  <>
                    สร้างสรรค์ผลงาน<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400">
                      ที่ขับเคลื่อนธุรกิจ
                    </span>
                  </>
                ) : (
                  <>
                    We Build Digital<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400">
                      Solutions That Matter
                    </span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="reveal delay-200 text-base sm:text-xl text-zinc-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                {t('hero_sub', 'รับออกแบบและพัฒนา Web Application & IoT System ครบวงจร ตั้งแต่ไอเดียจนถึง Production พร้อมทีมผู้เชี่ยวชาญ')}
              </p>

              {/* CTAs */}
              <div className="reveal delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <a
                  href="#portfolio"
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm sm:text-base tracking-wide shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase size={18} />
                  <span>{t('hero_btn2_text', 'ดูผลงานของเรา')}</span>
                </a>
                <a
                  href="#contact"
                  className="w-full sm:w-auto px-8 py-4 bg-white/[0.06] hover:bg-white/[0.12] border border-white/12 hover:border-white/20 text-zinc-200 hover:text-white rounded-2xl font-bold text-sm sm:text-base tracking-wide transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                >
                  <Send size={16} />
                  <span>{t('hero_btn1_text', 'ปรึกษาฟรี')}</span>
                </a>
              </div>

              {/* Scroll hint */}
              <div className="reveal delay-500 mt-16 flex flex-col items-center gap-2 text-zinc-500 text-xs tracking-widest uppercase">
                <span>เลื่อนดูเพิ่มเติม</span>
                <ArrowDown size={16} className="animate-bounce" />
              </div>
            </div>
          </section>

          {/* ═══ 2. STATS BAR ═══ */}
          <section ref={statsRef} className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-transparent to-violet-600/5 pointer-events-none" />
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {stats.map((stat, i) => (
                  <StatItem
                    key={i}
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                    icon={stat.icon}
                    active={statsVisible}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ═══ 3. FEATURED WORK / PORTFOLIO ═══ */}
          <section id="portfolio" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative border-b border-zinc-800/60">
            <div className="max-w-7xl mx-auto">

              {/* Section Header */}
              <div className="text-center mb-14 sm:mb-20 reveal">
                <span className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-3 block">
                  {t('svc_badge', 'Portfolio & Featured Work')}
                </span>
                <h2 className="font-montserrat text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 uppercase tracking-tight">
                  {t('solutions_title', 'ผลงานของเรา')}
                </h2>
                <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                  {t('solutions_description', 'โปรเจกต์ที่ผ่านมาสะท้อนถึงความเชี่ยวชาญ ความตั้งใจ และคุณภาพที่ส่งมอบให้ลูกค้าทุกราย')}
                </p>
              </div>

              {projects.length > 0 ? (
                <>
                  {/* Featured Hero Project Card */}
                  {featuredProject && (
                    <div
                      className="reveal mb-6 sm:mb-8 group cursor-pointer rounded-3xl overflow-hidden relative bg-zinc-900 border border-zinc-800 hover:border-indigo-500/40 transition-all duration-500 shadow-2xl shadow-black/50"
                      onClick={() => { setSelectedProjectId(featuredProject.id || '0'); setView('detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >
                      <div className="relative aspect-[21/9] sm:aspect-[16/7] overflow-hidden">
                        {featuredProject.imageUrl ? (
                          <img
                            src={featuredProject.imageUrl.split(',')[0].trim()}
                            alt={featuredProject.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                            <Monitor size={64} className="text-zinc-700" />
                          </div>
                        )}
                        {/* Dark overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                          <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-violet-500/15 text-violet-300 border border-violet-400/25 mb-3">
                            ✦ {featuredProject.icon || 'Featured Project'}
                          </span>
                          <h3 className="font-montserrat text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight group-hover:text-indigo-300 transition-colors">
                            {featuredProject[`title_${lang}`] || featuredProject.title}
                          </h3>
                          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl line-clamp-2 mb-5">
                            {featuredProject[`description_${lang}`] || featuredProject.description}
                          </p>
                          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-sm group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg">
                            <span>{lang === 'th' ? 'ดูรายละเอียด' : 'View Project'}</span>
                            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Project Grid */}
                  {gridProjects.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                      {gridProjects.map((p, i) => {
                        const firstImg = p.imageUrl ? p.imageUrl.split(',')[0].trim() : '';
                        return (
                          <div
                            key={p.id || i}
                            className={`reveal delay-${(i % 3) * 100 + 100} group glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col border border-zinc-800/80 hover:border-indigo-500/35 transition-all duration-300`}
                            onClick={() => { setSelectedProjectId(p.id || String(i + 1)); setView('detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          >
                            <div className="aspect-[16/9] overflow-hidden relative bg-zinc-900">
                              {firstImg ? (
                                <img
                                  src={firstImg}
                                  alt={p.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                                  <Monitor size={32} />
                                </div>
                              )}
                              <div className="absolute top-3 left-3">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-zinc-950/85 text-indigo-300 border border-zinc-800 backdrop-blur-sm">
                                  {p.icon || 'Project'}
                                </span>
                              </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                              <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
                                {p[`title_${lang}`] || p.title}
                              </h3>
                              <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2 leading-relaxed flex-1">
                                {p[`description_${lang}`] || p.description}
                              </p>
                              <div className="pt-3 mt-3 border-t border-zinc-800/70 flex items-center justify-between text-xs font-semibold text-indigo-400">
                                <span>{lang === 'th' ? 'ดูรายละเอียด' : 'View Details'}</span>
                                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-24 px-8 glass-card rounded-3xl border border-dashed border-zinc-800 text-zinc-400">
                  <Monitor size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-base font-semibold mb-2">ยังไม่มีผลงาน</p>
                  <p className="text-sm text-zinc-500">เพิ่มโปรเจกต์ได้ผ่าน Admin CMS</p>
                </div>
              )}
            </div>
          </section>

          {/* ═══ 4. SERVICES / CONCEPT ═══ */}
          <section id="services" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-zinc-900/30 relative border-b border-zinc-800/60">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 sm:gap-16">

                <div className="lg:w-1/3 reveal text-center lg:text-left">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-3 block">
                    {lang === 'th' ? 'สิ่งที่เราทำ' : 'What We Do'}
                  </span>
                  <h2 className="font-montserrat text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                    {t('concept_title1', 'บริการ')}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                      {t('concept_title2', 'ของเรา')}
                    </span>
                  </h2>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
                    {t('concept_description', 'เราพัฒนาระบบที่ทำงานสอดประสานกันอย่างราบรื่น ตั้งแต่ Frontend จนถึง IoT Hardware')}
                  </p>
                  <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full mx-auto lg:mx-0" />
                  <a
                    href="#contact"
                    className="mt-6 inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold text-sm transition-colors group"
                  >
                    <span>{lang === 'th' ? 'ปรึกษาโปรเจกต์' : 'Discuss Project'}</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
                  {concepts.map((c, i) => {
                    const IconComp = getLucideIcon(c.icon);
                    return (
                      <div
                        key={c.id || i}
                        className={`reveal delay-${(i + 1) * 100} p-5 sm:p-6 rounded-2xl glass-card group hover:border-indigo-500/30 transition-all duration-300`}
                      >
                        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-500/15 transition-all">
                          <IconComp size={22} />
                        </div>
                        <h4 className="text-base font-bold mb-2 text-white group-hover:text-indigo-300 transition-colors">
                          {lang === 'th' ? c.title_th : c.title_en}
                        </h4>
                        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                          {lang === 'th' ? c.desc_th : c.desc_en}
                        </p>
                      </div>
                    );
                  })}
                  {concepts.length === 0 && [
                    { icon: Code, th: 'Web Application', desc: 'พัฒนา Web App ที่ใช้งานง่าย รองรับทุกอุปกรณ์' },
                    { icon: Cpu, th: 'IoT System', desc: 'ออกแบบและติดตั้งระบบ IoT เชื่อมต่ออุปกรณ์อัจฉริยะ' },
                    { icon: Shield, th: 'Cloud & API', desc: 'พัฒนา Backend API และบริหาร Cloud Infrastructure' },
                  ].map((item, i) => (
                    <div key={i} className={`reveal delay-${(i + 1) * 100} p-5 sm:p-6 rounded-2xl glass-card group`}>
                      <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 flex items-center justify-center mb-4">
                        <item.icon size={22} />
                      </div>
                      <h4 className="text-base font-bold mb-2 text-white">{item.th}</h4>
                      <p className="text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══ 5. INTEGRATIONS ═══ */}
          {integrations.length > 0 && (
            <section id="integrations" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative border-b border-zinc-800/60">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14 sm:mb-20 reveal">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-3 block">
                    {t('port_badge', 'Integrations')}
                  </span>
                  <h2 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 uppercase">
                    {t('integrations_title', 'เชื่อมต่อทุกระบบ')}
                  </h2>
                  <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                    {t('port_desc', 'รองรับการเชื่อมต่อกับแพลตฟอร์มและฮาร์ดแวร์หลากหลาย')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {integrations.map((int, i) => (
                    <div
                      key={int.id || i}
                      className="reveal flex flex-col sm:flex-row gap-5 p-5 sm:p-6 rounded-2xl glass-card group hover:border-indigo-500/30 transition-all duration-300"
                    >
                      {int.imageUrl && (
                        <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                          <img
                            src={int.imageUrl}
                            alt={int.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-violet-400 mb-1.5 block">{int.tag}</span>
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                            {int[`title_${lang}`] || int.title}
                          </h3>
                          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                            {int[`description_${lang}`] || int.description}
                          </p>
                        </div>
                        {int.referenceUrl && (
                          <a
                            href={int.referenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors"
                          >
                            <span>ดูข้อมูล</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ═══ 6. DYNAMIC CMS SECTIONS ═══ */}
          {sections.filter(s => s.is_active === 'TRUE').map((sec, idx) => (
            <section
              key={sec.id}
              id={sec.id}
              className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 ${idx % 2 === 0 ? 'bg-zinc-900/30' : 'bg-zinc-950'} relative border-b border-zinc-800/60`}
            >
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14 sm:mb-20 reveal">
                  <h2 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 uppercase tracking-tight">
                    {lang === 'th' ? sec.title_th : sec.title_en}
                  </h2>
                  {(sec.subtitle_en || sec.subtitle_th) && (
                    <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                      {lang === 'th' ? sec.subtitle_th : sec.subtitle_en}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {sectionItems.filter(item => item.section_id === sec.id).map((item, i) => {
                    const ItemIcon = getLucideIcon(item.icon);
                    return (
                      <div key={item.id || i} className="reveal p-6 rounded-2xl glass-card group hover:border-indigo-500/30 transition-all">
                        {item.imageUrl ? (
                          <div className="aspect-[16/10] mb-5 rounded-xl overflow-hidden bg-zinc-900">
                            <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title_en} loading="lazy" />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ItemIcon size={22} />
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                          {lang === 'th' ? item.title_th : item.title_en}
                        </h3>
                        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                          {lang === 'th' ? item.desc_th : item.desc_en}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          ))}

          {/* ═══ 7. CONTACT SECTION ═══ */}
          <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative overflow-hidden">

            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">

              {/* Header */}
              <div className="text-center mb-14 sm:mb-16 reveal">
                <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-3 block">
                  Get in Touch
                </span>
                <h2 className="font-montserrat text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 uppercase tracking-tight">
                  {t('contact_title', 'ติดต่อเรา')}
                </h2>
                <p className="text-zinc-400 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed">
                  {t('contact_description', 'ทีมงานของเราพร้อมรับฟังและให้คำปรึกษาโปรเจกต์ของคุณ ไม่ว่าจะเป็น Web, Mobile หรือ IoT')}
                </p>
              </div>

              {/* CTA Banner */}
              <div className="reveal mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-900 p-8 sm:p-12 text-center border border-indigo-500/30 shadow-2xl shadow-indigo-950/60">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                  <p className="text-indigo-100 text-sm sm:text-lg mb-6 font-light leading-relaxed">
                    {lang === 'th'
                      ? 'มีโปรเจกต์ในใจแล้วหรือยัง? มาคุยกันเลย — เราให้คำปรึกษาฟรี ไม่มีข้อผูกมัด'
                      : 'Have a project in mind? Let\'s talk — free consultation, no commitment required.'
                    }
                  </p>
                  <a
                    href={`mailto:${t('contact_email', 'hello@deedeviot.com')}`}
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-indigo-900 font-black text-sm sm:text-base rounded-2xl hover:bg-zinc-100 transition-all shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Mail size={18} />
                    <span>{lang === 'th' ? 'ส่งอีเมลหาเรา' : 'Send us an Email'}</span>
                    <ChevronRight size={16} />
                  </a>
                </div>
              </div>

              {/* Contact Cards Grid */}
              <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Email */}
                <a
                  href={`mailto:${t('contact_email', 'hello@deedeviot.com')}`}
                  className="group p-5 sm:p-6 rounded-2xl glass-card hover:border-rose-500/30 flex flex-col gap-4 transition-all duration-300 active:scale-[0.98]"
                  id="contact-email"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-400/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Mail size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Email</span>
                    <span className="text-white font-bold text-sm break-all leading-snug group-hover:text-rose-300 transition-colors">
                      {t('contact_email', 'hello@deedeviot.com')}
                    </span>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${t('contact_phone', '02-123-4567')}`}
                  className="group p-5 sm:p-6 rounded-2xl glass-card hover:border-emerald-500/30 flex flex-col gap-4 transition-all duration-300 active:scale-[0.98]"
                  id="contact-phone"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Phone size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Phone</span>
                    <span className="text-white font-bold text-sm group-hover:text-emerald-300 transition-colors">
                      {t('contact_phone', '02-123-4567')}
                    </span>
                  </div>
                </a>

                {/* Facebook */}
                <a
                  href={t('facebook_url', 'https://facebook.com/deedeviot')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 sm:p-6 rounded-2xl glass-card hover:border-indigo-500/30 flex flex-col gap-4 transition-all duration-300 active:scale-[0.98]"
                  id="contact-facebook"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Facebook size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Facebook</span>
                    <span className="text-white font-bold text-sm group-hover:text-indigo-300 transition-colors">
                      {t('contact_facebook', 'DeeDevIOT')}
                    </span>
                  </div>
                </a>

                {/* LINE */}
                <a
                  href={`https://line.me/ti/p/~${t('contact_line', '@DEEDEVIOT')?.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 sm:p-6 rounded-2xl glass-card hover:border-green-500/30 flex flex-col gap-4 transition-all duration-300 active:scale-[0.98]"
                  id="contact-line"
                >
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-400/20 text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">LINE</span>
                    <span className="text-white font-bold text-sm group-hover:text-green-300 transition-colors">
                      {t('contact_line', '@DEEDEVIOT')}
                    </span>
                  </div>
                </a>

              </div>
            </div>
          </section>

          {/* ═══ 8. FOOTER ═══ */}
          <footer className="py-10 sm:py-14 bg-zinc-950 border-t border-zinc-800/80 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

              {/* Top Row */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 pb-8 border-b border-zinc-800/60">
                {/* Brand */}
                <div className="font-montserrat text-xl font-black text-white tracking-tight uppercase select-none flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>DEE<span className="text-violet-400">DEV</span><span className="text-indigo-400">IOT</span></span>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3">
                  <a
                    href={t('facebook_url', 'https://facebook.com/deedeviot')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all"
                    aria-label="Facebook"
                  >
                    <Facebook size={15} />
                  </a>
                  <a
                    href={`https://line.me/ti/p/~${t('contact_line', '@DEEDEVIOT')?.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all"
                    aria-label="LINE"
                  >
                    <MessageCircle size={15} />
                  </a>
                  <a
                    href={`mailto:${t('contact_email', 'hello@deedeviot.com')}`}
                    className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-rose-600 hover:border-rose-500 transition-all"
                    aria-label="Email"
                  >
                    <Mail size={15} />
                  </a>
                </div>

                {/* Nav shortlinks */}
                <div className="hidden lg:flex items-center gap-5 text-zinc-400 text-xs uppercase tracking-wide">
                  <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
                  <a href="#services" className="hover:text-white transition-colors">Services</a>
                  <a href="#contact" className="hover:text-white transition-colors">Contact</a>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-zinc-500 text-xs">
                <p>{t('footer_bio', '© 2026 DeeDevIOT. All Rights Reserved.')}</p>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500">Crafted with ♥ in Thailand</span>
                  <a
                    href="/login"
                    className="p-1.5 rounded-lg text-zinc-600 hover:text-indigo-400 hover:bg-zinc-900 transition-all"
                    aria-label="Admin"
                  >
                    <Settings size={14} />
                  </a>
                </div>
              </div>
            </div>
          </footer>

        </main>
      ) : (

        /* ═══ PROJECT DETAIL VIEW ═══ */
        <main className="pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <button
            onClick={() => { setView('main'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 text-zinc-300 hover:text-white font-semibold mb-8 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all active:scale-95 text-xs sm:text-sm"
          >
            <ArrowLeft size={15} />
            <span>{lang === 'th' ? 'กลับหน้าหลัก' : 'Back to Portfolio'}</span>
          </button>

          {selectedProject ? (
            <article className="space-y-6 animate-fade-in-up">

              {/* Media */}
              <div className="space-y-4">
                {selectedProject.videoUrls && selectedProject.videoUrls.split(',').filter((u: string) => u.trim()).length > 0 ? (
                  selectedProject.videoUrls.split(',').filter((u: string) => u.trim()).map((url: string, index: number) => (
                    <div key={index} className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-zinc-800">
                      <iframe
                        src={url.trim()}
                        className="w-full h-full border-none"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title={`${selectedProject.title} Video ${index + 1}`}
                      />
                    </div>
                  ))
                ) : (
                  selectedProject.imageUrl && selectedProject.imageUrl.split(',').filter((u: string) => u.trim()).map((url: string, index: number) => (
                    <div key={index} className="rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 border border-zinc-800">
                      <img
                        src={url.trim()}
                        className="w-full h-auto object-cover"
                        alt={`${selectedProject.title} ${index + 1}`}
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Meta */}
              <div className="p-6 sm:p-10 rounded-2xl glass-card space-y-5">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                  {selectedProject.icon || selectedProject.tag || 'Featured Work'}
                </span>
                <h1 className="font-montserrat text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
                  {selectedProject[`title_${lang}`] || selectedProject.title}
                </h1>
                <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
                  {selectedProject[`description_${lang}`] || selectedProject.description}
                </p>
                {(selectedProject.demoUrl || selectedProject.referenceUrl) && (
                  <div className="pt-5 border-t border-zinc-800 flex flex-col sm:flex-row gap-4">
                    {selectedProject.demoUrl && (
                      <a
                        href={selectedProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
                      >
                        <Monitor size={17} />
                        <span>View Live Demo</span>
                      </a>
                    )}
                    {selectedProject.referenceUrl && (
                      <a
                        href={selectedProject.referenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
                      >
                        <LinkIcon size={17} />
                        <span>Source Reference</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

            </article>
          ) : (
            <div className="text-center py-24 glass-card rounded-2xl text-zinc-400">
              <Monitor size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-base font-semibold">Project Not Found</p>
            </div>
          )}
        </main>
      )}

      {/* Toast */}
      <div className={`fixed bottom-6 right-4 sm:right-6 z-[200] px-5 py-3 rounded-xl flex items-center gap-3 text-white text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-md transition-all duration-300 ${
        toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
      } ${toast.isError ? 'bg-red-500/90 border border-red-400/30' : 'bg-emerald-600/90 border border-emerald-400/30'}`}>
        {toast.isError ? <Settings size={16} /> : <CheckCircle size={16} />}
        <span>{toast.msg}</span>
      </div>

    </div>
  );
}
