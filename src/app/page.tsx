"use client";

import React, { useEffect, useState } from 'react';
import {
  Cpu, Code, Globe, Smartphone, Database, Wifi, Server, Terminal, ChevronRight,
  ArrowRight, Zap, Activity, Monitor, X, ExternalLink, Blocks, MessageSquare,
  Mail, Phone, ShieldCheck, Clock, ThumbsUp, Users, Target
} from 'lucide-react';
import { getDriveThumbnailUrl } from '../lib/drive';

// Types
interface ServiceData { id: string; title: string; description: string; icon: string; imageUrl?: string; demoUrl?: string; }
interface IntegrationData { id: string; title: string; description: string; imageUrl: string; tag: string; referenceUrl?: string; }
interface ConfigData {
  hero_badge: string; hero_title: string; hero_desc: string;
  hero_btn1_text: string; hero_btn1_link: string; hero_btn2_text: string; hero_btn2_link: string;
  why_badge: string; why_title: string;
  why1_title: string; why1_desc: string; why2_title: string; why2_desc: string;
  why3_title: string; why3_desc: string; why4_title: string; why4_desc: string;
  svc_badge: string; svc_title: string;
  port_badge: string; port_title: string; port_desc: string;
}

const IconMap: Record<string, React.FC<any>> = {
  cpu: Cpu, code: Code, globe: Globe, smartphone: Smartphone, database: Database, wifi: Wifi,
  server: Server, terminal: Terminal, zap: Zap, activity: Activity, monitor: Monitor, blocks: Blocks
};

export default function LandingPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationData[]>([]);
  const [config, setConfig] = useState<ConfigData>({
    hero_badge: 'Professional Technology Solutions',
    hero_title: 'ยกระดับธุรกิจของคุณด้วย \nโซลูชัน Web App & IoT อัจฉริยะ',
    hero_desc: 'จากซอฟต์แวร์จัดการบนเว็บ สู่การควบคุมบอร์ด Arduino/ESP32 ไร้รอยต่อ',
    hero_btn1_text: 'ผลงานและบริการ', hero_btn1_link: '#services',
    hero_btn2_text: 'ขอใบเสนอราคา', hero_btn2_link: '#contact',
    why_badge: 'WHY CHOOSE US', why_title: 'ทำไมถึงต้องเลือกเรา',
    why1_title: 'ความเชี่ยวชาญเฉพาะด้าน', why1_desc: 'ทีมงานมืออาชีพทางด้าน Web Development และ Hardware IoT โดยเฉพาะ',
    why2_title: 'บริการรวดเร็วทันใจ', why2_desc: 'ส่งมอบงานได้รวดเร็วตามกำหนดเวลา ยืดหยุ่นปรับแก้ได้ทันที',
    why3_title: 'ราคาที่เข้าถึงได้และคุ้มค่า', why3_desc: 'งบประมาณโปร่งใส ไม่มีแอบแฝง คุ้มค่ากับนวัตกรรมที่คุณได้รับ',
    why4_title: 'ดูแลหลังการขายอย่างดี', why4_desc: 'มีบริการตอบคำถามและดูแลการบำรุงรักษาระบบอย่างใกล้ชิด',
    svc_badge: 'OUR SOLUTIONS', svc_title: 'บริการและผลงาน',
    port_badge: 'INTEGRATIONS', port_title: 'ระบบการทำงานรวมกัน', port_desc: 'ช่วยให้การทำงานของคุณไร้รอยต่อ โดยการเชื่อมแพลตฟอร์มที่เราพัฒนาเข้ากับเครื่องมือที่คุณใช้งานอยู่ประจำ'
  });

  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2 cursor-pointer text-gray-900">
            DeeDev<span className="text-brand-500 font-extrabold">IoT</span>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* ================= HERO SECTION (2 COLUMNS) ================= */}
        <section className="relative overflow-hidden bg-white pt-16 pb-24 sm:pt-24 sm:pb-32 lg:pb-32 lg:pt-32">
          {/* subtle background effects */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[50vh] h-[50vh] bg-brand-50 rounded-full blur-3xl opacity-70" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40vh] h-[40vh] bg-sky-50 rounded-full blur-3xl opacity-60" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* Left Col - text */}
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-sm font-semibold mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                  </span>
                  {config.hero_badge}
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.15] text-gray-900 whitespace-pre-line">
                  {config.hero_title}
                </h1>
                <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed whitespace-pre-line">
                  {config.hero_desc}
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                  <a href={config.hero_btn1_link} className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 group duration-300">
                    {config.hero_btn1_text} <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </a>
                  <a href={config.hero_btn2_link} className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-semibold transition-all border border-gray-200 flex items-center justify-center gap-2 duration-300 hover:border-brand-500/30 hover:shadow-sm">
                    {config.hero_btn2_text}
                  </a>
                </div>
              </div>

              {/* Right Col - illustration */}
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none h-80 sm:h-96 lg:h-[500px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-100 to-sky-50 rounded-full blur-3xl opacity-50" />
                <div className="relative w-full h-full flex items-center justify-center grayscale-[0%] contrast-125">
                  <div className="w-64 h-64 sm:w-80 sm:h-80 bg-white shadow-2xl shadow-gray-200/50 rounded-full border border-gray-100 flex items-center justify-center relative animate-[spin_60s_linear_infinite]">
                    {/* Floating Icons connecting */}
                    <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 p-4 bg-white shadow-lg rounded-2xl border border-gray-100 -rotate-[0deg] text-brand-500"><Server className="w-8 h-8" /></div>
                    <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 p-4 bg-white shadow-lg rounded-2xl border border-gray-100 -rotate-[0deg] text-sky-500"><Globe className="w-8 h-8" /></div>
                    <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 p-4 bg-white shadow-lg rounded-2xl border border-gray-100 -rotate-[0deg] text-indigo-500"><Terminal className="w-8 h-8" /></div>
                    <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 p-4 bg-white shadow-lg rounded-2xl border border-gray-100 -rotate-[0deg] text-brand-500"><Cpu className="w-8 h-8" /></div>

                    <div className="w-32 h-32 sm:w-40 sm:h-40 bg-brand-50 rounded-full flex items-center justify-center border-4 border-white shadow-inner animate-[spin_60s_linear_infinite_reverse]">
                      <Wifi className="w-12 h-12 sm:w-16 sm:h-16 text-brand-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className="py-20 bg-gray-50 border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-brand-500 font-bold tracking-wide uppercase text-sm mb-2">{config.why_badge}</h2>
              <h3 className="text-3xl font-extrabold text-gray-900">{config.why_title}</h3>
              <div className="w-16 h-1 bg-brand-500 mx-auto mt-6 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: config.why1_title, desc: config.why1_desc, icon: Target },
                { title: config.why2_title, desc: config.why2_desc, icon: Zap },
                { title: config.why3_title, desc: config.why3_desc, icon: ShieldCheck },
                { title: config.why4_title, desc: config.why4_desc, icon: ThumbsUp },
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-brand-500" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= SERVICES SECTION ================= */}
        <section id="services" className="py-24 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="text-brand-500 font-bold tracking-wide uppercase text-sm mb-2">{config.svc_badge}</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">{config.svc_title}</h3>
              <div className="w-16 h-1 bg-brand-500 mx-auto mt-6 rounded-full" />
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map(service => {
                  const IconComp = IconMap[service.icon?.toLowerCase()] || Code;
                  return (
                    <div key={service.id} onClick={() => setSelectedService(service)} className="group bg-white border border-gray-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-brand-500 rounded-3xl p-6 cursor-pointer hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden relative">
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
                          return (
                            <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                              <img src={getDriveThumbnailUrl(images[0])} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
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
                        ดูรายละเอียด <ArrowRight className="w-4 h-4 ml-1" />
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
                <div className="text-brand-100 font-medium">ปีของประสบการณ์</div>
              </div>
              <div className="py-4">
                <div className="text-5xl font-extrabold mb-2">50+</div>
                <div className="text-brand-100 font-medium">โปรเจกต์ที่สำเร็จ</div>
              </div>
              <div className="py-4">
                <div className="text-5xl font-extrabold mb-2">100%</div>
                <div className="text-brand-100 font-medium">ความพึงพอใจของลูกค้า</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PORTFOLIO (FEATURED PROJECTS) SECTION ================= */}
        <section id="portfolio" className="py-24 bg-gray-50 relative scroll-mt-20 border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="text-brand-500 font-bold tracking-wide uppercase text-sm mb-2">{config.port_badge}</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">{config.port_title}</h3>
              <div className="w-16 h-1 bg-brand-500 mx-auto mt-6 rounded-full" />
              <p className="text-gray-600 mt-6 max-w-2xl mx-auto whitespace-pre-line">{config.port_desc}</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {integrations.map(project => {
                  const CardWrapper = project.referenceUrl ? 'a' : 'div';
                  const wrapperProps = project.referenceUrl ? { href: project.referenceUrl, target: '_blank', rel: 'noopener noreferrer' } : {};
                  return (
                  <CardWrapper key={project.id} {...(wrapperProps as any)} className="bg-white border text-left border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 rounded-3xl overflow-hidden transition-all duration-300 group flex flex-col h-full cursor-pointer block">
                    <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden relative">
                      {project.imageUrl && project.imageUrl.includes('http') ? (
                        <img src={getDriveThumbnailUrl(project.imageUrl)} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      ) : (
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
                )})}
              </div>
            )}
          </div>
        </section>

        {/* ================= CONTACT SECTION ================= */}
        <section id="contact" className="py-24 bg-gray-900 relative scroll-mt-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">พร้อมเริ่มพัฒนาโปรเจกต์ของคุณแล้วหรือยัง?</h2>
            <p className="text-gray-400 mb-10 text-lg">ปรึกษาเราฟรี ไม่มีค่าใช้จ่าย พร้อมประเมินราคาและระบบที่ตอบโจทย์คุณที่สุดอย่างรวดเร็ว</p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="mailto:hello@deedeviot.com" className="flex items-center justify-center gap-3 bg-brand-500 hover:bg-brand-600 border border-brand-500 px-8 py-4 rounded-xl text-white font-bold transition-colors shadow-lg shadow-brand-500/20">
                <Mail className="w-5 h-5" /> hello@deedeviot.com
              </a>
              <a href="tel:0899999999" className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-8 py-4 rounded-xl text-white font-bold transition-colors">
                <Phone className="w-5 h-5" /> 089-999-9999
              </a>
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
              เราคือพาร์ทเนอร์ที่พร้อมพาสานต่อไอเดียของคุณให้กลายเป็นแพลตฟอร์ม Web & Hardware ที่สามารถใช้งานได้จริง เต็มเปี่ยมไปด้วยประสิทธิภาพ
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">บริการของเรา</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#services" className="hover:text-brand-500 transition-colors">Web Application Development</a></li>
              <li><a href="#services" className="hover:text-brand-500 transition-colors">IoT Platform Architecture</a></li>
              <li><a href="#services" className="hover:text-brand-500 transition-colors">Hardware Integration (ESP32/Arduino)</a></li>
              <li><a href="#services" className="hover:text-brand-500 transition-colors">IT Consulting</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">ติดต่อเรา</h4>
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
                <a href={selectedService.demoUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl flex items-center gap-2 transition-colors"><ExternalLink className="w-4 h-4 ml-1" /> เปิดเว็บไซต์ของจริง</a>
              )}
              <button onClick={() => setSelectedService(null)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">ปิดหน้าต่าง</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
