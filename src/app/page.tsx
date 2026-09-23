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
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FloatingMessenger from '../components/layout/FloatingMessenger';
import ProjectCard from '../components/showcase/ProjectCard';
import ProjectModal from '../components/showcase/ProjectModal';
import ImageWithFallback from '../components/common/ImageWithFallback';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { ProjectItem, IoTDeviceState, DeviceTelemetryEvent } from '../types/portfolio';
import { FacebookIcon, MessengerIcon } from '../components/common/Icons';

const INITIAL_IOT_DEVICES: IoTDeviceState[] = [
  {
    id: 'conference-room',
    name: 'ห้องประชุม',
    locationName: 'ห้องประชุมใหญ่ ชั้น 1',
    hardwareModel: 'ESP32-C3 Smart Switch v2',
    connectionStatus: 'Online',
    relayStatus: false,
    temperatureCelsius: 24.5,
    humidityPercentage: 55,
    wifiSignalDbm: -58,
    connectionLatencyMs: 42,
    lastSeenTimestamp: 'เมื่อสักครู่',
    telemetryHistory: [
      { time: '10:00', temp: 24.2, humidity: 56, latency: 45 },
      { time: '10:15', temp: 24.4, humidity: 55, latency: 41 },
      { time: '10:30', temp: 24.6, humidity: 54, latency: 43 },
      { time: '10:45', temp: 24.5, humidity: 55, latency: 42 }
    ]
  },
  {
    id: 'server-rack',
    name: 'ตู้เซิร์ฟเวอร์',
    locationName: 'ศูนย์ข้อมูล Data Center',
    hardwareModel: 'ESP32 Industrial Gateway',
    connectionStatus: 'Online',
    relayStatus: true,
    temperatureCelsius: 21.8,
    humidityPercentage: 45,
    wifiSignalDbm: -48,
    connectionLatencyMs: 18,
    lastSeenTimestamp: 'เมื่อสักครู่',
    telemetryHistory: [
      { time: '10:00', temp: 21.9, humidity: 46, latency: 19 },
      { time: '10:15', temp: 21.8, humidity: 45, latency: 18 },
      { time: '10:30', temp: 21.7, humidity: 45, latency: 18 },
      { time: '10:45', temp: 21.8, humidity: 45, latency: 18 }
    ]
  },
  {
    id: 'smart-farm',
    name: 'โรงเรือนเกษตรอัจฉริยะ',
    locationName: 'แปลงทดลองที่ 2',
    hardwareModel: 'ESP32 Agri-Control RS485',
    connectionStatus: 'Online',
    relayStatus: false,
    temperatureCelsius: 31.2,
    humidityPercentage: 68,
    wifiSignalDbm: -65,
    connectionLatencyMs: 65,
    lastSeenTimestamp: 'เมื่อสักครู่',
    telemetryHistory: [
      { time: '10:00', temp: 30.5, humidity: 70, latency: 68 },
      { time: '10:15', temp: 30.9, humidity: 69, latency: 64 },
      { time: '10:30', temp: 31.1, humidity: 68, latency: 66 },
      { time: '10:45', temp: 31.2, humidity: 68, latency: 65 }
    ]
  }
];

const INITIAL_TELEMETRY_LOGS: DeviceTelemetryEvent[] = [
  { eventId: 'evt-101', timestamp: '10:45:12', deviceName: 'ESP32 Industrial Gateway', eventDescription: 'Telemetry MQTT packet dispatched (18ms)', severity: 'normal' },
  { eventId: 'evt-102', timestamp: '10:44:50', deviceName: 'ห้องประชุม ESP32-C3', eventDescription: 'Relay heartbeat ping verified', severity: 'normal' },
  { eventId: 'evt-103', timestamp: '10:43:10', deviceName: 'โรงเรือนเกษตรอัจฉริยะ', eventDescription: 'RS485 Modbus soil sensor reading received', severity: 'info' }
];

export default function HomePage() {
  const { services, integrations, concepts, config, allProjects, isLoading } = usePortfolioData();
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);

  // IoT Simulation State
  const [iotDevices, setIotDevices] = useState<IoTDeviceState[]>(INITIAL_IOT_DEVICES);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('conference-room');
  const [telemetryLogs, setTelemetryLogs] = useState<DeviceTelemetryEvent[]>(INITIAL_TELEMETRY_LOGS);

  const selectedDevice = iotDevices.find(d => d.id === selectedDeviceId) || iotDevices[0];

  const handleToggleRelay = (deviceId: string) => {
    setIotDevices(prev =>
      prev.map(dev => {
        if (dev.id === deviceId) {
          const nextState = !dev.relayStatus;
          const nowStr = new Date().toLocaleTimeString('th-TH');
          setTelemetryLogs(prevLogs => [
            {
              eventId: `evt-${Date.now()}`,
              timestamp: nowStr,
              deviceName: dev.name,
              eventDescription: `รีเลย์ถูกสั่งงานเป็น: ${nextState ? 'เปิด (ON)' : 'ปิด (OFF)'}`,
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

  const messengerUrl = config.contact_messenger || 'https://m.me/DeeDevIOT';
  const facebookUrl = config.contact_facebook_th ? `https://www.facebook.com/${config.contact_facebook_th}` : 'https://www.facebook.com/DeeDevIOT';

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] font-sans antialiased relative">
      {/* Background tech grid */}
      <div className="fixed inset-0 bg-tech-grid-light opacity-60 pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={() => setLang(lang === 'th' ? 'en' : 'th')}
        messengerUrl={messengerUrl}
      />

      <main className="relative z-10 pt-28 space-y-24 pb-20">
        
        {/* ================= 1. HERO SECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Col: Headline & Primary CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-[#E11D48] text-xs font-mono font-bold shadow-2xs">
                <Sparkles size={14} />
                <span>{config.hero_badge_th || 'NEXT-GEN IOT & WEB PLATFORM'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight">
                {lang === 'th' 
                  ? (config.hero_headline_th || 'วิศวกรรม IoT และแพลตฟอร์มระบบ สำหรับธุรกิจยุคใหม่') 
                  : (config.hero_headline_en || 'Industrial IoT & Production-Ready Web Engineering')}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {lang === 'th'
                  ? (config.hero_sub_th || 'ออกแบบฮาร์ดแวร์ บอร์ดคอนโทรล ระบบอัตโนมัติ และเว็บแอปพลิเคชันสำหรับภาคธุรกิจแบบครบวงจร ส่งข้อมูลแบบ Real-time เชื่อมต่อ LINE และ Google Sheets ได้ทันที')
                  : (config.hero_sub_en || 'Custom hardware design, embedded firmware, and real-time cloud web applications.')}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0084FF] via-[#00A3FF] to-[#00C6FF] text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <MessengerIcon className="w-5 h-5 fill-white" />
                  <span>ทักแชท Messenger คุยกับเรา</span>
                </a>

                <Link
                  href="/showcase"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold border-2 border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex items-center gap-2"
                >
                  <span>ชมผลงานจริง & Live Demo</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Quick stats pills */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-slate-200/90 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">100%</div>
                  <div className="text-[10px] text-slate-500 font-medium">Tailor-Made Code</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">&lt; 50ms</div>
                  <div className="text-[10px] text-slate-500 font-medium">Real-time Latency</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">24/7</div>
                  <div className="text-[10px] text-slate-500 font-medium">Industrial Stability</div>
                </div>
              </div>
            </div>

            {/* Right Col: Live Interactive IoT Sandbox */}
            <div className="lg:col-span-5 bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-lg space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-xs font-mono font-bold text-slate-800">
                    LIVE HARDWARE TELEMETRY
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  CONNECTED
                </span>
              </div>

              {/* Device Selector */}
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                {iotDevices.map(dev => (
                  <button
                    key={dev.id}
                    onClick={() => setSelectedDeviceId(dev.id)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold truncate transition-all cursor-pointer ${
                      dev.id === selectedDeviceId
                        ? 'bg-white text-slate-950 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    {dev.name}
                  </button>
                ))}
              </div>

              {/* Active Device Dashboard Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{selectedDevice.name}</h3>
                    <p className="text-[10px] font-mono text-slate-500">{selectedDevice.hardwareModel}</p>
                  </div>
                  <button
                    onClick={() => handleToggleRelay(selectedDevice.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      selectedDevice.relayStatus
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-300'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    <Power size={13} />
                    <span>{selectedDevice.relayStatus ? 'RELAY: ON' : 'RELAY: OFF'}</span>
                  </button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-mono block">TEMP</span>
                    <span className="text-base font-black text-slate-900 font-mono">
                      {selectedDevice.temperatureCelsius}°C
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-mono block">HUMIDITY</span>
                    <span className="text-base font-black text-slate-900 font-mono">
                      {selectedDevice.humidityPercentage}%
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-mono block">PING</span>
                    <span className="text-base font-black text-emerald-600 font-mono">
                      {selectedDevice.connectionLatencyMs}ms
                    </span>
                  </div>
                </div>

                {/* Telemetry Chart */}
                <div className="h-28 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedDevice.telemetryHistory}>
                      <defs>
                        <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E11D48" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '11px',
                          color: '#fff'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="temp"
                        stroke="#E11D48"
                        strokeWidth={2}
                        fill="url(#telemetryGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Event Logs Stream */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  REAL-TIME DISPATCH LOGS
                </span>
                <div className="space-y-1 max-h-24 overflow-hidden text-[11px] font-mono">
                  {telemetryLogs.slice(0, 2).map(log => (
                    <div key={log.eventId} className="bg-slate-50 px-2.5 py-1 rounded border border-slate-200 flex items-center justify-between text-slate-700">
                      <span className="truncate">{log.eventDescription}</span>
                      <span className="text-slate-400 shrink-0 ml-2">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================= 2. SERVICES HIGHLIGHTS ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#E11D48] text-xs font-mono font-bold mb-2">
                <Cpu size={14} />
                <span>CORE SERVICES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                บริการวิศวกรรมหลักของเรา
              </h2>
            </div>
            <Link
              href="/services"
              className="text-xs font-bold text-[#E11D48] hover:text-[#BE123C] flex items-center gap-1 transition-transform group"
            >
              <span>ดูบริการทั้งหมด ({services.length} รายการ)</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(0, 3).map(svc => {
              const imgUrls = svc.imageUrl ? svc.imageUrl.split(',').map(u => u.trim()).filter(Boolean) : [];
              return (
                <div
                  key={svc.id}
                  className="bg-white border-2 border-slate-200/90 hover:border-[#E11D48] rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all p-5 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {imgUrls[0] && (
                      <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <ImageWithFallback
                          src={imgUrls[0]}
                          alt={svc.title_th || svc.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                      </div>
                    )}
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-[#E11D48] border border-rose-200">
                      {svc.icon || 'Solution'}
                    </span>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-[#E11D48] transition-colors">
                      {svc.title_th || svc.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {svc.description_th || svc.description}
                    </p>
                  </div>

                  <Link
                    href="/services"
                    className="pt-3 border-t border-slate-100 text-xs font-bold text-[#E11D48] flex items-center justify-between"
                  >
                    <span>อ่านรายละเอียดบริการ</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 3. FEATURED SHOWCASE PORTFOLIO ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-mono font-bold mb-2">
                <Sparkles size={14} />
                <span>DELIVERED WORKS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ผลงานระบบที่ส่งมอบจริง & Live Demo
              </h2>
            </div>
            <Link
              href="/showcase"
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 transition-transform group"
            >
              <span>ชมแกลเลอรีผลงานทั้งหมด ({allProjects.length} รายการ)</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allProjects.slice(0, 3).map(proj => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onSelect={p => setActiveProjectModal(p)}
              />
            ))}
          </div>
        </section>

        {/* ================= 4. SUPPORTED INTEGRATIONS TEASER ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold mb-2">
                <Wifi size={14} />
                <span>INTEGRATION ECOSYSTEM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ฮาร์ดแวร์และโปรโตคอลที่รองรับ
              </h2>
            </div>
            <Link
              href="/integrations"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-transform group"
            >
              <span>ดูข้อมูลการเชื่อมต่อเชิงลึก</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: 'ESP32 & Microcontrollers', sub: 'Wi-Fi / BLE / FreeRTOS', icon: Cpu },
              { title: 'RS485 & Modbus RTU', sub: 'Industrial Sensor Protocol', icon: Wifi },
              { title: 'MQTT & WebSockets', sub: 'Sub-second Real-time Sync', icon: Zap },
              { title: 'LINE OA & LIFF App', sub: 'Instant Mobile Notification', icon: MessageCircle }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl border-2 border-slate-200/90 shadow-2xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                    <Icon size={20} />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] font-mono text-slate-500">{item.sub}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 5. HIGH-CONVERSION CONTACT BANNER ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-8 sm:p-14 text-white border-2 border-slate-700 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                READY TO BUILD YOUR SYSTEM?
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                พร้อมยกระดับธุรกิจของคุณด้วยเทคโนโลยี IoT แล้วหรือยัง?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                ปรึกษาทีมงาน DeeDevIoT ได้ทันทีทาง Facebook Messenger หรือเลือกชมช่องทางติดต่ออย่างเป็นทางการทั้งหมด
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0">
              <a
                href={messengerUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#0084FF] via-[#00A3FF] to-[#00C6FF] text-white text-xs sm:text-sm font-black shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <MessengerIcon className="w-5 h-5 fill-white" />
                <span>ทักแชท Messenger ทันที</span>
              </a>

              <Link
                href="/contact"
                className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition-all"
              >
                ดูช่องทางติดต่อทั้งหมด →
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Project Modal */}
      <ProjectModal
        project={activeProjectModal}
        onClose={() => setActiveProjectModal(null)}
        messengerUrl={messengerUrl}
      />

      {/* Floating Messenger Widget */}
      <FloatingMessenger messengerUrl={messengerUrl} />

      {/* Global Footer */}
      <Footer
        facebookUrl={facebookUrl}
        messengerUrl={messengerUrl}
        email={config.contact_email}
        phone={config.contact_phone}
      />
    </div>
  );
}
