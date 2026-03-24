"use client";

import React, { useEffect, useState, useRef } from 'react';
import {
  Settings, Monitor, Lightbulb, PhoneCall, CheckCircle,
  Menu, ChevronRight, Send, Code, Cpu, Wifi, Zap, RefreshCw, ArrowLeft,
  Mail, Phone, Facebook, MessageCircle, Settings2, Link
} from 'lucide-react';

// --- STYLES (Tailwind + Custom Animations in globals.css) ---
export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('main'); // 'main' or 'project-detail'
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, msg: '', isError: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'th'>('th');

  // Site Data State (Flat Config from /api/config)
  const [siteData, setSiteData] = useState<any>({});
  
  // Translation Helper
  const t = (key: string, fallback: string = '') => {
    return siteData[`${key}_${lang}`] || siteData[key] || fallback;
  };

  const [projects, setProjects] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);

  // Fetch Data on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configRes, servicesRes, integrationsRes] = await Promise.all([
          fetch('/api/config', { cache: 'no-store' }),
          fetch('/api/services', { cache: 'no-store' }),
          fetch('/api/integrations', { cache: 'no-store' })
        ]);
        
        const configJson = await configRes.json();
        const servicesJson = await servicesRes.json();
        const integrationsJson = await integrationsRes.json();

        if (configJson.success) setSiteData(configJson.data);
        if (servicesJson.success) setProjects(servicesJson.data);
        if (integrationsJson.success) setIntegrations(integrationsJson.data);
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
      <div className="fixed inset-0 bg-slate-900 z-[9999] flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 master-gear-spin mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="35" fill="none" stroke="#FFD200" strokeWidth="8" strokeDasharray="10 5" />
            <circle cx="50" cy="50" r="15" fill="#1D4ED8" />
          </svg>
        </div>
        <p className="text-white font-mono font-bold tracking-widest text-xs uppercase animate-pulse">Initializing Ecosystem...</p>
      </div>
    );
  }

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="min-h-screen font-kanit">
      
      {/* --- PUBLIC VIEW --- */}
      <div>
        
        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 h-20">
          <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => { setView('main'); window.scrollTo(0,0); }}>
              <Settings className="w-10 h-10 text-accent-500 master-gear-spin group-hover:scale-110 transition-transform" />
              <span className="font-montserrat text-2xl font-black tracking-tighter text-slate-900 uppercase">
                DEE<span className="text-brand-500">DEV</span><span className="text-accent-500">IOT</span>
              </span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-10 font-bold text-slate-600">
              <a href="#concept" className="hover:text-brand-500 transition-colors uppercase tracking-wider text-sm">{t('nav_item1', 'Concept')}</a>
              <a href="#solutions" className="hover:text-brand-500 transition-colors uppercase tracking-wider text-sm">{t('solutions_title', 'Featured Works')}</a>
              
              {/* Language Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-xl items-center border border-slate-200">
                <button 
                  onClick={() => setLang('en')} 
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === 'en' ? 'bg-white text-brand-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang('th')} 
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === 'th' ? 'bg-white text-brand-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  TH
                </button>
              </div>

              <a href="#contact" className="bg-brand-500 text-white px-8 py-3 rounded-full shadow-lg shadow-brand-500/30 hover:bg-brand-600 hover:-translate-y-1 transition-all uppercase text-sm tracking-wide">{t('nav_btn', 'Contact Us')}</a>
            </div>

            <div className="lg:hidden flex items-center gap-4">
              <button 
                onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
                className="bg-slate-100 w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black text-brand-500 border border-slate-200"
              >
                {lang.toUpperCase()}
              </button>
              <button className="p-2 text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="w-8 h-8" />
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div className={`absolute top-20 left-0 w-full bg-slate-900 p-8 flex flex-col space-y-6 lg:hidden transition-all duration-300 origin-top ${mobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
            <a href="#concept" onClick={() => setMobileMenuOpen(false)} className="text-white text-xl font-bold flex justify-between items-center border-b border-white/10 pb-4">{t('nav_item1', 'Concept')} <ChevronRight /></a>
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="text-white text-xl font-bold flex justify-between items-center border-b border-white/10 pb-4">{t('solutions_title', 'Featured Works')} <ChevronRight /></a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-accent-500 text-xl font-bold flex justify-between items-center">{t('nav_btn', 'Contact Us')} <Send /></a>
          </div>
        </nav>

        {view === 'main' ? (
          <main>
            {/* Hero Section */}
            <section className="pt-48 pb-32 px-6 bg-slate-900 relative overflow-hidden">
              {/* Background Glows */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-brand-700)_0%,_transparent_70%)] opacity-30"></div>
              <div className="absolute top-40 left-10 text-white/5 master-gear-spin"><Code size={64} /></div>
              <div className="absolute bottom-20 right-1/4 text-accent-500/5 counter-spin"><Cpu size={80} /></div>
              
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
                <div className="lg:w-3/5 text-white text-center lg:text-left">
                  <div className="reveal inline-flex items-center bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full mb-8 border border-white/10">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-3 animate-ping"></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-accent-500">{t('hero_badge', 'TECHNOLOGY POWERHOUSE')}</span>
                  </div>
                  <h1 className="reveal delay-100 font-montserrat text-5xl lg:text-8xl font-black mb-8 leading-tight uppercase tracking-tight">
                    {t('hero_headline', 'GEARING UP FOR THE FUTURE.')}
                  </h1>
                  <p className="reveal delay-200 text-lg md:text-xl text-blue-100/70 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light whitespace-pre-line">
                    {t('hero_sub', 'Building intelligent software and hardware ecosystems.')}
                  </p>
                  <div className="reveal delay-300 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                    <a href="#solutions" className="px-10 py-5 bg-accent-500 text-slate-900 rounded-2xl font-black text-lg shadow-xl shadow-yellow-500/20 hover:bg-yellow-400 hover:-translate-y-1 transition-all uppercase tracking-wide">
                      {t('hero_btn1_text', 'Explore Solutions')}
                    </a>
                    <a href="#contact" className="px-10 py-5 border-2 border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/5 transition-all uppercase tracking-wide">
                      {t('hero_btn2_text', 'Get a Quote')}
                    </a>
                  </div>
                </div>
                
                {/* BIG POLISHED GEAR GRAPHIC */}
                <div className="lg:w-2/5 flex lg:justify-end">
                   <div className="relative w-72 h-72 md:w-[450px] md:h-[450px]">
                      {/* Ambient Glow behind gear */}
                      <div className="absolute inset-0 bg-accent-500/10 blur-[120px] rounded-full animate-pulse"></div>
                      
                      {/* Master Gear */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="master-gear-spin w-64 h-64 md:w-96 md:h-96 relative">
                          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_20px_50px_rgba(255,210,0,0.3)]">
                            <defs>
                              <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFD200" />
                                <stop offset="100%" stopColor="#F59E0B" />
                              </linearGradient>
                            </defs>
                            <g fill="url(#gearGrad)">
                               {[0,45,90,135,180,225,270,315].map(deg => (
                                 <path key={deg} d="M92 5 Q100 0 108 5 L112 35 Q100 35 88 35 Z" transform={`rotate(${deg} 100 100)`} />
                               ))}
                               <circle cx="100" cy="100" r="70" />
                            </g>
                            <circle cx="100" cy="100" r="30" fill="#1D4ED8" />
                            <circle cx="100" cy="100" r="10" fill="#FFFFFF" />
                            {/* Inner dashboard lines */}
                            <circle cx="100" cy="100" r="50" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                          </svg>
                        </div>
                      </div>

                      {/* Orbiting Icons - Larger Orbit Radius */}
                      <div className="absolute inset-0 counter-spin pointer-events-none">
                         {[0,60,120,180,240,300].map((deg, i) => (
                           <div key={i} className="absolute inset-0" style={{ transform: `rotate(${deg}deg)` }}>
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                 <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-500 rounded-full flex items-center justify-center border-4 border-accent-500 shadow-lg shadow-blue-500/40 master-gear-spin pointer-events-auto">
                                    {i === 0 && <Wifi className="text-white w-2/3 h-2/3" />}
                                    {i === 1 && <Code className="text-white w-2/3 h-2/3" />}
                                    {i === 2 && <Settings2 className="text-white w-2/3 h-2/3" />}
                                    {i === 3 && <Zap className="text-white w-2/3 h-2/3" />}
                                    {i === 4 && <Cpu className="text-white w-2/3 h-2/3" />}
                                    {i === 5 && <RefreshCw className="text-white w-2/3 h-2/3" />}
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>

                   </div>
                </div>
              </div>
            </section>

            {/* Concept Section */}
            <section id="concept" className="py-32 px-6 bg-white overflow-hidden">
               <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col lg:flex-row items-center gap-16">
                     <div className="lg:w-1/3 reveal text-center lg:text-left">
                        <h2 className="font-montserrat text-4xl font-black text-slate-900 mb-6 uppercase leading-tight">
                           {t('concept_title1', 'SMART')}<br />
                           <span className="text-brand-500">{t('concept_title2', 'GEARING')}</span>
                        </h2>
                        <p className="text-slate-500 mb-8 leading-relaxed text-lg">{t('concept_description', 'Our systems work in harmony like precision-engineered gears.')}</p>
                        <div className="inline-block w-20 h-2 bg-accent-500 rounded-full"></div>
                     </div>
                     <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="reveal delay-100 p-8 rounded-3xl bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group">
                           <div className="w-14 h-14 bg-brand-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/30 group-hover:rotate-12 transition-transform">
                              <Settings2 size={28} />
                           </div>
                           <h4 className="text-xl font-bold mb-4">{t('concept_c1t', 'Precision Eng.')}</h4>
                           <p className="text-slate-500 text-sm leading-relaxed">{t('concept_c1d', 'Every line of code and IoT component is designed for perfect harmony.')}</p>
                        </div>
                        <div className="reveal delay-200 p-8 rounded-3xl bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group">
                           <div className="w-14 h-14 bg-accent-500 text-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/30 group-hover:rotate-12 transition-transform">
                              <Zap size={28} />
                           </div>
                           <h4 className="text-xl font-bold mb-4">{t('concept_c2t', 'High Velocity')}</h4>
                           <p className="text-slate-500 text-sm leading-relaxed">{t('concept_c2d', 'Accelerate your business with high-performance systems.')}</p>
                        </div>
                        <div className="reveal delay-300 p-8 rounded-3xl bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group">
                           <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-900/30 group-hover:rotate-12 transition-transform">
                              <RefreshCw size={28} />
                           </div>
                           <h4 className="text-xl font-bold mb-4">{t('concept_c3t', 'Steady Growth')}</h4>
                           <p className="text-slate-500 text-sm leading-relaxed">{t('concept_c3d', 'Reliable tech that ensures your business thrives consistently.')}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Solutions Section (Services) */}
            <section id="solutions" className="py-32 px-6 bg-slate-50">
               <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-20 reveal">
                     <h2 className="font-montserrat text-4xl lg:text-5xl font-black text-slate-900 mb-6 uppercase">{t('solutions_title', 'Featured Works')}</h2>
                     <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-lg">{t('solutions_description', 'Projects powered by our technology gears.')}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                     {projects.length > 0 ? projects.map((p, i) => (
                        <div key={p.id || i} className={`reveal delay-${(i % 3) * 100 + 100} group bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden transform hover:-translate-y-2`} onClick={() => { setSelectedProjectId(p.id || String(i)); setView('detail'); window.scrollTo(0,0); }}>
                           <div className="h-64 overflow-hidden relative">
                              <img src={p.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.title} />
                              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <span className="bg-accent-500 text-slate-900 px-6 py-2 rounded-full font-bold text-sm">ดูรายละเอียด</span>
                              </div>
                           </div>
                            <div className="p-8">
                               <div className="text-brand-500 font-bold text-xs uppercase mb-2 tracking-widest">{p.icon}</div>
                               <h3 className="text-2xl font-black text-slate-900 mb-3">{p[`title_${lang}`] || p.title}</h3>
                               <p className="text-slate-500 text-sm line-clamp-2">{p[`description_${lang}`] || p.description}</p>
                            </div>
                        </div>
                     )) : (
                        <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                           <Monitor size={48} className="mx-auto mb-4 opacity-20" />
                           <p>No projects fetched yet. Connect Google Sheets to see your work.</p>
                        </div>
                     )}
                  </div>
               </div>
            </section>

            {/* Integrations Section (Section 4 in Admin) */}
            <section id="integrations" className="py-32 px-6 bg-white overflow-hidden">
               <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-20 reveal">
                     <div className="inline-flex items-center bg-brand-50 px-4 py-1.5 rounded-full mb-6 border border-brand-100">
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-500">{t('port_badge', 'INTEGRATIONS')}</span>
                     </div>
                     <h2 className="font-montserrat text-4xl lg:text-5xl font-black text-slate-900 mb-6 uppercase leading-tight">
                        {t('integrations_title', 'Seamless Ecosystem Connectivity')}
                     </h2>
                     <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-lg">{t('port_desc', 'Connect our platforms with your daily tools.')}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {integrations.length > 0 ? integrations.map((int, i) => (
                       <div key={int.id || i} className="reveal flex flex-col md:flex-row gap-8 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200/50 hover:bg-white hover:shadow-2xl hover:border-transparent transition-all group">
                          <div className="md:w-1/3 aspect-square rounded-3xl overflow-hidden bg-white">
                             <img src={int.imageUrl} alt={int.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          </div>
                          <div className="md:w-2/3 flex flex-col justify-center">
                             <span className="text-brand-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-3 block">{int.tag}</span>
                             <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase">{int[`title_${lang}`] || int.title}</h3>
                             <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">{int[`description_${lang}`] || int.description}</p>
                             {int.referenceUrl && (
                                <a href={int.referenceUrl} target="_blank" className="flex items-center gap-2 text-slate-900 font-bold text-sm hover:text-brand-500 transition-colors uppercase tracking-wider">
                                   View Reference <ChevronRight size={16} />
                                </a>
                             )}
                          </div>
                       </div>
                    )) : (
                        <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                           <RefreshCw size={48} className="mx-auto mb-4 opacity-20" />
                           <p>Integrating your favorite tools soon...</p>
                        </div>
                    )}
                  </div>
               </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 px-6 bg-white">
               <div className="reveal max-w-6xl mx-auto bg-gradient-to-br from-brand-500 to-indigo-700 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative z-10">
                     <h2 className="font-montserrat text-4xl lg:text-7xl font-black text-white mb-6 uppercase leading-tight tracking-tight">{t('contact_title', 'READY TO POWER UP?')}</h2>
                     <p className="text-blue-100 text-lg md:text-xl mb-16 max-w-2xl mx-auto font-light leading-relaxed">{t('contact_description', 'Our gears are ready. Let us power your success.')}</p>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <a href={`mailto:${t('contact_email', 'hello@deedeviot.com')}`} className="group bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/20 transition-all flex flex-col items-center gap-4">
                           <div className="w-16 h-16 bg-red-500/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform"><Mail className="text-red-500" /></div>
                           <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Email</span>
                           <span className="text-white font-bold text-sm truncate w-full">{t('contact_email', 'hello@deedeviot.com')}</span>
                        </a>
                        <a href={`tel:${t('contact_phone', '02-123-4567')}`} className="group bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/20 transition-all flex flex-col items-center gap-4">
                           <div className="w-16 h-16 bg-green-500/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform"><Phone className="text-green-500" /></div>
                           <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Phone</span>
                           <span className="text-white font-bold text-sm truncate w-full">{t('contact_phone', '02-123-4567')}</span>
                        </a>
                        <a href={t('facebook_url', 'https://facebook.com/deedeviot')} target="_blank" className="group bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/20 transition-all flex flex-col items-center gap-4">
                           <div className="w-16 h-16 bg-blue-500/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform"><Facebook className="text-blue-500" /></div>
                           <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Facebook</span>
                           <span className="text-white font-bold text-sm truncate w-full">{t('contact_facebook', 'DeeDevIOT Page')}</span>
                        </a>
                        <a href={`https://line.me/ti/p/~${t('contact_line', '@DEEDEVIOT')?.replace('@','')}`} target="_blank" className="group bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/20 transition-all flex flex-col items-center gap-4">
                           <div className="w-16 h-16 bg-green-400/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform"><MessageCircle className="text-green-400" /></div>
                           <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Line</span>
                           <span className="text-white font-bold text-sm truncate w-full">{t('contact_line', '@DEEDEVIOT')}</span>
                        </a>
                     </div>
                  </div>
               </div>
            </section>

            <footer className="py-20 bg-slate-50 border-t border-slate-100 px-6">
               <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="font-montserrat text-2xl font-black text-slate-900 uppercase">DEEDEVIOT</div>
                  <div className="flex items-center gap-4 text-slate-300 text-[10px] font-bold tracking-widest uppercase">
                     <span>{t('footer_bio', '© 2026 DEEDEVIOT ACCELERATOR. ALL RIGHTS RESERVED.')}</span>
                     <a href="/login" className="hover:text-accent-500 transition-colors"><Settings size={16} /></a>
                  </div>
               </div>
            </footer>
          </main>
        ) : (
          <main className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
             <button onClick={() => setView('main')} className="flex items-center gap-3 text-brand-500 font-bold mb-10 hover:-translate-x-2 transition-transform bg-white px-6 py-2 rounded-full shadow-md">
                <ArrowLeft size={20} /> [ {t('back_btn', 'Back Home')} ]
             </button>
             {selectedProject ? (
               <div className="animate-fade-in-up">
                  <img src={selectedProject.imageUrl} className="w-full h-[300px] md:h-[500px] object-cover rounded-[3rem] shadow-2xl mb-12" alt={selectedProject.title} />
                   <div className="space-y-6">
                      <span className="bg-accent-500 text-slate-900 px-4 py-1 rounded-full font-bold text-xs uppercase">{selectedProject.icon || selectedProject.tag}</span>
                      <h1 className="font-montserrat text-4xl md:text-6xl font-black text-slate-900 uppercase">{selectedProject[`title_${lang}`] || selectedProject.title}</h1>
                      <p className="text-xl text-slate-500 leading-relaxed font-kanit">{selectedProject[`description_${lang}`] || selectedProject.description}</p>
                      
                     {selectedProject.demoUrl || selectedProject.referenceUrl ? (
                        <div className="pt-8 flex flex-wrap gap-4">
                           {selectedProject.demoUrl && (
                             <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer" className="bg-brand-500 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/20 w-fit">
                                <Monitor size={20} /> View Live Demo
                             </a>
                           )}
                           {selectedProject.referenceUrl && (
                             <a href={selectedProject.referenceUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl w-fit">
                                <Link size={20} /> Source/Reference
                             </a>
                           )}
                        </div>
                     ) : null}
                  </div>
               </div>
             ) : (
               <div className="text-center py-20 text-slate-400">Project Not Found</div>
             )}
          </main>
        )}
      </div>

      {/* Toast Notification */}
      <div className={`fixed bottom-10 right-10 z-[200] px-8 py-4 rounded-2xl flex items-center gap-3 text-white font-bold shadow-2xl transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'} ${toast.isError ? 'bg-red-500' : 'bg-green-500'}`}>
         {toast.isError ? <Settings size={20} /> : <CheckCircle size={20} />}
         {toast.msg}
      </div>

    </div>
  );
}
