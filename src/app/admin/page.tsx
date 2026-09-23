"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Server, Link as LinkIcon, Layers, Settings, 
  Lightbulb, ArrowRight, CheckCircle2, ShieldCheck, 
  ExternalLink, Sparkles, RefreshCw, Database, Eye
} from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';

export default function AdminDashboardPage() {
  const { services, integrations, sections, concepts, config, isLoading, refreshData } = usePortfolioData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  const fetchVisitors = async () => {
    try {
      const res = await fetch('/api/visitors', { cache: 'no-store' });
      const data = await res.json();
      if (typeof data.count === 'number') {
        setVisitorCount(data.count);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshData(), fetchVisitors()]);
    setIsRefreshing(false);
  };

  const statCards = [
    {
      title: 'บริการโซลูชัน (Services)',
      count: services.length,
      desc: 'ระบบ IoT และ Web ที่เปิดให้บริการ',
      icon: Server,
      color: 'from-rose-500 to-red-600',
      href: '/admin/services'
    },
    {
      title: 'เทคโนโลยีเชื่อมต่อ (Integrations)',
      count: integrations.length,
      desc: 'ฮาร์ดแวร์ เซนเซอร์ และโปรโตคอล',
      icon: LinkIcon,
      color: 'from-amber-500 to-orange-600',
      href: '/admin/integrations'
    },
    {
      title: 'เซกชัน CMS (Sections)',
      count: sections.length,
      desc: 'หัวข้อเนื้อหาและรายการย่อยของเว็บ',
      icon: Layers,
      color: 'from-sky-500 to-blue-600',
      href: '/admin/sections'
    },
    {
      title: 'คอนเซปต์สถาปัตยกรรม (Concepts)',
      count: concepts.length,
      desc: 'หลักการออกแบบและสเปกวิศวกรรม',
      icon: Lightbulb,
      color: 'from-emerald-500 to-teal-600',
      href: '/admin/concepts'
    },
    {
      title: 'ผู้เข้าชมเว็บไซต์ (Visitors)',
      count: visitorCount !== null ? visitorCount.toLocaleString('th-TH') : '...',
      desc: 'ยอดคนเข้าชมเว็บสะสมทั้งหมด',
      icon: Eye,
      color: 'from-blue-600 to-indigo-600',
      href: '/admin/config'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border-2 border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold">
            <Sparkles size={14} />
            <span>CENTRAL CMS CONTROL PANEL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            ยินดีต้อนรับสู่ระบบจัดการ DeeDevIoT
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            จัดการข้อมูลเว็บไซต์ ผลงานบริการ รูปภาพ และช่องทางติดต่อ ทั้งหมดซิงก์ข้อมูลแบบ Real-time เข้าสู่ Google Sheets อัตโนมัติ
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            <span>ซิงก์ข้อมูลชีต</span>
          </button>

          <Link
            href="/admin/services"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#EA580C] hover:opacity-95 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <span>จัดการบริการ →</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="bg-white border-2 border-slate-200/90 hover:border-slate-400 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-xs`}>
                  <Icon size={20} />
                </div>
                <span className="text-2xl font-black font-mono text-slate-900">
                  {isLoading ? '...' : card.count}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#E11D48] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{card.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#E11D48]">
                <span>เข้าสู่หน้าจัดการ</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Integration & Database Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Google Sheet Sync Card */}
        <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Database size={18} className="text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900">
                สถานะการเชื่อมต่อ Google Sheets CMS
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE & SYNCED
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            ระบบใช้ Service Account เชื่อมต่อไปยัง Google Sheet ID เพื่ออ่านและบันทึกข้อมูลแบบ 2-Way Synchronization ข้อมูลจะอัปเดตหน้าบ้านทันทีเมื่อมีการบันทึก
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
            <div className="text-slate-500 text-[10px]">GOOGLE SHEETS DATABASE:</div>
            <div className="text-slate-800 truncate font-bold flex items-center gap-1.5">
              <span className="text-emerald-600 font-sans">●</span>
              <span>1rXZb4••••••••••••••••mdt6aE (Protected via Env)</span>
            </div>
          </div>
        </div>

        {/* Quick Guide & Rules */}
        <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck size={18} className="text-[#E11D48]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              ข้อแนะนำการใส่รูปภาพ & ข้อมูล
            </h3>
          </div>

          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <b>Google Drive</b>: คัดลอกลิงก์ไฟล์มาวางได้โดยตรง ระบบแปลงเป็น Direct Link อัตโนมัติ (ต้องเปิดแชร์เป็น &quot;ทุกคนที่มีลิงก์มีสิทธิ์ดู&quot;)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <b>Facebook</b>: คลิกขวาที่ภาพ &gt; เลือก <b>&quot;คัดลอกที่อยู่รูปภาพ&quot; (Copy image address)</b> เพื่อนำลิงก์ CDN มาใส่
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <b>ติดต่อผ่าน Facebook</b>: แก้ไขลิงก์เพจ และ Messenger ได้ที่หน้า <b>ตั้งค่าเว็บ (Config)</b>
              </span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
