"use client";

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Home, Sparkles, Layers, Zap, MessageSquare, Info, 
  ChevronRight, ArrowUpRight, X 
} from 'lucide-react';
import { FacebookIcon, MessengerIcon } from '../common/Icons';

interface FloatingMessengerProps {
  facebookUrl?: string;
  messengerUrl?: string;
}

const navItems = [
  {
    id: 'hero',
    name: 'Home',
    desc: 'หน้าแรก',
    icon: Home,
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-500/15 border-sky-500/30 group-hover:bg-sky-500 group-hover:text-white',
    hoverBg: 'hover:bg-sky-500/10 hover:border-sky-500/30',
  },
  {
    id: 'works',
    name: 'Works',
    desc: 'ผลงานจริง',
    icon: Sparkles,
    badge: '⭐ HOT',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/15 border-rose-500/30 group-hover:bg-rose-500 group-hover:text-white',
    hoverBg: 'hover:bg-rose-500/10 hover:border-rose-500/30',
  },
  {
    id: 'services',
    name: 'Services',
    desc: 'บริการที่รับทำ',
    icon: Layers,
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/15 border-indigo-500/30 group-hover:bg-indigo-500 group-hover:text-white',
    hoverBg: 'hover:bg-indigo-500/10 hover:border-indigo-500/30',
  },
  {
    id: 'solutions',
    name: 'Solutions',
    desc: 'โซลูชัน IoT & Web',
    icon: Zap,
    badge: '● LIVE',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15 border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white',
    hoverBg: 'hover:bg-emerald-500/10 hover:border-emerald-500/30',
  },
  {
    id: 'contact',
    name: 'Contact',
    desc: 'ช่องทางติดต่อ',
    icon: MessageSquare,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/15 border-amber-500/30 group-hover:bg-amber-500 group-hover:text-white',
    hoverBg: 'hover:bg-amber-500/10 hover:border-amber-500/30',
  },
  {
    id: 'about',
    name: 'About',
    desc: 'เกี่ยวกับเรา',
    icon: Info,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/15 border-purple-500/30 group-hover:bg-purple-500 group-hover:text-white',
    hoverBg: 'hover:bg-purple-500/10 hover:border-purple-500/30',
  },
];

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

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setIsOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      const cleanId = targetId.replace(/^#/, '');
      if (cleanId === 'hero' || !cleanId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.replaceState(null, '', '/');
      } else {
        const el = document.getElementById(cleanId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          window.history.replaceState(null, '', `#${cleanId}`);
        }
      }
    }
  };

  const handleButtonMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMenuMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 280);
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
      onMouseLeave={handleMouseLeave}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      aria-label="Floating Navigation and Messenger Menu"
    >
      {/* Full Sub-Menu Flyout (Opens on hover over trigger button or click) */}
      <div
        onMouseEnter={handleMenuMouseEnter}
        className={`absolute bottom-full right-0 mb-3 transition-all duration-300 transform origin-bottom-right ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto visible'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none invisible'
        }`}
      >
        <div className="w-[290px] sm:w-[305px] rounded-3xl bg-[#090E1F]/95 backdrop-blur-2xl border border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-3.5 text-white overflow-hidden relative">
          
          {/* Subtle Ambient Aurora Light */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Menu Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-800/80 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-black tracking-wider text-slate-200">
                DEEDEV // NAV
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              ● ONLINE
            </span>
          </div>

          {/* Main Navigation Sub-Menu Items with distinct colors & icons */}
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              return (
                <a
                  key={item.id}
                  href={getLink(`#${item.id}`)}
                  onClick={(e) => handleAnchorClick(e, item.id)}
                  className={`px-2.5 py-2 rounded-xl border border-transparent ${item.hoverBg} transition-all flex items-center justify-between group cursor-pointer`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg ${item.iconBg} border flex items-center justify-center shrink-0 transition-colors shadow-2xs`}>
                      <IconComp size={14} className={item.iconColor} />
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-100 group-hover:text-white text-xs leading-none">
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-300 leading-tight mt-0.5 font-sans">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={13} className="text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </a>
              );
            })}
          </nav>

          {/* Highlighted Social & Messenger Section (เน้น ไฮไล) */}
          <div className="pt-2.5 mt-2 border-t border-slate-800/80 space-y-2">
            
            {/* Highlight 1: Facebook Page */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/40 hover:border-blue-400 text-sky-300 hover:text-white transition-all flex items-center justify-between group shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                  <FacebookIcon className="w-3.5 h-3.5 fill-white" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-xs truncate leading-none">Facebook Page</span>
                  <span className="text-[10px] text-sky-400/80 font-mono">@DeeDevIOT</span>
                </div>
              </div>
              <ArrowUpRight size={14} className="text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-1" />
            </a>

            {/* Highlight 2: Inbox Messenger */}
            <a
              href={messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#0084FF] via-[#00A3FF] to-[#00C6FF] hover:brightness-110 text-white transition-all flex items-center justify-between group shadow-md shadow-[#0084FF]/25 hover:shadow-[0_0_20px_rgba(0,132,255,0.45)]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-xs text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                  <MessengerIcon className="w-3.5 h-3.5 fill-white" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-black text-xs text-white truncate leading-none">ทัก Inbox Messenger</span>
                  <span className="text-[10px] text-white/80 font-sans">ปรึกษาโปรเจกต์ฟรี ตอบไว</span>
                </div>
              </div>
              <ArrowUpRight size={14} className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-1" />
            </a>

          </div>

        </div>
      </div>

      {/* Floating Trigger Button (เริ่มต้นเป็นแค่ไอคอนเดี่ยว) */}
      <button
        type="button"
        onMouseEnter={handleButtonMouseEnter}
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
