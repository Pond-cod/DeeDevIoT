"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, ExternalLink, ArrowUpRight } from 'lucide-react';
import { FacebookIcon, MessengerIcon } from '../common/Icons';

interface FooterProps {
  facebookUrl?: string;
  messengerUrl?: string;
  email?: string;
  phone?: string;
}

export default function Footer({
  facebookUrl = 'https://www.facebook.com/DeeDevIOT',
  messengerUrl = 'https://m.me/DeeDevIOT',
  email = 'hello@deedeviot.com',
  phone = '02-xxx-xxxx'
}: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E11D48] to-[#EA580C] p-[2px]">
                <div className="w-full h-full bg-slate-900 rounded-[6px] flex items-center justify-center">
                  <span className="font-mono font-black text-rose-500 text-xs">D</span>
                </div>
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                DeeDev<span className="text-[#E11D48]">IoT</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              ผู้เชี่ยวชาญการออกแบบและพัฒนาระบบ Industrial IoT, ไมโครคอนโทรลเลอร์ ESP32, ตู้คอนโทรลโรงงาน, 
              และ Cloud Web Applications ตอบสนองแบบ Real-time เชื่อมต่อ LINE OA และ Google Sheets
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={messengerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0084FF] to-[#00C6FF] text-white text-xs font-bold shadow-xs hover:opacity-90 transition-all"
              >
                <MessengerIcon className="w-4 h-4 fill-white" />
                <span>ทักแชท Messenger</span>
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877F2] text-white text-xs font-bold hover:bg-[#1877F2]/90 transition-all"
              >
                <FacebookIcon className="w-4 h-4 fill-white" />
                <span>เพจ DeeDevIOT</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              แผนผังเว็บไซต์ (Navigation)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-rose-400 transition-colors">
                  หน้าแรก (Home Overview)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-rose-400 transition-colors">
                  บริการโซลูชัน (Services)
                </Link>
              </li>
              <li>
                <Link href="/showcase" className="hover:text-rose-400 transition-colors">
                  ผลงาน & Live Demo (Showcase)
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-rose-400 transition-colors">
                  เทคโนโลยีที่รองรับ (Integrations)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-rose-400 transition-colors">
                  ติดต่อสอบถาม (Contact)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              ช่องทางติดต่อ (Direct Channels)
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MessengerIcon className="w-4 h-4 fill-[#0084FF] shrink-0" />
                  <span className="truncate">Inbox: m.me/DeeDevIOT</span>
                </a>
              </li>
              <li>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <FacebookIcon className="w-4 h-4 fill-[#1877F2] shrink-0" />
                  <span className="truncate">Facebook: DeeDevIOT</span>
                </a>
              </li>
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Mail size={16} className="text-rose-400 shrink-0" />
                    <span className="truncate">{email}</span>
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Phone size={16} className="text-amber-400 shrink-0" />
                    <span>{phone}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} DeeDevIoT. All rights reserved. Engineering Real-Time IoT Platforms.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-slate-300 transition-colors">
              Admin Console
            </Link>
            <span>•</span>
            <a href={facebookUrl} target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">
              Facebook
            </a>
            <span>•</span>
            <a href={messengerUrl} target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">
              Messenger
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
