"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Search, Sliders, ExternalLink, FileText, 
  Layers, CheckCircle2, ArrowRight, Filter 
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import FloatingMessenger from '../../components/layout/FloatingMessenger';
import ProjectCard from '../../components/showcase/ProjectCard';
import ProjectModal from '../../components/showcase/ProjectModal';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { ProjectItem } from '../../types/portfolio';
import { MessengerIcon } from '../../components/common/Icons';

export default function ShowcasePage() {
  const { allProjects, categories, config, isLoading } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [lang, setLang] = useState<'th' | 'en'>('th');

  // Filter projects by category and search keyword
  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => {
      const matchCategory = selectedCategory === 'all' || 
        project.category.toLowerCase() === selectedCategory.toLowerCase() ||
        project.categoryKey === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchSearch = !query || 
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.technologies.some(t => t.toLowerCase().includes(query));

      return matchCategory && matchSearch;
    });
  }, [allProjects, selectedCategory, searchQuery]);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-[#E11D48] text-xs font-mono font-bold shadow-2xs">
              <Sparkles size={14} />
              <span>PRODUCTION SHOWCASE & LIVE DEMO</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              {lang === 'th' ? 'ศูนย์รวมผลงานระบบที่พัฒนาและส่งมอบจริง' : 'Delivered Systems & Live Demo Portfolio'}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              ชมตัวอย่างผลงานระบบ IoT อุตสาหกรรม, ระบบสั่งอาหาร LINE LIFF, ระบบ POS ร้านค้า, แดชบอร์ดตรวจสอบเซนเซอร์สด และระบบคลาวด์ที่ใช้งานจริงในธุรกิจ
            </p>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="bg-white/95 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border-2 border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search Box */}
              <div className="relative flex-1 w-full">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาชื่อผลงาน, เซนเซอร์, ESP32, LIFF, POS, แดชบอร์ด..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#E11D48] transition-all"
                />
              </div>

              {/* Reset Search Button */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 shrink-0"
                >
                  ล้างคำค้นหา
                </button>
              )}
            </div>

            {/* Categories Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Filter size={13} />
                <span>หมวดหมู่:</span>
              </span>

              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#E11D48] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ทั้งหมด ({allProjects.length})
              </button>

              {categories.map(cat => {
                const count = allProjects.filter(p => p.category === cat).length;
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#E11D48] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-[#E11D48] border-t-transparent rounded-full animate-spin" />
              <p className="mt-3 text-xs text-slate-500 font-mono">กำลังโหลดผลงานระบบ...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-slate-200 p-8 space-y-3">
              <Layers size={36} className="text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">ไม่พบผลงานที่ตรงกับคำค้นหา</h3>
              <p className="text-xs text-slate-500">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อดูผลงาน</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                ดูผลงานทั้งหมด
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={setSelectedService => setActiveModalProject(setSelectedService)}
                />
              ))}
            </div>
          )}

          {/* Bottom Consultation Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-8 sm:p-12 text-white border-2 border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                CUSTOM SYSTEM DEVELOPMENT
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                สนใจระบบแบบใดในผลงาน หรือต้องการฟังก์ชันเพิ่มเติม?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                ส่งหัวข้อโจทย์หรือไอเดียของท่านให้ทีมงาน DeeDevIoT ประเมินแนวทางการทำระบบและระยะเวลาพัฒนาได้ฟรี
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
                <span>ทัก Inbox ปรึกษาระบบ</span>
              </a>
              <Link
                href="/services"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
              >
                ดูบริการทั้งหมด →
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Reusable Project Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
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
