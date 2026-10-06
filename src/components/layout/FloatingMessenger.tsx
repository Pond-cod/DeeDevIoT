"use client";

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, ArrowUpRight, Sparkles, X, Menu } from 'lucide-react';
import { FacebookIcon, MessengerIcon } from '../common/Icons';

interface FloatingMessengerProps {
  facebookUrl?: string;
  messengerUrl?: string;
}

export default function FloatingMessenger({
  facebookUrl = 'https://www.facebook.com/DeeDevIOT',
  messengerUrl = 'https://m.me/DeeDevIOT'
}: FloatingMessengerProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper for hash links based on current path
  const getLink = (hash: string) => {
    return pathname === '/' ? hash : `/${hash}`;
  };

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Delay closing slightly so small cursor gaps don't cause jitter
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  const handleClickToggle = () => {
    setIsOpen(prev => !prev);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      aria-label="Floating Navigation and Messenger Menu"
    >
      {/* Full Sub-Menu Flyout (Opens on hover or click) */}
      <div
        className={`transition-all duration-300 transform origin-bottom-right mb-3 ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div className="w-[280px] sm:w-[290px] rounded-2xl bg-[#0B132B]/95 backdrop-blur-xl border border-slate-700/80 shadow-[0_12px_45px_rgba(0,0,0,0.6)] p-4 text-white overflow-hidden relative">
          
          {/* Subtle Ambient Aurora Light */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Menu Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
            <span className="font-mono text-sm font-black tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>เมนูเว็บไซต์</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              ● ONLINE
            </span>
          </div>

          {/* Main Navigation Sub-Menu Items */}
          <nav className="flex flex-col space-y-0.5 font-mono text-xs text-slate-300">
            <a
              href={getLink('#hero')}
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-between group"
            >
              <span>Home (หน้าแรก)</span>
              <ChevronRight size={12} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </a>

            <a
              href={getLink('#works')}
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-between group"
            >
              <span>Works (ผลงานจริง)</span>
              <ChevronRight size={12} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </a>

            <a
              href={getLink('#services')}
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-between group"
            >
              <span>Services (บริการ)</span>
              <ChevronRight size={12} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </a>

            <a
              href={getLink('#solutions')}
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-between group"
            >
              <span>Solutions (โซลูชัน)</span>
              <ChevronRight size={12} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </a>

            <a
              href={getLink('#contact')}
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-between group"
            >
              <span>Contact (ติดต่อเรา)</span>
              <ChevronRight size={12} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </a>

            <a
              href={getLink('#about')}
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-between group"
            >
              <span>About (เกี่ยวกับเรา)</span>
              <ChevronRight size={12} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </a>
          </nav>

          {/* Highlighted Social & Messenger Section (เน้น ไฮไล) */}
          <div className="pt-3 mt-2 border-t border-slate-800 space-y-2 font-mono text-xs">
            
            {/* Highlight 1: Facebook Page */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/40 hover:border-blue-400 text-sky-400 hover:text-sky-200 transition-all flex items-center justify-between group shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                  <FacebookIcon className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="font-bold truncate text-[11px] sm:text-xs">Facebook: DeeDevIOT</span>
              </div>
              <ArrowUpRight size={14} className="text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-1" />
            </a>

            {/* Highlight 2: Inbox Messenger */}
            <a
              href={messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#0084FF]/25 via-[#00A3FF]/20 to-[#00C6FF]/25 hover:from-[#0084FF]/35 hover:to-[#00C6FF]/35 border border-[#0084FF]/60 hover:border-[#00C6FF] text-[#00C6FF] hover:text-white transition-all flex items-center justify-between group shadow-md hover:shadow-[0_0_20px_rgba(0,132,255,0.4)]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#0084FF] to-[#00C6FF] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                  <MessengerIcon className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="font-black text-white truncate text-[11px] sm:text-xs">Inbox Messenger</span>
              </div>
              <ArrowUpRight size={14} className="text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-1" />
            </a>

          </div>

        </div>
      </div>

      {/* Floating Trigger Button (เริ่มต้นเป็นแค่ไอคอนเดี่ยว) */}
      <button
        type="button"
        onClick={handleClickToggle}
        className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-[#0084FF] via-[#00A3FF] to-[#00C6FF] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,132,255,0.45)] hover:shadow-[0_6px_25px_rgba(0,132,255,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white/90 cursor-pointer"
        aria-label="เปิดเมนูนำทางและติดต่อ Inbox Messenger"
        title="เมนูเว็บไซต์ & ทัก Inbox ปรึกษาเรา"
      >
        {/* Soft breathing pulse effect */}
        <span className="absolute -inset-1 rounded-full bg-sky-400 opacity-30 group-hover:opacity-60 blur-xs animate-ping pointer-events-none" />

        {/* Dynamic Icon */}
        {isOpen ? (
          <X className="w-6 h-6 text-white relative z-10 transition-transform duration-200 rotate-90 group-hover:rotate-180" />
        ) : (
          <MessengerIcon className="w-7 h-7 fill-white relative z-10 transition-transform group-hover:scale-105" />
        )}

        {/* Online Status Dot */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full z-20 shadow-xs" />
      </button>

    </div>
  );
}
