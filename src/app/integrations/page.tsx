"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Cpu, Wifi, Server, Database, Globe, ShieldCheck, 
  ExternalLink, FileText, CheckCircle2, ArrowRight, Sparkles, Zap, Lock
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import FloatingMessenger from '../../components/layout/FloatingMessenger';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { MessengerIcon } from '../../components/common/Icons';

export default function IntegrationsPage() {
  const { integrations, concepts, config, isLoading } = usePortfolioData();
  const [lang, setLang] = useState<'th' | 'en'>('th');

  const HARDWARE_CATEGORIES = [
    {
      title: 'Microcontrollers & Edge Hardware',
      titleTh: 'ไมโครคอนโทรลเลอร์ & บอร์ดควบคุม',
      descTh: 'รองรับการพัฒนาเฟิร์มแวร์ C/C++, FreeRTOS บนชิปหลากหลายตระกูล',
      icon: Cpu,
      color: 'from-rose-500 to-red-600',
      items: ['ESP32 (Wi-Fi/BLE)', 'ESP32-S3 / C3', 'STM32 ARM Cortex', 'Raspberry Pi / Linux', 'Industrial PLC (Modbus)', 'Arduino / ATmega']
    },
    {
      title: 'Sensors & Industrial Protocols',
      titleTh: 'เซนเซอร์ & โปรโตคอลอุตสาหกรรม',
      descTh: 'เชื่อมต่อและอ่านค่าทางกายภาพในสภาพแวดล้อมจริงได้อย่างแม่นยำ',
      icon: Wifi,
      color: 'from-amber-500 to-orange-600',
      items: ['RS485 / Modbus RTU', '4-20mA Analog Loop', '0-10V Voltage Signal', 'I2C / SPI Sensors', 'Pulse Counter / Flow', 'Isolated Power Relays']
    },
    {
      title: 'Real-Time Communication',
      titleTh: 'ระบบสื่อสารแบบ Real-time',
      descTh: 'ส่งสัญญาณด่วนระดับเสี้ยววินาที รองรับการสตรีมข้อมูล telemetry ต่อเนื่อง',
      icon: Zap,
      color: 'from-sky-500 to-blue-600',
      items: ['MQTT (Broker Sync)', 'WebSockets Full-duplex', 'RESTful JSON API', 'HTTPS / TLS Security', 'LINE Messaging API', 'LINE LIFF Front-end']
    },
    {
      title: 'Cloud & Database Storage',
      titleTh: 'คลาวด์และระบบฐานข้อมูล',
      descTh: 'จัดเก็บและประมวลผลข้อมูลทั้งแบบเรียบง่ายและระดับ Production',
      icon: Database,
      color: 'from-emerald-500 to-teal-600',
      items: ['Google Sheets CMS Sync', 'PostgreSQL / Supabase', 'Redis Real-time Cache', 'Vercel Serverless', 'Cloud Time-series DB', 'Node.js Microservices']
    }
  ];

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Header Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-[#E11D48] text-xs font-mono font-bold shadow-2xs">
              <Cpu size={14} />
              <span>SUPPORTED TECHNOLOGIES & PROTOCOLS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              {lang === 'th' ? 'ฮาร์ดแวร์ เซนเซอร์ และโปรโตคอลที่รองรับ' : 'Supported Hardware, Sensors & Cloud Stack'}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              เราออกแบบสถาปัตยกรรมระบบที่ยืดหยุ่น เชื่อมต่อได้ตั้งแต่ระดับเซนเซอร์วัดค่าทางกายภาพในโรงงาน 
              สู่บอร์ดควบคุมไมโครคอนโทรลเลอร์ จนถึงคลาวด์แพลตฟอร์มและแดชบอร์ดระดับองค์กร
            </p>
          </div>

          {/* 4 Pillars Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {HARDWARE_CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-xs`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{cat.titleTh}</h3>
                      <p className="text-[11px] font-mono text-slate-500">{cat.title}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cat.descTh}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {cat.items.map((item, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-50 text-slate-800 border border-slate-200"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CMS Dynamic Integrations List */}
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  ระบบเชื่อมต่อและอุปกรณ์ในฐานข้อมูล (CMS Integrations)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  รายการระบบที่เชื่อมต่อและจัดการข้อมูลผ่าน Google Sheets CMS
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                {integrations.length} รายการ
              </span>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-[#E11D48] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map(item => (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-[#E11D48] hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-3">
                      {item.imageUrl && (
                        <div className="h-36 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt={item.title_th || item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-50 text-[#E11D48] border border-rose-200">
                          {item.tag || 'Hardware'}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-slate-900">
                        {item.title_th || item.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {item.description_th || item.description}
                      </p>
                    </div>

                    {/* Reference link */}
                    {item.referenceUrl && (
                      <div className="pt-3 border-t border-slate-100">
                        <a
                          href={item.referenceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                        >
                          <span>เปิดดูระบบอ้างอิง</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Concepts Architecture Highlights */}
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                หลักการออกแบบสถาปัตยกรรมระบบ (Engineering Principles)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                มาตรฐานความปลอดภัย ความทนทาน และการประมวลผลข้อมูลแบบไร้รอยต่อ
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {concepts.map(concept => (
                <div
                  key={concept.id}
                  className="bg-white border-2 border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-rose-400 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{concept.title_th}</h4>
                  <p className="text-[11px] font-mono text-slate-500">{concept.title_en}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{concept.desc_th}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-8 sm:p-12 text-white border-2 border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                CUSTOM PROTOCOL INTEGRATION
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                มีเซนเซอร์หรืออุปกรณ์เฉพาะทางที่ต้องการเชื่อมต่อ?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                ส่งสเปกฮาร์ดแวร์ หรือเอกสาร Register map ของ Modbus/RS485 มาให้ทีมวิศวกรช่วยประเมินการต่อวงจรได้ทันที
              </p>
            </div>

            <a
              href={config.contact_messenger || 'https://m.me/DeeDevIOT'}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#0084FF] to-[#00C6FF] text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0"
            >
              <MessengerIcon className="w-4 h-4 fill-white" />
              <span>ทักปรึกษาการเชื่อมต่อ</span>
            </a>
          </div>

        </div>
      </main>

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
