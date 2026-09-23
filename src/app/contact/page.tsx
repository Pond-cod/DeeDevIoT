"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, Phone, ExternalLink, Send, CheckCircle2, 
  HelpCircle, MessageCircle, Clock, ShieldCheck, Sparkles 
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import FloatingMessenger from '../../components/layout/FloatingMessenger';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { FacebookIcon, MessengerIcon } from '../../components/common/Icons';

export default function ContactPage() {
  const { config } = usePortfolioData();
  const [lang, setLang] = useState<'th' | 'en'>('th');

  // Interactive Form State
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [projectType, setProjectType] = useState('Industrial IoT & Automation');
  const [description, setDescription] = useState('');

  const messengerUrl = config.contact_messenger || 'https://m.me/DeeDevIOT';
  const facebookUrl = config.contact_facebook_th ? `https://www.facebook.com/${config.contact_facebook_th}` : 'https://www.facebook.com/DeeDevIOT';

  const handleSendToMessenger = (e: React.FormEvent) => {
    e.preventDefault();
    const textMsg = `สวัสดีครับ สนใจปรึกษาพัฒนาระบบ:\n- ผู้ติดต่อ: ${name || 'ไม่ระบุ'}\n- ช่องทางติดต่อกลับ: ${contactInfo || 'ไม่ระบุ'}\n- ประเภทโปรเจกต์: ${projectType}\n- รายละเอียดโจทย์: ${description || 'ต้องการสอบถามข้อมูลเพิ่มเติม'}`;
    const targetUrl = `${messengerUrl}?text=${encodeURIComponent(textMsg)}`;
    window.open(targetUrl, '_blank');
  };

  const FAQS = [
    {
      q: 'มีขั้นตอนการเริ่มงานและส่งมอบอย่างไร?',
      a: '1. พูดคุยวิเคราะห์โจทย์และความต้องการทางธุรกิจ 2. ออกแบบบล็อกไดอะแกรมระบบและเสนอราคา 3. พัฒนา Prototype ฮาร์ดแวร์/ซอฟต์แวร์ 4. ทดสอบความเสถียร (Burn-in Test) 5. ส่งมอบระบบจริงพร้อมโค้ดและคู่มือ'
    },
    {
      q: 'ระบบรองรับการเชื่อมต่อกับ LINE และ Google Sheets หรือไม่?',
      a: 'รองรับอย่างสมบูรณ์แบบ ทั้งระบบแจ้งเตือนผ่าน LINE Notify/LINE Messaging API, ระบบสั่งงานผ่าน LINE LIFF Web App, และการบันทึกฐานข้อมูลลง Google Sheets CMS แบบ Real-time'
    },
    {
      q: 'มีบริการออกแบบและประกอบตู้คอนโทรลฮาร์ดแวร์หรือไม่?',
      a: 'มีบริการจัดหาอุปกรณ์ ออกแบบวงจร PCB ตู้คอนโทรลกันน้ำกันฝุ่น (IP65) พร้อมติดตั้งตัวแปลงสัญญาณและ Relay ป้องกันสัญญาณรบกวน'
    },
    {
      q: 'การรับประกันและดูแลหลังส่งมอบงานเป็นอย่างไร?',
      a: 'เรารับประกันการทำงานของเฟิร์มแวร์และฮาร์ดแวร์ พร้อมบริการดูแลแก้ไขปัญหา ปรับจูนระบบ และอัปเดตความปลอดภัยตลอดอายุสัญญา'
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
        messengerUrl={messengerUrl}
      />

      <main className="relative z-10 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Header Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-[#E11D48] text-xs font-mono font-bold shadow-2xs">
              <Sparkles size={14} />
              <span>DIRECT CHANNELS & CONSULTATION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              {lang === 'th' ? 'ปรึกษาและออกแบบระบบกับ DeeDevIoT' : 'Start Your Project With DeeDevIoT'}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {config.contact_sub_th || 'ยินดีให้คำปรึกษาทุกโจทย์งานวิศวกรรม IoT ตู้คอนโทรลอัจฉริยะ ระบบ LINE OA และ Web Application ทักพูดคุยกับทีมวิศวกรได้โดยตรงทุกช่องทาง'}
            </p>
          </div>

          {/* 4 Direct Channel Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Messenger Inbox */}
            <a
              href={messengerUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-white border-2 border-[#0084FF]/40 hover:border-[#0084FF] rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sky-100 to-transparent rounded-bl-full pointer-events-none" />
              <div className="space-y-3 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0084FF] to-[#00C6FF] text-white flex items-center justify-center shadow-xs">
                  <MessengerIcon className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">ตอบกลับไว</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0084FF] transition-colors mt-1">
                    Messenger Inbox
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">ทักแชทสอบถาม ปรึกษาโจทย์ หรือส่งตัวอย่างงานได้ทันที</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#0084FF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                ทักแชท m.me/DeeDevIOT →
              </span>
            </a>

            {/* Card 2: Facebook Page */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-white border-2 border-slate-200/90 hover:border-[#1877F2] rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-xs">
                  <FacebookIcon className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">OFFICIAL PAGE</span>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#1877F2] transition-colors mt-1">
                    Facebook Page
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">ติดตามข่าวสาร อัปเดตผลงานโปรเจกต์ และโปรโมชัน</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#1877F2] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                เปิดเพจ DeeDevIOT ↗
              </span>
            </a>

            {/* Card 3: Email */}
            <a
              href={`mailto:${config.contact_email || 'hello@deedeviot.com'}`}
              className="bg-white border-2 border-slate-200/90 hover:border-[#E11D48] rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#E11D48] to-[#EA580C] text-white flex items-center justify-center shadow-xs">
                  <Mail size={22} />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">FORMAL INQUIRY</span>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#E11D48] transition-colors mt-1">
                    Email Official
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 truncate">{config.contact_email || 'hello@deedeviot.com'}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#E11D48] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                ส่งอีเมลขอใบเสนอราคา →
              </span>
            </a>

            {/* Card 4: Phone */}
            <a
              href={`tel:${config.contact_phone || '02-xxx-xxxx'}`}
              className="bg-white border-2 border-slate-200/90 hover:border-amber-500 rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-xs">
                  <Phone size={22} />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">DIRECT CALL</span>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors mt-1">
                    Telephone
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{config.contact_phone || '02-xxx-xxxx'}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                โทรติดต่อวิศวกร →
              </span>
            </a>
          </div>

          {/* Form & FAQ Split Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Project Inquiry Form (7 cols) */}
            <div className="lg:col-span-7 bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-sm space-y-6">
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <span className="text-xs font-mono font-bold text-[#E11D48] uppercase tracking-wider">
                  PROJECT SPECIFICATION FORM
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  ส่งข้อมูลโจทย์งาน เพื่อประเมินระบบ
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  กรอกข้อมูลเบื้องต้น ระบบจะจัดรูปแบบข้อความและส่งตรงเข้า Facebook Messenger ของทีมวิศวกรให้ทันที
                </p>
              </div>

              <form onSubmit={handleSendToMessenger} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    ชื่อผู้ติดต่อ / บริษัท หรือ หน่วยงาน *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="เช่น คุณสมชาย (บริษัท สมาร์ทเทค จำกัด)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0084FF] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    ช่องทางติดต่อกลับ (เบอร์โทร / อีเมล / Facebook) *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactInfo}
                    onChange={e => setContactInfo(e.target.value)}
                    placeholder="เช่น 081-xxx-xxxx หรือ email@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0084FF] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    ประเภทโปรเจกต์ที่สนใจ
                  </label>
                  <select
                    value={projectType}
                    onChange={e => setProjectType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0084FF] transition-all"
                  >
                    <option value="Industrial IoT & Automation">ระบบ Industrial IoT & ตู้คอนโทรลอุตสาหกรรม</option>
                    <option value="Smart Agriculture / Farm">ระบบ Smart Farm / ควบคุมน้ำและเซนเซอร์การเกษตร</option>
                    <option value="LINE LIFF & POS Platform">ระบบสั่งอาหาร LINE LIFF & จัดการร้านค้า POS</option>
                    <option value="Cloud Web Application & Dashboard">Cloud Web Application & แดชบอร์ดตรวจสอบสด</option>
                    <option value="Custom Hardware / PCB Design">ออกแบบวงจรฮาร์ดแวร์ & เฟิร์มแวร์เฉพาะทาง</option>
                    <option value="Other Consultation">ปรึกษาโจทย์อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    รายละเอียดโจทย์งาน หรือ ฟังก์ชันที่ต้องการ
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="อธิบายขั้นตอนการทำงานที่ต้องการ, จำนวนจุดที่ต้องติดตั้ง, ชนิดของเซนเซอร์, หรืออุปกรณ์ที่ต้องการเชื่อมต่อ..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-[#0084FF] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0084FF] via-[#00A3FF] to-[#00C6FF] hover:opacity-95 text-white font-extrabold text-xs tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessengerIcon className="w-5 h-5 fill-white" />
                  <span>ส่งข้อมูลและเริ่มปรึกษาผ่าน Messenger Inbox →</span>
                </button>
              </form>
            </div>

            {/* Right: FAQ Accordion (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-1 pb-2">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  FAQ & SUPPORT
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  คำถามที่พบบ่อย (FAQ)
                </h3>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-2 border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-2"
                  >
                    <h4 className="text-xs font-extrabold text-slate-900 flex items-start gap-2">
                      <HelpCircle size={16} className="text-[#E11D48] shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed pl-6">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

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
