"use client";

import React, { useEffect, useState } from 'react';
import {
  Cpu, Code, Globe, Smartphone, Database, Wifi, Server, Terminal, ChevronRight,
  ArrowRight, Zap, Activity, Monitor, X, ExternalLink, Blocks, MessageSquare,
  Mail, Phone, ShieldCheck, Clock, ThumbsUp, Users, Target, Facebook, MessageCircle
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
      {/* ================= NAVIGATION ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2 cursor-pointer text-gray-900">
            DeeDev<span className="text-brand-500 font-extrabold">IoT</span>
          </div>
          <div className="flex items-center gap-8 ml-auto">
            <div className="hidden md:flex items-center gap-8 mr-6">
              <a href="#" className="text-gray-600 hover:text-brand-500 font-semibold transition-colors text-sm uppercase tracking-wide">Home</a>
              <a href="#services" className="text-gray-600 hover:text-brand-500 font-semibold transition-colors text-sm uppercase tracking-wide">Services</a>
              <a href="#portfolio" className="text-gray-600 hover:text-brand-500 font-semibold transition-colors text-sm uppercase tracking-wide">Integrations</a>
              <a href="#contact" className="text-gray-600 hover:text-brand-500 font-semibold transition-colors text-sm uppercase tracking-wide">Contact</a>
            </div>
            <a href="#contact" className="hidden md:inline-flex px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-[var(--color-brand-700)] font-extrabold rounded-xl transition-all shadow-md shadow-accent-500/20 hover:shadow-lg hover:shadow-accent-500/30 hover:-translate-y-0.5">
              ขอใบเสนอราคา
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* ================= HERO SECTION (2 COLUMNS) ================= */}
        <section className="relative overflow-hidden bg-white pt-24 pb-24 sm:pt-32 sm:pb-32 lg:pb-36 lg:pt-36">
          {/* subtle background effects */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            <div className="absolute top-[-10%] right-[-5%] w-[50vh] h-[50vh] bg-brand-50 rounded-full blur-3xl opacity-70 animate-float" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40vh] h-[40vh] bg-sky-50 rounded-full blur-3xl opacity-60 animate-float" style={{ animationDelay: '1.5s' }} />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* Left Col - text */}
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-sm font-semibold mb-6 animate-fade-in-up">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                  </span>
                  {config.hero_badge_en}
                  <span className="text-gray-400 font-normal ml-1 border-l pl-2 border-brand-200">{config.hero_badge_th}</span>
                </div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 leading-[1.2] text-gray-900 whitespace-pre-line animate-fade-in-up font-sans" style={{ animationDelay: '0.1s' }}>
                  {config.hero_headline_en?.replace('\n', ' ')}
                  <div className="mt-3 text-lg lg:text-xl font-medium text-gray-500 font-thai tracking-wide">
                    {config.hero_headline_th}
                  </div>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed whitespace-pre-line animate-fade-in-up font-sans" style={{ animationDelay: '0.2s' }}>
                  {config.hero_sub_en}
                  <span className="block mt-2 text-sm lg:text-base text-gray-400 font-thai">{config.hero_sub_th}</span>
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <a href={config.hero_btn1_link} className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all shadow-md shadow-brand-500/20 flex flex-col items-center justify-center gap-1 group duration-300 transform hover:-translate-y-1">
                    <span className="flex items-center gap-2">{config.hero_btn1_text_en} <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" /></span>
                    <span className="text-xs text-brand-100 font-medium font-thai">{config.hero_btn1_text_th}</span>
                  </a>
                  <a href={config.hero_btn2_link} className="w-full sm:w-auto px-8 py-4 bg-accent-500 hover:bg-accent-600 text-[var(--color-brand-700)] rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-1 duration-300 shadow-md shadow-accent-500/20 transform hover:-translate-y-1">
                    <span className="flex items-center gap-2">{config.hero_btn2_text_en}</span>
                    <span className="text-xs text-[var(--color-brand-600)] font-medium font-thai">{config.hero_btn2_text_th}</span>
                  </a>
                </div>
              </div>

              {/* Right Col - illustration */}
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none h-80 sm:h-96 lg:h-[500px] flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="absolute inset-0 bg-brand-50 rounded-full blur-[100px] opacity-60 animate-pulse" />
                <div className="relative w-full h-full flex items-center justify-center animate-float">
                  <div className="w-64 h-64 sm:w-80 sm:h-80 bg-white shadow-2xl shadow-gray-200/50 rounded-full border border-gray-100 flex items-center justify-center relative animate-[spin_60s_linear_infinite]">
                    {/* Floating Icons connecting */}
                    <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 p-4 bg-white shadow-lg shadow-gray-200/50 rounded-2xl border border-gray-100 -rotate-[0deg] text-brand-500 transition-transform duration-300 hover:scale-110"><Server className="w-8 h-8" /></div>
                    <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 p-4 bg-white shadow-lg shadow-gray-200/50 rounded-2xl border border-gray-100 -rotate-[0deg] text-gray-700 transition-transform duration-300 hover:scale-110"><Globe className="w-8 h-8" /></div>
                    <div className="absolute left-[-15px] top-1/2 -translate-y-1/2 p-4 bg-white shadow-lg shadow-gray-200/50 rounded-2xl border border-gray-100 -rotate-[0deg] text-gray-700 transition-transform duration-300 hover:scale-110"><Terminal className="w-8 h-8" /></div>
                    <div className="absolute right-[-15px] top-1/2 -translate-y-1/2 p-4 bg-white shadow-lg shadow-gray-200/50 rounded-2xl border border-gray-100 -rotate-[0deg] text-brand-500 transition-transform duration-300 hover:scale-110"><Cpu className="w-8 h-8" /></div>

                    <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-50 rounded-full flex items-center justify-center border-4 border-white shadow-inner animate-[spin_60s_linear_infinite_reverse]">
                      <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-brand-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TECH STACK MARQUEE ================= */}
        <div className="py-8 border-b border-gray-100 bg-white relative flex overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
          <div className="animate-marquee whitespace-nowrap flex gap-12 md:gap-20 items-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            {['Next.js', 'React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Arduino', 'ESP32', 'MQTT', 'LINE API'].map((tech, i) => (
              <span key={i} className="text-xl md:text-2xl font-black text-gray-300 hover:text-brand-500 transition-colors duration-300 select-none cursor-default">{tech}</span>
            ))}
            {['Next.js', 'React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Arduino', 'ESP32', 'MQTT', 'LINE API'].map((tech, i) => (
              <span key={`dup-${i}`} className="text-xl md:text-2xl font-black text-gray-300 hover:text-brand-500 transition-colors duration-300 select-none cursor-default">{tech}</span>
            ))}
            {['Next.js', 'React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Arduino', 'ESP32', 'MQTT', 'LINE API'].map((tech, i) => (
              <span key={`dup2-${i}`} className="text-xl md:text-2xl font-black text-gray-300 hover:text-brand-500 transition-colors duration-300 select-none cursor-default">{tech}</span>
            ))}
          </div>
        </div>

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

        {/* ================= PORTFOLIO (FEATURED PROJECTS) SECTION ================= */}
        <section id="portfolio" className="py-24 bg-palette-light relative scroll-mt-20 border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="text-brand-500 font-bold tracking-wide uppercase text-sm mb-2">{config.port_badge_en} <span className="ml-2 font-normal text-gray-400 border-l border-brand-200 pl-2">{config.port_badge_th}</span></h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">{config.integrations_title_en}</h3>
              <p className="mt-2 text-lg text-gray-500 font-medium font-thai">{config.integrations_title_th}</p>
              <div className="w-16 h-1 bg-brand-500 mx-auto mt-6 rounded-full" />
              <p className="text-gray-600 mt-6 max-w-2xl mx-auto whitespace-pre-line">{config.port_desc_en}</p>
              <p className="text-gray-400 mt-2 text-sm max-w-2xl mx-auto whitespace-pre-line font-thai">{config.port_desc_th}</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {integrations.map(project => {
                  const CardWrapper = project.referenceUrl ? 'a' : 'div';
                  const wrapperProps = project.referenceUrl ? { href: project.referenceUrl, target: '_blank', rel: 'noopener noreferrer' } : {};
                  return (
                    <CardWrapper key={project.id} {...(wrapperProps as any)} className="bg-white border text-left border-gray-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-2 rounded-3xl overflow-hidden transition-all duration-300 group flex flex-col h-full cursor-pointer block">
                      <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden relative">
                        {project.imageUrl && project.imageUrl.includes('http') ? (() => {
                          const isVideoPrefix = project.imageUrl.toLowerCase().startsWith('video:');
                          const rawUrl = isVideoPrefix ? project.imageUrl.substring(6) : project.imageUrl;
                          const directUrl = getDriveDirectUrl(rawUrl);
                          const thumbUrl = getDriveThumbnailUrl(rawUrl);
                          const iframeUrl = getDriveIframeUrl(rawUrl);

                          return (
                            <>
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
                                <img src={thumbUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 hidden" referrerPolicy="no-referrer" />
                              )}
                            </>
                          );
                        })() : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                            <Code className="w-12 h-12 opacity-30" />
                            <span className="text-sm font-medium">No Image</span>
                          </div>
                        )}
                        {project.tag && (
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                            {project.tag}
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h4 className="font-bold text-xl text-gray-900 group-hover:text-brand-500 transition-colors">{project.title}</h4>
                          {project.referenceUrl && <ExternalLink className="w-4 h-4 mt-1 text-gray-400 group-hover:text-brand-500 shrink-0" />}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{project.description}</p>
                      </div>
                    </CardWrapper>
                  )
                })}
              </div>
            )}
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
    </div>
  );
}
