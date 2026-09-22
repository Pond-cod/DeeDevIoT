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
        const [servicesRes, integrationsRes, configRes] = await Promise.all([
          fetch('/api/services', { cache: 'no-store' }),
          fetch('/api/integrations', { cache: 'no-store' }),
          fetch('/api/config', { cache: 'no-store' })
        ]);
        const [servicesData, integrationsData, configData] = await Promise.all([
          servicesRes.json(),
          integrationsRes.json(),
          configRes.json()
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
          <Link href="#hero" className="flex items-center gap-3 group focus:outline-none">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E11D48]" />
            </span>
            <div className="font-mono text-base tracking-wider font-bold">
              <span className="text-slate-950 group-hover:text-[#E11D48] transition-colors">DEEDEV</span>
              <span className="text-[#EA580C] mx-1">/</span>
              <span className="bg-gradient-to-r from-[#E11D48] to-[#EA580C] bg-clip-text text-transparent font-extrabold">IOT</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider font-bold text-slate-700">
            <a href="#hero" className="hover:text-slate-950 transition-colors py-1">Home</a>
            <a href="#services" className="hover:text-[#0284C7] transition-colors py-1">Services</a>
            <a href="#works" className="hover:text-[#059669] transition-colors py-1">Works</a>
            <a href="#iot-dashboard" className="hover:text-[#EA580C] transition-colors flex items-center gap-1.5 py-1">
              <span>Solutions</span>
              <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse" />
            </a>
            <a href="#about" className="hover:text-slate-950 transition-colors py-1">About</a>
            <a href="#contact" className="hover:text-[#E11D48] transition-colors py-1">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold tracking-wider bg-gradient-to-r from-[#E11D48] to-[#EA580C] hover:brightness-105 text-white rounded-xl transition-all shadow-xs"
            >
              <span>ปรึกษาโปรเจกต์</span>
              <ArrowRight size={13} className="text-white" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-300 bg-white text-slate-800 hover:text-slate-950 shadow-xs"
              aria-label="เมนูหลัก"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-white/98 backdrop-blur-xl pt-20 px-6 pb-8 flex flex-col justify-between">
          <nav className="flex flex-col space-y-3 font-mono text-sm tracking-wider text-slate-800">
            <a 
              href="#hero" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-3 px-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100 flex items-center justify-between font-bold"
            >
              <span>หน้าแรก (Home)</span>
              <ChevronRight size={16} className="text-slate-400" />
            </a>
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-3 px-3.5 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-100/60 flex items-center justify-between font-bold text-sky-900"
            >
              <span>บริการที่รับทำ (Services)</span>
              <ChevronRight size={16} className="text-sky-600" />
            </a>
            <a 
              href="#works" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-3 px-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 flex items-center justify-between font-bold text-emerald-900"
            >
              <span>ผลงานจริง (Works)</span>
              <ChevronRight size={16} className="text-emerald-600" />
            </a>
            <a 
              href="#iot-dashboard" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-3 px-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 flex items-center justify-between font-bold text-amber-900"
            >
              <div className="flex items-center gap-2">
                <span>ระบบ IoT Dashboard</span>
                <span className="text-[10px] bg-[#E11D48] text-white px-2 py-0.5 rounded-full font-bold">LIVE</span>
              </div>
              <ChevronRight size={16} className="text-amber-600" />
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-3 px-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100 flex items-center justify-between font-bold text-slate-800"
            >
              <span>เกี่ยวกับเรา (About)</span>
              <ChevronRight size={16} className="text-slate-400" />
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-3 px-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 flex items-center justify-between font-bold text-rose-900"
            >
              <span>ช่องทางติดต่อ (Contact)</span>
              <ChevronRight size={16} className="text-rose-600" />
            </a>
          </nav>
          <div className="pt-4">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-4 bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#EA580C] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl flex items-center justify-center gap-2 shadow-md"
            >
              <span>ปรึกษาโปรเจกต์ฟรี</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}

      {/* ================= 04.B HERO SECTION (Bright, Fresh, Luminous) ================= */}
      <section id="hero" className="relative pt-32 sm:pt-40 pb-20 border-b border-slate-300/80 overflow-hidden">
        
        {/* Soft Ambient Pastel Halos */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-rose-100/80 via-orange-50/50 to-transparent blur-[110px] pointer-events-none -z-10" />
        <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-sky-100/60 blur-[100px] pointer-events-none -z-10" />
        <div className="absolute top-2/3 -left-32 w-[400px] h-[400px] bg-emerald-100/60 blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-white border-2 border-slate-200 text-xs font-mono text-slate-800 flex items-center gap-2.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse" />
              <span className="text-slate-950 font-extrabold tracking-wider">DEEDEV IOT</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-700 font-semibold">Thailand Technology Studio</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.18] mb-6">
                มีไอเดีย แต่ยังไม่รู้จะทำ
                <span className="block mt-1 bg-gradient-to-r from-[#E11D48] via-[#EA580C] to-[#D97706] bg-clip-text text-transparent">
                  ระบบอย่างไร?
                </span>
              </h1>

              <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mb-4 leading-snug">
                DeeDevIOT ช่วยเปลี่ยนไอเดียของคุณให้กลายเป็น{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] via-[#059669] to-[#EA580C] font-extrabold">
                  Web Application, IoT และระบบ IT
                </span>{' '}
                ที่ใช้งานได้จริงโดยทีมงานคนไทย
              </h2>

              <p className="text-sm sm:text-base text-slate-700 max-w-2xl leading-relaxed mb-8 font-normal">
                ตั้งแต่การออกแบบระบบ พัฒนาโปรแกรม เชื่อมต่ออุปกรณ์ ไปจนถึงนำระบบไปใช้งานจริง สำหรับเจ้าของธุรกิจ SME โรงงาน และผู้ที่ต้องการลดงาน Manual ด้วยระบบดิจิทัล
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                <a
                  href="#contact"
                  className="px-8 py-4 bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#EA580C] hover:brightness-105 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(225,29,72,0.35)] hover:shadow-[0_6px_25px_rgba(225,29,72,0.45)] transform hover:-translate-y-0.5"
                >
                  <Sparkles size={16} />
                  <span>ปรึกษาโปรเจกต์</span>
                  <ArrowRight size={15} />
                </a>

                <a
                  href="#works"
                  className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-300 hover:border-slate-500 hover:text-slate-950 font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs transform hover:-translate-y-0.5"
                >
                  <span>ดูผลงานจริง</span>
                  <ArrowDown size={14} className="text-[#0284C7]" />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold">
                <span className="flex items-center gap-1.5 text-emerald-900 bg-emerald-100/90 px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs">
                  <CheckCircle2 size={14} className="text-emerald-700" />
                  <span>รับพัฒนาตามโจทย์จริง</span>
                </span>
                <span className="flex items-center gap-1.5 text-sky-900 bg-sky-100/90 px-3 py-1.5 rounded-lg border border-sky-300 shadow-2xs">
                  <CheckCircle2 size={14} className="text-sky-700" />
                  <span>ส่งมอบ Source Code 100%</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-950 bg-amber-100/90 px-3 py-1.5 rounded-lg border border-amber-300 shadow-2xs">
                  <CheckCircle2 size={14} className="text-amber-700" />
                  <span>ปรึกษาแนวทางเทคนิคฟรี</span>
                </span>
              </div>
            </div>

            {/* Right: Crisp Bright System Pipeline Card */}
            <div className="lg:col-span-5 bg-white border-2 border-slate-200/90 rounded-2xl p-6 shadow-md relative overflow-hidden">
              
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

      {/* ================= 04.C QUICK VALUE / TRUST SECTION ================= */}
      <section className="py-16 border-b border-slate-300/80 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-950 mb-2">
              ทำระบบให้เหมาะกับงาน{' '}
              <span className="bg-gradient-to-r from-[#E11D48] to-[#EA580C] bg-clip-text text-transparent">
                ไม่ใช่เอางานไปยัดใส่ Template
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              เราออกแบบโครงสร้างซอฟต์แวร์และฮาร์ดแวร์ตามขั้นตอนการทำงานจริงของคุณ เพื่อให้ระบบตอบสนองได้ตรงจุดที่สุดและสามารถต่อยอดในอนาคตได้
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5 font-mono text-center text-xs">
            {[
              { title: 'Web Application', desc: 'ระบบเว็บองค์กร', color: 'from-sky-500 to-blue-600', textCol: 'text-sky-900', borderHover: 'hover:border-sky-400' },
              { title: 'IoT System', desc: 'เชื่อมต่อฮาร์ดแวร์', color: 'from-emerald-500 to-teal-500', textCol: 'text-emerald-900', borderHover: 'hover:border-emerald-400' },
              { title: 'Dashboard', desc: 'สรุปข้อมูลสด', color: 'from-amber-500 to-orange-500', textCol: 'text-amber-950', borderHover: 'hover:border-amber-400' },
              { title: 'Automation', desc: 'ลดงานซ้ำซ้อน', color: 'from-purple-500 to-indigo-600', textCol: 'text-purple-900', borderHover: 'hover:border-purple-400' },
              { title: 'API Integration', desc: 'เชื่อมต่อภายนอก', color: 'from-rose-500 to-red-600', textCol: 'text-rose-900', borderHover: 'hover:border-rose-400' },
              { title: 'Database', desc: 'จัดเก็บข้อมูลปลอดภัย', color: 'from-blue-500 to-cyan-600', textCol: 'text-blue-900', borderHover: 'hover:border-blue-400' },
              { title: 'IT Solutions', desc: 'วางระบบโครงสร้าง', color: 'from-orange-500 to-amber-600', textCol: 'text-orange-950', borderHover: 'hover:border-orange-400' }
            ].map((cap) => (
              <div 
                key={cap.title} 
                className={`p-4 rounded-xl bg-white border-2 border-slate-200/90 ${cap.borderHover} transition-all transform hover:-translate-y-1 shadow-xs hover:shadow-md group`}
              >
                <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${cap.color} mx-auto mb-3 group-hover:w-12 transition-all`} />
                <div className={`font-extrabold text-xs mb-1 ${cap.textCol}`}>{cap.title}</div>
                <div className="text-slate-600 font-medium text-[10px]">{cap.desc}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 04.D SERVICES (3 Main Pillars with Distinct Themes) ================= */}
      <section id="services" className="py-20 sm:py-28 border-b border-slate-300/80 bg-[#FAFAFC] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-slate-200/80">
            <div>
              <span className="font-mono text-xs text-[#E11D48] uppercase tracking-wider block mb-2 font-extrabold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
                <span>[ OUR SERVICES // 3 เสาหลักความเชี่ยวชาญ ]</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-950">
                บริการพัฒนาและวางระบบ
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-600 mt-3 sm:mt-0 font-medium">
              3 ด้านความเชี่ยวชาญหลักเพื่อธุรกิจไทย
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            
            {/* 01 IoT Solutions (Distinct Emerald Theme) */}
            <div className="bg-white border-2 border-emerald-200/90 hover:border-emerald-500 transition-all p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group shadow-xs hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
              
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs">
                  <span className="text-emerald-900 font-extrabold text-base bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 shadow-2xs">
                    01
                  </span>
                  <span className="text-emerald-800 font-extrabold tracking-wider">HARDWARE & SENSORS</span>
                </div>
                
                <h3 className="text-2xl font-extrabold text-slate-950 mb-3 group-hover:text-emerald-700 transition-colors">
                  IoT Solutions
                </h3>
                
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
            <div className="bg-white border-2 border-sky-200/90 hover:border-sky-500 transition-all p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group shadow-xs hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
              
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs">
                  <span className="text-sky-900 font-extrabold text-base bg-sky-100 px-3 py-1 rounded-lg border border-sky-300 shadow-2xs">
                    02
                  </span>
                  <span className="text-sky-800 font-extrabold tracking-wider">SOFTWARE & WORKFLOW</span>
                </div>
                
                <h3 className="text-2xl font-extrabold text-slate-950 mb-3 group-hover:text-sky-700 transition-colors">
                  Web Applications
                </h3>
                
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
            <div className="bg-white border-2 border-amber-200/90 hover:border-amber-500 transition-all p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group shadow-xs hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-[#E11D48]" />
              
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs">
                  <span className="text-amber-950 font-extrabold text-base bg-amber-100 px-3 py-1 rounded-lg border border-amber-300 shadow-2xs">
                    03
                  </span>
                  <span className="text-amber-800 font-extrabold tracking-wider">INFRASTRUCTURE & CLOUD</span>
                </div>
                
                <h3 className="text-2xl font-extrabold text-slate-950 mb-3 group-hover:text-amber-700 transition-colors">
                  IT Solutions
                </h3>
                
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
                    <div key={item} className="flex items-start gap-2.5 text-slate-600">
                      <span className="text-orange-600 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">ปรึกษา IT Solution</span>
                <a href="#contact" className="text-orange-600 font-bold hover:text-orange-800 flex items-center gap-1.5 transition-colors">
                  <span>ติดต่อเรา</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 05. REALISTIC IOT DASHBOARD SHOWCASE (High-Contrast Digital Lab) ================= */}
      <section id="iot-dashboard" className="py-20 sm:py-28 border-b border-slate-300/80 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-slate-200 gap-4">
            <div>
              <span className="font-mono text-xs text-[#E11D48] uppercase tracking-wider block mb-2 font-extrabold flex items-center gap-2">
                <Radio size={14} className="animate-pulse text-[#E11D48]" />
                <span>[ LIVE DEMONSTRATION // HARDWARE: ESP32-C3 SMART SWITCH ]</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-950">
                ตัวอย่างระบบ IoT Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 font-normal">
                ควบคุมอุปกรณ์และติดตามข้อมูลจากที่เดียว (ลองกดเปิด-ปิดรีเลย์เพื่อทดสอบการตอบสนองได้จริง)
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
                          : 'bg-white border-slate-200/90 hover:border-slate-400 shadow-xs'
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
                          className={`px-3.5 py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 shadow-xs ${
                            device.relayStatus
                              ? 'bg-gradient-to-r from-[#E11D48] to-[#EA580C] text-white hover:brightness-105 shadow-rose-300/50'
                              : 'bg-slate-200 text-slate-800 hover:bg-slate-300 border border-slate-300'
                          }`}
                        >
                          <Power size={12} />
                          <span>{device.relayStatus ? 'ปิดสวิตช์' : 'เปิดสวิตช์'}</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Recharts Live Visualization (Clean High-Contrast Container) */}
              <div className="p-6 bg-white border-2 border-slate-200/90 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Activity size={15} className="text-[#E11D48]" />
                    <span className="text-slate-950 font-extrabold">
                      กราฟแนวโน้มอุณหภูมิและความชื้น: <span className="text-[#0284C7]">{selectedDevice.name}</span> ({selectedDevice.hardwareModel})
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300 font-extrabold">
                    09:41 - 10:01 LIVE
                  </span>
                </div>

                <div className="h-52 w-full">
                  {isClientMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedDevice.telemetryHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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

                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between font-mono text-[11px] text-slate-700 font-medium">
                  <div className="flex items-center gap-5">
                    <span>สัญญาณ: <strong className="text-emerald-800">{selectedDevice.wifiSignalDbm} dBm</strong></span>
                    <span>Latency: <strong className="text-sky-800">{selectedDevice.connectionLatencyMs ? `${selectedDevice.connectionLatencyMs} ms` : 'N/A'}</strong></span>
                  </div>
                  <span>Last Seen: <strong className="text-amber-900">{selectedDevice.lastSeenTimestamp}</strong></span>
                </div>
              </div>

            </div>

            {/* Right Column: Event History */}
            <div className="lg:col-span-4 bg-white border-2 border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 font-mono text-xs">
                <span className="text-slate-950 font-extrabold flex items-center gap-2">
                  <Clock size={15} className="text-[#E11D48]" />
                  <span>EVENT HISTORY</span>
                </span>
                <span className="text-[10px] text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300 font-bold">
                  REALTIME
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
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

      {/* ================= 04.E REAL PROJECT SHOWCASE ================= */}
      <section id="works" className="py-20 sm:py-28 border-b border-slate-300/80 bg-[#FAFAFC] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-slate-200/80 gap-4">
            <div>
              <span className="font-mono text-xs text-emerald-700 uppercase tracking-wider block mb-2 font-extrabold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>[ REAL PORTFOLIO & WORKS ]</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-950">
                ผลงานและโปรเจกต์จริง
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 font-normal">
                โปรเจกต์ซอฟต์แวร์และฮาร์ดแวร์ที่พัฒนาและทดสอบการทำงานจริง จากฐานข้อมูล Google Sheets
              </p>
            </div>

            {/* Dynamic Category Filter with High Contrast */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSelectedWorkCategory('all')}
                className={`px-4 py-2 rounded-xl border-2 transition-all ${
                  selectedWorkCategory === 'all'
                    ? 'bg-[#E11D48] text-white border-[#E11D48] font-bold shadow-xs'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-slate-500 font-bold'
                }`}
              >
                ทั้งหมด (ALL)
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedWorkCategory(cat)}
                  className={`px-4 py-2 rounded-xl border-2 transition-all uppercase ${
                    selectedWorkCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#E11D48] text-white border-[#E11D48] font-bold shadow-xs'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-slate-500 font-bold'
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
                className="bg-white border-2 border-slate-200/90 hover:border-[#E11D48] transition-all rounded-2xl flex flex-col justify-between overflow-hidden group shadow-xs hover:shadow-xl transform hover:-translate-y-1"
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
                      className="text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-1 font-bold"
                    >
                      <span>ดูรายละเอียด</span>
                      <ChevronRight size={14} className="text-[#0284C7]" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {project.manualUrl && (
                        <a
                          href={project.manualUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-900 hover:text-sky-950 bg-sky-100 hover:bg-sky-200 border border-sky-300 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1 shadow-2xs"
                          title="เปิดดูคู่มือการใช้งาน"
                        >
                          <FileText size={12} />
                          <span>คู่มือ</span>
                        </a>
                      )}

                      {project.demoUrl ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white bg-gradient-to-r from-[#E11D48] to-[#EA580C] hover:brightness-105 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                          title="เปิดดูเนื้อหา / Live Demo"
                        >
                          <span>เปิดดูเนื้อหา</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-slate-500 text-[11px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Production</span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Clean Empty State when no real projects exist */}
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

      {/* ================= 04.F THAI BUSINESS CTA & CONTACT (High-Impact Contrast) ================= */}
      <section id="contact" className="py-20 sm:py-28 border-b border-slate-300/80 bg-white relative overflow-hidden">
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <span className="font-mono text-xs text-[#E11D48] uppercase tracking-wider block mb-3 font-extrabold">
            [ ติดต่อสอบถาม / เริ่มต้นโปรเจกต์ ]
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
              className="w-full sm:w-auto px-8 py-4 bg-[#06C755] hover:bg-[#05b34c] text-white font-mono text-xs uppercase tracking-wider font-extrabold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(6,199,85,0.35)] transform hover:-translate-y-0.5"
            >
              <MessageCircle size={18} />
              <span>คุยกับเราใน LINE →</span>
            </a>

            {/* Email - Crisp Deep Slate / Rose */}
            <a
              href={`mailto:${siteConfig.contact_email || 'hello@deedeviot.com'}`}
              className="w-full sm:w-auto px-8 py-4 bg-slate-950 hover:bg-[#E11D48] text-white font-mono text-xs uppercase tracking-wider font-extrabold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-md transform hover:-translate-y-0.5"
            >
              <Mail size={18} />
              <span>ส่งอีเมลปรึกษาเรา</span>
            </a>
          </div>

          {/* Direct Channels Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left font-mono text-xs">
            <div className="p-4 bg-emerald-50/60 border-2 border-emerald-200/90 rounded-2xl shadow-2xs">
              <span className="text-[10px] text-emerald-800 block mb-1 font-extrabold">LINE OFFICIAL</span>
              <span className="text-slate-950 font-extrabold">{siteConfig.contact_line || '@DEEDEVIOT'}</span>
            </div>

            <div className="p-4 bg-rose-50/60 border-2 border-rose-200/90 rounded-2xl shadow-2xs">
              <span className="text-[10px] text-rose-800 block mb-1 font-extrabold">EMAIL</span>
              <a href={`mailto:${siteConfig.contact_email || 'hello@deedeviot.com'}`} className="text-slate-950 font-extrabold hover:text-[#E11D48] break-all">
                {siteConfig.contact_email || 'hello@deedeviot.com'}
              </a>
            </div>

            <div className="p-4 bg-amber-50/60 border-2 border-amber-200/90 rounded-2xl shadow-2xs">
              <span className="text-[10px] text-amber-800 block mb-1 font-extrabold">TELEPHONE</span>
              <a href={`tel:${siteConfig.contact_phone || '02-123-4567'}`} className="text-slate-950 font-extrabold hover:text-[#EA580C]">
                {siteConfig.contact_phone || '02-123-4567'}
              </a>
            </div>

            <div className="p-4 bg-sky-50/60 border-2 border-sky-200/90 rounded-2xl shadow-2xs">
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

      {/* ================= FOOTER (Crisp Dark Slate Anchor) ================= */}
      <footer id="about" className="py-14 bg-[#0F172A] text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 font-mono text-sm tracking-wider font-bold mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
                <span className="text-white">DEEDEV</span>
                <span className="text-[#EA580C]">/</span>
                <span className="bg-gradient-to-r from-[#EA580C] to-[#E11D48] bg-clip-text text-transparent">IOT</span>
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
                <li><a href="#iot-dashboard" className="hover:text-[#E11D48] transition-colors">IoT Dashboard Showcase</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase text-white font-bold mb-3 tracking-wider">เมนูเว็บไซต์</h4>
              <ul className="space-y-1.5 font-mono text-xs text-slate-400">
                <li><a href="#hero" className="hover:text-white transition-colors">หน้าแรก (Home)</a></li>
                <li><a href="#works" className="hover:text-white transition-colors">ผลงานจริง (Works)</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">ติดต่อเรา (Contact)</a></li>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Cover Image if available */}
            {activeProjectModal.imageUrl && (
              <div className="relative h-48 sm:h-56 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 overflow-hidden rounded-t-2xl bg-slate-100 border-b border-slate-200">
                <img
                  src={activeProjectModal.imageUrl}
                  alt={activeProjectModal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 text-xs font-mono text-slate-800 font-bold shadow-xs">
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
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg border border-slate-200 bg-slate-50 transition-colors"
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

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 font-mono">
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                className="px-4 py-2 border border-slate-200 text-xs text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
              >
                ปิดหน้าต่าง
              </button>

              <div className="flex items-center gap-2">
                {activeProjectModal.manualUrl && (
                  <a
                    href={activeProjectModal.manualUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 hover:text-sky-900 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <FileText size={13} />
                    <span>เปิดดูคู่มือ (Documentation)</span>
                  </a>
                )}

                {activeProjectModal.demoUrl && (
                  <a
                    href={activeProjectModal.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-gradient-to-r from-[#E11D48] to-[#EA580C] hover:brightness-105 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>เปิดดูเนื้อหา (Live Demo)</span>
                    <ExternalLink size={13} />
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
