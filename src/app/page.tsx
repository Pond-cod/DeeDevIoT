"use client";

import React, { useEffect, useState } from 'react';
import {
  Cpu, Code, Globe, Smartphone, Database, Wifi, Server, Terminal, ChevronRight,
  ArrowRight, Zap, Activity, Monitor, X, ExternalLink, Blocks, MessageSquare,
  Mail, Phone, ShieldCheck, Clock, ThumbsUp, Users, Target, Facebook, MessageCircle, Menu, FileText
} from 'lucide-react';
import { getDriveThumbnailUrl, getDriveDirectUrl, getDriveIframeUrl } from '../lib/drive';

// Types
interface ServiceData { id: string; title: string; description: string; icon: string; imageUrl?: string; demoUrl?: string; }
interface IntegrationData { id: string; title: string; description: string; imageUrl: string; tag: string; referenceUrl?: string; }
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
}

const IconMap: Record<string, React.FC<any>> = {
  cpu: Cpu, code: Code, globe: Globe, smartphone: Smartphone, database: Database, wifi: Wifi,
  server: Server, terminal: Terminal, zap: Zap, activity: Activity, monitor: Monitor, blocks: Blocks
};

export default function LandingPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationData[]>([]);
  const [config, setConfig] = useState<ConfigData>({
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
    facebook_url: 'https://www.facebook.com/profile.php?id=61577499060199'
  });

  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resSvc, resInt, resConf] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/integrations'),
          fetch('/api/config')
        ]);
        const [jsonSvc, jsonInt, jsonConf] = await Promise.all([
          resSvc.json(), resInt.json(), resConf.json()
        ]);

        if (jsonSvc.success) setServices(jsonSvc.data);
        if (jsonInt.success) setIntegrations(jsonInt.data);
        if (jsonConf.success && Object.keys(jsonConf.data).length > 0) {
          setConfig(prev => ({ ...prev, ...jsonConf.data }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-[#333333] font-sans selection:bg-brand-500/20">
      <div className="bg-white">
        {/* ================= TOP CONTACT BAR ================= */}
        <div className="flex flex-col items-center sm:flex-row justify-center sm:justify-end px-6 py-2 pb-0 sm:pb-2 text-xs sm:text-sm text-gray-800 font-medium border-b border-gray-100 gap-2 sm:gap-4 relative z-50">
           <div className="flex flex-wrap items-center justify-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>081-591-0000 <span className="text-gray-400 font-normal">(24HR)</span></span>
              <span className="text-brand-200">/</span>
              <span>02-424-5559</span>
              <div className="w-6 h-6 bg-[#00B900] rounded-full flex items-center justify-center text-white ml-1 shadow-sm">
                 <MessageCircle className="w-3.5 h-3.5 fill-current" />
              </div>
           </div>
           <div className="flex items-center gap-2 justify-center pb-2 sm:pb-0 sm:pl-4 sm:border-l sm:border-gray-200 h-full">
              <span className="text-lg leading-none cursor-pointer">🇹🇭</span>
              <span className="text-lg leading-none cursor-pointer grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">🇬🇧</span>
           </div>
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md py-4 transition-all shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="text-3xl font-light tracking-tighter cursor-pointer text-brand-500 flex items-center">
              orange<div className="w-4 h-1.5 bg-brand-500 rounded-full ml-1 mb-1 shadow-sm shadow-brand-500/30"></div>
            </div>
            
            <div className="flex items-center gap-3">
               <a href="#contact" className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-brand-500/20 hover:-translate-y-0.5">
                  <FileText className="w-4 h-4" /> สอบถามราคา
               </a>
               <button className="flex items-center justify-center w-11 h-11 bg-accent-500 text-white rounded-full hover:bg-accent-600 shadow-lg shadow-accent-500/20 transition-all hover:-translate-y-0.5" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
               </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl py-4 px-6 flex flex-col gap-4 animate-fade-in-up">
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-brand-500 font-bold transition-colors text-base uppercase tracking-wide py-2 border-b border-gray-50 flex items-center justify-between">Home <ChevronRight className="w-4 h-4 text-gray-400" /></a>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-brand-500 font-bold transition-colors text-base uppercase tracking-wide py-2 border-b border-gray-50 flex items-center justify-between">Services <ChevronRight className="w-4 h-4 text-gray-400" /></a>
              <a href="#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-brand-500 font-bold transition-colors text-base uppercase tracking-wide py-2 border-b border-gray-50 flex items-center justify-between">Integrations <ChevronRight className="w-4 h-4 text-gray-400" /></a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-brand-500 font-bold transition-colors text-base uppercase tracking-wide py-2 border-b border-gray-50 flex items-center justify-between">Contact <ChevronRight className="w-4 h-4 text-gray-400" /></a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex justify-center items-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-xl transition-all shadow-md mt-4">
                <FileText className="w-4 h-4" /> สอบถามราคา
              </a>
            </div>
          )}
        </nav>
      </div>
      <main className="pt-20">
        {/* ================= HERO SECTION (ORANGE DESIGN) ================= */}
        <section className="bg-white pt-10 pb-20 relative">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-brand-50 rounded-full blur-[100px] opacity-50 point-events-none" />
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-accent-50 rounded-full blur-[100px] opacity-50 point-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
             <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900 leading-[1.4] mb-4 font-thai max-w-4xl mx-auto tracking-tight pt-10">
                บริษัทรับเขียนโปรแกรมทุกประเภท<br/>
                ด้วยทีม <span className="text-brand-500 font-bold">In House กว่า 80 คน</span>
             </h1>

             {/* Pills */}
             <div className="flex overflow-x-auto gap-3 justify-start md:justify-center py-8 no-scrollbar snap-x mx-auto max-w-5xl px-4 md:px-0">
               {['WEB APPLICATION', 'MOBILE APPLICATION', 'LINE APPLICATION', 'PLC'].map((cat, i) => (
                 <div key={i} className="shrink-0 flex-1 min-w-[140px] max-w-[200px] snap-center px-4 md:px-6 py-3 md:py-4 bg-black text-white text-xs md:text-sm font-bold rounded-xl tracking-wider hover:bg-gray-800 transition-colors shadow-lg shadow-black/20 cursor-pointer border border-gray-800 flex items-center justify-center text-center">
                    {cat}
                 </div>
               ))}
             </div>

             {/* Monitor Image Fake / CSS */}
             <div className="mt-6 md:mt-12 relative max-w-4xl mx-auto animate-fade-in-up">
               <div className="w-full aspect-video bg-gray-900 rounded-t-[1.5rem] md:rounded-t-[2.5rem] border-[8px] md:border-[12px] border-black overflow-hidden relative shadow-2xl">
                  {/* Fake Screen UI */}
                  <div className="absolute inset-0 bg-gray-50 flex">
                     {/* Sidebar */}
                     <div className="w-1/4 bg-[#1e293b] flex flex-col p-4 md:p-6 gap-3 md:gap-4 border-r border-gray-800 hidden sm:flex">
                        <div className="w-full h-8 bg-brand-500 rounded-lg flex items-center px-3 mb-4 shadow"><div className="w-4 h-4 bg-white/50 rounded-full"></div></div>
                        <div className="w-3/4 h-3 bg-white/10 rounded-md"></div>
                        <div className="w-full h-3 bg-white/10 rounded-md"></div>
                        <div className="w-2/3 h-3 bg-white/10 rounded-md mt-6"></div>
                        <div className="w-full h-3 bg-white/10 rounded-md"></div>
                     </div>
                     {/* Main Content */}
                     <div className="flex-1 p-4 md:p-8 flex flex-col gap-4 md:gap-6 bg-gray-50">
                        {/* Top Nav in fake dashboard */}
                        <div className="w-full h-10 bg-white rounded-xl shadow-sm flex items-center px-4 justify-between shrink-0">
                           <div className="w-1/3 h-3 bg-gray-100 rounded"></div>
                           <div className="w-10 h-6 bg-brand-100 rounded border border-brand-200"></div>
                        </div>
                        {/* Chart Area */}
                        <div className="flex-1 bg-white shadow-sm border border-gray-100 rounded-xl p-4 flex gap-4">
                           <div className="flex-1 flex items-end relative border-b border-l border-gray-100 pb-2 pl-2">
                             <svg className="w-full h-full text-brand-500/20" viewBox="0 0 100 50" preserveAspectRatio="none">
                               <polyline fill="currentColor" points="0,50 10,40 20,45 30,20 40,30 50,15 60,20 70,5 80,10 90,5 100,20 100,50" />
                               <polyline fill="none" stroke="var(--color-brand-500)" strokeWidth="2" points="0,50 10,40 20,45 30,20 40,30 50,15 60,20 70,5 80,10 90,5 100,20" />
                             </svg>
                           </div>
                           <div className="w-[120px] border-l border-gray-100 pl-4 hidden md:flex flex-col gap-4 items-center justify-center shrink-0">
                              <div className="w-16 h-16 rounded-full border-8 border-brand-500 border-r-accent-500 border-t-gray-100 flex items-center justify-center shadow-inner">
                                <div className="w-8 h-8 bg-gray-50 rounded-full"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               {/* Monitor Base */}
               <div className="w-24 md:w-48 h-10 md:h-16 bg-gradient-to-b from-gray-200 to-gray-400 mx-auto rounded-b-xl shadow-md relative z-[-1] -mt-1 border-x border-b border-gray-300"></div>
               <div className="w-32 md:w-64 h-3 md:h-4 bg-gradient-to-r from-gray-200 via-white to-gray-300 mx-auto rounded-t-full shadow-[0_10px_20px_rgba(0,0,0,0.15)] -mt-1 relative z-10 border-t border-gray-100"></div>
             </div>
          </div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className="py-20 bg-palette-light border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-brand-500 font-bold tracking-wide uppercase text-sm mb-2">{config.why_badge_en} <span className="ml-2 font-normal text-gray-400 border-l border-brand-200 pl-2">{config.why_badge_th}</span></h2>
              <h3 className="text-3xl font-extrabold text-gray-900">{config.why_choose_title_en}</h3>
              <p className="mt-2 text-lg text-gray-500 font-medium font-thai">{config.why_choose_title_th}</p>
              <div className="w-16 h-1 bg-brand-500 mx-auto mt-6 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title_en: config.why1_title_en, title_th: config.why1_title_th, desc_en: config.why1_desc_en, desc_th: config.why1_desc_th, icon: Target },
                { title_en: config.why2_title_en, title_th: config.why2_title_th, desc_en: config.why2_desc_en, desc_th: config.why2_desc_th, icon: Zap },
                { title_en: config.why3_title_en, title_th: config.why3_title_th, desc_en: config.why3_desc_en, desc_th: config.why3_desc_th, icon: ShieldCheck },
                { title_en: config.why4_title_en, title_th: config.why4_title_th, desc_en: config.why4_desc_en, desc_th: config.why4_desc_th, icon: ThumbsUp },
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col">
                  <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-accent-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title_en}</h4>
                  <div className="text-xs text-accent-600 font-medium font-thai mb-3">{item.title_th}</div>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{item.desc_en}</p>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed whitespace-pre-line border-t border-gray-50 pt-2 font-thai">{item.desc_th}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= SERVICES SECTION ================= */}
        <section id="services" className="py-24 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="text-brand-500 font-bold tracking-wide uppercase text-sm mb-2">{config.svc_badge_en} <span className="ml-2 font-normal text-gray-400 border-l border-brand-200 pl-2">{config.svc_badge_th}</span></h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">{config.solutions_title_en}</h3>
              <p className="mt-2 text-lg text-gray-500 font-medium font-thai">{config.solutions_title_th}</p>
              <div className="w-16 h-1 bg-brand-500 mx-auto mt-6 rounded-full" />
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map(service => {
                  const IconComp = IconMap[service.icon?.toLowerCase()] || Code;
                  return (
                    <div key={service.id} onClick={() => setSelectedService(service)} className="group bg-white border border-gray-100 shadow-lg hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-500 rounded-3xl p-6 cursor-pointer hover:-translate-y-2 transition-all duration-300 flex flex-col h-full overflow-hidden relative">
                      {service.imageUrl ? (() => {
                        const images = service.imageUrl.split(/[,\n]/).map(url => url.trim()).filter(Boolean);
                        if (images.length > 1) {
                          return (
                            <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden grid grid-cols-2 gap-1 shrink-0 bg-gray-100">
                              {images.slice(0, 4).map((img, i) => (
                                <div key={i} className="relative w-full h-full overflow-hidden">
                                  <img src={getDriveThumbnailUrl(img)} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                                  {i === 3 && images.length > 4 && <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center"><span className="text-white font-bold">+{images.length - 4}</span></div>}
                                </div>
                              ))}
                            </div>
                          );
                        }
                        if (images.length === 1) {
                          const isVideoPrefix = images[0].toLowerCase().startsWith('video:');
                          const rawUrl = isVideoPrefix ? images[0].substring(6) : images[0];
                          const directUrl = getDriveDirectUrl(rawUrl);
                          const thumbUrl = getDriveThumbnailUrl(rawUrl);
                          const iframeUrl = getDriveIframeUrl(rawUrl);

                          return (
                            <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden shrink-0 bg-gray-100 relative group-hover:shadow-md transition-shadow">
                              {isVideoPrefix ? (
                                <iframe src={iframeUrl} className="w-full h-full border-0" allow="autoplay; encrypted-media" allowFullScreen />
                              ) : (
                                <video 
                                  src={directUrl} 
                                  autoPlay loop muted playsInline
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    (e.target as HTMLVideoElement).style.display = 'none';
                                    const img = (e.target as HTMLVideoElement).nextElementSibling as HTMLImageElement;
                                    if (img) img.style.display = 'block';
                                  }}
                                />
                              )}
                              {!isVideoPrefix && (
                                <img src={thumbUrl} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 hidden" referrerPolicy="no-referrer" />
                              )}
                            </div>
                          );
                        }
                        return null;
                      })() : (
                        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 shrink-0 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors"><IconComp className="w-7 h-7 text-gray-500 group-hover:text-brand-500" /></div>
                      )}

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-500 transition-colors">{service.title}</h3>
                      <p className="text-gray-600 mb-8 flex-grow line-clamp-3 text-sm leading-relaxed">{service.description}</p>

                      <div className="mt-auto px-4 py-2.5 bg-brand-50 text-brand-600 group-hover:bg-brand-500 group-hover:text-white rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ================= EXPERIENCES (STATS) ================= */}
        <section className="py-20 bg-brand-500 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/20">
              <div className="py-4">
                <div className="text-5xl font-extrabold mb-2">5+</div>
                <div className="text-brand-100 font-medium">Years of Experience</div>
              </div>
              <div className="py-4">
                <div className="text-5xl font-extrabold mb-2">50+</div>
                <div className="text-brand-100 font-medium">Successful Projects</div>
              </div>
              <div className="py-4">
                <div className="text-5xl font-extrabold mb-2">100%</div>
                <div className="text-brand-100 font-medium">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PORTFOLIO LIST SECTION ================= */}
        <section id="portfolio" className="py-24 bg-white relative scroll-mt-20 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-12 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-500 shrink-0 shadow-sm border border-brand-100">
                <Monitor className="w-8 h-8" />
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-thai tracking-tight max-w-md mt-2 md:mt-0">ตัวอย่างผลงานรับเขียนโปรแกรม</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto mb-16">
               {[
                 'โปรแกรมจัดการประชุมผู้ถือหุ้นออนไลน์',
                 'โปรแกรมระบบงานสารบรรณ',
                 'โปรแกรม Fulfillment',
                 'โปรแกรมระบบจัดการสปา',
                 'โปรแกรมจองรถตู้ผ่านมือถือ',
                 'โปรแกรมจองห้องประชุม',
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group shadow-sm bg-white">
                   <div className="w-2.5 h-2.5 rounded-full bg-accent-500 shadow-sm shadow-accent-500/50 group-hover:scale-125 transition-transform shrink-0"></div>
                   <p className="text-gray-700 font-thai text-base md:text-lg font-medium">{item}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* ================= CONTACT SECTION ================= */}
        <section id="contact" className="py-24 bg-white relative scroll-mt-20 overflow-hidden border-t border-gray-100">
          <div className="absolute inset-0 bg-brand-50/30 opacity-50" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{config.cta_heading_en || 'Ready to Start Your Next Big Project?'}</h2>
            <p className="text-gray-500 font-medium mb-6 text-lg font-thai">{config.cta_heading_th}</p>
            <p className="text-gray-500 mb-10 text-lg">Get a free consultation today. Let us design the perfect system architecture that fits your goals and budget.</p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="mailto:hello@deedeviot.com" className="flex items-center justify-center gap-3 bg-brand-500 hover:bg-brand-600 border border-brand-500 px-8 py-4 rounded-xl text-white font-bold transition-colors shadow-lg shadow-brand-500/20">
                <Mail className="w-5 h-5" /> hello@deedeviot.com
              </a>
              <a href="tel:0899999999" className="flex items-center justify-center gap-3 bg-accent-500 hover:bg-accent-600 px-8 py-4 rounded-xl text-[var(--color-brand-700)] font-extrabold transition-colors shadow-lg shadow-accent-500/20">
                <Phone className="w-5 h-5" /> 089-999-9999
              </a>
              {config.facebook_url && (
                <a href={config.facebook_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] border border-[#1877F2] px-8 py-4 rounded-xl text-white font-bold transition-colors shadow-lg shadow-[#1877F2]/20">
                  <Facebook className="w-5 h-5" /> ทักแชทแฟนเพจ
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white pt-16 pb-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold tracking-tighter flex items-center gap-2 mb-4 text-gray-900">
              DeeDev<span className="text-brand-500 font-extrabold">IoT</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
              {config.footer_bio_en || 'Your trusted tech partner in turning innovative ideas into powerful, real-world Web & Hardware platforms.'}
              <span className="block mt-2 text-gray-400 font-thai">{config.footer_bio_th}</span>
            </p>
            <div className="flex items-center gap-4 mt-6">
              {config.facebook_url && (
                <a href={config.facebook_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-palette-light hover:bg-brand-50 text-palette-gray hover:text-brand-500 flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              <a href="#" className="w-10 h-10 rounded-full bg-palette-light hover:bg-brand-50 text-palette-gray hover:text-brand-500 flex items-center justify-center transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Our Services</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#services" className="hover:text-brand-500 transition-colors">Web Application Development</a></li>
              <li><a href="#services" className="hover:text-brand-500 transition-colors">IoT Platform Architecture</a></li>
              <li><a href="#services" className="hover:text-brand-500 transition-colors">Hardware Integration (ESP32/Arduino)</a></li>
              <li><a href="#services" className="hover:text-brand-500 transition-colors">IT Consulting</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-brand-500" /> hello@deedeviot.com</li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-brand-500" /> 089-999-9999</li>
              <li className="flex items-start gap-3"><Globe className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> 123/4 Business District, Bangkok, Thailand 10110</li>
            </ul>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-gray-100">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} DeeDevIoT. All rights reserved.</p>
        </div>
      </footer>

      {/* ================= MODAL ================= */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 pr-8">{selectedService.title}</h2>
            <p className="text-gray-600 mb-8">{selectedService.description}</p>

            {selectedService.demoUrl ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <iframe src={selectedService.demoUrl} className="absolute inset-0 w-full h-full" sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>
              </div>
            ) : (
              <div className="w-full aspect-video rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-gray-400">
                <Code className="w-16 h-16 opacity-20 mb-4" />
                <p className="text-sm font-medium">Demo Not Available</p>
              </div>
            )}

            <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
              {selectedService.demoUrl && (
                <a href={selectedService.demoUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl flex items-center gap-2 transition-colors"><ExternalLink className="w-4 h-4 ml-1" /> View Live Site</a>
              )}
              <button onClick={() => setSelectedService(null)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STACKED FABs ================= */}
      <div className="fixed bottom-6 md:bottom-10 right-6 md:right-10 z-[100] flex flex-col gap-3 items-center group">
         <a href="#" className="w-12 h-12 md:w-14 md:h-14 bg-[#00B900] text-white rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-all border-2 border-white shadow-[#00B900]/30 hover:scale-110">
           <MessageCircle className="w-6 h-6 md:w-7 md:h-7 fill-current" />
         </a>
         <a href="tel:0815910000" className="w-12 h-12 md:w-14 md:h-14 bg-accent-500 text-white rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-all border-2 border-white shadow-accent-500/30 hover:scale-110">
           <Phone className="w-5 h-5 md:w-6 md:h-6 fill-current" />
         </a>
         <a href="mailto:contact@orange.com" className="w-12 h-12 md:w-14 md:h-14 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-all border-2 border-white shadow-brand-500/30 hover:scale-110">
           <Mail className="w-5 h-5 md:w-6 md:h-6" />
         </a>
         <button className="w-14 h-14 md:w-16 md:h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-xl hover:-translate-y-1 transition-all border-[3px] border-white shadow-indigo-500/40 hover:scale-105 mt-2 bg-gradient-to-br from-indigo-500 to-indigo-600">
           <X className="w-6 h-6 md:w-8 md:h-8" />
         </button>
      </div>
    </div>
  );
}
