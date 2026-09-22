"use client";

import React, { useState, useEffect } from 'react';
import {
  Server, Cpu, Wifi, Globe, ArrowRight, ExternalLink,
  Database, Check, Phone, Mail, MessageCircle, Facebook,
  X, Menu, Lock, Activity, ArrowDown, Power,
  Clock, ShieldAlert, CheckCircle2, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// ================= TYPES & INTERFACES =================
interface ProjectItem {
  id: string;
  name: string;
  category: string;
  categoryKey: 'web' | 'iot' | 'interactive';
  description: string;
  technologies: string[];
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
  isToggling?: boolean;
}

interface DeviceTelemetryEvent {
  eventId: string;
  timestamp: string;
  deviceName: string;
  eventDescription: string;
  severity: 'info' | 'warning' | 'normal';
}

// 5 Verified Real Projects Associated with DeeDevIOT Portfolio
const REAL_PROJECTS_PORTFOLIO: ProjectItem[] = [
  {
    id: 'smart-wallet',
    name: 'Smart Wallet',
    category: 'Web Application',
    categoryKey: 'web',
    description: 'เว็บแอปพลิเคชันจัดการรายรับ-รายจ่ายส่วนบุคคล วิเคราะห์หมวดหมู่การใช้จ่าย พร้อมแดชบอร์ดสรุปยอดแบบเรียลไทม์ ช่วยให้การบริหารการเงินส่วนบุคคลและธุรกิจขนาดเล็กเป็นระบบ',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Chart.js'],
    demoUrl: 'https://smart-wallet.vercel.app',
    architectureDetails: [
      'Frontend: Next.js Responsive Web Dashboard',
      'Backend API: RESTful Endpoints with Input Validation',
      'Database: PostgreSQL Relational Persistence Layer'
    ]
  },
  {
    id: 'minimal-weather',
    name: 'Minimal Weather Station',
    category: 'IoT & Telemetry',
    categoryKey: 'iot',
    description: 'ระบบตรวจวัดสภาพแวดล้อมและสภาพอากาศแบบเรียลไทม์ เชื่อมต่อเซนเซอร์ตรวจวัดอุณหภูมิ ความชื้น และความกดอากาศ ส่งข้อมูลขึ้น Web Dashboard อัตโนมัติ',
    technologies: ['ESP32', 'React', 'MQTT Protocol', 'REST API', 'BME280 Sensor'],
    demoUrl: 'https://minimal-weather.vercel.app',
    architectureDetails: [
      'Hardware: ESP32 Microcontroller + BME280 Sensor Module',
      'Protocol: Lightweight MQTT Telemetry Pipeline',
      'Visualizer: Real-time React Telemetry Chart'
    ]
  },
  {
    id: 'sudoku-engine',
    name: 'Sudoku Algorithm Engine',
    category: 'Web Application',
    categoryKey: 'web',
    description: 'เว็บแอปพลิเคชันคำนวณและแก้โจทย์ซูโดกุด้วย Recursive Backtracking Algorithm พร้อมระบบสร้างตารางตามระดับความยาก และประวัติการย้อนกลับสถานะการเดินเกม',
    technologies: ['TypeScript', 'React', 'Tailwind CSS', 'State Engine Algorithm'],
    demoUrl: 'https://sudoku.vercel.app',
    architectureDetails: [
      'Logic Engine: Recursive Backtracking Solver',
      'State Management: Immutable History Stack',
      'Responsive Grid: Mobile-first Interactive Board'
    ]
  },
  {
    id: 'duck-hunt-arcade',
    name: 'Duck Hunt Arcade Canvas',
    category: 'Interactive Systems',
    categoryKey: 'interactive',
    description: 'ระบบเกมเชิงตอบสนองบนเบราว์เซอร์ พัฒนาด้วย HTML5 Canvas และ Web Audio API จำลองการคำนวณการชน (Collision Detection) แบบ 60 FPS ไร้ความหน่วง',
    technologies: ['HTML5 Canvas', 'JavaScript (ES6)', 'Web Audio API', 'Game Physics'],
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
    description: 'เกมวิ่ง 2 มิติจำลองการเคลื่อนที่และแรงโน้มถ่วงบนเว็บ พร้อมการคำนวณคะแนนแบบต่อเนื่องและการจัดเก็บสถิติผู้เล่นผ่าน LocalStorage API',
    technologies: ['JavaScript', 'HTML5', 'CSS Grid', 'LocalStorage API'],
    demoUrl: 'https://cookie-runner.vercel.app',
    architectureDetails: [
      'Physics: Gravity Acceleration & Jumping Vector',
      'Storage: Client-side Persistent High Scores',
      'Asset Pipeline: Optimized Sprite Maps'
    ]
  }
];

// Realistic Imperfect IoT Mock Data
const INITIAL_IOT_DEVICES: IoTDeviceState[] = [
  {
    id: 'server-room',
    name: 'ห้อง Server',
    locationName: 'อาคารสำนักงาน ชั้น 2',
    hardwareModel: 'ESP32-C3 Smart Switch v2',
    connectionStatus: 'Online',
    relayStatus: false,
    temperatureCelsius: 24.7,
    humidityPercentage: 58,
    wifiSignalDbm: -61,
    connectionLatencyMs: 46,
    lastSeenTimestamp: '10:01:43'
  },
  {
    id: 'office-room',
    name: 'ห้องทำงาน',
    locationName: 'พื้นที่ปฏิบัติการ IT',
    hardwareModel: 'ESP32-C3 Relay Node',
    connectionStatus: 'Warning',
    relayStatus: true,
    temperatureCelsius: 25.1,
    humidityPercentage: 63,
    wifiSignalDbm: -71,
    connectionLatencyMs: 118,
    lastSeenTimestamp: '09:52:18'
  },
  {
    id: 'conference-room',
    name: 'ห้องประชุม',
    locationName: 'ห้องประชุมใหญ่ A',
    hardwareModel: 'ESP32-C3 Sensor Unit',
    connectionStatus: 'Offline',
    relayStatus: false,
    temperatureCelsius: 24.3,
    humidityPercentage: 56,
    wifiSignalDbm: -62,
    connectionLatencyMs: null,
    lastSeenTimestamp: '09:48:12 (8 นาทีที่แล้ว)'
  },
  {
    id: 'storefront-lighting',
    name: 'ระบบไฟหน้าร้าน',
    locationName: 'ซุ้มแสดงสินค้าและป้ายหน้าร้าน',
    hardwareModel: 'ESP32-C3 Quad Relay',
    connectionStatus: 'Online',
    relayStatus: true,
    temperatureCelsius: 24.9,
    humidityPercentage: 61,
    wifiSignalDbm: -68,
    connectionLatencyMs: 54,
    lastSeenTimestamp: '10:01:15'
  }
];

// Irregular Timestamps for Telemetry Events
const INITIAL_TELEMETRY_LOGS: DeviceTelemetryEvent[] = [
  { eventId: 'evt-1', timestamp: '10:01', deviceName: 'ห้อง Server', eventDescription: 'Telemetry Ping สำเร็จ (Latency 46ms, 24.7°C)', severity: 'normal' },
  { eventId: 'evt-2', timestamp: '09:52', deviceName: 'ห้องทำงาน', eventDescription: 'สัญญาณ Wi-Fi อ่อนลง (-71 dBm) ค่า Latency พุ่งสูง', severity: 'warning' },
  { eventId: 'evt-3', timestamp: '09:48', deviceName: 'ห้องประชุม', eventDescription: 'Heartbeat ขาดหาย เข้าสู่สถานะ Offline', severity: 'warning' },
  { eventId: 'evt-4', timestamp: '09:47', deviceName: 'ระบบไฟหน้าร้าน', eventDescription: 'คำสั่ง Relay ON ทำงานตามตารางเวลา', severity: 'info' },
  { eventId: 'evt-5', timestamp: '09:43', deviceName: 'ห้อง Server', eventDescription: 'อุณหภูมิปกติ 24.5°C การระบายอากาศสมบูรณ์', severity: 'normal' },
  { eventId: 'evt-6', timestamp: '09:41', deviceName: 'ระบบไฟหน้าร้าน', eventDescription: 'ESP32-C3 เชื่อมต่อ Wi-Fi และ Sync เวลา NTP สำเร็จ', severity: 'info' }
];

export default function DeeDevIOTLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);
  const [selectedWorkCategory, setSelectedWorkCategory] = useState<string>('all');

  // Dynamic CMS data support (if available in Google Sheets)
  const [cmsServices, setCmsServices] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>({});

  // IoT Dashboard Interactive State
  const [iotDevices, setIotDevices] = useState<IoTDeviceState[]>(INITIAL_IOT_DEVICES);
  const [telemetryLogs, setTelemetryLogs] = useState<DeviceTelemetryEvent[]>(INITIAL_TELEMETRY_LOGS);
  const [selectedDashboardDevice, setSelectedDashboardDevice] = useState<string>('server-room');

  // Scroll detection
  useEffect(() => {
    const handleWindowScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  // Body overflow control for modal and drawer
  useEffect(() => {
    if (mobileMenuOpen || activeProjectModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen, activeProjectModal]);

  // Fetch live CMS data silently to supplement baseline verified projects
  useEffect(() => {
    const fetchLiveCmsData = async () => {
      try {
        const [servicesResponse, configResponse] = await Promise.all([
          fetch('/api/services', { cache: 'no-store' }),
          fetch('/api/config', { cache: 'no-store' })
        ]);
        const [servicesResult, configResult] = await Promise.all([
          servicesResponse.json(),
          configResponse.json()
        ]);
        if (servicesResult.success && Array.isArray(servicesResult.data) && servicesResult.data.length > 0) {
          setCmsServices(servicesResult.data);
        }
        if (configResult.success && configResult.data) {
          setSiteConfig(configResult.data);
        }
      } catch {
        // Fallback maintained seamlessly
      }
    };
    fetchLiveCmsData();
  }, []);

  // Relay toggle handler with realistic latency simulation
  const handleToggleRelay = (deviceId: string) => {
    setIotDevices(prevDevices =>
      prevDevices.map(device => {
        if (device.id === deviceId) {
          const newRelayState = !device.relayStatus;
          const currentTimestamp = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
          
          // Add telemetry event to recent events log
          setTelemetryLogs(prevLogs => [
            {
              eventId: `evt-${Date.now()}`,
              timestamp: currentTimestamp,
              deviceName: device.name,
              eventDescription: `ผู้ใช้งานกดเปลี่ยนสถานะ Relay เป็น ${newRelayState ? 'เปิด (ON)' : 'ปิด (OFF)'}`,
              severity: 'info'
            },
            ...prevLogs.slice(0, 5)
          ]);

          return {
            ...device,
            relayStatus: newRelayState,
            lastSeenTimestamp: 'เมื่อสักครู่'
          };
        }
        return device;
      })
    );
  };

  // Combine real baseline projects with any dynamic items from CMS
  const allProjects: ProjectItem[] = [
    ...REAL_PROJECTS_PORTFOLIO,
    ...cmsServices.map((cmsItem, index) => ({
      id: cmsItem.id || `cms-${index}`,
      name: cmsItem.title,
      category: cmsItem.icon || 'Custom Solution',
      categoryKey: 'web' as const,
      description: cmsItem.description_th || cmsItem.description,
      technologies: ['Custom Software', 'Database', 'Integration'],
      demoUrl: cmsItem.demoUrl || undefined,
      architectureDetails: ['ออกแบบระบบเฉพาะตามข้อกำหนดของงาน']
    }))
  ];

  const filteredProjects = selectedWorkCategory === 'all'
    ? allProjects
    : allProjects.filter(item => item.categoryKey === selectedWorkCategory);

  const activeDeviceDetail = iotDevices.find(dev => dev.id === selectedDashboardDevice) || iotDevices[0];

  return (
    <div className="min-h-screen bg-[#08090D] text-white selection:bg-[#E53935]/20 selection:text-white font-sans antialiased">

      {/* ================= 07. NAVIGATION ================= */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        isScrolled 
          ? 'bg-[#08090D]/95 border-b border-[#252832] py-3.5 shadow-sm' 
          : 'bg-transparent border-b border-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="#hero" className="flex items-center gap-2.5 group focus:outline-none">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E53935]" />
            <div className="font-mono text-sm tracking-wider font-bold">
              <span className="text-white">DEEDEV</span>
              <span className="text-[#6B7280] mx-1">/</span>
              <span className="text-[#9CA3AF] group-hover:text-white transition-colors">IOT</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono tracking-wider text-[#9CA3AF]">
            <a href="#hero" className="hover:text-white transition-colors">Home</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#works" className="hover:text-white transition-colors">Works</a>
            <a href="#iot-dashboard" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span>Solutions</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E53935]" />
            </a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold tracking-wider border border-[#252832] bg-[#111318] hover:border-[#E53935] hover:text-white text-[#9CA3AF] rounded transition-colors"
            >
              <span>ปรึกษาโปรเจกต์</span>
              <ArrowRight size={13} className="text-[#E53935]" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded border border-[#252832] bg-[#111318] text-[#9CA3AF] hover:text-white"
              aria-label="เมนูหลัก"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#08090D]/98 pt-20 px-6 pb-8 flex flex-col justify-between">
          <nav className="flex flex-col space-y-4 font-mono text-sm tracking-wider text-[#9CA3AF]">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-[#252832] hover:text-white">หน้าแรก (Home)</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-[#252832] hover:text-white">บริการที่รับทำ (Services)</a>
            <a href="#works" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-[#252832] hover:text-white">ผลงานจริง (Works)</a>
            <a href="#iot-dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-[#252832] hover:text-white text-white flex items-center justify-between">
              <span>ตัวอย่างระบบ IoT Dashboard</span>
              <span className="text-xs text-[#E53935] font-bold">LIVE</span>
            </a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-[#252832] hover:text-white">เกี่ยวกับ DeeDevIOT</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-[#252832] hover:text-white">ช่องทางติดต่อ (Contact)</a>
          </nav>
          <div>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 bg-[#E53935] hover:bg-[#c62828] text-white font-mono text-xs uppercase tracking-wider font-bold rounded flex items-center justify-center gap-2"
            >
              <span>ปรึกษาโปรเจกต์ฟรี</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}

      {/* ================= 08. HERO SECTION ================= */}
      <section id="hero" className="relative pt-32 sm:pt-40 pb-20 border-b border-[#252832]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="px-2.5 py-1 rounded bg-[#111318] border border-[#252832] text-xs font-mono text-[#9CA3AF] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E53935]" />
              <span className="text-white font-semibold">DEEDEV IOT</span>
              <span className="text-[#6B7280]">|</span>
              <span>Thailand Technology Studio</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Thai Messaging */}
            <div className="lg:col-span-7">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.18] mb-6">
                มีไอเดีย แต่ยังไม่รู้จะทำระบบอย่างไร?
              </h1>

              <h2 className="text-lg sm:text-2xl font-medium text-white mb-4 leading-snug">
                DeeDevIOT ช่วยเปลี่ยนไอเดียของคุณให้กลายเป็น Web Application, IoT และระบบ IT ที่ใช้งานได้จริง
              </h2>

              <p className="text-sm sm:text-base text-[#9CA3AF] max-w-2xl leading-relaxed mb-8 font-light">
                ตั้งแต่การออกแบบระบบ พัฒนาโปรแกรม เชื่อมต่ออุปกรณ์ ไปจนถึงนำระบบไปใช้งานจริง ไม่ว่าคุณจะเป็นเจ้าของธุรกิจ SME โรงงาน หรือผู้ที่มีไอเดียแต่ยังไม่มีทีม Developer ประจำ
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                <a
                  href="#contact"
                  className="px-7 py-3.5 bg-[#E53935] hover:bg-[#c62828] text-white font-mono text-xs uppercase tracking-wider font-bold rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>ปรึกษาโปรเจกต์</span>
                  <ArrowRight size={14} />
                </a>

                <a
                  href="#works"
                  className="px-7 py-3.5 bg-[#111318] text-white border border-[#252832] hover:border-white font-mono text-xs uppercase tracking-wider font-semibold rounded transition-colors flex items-center justify-center gap-2"
                >
                  <span>ดูผลงาน</span>
                  <ArrowDown size={14} />
                </a>
              </div>

              <div className="text-xs font-mono text-[#6B7280]">
                • รับพัฒนาโปรเจกต์ตามความต้องการ • พร้อมให้คำปรึกษาแนวทางเทคนิคเบื้องต้นฟรี
              </div>
            </div>

            {/* Right Column: Real Technology Ecosystem Flow (Non-AI, Authentic Diagram) */}
            <div className="lg:col-span-5 bg-[#111318] border border-[#252832] rounded-lg p-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252832] font-mono text-[11px] text-[#9CA3AF]">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-[#E53935]" />
                  <span className="text-white font-bold">REAL SYSTEM PIPELINE</span>
                </div>
                <span className="text-[#6B7280]">END-TO-END</span>
              </div>

              {/* Connected Flow Diagram */}
              <div className="space-y-3 font-mono text-xs">
                
                <div className="p-3 bg-[#08090D] border border-[#252832] rounded flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Cpu size={16} className="text-[#E53935]" />
                    <div>
                      <div className="text-white font-bold text-xs">01 // ESP32 / IoT Device</div>
                      <div className="text-[10px] text-[#9CA3AF]">เซนเซอร์ตรวจวัด, สวิตช์รีเลย์, ไมโครคอนโทรลเลอร์</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">GPIO / I2C</span>
                </div>

                <div className="flex justify-center my-1 text-[#6B7280]">↓</div>

                <div className="p-3 bg-[#08090D] border border-[#252832] rounded flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Wifi size={16} className="text-[#E53935]" />
                    <div>
                      <div className="text-white font-bold text-xs">02 // MQTT / REST API</div>
                      <div className="text-[10px] text-[#9CA3AF]">โปรโตคอลรับส่งข้อมูลความเร็วสูง ไร้ความหน่วง</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#9CA3AF]">TLS / JSON</span>
                </div>

                <div className="flex justify-center my-1 text-[#6B7280]">↓</div>

                <div className="p-3 bg-[#08090D] border border-[#252832] rounded flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Database size={16} className="text-[#E53935]" />
                    <div>
                      <div className="text-white font-bold text-xs">03 // Database / Cloud</div>
                      <div className="text-[10px] text-[#9CA3AF]">PostgreSQL, MySQL, ระบบสำรองข้อมูลบนคลาวด์</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#9CA3AF]">Storage</span>
                </div>

                <div className="flex justify-center my-1 text-[#6B7280]">↓</div>

                <div className="p-3 bg-[#08090D] border border-[#252832] rounded flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Globe size={16} className="text-[#E53935]" />
                    <div>
                      <div className="text-white font-bold text-xs">04 // Web Dashboard</div>
                      <div className="text-[10px] text-[#9CA3AF]">หน้าจอควบคุม สั่งการ และติดตามข้อมูลจากทุกอุปกรณ์</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#E53935] font-bold">Responsive</span>
                </div>

                <div className="flex justify-center my-1 text-[#6B7280]">↓</div>

                <div className="p-3 bg-[#111318] border border-[#E53935]/40 rounded text-center">
                  <span className="text-white font-bold text-xs block">05 // Business Value</span>
                  <span className="text-[11px] text-[#9CA3AF]">ลดงาน Manual • ลดความผิดพลาด • ข้อมูลพร้อมตัดสินใจทันที</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 09. TRUST / QUICK VALUE SECTION ================= */}
      <section className="py-14 border-b border-[#252832] bg-[#0D0E12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              ทำระบบให้เหมาะกับงาน ไม่ใช่เอางานไปยัดใส่ Template
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
              เราออกแบบโครงสร้างซอฟต์แวร์และฮาร์ดแวร์ตามขั้นตอนการทำงานจริงของคุณ เพื่อให้ระบบทำงานตอบโจทย์ที่สุดและขยายต่อได้ในอนาคต
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-mono text-center text-xs">
            {[
              { title: 'Web Application', desc: 'ระบบเว็บองค์กร' },
              { title: 'IoT System', desc: 'เชื่อมต่อฮาร์ดแวร์' },
              { title: 'Dashboard', desc: 'สรุปข้อมูลสด' },
              { title: 'Automation', desc: 'ลดงานซ้ำซ้อน' },
              { title: 'API', desc: 'เชื่อมต่อภายนอก' },
              { title: 'Database', desc: 'จัดเก็บข้อมูลปลอดภัย' },
              { title: 'IT Solutions', desc: 'วางระบบโครงสร้าง' }
            ].map((cap) => (
              <div key={cap.title} className="p-3.5 rounded bg-[#111318] border border-[#252832]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E53935] mx-auto mb-2" />
                <div className="text-white font-bold text-xs mb-1">{cap.title}</div>
                <div className="text-[#6B7280] text-[10px]">{cap.desc}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 10. SERVICES ================= */}
      <section id="services" className="py-20 sm:py-28 border-b border-[#252832]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-[#252832]">
            <div>
              <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-2">[ OUR SERVICES ]</span>
              <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                บริการพัฒนาและวางระบบ
              </h2>
            </div>
            <p className="text-xs font-mono text-[#9CA3AF] mt-3 sm:mt-0">
              3 ด้านความเชี่ยวชาญเพื่อธุรกิจไทย
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 01 IoT Solutions */}
            <div className="bg-[#111318] border border-[#252832] hover:border-[#E53935]/60 transition-colors p-7 rounded flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs text-[#6B7280]">
                  <span className="text-[#E53935] font-bold text-sm">01</span>
                  <span>HARDWARE & SENSORS</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">IoT Solutions</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed mb-6">
                  ออกแบบระบบเชื่อมต่ออุปกรณ์ Sensor และ Microcontroller พร้อม Dashboard และระบบจัดเก็บข้อมูลแบบครบวงจร
                </p>

                <div className="space-y-2 pt-4 border-t border-[#252832] font-mono text-xs">
                  {[
                    'ESP32 & ESP32-C3 Firmware Development',
                    'Sensors ตรวจวัด (อุณหภูมิ, ความชื้น, แรงดัน, การเคลื่อนไหว)',
                    'MQTT & WebSockets สำหรับข้อมูลความเร็วสูง',
                    'ระบบควบคุมเปิด-ปิดรีเลย์ และสวิตช์ระยะไกล',
                    'แจ้งเตือนฉุกเฉินผ่าน LINE Notify / LINE Bot'
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-[#9CA3AF]">
                      <span className="text-[#E53935]">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#252832] flex items-center justify-between text-xs font-mono text-[#9CA3AF]">
                <span>ปรึกษางาน IoT</span>
                <a href="#contact" className="text-[#E53935] hover:text-white flex items-center gap-1">
                  <span>ติดต่อเรา</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>

            {/* 02 Web Applications */}
            <div className="bg-[#111318] border border-[#252832] hover:border-[#E53935]/60 transition-colors p-7 rounded flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs text-[#6B7280]">
                  <span className="text-[#E53935] font-bold text-sm">02</span>
                  <span>SOFTWARE & WORKFLOW</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Web Applications</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed mb-6">
                  พัฒนา Web Application และระบบหลังบ้านตาม Workflow ของธุรกิจ จัดการข้อมูลให้เป็นระบบและเข้าถึงได้ทุกที่
                </p>

                <div className="space-y-2 pt-4 border-t border-[#252832] font-mono text-xs">
                  {[
                    'ระบบจัดการภายใน (Management System)',
                    'แดชบอร์ดสรุปยอดขายและข้อมูลสถิติ (Dashboard)',
                    'ระบบจัดการสต็อกสินค้าและคลังสินค้า (Inventory)',
                    'ระบบจองคิวและการลงเวลา (Booking & Workflow)',
                    'ระบบยืนยันตัวตนและความปลอดภัย (Authentication)'
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-[#9CA3AF]">
                      <span className="text-[#E53935]">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#252832] flex items-center justify-between text-xs font-mono text-[#9CA3AF]">
                <span>ปรึกษา Web App</span>
                <a href="#contact" className="text-[#E53935] hover:text-white flex items-center gap-1">
                  <span>ติดต่อเรา</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>

            {/* 03 IT Solutions */}
            <div className="bg-[#111318] border border-[#252832] hover:border-[#E53935]/60 transition-colors p-7 rounded flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 font-mono text-xs text-[#6B7280]">
                  <span className="text-[#E53935] font-bold text-sm">03</span>
                  <span>INFRASTRUCTURE & CLOUD</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">IT Solutions</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed mb-6">
                  ช่วยวางระบบและพัฒนาโซลูชันด้าน IT ให้เหมาะกับการใช้งานจริง เสถียร ปลอดภัย และดูแลรักษาง่าย
                </p>

                <div className="space-y-2 pt-4 border-t border-[#252832] font-mono text-xs">
                  {[
                    'ออกแบบสถาปัตยกรรมระบบ API และ Database',
                    'ติดตั้งและบริหารจัดการ Server / Cloud (Vercel, GCP, VPS)',
                    'ระบบสำรองข้อมูลอัตโนมัติ (Automated Backup)',
                    'System Integration เชื่อมต่อซอฟต์แวร์เดิมเข้าหากัน',
                    'ให้คำปรึกษาทางเทคนิคสำหรับองค์กรและฝ่าย IT'
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-[#9CA3AF]">
                      <span className="text-[#E53935]">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#252832] flex items-center justify-between text-xs font-mono text-[#9CA3AF]">
                <span>ปรึกษา IT Solution</span>
                <a href="#contact" className="text-[#E53935] hover:text-white flex items-center gap-1">
                  <span>ติดต่อเรา</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 13 & 14 & 16. REALISTIC IOT DASHBOARD SHOWCASE (Interactive Section) ================= */}
      <section id="iot-dashboard" className="py-20 sm:py-28 border-b border-[#252832] bg-[#0D0E12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-[#252832]">
            <div>
              <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-2">
                [ LIVE DEMONSTRATION // HARDWARE: ESP32-C3 SMART SWITCH ]
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                ตัวอย่างระบบ IoT Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-2">
                ควบคุมอุปกรณ์และติดตามข้อมูลจากที่เดียว (ลองกดเปิด-ปิดรีเลย์เพื่อทดสอบการตอบสนองได้จริง)
              </p>
            </div>
            
            <div className="flex items-center gap-2 mt-4 sm:mt-0 font-mono text-xs text-[#9CA3AF]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>MQTT BROKER: CONNECTED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Device Selection & Real-Time Cards */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {iotDevices.map((device) => {
                  const isSelected = selectedDashboardDevice === device.id;
                  const isOnline = device.connectionStatus === 'Online';
                  const isWarning = device.connectionStatus === 'Warning';
                  const isOffline = device.connectionStatus === 'Offline';

                  return (
                    <div
                      key={device.id}
                      onClick={() => setSelectedDashboardDevice(device.id)}
                      className={`p-5 rounded border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#111318] border-[#E53935] shadow-sm' 
                          : 'bg-[#111318] border-[#252832] hover:border-[#3F4350]'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#252832]">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{device.name}</span>
                          </h4>
                          <span className="text-[10px] font-mono text-[#6B7280]">{device.locationName}</span>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 ${
                          isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          isWarning ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-[#252832] text-[#9CA3AF]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : isWarning ? 'bg-amber-400' : 'bg-zinc-500'}`} />
                          <span>{device.connectionStatus}</span>
                        </span>
                      </div>

                      {/* Sensor Summary */}
                      <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
                        <div className="bg-[#08090D] p-2.5 rounded border border-[#252832]">
                          <span className="text-[#6B7280] block text-[10px]">อุณหภูมิ</span>
                          <span className="text-white font-bold text-sm">{device.temperatureCelsius}°C</span>
                        </div>
                        <div className="bg-[#08090D] p-2.5 rounded border border-[#252832]">
                          <span className="text-[#6B7280] block text-[10px]">ความชื้น</span>
                          <span className="text-white font-bold text-sm">{device.humidityPercentage}%</span>
                        </div>
                      </div>

                      {/* Relay Control Action */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#252832] font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#6B7280] text-[11px]">สถานะรีเลย์:</span>
                          <span className={`font-bold text-[11px] ${device.relayStatus ? 'text-[#E53935]' : 'text-[#6B7280]'}`}>
                            {device.relayStatus ? 'เปิด (ON)' : 'ปิด (OFF)'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleRelay(device.id);
                          }}
                          className={`px-3 py-1 rounded font-bold text-[11px] transition-colors flex items-center gap-1.5 ${
                            device.relayStatus
                              ? 'bg-[#E53935] text-white hover:bg-[#c62828]'
                              : 'bg-[#252832] text-[#9CA3AF] hover:text-white'
                          }`}
                        >
                          <Power size={11} />
                          <span>{device.relayStatus ? 'ปิดสวิตช์' : 'เปิดสวิตช์'}</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Hardware Specification Box */}
              <div className="p-4 bg-[#111318] border border-[#252832] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#08090D] border border-[#252832] flex items-center justify-center text-[#E53935]">
                    <Cpu size={16} />
                  </div>
                  <div>
                    <span className="text-white font-bold block">{activeDeviceDetail.hardwareModel}</span>
                    <span className="text-[11px] text-[#9CA3AF]">Microcontroller: ESP32-C3 32-bit RISC-V @ 160MHz</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-[#9CA3AF]">
                  <div>สัญญาณ: <strong className="text-white">{activeDeviceDetail.wifiSignalDbm} dBm</strong></div>
                  <div>Latency: <strong className="text-white">{activeDeviceDetail.connectionLatencyMs ? `${activeDeviceDetail.connectionLatencyMs} ms` : 'N/A'}</strong></div>
                </div>
              </div>
            </div>

            {/* Right: Real-time Telemetry Event History (Irregular Timestamps) */}
            <div className="lg:col-span-4 bg-[#111318] border border-[#252832] rounded p-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252832] font-mono text-xs">
                <span className="text-white font-bold flex items-center gap-2">
                  <Clock size={14} className="text-[#E53935]" />
                  <span>EVENT HISTORY</span>
                </span>
                <span className="text-[10px] text-[#6B7280]">LIVE LOG</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {telemetryLogs.map((log) => (
                  <div key={log.eventId} className="p-2.5 bg-[#08090D] border border-[#252832] rounded">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-[#E53935] font-bold">{log.timestamp}</span>
                      <span className="text-[#6B7280]">{log.deviceName}</span>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] leading-tight">
                      {log.eventDescription}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-[#252832] text-center">
                <span className="text-[11px] font-mono text-[#6B7280] block mb-2">
                  ต้องการระบบควบคุมฮาร์ดแวร์แบบนี้ในธุรกิจของคุณ?
                </span>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#E53935] hover:text-white"
                >
                  <span>ปรึกษาการออกแบบระบบ IoT</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 11. REAL PROJECT SHOWCASE ================= */}
      <section id="works" className="py-20 sm:py-28 border-b border-[#252832]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#252832] gap-4">
            <div>
              <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-2">[ REAL PORTFOLIO ]</span>
              <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                ผลงานและโปรเจกต์จริง
              </h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-2">
                โปรเจกต์ซอฟต์แวร์และฮาร์ดแวร์ที่พัฒนาและทดสอบการทำงานจริง
              </p>
            </div>

            {/* Category Filter Pills */}
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
                  className={`px-3 py-1.5 rounded border transition-colors ${
                    selectedWorkCategory === categoryItem.key
                      ? 'bg-white text-[#08090D] border-white font-bold'
                      : 'bg-[#111318] text-[#9CA3AF] border-[#252832] hover:border-[#3F4350] hover:text-white'
                  }`}
                >
                  {categoryItem.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="bg-[#111318] border border-[#252832] hover:border-[#E53935]/60 transition-colors rounded flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Header */}
                <div className="p-4 bg-[#08090D] border-b border-[#252832] flex items-center justify-between font-mono text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#252832]" />
                    <span className="w-2 h-2 rounded-full bg-[#252832]" />
                    <span className="w-2 h-2 rounded-full bg-[#252832]" />
                  </div>
                  <span className="text-[#6B7280]">{project.category}</span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {project.name}
                    </h3>
                    
                    <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-6 font-mono text-[10px]">
                      {project.technologies.map((techItem) => (
                        <span
                          key={techItem}
                          className="px-2 py-0.5 rounded bg-[#08090D] border border-[#252832] text-[#9CA3AF]"
                        >
                          {techItem}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#252832] flex items-center justify-between font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveProjectModal(project)}
                      className="text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>สถาปัตยกรรมระบบ</span>
                      <ChevronRight size={13} />
                    </button>

                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#E53935] hover:text-white transition-colors inline-flex items-center gap-1 font-bold"
                      >
                        <span>เปิด Live Demo</span>
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

      {/* ================= 12. CASE STUDY ================= */}
      <section className="py-20 sm:py-28 border-b border-[#252832] bg-[#0D0E12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-14 pb-6 border-b border-[#252832]">
            <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-2">[ REAL-WORLD CASE STUDY ]</span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              ตัวอย่างการแก้ปัญหาในงานจริง
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-2">
              กรณีศึกษา: ระบบมอนิเตอร์และแจ้งเตือนสภาพแวดล้อมห้อง Server / ฟาร์มปิด
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Steps & Solution */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-[#111318] border border-[#252832] p-6 rounded">
                <div className="font-mono text-xs text-[#E53935] font-bold mb-2 uppercase">[ 01 PROBLEM: ปัญหาของลูกค้า ]</div>
                <h4 className="text-base font-bold text-white mb-2">ขาดระบบมอนิเตอร์อุณหภูมิที่แจ้งเตือนได้ทันท่วงที</h4>
                <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed font-light">
                  ลูกค้าต้องการตรวจสอบอุณหภูมิและความชื้นในพื้นที่ควบคุมตลอด 24 ชั่วโมง แต่ระบบสำเร็จรูปในท้องตลาดมีราคาอุปกรณ์สูง และต้องจ่ายค่าบริการคลาวด์รายเดือนอย่างต่อเนื่อง อีกทั้งไม่สามารถปรับแต่งการส่งข้อความแจ้งเตือนผ่านกลุ่ม LINE ของทีมงานได้
                </p>
              </div>

              <div className="bg-[#111318] border border-[#252832] p-6 rounded">
                <div className="font-mono text-xs text-white font-bold mb-2 uppercase flex items-center gap-1.5">
                  <span className="text-[#E53935]">•</span>
                  <span>[ 02 SOLUTION: สิ่งที่ DeeDevIOT พัฒนาขึ้น ]</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">ชุดฮาร์ดแวร์เฉพาะทาง + Web Dashboard ที่เป็นเจ้าของเอง 100%</h4>
                <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed font-light">
                  เราออกแบบและประกอบกล่องคอนโทรลเลอร์ด้วย ESP32-C3 พร้อมเซนเซอร์มาตรฐานความแม่นยำสูง เขียนโปรแกรม Firmware เชื่อมต่อ Wi-Fi ในพื้นที่ ส่งข้อมูลเข้าสู่ระบบ Database และสร้าง Web Application เพื่อให้เจ้าหน้าที่เปิดดูข้อมูลสดจากมือถือได้ตลอดเวลา พร้อมตั้งค่าเงื่อนไขให้ส่งแจ้งเตือนผ่าน LINE อัตโนมัติเมื่อค่าเกินเกณฑ์
                </p>
              </div>

              <div className="bg-[#111318] border border-[#252832] p-6 rounded">
                <div className="font-mono text-xs text-[#9CA3AF] font-bold mb-2 uppercase flex items-center gap-1.5">
                  <span className="text-[#E53935]">✓</span>
                  <span>[ 03 RESULT: ผลลัพธ์จริงที่ได้รับ ]</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">ลดความเสี่ยงอุปกรณ์เสียหาย และประหยัดค่าใช้จ่ายระยะยาว</h4>
                <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed font-light">
                  ระบบทำงานต่อเนื่องได้จริง เจ้าหน้าที่ไม่ต้องเดินตรวจวัดด้วยตนเอง ลดเวลาการทำงาน Manual และที่สำคัญที่สุดคือลูกค้าเป็นเจ้าของระบบอย่างแท้จริง ไม่ต้องจ่ายค่าธรรมเนียมซอฟต์แวร์รายเดือน
                </p>
              </div>

            </div>

            {/* Right: Technical Architecture Box */}
            <div className="lg:col-span-5 bg-[#111318] border border-[#252832] p-6 sm:p-7 rounded">
              <div className="pb-4 mb-5 border-b border-[#252832] font-mono text-xs text-white font-bold flex justify-between">
                <span>TECHNOLOGY USED</span>
                <span className="text-[#E53935]">PROVEN IN PRODUCTION</span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-[#6B7280] block">HARDWARE</span>
                  <span className="text-white font-bold">ESP32-C3 Microcontroller + High-precision Sensors</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] block">TELEMETRY PROTOCOL</span>
                  <span className="text-white font-bold">MQTT over TLS & Lightweight JSON Payload</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] block">BACKEND & API</span>
                  <span className="text-white font-bold">Node.js Express Service + Automation Triggers</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] block">NOTIFICATION</span>
                  <span className="text-white font-bold">LINE Messaging API / Custom Webhook</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] block">WEB INTERFACE</span>
                  <span className="text-white font-bold">Next.js Responsive Mobile-first Dashboard</span>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[#252832]">
                <a
                  href="#contact"
                  className="w-full py-3 bg-[#08090D] border border-[#252832] hover:border-[#E53935] text-white rounded font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>ต้องการทำระบบคล้ายกันนี้ ปรึกษาเรา →</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 10. WORKFLOW ================= */}
      <section className="py-20 sm:py-28 border-b border-[#252832]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-14 pb-6 border-b border-[#252832]">
            <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-2">[ HOW WE WORK ]</span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              ขั้นตอนการทำงานกับ DeeDevIOT
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-2">
              กระบวนการที่ชัดเจน โปร่งใส และมีขั้นตอนการตรวจรับงานอย่างมีระบบ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 font-mono">
            {[
              { phase: '01', title: 'รับฟังโจทย์', desc: 'พูดคุยเพื่อเข้าใจปัญหา ข้อจำกัด และความต้องการที่แท้จริงของธุรกิจ' },
              { phase: '02', title: 'วางแผนระบบ', desc: 'ออกแบบสถาปัตยกรรม ซอฟต์แวร์ ฮาร์ดแวร์ พร้อมประเมินงบประมาณ' },
              { phase: '03', title: 'ออกแบบ UI & Flow', desc: 'วางโครงสร้างหน้าจอจำลอง (Mockup) และเส้นทางการไหลของข้อมูล' },
              { phase: '04', title: 'พัฒนาโปรแกรม', desc: 'เขียนโค้ดตามมาตรฐาน เชื่อมต่อวงจร และอัปเดตความคืบหน้าสม่ำเสมอ' },
              { phase: '05', title: 'ทดสอบระบบ', desc: 'ทดสอบ End-to-End ตรวจสอบความปลอดภัย และทดสอบการใช้งานจริง' },
              { phase: '06', title: 'ส่งมอบ & ดูแล', desc: 'นำระบบขึ้น Production มอบคู่มือการใช้งาน และดูแลต่อเนื่อง' }
            ].map((step) => (
              <div key={step.phase} className="p-5 bg-[#111318] border border-[#252832] rounded flex flex-col justify-between">
                <div>
                  <span className="text-[#E53935] font-bold text-sm block mb-2">{step.phase}</span>
                  <h4 className="font-bold text-white text-sm mb-2">{step.title}</h4>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">{step.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-[#252832] text-[10px] text-[#6B7280]">
                  PHASE {step.phase}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 11. ABOUT DEEDEVIOT ================= */}
      <section id="about" className="py-20 sm:py-28 border-b border-[#252832] bg-[#0D0E12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5">
              <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-2">[ ABOUT DEEDEVIOT ]</span>
              <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white leading-tight mb-6">
                "We don't just build websites. <br />
                <span className="text-[#9CA3AF]">We build systems that solve real problems."</span>
              </h2>

              <div className="p-4 bg-[#111318] border border-[#252832] rounded font-mono text-xs text-[#9CA3AF] space-y-1.5">
                <div>ที่ตั้ง: กรุงเทพมหานคร, ประเทศไทย</div>
                <div>ความเชี่ยวชาญ: Custom Software & IoT Engineering</div>
                <div>หลักการ: เน้นความเรียบง่าย เสถียรภาพ และใช้งานได้จริง</div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 text-sm text-[#9CA3AF] leading-relaxed font-light">
              <p>
                DeeDevIOT เป็นสตูดิโอพัฒนาซอฟต์แวร์และฮาร์ดแวร์ดิจิทัลสัญชาติไทย เราเข้าใจดีว่าธุรกิจในไทยจำนวนมากมีโจทย์การทำงานเฉพาะตัวที่ไม่สามารถแก้ได้ด้วยซอฟต์แวร์สำเร็จรูปทั่วไป และมักเจอปัญหากับระบบที่มีค่าบริการรายเดือนสูงเกินความจำเป็น
              </p>
              <p>
                เราจึงมุ่งเน้นการช่วยธุรกิจ SME, เจ้าของกิจการ และฝ่าย IT ในการเปลี่ยนงานที่เคยทำด้วยมือ (Manual) ให้กลายเป็นระบบดิจิทัลอัตโนมัติ ไม่ว่าจะเป็นเว็บแอปพลิเคชันที่ออกแบบตามกระบวนการทำงานของคุณ หรือระบบ IoT ที่เชื่อมต่อเซนเซอร์ฮาร์ดแวร์เพื่อมอนิเตอร์และแจ้งเตือน
              </p>
              <p className="text-white font-normal">
                พูดคุยกับทีมพัฒนาโดยตรง ไม่ผ่านคนกลาง เพื่อให้มั่นใจได้ว่าระบบที่คุณได้รับจะตรงตามเป้าหมายของงานอย่างแท้จริง
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#252832] font-mono text-xs">
                <div className="p-3 bg-[#111318] border border-[#252832] rounded">
                  <span className="text-white font-bold block mb-0.5">ตรงไปตรงมา</span>
                  <span className="text-[11px] text-[#6B7280]">ประเมินตามเนื้องานจริง</span>
                </div>
                <div className="p-3 bg-[#111318] border border-[#252832] rounded">
                  <span className="text-white font-bold block mb-0.5">มอบ Source Code</span>
                  <span className="text-[11px] text-[#6B7280]">ลูกค้าเป็นเจ้าของ 100%</span>
                </div>
                <div className="p-3 bg-[#111318] border border-[#252832] rounded">
                  <span className="text-white font-bold block mb-0.5">ดูแลต่อเนื่อง</span>
                  <span className="text-[11px] text-[#6B7280]">พร้อมเป็นพาร์ทเนอร์ระยะยาว</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 19 & 20. THAI BUSINESS CTA & CONTACT ================= */}
      <section id="contact" className="py-20 sm:py-28 border-b border-[#252832]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-3">
            [ ติดต่อสอบถาม / เริ่มต้นโปรเจกต์ ]
          </span>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            มีระบบที่อยากทำ แต่ยังไม่รู้จะเริ่มตรงไหน?
          </h2>

          <h3 className="text-lg sm:text-2xl font-medium text-[#9CA3AF] mb-4">
            เล่าไอเดียหรือปัญหาของคุณให้เราฟังได้เลย
          </h3>
          
          <p className="text-[#9CA3AF] text-xs sm:text-sm max-w-xl mx-auto mb-10 leading-relaxed font-light">
            เราช่วยวิเคราะห์ ออกแบบ และพัฒนาระบบให้เหมาะกับการใช้งานจริง ไม่ว่าจะเป็นระบบขนาดเล็กหรือระบบเฉพาะทางขององค์กร ทักมาคุยกันได้โดยไม่มีข้อผูกมัด
          </p>

          {/* Primary Quick Contact Buttons for Thai Users */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            
            {/* LINE Official */}
            <a
              href={`https://line.me/ti/p/~${(siteConfig.contact_line || '@DEEDEVIOT').replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#E53935] hover:bg-[#c62828] text-white font-mono text-xs uppercase tracking-wider font-bold rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle size={16} />
              <span>คุยกับเราใน LINE →</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${siteConfig.contact_email || 'hello@deedeviot.com'}`}
              className="w-full sm:w-auto px-8 py-4 bg-[#111318] text-white border border-[#252832] hover:border-white font-mono text-xs uppercase tracking-wider font-semibold rounded transition-colors flex items-center justify-center gap-2"
            >
              <Mail size={16} className="text-[#E53935]" />
              <span>ส่งอีเมลปรึกษาเรา</span>
            </a>
          </div>

          {/* Direct Channels Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left font-mono text-xs">
            <div className="p-4 bg-[#111318] border border-[#252832] rounded">
              <span className="text-[10px] text-[#6B7280] block mb-1">LINE OFFICIAL</span>
              <span className="text-white font-bold">{siteConfig.contact_line || '@DEEDEVIOT'}</span>
            </div>

            <div className="p-4 bg-[#111318] border border-[#252832] rounded">
              <span className="text-[10px] text-[#6B7280] block mb-1">EMAIL</span>
              <a href={`mailto:${siteConfig.contact_email || 'hello@deedeviot.com'}`} className="text-white font-bold hover:text-[#E53935] break-all">
                {siteConfig.contact_email || 'hello@deedeviot.com'}
              </a>
            </div>

            <div className="p-4 bg-[#111318] border border-[#252832] rounded">
              <span className="text-[10px] text-[#6B7280] block mb-1">TELEPHONE</span>
              <a href={`tel:${siteConfig.contact_phone || '02-123-4567'}`} className="text-white font-bold hover:text-[#E53935]">
                {siteConfig.contact_phone || '02-123-4567'}
              </a>
            </div>

            <div className="p-4 bg-[#111318] border border-[#252832] rounded">
              <span className="text-[10px] text-[#6B7280] block mb-1">FACEBOOK</span>
              <a 
                href={siteConfig.facebook_url || "https://facebook.com/deedeviot"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white font-bold hover:text-[#E53935] flex items-center gap-1"
              >
                <span>DeeDevIOT</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 20. FOOTER ================= */}
      <footer className="py-14 bg-[#08090D] border-t border-[#252832]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#252832]">
            
            {/* Brand Col */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 font-mono text-sm tracking-wider font-bold mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E53935]" />
                <span className="text-white">DEEDEV</span>
                <span className="text-[#6B7280]">/</span>
                <span className="text-[#9CA3AF]">IOT</span>
              </div>
              <p className="text-xs text-[#9CA3AF] max-w-md leading-relaxed font-light mb-3">
                รับพัฒนา Web Application, IoT, Dashboard และระบบ IT ตามความต้องการ พร้อมช่วยออกแบบระบบให้เหมาะกับการใช้งานจริงของธุรกิจไทย
              </p>
              <div className="font-mono text-[11px] text-[#6B7280]">
                "เปลี่ยนไอเดียให้เป็นระบบที่ใช้งานได้จริง" • Turn Ideas Into Real Digital Solutions.
              </div>
            </div>

            {/* Services Index */}
            <div>
              <h4 className="font-mono text-xs uppercase text-white font-bold mb-3 tracking-wider">บริการที่รับทำ</h4>
              <ul className="space-y-1.5 font-mono text-xs text-[#9CA3AF]">
                <li><a href="#services" className="hover:text-white transition-colors">IoT Solutions & ESP32</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Web Applications</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Custom IT Systems</a></li>
                <li><a href="#iot-dashboard" className="hover:text-white transition-colors">IoT Dashboard Showcase</a></li>
              </ul>
            </div>

            {/* Navigation & Admin Link */}
            <div>
              <h4 className="font-mono text-xs uppercase text-white font-bold mb-3 tracking-wider">เมนูเว็บไซต์</h4>
              <ul className="space-y-1.5 font-mono text-xs text-[#9CA3AF]">
                <li><a href="#hero" className="hover:text-white transition-colors">หน้าแรก (Home)</a></li>
                <li><a href="#works" className="hover:text-white transition-colors">ผลงานจริง (Works)</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">เกี่ยวกับเรา (About)</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">ติดต่อเรา (Contact)</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright & Admin Entrance */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#6B7280]">
            <div>
              © 2026 DEEDEV IOT. ALL RIGHTS RESERVED.
            </div>
            
            <div className="flex items-center gap-4">
              <span>DESIGNED FOR THAI BUSINESSES</span>
              <Link 
                href="/login" 
                className="p-1 text-[#6B7280] hover:text-[#E53935] hover:bg-[#111318] rounded transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#08090D]/90 backdrop-blur-sm">
          <div 
            className="w-full max-w-2xl bg-[#111318] border border-[#252832] rounded p-6 sm:p-8 relative"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between pb-4 border-b border-[#252832] mb-5">
              <div>
                <span className="font-mono text-xs text-[#E53935] uppercase tracking-wider block mb-1">
                  [ {activeProjectModal.category} ]
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {activeProjectModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                className="p-1.5 text-[#9CA3AF] hover:text-white rounded border border-[#252832]"
                aria-label="ปิดหน้าต่าง"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed mb-6 font-light">
              {activeProjectModal.description}
            </p>

            {activeProjectModal.architectureDetails && (
              <div className="mb-6 p-4 rounded bg-[#08090D] border border-[#252832]">
                <div className="font-mono text-xs text-white font-bold uppercase mb-2">โครงสร้างสถาปัตยกรรม (ARCHITECTURE DETAILS):</div>
                <ul className="space-y-1.5 font-mono text-xs text-[#9CA3AF]">
                  {activeProjectModal.architectureDetails.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-[#E53935]">→</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-6">
              <span className="font-mono text-[11px] text-[#6B7280] block mb-2 uppercase">TECHNOLOGIES:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeProjectModal.technologies.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded bg-[#08090D] border border-[#252832] text-xs font-mono text-[#9CA3AF]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#252832] flex items-center justify-between font-mono">
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                className="px-4 py-2 border border-[#252832] text-xs text-[#9CA3AF] hover:text-white rounded"
              >
                ปิดหน้าต่าง
              </button>

              {activeProjectModal.demoUrl && (
                <a
                  href={activeProjectModal.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-[#E53935] hover:bg-[#c62828] text-white text-xs font-bold rounded inline-flex items-center gap-1.5"
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
