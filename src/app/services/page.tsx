"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Cpu, Globe, ArrowRight, ExternalLink, FileText, CheckCircle2, 
  Layers, Sliders, ShieldCheck, Zap, Sparkles 
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import FloatingMessenger from '../../components/layout/FloatingMessenger';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import ProjectModal from '../../components/showcase/ProjectModal';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { ProjectItem } from '../../types/portfolio';
import { MessengerIcon } from '../../components/common/Icons';

export default function ServicesPage() {
  const { services, config, allProjects, isLoading } = usePortfolioData();
  const [selectedService, setSelectedService] = useState<ProjectItem | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'iot' | 'web'>('all');
  const [lang, setLang] = useState<'th' | 'en'>('th');

  // Filter services by category
  const filteredServices = services.filter(svc => {
    if (activeTab === 'all') return true;
    const text = `${svc.title} ${svc.title_th} ${svc.icon} ${svc.description}`.toLowerCase();
    if (activeTab === 'iot') {
      return text.includes('iot') || text.includes('smart') || text.includes('sensor') || text.includes('hardware') || text.includes('firmware');
    }
    if (activeTab === 'web') {
      return text.includes('web') || text.includes('app') || text.includes('cloud') || text.includes('dashboard') || text.includes('sheet') || text.includes('liff');
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] font-sans antialiased relative">
      {/* Background tech grid */}
      <div className="fixed inset-0 bg-tech-grid-light opacity-60 pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={() => setLang(lang === 'th' ? 'en' : 'th')}
        messengerUrl={config.contact_messenger}
      />

      <main className="relative z-10 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-[#E11D48] text-xs font-mono font-bold shadow-2xs">
              <Sparkles size={14} />
              <span>{config.svc_badge_th || 'OUR CORE SERVICES & SOLUTIONS'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              {lang === 'th' ? 'บริการวิศวกรรม IoT และพัฒนาเว็บแพลตฟอร์ม' : 'IoT Engineering & Web Platform Services'}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {config.svc_desc_th || 'ออกแบบและสร้างระบบแบบ Tailor-made ครบวงจร ตั้งแต่วงจรไมโครคอนโทรลเลอร์ ตู้คอนโทรลอุตสาหกรรม เฟิร์มแวร์ ไปจนถึง Web Application และ Cloud Dashboard พร้อมใช้งานจริง'}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-white border-2 border-slate-200/90 shadow-xs gap-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-[#E11D48] to-[#EA580C] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                ทั้งหมด (All Services)
              </button>
              <button
                onClick={() => setActiveTab('iot')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'iot'
                    ? 'bg-gradient-to-r from-[#E11D48] to-[#EA580C] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Cpu size={14} />
                <span>IoT & Automation</span>
              </button>
              <button
                onClick={() => setActiveTab('web')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'web'
                    ? 'bg-gradient-to-r from-[#E11D48] to-[#EA580C] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Globe size={14} />
                <span>Web & Cloud Solutions</span>
              </button>
            </div>
          </div>

          {/* Services Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-[#E11D48] border-t-transparent rounded-full animate-spin" />
              <p className="mt-3 text-xs text-slate-500 font-mono">กำลังโหลดข้อมูลบริการ...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredServices.map(svc => {
                const imgUrls = svc.imageUrl ? svc.imageUrl.split(',').map(u => u.trim()).filter(Boolean) : [];
                const firstImg = imgUrls[0] || '';
                const vUrls = svc.videoUrls ? svc.videoUrls.split(',').map(u => u.trim()).filter(Boolean) : [];

                const asProject: ProjectItem = {
                  id: svc.id,
                  name: svc.title_th || svc.title,
                  category: svc.icon || 'Service Solution',
                  categoryKey: (svc.icon || 'service').trim().toLowerCase(),
                  description: svc.description_th || svc.description,
                  technologies: ['Custom Solution', 'Production Architecture', 'Integration'],
                  imageUrl: firstImg,
                  demoUrl: svc.demoUrl || undefined,
                  manualUrl: svc.manualUrl || undefined,
                  videoUrls: vUrls,
                  architectureDetails: [
                    'ออกแบบฮาร์ดแวร์และเฟิร์มแวร์รองรับการทำงาน 24/7',
                    'ระบบเชื่อมโยง API และแสดงผลสดแบบ Real-time',
                    'บริการดูแลและส่งมอบโค้ดพร้อมคู่มือการใช้งาน'
                  ],
                  sourceType: 'service'
                };

                return (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedService(asProject)}
                    className="bg-white border-2 border-slate-200/90 hover:border-[#E11D48] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  >
                    {/* Cover Thumbnail */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                      <ImageWithFallback
                        src={firstImg}
                        alt={svc.title_th || svc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        loading="lazy"
                        fallbackIcon={
                          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-rose-50/50 flex items-center justify-center">
                            <Cpu size={36} className="text-slate-400 group-hover:text-[#E11D48] transition-colors" />
                          </div>
                        }
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-slate-300 text-[10px] font-mono font-bold text-slate-800 shadow-2xs">
                        {svc.icon || 'Solution'}
                      </div>
                      {imgUrls.length > 1 && (
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono font-bold">
                          +{imgUrls.length - 1} รูป
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-[#E11D48] transition-colors">
                          {svc.title_th || svc.title}
                        </h3>
                        {svc.title_th && svc.title && (
                          <p className="text-xs font-mono text-slate-500 font-semibold">{svc.title}</p>
                        )}
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {svc.description_th || svc.description}
                        </p>
                      </div>

                      {/* Bottom actions */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-[#E11D48] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          ดูสเปกและตัวอย่าง <ArrowRight size={14} />
                        </span>

                        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                          {svc.demoUrl && (
                            <a
                              href={svc.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100"
                              title="เปิด Live Demo"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                          {svc.manualUrl && (
                            <a
                              href={svc.manualUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                              title="คู่มือ Manual"
                            >
                              <FileText size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Consultation Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-8 sm:p-12 text-white border-2 border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                CUSTOM ENGINEERING INQUIRY
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                มีโจทย์หรือต้องการออกแบบระบบเฉพาะสำหรับธุรกิจคุณ?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                ปรึกษาทีมวิศวกร DeeDevIoT ได้โดยตรง พร้อมให้คำแนะนำด้านการเลือกชิ้นส่วนฮาร์ดแวร์ การวางโครงสร้างซอฟต์แวร์ และงบประมาณ
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={config.contact_messenger || 'https://m.me/DeeDevIOT'}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#0084FF] to-[#00C6FF] text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <MessengerIcon className="w-4 h-4 fill-white" />
                <span>ทักแชท Inbox ปรึกษาทันที</span>
              </a>
              <Link
                href="/contact"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
              >
                ดูช่องทางติดต่อทั้งหมด →
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Reusable Project Modal */}
      <ProjectModal
        project={selectedService}
        onClose={() => setSelectedService(null)}
        messengerUrl={config.contact_messenger}
      />

      {/* Floating Messenger Widget */}
      <FloatingMessenger messengerUrl={config.contact_messenger} />

      {/* Global Footer */}
      <Footer
        facebookUrl={config.contact_facebook_th ? `https://www.facebook.com/${config.contact_facebook_th}` : undefined}
        messengerUrl={config.contact_messenger}
        email={config.contact_email}
        phone={config.contact_phone}
      />
    </div>
  );
}
