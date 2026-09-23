"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, Lock, MessageCircle } from 'lucide-react';
import { MessengerIcon } from '../common/Icons';
import VisitorCounter from '../common/VisitorCounter';

interface NavbarProps {
  lang?: 'th' | 'en';
  onToggleLang?: () => void;
  messengerUrl?: string;
}

export default function Navbar({
  lang = 'th',
  onToggleLang,
  messengerUrl = 'https://m.me/DeeDevIOT'
}: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', labelTh: 'หน้าแรก', labelEn: 'Home' },
    { href: '/services', labelTh: 'บริการโซลูชัน', labelEn: 'Services' },
    { href: '/showcase', labelTh: 'ผลงาน & Live Demo', labelEn: 'Showcase' },
    { href: '/integrations', labelTh: 'เทคโนโลยีที่รองรับ', labelEn: 'Integrations' },
    { href: '/contact', labelTh: 'ติดต่อสอบถาม', labelEn: 'Contact' }
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3.5'
          : 'bg-white/60 backdrop-blur-xs border-b border-transparent py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E11D48] via-[#EA580C] to-[#F59E0B] p-[2px] shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                <span className="font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] to-[#EA580C] text-sm">
                  D
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none group-hover:text-[#E11D48] transition-colors">
                DeeDev<span className="text-[#E11D48]">IoT</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider">
                Industrial & Web Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/90 shadow-2xs">
            {navItems.map(item => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    active
                      ? 'bg-white text-[#E11D48] shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                  }`}
                >
                  {lang === 'th' ? item.labelTh : item.labelEn}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <VisitorCounter />

            {onToggleLang && (
              <button
                onClick={onToggleLang}
                className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="สลับภาษา / Switch Language"
              >
                {lang === 'th' ? 'EN' : 'TH'}
              </button>
            )}

            <a
              href={messengerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0084FF] to-[#00C6FF] text-white text-xs font-bold shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all"
            >
              <MessengerIcon className="w-4 h-4 fill-white" />
              <span>ทักแชทปรึกษา</span>
            </a>

            <Link
              href="/admin"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="ระบบจัดการ Admin"
            >
              <Lock size={16} />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            {onToggleLang && (
              <button
                onClick={onToggleLang}
                className="px-2 py-1 text-[11px] font-bold rounded-md border border-slate-200 text-slate-700"
              >
                {lang === 'th' ? 'EN' : 'TH'}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 mt-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navItems.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                  active
                    ? 'bg-rose-50 text-[#E11D48]'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {lang === 'th' ? item.labelTh : item.labelEn}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <VisitorCounter compact className="shrink-0" />
            <a
              href={messengerUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-[#0084FF] to-[#00C6FF] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2"
            >
              <MessengerIcon className="w-4 h-4 fill-white" />
              <span>ทัก Inbox Messenger</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-xl"
              title="Admin"
            >
              <Lock size={18} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
