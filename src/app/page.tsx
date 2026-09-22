"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Server, Cpu, Wifi, Globe, ArrowRight, ExternalLink,
  Database, Phone, Mail, MessageCircle,
  X, Menu, Lock, Activity, ArrowDown, Power,
  Clock, CheckCircle2, ChevronRight, Layers, Sliders, RefreshCw,
  Sparkles, ShieldCheck, Check, Radio, Gauge, Zap,
  FileText, BookOpen
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

interface ProjectItem {
  id: string;
  name: string;
  category: string;
  categoryKey: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  demoUrl?: string; // Content link / Live demo
  manualUrl?: string; // Documentation / Manual link
  videoUrls?: string[];
  architectureDetails: string[];
  sourceType: 'portfolio' | 'service';
}

interface IoTDeviceState {
  id: string;
  name: string;
  locationName: string;
  hardwareModel: string;
  connectionStatus: 'Online' | 'Offline' | 'Warning';
  relayStatus: boolean;
  temperatureCelsius: number;
  humidityPercentage: number;
  wifiSignalDbm: number;
  connectionLatencyMs: number | null;
  lastSeenTimestamp: string;
  telemetryHistory: { time: string; temp: number; humidity: number; latency: number }[];
}

interface DeviceTelemetryEvent {
  eventId: string;
  timestamp: string;
  deviceName: string;
  eventDescription: string;
  severity: 'info' | 'warning' | 'normal';
}

interface ConceptItem {
  id: string;
  title_en: string;
  title_th: string;
  desc_en: string;
  desc_th: string;
  icon: string;
}

const DEFAULT_CONCEPTS: ConceptItem[] = [
  {
    id: 'stability',
    title_th: 'Industrial Stability',
    title_en: 'Industrial Grade Stability',
    desc_th: 'ออกแบบฮาร์ดแวร์และเฟิร์มแวร์เน้นความทนทาน ทำงานต่อเนื่อง 24/7 พร้อมระบบ Watchdog ป้องกันค้าง',
    desc_en: 'Built with hardware watchdog timers, isolated power relays, and noise immunity for 24/7 non-stop operations.',
    icon: 'ShieldCheck'
  },
  {
    id: 'cloud',
    title_th: 'Sub-second Cloud Sync',
    title_en: 'Real-time Telemetry Delivery',
    desc_th: 'ส่งข้อมูลสดสู่ Cloud Platform ด้วยโปรโตคอล MQTT / WebSockets ตอบสนองทันทีแบบ Real-time',
    desc_en: 'Real-time telemetry and command delivery using lightweight, ultra-low-latency protocols.',
    icon: 'Zap'
  },
  {
    id: 'security',
    title_th: 'Enterprise Security',
    title_en: 'Data Security & Privacy',
    desc_th: 'เข้ารหัสข้อมูลตั้งแต่ระดับ Microcontroller ป้องกันการดักจับ และจัดเก็บฐานข้อมูลแยกเป็นสัดส่วน',
    desc_en: 'End-to-end payload encryption and secure token authentication at every network layer.',
    icon: 'Lock'
  },
  {
    id: 'custom',
    title_th: '100% Tailor-made',
    title_en: 'Customized to Your Business',
    desc_th: 'พัฒนาตามขั้นตอนธุรกิจจริงของท่าน ไม่ยึดติดกับแพ็กเกจสำเร็จรูป พร้อมต่อยอดสู่ LINE OA และ ERP',
    desc_en: 'Fully adapted to your business SOP, seamless integration with LINE OA, Google Sheets, or internal ERP.',
    icon: 'Cpu'
  }
];

const INITIAL_IOT_DEVICES: IoTDeviceState[] = [
  {
    id: 'conference-room',
    name: 'ห้องประชุม',
    locationName: 'ห้องประชุมใหญ่ ชั้น 1',
    hardwareModel: 'ESP32-C3 Smart Switch v2',
    connectionStatus: 'Online',
    relayStatus: true,
    temperatureCelsius: 24.8,
    humidityPercentage: 58,
    wifiSignalDbm: -63,
    connectionLatencyMs: 42,
    lastSeenTimestamp: '10:01:43',
    telemetryHistory: [
      { time: '09:41', temp: 24.2, humidity: 55, latency: 40 },
      { time: '09:43', temp: 24.4, humidity: 57, latency: 45 },
      { time: '09:47', temp: 24.6, humidity: 58, latency: 43 },
      { time: '09:48', temp: 24.7, humidity: 59, latency: 41 },
      { time: '09:52', temp: 24.9, humidity: 58, latency: 44 },
      { time: '10:01', temp: 24.8, humidity: 58, latency: 42 }
    ]
  },
  {
    id: 'server-room',
    name: 'ห้อง Server',
    locationName: 'ศูนย์ปฏิบัติการข้อมูล ชั้น 2',
    hardwareModel: 'ESP32-C3 Environmental Unit',
    connectionStatus: 'Online',
    relayStatus: false,
    temperatureCelsius: 22.4,
    humidityPercentage: 52,
    wifiSignalDbm: -58,
    connectionLatencyMs: 38,
    lastSeenTimestamp: '10:01:25',
    telemetryHistory: [
      { time: '09:41', temp: 22.1, humidity: 51, latency: 36 },
      { time: '09:43', temp: 22.2, humidity: 52, latency: 37 },
      { time: '09:47', temp: 22.3, humidity: 52, latency: 39 },
      { time: '09:48', temp: 22.4, humidity: 53, latency: 38 },
      { time: '09:52', temp: 22.3, humidity: 52, latency: 37 },
      { time: '10:01', temp: 22.4, humidity: 52, latency: 38 }
    ]
  },
  {
    id: 'office-room',
    name: 'ห้องทำงาน',
    locationName: 'โซนวิศวกรรมและพัฒนา',
    hardwareModel: 'ESP32-C3 Node Controller',
    connectionStatus: 'Offline',
    relayStatus: false,
    temperatureCelsius: 24.3,
    humidityPercentage: 56,
    wifiSignalDbm: -76,
    connectionLatencyMs: null,
    lastSeenTimestamp: '09:48:12 (8 นาทีที่แล้ว)',
    telemetryHistory: [
      { time: '09:41', temp: 24.1, humidity: 54, latency: 85 },
      { time: '09:43', temp: 24.2, humidity: 55, latency: 112 },
      { time: '09:47', temp: 24.3, humidity: 56, latency: 195 },
      { time: '09:48', temp: 24.3, humidity: 56, latency: 250 },
      { time: '09:52', temp: 24.3, humidity: 56, latency: 0 },
      { time: '10:01', temp: 24.3, humidity: 56, latency: 0 }
    ]
  },
  {
    id: 'storefront-lighting',
    name: 'ระบบไฟหน้าร้าน',
    locationName: 'พื้นที่จัดแสดงสินค้าและป้ายหน้าร้าน',
    hardwareModel: 'ESP32-C3 Quad Relay Box',
    connectionStatus: 'Online',
    relayStatus: true,
    temperatureCelsius: 26.2,
    humidityPercentage: 62,
    wifiSignalDbm: -67,
    connectionLatencyMs: 51,
    lastSeenTimestamp: '10:01:10',
    telemetryHistory: [
      { time: '09:41', temp: 25.8, humidity: 60, latency: 48 },
      { time: '09:43', temp: 25.9, humidity: 61, latency: 52 },
      { time: '09:47', temp: 26.0, humidity: 62, latency: 50 },
      { time: '09:48', temp: 26.1, humidity: 63, latency: 53 },
      { time: '09:52', temp: 26.3, humidity: 62, latency: 49 },
      { time: '10:01', temp: 26.2, humidity: 62, latency: 51 }
    ]
  }
];

const INITIAL_TELEMETRY_LOGS: DeviceTelemetryEvent[] = [
  { eventId: 'evt-1', timestamp: '10:01', deviceName: 'ห้อง Server', eventDescription: 'Telemetry Ping สำเร็จ (Latency 38ms, อุณหภูมิ 22.4°C)', severity: 'normal' },
  { eventId: 'evt-2', timestamp: '09:52', deviceName: 'ห้องประชุม', eventDescription: 'ส่งข้อมูลสถานะสำเร็จ (อุณหภูมิ 24.8°C, รีเลย์: เปิด)', severity: 'normal' },
  { eventId: 'evt-3', timestamp: '09:48', deviceName: 'ห้องทำงาน', eventDescription: 'Heartbeat ขาดหาย เข้าสู่สถานะ Offline (Last seen: 8 นาทีที่แล้ว)', severity: 'warning' },
  { eventId: 'evt-4', timestamp: '09:47', deviceName: 'ระบบไฟหน้าร้าน', eventDescription: 'คำสั่ง Relay ON ทำงานตามคำสั่งควบคุม', severity: 'info' },
  { eventId: 'evt-5', timestamp: '09:43', deviceName: 'ห้อง Server', eventDescription: 'ระบบปรับอากาศทำงานปกติ การระบายความร้อนสมบูรณ์', severity: 'normal' },
  { eventId: 'evt-6', timestamp: '09:41', deviceName: 'ระบบไฟหน้าร้าน', eventDescription: 'บอร์ด ESP32-C3 เชื่อมต่อ Wi-Fi และ Sync เวลา NTP สำเร็จ', severity: 'info' }
];

export default function DeeDevIOTWebsite() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);
  const [selectedWorkCategory, setSelectedWorkCategory] = useState<string>('all');
  const [cmsServices, setCmsServices] = useState<any[]>([]);
  const [cmsIntegrations, setCmsIntegrations] = useState<any[]>([]);
  const [cmsConcepts, setCmsConcepts] = useState<ConceptItem[]>(DEFAULT_CONCEPTS);
  const [siteConfig, setSiteConfig] = useState<any>({});

  const [iotDevices, setIotDevices] = useState<IoTDeviceState[]>(INITIAL_IOT_DEVICES);
  const [selectedDashboardDeviceId, setSelectedDashboardDeviceId] = useState<string>('conference-room');
  const [telemetryLogs, setTelemetryLogs] = useState<DeviceTelemetryEvent[]>(INITIAL_TELEMETRY_LOGS);

  useEffect(() => {
    setIsClientMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen || activeProjectModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen, activeProjectModal]);

  useEffect(() => {
    const fetchCmsData = async () => {
      try {
        const [servicesRes, integrationsRes, configRes, conceptsRes] = await Promise.all([
          fetch('/api/services', { cache: 'no-store' }),
          fetch('/api/integrations', { cache: 'no-store' }),
          fetch('/api/config', { cache: 'no-store' }),
          fetch('/api/concept', { cache: 'no-store' })
        ]);
        const [servicesData, integrationsData, configData, conceptsData] = await Promise.all([
          servicesRes.json(),
          integrationsRes.json(),
          configRes.json(),
          conceptsRes.json()
        ]);
        if (servicesData.success && Array.isArray(servicesData.data)) {
          setCmsServices(servicesData.data);
        }
        if (integrationsData.success && Array.isArray(integrationsData.data)) {
          setCmsIntegrations(integrationsData.data);
        }
        if (configData.success && configData.data) {
          setSiteConfig(configData.data);
        }
        if (conceptsData.success && Array.isArray(conceptsData.data) && conceptsData.data.length > 0) {
          setCmsConcepts(conceptsData.data);
        }
      } catch {
        // Fallback maintained
      }
    };
    fetchCmsData();
  }, []);

  const handleToggleRelay = (deviceId: string) => {
    setIotDevices(prevDevices =>
      prevDevices.map(dev => {
        if (dev.id === deviceId) {
          const nextState = !dev.relayStatus;
          const currentTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
          
          setTelemetryLogs(prevLogs => [
            {
              eventId: `evt-${Date.now()}`,
              timestamp: currentTime,
              deviceName: dev.name,
              eventDescription: `ผู้ใช้งานกดสลับสถานะ Relay เป็น ${nextState ? 'เปิด (ON)' : 'ปิด (OFF)'}`,
              severity: 'info'
            },
            ...prevLogs.slice(0, 5)
          ]);

          return {
            ...dev,
            relayStatus: nextState,
            lastSeenTimestamp: 'เมื่อสักครู่'
          };
        }
        return dev;
      })
    );
  };

  // Only real projects and services from Google Sheets CMS (zero mock items)
  const allProjects: ProjectItem[] = [
    ...cmsIntegrations.map((item, idx) => ({
      id: item.id || `portfolio-${idx}`,
      name: item.title_th || item.title || 'โปรเจกต์ระบบ',
      category: item.tag || 'Portfolio',
      categoryKey: (item.tag || 'portfolio').trim().toLowerCase(),
      description: item.description_th || item.description || 'ระบบเชื่อมต่อและพัฒนาเฉพาะทางสำหรับธุรกิจ',
      technologies: item.tag ? [item.tag, 'System Architecture', 'Integration'] : ['Full-Stack Solution'],
      imageUrl: item.imageUrl || '',
      demoUrl: item.referenceUrl || undefined,
      manualUrl: item.manualUrl || undefined,
      architectureDetails: [
        'ออกแบบสถาปัตยกรรมระบบตามข้อกำหนดของธุรกิจ',
        'โครงสร้างระบบปลอดภัย รองรับการขยายและเชื่อมต่อ API'
      ],
      sourceType: 'portfolio' as const
    })),
    ...cmsServices.map((cmsItem, idx) => ({
      id: cmsItem.id || `service-${idx}`,
      name: cmsItem.title_th || cmsItem.title || 'บริการโซลูชัน',
      category: cmsItem.icon || 'Service Solution',
      categoryKey: (cmsItem.icon || 'service').trim().toLowerCase(),
      description: cmsItem.description_th || cmsItem.description || '',
      technologies: ['Custom Solution', 'Production Architecture', 'Integration'],
      imageUrl: cmsItem.imageUrl || '',
      demoUrl: cmsItem.demoUrl || undefined,
      manualUrl: cmsItem.manualUrl || undefined,
      videoUrls: cmsItem.videoUrls ? cmsItem.videoUrls.split(',').map((v: string) => v.trim()).filter(Boolean) : undefined,
      architectureDetails: ['ออกแบบและพัฒนาเฉพาะสำหรับโจทย์ทางธุรกิจและองค์กร'],
      sourceType: 'service' as const
    }))
  ];

  // Dynamic categories from real project items
  const availableCategories = Array.from(
    new Set(allProjects.map(p => p.category).filter(Boolean))
  );

  const filteredProjects = selectedWorkCategory === 'all'
    ? allProjects
    : allProjects.filter(item => 
        item.category.toLowerCase() === selectedWorkCategory.toLowerCase() ||
        item.categoryKey === selectedWorkCategory.toLowerCase()
      );

  const selectedDevice = iotDevices.find(d => d.id === selectedDashboardDeviceId) || iotDevices[0];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] selection:bg-[#E11D48]/20 selection:text-[#E11D48] font-sans antialiased relative">
      
      {/* Light Tech Grid Background */}
      <div className="fixed inset-0 bg-tech-grid-light opacity-60 pointer-events-none z-0" />

      {/* ================= 04.A NAVIGATION (Bright, Clean, Crisp Glass) ================= */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-300 py-3.5 shadow-sm' 
          : 'bg-white/80 backdrop-blur-xs border-b border-slate-200/80 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-2.5 group focus:outline-none">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border-2 border-slate-200/90 bg-white shadow-2xs flex items-center justify-center p-0.5 group-hover:border-[#E11D48] transition-colors shrink-0">
              <img src="/logo.jpg" alt="DeeDevIoT Logo" className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform" />
            </div>
            <div className="font-mono text-base tracking-wider font-bold flex items-center">
              <span className="text-slate-950 group-hover:text-[#E11D48] transition-colors font-black">DEEDEV</span>
              <span className="text-[#EA580C] mx-0.5 font-black">/</span>
              <span className="bg-gradient-to-r from-[#E11D48] to-[#EA580C] bg-clip-text text-transparent font-extrabold">IOT</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-mono tracking-wider font-bold text-slate-800">
            <a href="#hero" className="hover:text-[#E11D48] transition-colors py-1">Home</a>
            <a href="#works" className="hover:text-[#E11D48] transition-colors py-1">Works</a>
            <a href="#services" className="hover:text-[#0284C7] transition-colors py-1">Services</a>
            <a href="#solutions" className="hover:text-[#059669] transition-colors flex items-center gap-1.5 py-1">
              <span>Solutions</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </a>
            <a href="#contact" className="hover:text-[#EA580C] transition-colors py-1">Contact</a>
            <a href="#about" className="hover:text-purple-600 transition-colors py-1">About</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold tracking-wider bg-gradient-to-r from-[#E11D48] via-[#EA580C] to-[#D97706] hover:brightness-105 text-white rounded-xl transition-all shadow-sm hover:shadow-rose-500/20"
            >
              <span>ปรึกษาโปรเจกต์</span>
              <ArrowRight size={13} className="text-white" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 min-w-[44px] min-h-[44px] rounded-xl border-2 border-slate-200 bg-white text-slate-800 hover:text-slate-950 shadow-xs flex items-center justify-center touch-target"
              aria-label="เมนูหลัก"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-white/98 backdrop-blur-xl pt-20 px-5 sm:px-6 pb-8 flex flex-col justify-between overflow-y-auto overscroll-contain safe-area-bottom">
          <div>
            <div className="flex items-center gap-2.5 pb-4 mb-3 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-white p-0.5 shadow-2xs shrink-0">
                <img src="/logo.jpg" alt="DeeDevIoT" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="font-mono text-base tracking-wider font-bold flex items-center">
                <span className="text-slate-950 font-black">DEEDEV</span>
                <span className="text-[#EA580C] mx-0.5 font-black">/</span>
                <span className="bg-gradient-to-r from-[#E11D48] to-[#EA580C] bg-clip-text text-transparent font-extrabold">IOT</span>
              </div>
            </div>

            <nav className="flex flex-col space-y-2 font-mono text-sm tracking-wider text-slate-800">
              <a 
                href="#hero" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-3 px-3.5 min-h-[46px] rounded-xl border-2 border-slate-200 bg-slate-50/60 hover:bg-slate-100 flex items-center justify-between font-bold"
              >
                <span>หน้าแรก (Home)</span>
                <ChevronRight size={16} className="text-slate-400" />
              </a>
              <a 
                href="#works" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-3 px-3.5 min-h-[46px] rounded-xl border-2 border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 flex items-center justify-between font-bold text-rose-950"
              >
                <span>ผลงานจริง (Works)</span>
                <ChevronRight size={16} className="text-rose-600" />
              </a>
              <a 
                href="#services" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-3 px-3.5 min-h-[46px] rounded-xl border-2 border-sky-200 bg-sky-50/50 hover:bg-sky-100/60 flex items-center justify-between font-bold text-sky-950"
              >
                <span>บริการที่รับทำ (Services)</span>
                <ChevronRight size={16} className="text-sky-600" />
              </a>
              <a 
                href="#solutions" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-3 px-3.5 min-h-[46px] rounded-xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 flex items-center justify-between font-bold text-emerald-950"
              >
                <div className="flex items-center gap-2">
                  <span>โซลูชัน & IoT Lab (Solutions)</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>
                </div>
                <ChevronRight size={16} className="text-emerald-600" />
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-3 px-3.5 min-h-[46px] rounded-xl border-2 border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 flex items-center justify-between font-bold text-amber-950"
              >
                <span>ช่องทางติดต่อ (Contact)</span>
                <ChevronRight size={16} className="text-amber-600" />
              </a>
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-3 px-3.5 min-h-[46px] rounded-xl border-2 border-purple-200 bg-purple-50/50 hover:bg-purple-100/60 flex items-center justify-between font-bold text-purple-950"
              >
                <span>เกี่ยวกับเรา (About)</span>
                <ChevronRight size={16} className="text-purple-600" />
              </a>
            </nav>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-4 min-h-[48px] bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#EA580C] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl flex items-center justify-center gap-2 shadow-md touch-target"
            >
              <span>ปรึกษาโปรเจกต์ฟรี</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      )}

      {/* ================= 01. HOME // HERO SECTION (Vibrant Aurora & High Contrast) ================= */}
      <section id="hero" className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 border-b border-slate-300/80 overflow-hidden bg-aurora-hero bg-circuit-dots">
        
        {/* Soft Ambient Aurora Halos */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-rose-200/50 via-orange-100/40 to-transparent blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/4 -right-32 w-[450px] h-[450px] bg-gradient-to-bl from-sky-200/50 to-blue-100/30 blur-[110px] pointer-events-none -z-10" />
        <div className="absolute top-2/3 -left-32 w-[450px] h-[450px] bg-gradient-to-tr from-emerald-200/50 to-teal-100/30 blur-[110px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border-2 border-slate-200 text-xs font-mono text-slate-800 flex items-center gap-2.5 shadow-xs max-w-full overflow-hidden truncate">
              <img src="/logo.jpg" alt="DeeDevIoT" className="w-5 h-5 rounded-full object-cover shadow-2xs border border-slate-200 shrink-0" />
              <span className="text-slate-950 font-extrabold tracking-wider shrink-0">DEEDEV IOT</span>
              <span className="text-slate-300 shrink-0">|</span>
              <span className="text-slate-700 font-semibold truncate">Connecting Devices. Developing Futures.</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7">
              <h1 className="text-[28px] xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.22] mb-5 sm:mb-6">
                มีไอเดีย แต่ยังไม่รู้จะทำ
                <span className="block mt-1 bg-gradient-to-r from-[#E11D48] via-[#EA580C] to-[#D97706] bg-clip-text text-transparent">
                  ระบบอย่างไร?
                </span>
              </h1>

              <h2 className="text-base sm:text-2xl font-bold text-slate-900 mb-4 leading-snug">
                DeeDevIOT ช่วยเปลี่ยนไอเดียของคุณให้กลายเป็น{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] via-[#059669] to-[#EA580C] font-extrabold">
                  Web Application, IoT และระบบ IT
                </span>{' '}
                ที่ใช้งานได้จริงโดยทีมงานคนไทย
              </h2>

              <p className="text-xs sm:text-base text-slate-700 max-w-2xl leading-relaxed mb-6 sm:mb-8 font-normal">
                ตั้งแต่การออกแบบระบบ พัฒนาโปรแกรม เชื่อมต่ออุปกรณ์ ไปจนถึงนำระบบไปใช้งานจริง สำหรับเจ้าของธุรกิจ SME โรงงาน และผู้ที่ต้องการลดงาน Manual ด้วยระบบดิจิทัล
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 mb-6 sm:mb-8">
                <a
                  href="#contact"
                  className="px-8 py-3.5 sm:py-4 min-h-[48px] bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#EA580C] hover:brightness-105 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(225,29,72,0.35)] hover:shadow-[0_6px_25px_rgba(225,29,72,0.45)] transform hover:-translate-y-0.5 touch-target"
                >
                  <Sparkles size={16} />
                  <span>ปรึกษาโปรเจกต์ฟรี</span>
                  <ArrowRight size={15} />
                </a>

                <a
                  href="#works"
                  className="px-8 py-3.5 sm:py-4 min-h-[48px] bg-white/95 backdrop-blur-md text-slate-900 border-2 border-slate-300 hover:border-slate-500 hover:text-slate-950 font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs transform hover:-translate-y-0.5 touch-target"
                >
                  <span>ดูผลงานจริง</span>
                  <ArrowDown size={14} className="text-[#0284C7]" />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono font-bold">
                <span className="flex items-center gap-1.5 text-emerald-900 bg-emerald-100/90 px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs">
                  <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                  <span>รับพัฒนาตามโจทย์จริง</span>
                </span>
                <span className="flex items-center gap-1.5 text-sky-900 bg-sky-100/90 px-3 py-1.5 rounded-lg border border-sky-300 shadow-2xs">
                  <CheckCircle2 size={14} className="text-sky-700 shrink-0" />
                  <span>ส่งมอบ Source Code 100%</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-950 bg-amber-100/90 px-3 py-1.5 rounded-lg border border-amber-300 shadow-2xs">
                  <CheckCircle2 size={14} className="text-amber-700 shrink-0" />
                  <span>ปรึกษาแนวทางเทคนิคฟรี</span>
                </span>
              </div>
            </div>

            {/* Right: Crisp Bright System Pipeline Card */}
            <div className="lg:col-span-5 bg-white/95 backdrop-blur-md border-2 border-slate-200/90 rounded-2xl p-6 shadow-md relative overflow-hidden">
              
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#059669] via-[#0284C7] to-[#E11D48]" />

              <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <Activity size={15} className="text-[#E11D48] animate-pulse" />
                  <span className="text-slate-950 font-extrabold tracking-wider">REAL SYSTEM PIPELINE</span>
                </div>
                <span className="text-sky-900 font-extrabold bg-sky-100 px-2.5 py-0.5 rounded border border-sky-300">
                  DATA FLOW
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                
                {/* 01 Hardware */}
                <div className="p-3 bg-emerald-50/70 border-2 border-emerald-200 hover:border-emerald-400 rounded-xl flex items-center justify-between transition-all group shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border-2 border-emerald-300 flex items-center justify-center text-emerald-700 shadow-2xs group-hover:scale-110 transition-transform">
                      <Cpu size={16} />
                    </div>
                    <div>
                      <div className="text-emerald-950 font-extrabold text-xs">01 // ESP32 / IoT Device</div>
                      <div className="text-[10px] text-slate-700 font-medium">เซนเซอร์ตรวจวัด, สวิตช์รีเลย์, ไมโครคอนโทรลเลอร์</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-900 font-extrabold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    GPIO / I2C
                  </span>
                </div>

                <div className="flex justify-center my-0.5 text-emerald-700 font-extrabold">↓</div>

                {/* 02 Protocol */}
                <div className="p-3 bg-sky-50/70 border-2 border-sky-200 hover:border-sky-400 rounded-xl flex items-center justify-between transition-all group shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border-2 border-sky-300 flex items-center justify-center text-sky-700 shadow-2xs group-hover:scale-110 transition-transform">
                      <Wifi size={16} />
                    </div>
                    <div>
                      <div className="text-sky-950 font-extrabold text-xs">02 // MQTT / REST API</div>
                      <div className="text-[10px] text-slate-700 font-medium">โปรโตคอลรับส่งข้อมูลความเร็วสูง ไร้ความหน่วง</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-sky-900 font-extrabold bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                    TLS / JSON
                  </span>
                </div>

                <div className="flex justify-center my-0.5 text-sky-700 font-extrabold">↓</div>

                {/* 03 Web Dashboard */}
                <div className="p-3 bg-amber-50/70 border-2 border-amber-200 hover:border-amber-400 rounded-xl flex items-center justify-between transition-all group shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border-2 border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs group-hover:scale-110 transition-transform">
                      <Globe size={16} />
                    </div>
                    <div>
                      <div className="text-amber-950 font-extrabold text-xs">03 // Web Dashboard</div>
                      <div className="text-[10px] text-slate-700 font-medium">หน้าจอควบคุม สั่งการ และติดตามข้อมูลจากทุกอุปกรณ์</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-950 font-extrabold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    Responsive
                  </span>
                </div>

                <div className="flex justify-center my-0.5 text-[#E11D48] font-extrabold">↓</div>

                {/* 04 Business Value */}
                <div className="p-3.5 bg-gradient-to-r from-rose-100 via-orange-100 to-amber-100 border-2 border-rose-300 rounded-xl text-center shadow-xs">
                  <span className="text-slate-950 font-extrabold text-xs block mb-0.5">
                    04 // Business Value ที่วัดผลได้จริง
                  </span>
                  <span className="text-[11px] text-rose-900 font-bold">
                    ลดงาน Manual • ลดความผิดพลาด • ข้อมูลพร้อมตัดสินใจทันที
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 02. WORKS (Real Portfolio & Projects) ================= */}
      <section id="works" className="py-20 sm:py-28 border-b border-slate-300/80 relative overflow-hidden bg-aurora-works bg-circuit-dots">
        {/* Soft Ambient Aurora Halos */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-b from-emerald-100/60 to-transparent blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[400px] bg-gradient-to-tr from-sky-100/60 to-rose-100/40 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-slate-200/80 gap-4">
            <div>
              <span className="font-mono text-xs text-[#E11D48] uppercase tracking-wider block mb-2 font-extrabold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-pulse" />
                <span>[ PORTFOLIO // ผลงานและโปรเจกต์จริง ]</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-950">
                ผลงานและโปรเจกต์จริง
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 font-normal">
                โปรเจกต์ซอฟต์แวร์และฮาร์ดแวร์ที่พัฒนาและนำไปใช้งานจริง จากฐานข้อมูล Google Sheets CMS
              </p>
            </div>

            {/* Dynamic Category Filter Pills */}
            <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 font-mono text-xs overflow-x-auto no-scrollbar py-1.5 -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                type="button"
                onClick={() => setSelectedWorkCategory('all')}
                className={`px-4 py-2.5 rounded-xl border-2 transition-all font-bold shrink-0 whitespace-nowrap min-h-[42px] flex items-center ${
                  selectedWorkCategory === 'all'
                    ? 'bg-gradient-to-r from-[#E11D48] to-[#EA580C] text-white border-transparent shadow-md transform -translate-y-0.5'
                    : 'bg-white/95 backdrop-blur-sm text-slate-800 border-slate-300 hover:border-slate-500 shadow-2xs'
                }`}
              >
                ทั้งหมด (ALL)
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedWorkCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl border-2 transition-all uppercase font-bold shrink-0 whitespace-nowrap min-h-[42px] flex items-center ${
                    selectedWorkCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-gradient-to-r from-[#E11D48] to-[#EA580C] text-white border-transparent shadow-md transform -translate-y-0.5'
                      : 'bg-white/95 backdrop-blur-sm text-slate-800 border-slate-300 hover:border-slate-500 shadow-2xs'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="bg-white/95 backdrop-blur-sm border-2 border-slate-200/90 hover:border-[#E11D48] transition-all rounded-2xl flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-xl transform hover:-translate-y-1"
              >
                {/* Project Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-rose-50/40 to-orange-50/40 flex items-center justify-center">
                      <Layers size={36} className="text-slate-400 group-hover:text-[#E11D48] transition-colors" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-slate-300 text-[10px] font-mono text-slate-900 font-bold shadow-xs">
                    {project.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-950 mb-2 group-hover:text-[#E11D48] transition-colors">
                      {project.name}
                    </h3>
                    
                    <p className="text-xs text-slate-700 leading-relaxed mb-5 line-clamp-3 font-normal">
                      {project.description}
                    </p>

                    {/* Technology Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6 font-mono text-[10px]">
                      {project.technologies.map((techItem) => (
                        <span
                          key={techItem}
                          className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-800 font-bold"
                        >
                          {techItem}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Details, Content Link, Manual Link */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveProjectModal(project)}
                      className="text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-1.5 font-bold min-h-[40px] px-1"
                    >
                      <span>ดูรายละเอียด</span>
                      <ChevronRight size={14} className="text-[#0284C7]" />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.manualUrl && (
                        <a
                          href={project.manualUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-900 hover:text-sky-950 bg-sky-100 hover:bg-sky-200 border border-sky-300 px-3 py-2 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-2xs min-h-[40px]"
                          title="เปิดดูคู่มือการใช้งาน"
                        >
                          <FileText size={13} />
                          <span>คู่มือ</span>
                        </a>
                      )}

                      {project.demoUrl ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white bg-gradient-to-r from-[#E11D48] to-[#EA580C] hover:brightness-105 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs min-h-[40px]"
                          title="เปิดดูเนื้อหา / Live Demo"
                        >
                          <span>เปิดดูเนื้อหา</span>
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <span className="text-slate-500 text-[11px] px-2.5 py-1 rounded bg-slate-100 border border-slate-200">Production</span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="col-span-full py-16 px-6 text-center bg-white border-2 border-slate-200/90 rounded-2xl shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center mx-auto mb-4 text-[#E11D48]">
                  <Layers size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {selectedWorkCategory === 'all'
                    ? 'อยู่ระหว่างอัปเดตข้อมูลผลงานจริง'
                    : `ไม่พบผลงานในหมวดหมู่ "${selectedWorkCategory}"`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-5 leading-relaxed">
                  {selectedWorkCategory === 'all'
                    ? 'ข้อมูลผลงานและโปรเจกต์ที่เสร็จสมบูรณ์จะแสดงที่นี่โดยตรงจากระบบหลังบ้าน (Admin Console)'
                    : 'สามารถเลือกหมวดหมู่อื่นเพื่อดูผลงานเพิ่มเติม หรือเพิ่มผลงานใหม่ใน Admin Console'}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-800 font-mono text-xs font-bold border border-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ข้อมูลจริงแบบ Real-time จาก Google Sheets CMS</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= 03. SERVICES (Capabilities & 3 Main Pillars) ================= */}
      <section id="services" className="py-20 sm:py-28 border-b border-slate-300/80 relative overflow-hidden bg-aurora-services">
        {/* Soft Ambient Aurora Halos */}
        <div className="absolute top-10 left-1/3 w-[600px] h-[450px] bg-gradient-to-b from-sky-100/60 to-transparent blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-gradient-to-tl from-emerald-100/60 to-amber-100/40 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Quick Value & Capabilities Grid */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs text-[#0284C7] uppercase tracking-wider block mb-2 font-extrabold flex items-center justify-center gap-2">
              <Sparkles size={14} className="text-[#0284C7]" />
              <span>[ CORE CAPABILITIES // ความสามารถของระบบ ]</span>
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-950 mb-3">
              ทำระบบให้เหมาะกับงาน{' '}
              <span className="bg-gradient-to-r from-[#E11D48] via-[#EA580C] to-[#0284C7] bg-clip-text text-transparent">
                ไม่ใช่เอางานไปยัดใส่ Template
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              เราออกแบบโครงสร้างซอฟต์แวร์และฮาร์ดแวร์ตามขั้นตอนการทำงานจริงของคุณ เพื่อให้ระบบตอบสนองได้ตรงจุดที่สุดและสามารถต่อยอดในอนาคตได้
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5 font-mono text-center text-xs mb-20">
            {[
              { title: 'Web Application', desc: 'ระบบเว็บองค์กร', color: 'from-sky-500 to-blue-600', textCol: 'text-sky-900', borderHover: 'hover:border-sky-400' },
              { title: 'IoT System', desc: 'เชื่อมต่อฮาร์ดแวร์', color: 'from-emerald-500 to-teal-500', textCol: 'text-emerald-900', borderHover: 'hover:border-emerald-400' },
              { title: 'Dashboard', desc: 'สรุปข้อมูลสด', color: 'from-amber-500 to-orange-500', textCol: 'text-amber-950', borderHover: 'hover:border-amber-400' },
              { title: 'Automation', desc: 'ลดงานซ้ำซ้อน', color: 'from-purple-500 to-indigo-600', textCol: 'text-purple-900', borderHover: 'hover:border-purple-400' },
              { title: 'API Integration', desc: 'เชื่อมต่อภายนอก', color: 'from-rose-500 to-red-600', textCol: 'text-rose-900', borderHover: 'hover:border-rose-400' },
              { title: 'Database', desc: 'จัดเก็บข้อมูลปลอดภัย', color: 'from-blue-500 to-cyan-600', textCol: 'text-blue-900', borderHover: 'hover:border-blue-400' },
              { title: 'IT Solutions', desc: 'วางระบบโครงสร้าง', color: 'from-orange-500 to-amber-600', textCol: 'text-orange-950', borderHover: 'hover:border-orange-400' }
            ].map((cap, idx) => (
              <div 
                key={cap.title} 
                className={`p-4 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-slate-200/90 ${cap.borderHover} transition-all transform hover:-translate-y-1 shadow-xs hover:shadow-md group ${idx === 6 ? 'col-span-2 sm:col-span-1' : ''}`}
              >
                <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${cap.color} mx-auto mb-3 group-hover:w-12 transition-all`} />
                <div className={`font-extrabold text-xs mb-1 ${cap.textCol}`}>{cap.title}</div>
                <div className="text-slate-600 font-medium text-[10px]">{cap.desc}</div>
              </div>
            ))}
          </div>

          {/* 3 Main Pillars Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-slate-200/80">
            <div>
              <span className="font-mono text-xs text-[#E11D48] uppercase tracking-wider block mb-2 font-extrabold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
                <span>[ OUR SERVICES // 3 เสาหลักความเชี่ยวชาญ ]</span>
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-950">
                บริการพัฒนาและวางระบบครบวงจร
              </h3>
            </div>
            <p className="text-xs font-mono text-slate-600 mt-3 sm:mt-0 font-medium">
              3 ด้านความเชี่ยวชาญหลักเพื่อธุรกิจไทย
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {/* 01 IoT Solutions (Distinct Emerald Theme) */}
            <div className="bg-white/95 backdrop-blur-sm border-2 border-emerald-200/90 hover:border-emerald-500 transition-all p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group shadow-xs hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
              
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs">
                  <span className="text-emerald-900 font-extrabold text-base bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 shadow-2xs">
                    01
                  </span>
                  <span className="text-emerald-800 font-extrabold tracking-wider">HARDWARE & SENSORS</span>
                </div>
                
                <h4 className="text-2xl font-extrabold text-slate-950 mb-3 group-hover:text-emerald-700 transition-colors">
                  IoT Solutions
                </h4>
                
                <p className="text-xs text-slate-700 leading-relaxed mb-6 font-normal">
                  ออกแบบระบบเชื่อมต่ออุปกรณ์ Sensor และ Microcontroller พร้อม Dashboard และระบบจัดเก็บข้อมูลแบบครบวงจร
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 font-mono text-xs">
                  {[
                    'ESP32 & ESP32-C3 Firmware Development',
                    'Sensors ตรวจวัด (อุณหภูมิ, ความชื้น, แรงดัน, การเคลื่อนไหว)',
                    'MQTT & WebSockets สำหรับข้อมูลความเร็วสูง',
                    'ระบบควบคุมเปิด-ปิดรีเลย์ และสวิตช์ระยะไกล',
                    'แจ้งเตือนฉุกเฉินผ่าน LINE Notify / LINE Bot'
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-slate-800 font-medium">
                      <span className="text-emerald-600 font-extrabold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600 font-medium">ปรึกษางาน IoT</span>
                <a href="#contact" className="text-emerald-700 font-bold hover:text-emerald-900 flex items-center gap-1.5 transition-colors">
                  <span>ติดต่อเรา</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* 02 Web Applications (Distinct Sky/Blue Theme) */}
            <div className="bg-white/95 backdrop-blur-sm border-2 border-sky-200/90 hover:border-sky-500 transition-all p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group shadow-xs hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
              
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs">
                  <span className="text-sky-900 font-extrabold text-base bg-sky-100 px-3 py-1 rounded-lg border border-sky-300 shadow-2xs">
                    02
                  </span>
                  <span className="text-sky-800 font-extrabold tracking-wider">SOFTWARE & WORKFLOW</span>
                </div>
                
                <h4 className="text-2xl font-extrabold text-slate-950 mb-3 group-hover:text-sky-700 transition-colors">
                  Web Applications
                </h4>
                
                <p className="text-xs text-slate-700 leading-relaxed mb-6 font-normal">
                  พัฒนา Web Application และระบบหลังบ้านตาม Workflow ของธุรกิจ จัดการข้อมูลให้เป็นระบบและเข้าถึงได้ทุกที่
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 font-mono text-xs">
                  {[
                    'ระบบจัดการภายใน (Management System)',
                    'แดชบอร์ดสรุปยอดขายและข้อมูลสถิติ (Dashboard)',
                    'ระบบจัดการสต็อกสินค้าและคลังสินค้า (Inventory)',
                    'ระบบจองคิวและการลงเวลา (Booking & Workflow)',
                    'ระบบยืนยันตัวตนและความปลอดภัย (Authentication)'
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-slate-800 font-medium">
                      <span className="text-sky-600 font-extrabold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600 font-medium">ปรึกษา Web App</span>
                <a href="#contact" className="text-sky-700 font-bold hover:text-sky-900 flex items-center gap-1.5 transition-colors">
                  <span>ติดต่อเรา</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* 03 IT Solutions (Distinct Amber/Orange Theme) */}
            <div className="bg-white/95 backdrop-blur-sm border-2 border-amber-200/90 hover:border-amber-500 transition-all p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group shadow-xs hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-[#E11D48]" />
              
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs">
                  <span className="text-amber-950 font-extrabold text-base bg-amber-100 px-3 py-1 rounded-lg border border-amber-300 shadow-2xs">
                    03
                  </span>
                  <span className="text-amber-800 font-extrabold tracking-wider">INFRASTRUCTURE & CLOUD</span>
                </div>
                
                <h4 className="text-2xl font-extrabold text-slate-950 mb-3 group-hover:text-amber-700 transition-colors">
                  IT Solutions
                </h4>
                
                <p className="text-xs text-slate-700 leading-relaxed mb-6 font-normal">
                  ช่วยวางระบบและพัฒนาโซลูชันด้าน IT ให้เหมาะกับการใช้งานจริง เสถียร ปลอดภัย และดูแลรักษาง่าย
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 font-mono text-xs">
                  {[
                    'ออกแบบสถาปัตยกรรมระบบ API และ Database',
                    'ติดตั้งและบริหารจัดการ Server / Cloud (Vercel, GCP, VPS)',
                    'ระบบสำรองข้อมูลอัตโนมัติ (Automated Backup)',
                    'System Integration เชื่อมต่อซอฟต์แวร์เดิมเข้าหากัน',
                    'ให้คำปรึกษาทางเทคนิคสำหรับองค์กรและฝ่าย IT'
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-slate-800 font-medium">
                      <span className="text-orange-600 font-extrabold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600 font-medium">ปรึกษา IT Solution</span>
                <a href="#contact" className="text-orange-600 font-bold hover:text-orange-800 flex items-center gap-1.5 transition-colors">
                  <span>ติดต่อเรา</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 04. SOLUTIONS (Live IoT Cockpit & Interactive Telemetry) ================= */}
      <section id="solutions" className="py-20 sm:py-28 border-b border-slate-300/80 relative overflow-hidden bg-aurora-solutions bg-circuit-dots">
        {/* Soft Ambient Aurora Halos */}
        <div className="absolute top-10 left-1/4 w-[650px] h-[450px] bg-gradient-to-b from-rose-100/50 to-transparent blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-[550px] h-[400px] bg-gradient-to-tl from-sky-100/60 to-emerald-100/40 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-slate-200 gap-4">
            <div>
              <span className="font-mono text-xs text-[#E11D48] uppercase tracking-wider block mb-2 font-extrabold flex items-center gap-2">
                <Radio size={14} className="animate-pulse text-[#E11D48]" />
                <span>[ SOLUTIONS // LIVE IOT COCKPIT & DEMONSTRATION ]</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-950">
                โซลูชันระบบ IoT & Dashboard สด
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 font-normal">
                ควบคุมอุปกรณ์และติดตามข้อมูลจากศูนย์กลาง (ลองคลิกเปิด-ปิดรีเลย์หรือเปลี่ยน Node เพื่อทดสอบการตอบสนองได้จริง)
              </p>
            </div>
            
            <div className="flex items-center gap-2 font-mono text-xs bg-emerald-100 text-emerald-950 border-2 border-emerald-300 px-4 py-2 rounded-full font-bold shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
              <span>MQTT BROKER: CONNECTED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: 4 Realistic Nodes */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {iotDevices.map((device) => {
                  const isSelected = selectedDashboardDeviceId === device.id;
                  const isOnline = device.connectionStatus === 'Online';
                  const isWarning = device.connectionStatus === 'Warning';

                  return (
                    <div
                      key={device.id}
                      onClick={() => setSelectedDashboardDeviceId(device.id)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-white border-[#E11D48] ring-4 ring-[#E11D48]/15 shadow-md' 
                          : 'bg-white/95 backdrop-blur-sm border-slate-200/90 hover:border-slate-400 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                            <span>{device.name}</span>
                          </h4>
                          <span className="text-[10px] font-mono text-slate-600 font-medium">{device.locationName}</span>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 ${
                          isOnline ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          isWarning ? 'bg-amber-100 text-amber-950 border border-amber-300' :
                          'bg-slate-200 text-slate-700 border border-slate-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-600' : isWarning ? 'bg-amber-600' : 'bg-slate-500'}`} />
                          <span>{device.connectionStatus}</span>
                        </span>
                      </div>

                      {/* Sensor Summary Boxes */}
                      <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
                        <div className="bg-rose-100/80 p-3 rounded-xl border border-rose-300">
                          <span className="text-rose-950 block text-[10px] font-bold">อุณหภูมิ</span>
                          <span className="text-rose-950 font-extrabold text-base">{device.temperatureCelsius}°C</span>
                        </div>
                        <div className="bg-sky-100/80 p-3 rounded-xl border border-sky-300">
                          <span className="text-sky-950 block text-[10px] font-bold">ความชื้น</span>
                          <span className="text-sky-950 font-extrabold text-base">{device.humidityPercentage}%</span>
                        </div>
                      </div>

                      {/* Relay Switch Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-600 text-[11px] font-medium">สถานะรีเลย์:</span>
                          <span className={`font-extrabold text-[11px] ${device.relayStatus ? 'text-[#E11D48]' : 'text-slate-500'}`}>
                            {device.relayStatus ? 'เปิด (ON)' : 'ปิด (OFF)'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleRelay(device.id);
                          }}
                          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs min-h-[44px] touch-target ${
                            device.relayStatus
                              ? 'bg-gradient-to-r from-[#E11D48] to-[#EA580C] text-white hover:brightness-105 shadow-rose-300/50'
                              : 'bg-slate-200 text-slate-800 hover:bg-slate-300 border border-slate-300'
                          }`}
                        >
                          <Power size={13} />
                          <span>{device.relayStatus ? 'ปิดสวิตช์' : 'เปิดสวิตช์'}</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Recharts Live Visualization */}
              <div className="p-4 sm:p-6 bg-white/95 backdrop-blur-sm border-2 border-slate-200/90 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Activity size={15} className="text-[#E11D48]" />
                    <span className="text-slate-950 font-extrabold text-[11px] sm:text-xs">
                      กราฟแนวโน้ม: <span className="text-[#0284C7]">{selectedDevice.name}</span>
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300 font-extrabold">
                    09:41 - 10:01 LIVE
                  </span>
                </div>

                <div className="h-44 sm:h-52 w-full">
                  {isClientMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedDevice.telemetryHistory} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
                        <defs>
                          <linearGradient id="tempGradientLight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#E11D48" stopOpacity={0.0}/>
                          </linearGradient>
                          <linearGradient id="humGradientLight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0284C7" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                        <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#94A3B8', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace', boxShadow: '0 4px 15px rgba(0,0,0,0.12)' }}
                          labelStyle={{ color: '#E11D48', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="temp" name="อุณหภูมิ (°C)" stroke="#E11D48" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGradientLight)" />
                        <Area type="monotone" dataKey="humidity" name="ความชื้น (%)" stroke="#0284C7" strokeWidth={2.5} fillOpacity={1} fill="url(#humGradientLight)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs font-mono text-slate-600">
                      กำลังโหลดข้อมูลการวัด...
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between font-mono text-[11px] text-slate-700 font-medium gap-2">
                  <div className="flex items-center gap-4">
                    <span>สัญญาณ: <strong className="text-emerald-800">{selectedDevice.wifiSignalDbm} dBm</strong></span>
                    <span>Latency: <strong className="text-sky-800">{selectedDevice.connectionLatencyMs ? `${selectedDevice.connectionLatencyMs} ms` : 'N/A'}</strong></span>
                  </div>
                  <span>Last Seen: <strong className="text-amber-900">{selectedDevice.lastSeenTimestamp}</strong></span>
                </div>
              </div>

            </div>

            {/* Right Column: Event History */}
            <div className="lg:col-span-4 bg-white/95 backdrop-blur-sm border-2 border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 font-mono text-xs">
                <span className="text-slate-950 font-extrabold flex items-center gap-2">
                  <Clock size={15} className="text-[#E11D48]" />
                  <span>EVENT HISTORY</span>
                </span>
                <span className="text-[10px] text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300 font-bold">
                  REALTIME
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs max-h-[340px] overflow-y-auto pr-1">
                {telemetryLogs.map((log) => (
                  <div key={log.eventId} className="p-3 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs">
                    <div className="flex items-center justify-between text-[10px] mb-1.5">
                      <span className="text-[#EA580C] font-extrabold">{log.timestamp}</span>
                      <span className="text-sky-900 bg-sky-100 px-2 py-0.5 rounded border border-sky-300 font-bold">
                        {log.deviceName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed font-normal">
                      {log.eventDescription}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                <span className="text-[11px] font-mono text-slate-700 block mb-2.5 font-medium">
                  ต้องการสร้างระบบมอนิเตอร์และควบคุมแบบนี้ในธุรกิจของคุณ?
                </span>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-white bg-gradient-to-r from-[#E11D48] to-[#EA580C] px-5 py-2.5 rounded-xl hover:brightness-105 shadow-sm transition-all"
                >
                  <span>ปรึกษาการออกแบบระบบ IoT</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 05. CONTACT (Thai Business CTA & High-Impact Channels) ================= */}
      <section id="contact" className="py-20 sm:py-28 border-b border-slate-300/80 relative overflow-hidden bg-aurora-contact">
        {/* Soft Ambient Aurora Halos */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-rose-100/60 via-amber-100/40 to-transparent blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <span className="font-mono text-xs text-[#E11D48] uppercase tracking-wider block mb-3 font-extrabold flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
            <span>[ CONTACT US // ติดต่อสอบถาม เริ่มต้นโปรเจกต์ ]</span>
          </span>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 mb-4">
            มีระบบที่อยากทำ แต่ยังไม่รู้จะเริ่มตรงไหน?
          </h2>

          <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-950 via-[#E11D48] to-[#EA580C] bg-clip-text text-transparent mb-4">
            เล่าไอเดียหรือปัญหาของคุณให้เราฟังได้เลย
          </h3>
          
          <p className="text-slate-700 text-xs sm:text-sm max-w-xl mx-auto mb-10 leading-relaxed font-normal">
            เราช่วยวิเคราะห์ ออกแบบ และพัฒนาระบบให้เหมาะกับการใช้งานจริง ไม่ว่าจะเป็นระบบขนาดเล็กหรือระบบเฉพาะทางขององค์กร ทักมาคุยกันได้โดยไม่มีข้อผูกมัด
          </p>

          {/* High-Impact Contact Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            
            {/* LINE Official - Thai standard LINE Green */}
            <a
              href={`https://line.me/ti/p/~${(siteConfig.contact_line || '@DEEDEVIOT').replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#06C755] hover:bg-[#05b34c] text-white font-mono text-xs uppercase tracking-wider font-extrabold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(6,199,85,0.35)] transform hover:-translate-y-0.5 min-h-[48px] touch-target"
            >
              <MessageCircle size={18} />
              <span>คุยกับเราใน LINE →</span>
            </a>

            {/* Email - Crisp Deep Slate / Rose */}
            <a
              href={`mailto:${siteConfig.contact_email || 'hello@deedeviot.com'}`}
              className="w-full sm:w-auto px-8 py-4 bg-slate-950 hover:bg-[#E11D48] text-white font-mono text-xs uppercase tracking-wider font-extrabold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-md transform hover:-translate-y-0.5 min-h-[48px] touch-target"
            >
              <Mail size={18} />
              <span>ส่งอีเมลปรึกษาเรา</span>
            </a>
          </div>

          {/* Direct Channels Information Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-left font-mono text-xs">
            <div className="p-4 bg-emerald-50/80 border-2 border-emerald-200/90 rounded-2xl shadow-2xs">
              <span className="text-[10px] text-emerald-800 block mb-1 font-extrabold">LINE OFFICIAL</span>
              <span className="text-slate-950 font-extrabold">{siteConfig.contact_line || '@DEEDEVIOT'}</span>
            </div>

            <div className="p-4 bg-rose-50/80 border-2 border-rose-200/90 rounded-2xl shadow-2xs">
              <span className="text-[10px] text-rose-800 block mb-1 font-extrabold">EMAIL</span>
              <a href={`mailto:${siteConfig.contact_email || 'hello@deedeviot.com'}`} className="text-slate-950 font-extrabold hover:text-[#E11D48] break-all">
                {siteConfig.contact_email || 'hello@deedeviot.com'}
              </a>
            </div>

            <div className="p-4 bg-amber-50/80 border-2 border-amber-200/90 rounded-2xl shadow-2xs">
              <span className="text-[10px] text-amber-800 block mb-1 font-extrabold">TELEPHONE</span>
              <a href={`tel:${siteConfig.contact_phone || '02-123-4567'}`} className="text-slate-950 font-extrabold hover:text-[#EA580C]">
                {siteConfig.contact_phone || '02-123-4567'}
              </a>
            </div>

            <div className="p-4 bg-sky-50/80 border-2 border-sky-200/90 rounded-2xl shadow-2xs">
              <span className="text-[10px] text-sky-800 block mb-1 font-extrabold">FACEBOOK</span>
              <a 
                href={siteConfig.facebook_url || "https://facebook.com/deedeviot"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-950 font-extrabold hover:text-[#0284C7] flex items-center gap-1"
              >
                <span>DeeDevIOT</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 06. ABOUT DEEDEV IOT (Story, Why Choose Us & Dynamic Concepts) ================= */}
      <section id="about" className="py-20 sm:py-28 border-b border-slate-300/80 relative overflow-hidden bg-aurora-about bg-circuit-dots">
        {/* Ambient Aurora Halos */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-gradient-to-b from-indigo-100/50 to-purple-100/30 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[400px] bg-gradient-to-tl from-sky-100/50 to-rose-100/30 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-slate-200/80">
            <div>
              <span className="font-mono text-xs text-indigo-700 uppercase tracking-wider block mb-2 font-extrabold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                <span>[ ABOUT US // เกี่ยวกับเรา ]</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-950">
                DeeDev IOT คือใคร?
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-600 mt-3 sm:mt-0 font-medium max-w-md">
              สตูดิโอเทคโนโลยีของคนไทย มุ่งมั่นเปลี่ยนไอเดียให้กลายเป็นระบบจริง
            </p>
          </div>

          {/* Story & Core Philosophy Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
            
            {/* Story Card */}
            <div className="lg:col-span-7 bg-white/95 backdrop-blur-sm border-2 border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-sky-500 to-[#E11D48]" />
              
              <div>
                {/* 3D Illuminated Studio Showcase Banner */}
                <div className="mb-6 rounded-xl overflow-hidden border-2 border-slate-800 shadow-xl relative group">
                  <img 
                    src="/logo2.png" 
                    alt="DeeDev IoT - Connecting Devices. Developing Futures." 
                    className="w-full h-44 sm:h-56 object-cover object-center group-hover:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white font-mono text-[11px] sm:text-xs font-bold flex items-center gap-2 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>OFFICIAL THAILAND TECH STUDIO // CONNECTING DEVICES. DEVELOPING FUTURES.</span>
                    </span>
                  </div>
                </div>

                <span className="font-mono text-xs text-indigo-700 font-extrabold uppercase tracking-wider block mb-3">
                  OUR MISSION // พันธกิจของเรา
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 mb-4 leading-snug">
                  "เราเชื่อว่าทุกธุรกิจไทยควรเข้าถึงเทคโนโลยีที่ตอบโจทย์เฉพาะตัวได้ โดยไม่ต้องจ่ายแพงเกินจริง"
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal mb-4">
                  DeeDev IOT ก่อตั้งขึ้นโดยทีมวิศวกรและนักพัฒนาซอฟต์แวร์คนไทยที่มีประสบการณ์โดยตรงในการสร้างระบบอัตโนมัติ, การต่อพ่วงเซนเซอร์ในโรงงานอุตสาหกรรม และการพัฒนา Web Application ระดับองค์กร
                </p>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  เราไม่ใช้ Template สำเร็จรูปที่ปรับแต่งยาก แต่เราเขียน Code และออกแบบสถาปัตยกรรมที่เข้ากับกระบวนการทำงานของคุณจริง พร้อมส่งมอบ Source Code ให้คุณถือครองอย่างสมบูรณ์แบบ
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>100% Thai Dev Team</span>
                </div>
                <div className="flex items-center gap-2 text-sky-800 font-bold bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200">
                  <CheckCircle2 size={16} className="text-sky-600" />
                  <span>Full Ownership & Code</span>
                </div>
              </div>
            </div>

            {/* Why Choose Us - 4 Points */}
            <div className="lg:col-span-5 bg-white/95 backdrop-blur-sm border-2 border-slate-200/90 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
              <span className="font-mono text-xs text-[#E11D48] font-extrabold uppercase tracking-wider block mb-4">
                WHY CHOOSE US // ทำไมต้องเลือกเรา
              </span>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-slate-950 flex items-center gap-2 mb-1">
                    <span className="text-[#E11D48]">01 //</span>
                    <span>ครบทั้ง Hardware & Software</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-normal">
                    คุยที่เดียวจบ ตั้งแต่วงจร ESP32, เฟิร์มแวร์, คลาวด์ จนถึงหน้าจอเว็บ Dashboard
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-slate-950 flex items-center gap-2 mb-1">
                    <span className="text-[#0284C7]">02 //</span>
                    <span>ส่งมอบ Source Code 100%</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-normal">
                    คุณเป็นเจ้าของระบบอย่างแท้จริง ไม่มีการผูกขาดลิขสิทธิ์ ต่อเติมได้อิสระ
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-slate-950 flex items-center gap-2 mb-1">
                    <span className="text-[#059669]">03 //</span>
                    <span>แก้ปัญหาตรงจุด ใช้งานง่าย</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-normal">
                    ลดขั้นตอนที่ซับซ้อนของผู้ใช้งาน เน้น UI สบายตา ชัดเจน อ่านค่าง่าย
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-slate-950 flex items-center gap-2 mb-1">
                    <span className="text-[#EA580C]">04 //</span>
                    <span>มีบริการดูแลหลังส่งมอบ</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-normal">
                    พร้อมช่วยเหลือ ให้คำปรึกษาทางเทคนิค และอัปเกรดระบบเมื่อธุรกิจเติบโต
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Dynamic Core Concepts Grid (From Google Sheets /api/concept) */}
          <div className="mb-16">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-200 font-mono text-xs">
              <span className="text-slate-950 font-extrabold flex items-center gap-2">
                <BookOpen size={16} className="text-[#0284C7]" />
                <span>CORE CONCEPTS & ARCHITECTURAL PILLARS</span>
              </span>
              <span className="text-[10px] text-indigo-900 bg-indigo-100 px-2.5 py-0.5 rounded border border-indigo-300 font-bold">
                DYNAMIC CMS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cmsConcepts.map((concept, idx) => {
                const title = concept.title_th || concept.title_en || `Concept 0${idx + 1}`;
                const desc = concept.desc_th || concept.desc_en || '';
                const enSub = concept.title_th && concept.title_en && concept.title_th !== concept.title_en ? concept.title_en : null;

                return (
                  <div
                    key={concept.id || idx}
                    className="p-6 rounded-2xl bg-white/95 backdrop-blur-sm border-2 border-slate-200/90 hover:border-indigo-400 transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4 font-mono text-xs">
                        <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold flex items-center justify-center shadow-2xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          0{idx + 1}
                        </span>
                        {concept.icon && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                            {concept.icon}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-extrabold text-slate-950 mb-1 group-hover:text-indigo-600 transition-colors">
                        {title}
                      </h4>

                      {enSub && (
                        <div className="text-[11px] font-mono text-indigo-700 font-semibold mb-2">
                          {enSub}
                        </div>
                      )}

                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 font-mono text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>DEEDEV ARCHITECTURE</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Trust Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#EA580C] shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white mb-1">
                  พร้อมเปลี่ยนไอเดียของคุณให้เป็นระบบที่ใช้งานได้จริงหรือยัง?
                </h4>
                <p className="text-xs text-slate-300 font-mono">
                  พูดคุยกับทีมงานวิศวกรของ DeeDev IOT โดยตรง พร้อมประเมินขอบเขตงานและงบประมาณฟรี
                </p>
              </div>
            </div>

            <a
              href="#contact"
              className="px-6 py-3 bg-gradient-to-r from-[#E11D48] to-[#EA580C] hover:brightness-105 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shrink-0"
            >
              <span>เริ่มต้นปรึกษาฟรี</span>
              <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </section>

      {/* ================= FOOTER (Crisp Dark Slate Anchor) ================= */}
      <footer className="py-14 bg-[#0F172A] text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 font-mono text-sm tracking-wider font-bold mb-3">
                <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-700 bg-white/10 p-0.5 flex items-center justify-center shrink-0">
                  <img src="/logo.jpg" alt="DeeDevIoT" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex items-center">
                  <span className="text-white font-extrabold">DEEDEV</span>
                  <span className="text-[#EA580C] mx-1 font-black">/</span>
                  <span className="bg-gradient-to-r from-[#EA580C] to-[#E11D48] bg-clip-text text-transparent font-extrabold">IOT</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed font-normal mb-3">
                ทีม Developer คนไทยที่ทำระบบจริง และเข้าใจปัญหาของธุรกิจไทย รับพัฒนา Web Application, IoT, Dashboard และระบบ IT ตามความต้องการ
              </p>
              <div className="font-mono text-[11px] text-slate-500">
                "เปลี่ยนไอเดียให้เป็นระบบที่ใช้งานได้จริง" • Turn Ideas Into Real Digital Solutions.
              </div>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase text-white font-bold mb-3 tracking-wider">บริการที่รับทำ</h4>
              <ul className="space-y-1.5 font-mono text-xs text-slate-400">
                <li><a href="#services" className="hover:text-emerald-400 transition-colors">IoT Solutions & ESP32</a></li>
                <li><a href="#services" className="hover:text-sky-400 transition-colors">Web Applications</a></li>
                <li><a href="#services" className="hover:text-orange-400 transition-colors">Custom IT Systems</a></li>
                <li><a href="#solutions" className="hover:text-[#E11D48] transition-colors">Live IoT Solutions</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase text-white font-bold mb-3 tracking-wider">เมนูเว็บไซต์</h4>
              <ul className="space-y-1.5 font-mono text-xs text-slate-400">
                <li><a href="#hero" className="hover:text-white transition-colors">Home (หน้าแรก)</a></li>
                <li><a href="#works" className="hover:text-white transition-colors">Works (ผลงานจริง)</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services (บริการ)</a></li>
                <li><a href="#solutions" className="hover:text-white transition-colors">Solutions (โซลูชัน)</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact (ติดต่อเรา)</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About (เกี่ยวกับเรา)</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
            <div>
              © 2026 DEEDEV IOT. ALL RIGHTS RESERVED.
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-slate-400">DESIGNED FOR THAI BUSINESSES</span>
              <Link 
                href="/login" 
                className="p-1 text-slate-500 hover:text-[#E11D48] hover:bg-slate-800 rounded transition-colors"
                title="Admin Console"
                aria-label="Admin Login"
              >
                <Lock size={12} />
              </Link>
            </div>
          </div>

        </div>
      </footer>

      {/* ================= ARCHITECTURE / PROJECT MODAL ================= */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-2xl bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-2xl p-5 sm:p-8 relative shadow-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto safe-area-bottom"
            role="dialog"
            aria-modal="true"
          >
            {/* Mobile Pull Handle Indicator */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />

            {/* Modal Cover Image if available */}
            {activeProjectModal.imageUrl && (
              <div className="relative h-44 sm:h-56 -mx-5 sm:-mx-8 -mt-2 sm:-mt-8 mb-5 overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-slate-100 border-b border-slate-200">
                <img
                  src={activeProjectModal.imageUrl}
                  alt={activeProjectModal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 text-xs font-mono text-slate-800 font-bold shadow-xs">
                  {activeProjectModal.category}
                </div>
              </div>
            )}

            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="font-mono text-xs text-sky-600 uppercase tracking-wider block mb-1 font-bold">
                  [ {activeProjectModal.category} ]
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {activeProjectModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 rounded-xl border border-slate-200 bg-slate-50 transition-colors touch-target shrink-0"
                aria-label="ปิดหน้าต่าง"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
              {activeProjectModal.description}
            </p>

            {activeProjectModal.architectureDetails && (
              <div className="mb-6 p-4 rounded-xl bg-sky-50/50 border border-sky-200/80">
                <div className="font-mono text-xs text-sky-800 font-bold uppercase mb-2">โครงสร้างสถาปัตยกรรม:</div>
                <ul className="space-y-1.5 font-mono text-xs text-slate-700">
                  {activeProjectModal.architectureDetails.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-[#E11D48] font-bold">→</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-6">
              <span className="font-mono text-[11px] text-slate-500 block mb-2 uppercase">TECHNOLOGIES:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeProjectModal.technologies.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono">
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                className="w-full sm:w-auto px-5 py-3 border border-slate-300 text-xs text-slate-700 hover:text-slate-950 font-bold rounded-xl transition-colors min-h-[44px] flex items-center justify-center touch-target"
              >
                ปิดหน้าต่าง
              </button>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {activeProjectModal.manualUrl && (
                  <a
                    href={activeProjectModal.manualUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-3 bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 hover:text-sky-950 text-xs font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-2xs min-h-[44px] touch-target"
                  >
                    <FileText size={15} />
                    <span>เปิดดูคู่มือ (Documentation)</span>
                  </a>
                )}

                {activeProjectModal.demoUrl && (
                  <a
                    href={activeProjectModal.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-[#E11D48] to-[#EA580C] hover:brightness-105 text-white text-xs font-bold rounded-xl inline-flex items-center justify-center gap-2 shadow-sm transition-all min-h-[44px] touch-target"
                  >
                    <span>เปิดดูเนื้อหา (Live Demo)</span>
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
