"use client";

import React, { useEffect, useState } from 'react';
import { Cpu, Code, Globe, Smartphone, Database, Wifi, Server, Terminal, ChevronRight, ArrowRight, Zap, Activity, Monitor, X, ExternalLink, Blocks, MessageSquare, Mail, Phone } from 'lucide-react';
import { getDriveThumbnailUrl } from '../lib/drive';

// Types
interface ServiceData { id: string; title: string; description: string; icon: string; imageUrl?: string; demoUrl?: string; }
interface IntegrationData { id: string; title: string; description: string; icon: string; link: string; }
interface ConfigData { hero_btn1_text: string; hero_btn1_link: string; hero_btn2_text: string; hero_btn2_link: string; }

const IconMap: Record<string, React.FC<any>> = {
  cpu: Cpu, code: Code, globe: Globe, smartphone: Smartphone, database: Database, wifi: Wifi, 
  server: Server, terminal: Terminal, zap: Zap, activity: Activity, monitor: Monitor, blocks: Blocks
};

export default function LandingPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationData[]>([]);
  const [config, setConfig] = useState<ConfigData>({
    hero_btn1_text: 'ดูบริการของเรา', hero_btn1_link: '#services',
    hero_btn2_text: 'ติดต่อสอบถาม', hero_btn2_link: '#contact'
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
          setConfig({
            hero_btn1_text: jsonConf.data.hero_btn1_text || 'ดูบริการของเรา',
            hero_btn1_link: jsonConf.data.hero_btn1_link || '#services',
            hero_btn2_text: jsonConf.data.hero_btn2_text || 'ติดต่อสอบถาม',
            hero_btn2_link: jsonConf.data.hero_btn2_link || '#contact'
          });
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
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-teal-500/30">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2 cursor-pointer">
            <span className="text-teal-400 font-extrabold">Dee</span>Dev<span className="text-sky-400">IoT</span>
          </div>
          <a href={config.hero_btn2_link} className="hidden sm:block px-6 py-2.5 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-white rounded-full font-medium transition-all shadow-lg shadow-teal-500/20 active:scale-95 duration-200">
            {config.hero_btn2_text}
          </a>
        </div>
      </nav>

      <main className="pt-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-24 sm:py-32 lg:pb-32 lg:pt-40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400 pb-2">เชื่อมต่อโลกดิจิทัล</span>
              <span className="block mt-2 text-slate-100">และฮาร์ดแวร์เข้าด้วยกัน</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              ยกระดับธุรกิจของคุณด้วยนวัตกรรมที่ทันสมัย ทั้งระบบบริหารจัดการบนเว็บไซต์ประสิทธิภาพสูง 
              และระบบอัตโนมัติอัจฉริยะจากบอร์ดควบคุมต่างๆ
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={config.hero_btn1_link} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-white rounded-xl font-semibold transition-all shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 group duration-300">
                {config.hero_btn1_text} <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </a>
              <a href={config.hero_btn2_link} className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all border border-slate-700 flex items-center justify-center gap-2 duration-300">
                <MessageSquare className="w-5 h-5 text-sky-400" /> {config.hero_btn2_text}
              </a>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="py-24 bg-slate-800/30 border-y border-slate-800/50 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-white">บริการของเรา</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-sky-500 mx-auto mt-6 rounded-full" />
            </div>
            
            {loading ? (
              <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-slate-700 border-t-teal-500 rounded-full animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map(service => {
                  const IconComp = IconMap[service.icon?.toLowerCase()] || Code;
                  return (
                    <div key={service.id} onClick={() => setSelectedService(service)} className="group bg-slate-900 border border-slate-800 hover:border-teal-500/30 rounded-3xl p-8 cursor-pointer hover:-translate-y-2 transition-all flex flex-col h-full">
                      {service.imageUrl ? (() => {
                        const images = service.imageUrl.split(/[,\n]/).map(url => url.trim()).filter(Boolean);
                        if (images.length > 1) {
                          return (
                            <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden grid grid-cols-2 gap-0.5 shrink-0">
                              {images.slice(0, 4).map((img, i) => (
                                <div key={i} className="relative w-full h-full overflow-hidden">
                                  <img src={getDriveThumbnailUrl(img)} alt={service.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105" />
                                  {i === 3 && images.length > 4 && <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center"><span className="text-white font-bold">+{images.length - 4}</span></div>}
                                </div>
                              ))}
                            </div>
                          );
                        }
                        if (images.length === 1) {
                          return (
                            <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden shrink-0">
                              <img src={getDriveThumbnailUrl(images[0])} alt={service.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105" />
                            </div>
                          );
                        }
                        return null;
                      })() : (
                        <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center mb-6 shrink-0"><IconComp className="w-7 h-7 text-teal-400" /></div>
                      )}
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-teal-300">{service.title}</h3>
                      <p className="text-slate-400 mb-6 flex-grow">{service.description}</p>
                      <div className="text-sm font-semibold text-sky-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">ดูรายละเอียด <ChevronRight className="w-4 h-4" /></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* INTEGRATIONS SECTION */}
        <section id="integrations" className="py-24 relative scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-white">บริการที่ทำงานร่วมกันได้</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 mx-auto mt-6 rounded-full" />
              <p className="text-slate-400 mt-6">เราสามารถเชื่อมต่อและสร้าง Automation ร่วมกับแพลตฟอร์มเหล่านี้ได้อย่างไร้รอยต่อ</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {integrations.map(int => {
                const IconComp = IconMap[int.icon?.toLowerCase()] || Blocks;
                return (
                  <a key={int.id} href={int.link || '#'} target={int.link ? "_blank" : undefined} rel="noreferrer" className="bg-slate-900/50 border border-slate-800 hover:border-sky-500/50 p-6 rounded-2xl flex items-start gap-4 transition-all hover:bg-slate-800 group">
                    <div className="p-3 bg-slate-800 rounded-xl group-hover:bg-sky-500/20 text-slate-400 group-hover:text-sky-400 transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold group-hover:text-sky-300">{int.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{int.description}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 bg-teal-900/10 border-t border-teal-500/10 relative scroll-mt-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">เริ่มสร้างโปรเจกต์ของคุณวันนี้</h2>
            <p className="text-slate-400 mb-10 text-lg">ปรึกษาเราฟรี ไม่มีค่าใช้จ่าย พร้อมประเมินราคาและระบบที่ตอบโจทย์คุณที่สุด</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="mailto:hello@deedeviot.com" className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-4 rounded-xl text-white font-semibold transition-colors">
                <Mail className="w-5 h-5 text-teal-400" /> hello@deedeviot.com
              </a>
              <a href="tel:0899999999" className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-4 rounded-xl text-white font-semibold transition-colors">
                <Phone className="w-5 h-5 text-sky-400" /> 089-999-9999
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
           <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-8">
              <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full"><X className="w-5 h-5" /></button>
              <h2 className="text-3xl font-bold text-white mb-3 pr-8">{selectedService.title}</h2>
              <p className="text-slate-400 mb-8">{selectedService.description}</p>
              
              {selectedService.demoUrl ? (
                 <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <iframe src={selectedService.demoUrl} className="absolute inset-0 w-full h-full" sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>
                 </div>
              ) : (
                 <div className="w-full aspect-video rounded-xl bg-slate-800/30 flex items-center justify-center text-slate-500"><Code className="w-12 h-12 opacity-20" /></div>
              )}
              
              <div className="mt-6 flex justify-end gap-3">
                 {selectedService.demoUrl && (
                    <a href={selectedService.demoUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-teal-500 text-slate-950 font-bold rounded-lg flex items-center gap-2"><ExternalLink className="w-4 h-4 ml-1" /> ดูตัวอย่างเว็บไซต์</a>
                 )}
                 <button onClick={() => setSelectedService(null)} className="px-6 py-3 bg-slate-800 text-white rounded-lg">ปิดหน้าต่าง</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
