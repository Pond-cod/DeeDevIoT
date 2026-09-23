"use client";

import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, Loader2, CheckCircle2, AlertCircle, 
  ExternalLink, Mail, Phone, Sparkles 
} from 'lucide-react';
import { SiteConfig } from '../../../types/portfolio';
import { FacebookIcon, MessengerIcon } from '../../../components/common/Icons';

export default function AdminConfigPage() {
  const [config, setConfig] = useState<SiteConfig>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/config', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setConfig(json.data);
      }
    } catch {
      setStatus({ type: 'error', message: 'ไม่สามารถโหลดการตั้งค่าได้' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const json = await res.json();

      if (json.success) {
        setStatus({ type: 'success', message: 'บันทึกการตั้งค่าเว็บไซต์และช่องทางติดต่อสำเร็จแล้ว' });
      } else {
        setStatus({ type: 'error', message: json.error || 'บันทึกไม่สำเร็จ' });
      }
    } catch {
      setStatus({ type: 'error', message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Settings size={22} className="text-slate-800" />
            <span>ตั้งค่าเว็บไซต์และช่องทางติดต่อ (Site & Contact Config)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            จัดการข้อความพาดหัว Hero Banner และช่องทาง Facebook / Messenger หลัก
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving || isLoading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#EA580C] hover:opacity-95 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          <span>{isSaving ? 'กำลังบันทึกลงชีต...' : 'บันทึกการตั้งค่าทั้งหมด'}</span>
        </button>
      </div>

      {/* Status Toast */}
      {status.type && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{status.message}</span>
          </div>
          <button onClick={() => setStatus({ type: null, message: '' })} className="text-slate-400 hover:text-slate-700">
            ×
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-700" />
          <p className="mt-2 text-xs text-slate-500 font-mono">กำลังโหลดการตั้งค่า...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Facebook & Contact Channels */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200/90 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <MessengerIcon className="w-4 h-4 fill-[#0084FF]" />
                  <span>ช่องทางติดต่อหลัก (Facebook & Messenger Centric)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  ลิงก์สำหรับปุ่มทักแชท Floating Button และการ์ดข้อมูลติดต่อทั้งหมด
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0084FF] text-[10px] font-mono font-bold border border-sky-200">
                ACTIVE CHANNELS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Facebook Messenger URL (ทักแชท Inbox ทันที) *
                </label>
                <input
                  type="text"
                  required
                  value={config.contact_messenger || ''}
                  onChange={e => setConfig({ ...config, contact_messenger: e.target.value })}
                  placeholder="https://m.me/DeeDevIOT"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-mono text-slate-900 outline-none focus:border-[#0084FF]"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  เช่น https://m.me/DeeDevIOT (ใช้สำหรับปุ่มลอยมุมขวาล่างและปุ่มทักแชท)
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Facebook Page User / URL (เพจหลัก) *
                </label>
                <input
                  type="text"
                  required
                  value={config.contact_facebook_th || ''}
                  onChange={e => setConfig({ ...config, contact_facebook_th: e.target.value, contact_facebook_en: e.target.value })}
                  placeholder="DeeDevIOT หรือ https://www.facebook.com/DeeDevIOT"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none focus:border-[#1877F2]"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  ใส่ชื่อเพจ เช่น DeeDevIOT หรือลิงก์เต็ม
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Official Email (อีเมลติดต่อ)
                </label>
                <input
                  type="email"
                  value={config.contact_email || ''}
                  onChange={e => setConfig({ ...config, contact_email: e.target.value })}
                  placeholder="hello@deedeviot.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Telephone (เบอร์โทรศัพท์ติดต่อ)
                </label>
                <input
                  type="text"
                  value={config.contact_phone || ''}
                  onChange={e => setConfig({ ...config, contact_phone: e.target.value })}
                  placeholder="02-xxx-xxxx หรือ 08x-xxx-xxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Hero Banner Settings */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200/90 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-[#E11D48]" />
                <span>ข้อความพาดหัวหน้าแรก (Hero Banner Content)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ข้อความส่วนแรกที่ลูกค้าจะเห็นเมื่อเข้าเว็บไซต์
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Badge ด้านบน (ภาษาไทย)
                  </label>
                  <input
                    type="text"
                    value={config.hero_badge_th || ''}
                    onChange={e => setConfig({ ...config, hero_badge_th: e.target.value })}
                    placeholder="NEXT-GEN IOT & WEB PLATFORM"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Badge ด้านบน (English)
                  </label>
                  <input
                    type="text"
                    value={config.hero_badge_en || ''}
                    onChange={e => setConfig({ ...config, hero_badge_en: e.target.value })}
                    placeholder="PRODUCTION-READY PLATFORM"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  ข้อความพาดหัวหลัก Headline (ภาษาไทย) *
                </label>
                <input
                  type="text"
                  required
                  value={config.hero_headline_th || ''}
                  onChange={e => setConfig({ ...config, hero_headline_th: e.target.value })}
                  placeholder="วิศวกรรม IoT และแพลตฟอร์มระบบ สำหรับธุรกิจยุคใหม่"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 font-bold outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  ข้อความพาดหัวหลัก Headline (English)
                </label>
                <input
                  type="text"
                  value={config.hero_headline_en || ''}
                  onChange={e => setConfig({ ...config, hero_headline_en: e.target.value })}
                  placeholder="Industrial IoT & Production-Ready Web Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  คำบรรยายย่อย Subtitle (ภาษาไทย)
                </label>
                <textarea
                  rows={3}
                  value={config.hero_sub_th || ''}
                  onChange={e => setConfig({ ...config, hero_sub_th: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#EA580C] hover:opacity-95 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{isSaving ? 'กำลังบันทึกลงชีต...' : 'บันทึกการตั้งค่าทั้งหมด'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
