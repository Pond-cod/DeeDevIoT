"use client";

import React, { useEffect, useState, useRef } from 'react';
import {
  Server, Cpu, Wifi, Globe, Code, ArrowUpRight, ArrowRight,
  ExternalLink, Layers, Terminal, Database, Check, Phone,
  Mail, MessageCircle, Facebook, X, Menu, Lock, ShieldCheck,
  ChevronRight, Activity, ArrowDown
} from 'lucide-react';
import Link from 'next/link';

// ================= TYPES & REAL PROJECT DATA =================
interface ProjectItem {
  id: string;
  title: string;
  title_th?: string;
  category: 'web' | 'iot' | 'interactive';
  categoryLabel: string;
  description: string;
  description_th?: string;
  tech: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  architecture?: string[];
  featured?: boolean;
}

// 5 Real Verified Projects built by DeeDevIOT Developer
const BASELINE_PROJECTS: ProjectItem[] = [
  {
    id: 'smart-wallet',
    title: 'Smart Wallet',
    title_th: 'ระบบกระเป๋าเงินและจัดการค่าใช้จ่ายอัจฉริยะ',
    category: 'web',
    categoryLabel: 'Web Application',
    description: 'Personal finance & expense management web application with real-time budget tracking, category analytics, and transaction history.',
    description_th: 'เว็บแอปพลิเคชันจัดการรายรับ-รายจ่ายส่วนบุคคล วิเคราะห์หมวดหมู่การใช้จ่าย พร้อมแดชบอร์ดสรุปยอดแบบเรียลไทม์',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Chart.js'],
    demoUrl: 'https://smart-wallet.vercel.app',
    architecture: ['Client: Next.js Responsive UI', 'API: RESTful Endpoints', 'Storage: Relational Database'],
    featured: true,
  },
  {
    id: 'minimal-weather',
    title: 'Minimal Weather Station',
    title_th: 'สถานีตรวจวัดสภาพอากาศและข้อมูลเซนเซอร์',
    category: 'iot',
    categoryLabel: 'IoT & Telemetry',
    description: 'Real-time environmental sensor telemetry dashboard displaying temperature, humidity, and atmospheric metrics with rapid auto-refresh.',
    description_th: 'ระบบรับส่งข้อมูลและแดชบอร์ดแสดงผลสภาพแวดล้อมแบบเรียลไทม์ วัดอุณหภูมิ ความชื้น และค่าความกดอากาศ',
    tech: ['ESP32', 'React', 'MQTT', 'REST API', 'Sensors (BME280)'],
    demoUrl: 'https://minimal-weather.vercel.app',
    architecture: ['Hardware: ESP32 + BME280', 'Protocol: MQTT Telemetry', 'Dashboard: React Real-time Visualizer'],
    featured: true,
  },
  {
    id: 'sudoku-engine',
    title: 'Sudoku Algorithm Engine',
    title_th: 'ระบบประมวลผลตรรกะและเกมซูโดกุ',
    category: 'web',
    categoryLabel: 'Web Application / Logic',
    description: 'Algorithmic puzzle solver, board validator, and responsive interactive web application with state history and difficulty generator.',
    description_th: 'เว็บแอปพลิเคชันเกมซูโดกุพร้อมอัลกอริทึมตรวจสอบตรรกะ ตัวสร้างตาราง และระบบ Undo/Redo สถานะสมบูรณ์แบบ',
    tech: ['TypeScript', 'React', 'Tailwind CSS', 'Backtracking Algorithm'],
    demoUrl: 'https://sudoku.vercel.app',
    architecture: ['Algorithm: Recursive Backtracking', 'State: Immutable History Engine', 'UI: Mobile-first Grid'],
    featured: false,
  },
  {
    id: 'duck-hunt-arcade',
    title: 'Duck Hunt Arcade Canvas',
    title_th: 'เกมจำลองฟิสิกส์และระบบตอบสนองบนเว็บ',
    category: 'interactive',
    categoryLabel: 'Interactive Systems',
    description: 'HTML5 Canvas browser-based arcade game featuring low-latency rendering, sprite animation cycles, and real-time collision detection.',
    description_th: 'ระบบจำลองเกมบนเบราว์เซอร์ด้วย HTML5 Canvas การคำนวณการชนแบบเรียลไทม์ และเอนจินเสียงตอบสนองความเร็วสูง',
    tech: ['HTML5 Canvas', 'JavaScript (ES6)', 'Web Audio API', 'Game Physics'],
    demoUrl: 'https://duck-hunt.vercel.app',
    architecture: ['Renderer: Canvas 60 FPS Loop', 'Input: Pointer Events API', 'Audio: Web Audio Synthesizer'],
    featured: false,
  },
  {
    id: 'cookie-runner',
    title: 'Cookie Runner Engine',
    title_th: 'เอนจินเกมจำลองการวิ่ง 2 มิติ',
    category: 'interactive',
    categoryLabel: 'Interactive Systems',
    description: '2D interactive web physics runner game with continuous parallax scrolling, collision matrices, and local session persistence.',
    description_th: 'เกมวิ่ง 2 มิติบนเว็บพร้อมระบบฟิสิกส์แรงโน้มถ่วง การตรวจจับการชน และการบันทึกสถิติคะแนนสูงสุด',
    tech: ['JavaScript', 'HTML5', 'CSS Grid', 'LocalStorage API'],
    demoUrl: 'https://cookie-runner.vercel.app',
    architecture: ['Physics: 2D Velocity & Gravity', 'Animation: RequestAnimationFrame', 'Storage: Client State'],
    featured: false,
  }
];

export default function HomePage() {
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  // Dynamic Data from API (Google Sheets)
  const [apiServices, setApiServices] = useState<any[]>([]);
  const [configData, setConfigData] = useState<any>({});
  const [activeFlowNode, setActiveFlowNode] = useState<number>(0);

  // Auto-cycle data flow diagram active node to show telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFlowNode((prev) => (prev + 1) % 5);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Navbar scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body when modal or mobile nav is open
  useEffect(() => {
    if (mobileNavOpen || activeModalProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileNavOpen, activeModalProject]);

  // Fetch live CMS data
  useEffect(() => {
    const loadSiteData = async () => {
      try {
        const [servicesRes, configRes] = await Promise.all([
          fetch('/api/services', { cache: 'no-store' }),
          fetch('/api/config', { cache: 'no-store' })
        ]);
        const [servicesJson, configJson] = await Promise.all([
          servicesRes.json(),
          configRes.json()
        ]);
        if (servicesJson.success && Array.isArray(servicesJson.data) && servicesJson.data.length > 0) {
          setApiServices(servicesJson.data);
        }
        if (configJson.success && configJson.data) {
          setConfigData(configJson.data);
        }
      } catch {
        // Fallbacks silently maintained
      }
    };
    loadSiteData();
  }, []);

  // Combine baseline projects with any dynamically added CMS services
  const combinedProjects: ProjectItem[] = [
    ...BASELINE_PROJECTS,
    ...apiServices.map((svc, idx) => ({
      id: svc.id || `cms-${idx}`,
      title: svc.title,
      title_th: svc.title_th || svc.title,
      category: 'web' as const,
      categoryLabel: svc.icon || 'Custom Solution',
      description: svc.description,
      description_th: svc.description_th || svc.description,
      tech: ['Custom Architecture', 'Full-stack', 'Integration'],
      imageUrl: svc.imageUrl ? svc.imageUrl.split(',')[0].trim() : undefined,
      demoUrl: svc.demoUrl || undefined,
      architecture: ['Custom Implementation for Business Workflow'],
      featured: false,
    }))
  ];

  const filteredProjects = selectedCategory === 'all'
    ? combinedProjects
    : combinedProjects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#08090D] text-white selection:bg-[#E53935]/20 selection:text-white font-sans antialiased">

      {/* ================= 01 — NAVBAR ================= */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled 
          ? 'bg-[#08090D]/90 backdrop-blur-md border-b border-[#252832] py-3' 
          : 'bg-transparent py-5 border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="#hero" className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-[#E53935]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E53935] shadow-[0_0_8px_rgba(229,57,53,0.6)]" />
            <div className="flex items-center gap-1.5 font-mono text-sm tracking-wider font-bold">
              <span className="text-white">DEEDEV</span>
              <span className="text-[#6B7280]">/</span>
              <span className="text-[#9CA3AF] group-hover:text-white transition-colors">IOT</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-[#9CA3AF]">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#works" className="hover:text-white transition-colors">Works</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#technology" className="hover:text-white transition-colors">Technology</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          {/* Right Action & Lang */}
          <div className="flex items-center gap-3">
            {/* Lang Toggle */}
            <div className="flex items-center border border-[#252832] rounded bg-[#111318] p-0.5 text-[11px] font-mono">
              <button
                onClick={() => setLang('th')}
                className={`px-2 py-0.5 rounded transition-colors ${lang === 'th' ? 'bg-[#252832] text-white font-bold' : 'text-[#9CA3AF] hover:text-white'}`}
              >
                TH
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded transition-colors ${lang === 'en' ? 'bg-[#252832] text-white font-bold' : 'text-[#9CA3AF] hover:text-white'}`}
              >
                EN
              </button>
            </div>

            {/* Let's Talk CTA Button */}
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold tracking-wider uppercase border border-[#252832] bg-[#111318] hover:border-[#E53935] hover:text-white text-[#9CA3AF] rounded transition-colors"
            >
              <span>{lang === 'th' ? 'ปรึกษาโปรเจกต์' : "Let's Talk"}</span>
              <ArrowRight size={13} className="text-[#E53935]" />
            </a>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded border border-[#252832] bg-[#111318] text-[#9CA3AF] hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#08090D]/95 backdrop-blur-lg pt-20 px-6 pb-8 flex flex-col justify-between">
          <nav className="flex flex-col space-y-4 font-mono text-sm uppercase tracking-wider text-[#9CA3AF]">
            <a href="#services" onClick={() => setMobileNavOpen(false)} className="py-2 border-b border-[#252832] hover:text-white">01. Services</a>
            <a href="#works" onClick={() => setMobileNavOpen(false)} className="py-2 border-b border-[#252832] hover:text-white">02. Works & Projects</a>
            <a href="#architecture" onClick={() => setMobileNavOpen(false)} className="py-2 border-b border-[#252832] hover:text-white">03. Architecture</a>
            <a href="#technology" onClick={() => setMobileNavOpen(false)} className="py-2 border-b border-[#252832] hover:text-white">04. Technology Matrix</a>
            <a href="#workflow" onClick={() => setMobileNavOpen(false)} className="py-2 border-b border-[#252832] hover:text-white">05. Workflow</a>
            <a href="#about" onClick={() => setMobileNavOpen(false)} className="py-2 border-b border-[#252832] hover:text-white">06. About Studio</a>
            <a href="#contact" onClick={() => setMobileNavOpen(false)} className="py-2 border-b border-[#252832] hover:text-white">07. Contact</a>
          </nav>
          <div>
            <a
              href="#contact"
              onClick={() => setMobileNavOpen(false)}
              className="w-full py-3 bg-[#E53935] text-white font-mono text-xs uppercase tracking-wider font-bold rounded flex items-center justify-center gap-2"
            >
              <span>{lang === 'th' ? 'ติดต่อเริ่มต้นโปรเจกต์' : 'Start a Project'}</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}

      {/* ================= 02 — HERO ================= */}
      <section id="hero" className="relative pt-32 sm:pt-40 pb-20 border-b border-[#252832] overflow-hidden bg-tech-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Studio Tag & Live Status Indicator */}
          <div className="flex flex-wrap items-center gap-3 mb-6 font-mono text-xs">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#111318] border border-[#252832] text-[#9CA3AF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E53935] animate-pulse" />
              <span>DEEDEV IOT</span>
              <span className="text-[#6B7280]">::</span>
              <span className="text-white font-semibold">TECHNOLOGY SOLUTION STUDIO</span>
            </span>
            <span className="text-[#6B7280] hidden sm:inline">•</span>
            <span className="text-[#9CA3AF] hidden sm:inline font-mono">STATUS: ACCEPTING NEW PROJECTS</span>
          </div>

          {/* Main Headline */}
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase leading-[1.1] mb-6">
              Turn Ideas <br />
              <span className="text-white">Into Real </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#9CA3AF]">
                Digital Solutions.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#9CA3AF] max-w-2xl leading-relaxed mb-8 font-light">
              {lang === 'th' ? (
                <>
                  บริการออกแบบและพัฒนา <strong className="text-white font-medium">IoT Solutions, Web Applications</strong> และ <strong className="text-white font-medium">IT Systems</strong> สำหรับธุรกิจและองค์กรที่เน้นการใช้งานได้จริง เสถียร และต่อขยายได้
                </>
              ) : (
                'IoT Solutions, Web Applications and IT Systems built for real-world reliability, enterprise workflows, and scalable physical hardware integrations.'
              )}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#works"
                className="px-6 py-3.5 bg-white text-[#08090D] hover:bg-[#E53935] hover:text-white font-mono text-xs uppercase tracking-wider font-bold rounded transition-colors flex items-center justify-center gap-2"
              >
                <span>{lang === 'th' ? 'ดูผลงานที่พัฒนาจริง' : 'View Our Works'}</span>
                <ArrowDown size={14} />
              </a>
              <a
                href="#contact"
                className="px-6 py-3.5 bg-[#111318] text-white border border-[#252832] hover:border-[#E53935] font-mono text-xs uppercase tracking-wider font-semibold rounded transition-colors flex items-center justify-center gap-2"
              >
                <span>{lang === 'th' ? 'เริ่มต้นพัฒนาโปรเจกต์' : 'Start a Project'}</span>
                <ArrowRight size={14} className="text-[#E53935]" />
              </a>
            </div>
          </div>

          {/* ================= REAL DATA FLOW ARCHITECTURE (Non-AI, Human-Designed) ================= */}
          <div className="mt-16 pt-10 border-t border-[#252832]">
            <div className="flex items-center justify-between mb-4 font-mono text-xs text-[#9CA3AF]">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-[#E53935]" />
                <span className="text-white font-bold uppercase tracking-wider">End-to-End System Architecture Flow</span>
              </div>
              <span className="hidden sm:inline text-[#6B7280]">ACTIVE PIPELINE TELEMETRY</span>
            </div>

            {/* 5-Node Technical Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { label: 'DEVICE', sub: 'Sensors / ESP32', tech: 'GPIO, I2C, Serial', icon: Cpu, step: '01' },
                { label: 'IoT PROTOCOL', sub: 'Telemetry Pipeline', tech: 'MQTT / WebSockets', icon: Wifi, step: '02' },
                { label: 'BACKEND API', sub: 'System Logic', tech: 'Node.js / Express / Python', icon: Server, step: '03' },
                { label: 'DATABASE', sub: 'Persistence Layer', tech: 'PostgreSQL / Timescale', icon: Database, step: '04' },
                { label: 'WEB APPLICATION', sub: 'Command Dashboard', tech: 'Next.js / Responsive UI', icon: Globe, step: '05' },
              ].map((node, i) => {
                const Icon = node.icon;
                const isActive = activeFlowNode === i;
                return (
                  <div
                    key={node.label}
                    onClick={() => setActiveFlowNode(i)}
                    className={`p-4 rounded border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#111318] border-[#E53935] shadow-[0_0_12px_rgba(229,57,53,0.15)]' 
                        : 'bg-[#0D0E12] border-[#252832] hover:border-[#3F4350]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 font-mono text-[10px]">
                      <span className="text-[#6B7280]">NODE {node.step}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#E53935]' : 'bg-[#252832]'}`} />
                    </div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <Icon size={16} className={isActive ? 'text-[#E53935]' : 'text-[#9CA3AF]'} />
                      <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">{node.label}</h4>
                    </div>
                    <p className="text-xs text-[#9CA3AF] leading-tight mb-2">{node.sub}</p>
                    <div className="pt-2 border-t border-[#252832] font-mono text-[10px] text-[#6B7280]">
                      {node.tech}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ================= 03 — INTRO / VALUE ================= */}
      <section className="py-20 border-b border-[#252832] bg-[#0D0E12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            <div className="lg:col-span-4">
              <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-2">[ OUR METHODOLOGY ]</span>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white leading-tight">
                "From an idea to a working system."
              </h2>
            </div>

            <div className="lg:col-span-8">
              <p className="text-[#9CA3AF] text-sm sm:text-base leading-relaxed mb-8">
                {lang === 'th' ? (
                  'เราไม่ได้เพียงสร้างหน้าเว็บเพื่อความสวยงามเพียงอย่างเดียว แต่เราออกแบบสถาปัตยกรรมทางวิศวกรรมที่เชื่อมโยงระบบทุกชั้น ตั้งแต่การรับฟังปัญหา วิเคราะห์ฮาร์ดแวร์ พัฒนาโค้ดที่ดูแลรักษาง่าย ไปจนถึงการติดตั้งระบบและทดสอบการทำงานจริงหน้างาน'
                ) : (
                  'We deliver digital products built for longevity and real business constraints. Rather than superficial templates, we engineer complete software and hardware architectures tailored to your operational needs.'
                )}
              </p>

              {/* 5-Step Value Flow */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 border-t border-[#252832] font-mono text-xs">
                {[
                  { step: '01', title: 'IDEA', desc: 'Define Problem' },
                  { step: '02', title: 'DESIGN', desc: 'Architecture & UI' },
                  { step: '03', title: 'DEVELOP', desc: 'Clean Engineering' },
                  { step: '04', title: 'INTEGRATE', desc: 'Sensors & APIs' },
                  { step: '05', title: 'DEPLOY', desc: 'Production Live' },
                ].map((s) => (
                  <div key={s.step} className="p-3 rounded border border-[#252832] bg-[#111318]">
                    <div className="text-[#E53935] font-bold text-[10px] mb-1">{s.step}</div>
                    <div className="text-white font-bold text-xs mb-0.5">{s.title}</div>
                    <div className="text-[#6B7280] text-[10px]">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 04 — SERVICES ================= */}
      <section id="services" className="py-20 sm:py-28 border-b border-[#252832]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-[#252832]">
            <div>
              <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-2">[ CORE EXPERTISE ]</span>
              <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                Engineering Services
              </h2>
            </div>
            <p className="text-xs font-mono text-[#9CA3AF] mt-3 sm:mt-0">
              3 FOCUSED SPECIALIZATIONS
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Service 01: IoT Solutions */}
            <div className="tech-card p-6 sm:p-8 rounded flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs text-[#6B7280]">
                  <span className="text-[#E53935] font-bold text-sm">01</span>
                  <span>HARDWARE & CLOUD</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">IoT Solutions</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed mb-6">
                  {lang === 'th'
                    ? 'เชื่อมต่ออุปกรณ์ Microcontroller (ESP32, Arduino), เซนเซอร์ตรวจวัด, คลาวด์ และแดชบอร์ดแสดงผลแบบเรียลไทม์'
                    : 'End-to-end telemetry systems bridging physical sensors, microcontrollers, real-time MQTT messaging, and visual dashboards.'}
                </p>

                <div className="space-y-2 pt-4 border-t border-[#252832] font-mono text-xs">
                  {['ESP32 / Arduino Firmware Development', 'Sensor Interfacing (I2C / SPI / Analog)', 'MQTT / WebSocket Telemetry Pipelines', 'Automated Control & Relay Triggers'].map((cap) => (
                    <div key={cap} className="flex items-start gap-2 text-[#9CA3AF]">
                      <span className="text-[#E53935] mt-0.5">•</span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#252832] flex items-center justify-between text-xs font-mono text-[#9CA3AF] group-hover:text-white transition-colors">
                <span>Inquire IoT System</span>
                <ArrowRight size={14} className="text-[#E53935] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 02: Web Applications */}
            <div className="tech-card p-6 sm:p-8 rounded flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs text-[#6B7280]">
                  <span className="text-[#E53935] font-bold text-sm">02</span>
                  <span>SOFTWARE ENGINEERING</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Web Applications</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed mb-6">
                  {lang === 'th'
                    ? 'พัฒนาเว็บแอปพลิเคชันตาม Workflow ธุรกิจ ระบบจัดการข้อมูลภายในองค์กร แดชบอร์ด และ Business Portal ที่เสถียร'
                    : 'Custom full-stack web applications, business management tools, secure authentication, and responsive operator dashboards.'}
                </p>

                <div className="space-y-2 pt-4 border-t border-[#252832] font-mono text-xs">
                  {['Full-stack Next.js & React Applications', 'Custom CRM / ERP & Business Workflows', 'Role-Based Authentication & Security', 'Real-time Charting & Data Analytics'].map((cap) => (
                    <div key={cap} className="flex items-start gap-2 text-[#9CA3AF]">
                      <span className="text-[#E53935] mt-0.5">•</span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#252832] flex items-center justify-between text-xs font-mono text-[#9CA3AF] group-hover:text-white transition-colors">
                <span>Inquire Web App</span>
                <ArrowRight size={14} className="text-[#E53935] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 03: IT Solutions & Infrastructure */}
            <div className="tech-card p-6 sm:p-8 rounded flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs text-[#6B7280]">
                  <span className="text-[#E53935] font-bold text-sm">03</span>
                  <span>ARCHITECTURE & CLOUD</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">IT Solutions & Systems</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed mb-6">
                  {lang === 'th'
                    ? 'ออกแบบระบบหลังบ้าน API, ฐานข้อมูล, ระบบอัตโนมัติ (Automation) และการดูแลรักษา Infrastructure บน Cloud'
                    : 'Robust API architectures, structured database schemas, automated background workflows, and scalable cloud deployment.'}
                </p>

                <div className="space-y-2 pt-4 border-t border-[#252832] font-mono text-xs">
                  {['RESTful & GraphQL API Design', 'Relational & NoSQL Database Architecture', 'Cloud Deployment (Vercel, GCP, VPS)', 'System Monitoring, Backups & Automation'].map((cap) => (
                    <div key={cap} className="flex items-start gap-2 text-[#9CA3AF]">
                      <span className="text-[#E53935] mt-0.5">•</span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#252832] flex items-center justify-between text-xs font-mono text-[#9CA3AF] group-hover:text-white transition-colors">
                <span>Inquire IT Solutions</span>
                <ArrowRight size={14} className="text-[#E53935] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 05 — FEATURED WORKS (Real Projects) ================= */}
      <section id="works" className="py-20 sm:py-28 border-b border-[#252832] bg-[#0D0E12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#252832] gap-4">
            <div>
              <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-2">[ DIGITAL PRODUCT SHOWCASE ]</span>
              <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                Featured Works
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {[
                { id: 'all', label: 'ALL WORKS' },
                { id: 'web', label: 'WEB APPS' },
                { id: 'iot', label: 'IoT & TELEMETRY' },
                { id: 'interactive', label: 'INTERACTIVE' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded border transition-colors ${
                    selectedCategory === tab.id
                      ? 'bg-white text-[#08090D] border-white font-bold'
                      : 'bg-[#111318] text-[#9CA3AF] border-[#252832] hover:border-[#3F4350] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="tech-card rounded flex flex-col justify-between overflow-hidden group"
              >
                {/* Project Header Bar (Browser Mockup Feel) */}
                <div className="p-4 bg-[#0D0E12] border-b border-[#252832] flex items-center justify-between font-mono text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#252832]" />
                    <span className="w-2 h-2 rounded-full bg-[#252832]" />
                    <span className="w-2 h-2 rounded-full bg-[#252832]" />
                  </div>
                  <span className="text-[#6B7280] uppercase tracking-wider">{project.categoryLabel}</span>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#E53935] transition-colors">
                      {lang === 'th' && project.title_th ? project.title_th : project.title}
                    </h3>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4 line-clamp-3">
                      {lang === 'th' && project.description_th ? project.description_th : project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded bg-[#0D0E12] border border-[#252832] text-[10px] font-mono text-[#9CA3AF]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#252832] flex items-center justify-between font-mono text-xs">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="text-[#9CA3AF] hover:text-white transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Architecture</span>
                      <ChevronRight size={13} />
                    </button>

                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#E53935] hover:text-white transition-colors inline-flex items-center gap-1 font-bold"
                      >
                        <span>Live Demo</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-[#6B7280] text-[11px]">Production Code</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 06 — CASE STUDY / ARCHITECTURE BREAKDOWN ================= */}
      <section id="architecture" className="py-20 sm:py-28 border-b border-[#252832]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-14 pb-6 border-b border-[#252832]">
            <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-2">[ ARCHITECTURE IN PRACTICE ]</span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              Engineering Case Study
            </h2>
            <p className="text-sm text-[#9CA3AF] mt-2 font-mono">
              REAL-TIME IOT TELEMETRY & COMMAND DASHBOARD SYSTEM
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Problem & Solution Matrix */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="tech-card p-6 rounded">
                <div className="flex items-center gap-2 font-mono text-xs text-[#E53935] mb-2 uppercase font-bold">
                  <span>[ 01 THE PROBLEM ]</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">ข้อจำกัดของระบบมอนิเตอร์แบบเดิม</h4>
                <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                  ผู้ประกอบการต้องการตรวจวัดอุณหภูมิและความชื้นในพื้นที่ควบคุมแบบเรียลไทม์ 24/7 แต่ระบบนำเข้าจากต่างประเทศมีค่าใช้จ่ายเซิร์ฟเวอร์และค่าธรรมเนียมรายเดือนสูง อีกทั้งไม่สามารถเชื่อมต่อกับหน้าเว็บภายในของบริษัทได้
                </p>
              </div>

              <div className="tech-card p-6 rounded">
                <div className="flex items-center gap-2 font-mono text-xs text-white mb-2 uppercase font-bold">
                  <span className="text-[#E53935]">•</span>
                  <span>[ 02 THE ENGINEERING SOLUTION ]</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">สถาปัตยกรรม Microcontroller + Cloud API</h4>
                <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                  เราออกแบบกล่องฮาร์ดแวร์ ESP32 ทำงานร่วมกับเซนเซอร์ I2C ปล่อยข้อมูลผ่านโปรโตคอล MQTT ด้วยความถี่ทุก 5 วินาที เข้าสู่ Node.js API Service เพื่อบันทึกข้อมูลย้อนหลัง และส่งสัญญาณ WebSockets เข้าสู่ Web Application บน Next.js แบบไร้ความหน่วง
                </p>
              </div>

              <div className="tech-card p-6 rounded">
                <div className="flex items-center gap-2 font-mono text-xs text-[#9CA3AF] mb-2 uppercase font-bold">
                  <span className="text-[#E53935]">✓</span>
                  <span>[ 03 THE RESULT ]</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">เสถียรภาพสูง ประหยัดค่าใช้จ่ายระยะยาว</h4>
                <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                  ระบบทำงานต่อเนื่อง มีการแจ้งเตือนทันทีเมื่อค่าเกินเกณฑ์ผ่าน LINE API และบันทึก Log ไว้วิเคราะห์ข้อมูลย้อนหลัง โดยไม่ต้องเสียค่า License ซอฟต์แวร์รายเดือน
                </p>
              </div>

            </div>

            {/* Right: Technical Specifications Box */}
            <div className="lg:col-span-5 tech-card p-6 sm:p-8 rounded flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#252832] font-mono text-xs">
                  <span className="text-white font-bold">STACK SPECIFICATION</span>
                  <span className="text-[#E53935]">VERIFIED</span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <span className="text-[#6B7280] block text-[10px]">MICROCONTROLLER</span>
                    <span className="text-white font-bold">ESP32 Dual-Core 240MHz Wi-Fi/BLE</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block text-[10px]">SENSORS</span>
                    <span className="text-white font-bold">BME280 Digital Temp/Humidity/Pressure</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block text-[10px]">MESSAGING PROTOCOL</span>
                    <span className="text-white font-bold">MQTT over TLS 1.3 / QoS Level 1</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block text-[10px]">BACKEND SERVICE</span>
                    <span className="text-white font-bold">Node.js Express + WebSocket Server</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block text-[10px]">CLIENT FRONTEND</span>
                    <span className="text-white font-bold">Next.js 16 + Tailwind CSS Dashboard</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#252832] font-mono text-xs text-[#9CA3AF]">
                <span>NEED A SIMILAR SYSTEM?</span>
                <a href="#contact" className="text-[#E53935] hover:text-white font-bold block mt-1">
                  REQUEST SYSTEM ARCHITECTURE PROPOSAL →
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 07 — TECHNOLOGY MATRIX ================= */}
      <section id="technology" className="py-20 sm:py-28 border-b border-[#252832] bg-[#0D0E12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-14 pb-6 border-b border-[#252832]">
            <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-2">[ TECHNICAL STACK ]</span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              Technology Matrix
            </h2>
            <p className="text-xs font-mono text-[#9CA3AF] mt-2">
              DISCIPLINED TOOLCHAIN FOR PRODUCTION RELIABILITY
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
            
            {/* Web */}
            <div className="p-5 rounded border border-[#252832] bg-[#111318]">
              <div className="text-[#E53935] text-xs font-bold mb-3 uppercase tracking-wider">01 // WEB FRONTEND</div>
              <ul className="space-y-1.5 text-xs text-[#9CA3AF]">
                <li className="text-white font-bold">Next.js / React</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>HTML5 Canvas</li>
                <li>Responsive UI/UX</li>
              </ul>
            </div>

            {/* Backend */}
            <div className="p-5 rounded border border-[#252832] bg-[#111318]">
              <div className="text-[#E53935] text-xs font-bold mb-3 uppercase tracking-wider">02 // BACKEND & API</div>
              <ul className="space-y-1.5 text-xs text-[#9CA3AF]">
                <li className="text-white font-bold">Node.js / Express</li>
                <li>RESTful API Architecture</li>
                <li>Python Scripts</li>
                <li>WebSockets Engine</li>
                <li>Auth & JWT Security</li>
              </ul>
            </div>

            {/* Database */}
            <div className="p-5 rounded border border-[#252832] bg-[#111318]">
              <div className="text-[#E53935] text-xs font-bold mb-3 uppercase tracking-wider">03 // DATABASE</div>
              <ul className="space-y-1.5 text-xs text-[#9CA3AF]">
                <li className="text-white font-bold">PostgreSQL</li>
                <li>MySQL / MariaDB</li>
                <li>MongoDB</li>
                <li>Google Sheets API</li>
                <li>Redis Cache</li>
              </ul>
            </div>

            {/* IoT & Hardware */}
            <div className="p-5 rounded border border-[#252832] bg-[#111318]">
              <div className="text-[#E53935] text-xs font-bold mb-3 uppercase tracking-wider">04 // IoT & FIRMWARE</div>
              <ul className="space-y-1.5 text-xs text-[#9CA3AF]">
                <li className="text-white font-bold">ESP32 / ESP8266</li>
                <li>Arduino C/C++</li>
                <li>MQTT Protocol</li>
                <li>Digital & Analog Sensors</li>
                <li>Relay Actuation</li>
              </ul>
            </div>

            {/* Cloud & DevOps */}
            <div className="p-5 rounded border border-[#252832] bg-[#111318]">
              <div className="text-[#E53935] text-xs font-bold mb-3 uppercase tracking-wider">05 // CLOUD & OPS</div>
              <ul className="space-y-1.5 text-xs text-[#9CA3AF]">
                <li className="text-white font-bold">Vercel Edge Platform</li>
                <li>Google Cloud Platform</li>
                <li>GitHub CI/CD</li>
                <li>Linux VPS</li>
                <li>DNS & SSL Config</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 08 — HOW WE WORK ================= */}
      <section id="workflow" className="py-20 sm:py-28 border-b border-[#252832]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-14 pb-6 border-b border-[#252832]">
            <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-2">[ ENGINEERING PROCESS ]</span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              How We Work
            </h2>
            <p className="text-xs font-mono text-[#9CA3AF] mt-2">
              TRANSPARENT 6-PHASE SYSTEM DELIVERY
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { num: '01', title: 'Discover', desc: 'ทำความเข้าใจปัญหา Requirement และเป้าหมายทางธุรกิจจริง' },
              { num: '02', title: 'Plan', desc: 'วาง Architecture, โครงสร้างฐานข้อมูล และ Milestone ส่งมอบ' },
              { num: '03', title: 'Design', desc: 'ออกแบบ User Flow, Data Flow และ Interface ให้ใช้งานง่าย' },
              { num: '04', title: 'Develop', desc: 'พัฒนาโค้ดตามมาตรฐาน Clean Code และทดสอบทุก Component' },
              { num: '05', title: 'Test', desc: 'ทดสอบ End-to-End, Stress Test และความปลอดภัยก่อนขึ้นจริง' },
              { num: '06', title: 'Deploy', desc: 'นำระบบขึ้น Production จริง พร้อมคู่มือและดูแลระบบต่อเนื่อง' },
            ].map((step) => (
              <div key={step.num} className="tech-card p-5 rounded flex flex-col justify-between">
                <div>
                  <div className="text-sm font-mono font-bold text-[#E53935] mb-2">{step.num}</div>
                  <h4 className="font-bold text-white text-base mb-2">{step.title}</h4>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">{step.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-[#252832] flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
                  <span>PHASE {step.num}</span>
                  <Check size={12} className="text-[#E53935]" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 09 — ABOUT ================= */}
      <section id="about" className="py-20 sm:py-28 border-b border-[#252832] bg-[#0D0E12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5">
              <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-2">[ STUDIO NARRATIVE ]</span>
              <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white leading-tight mb-6">
                "We don't just build websites. <br />
                <span className="text-[#9CA3AF]">We build systems that solve real problems."</span>
              </h2>
              <div className="p-4 rounded border border-[#252832] bg-[#111318] font-mono text-xs text-[#9CA3AF] space-y-1">
                <div>LOCATION: Bangkok, Thailand</div>
                <div>FOCUS: Web Applications & IoT Engineering</div>
                <div>PHILOSOPHY: Practical, Fast, Scalable, Reliable</div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-sm text-[#9CA3AF] leading-relaxed">
              <p>
                {lang === 'th' ? (
                  'DeeDevIOT ก่อตั้งขึ้นจากความมุ่งมั่นในการผสานสองโลกเข้าด้วยกัน ระหว่างซอฟต์แวร์เว็บแอปพลิเคชันที่มีความยืดหยุ่นสูง และฮาร์ดแวร์ IoT ที่สื่อสารกับโลกกายภาพจริง เราเชื่อว่าเทคโนโลยีที่ดีที่สุดไม่ใช่เทคโนโลยีที่ซับซ้อนเกินจำเป็น แต่เป็นเทคโนโลยีที่แก้ปัญหาของผู้ใช้งานได้อย่างตรงจุดและเสถียรที่สุด'
                ) : (
                  'DeeDevIOT bridges digital web software and physical IoT engineering. We focus on pragmatic, high-reliability systems built to solve operational bottlenecks without unnecessary bloat or complex dependencies.'
                )}
              </p>
              <p>
                {lang === 'th' ? (
                  'ไม่ว่าคุณจะเป็นธุรกิจ SME ที่ต้องการเปลี่ยนกระบวนการทำงานจากกระดาษเป็น Web Application ภายในองค์กร หรือต้องการระบบเซนเซอร์แจ้งเตือนอัตโนมัติ เราพร้อมเป็นพาร์ทเนอร์ทางเทคนิคที่ให้คำปรึกษาอย่างจริงใจและลงมือพัฒนาจนใช้งานได้จริง'
                ) : (
                  'Whether transforming manual spreadsheets into automated business web portals, or engineering sensor firmware reporting to real-time dashboards, our focus is clean implementation and verifiable delivery.'
                )}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[#252832] font-mono text-xs">
                <div>
                  <div className="text-white font-bold mb-1">REAL DATA FLOW</div>
                  <div className="text-[#6B7280] text-[11px]">No simulated fluff</div>
                </div>
                <div>
                  <div className="text-white font-bold mb-1">PRODUCTION CODE</div>
                  <div className="text-[#6B7280] text-[11px]">Clean & maintainable</div>
                </div>
                <div>
                  <div className="text-white font-bold mb-1">DIRECT CONTACT</div>
                  <div className="text-[#6B7280] text-[11px]">Talk to actual devs</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 10 — CTA ================= */}
      <section className="py-20 sm:py-28 border-b border-[#252832] bg-tech-grid">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-3">
            [ START A CONVERSATION ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-4">
            Have an idea? <br />
            Let's build something useful.
          </h2>
          
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed font-light">
            {lang === 'th'
              ? 'ไม่ว่าคุณจะมีโจทย์โปรเจกต์ที่ชัดเจนแล้ว หรือต้องการปรึกษาความเป็นไปได้ทางเทคนิคและการประเมินงบประมาณ ทักมาพูดคุยกับเราได้โดยไม่มีค่าใช้จ่าย'
              : 'Whether you have an immediate technical specification ready or need exploratory architecture advice, we are ready to discuss.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`mailto:${configData.contact_email || 'hello@deedeviot.com'}`}
              className="w-full sm:w-auto px-8 py-4 bg-[#E53935] text-white hover:bg-[#c62828] font-mono text-xs uppercase tracking-wider font-bold rounded transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#E53935]/20"
            >
              <Mail size={15} />
              <span>{lang === 'th' ? 'ส่งอีเมลปรึกษาเรา' : 'Email Us Directly'}</span>
            </a>

            <a
              href={`https://line.me/ti/p/~${(configData.contact_line || '@DEEDEVIOT').replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#111318] text-white border border-[#252832] hover:border-white font-mono text-xs uppercase tracking-wider font-semibold rounded transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={15} className="text-[#E53935]" />
              <span>LINE: {configData.contact_line || '@DEEDEVIOT'}</span>
            </a>
          </div>

        </div>
      </section>

      {/* ================= 11 — FOOTER & CONTACT ================= */}
      <footer id="contact" className="py-16 bg-[#08090D] border-t border-[#252832]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#252832]">
            
            {/* Brand Col */}
            <div>
              <div className="flex items-center gap-2.5 font-mono text-sm tracking-wider font-bold mb-4">
                <span className="w-2 h-2 rounded-full bg-[#E53935]" />
                <span className="text-white">DEEDEV</span>
                <span className="text-[#6B7280]">/</span>
                <span className="text-[#9CA3AF]">IOT</span>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4">
                Turn Ideas Into Real Digital Solutions. Modern Web Applications and Connected IoT Systems.
              </p>
              <div className="font-mono text-[11px] text-[#6B7280]">
                STUDIO STATUS: ACTIVE
              </div>
            </div>

            {/* Direct Contact */}
            <div>
              <h4 className="font-mono text-xs uppercase text-white font-bold mb-4 tracking-wider">DIRECT CONTACT</h4>
              <div className="space-y-2.5 font-mono text-xs text-[#9CA3AF]">
                <div>
                  <span className="text-[#6B7280] block text-[10px]">EMAIL</span>
                  <a href={`mailto:${configData.contact_email || 'hello@deedeviot.com'}`} className="hover:text-white transition-colors">
                    {configData.contact_email || 'hello@deedeviot.com'}
                  </a>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px]">PHONE</span>
                  <a href={`tel:${configData.contact_phone || '02-123-4567'}`} className="hover:text-white transition-colors">
                    {configData.contact_phone || '02-123-4567'}
                  </a>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px]">LINE OFFICIAL</span>
                  <span className="text-white font-bold">{configData.contact_line || '@DEEDEVIOT'}</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div>
              <h4 className="font-mono text-xs uppercase text-white font-bold mb-4 tracking-wider">INDEX</h4>
              <div className="space-y-2 font-mono text-xs text-[#9CA3AF]">
                <div><a href="#services" className="hover:text-white transition-colors">01. Services</a></div>
                <div><a href="#works" className="hover:text-white transition-colors">02. Works & Projects</a></div>
                <div><a href="#architecture" className="hover:text-white transition-colors">03. Architecture</a></div>
                <div><a href="#technology" className="hover:text-white transition-colors">04. Technology Matrix</a></div>
                <div><a href="#workflow" className="hover:text-white transition-colors">05. Workflow Timeline</a></div>
                <div><a href="#about" className="hover:text-white transition-colors">06. About Us</a></div>
              </div>
            </div>

            {/* Social & Verification */}
            <div>
              <h4 className="font-mono text-xs uppercase text-white font-bold mb-4 tracking-wider">CONNECT</h4>
              <div className="space-y-2 font-mono text-xs text-[#9CA3AF]">
                <a
                  href={configData.facebook_url || "https://facebook.com/deedeviot"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Facebook size={14} className="text-[#E53935]" />
                  <span>{configData.contact_facebook_en || 'Facebook: DeeDevIOT'}</span>
                </a>
                <a
                  href={`https://line.me/ti/p/~${(configData.contact_line || '@DEEDEVIOT').replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MessageCircle size={14} className="text-[#E53935]" />
                  <span>LINE: {configData.contact_line || '@DEEDEVIOT'}</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#6B7280]">
            <div>
              © 2026 DEEDEV IOT. TURN IDEAS INTO REAL DIGITAL SOLUTIONS.
            </div>
            
            <div className="flex items-center gap-4">
              <span>HUMAN-ENGINEERED WITH PRECISION</span>
              <Link 
                href="/login" 
                className="p-1.5 text-[#6B7280] hover:text-[#E53935] hover:bg-[#111318] rounded transition-colors"
                title="Admin Management"
                aria-label="Admin Login"
              >
                <Lock size={13} />
              </Link>
            </div>
          </div>

        </div>
      </footer>

      {/* ================= PROJECT ARCHITECTURE MODAL ================= */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#08090D]/85 backdrop-blur-sm">
          <div 
            className="w-full max-w-2xl bg-[#111318] border border-[#252832] rounded-lg shadow-2xl p-6 sm:p-8 relative"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#252832] mb-6">
              <div>
                <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-1">
                  [ {activeModalProject.categoryLabel} ]
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {lang === 'th' && activeModalProject.title_th ? activeModalProject.title_th : activeModalProject.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalProject(null)}
                className="p-1.5 text-[#9CA3AF] hover:text-white rounded border border-[#252832] hover:bg-[#252832] transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-[#9CA3AF] leading-relaxed mb-6">
              {lang === 'th' && activeModalProject.description_th ? activeModalProject.description_th : activeModalProject.description}
            </p>

            {/* Architecture Highlights */}
            {activeModalProject.architecture && (
              <div className="mb-6 p-4 rounded bg-[#0D0E12] border border-[#252832]">
                <div className="font-mono text-xs text-white font-bold uppercase mb-2">SYSTEM ARCHITECTURE BREAKDOWN:</div>
                <ul className="space-y-1.5 font-mono text-xs text-[#9CA3AF]">
                  {activeModalProject.architecture.map((arch, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-[#E53935]">→</span>
                      <span>{arch}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Badges */}
            <div className="mb-8">
              <span className="font-mono text-[11px] text-[#6B7280] block mb-2 uppercase">TECHNOLOGY STACK:</span>
              <div className="flex flex-wrap gap-2">
                {activeModalProject.tech.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded bg-[#0D0E12] border border-[#252832] text-xs font-mono text-[#9CA3AF]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#252832] flex items-center justify-between">
              <button
                onClick={() => setActiveModalProject(null)}
                className="px-4 py-2 border border-[#252832] text-xs font-mono text-[#9CA3AF] hover:text-white rounded"
              >
                Close Window
              </button>

              {activeModalProject.demoUrl && (
                <a
                  href={activeModalProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-[#E53935] hover:bg-[#c62828] text-white text-xs font-mono font-bold rounded inline-flex items-center gap-1.5"
                >
                  <span>Open Live Demo</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
