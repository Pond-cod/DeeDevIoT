"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Server, Cpu, Wifi, Globe, ArrowRight, ExternalLink,
  Database, Phone, Mail, MessageCircle,
  X, Menu, Lock, Activity, ArrowDown, Power,
  Clock, CheckCircle2, ChevronRight, Layers, Sliders, RefreshCw,
  Sparkles, ShieldCheck, Check, Radio, Gauge, Zap
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

interface ProjectItem {
  id: string;
  name: string;
  category: string;
  categoryKey: 'web' | 'iot' | 'interactive';
  description: string;
  technologies: string[];
  imageUrl: string;
  demoUrl?: string;
  architectureDetails: string[];
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

const REAL_PROJECTS_PORTFOLIO: ProjectItem[] = [
  {
    id: 'smart-wallet',
    name: 'Smart Wallet',
    category: 'Web Application',
    categoryKey: 'web',
    description: 'เว็บแอปพลิเคชันจัดการรายรับ-รายจ่ายส่วนบุคคล วิเคราะห์หมวดหมู่การเงินแบบเรียลไทม์ พร้อมแดชบอร์ดสรุปงบประมาณ ช่วยให้ธุรกิจขนาดเล็กและบุคคลบริหารสภาพคล่องได้อย่างแม่นยำ',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Chart.js'],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://smart-wallet.vercel.app',
    architectureDetails: [
      'Frontend: Next.js Responsive Web Dashboard',
      'Backend API: RESTful Endpoints พร้อม Validation รัดกุม',
      'Database: PostgreSQL Relational Database Schema'
    ]
  },
  {
    id: 'minimal-weather',
    name: 'Minimal Weather Station',
    category: 'IoT & Telemetry',
    categoryKey: 'iot',
    description: 'ระบบตรวจวัดสภาพแวดล้อมและสภาพอากาศ เชื่อมต่อเซนเซอร์ตรวจวัดอุณหภูมิ ความชื้น และความกดอากาศ ส่งข้อมูลขึ้น Web Dashboard ผ่านโปรโตคอลความเร็วสูงตลอด 24 ชม.',
    technologies: ['ESP32', 'React', 'MQTT Protocol', 'REST API', 'BME280 Sensor'],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://minimal-weather.vercel.app',
    architectureDetails: [
      'Hardware: บอร์ดไมโครคอนโทรลเลอร์ ESP32 + BME280',
      'Protocol: Lightweight MQTT Telemetry Pipeline',
      'Interface: React Real-time Telemetry Dashboard'
    ]
  },
  {
    id: 'sudoku-engine',
    name: 'Sudoku Algorithm Engine',
    category: 'Web Application',
    categoryKey: 'web',
    description: 'เว็บแอปพลิเคชันคำนวณและแก้โจทย์ซูโดกุด้วย Recursive Backtracking Algorithm พร้อมระบบสร้างตารางตามระดับความยาก และประวัติการย้อนกลับสถานะการเดินเกม',
    technologies: ['TypeScript', 'React', 'Tailwind CSS', 'Algorithm Engine'],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://sudoku.vercel.app',
    architectureDetails: [
      'Logic Engine: Recursive Backtracking Solver',
      'State Management: Immutable Undo/Redo Stack',
      'Responsive Grid: Mobile-first Interactive Board'
    ]
  },
  {
    id: 'duck-hunt-arcade',
    name: 'Duck Hunt Arcade Canvas',
    category: 'Interactive Systems',
    categoryKey: 'interactive',
    description: 'ระบบเกมเชิงโต้ตอบบนเว็บเบราว์เซอร์ พัฒนาด้วย HTML5 Canvas และ Web Audio API จำลองการคำนวณการชน (Collision Detection) แบบ 60 FPS ไร้ความหน่วง',
    technologies: ['HTML5 Canvas', 'JavaScript (ES6)', 'Web Audio API', 'Game Physics'],
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://duck-hunt.vercel.app',
    architectureDetails: [
      'Render Loop: RequestAnimationFrame 60 FPS Cycle',
      'Physics Engine: 2D Bounding Box Collision Detection',
      'Audio: Web Audio Synthesizer Engine'
    ]
  },
  {
    id: 'cookie-runner',
    name: 'Cookie Runner Engine',
    category: 'Interactive Systems',
    categoryKey: 'interactive',
    description: 'เกมวิ่ง 2 มิติจำลองการเคลื่อนที่และแรงโน้มถ่วงบนเว็บ พร้อมการคำนวณคะแนนแบบเรียลไทม์และการจัดเก็บสถิติผู้เล่นผ่าน LocalStorage API',
    technologies: ['JavaScript', 'HTML5', 'CSS Grid', 'LocalStorage API'],
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://cookie-runner.vercel.app',
    architectureDetails: [
      'Physics: Gravity Acceleration & Jumping Vector',
      'Storage: Client-side Persistent High Scores',
      'Asset Pipeline: Optimized Sprite Maps'
    ]
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
        const [servicesRes, configRes] = await Promise.all([
          fetch('/api/services', { cache: 'no-store' }),
          fetch('/api/config', { cache: 'no-store' })
        ]);
        const [servicesData, configData] = await Promise.all([
          servicesRes.json(),
          configRes.json()
        ]);
        if (servicesData.success && Array.isArray(servicesData.data) && servicesData.data.length > 0) {
          setCmsServices(servicesData.data);
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

  const allProjects: ProjectItem[] = [
    ...REAL_PROJECTS_PORTFOLIO,
    ...cmsServices.map((cmsItem, idx) => ({
      id: cmsItem.id || `cms-${idx}`,
      name: cmsItem.title,
      category: cmsItem.icon || 'Custom Solution',
      categoryKey: 'web' as const,
      description: cmsItem.description_th || cmsItem.description,
      technologies: ['Custom Software', 'Database', 'Integration'],
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      demoUrl: cmsItem.demoUrl || undefined,
      architectureDetails: ['ออกแบบระบบเฉพาะตามข้อกำหนดของงาน']
    }))
  ];

  const filteredProjects = selectedWorkCategory === 'all'
    ? allProjects
    : allProjects.filter(item => item.categoryKey === selectedWorkCategory);

  const selectedDevice = iotDevices.find(d => d.id === selectedDashboardDeviceId) || iotDevices[0];

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white selection:bg-[#FF334B]/30 selection:text-white font-sans antialiased relative">
      
      {/* Global Subtle Ambient Grid */}
      <div className="fixed inset-0 bg-tech-grid opacity-25 pointer-events-none z-0" />

      {/* ================= 04.A NAVIGATION ================= */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0A0B10]/90 backdrop-blur-md border-b border-[#262B38] py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
          : 'bg-transparent border-b border-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3 group focus:outline-none">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF334B] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF334B] shadow-[0_0_10px_#FF334B]" />
            </span>
            <div className="font-mono text-sm tracking-wider font-bold">
              <span className="text-white group-hover:text-[#FF334B] transition-colors">DEEDEV</span>
              <span className="text-[#FF6B00] mx-1">/</span>
              <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF334B] bg-clip-text text-transparent">IOT</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider text-[#A6B0C3]">
            <a href="#hero" className="hover:text-white hover:text-shadow transition-colors">Home</a>
            <a href="#services" className="hover:text-[#00D2FF] transition-colors">Services</a>
            <a href="#works" className="hover:text-[#10B981] transition-colors">Works</a>
            <a href="#iot-dashboard" className="hover:text-[#FF6B00] transition-colors flex items-center gap-1.5">
              <span>Solutions</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF334B] animate-pulse" />
            </a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-[#FF334B] transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold tracking-wider border border-[#FF334B]/40 bg-gradient-to-r from-[#FF334B]/10 to-[#FF6B00]/10 hover:border-[#FF334B] hover:bg-[#FF334B] hover:text-white text-rose-300 rounded-md transition-all shadow-[0_0_15px_rgba(255,51,75,0.15)]"
            >
              <span>ปรึกษาโปรเจกต์</span>
              <ArrowRight size={13} className="text-[#FF334B] group-hover:text-white" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded border border-[#262B38] bg-[#12151E] text-[#A6B0C3] hover:text-white"
              aria-label="เมนูหลัก"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#0A0B10]/98 backdrop-blur-xl pt-20 px-6 pb-8 flex flex-col justify-between">
          <nav className="flex flex-col space-y-4 font-mono text-sm tracking-wider text-[#A6B0C3]">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-[#262B38] hover:text-white">หน้าแรก (Home)</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-[#262B38] hover:text-[#00D2FF]">บริการที่รับทำ (Services)</a>
            <a href="#works" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-[#262B38] hover:text-[#10B981]">ผลงานจริง (Works)</a>
            <a href="#iot-dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-[#262B38] hover:text-white text-white flex items-center justify-between">
              <span className="text-[#FF6B00]">ระบบ IoT Dashboard</span>
              <span className="text-xs bg-red-500/20 text-[#FF334B] px-2 py-0.5 rounded border border-red-500/30 font-bold">LIVE</span>
            </a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-[#262B38] hover:text-white">เกี่ยวกับเรา (About)</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-[#262B38] hover:text-white">ช่องทางติดต่อ (Contact)</a>
          </nav>
          <div>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 bg-gradient-to-r from-[#FF334B] via-[#FF5252] to-[#FF6B00] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,51,75,0.4)]"
            >
              <span>ปรึกษาโปรเจกต์ฟรี</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}

      {/* ================= 04.B HERO SECTION ================= */}
      <section id="hero" className="relative pt-32 sm:pt-40 pb-20 border-b border-[#262B38] overflow-hidden">
        
        {/* Vibrant Ambient Glow Highlights */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-[#FF334B]/20 via-[#FF6B00]/10 to-transparent blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-[#00D2FF]/10 blur-[100px] pointer-events-none -z-10" />
        <div className="absolute top-2/3 -left-32 w-[400px] h-[400px] bg-[#10B981]/10 blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Badge with energetic gradient border */}
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF334B]/15 via-[#FF6B00]/10 to-[#00D2FF]/15 border border-[#FF334B]/40 text-xs font-mono text-rose-200 flex items-center gap-2.5 shadow-[0_0_15px_rgba(255,51,75,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#FF334B] shadow-[0_0_8px_#FF334B] animate-pulse" />
              <span className="text-white font-bold tracking-wider">DEEDEV IOT</span>
              <span className="text-[#FF6B00]">/</span>
              <span className="text-[#A6B0C3]">Thailand Technology Studio</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.18] mb-6">
                มีไอเดีย แต่ยังไม่รู้จะทำ
                <span className="block mt-1 bg-gradient-to-r from-[#FF334B] via-[#FF6B00] to-[#FFB800] bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(255,107,0,0.3)]">
                  ระบบอย่างไร?
                </span>
              </h1>

              <h2 className="text-lg sm:text-2xl font-semibold text-white mb-4 leading-snug">
                DeeDevIOT ช่วยเปลี่ยนไอเดียของคุณให้กลายเป็น{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D2FF] via-[#10B981] to-[#FFB800]">
                  Web Application, IoT และระบบ IT
                </span>{' '}
                ที่ใช้งานได้จริงโดยทีมงานคนไทย
              </h2>

              <p className="text-sm sm:text-base text-[#A6B0C3] max-w-2xl leading-relaxed mb-8 font-light">
                ตั้งแต่การออกแบบระบบ พัฒนาโปรแกรม เชื่อมต่ออุปกรณ์ ไปจนถึงนำระบบไปใช้งานจริง สำหรับเจ้าของธุรกิจ SME โรงงาน และผู้ที่ต้องการลดงาน Manual ด้วยระบบดิจิทัล
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                <a
                  href="#contact"
                  className="px-8 py-4 bg-gradient-to-r from-[#FF334B] via-[#FF5252] to-[#FF6B00] hover:from-[#d32f2f] hover:to-[#e65100] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition-all flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(255,51,75,0.45)] hover:shadow-[0_0_35px_rgba(255,51,75,0.6)] transform hover:-translate-y-0.5"
                >
                  <Sparkles size={16} />
                  <span>ปรึกษาโปรเจกต์</span>
                  <ArrowRight size={15} />
                </a>

                <a
                  href="#works"
                  className="px-8 py-4 bg-[#12151E] text-white border border-[#262B38] hover:border-[#00D2FF] hover:text-[#00D2FF] font-mono text-xs uppercase tracking-wider font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm transform hover:-translate-y-0.5"
                >
                  <span>ดูผลงานจริง</span>
                  <ArrowDown size={14} className="text-[#00D2FF]" />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#A6B0C3]">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span>รับพัฒนาตามโจทย์จริง</span>
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <CheckCircle2 size={14} />
                  <span>ส่งมอบ Source Code 100%</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <CheckCircle2 size={14} />
                  <span>ปรึกษาแนวทางเทคนิคฟรี</span>
                </span>
              </div>
            </div>

            {/* Right: Vibrant Connected Pipeline Card */}
            <div className="lg:col-span-5 bg-[#12151E]/95 border border-[#262B38] rounded-xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-sm">
              
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10B981] via-[#00D2FF] to-[#FF334B]" />

              <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#262B38] font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <Activity size={15} className="text-[#FF334B] animate-pulse" />
                  <span className="text-white font-bold tracking-wider">REAL SYSTEM PIPELINE</span>
                </div>
                <span className="text-[#00D2FF] font-semibold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                  DATA FLOW
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                
                {/* 01 Hardware */}
                <div className="p-3 bg-[#0A0B10] border border-emerald-500/40 hover:border-emerald-400 rounded-lg flex items-center justify-between transition-all group shadow-[0_0_15px_rgba(16,185,129,0.08)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Cpu size={16} />
                    </div>
                    <div>
                      <div className="text-emerald-300 font-bold text-xs">01 // ESP32 / IoT Device</div>
                      <div className="text-[10px] text-[#A6B0C3]">เซนเซอร์ตรวจวัด, สวิตช์รีเลย์, ไมโครคอนโทรลเลอร์</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    GPIO / I2C
                  </span>
                </div>

                <div className="flex justify-center my-0.5 text-emerald-400">↓</div>

                {/* 02 Protocol */}
                <div className="p-3 bg-[#0A0B10] border border-cyan-500/40 hover:border-cyan-400 rounded-lg flex items-center justify-between transition-all group shadow-[0_0_15px_rgba(0,210,255,0.08)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <Wifi size={16} />
                    </div>
                    <div>
                      <div className="text-cyan-300 font-bold text-xs">02 // MQTT / REST API</div>
                      <div className="text-[10px] text-[#A6B0C3]">โปรโตคอลรับส่งข้อมูลความเร็วสูง ไร้ความหน่วง</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-bold bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">
                    TLS / JSON
                  </span>
                </div>

                <div className="flex justify-center my-0.5 text-cyan-400">↓</div>

                {/* 03 Web Dashboard */}
                <div className="p-3 bg-[#0A0B10] border border-amber-500/40 hover:border-amber-400 rounded-lg flex items-center justify-between transition-all group shadow-[0_0_15px_rgba(255,184,0,0.08)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Globe size={16} />
                    </div>
                    <div>
                      <div className="text-amber-300 font-bold text-xs">03 // Web Dashboard</div>
                      <div className="text-[10px] text-[#A6B0C3]">หน้าจอควบคุม สั่งการ และติดตามข้อมูลจากทุกอุปกรณ์</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                    Responsive
                  </span>
                </div>

                <div className="flex justify-center my-0.5 text-rose-400">↓</div>

                {/* 04 Business Value */}
                <div className="p-3.5 bg-gradient-to-r from-red-600/25 via-orange-600/20 to-rose-600/25 border border-[#FF334B]/50 rounded-lg text-center shadow-[0_0_20px_rgba(255,51,75,0.2)]">
                  <span className="text-white font-bold text-xs block mb-0.5">
                    04 // Business Value ที่วัดผลได้จริง
                  </span>
                  <span className="text-[11px] text-rose-200">
                    ลดงาน Manual • ลดความผิดพลาด • ข้อมูลพร้อมตัดสินใจทันที
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 04.C QUICK VALUE / TRUST SECTION (Vibrant Capabilities) ================= */}
      <section className="py-16 border-b border-[#262B38] bg-[#0E1017] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-2">
              ทำระบบให้เหมาะกับงาน{' '}
              <span className="bg-gradient-to-r from-[#FF334B] to-[#FF6B00] bg-clip-text text-transparent">
                ไม่ใช่เอางานไปยัดใส่ Template
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#A6B0C3] leading-relaxed">
              เราออกแบบโครงสร้างซอฟต์แวร์และฮาร์ดแวร์ตามขั้นตอนการทำงานจริงของคุณ เพื่อให้ระบบตอบสนองได้ตรงจุดที่สุดและสามารถต่อยอดในอนาคตได้
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5 font-mono text-center text-xs">
            {[
              { title: 'Web Application', desc: 'ระบบเว็บองค์กร', color: 'from-cyan-500 to-blue-500', textCol: 'text-cyan-400', borderHover: 'hover:border-cyan-400' },
              { title: 'IoT System', desc: 'เชื่อมต่อฮาร์ดแวร์', color: 'from-emerald-500 to-teal-400', textCol: 'text-emerald-400', borderHover: 'hover:border-emerald-400' },
              { title: 'Dashboard', desc: 'สรุปข้อมูลสด', color: 'from-amber-400 to-orange-500', textCol: 'text-amber-400', borderHover: 'hover:border-amber-400' },
              { title: 'Automation', desc: 'ลดงานซ้ำซ้อน', color: 'from-purple-400 to-indigo-500', textCol: 'text-purple-400', borderHover: 'hover:border-purple-400' },
              { title: 'API Integration', desc: 'เชื่อมต่อภายนอก', color: 'from-rose-500 to-red-500', textCol: 'text-rose-400', borderHover: 'hover:border-rose-400' },
              { title: 'Database', desc: 'จัดเก็บข้อมูลปลอดภัย', color: 'from-blue-400 to-cyan-500', textCol: 'text-blue-400', borderHover: 'hover:border-blue-400' },
              { title: 'IT Solutions', desc: 'วางระบบโครงสร้าง', color: 'from-orange-500 to-amber-500', textCol: 'text-orange-400', borderHover: 'hover:border-orange-400' }
            ].map((cap) => (
              <div 
                key={cap.title} 
                className={`p-4 rounded-xl bg-[#12151E] border border-[#262B38] ${cap.borderHover} transition-all transform hover:-translate-y-1 shadow-sm group`}
              >
                <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${cap.color} mx-auto mb-3 group-hover:w-12 transition-all`} />
                <div className={`font-bold text-xs mb-1 ${cap.textCol}`}>{cap.title}</div>
                <div className="text-[#A6B0C3] text-[10px]">{cap.desc}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 04.D SERVICES (3 Main Pillars with Rich Accents) ================= */}
      <section id="services" className="py-20 sm:py-28 border-b border-[#262B38] relative">
        
        {/* Glow ambient */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-[#262B38]">
            <div>
              <span className="font-mono text-xs text-[#FF334B] uppercase tracking-wider block mb-2 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF334B]" />
                <span>[ OUR SERVICES ]</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                บริการพัฒนาและวางระบบ
              </h2>
            </div>
            <p className="text-xs font-mono text-[#A6B0C3] mt-3 sm:mt-0">
              3 ด้านความเชี่ยวชาญหลักเพื่อธุรกิจไทย
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            
            {/* 01 IoT Solutions (Emerald Theme) */}
            <div className="bg-[#12151E] border border-emerald-500/30 hover:border-emerald-400 transition-all p-7 rounded-xl flex flex-col justify-between relative overflow-hidden group shadow-[0_5px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_35px_rgba(16,185,129,0.15)]">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />
              
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs">
                  <span className="text-emerald-400 font-extrabold text-base bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                    01
                  </span>
                  <span className="text-emerald-300 font-bold tracking-wider">HARDWARE & SENSORS</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                  IoT Solutions
                </h3>
                
                <p className="text-xs text-[#A6B0C3] leading-relaxed mb-6">
                  ออกแบบระบบเชื่อมต่ออุปกรณ์ Sensor และ Microcontroller พร้อม Dashboard และระบบจัดเก็บข้อมูลแบบครบวงจร
                </p>

                <div className="space-y-2.5 pt-4 border-t border-[#262B38] font-mono text-xs">
                  {[
                    'ESP32 & ESP32-C3 Firmware Development',
                    'Sensors ตรวจวัด (อุณหภูมิ, ความชื้น, แรงดัน, การเคลื่อนไหว)',
                    'MQTT & WebSockets สำหรับข้อมูลความเร็วสูง',
                    'ระบบควบคุมเปิด-ปิดรีเลย์ และสวิตช์ระยะไกล',
                    'แจ้งเตือนฉุกเฉินผ่าน LINE Notify / LINE Bot'
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-[#A6B0C3]">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#262B38] flex items-center justify-between text-xs font-mono">
                <span className="text-[#A6B0C3]">ปรึกษางาน IoT</span>
                <a href="#contact" className="text-emerald-400 font-bold hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>ติดต่อเรา</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* 02 Web Applications (Cyan/Blue Theme) */}
            <div className="bg-[#12151E] border border-cyan-500/30 hover:border-cyan-400 transition-all p-7 rounded-xl flex flex-col justify-between relative overflow-hidden group shadow-[0_5px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_35px_rgba(0,210,255,0.15)]">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
              
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs">
                  <span className="text-cyan-400 font-extrabold text-base bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                    02
                  </span>
                  <span className="text-cyan-300 font-bold tracking-wider">SOFTWARE & WORKFLOW</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  Web Applications
                </h3>
                
                <p className="text-xs text-[#A6B0C3] leading-relaxed mb-6">
                  พัฒนา Web Application และระบบหลังบ้านตาม Workflow ของธุรกิจ จัดการข้อมูลให้เป็นระบบและเข้าถึงได้ทุกที่
                </p>

                <div className="space-y-2.5 pt-4 border-t border-[#262B38] font-mono text-xs">
                  {[
                    'ระบบจัดการภายใน (Management System)',
                    'แดชบอร์ดสรุปยอดขายและข้อมูลสถิติ (Dashboard)',
                    'ระบบจัดการสต็อกสินค้าและคลังสินค้า (Inventory)',
                    'ระบบจองคิวและการลงเวลา (Booking & Workflow)',
                    'ระบบยืนยันตัวตนและความปลอดภัย (Authentication)'
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-[#A6B0C3]">
                      <span className="text-cyan-400 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#262B38] flex items-center justify-between text-xs font-mono">
                <span className="text-[#A6B0C3]">ปรึกษา Web App</span>
                <a href="#contact" className="text-cyan-400 font-bold hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>ติดต่อเรา</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* 03 IT Solutions (Orange/Red Theme) */}
            <div className="bg-[#12151E] border border-orange-500/30 hover:border-orange-400 transition-all p-7 rounded-xl flex flex-col justify-between relative overflow-hidden group shadow-[0_5px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_35px_rgba(255,107,0,0.15)]">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-rose-500 to-[#FF334B]" />
              
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs">
                  <span className="text-orange-400 font-extrabold text-base bg-orange-500/10 px-2.5 py-1 rounded border border-orange-500/20">
                    03
                  </span>
                  <span className="text-orange-300 font-bold tracking-wider">INFRASTRUCTURE & CLOUD</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                  IT Solutions
                </h3>
                
                <p className="text-xs text-[#A6B0C3] leading-relaxed mb-6">
                  ช่วยวางระบบและพัฒนาโซลูชันด้าน IT ให้เหมาะกับการใช้งานจริง เสถียร ปลอดภัย และดูแลรักษาง่าย
                </p>

                <div className="space-y-2.5 pt-4 border-t border-[#262B38] font-mono text-xs">
                  {[
                    'ออกแบบสถาปัตยกรรมระบบ API และ Database',
                    'ติดตั้งและบริหารจัดการ Server / Cloud (Vercel, GCP, VPS)',
                    'ระบบสำรองข้อมูลอัตโนมัติ (Automated Backup)',
                    'System Integration เชื่อมต่อซอฟต์แวร์เดิมเข้าหากัน',
                    'ให้คำปรึกษาทางเทคนิคสำหรับองค์กรและฝ่าย IT'
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-[#A6B0C3]">
                      <span className="text-orange-400 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#262B38] flex items-center justify-between text-xs font-mono">
                <span className="text-[#A6B0C3]">ปรึกษา IT Solution</span>
                <a href="#contact" className="text-orange-400 font-bold hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>ติดต่อเรา</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 05. REALISTIC IOT DASHBOARD SHOWCASE (Interactive Section with Vibrant UI) ================= */}
      <section id="iot-dashboard" className="py-20 sm:py-28 border-b border-[#262B38] bg-[#0E1017] relative overflow-hidden">
        
        {/* Colorful Glow Backgrounds */}
        <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] bg-red-600/10 blur-[130px] pointer-events-none -z-10" />
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-[#262B38]">
            <div>
              <span className="font-mono text-xs text-[#FF334B] uppercase tracking-wider block mb-2 font-bold flex items-center gap-2">
                <Radio size={14} className="animate-pulse text-[#FF334B]" />
                <span>[ LIVE DEMONSTRATION // HARDWARE: ESP32-C3 SMART SWITCH ]</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                ตัวอย่างระบบ IoT Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-[#A6B0C3] mt-2">
                ควบคุมอุปกรณ์และติดตามข้อมูลจากที่เดียว (ลองกดเปิด-ปิดรีเลย์เพื่อทดสอบการตอบสนองได้จริง)
              </p>
            </div>
            
            <div className="flex items-center gap-2.5 mt-4 sm:mt-0 font-mono text-xs bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
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
                      className={`p-5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#12151E] border-[#FF334B] shadow-[0_0_25px_rgba(255,51,75,0.25)]' 
                          : 'bg-[#12151E] border-[#262B38] hover:border-[#3F485C]'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#262B38]">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{device.name}</span>
                          </h4>
                          <span className="text-[10px] font-mono text-[#A6B0C3]">{device.locationName}</span>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 ${
                          isOnline ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                          isWarning ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
                          'bg-[#262B38] text-zinc-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : isWarning ? 'bg-amber-400' : 'bg-zinc-500'}`} />
                          <span>{device.connectionStatus}</span>
                        </span>
                      </div>

                      {/* Vivid Sensor Cards */}
                      <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
                        <div className="bg-gradient-to-br from-red-500/15 to-orange-500/5 p-3 rounded-lg border border-red-500/25">
                          <span className="text-rose-300 block text-[10px] font-semibold">อุณหภูมิ</span>
                          <span className="text-white font-extrabold text-base">{device.temperatureCelsius}°C</span>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-500/15 to-blue-500/5 p-3 rounded-lg border border-cyan-500/25">
                          <span className="text-cyan-300 block text-[10px] font-semibold">ความชื้น</span>
                          <span className="text-white font-extrabold text-base">{device.humidityPercentage}%</span>
                        </div>
                      </div>

                      {/* Vibrant Relay Switch Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#262B38] font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#A6B0C3] text-[11px]">สถานะรีเลย์:</span>
                          <span className={`font-bold text-[11px] ${device.relayStatus ? 'text-[#FF334B]' : 'text-zinc-500'}`}>
                            {device.relayStatus ? 'เปิด (ON)' : 'ปิด (OFF)'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleRelay(device.id);
                          }}
                          className={`px-3.5 py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 ${
                            device.relayStatus
                              ? 'bg-gradient-to-r from-[#FF334B] to-[#FF6B00] text-white shadow-[0_0_15px_rgba(255,51,75,0.6)] hover:brightness-110'
                              : 'bg-[#1E2330] text-[#A6B0C3] hover:text-white border border-[#262B38]'
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

              {/* Real-time Recharts Visualization for Selected Node with Vibrant Colors */}
              <div className="p-6 bg-[#12151E] border border-[#262B38] rounded-xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#262B38] font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Activity size={15} className="text-[#FF334B]" />
                    <span className="text-white font-bold">
                      กราฟแนวโน้มอุณหภูมิและความชื้น: <span className="text-[#00D2FF]">{selectedDevice.name}</span> ({selectedDevice.hardwareModel})
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                    09:41 - 10:01 LIVE
                  </span>
                </div>

                <div className="h-52 w-full">
                  {isClientMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedDevice.telemetryHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF334B" stopOpacity={0.45}/>
                            <stop offset="95%" stopColor="#FF334B" stopOpacity={0.0}/>
                          </linearGradient>
                          <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.35}/>
                            <stop offset="95%" stopColor="#00D2FF" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262B38" />
                        <XAxis dataKey="time" stroke="#7A8499" fontSize={10} tickLine={false} />
                        <YAxis stroke="#7A8499" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0A0B10', borderColor: '#262B38', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}
                          labelStyle={{ color: '#FFB800', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="temp" name="อุณหภูมิ (°C)" stroke="#FF334B" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGradient)" />
                        <Area type="monotone" dataKey="humidity" name="ความชื้น (%)" stroke="#00D2FF" strokeWidth={2} fillOpacity={1} fill="url(#humGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs font-mono text-[#A6B0C3]">
                      กำลังโหลดข้อมูลการวัด...
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#262B38] flex flex-wrap items-center justify-between font-mono text-[11px] text-[#A6B0C3]">
                  <div className="flex items-center gap-5">
                    <span>สัญญาณ: <strong className="text-emerald-400">{selectedDevice.wifiSignalDbm} dBm</strong></span>
                    <span>Latency: <strong className="text-cyan-400">{selectedDevice.connectionLatencyMs ? `${selectedDevice.connectionLatencyMs} ms` : 'N/A'}</strong></span>
                  </div>
                  <span>Last Seen: <strong className="text-amber-400">{selectedDevice.lastSeenTimestamp}</strong></span>
                </div>
              </div>

            </div>

            {/* Right Column: Event History with Colorful Statuses */}
            <div className="lg:col-span-4 bg-[#12151E] border border-[#262B38] rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#262B38] font-mono text-xs">
                <span className="text-white font-bold flex items-center gap-2">
                  <Clock size={15} className="text-[#FF334B]" />
                  <span>EVENT HISTORY</span>
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 font-bold">
                  REALTIME
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {telemetryLogs.map((log) => (
                  <div key={log.eventId} className="p-3 bg-[#0A0B10] border border-[#262B38] rounded-lg">
                    <div className="flex items-center justify-between text-[10px] mb-1.5">
                      <span className="text-[#FF6B00] font-bold">{log.timestamp}</span>
                      <span className="text-cyan-300 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/50">
                        {log.deviceName}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A6B0C3] leading-relaxed">
                      {log.eventDescription}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-[#262B38] text-center">
                <span className="text-[11px] font-mono text-[#A6B0C3] block mb-2.5">
                  ต้องการสร้างระบบมอนิเตอร์และควบคุมแบบนี้ในธุรกิจของคุณ?
                </span>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-white bg-gradient-to-r from-[#FF334B] to-[#FF6B00] px-4 py-2 rounded-md hover:brightness-110 shadow-[0_0_15px_rgba(255,51,75,0.4)] transition-all"
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
      <section id="works" className="py-20 sm:py-28 border-b border-[#262B38] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#262B38] gap-4">
            <div>
              <span className="font-mono text-xs text-[#10B981] uppercase tracking-wider block mb-2 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>[ REAL PORTFOLIO ]</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                ผลงานและโปรเจกต์จริง
              </h2>
              <p className="text-xs sm:text-sm text-[#A6B0C3] mt-2">
                โปรเจกต์ซอฟต์แวร์และฮาร์ดแวร์ที่พัฒนาและทดสอบการทำงานจริง
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {[
                { key: 'all', label: 'ทั้งหมด (ALL)' },
                { key: 'web', label: 'WEB APPS' },
                { key: 'iot', label: 'IoT & SENSORS' },
                { key: 'interactive', label: 'INTERACTIVE' },
              ].map((categoryItem) => (
                <button
                  key={categoryItem.key}
                  type="button"
                  onClick={() => setSelectedWorkCategory(categoryItem.key)}
                  className={`px-3.5 py-1.5 rounded-lg border transition-all ${
                    selectedWorkCategory === categoryItem.key
                      ? 'bg-gradient-to-r from-[#FF334B] to-[#FF6B00] text-white border-transparent font-bold shadow-[0_0_15px_rgba(255,51,75,0.4)]'
                      : 'bg-[#12151E] text-[#A6B0C3] border-[#262B38] hover:border-white hover:text-white'
                  }`}
                >
                  {categoryItem.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="bg-[#12151E] border border-[#262B38] hover:border-[#FF334B]/70 transition-all rounded-xl flex flex-col justify-between overflow-hidden group shadow-[0_5px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_35px_rgba(255,51,75,0.2)] transform hover:-translate-y-1"
              >
                {/* Project Image Preview */}
                <div className="relative h-48 w-full overflow-hidden bg-[#0A0B10] border-b border-[#262B38]">
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#0A0B10]/90 backdrop-blur-sm border border-[#262B38] text-[10px] font-mono text-cyan-300 font-bold shadow-sm">
                    {project.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF334B] transition-colors">
                      {project.name}
                    </h3>
                    
                    <p className="text-xs text-[#A6B0C3] leading-relaxed mb-5 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Colorful Technology Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-6 font-mono text-[10px]">
                      {project.technologies.map((techItem) => (
                        <span
                          key={techItem}
                          className="px-2.5 py-0.5 rounded-md bg-[#0A0B10] border border-[#262B38] text-rose-200 group-hover:border-[#FF334B]/30"
                        >
                          {techItem}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#262B38] flex items-center justify-between font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveProjectModal(project)}
                      className="text-[#A6B0C3] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>ดูสถาปัตยกรรม</span>
                      <ChevronRight size={14} className="text-[#00D2FF]" />
                    </button>

                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF334B] hover:text-white transition-colors inline-flex items-center gap-1 font-bold"
                      >
                        <span>เปิด Live Demo</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-[#7A8499] text-[11px]">Production Code</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 04.F THAI BUSINESS CTA & CONTACT (Vibrant Action Bar) ================= */}
      <section id="contact" className="py-20 sm:py-28 border-b border-[#262B38] bg-[#0E1017] relative overflow-hidden">
        
        {/* Glow ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#FF334B]/20 via-[#06C755]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <span className="font-mono text-xs text-[#FF334B] uppercase tracking-wider block mb-3 font-bold">
            [ ติดต่อสอบถาม / เริ่มต้นโปรเจกต์ ]
          </span>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            มีระบบที่อยากทำ แต่ยังไม่รู้จะเริ่มตรงไหน?
          </h2>

          <h3 className="text-lg sm:text-2xl font-semibold bg-gradient-to-r from-white via-rose-100 to-[#FF6B00] bg-clip-text text-transparent mb-4">
            เล่าไอเดียหรือปัญหาของคุณให้เราฟังได้เลย
          </h3>
          
          <p className="text-[#A6B0C3] text-xs sm:text-sm max-w-xl mx-auto mb-10 leading-relaxed font-light">
            เราช่วยวิเคราะห์ ออกแบบ และพัฒนาระบบให้เหมาะกับการใช้งานจริง ไม่ว่าจะเป็นระบบขนาดเล็กหรือระบบเฉพาะทางขององค์กร ทักมาคุยกันได้โดยไม่มีข้อผูกมัด
          </p>

          {/* High-Impact Contact Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            
            {/* LINE Official - Thai standard LINE Green */}
            <a
              href={`https://line.me/ti/p/~${(siteConfig.contact_line || '@DEEDEVIOT').replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#06C755] hover:bg-[#05b34c] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition-all flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(6,199,85,0.45)] transform hover:-translate-y-0.5"
            >
              <MessageCircle size={18} />
              <span>คุยกับเราใน LINE →</span>
            </a>

            {/* Email - Vibrant Studio Red-Orange */}
            <a
              href={`mailto:${siteConfig.contact_email || 'hello@deedeviot.com'}`}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#FF334B] to-[#FF6B00] hover:brightness-110 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition-all flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(255,51,75,0.35)] transform hover:-translate-y-0.5"
            >
              <Mail size={18} />
              <span>ส่งอีเมลปรึกษาเรา</span>
            </a>
          </div>

          {/* Direct Channels Information Grid with Colored Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left font-mono text-xs">
            <div className="p-4 bg-[#12151E] border border-emerald-500/30 rounded-xl shadow-sm">
              <span className="text-[10px] text-emerald-400 block mb-1 font-bold">LINE OFFICIAL</span>
              <span className="text-white font-bold">{siteConfig.contact_line || '@DEEDEVIOT'}</span>
            </div>

            <div className="p-4 bg-[#12151E] border border-rose-500/30 rounded-xl shadow-sm">
              <span className="text-[10px] text-rose-400 block mb-1 font-bold">EMAIL</span>
              <a href={`mailto:${siteConfig.contact_email || 'hello@deedeviot.com'}`} className="text-white font-bold hover:text-[#FF334B] break-all">
                {siteConfig.contact_email || 'hello@deedeviot.com'}
              </a>
            </div>

            <div className="p-4 bg-[#12151E] border border-amber-500/30 rounded-xl shadow-sm">
              <span className="text-[10px] text-amber-400 block mb-1 font-bold">TELEPHONE</span>
              <a href={`tel:${siteConfig.contact_phone || '02-123-4567'}`} className="text-white font-bold hover:text-[#FFB800]">
                {siteConfig.contact_phone || '02-123-4567'}
              </a>
            </div>

            <div className="p-4 bg-[#12151E] border border-blue-500/30 rounded-xl shadow-sm">
              <span className="text-[10px] text-blue-400 block mb-1 font-bold">FACEBOOK</span>
              <a 
                href={siteConfig.facebook_url || "https://facebook.com/deedeviot"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white font-bold hover:text-[#00D2FF] flex items-center gap-1"
              >
                <span>DeeDevIOT</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="about" className="py-14 bg-[#0A0B10] border-t border-[#262B38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#262B38]">
            
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 font-mono text-sm tracking-wider font-bold mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF334B] shadow-[0_0_8px_#FF334B]" />
                <span className="text-white">DEEDEV</span>
                <span className="text-[#FF6B00]">/</span>
                <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF334B] bg-clip-text text-transparent">IOT</span>
              </div>
              <p className="text-xs text-[#A6B0C3] max-w-md leading-relaxed font-light mb-3">
                ทีม Developer คนไทยที่ทำระบบจริง และเข้าใจปัญหาของธุรกิจไทย รับพัฒนา Web Application, IoT, Dashboard และระบบ IT ตามความต้องการ
              </p>
              <div className="font-mono text-[11px] text-[#7A8499]">
                "เปลี่ยนไอเดียให้เป็นระบบที่ใช้งานได้จริง" • Turn Ideas Into Real Digital Solutions.
              </div>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase text-white font-bold mb-3 tracking-wider">บริการที่รับทำ</h4>
              <ul className="space-y-1.5 font-mono text-xs text-[#A6B0C3]">
                <li><a href="#services" className="hover:text-emerald-400 transition-colors">IoT Solutions & ESP32</a></li>
                <li><a href="#services" className="hover:text-cyan-400 transition-colors">Web Applications</a></li>
                <li><a href="#services" className="hover:text-orange-400 transition-colors">Custom IT Systems</a></li>
                <li><a href="#iot-dashboard" className="hover:text-[#FF334B] transition-colors">IoT Dashboard Showcase</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase text-white font-bold mb-3 tracking-wider">เมนูเว็บไซต์</h4>
              <ul className="space-y-1.5 font-mono text-xs text-[#A6B0C3]">
                <li><a href="#hero" className="hover:text-white transition-colors">หน้าแรก (Home)</a></li>
                <li><a href="#works" className="hover:text-white transition-colors">ผลงานจริง (Works)</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">ติดต่อเรา (Contact)</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#7A8499]">
            <div>
              © 2026 DEEDEV IOT. ALL RIGHTS RESERVED.
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[#A6B0C3]">DESIGNED FOR THAI BUSINESSES</span>
              <Link 
                href="/login" 
                className="p-1 text-[#7A8499] hover:text-[#FF334B] hover:bg-[#12151E] rounded transition-colors"
                title="Admin Console"
                aria-label="Admin Login"
              >
                <Lock size={12} />
              </Link>
            </div>
          </div>

        </div>
      </footer>

      {/* ================= ARCHITECTURE MODAL ================= */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0A0B10]/90 backdrop-blur-md">
          <div 
            className="w-full max-w-2xl bg-[#12151E] border border-[#262B38] rounded-xl p-6 sm:p-8 relative shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between pb-4 border-b border-[#262B38] mb-5">
              <div>
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-wider block mb-1 font-bold">
                  [ {activeProjectModal.category} ]
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {activeProjectModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                className="p-1.5 text-[#A6B0C3] hover:text-white rounded-lg border border-[#262B38] bg-[#0A0B10]"
                aria-label="ปิดหน้าต่าง"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#A6B0C3] leading-relaxed mb-6 font-light">
              {activeProjectModal.description}
            </p>

            {activeProjectModal.architectureDetails && (
              <div className="mb-6 p-4 rounded-lg bg-[#0A0B10] border border-cyan-500/20">
                <div className="font-mono text-xs text-cyan-300 font-bold uppercase mb-2">โครงสร้างสถาปัตยกรรม:</div>
                <ul className="space-y-1.5 font-mono text-xs text-[#A6B0C3]">
                  {activeProjectModal.architectureDetails.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-[#FF334B]">→</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-6">
              <span className="font-mono text-[11px] text-[#7A8499] block mb-2 uppercase">TECHNOLOGIES:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeProjectModal.technologies.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md bg-[#0A0B10] border border-[#262B38] text-xs font-mono text-rose-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#262B38] flex items-center justify-between font-mono">
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                className="px-4 py-2 border border-[#262B38] text-xs text-[#A6B0C3] hover:text-white rounded-md"
              >
                ปิดหน้าต่าง
              </button>

              {activeProjectModal.demoUrl && (
                <a
                  href={activeProjectModal.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-gradient-to-r from-[#FF334B] to-[#FF6B00] hover:brightness-110 text-white text-xs font-bold rounded-md inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,51,75,0.4)]"
                >
                  <span>เปิด Live Demo</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
