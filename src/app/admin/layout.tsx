"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Server, Link as LinkIcon, Settings, 
  Layers, Lightbulb, ExternalLink, LogOut, Menu, X, 
  ChevronRight, Sparkles, MessageCircle, ShieldCheck
} from 'lucide-react';

interface AdminMenuItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
}

interface AdminMenuGroup {
  group: string;
  items: AdminMenuItem[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems: AdminMenuGroup[] = [
    {
      group: 'ภาพรวมระบบ',
      items: [
        { href: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard, exact: true }
      ]
    },
    {
      group: 'จัดการข้อมูลบริการและผลงาน',
      items: [
        { href: '/admin/services', label: 'จัดการบริการ (Services)', icon: Server },
        { href: '/admin/integrations', label: 'จัดการเทคโนโลยี (Integrations)', icon: LinkIcon },
        { href: '/admin/sections', label: 'จัดการเซกชัน CMS (Sections)', icon: Layers },
        { href: '/admin/concepts', label: 'จัดการสถาปัตยกรรม (Concepts)', icon: Lightbulb }
      ]
    },
    {
      group: 'การตั้งค่าระบบ',
      items: [
        { href: '/admin/navigation', label: 'จัดการเมนูนำทาง (Navigation)', icon: LinkIcon },
        { href: '/admin/config', label: 'ตั้งค่าเว็บ & Facebook (Config)', icon: Settings }
      ]
    }
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-900 font-sans antialiased">
      
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 border-r border-slate-800 z-30 shrink-0 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E11D48] to-[#EA580C] p-[2px] shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[6px] flex items-center justify-center font-mono font-black text-rose-500 text-xs">
                D
              </div>
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-sm text-white tracking-tight leading-none">
                  DeeDev<span className="text-[#E11D48]">IoT</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Admin Console</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="ย่อ/ขยายเมนู"
          >
            <Menu size={16} />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {menuItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              {isSidebarOpen && (
                <div className="px-3 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  {group.group}
                </div>
              )}
              {group.items.map((item, iIdx) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={iIdx}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-gradient-to-r from-[#E11D48] to-[#EA580C] text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <Icon size={18} className="shrink-0" />
                    {isSidebarOpen && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom user / logout bar */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <ExternalLink size={16} className="shrink-0 text-sky-400" />
            {isSidebarOpen && <span>ดูหน้าเว็บจริง ↗</span>}
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-all cursor-pointer"
          >
            <LogOut size={16} className="shrink-0" />
            {isSidebarOpen && <span>{isLoggingOut ? 'กำลังออก...' : 'ออกจากระบบ'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span>Admin Console</span>
              <ChevronRight size={14} />
              <span className="text-slate-900 font-extrabold capitalize">
                {pathname.replace('/admin', '').replace('/', '') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <span>เปิดดูหน้าเว็บจริง</span>
              <ExternalLink size={13} className="text-sky-600" />
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                isLoggingOut
                  ? 'bg-rose-50 text-rose-400 cursor-not-allowed'
                  : 'bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 cursor-pointer'
              }`}
            >
              <LogOut size={14} className={isLoggingOut ? 'animate-pulse' : ''} />
              <span className="hidden sm:inline">{isLoggingOut ? 'กำลังออก...' : 'ออกจากระบบ'}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Sub-Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="relative w-72 bg-slate-900 text-slate-300 flex flex-col z-10 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-extrabold text-base text-white">DeeDevIoT Admin</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {menuItems.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase px-2">
                    {group.group}
                  </div>
                  {group.items.map((item, iIdx) => {
                    const Icon = item.icon;
                    const active = isActive(item.href, item.exact);
                    return (
                      <Link
                        key={iIdx}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          active
                            ? 'bg-[#E11D48] text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
              >
                ดูหน้าเว็บจริง ↗
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full text-center py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoggingOut ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
