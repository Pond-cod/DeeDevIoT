"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Star, ArrowUp, ArrowDown, Edit3, ExternalLink, 
  RefreshCw, Search, CheckCircle2, AlertCircle, Layers, Server, 
  Link as LinkIcon, Eye
} from 'lucide-react';
import { ProjectItem } from '../../../types/portfolio';
import ImageWithFallback from '../../../components/common/ImageWithFallback';

interface OrderInputBoxProps {
  item: ProjectItem;
  currentIndex: number;
  onSave: (item: ProjectItem, newOrder: number) => void;
  disabled?: boolean;
}

function OrderInputBox({ item, currentIndex, onSave, disabled }: OrderInputBoxProps) {
  const currentOrder = item.sortOrder !== undefined && item.sortOrder !== null ? item.sortOrder : (currentIndex + 1);
  const [val, setVal] = useState<string>(String(currentOrder));

  useEffect(() => {
    setVal(String(currentOrder));
  }, [currentOrder]);

  const handleCommit = () => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0 && num !== currentOrder) {
      onSave(item, num);
    } else {
      setVal(String(currentOrder));
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-slate-400 font-mono">ลำดับ:</span>
      <input
        type="number"
        min={1}
        disabled={disabled}
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.currentTarget.blur();
          }
        }}
        onBlur={handleCommit}
        className="w-16 px-2 py-1 rounded-lg bg-slate-50 border-2 border-slate-200 text-xs font-mono font-black text-center outline-none focus:border-amber-500 focus:bg-white transition-all disabled:opacity-50"
        title="พิมพ์ตัวเลขเพื่อกำหนดลำดับ (กด Enter หรือคลิกออกเพื่อย้ายลำดับทันที)"
      />
    </div>
  );
}

export default function AdminWorksPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'featured' | 'portfolio' | 'service'>('all');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info' | null; message: string }>({ type: null, message: '' });

  // Fetch both Services and Integrations
  const fetchAllWorks = async () => {
    setIsLoading(true);
    try {
      const [svcRes, intRes] = await Promise.all([
        fetch('/api/services', { cache: 'no-store' }),
        fetch('/api/integrations', { cache: 'no-store' })
      ]);

      const [svcJson, intJson] = await Promise.all([
        svcRes.json().catch(() => ({ success: false, data: [] })),
        intRes.json().catch(() => ({ success: false, data: [] }))
      ]);

      const services = svcJson.success && Array.isArray(svcJson.data) ? svcJson.data : [];
      const integrations = intJson.success && Array.isArray(intJson.data) ? intJson.data : [];

      const rawItems: ProjectItem[] = [
        ...integrations.map((item: any, idx: number) => ({
          id: item.id || `portfolio-${idx}`,
          name: item.title_th || item.title || 'โปรเจกต์ระบบ',
          category: item.tag || 'Portfolio',
          categoryKey: (item.tag || 'portfolio').trim().toLowerCase(),
          description: item.description_th || item.description || '',
          technologies: item.tag ? [item.tag, 'Integration'] : ['Full-Stack Solution'],
          imageUrl: item.imageUrl || '',
          demoUrl: item.referenceUrl || undefined,
          manualUrl: item.manualUrl || undefined,
          architectureDetails: [],
          sourceType: 'portfolio' as const,
          isFeatured: !!item.isFeatured,
          sortOrder: item.sortOrder
        })),
        ...services.map((cmsItem: any, idx: number) => ({
          id: cmsItem.id || `service-${idx}`,
          name: cmsItem.title_th || cmsItem.title || 'บริการโซลูชัน',
          category: cmsItem.icon || 'Service Solution',
          categoryKey: (cmsItem.icon || 'service').trim().toLowerCase(),
          description: cmsItem.description_th || cmsItem.description || '',
          technologies: ['Custom Solution', 'Production Architecture'],
          imageUrl: cmsItem.imageUrl || '',
          demoUrl: cmsItem.demoUrl || undefined,
          manualUrl: cmsItem.manualUrl || undefined,
          architectureDetails: [],
          sourceType: 'service' as const,
          isFeatured: !!cmsItem.isFeatured,
          sortOrder: cmsItem.sortOrder
        }))
      ];

      // Sort: 1. Featured first -> 2. sortOrder (ascending: 1, 2, 3...) -> 3. original order
      const sorted = [...rawItems].sort((a, b) => {
        const aFeat = a.isFeatured ? 1 : 0;
        const bFeat = b.isFeatured ? 1 : 0;
        if (aFeat !== bFeat) return bFeat - aFeat;
        const aOrder = a.sortOrder !== undefined ? a.sortOrder : 9999;
        const bOrder = b.sortOrder !== undefined ? b.sortOrder : 9999;
        return aOrder - bOrder;
      });

      setProjects(sorted);
    } catch {
      setStatus({ type: 'error', message: 'ไม่สามารถโหลดข้อมูลผลงานได้' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWorks();
  }, []);

  // Quick Toggle Star
  const handleToggleStar = async (item: ProjectItem) => {
    const nextFeatured = !item.isFeatured;
    const endpoint = item.sourceType === 'service' ? '/api/services' : '/api/integrations';

    // Optimistic update
    setProjects(prev => {
      const updated = prev.map(p => p.id === item.id ? { ...p, isFeatured: nextFeatured } : p);
      return updated.sort((a, b) => {
        const aFeat = a.isFeatured ? 1 : 0;
        const bFeat = b.isFeatured ? 1 : 0;
        if (aFeat !== bFeat) return bFeat - aFeat;
        const aOrder = a.sortOrder !== undefined ? a.sortOrder : 9999;
        const bOrder = b.sortOrder !== undefined ? b.sortOrder : 9999;
        return aOrder - bOrder;
      });
    });

    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isFeatured: nextFeatured })
      });
      const json = await res.json();
      if (json.success) {
        setStatus({
          type: 'success',
          message: nextFeatured ? `ติดดาว "${item.name}" เป็นผลงานเด่นแล้ว ⭐` : `ยกเลิกการติดดาว "${item.name}" แล้ว`
        });
      } else {
        setStatus({ type: 'error', message: json.error || 'ไม่สามารถอัปเดตได้' });
        fetchAllWorks();
      }
    } catch {
      setStatus({ type: 'error', message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
      fetchAllWorks();
    }
  };

  // Change order & cleanly shift items in array
  const handleUpdateOrder = async (item: ProjectItem, targetPosition: number) => {
    if (targetPosition < 1) targetPosition = 1;
    if (targetPosition > projects.length) targetPosition = projects.length;

    const fromIndex = projects.findIndex(p => p.id === item.id);
    if (fromIndex === -1) return;
    const toIndex = targetPosition - 1;

    // Reorder the list by moving the item
    const reordered = [...projects];
    const [movedItem] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedItem);

    // Re-assign distinct sequential 1-based sort orders: 1, 2, 3, 4, ...
    const updatedProjects = reordered.map((p, idx) => ({
      ...p,
      sortOrder: idx + 1
    }));

    setProjects(updatedProjects);
    setIsSaving(true);
    setStatus({
      type: 'info',
      message: `กำลังบันทึกลำดับใหม่ของ "${item.name}" ไปที่ลำดับ #${targetPosition}...`
    });

    try {
      // Find all items whose sortOrder changed and save them to backend
      const changedItems = updatedProjects.filter(p => {
        const orig = projects.find(o => o.id === p.id);
        return !orig || orig.sortOrder !== p.sortOrder;
      });

      await Promise.all(
        changedItems.map(p =>
          fetch(p.sourceType === 'service' ? '/api/services' : '/api/integrations', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: p.id, sortOrder: p.sortOrder })
          })
        )
      );

      setStatus({
        type: 'success',
        message: `จัดลำดับ "${item.name}" ไปที่ลำดับ #${targetPosition} เรียบร้อยแล้ว`
      });
    } catch {
      setStatus({ type: 'error', message: 'เกิดข้อผิดพลาดในการบันทึกลำดับ' });
      fetchAllWorks();
    } finally {
      setIsSaving(false);
    }
  };

  // Move up or down in current list
  const handleMove = async (item: ProjectItem, direction: 'up' | 'down') => {
    const fromIndex = projects.findIndex(p => p.id === item.id);
    if (fromIndex === -1) return;
    const targetRank = direction === 'up' ? fromIndex : fromIndex + 2;
    if (targetRank < 1 || targetRank > projects.length) return;
    await handleUpdateOrder(item, targetRank);
  };

  // Re-index all works 1, 2, 3... to eliminate duplicates
  const handleAutoReindexAll = async () => {
    if (projects.length === 0) return;
    setIsSaving(true);
    setStatus({ type: 'info', message: 'กำลังจัดระเบียบลำดับ 1, 2, 3... ให้ทุกรายการในระบบ...' });

    const reindexed = projects.map((p, idx) => ({
      ...p,
      sortOrder: idx + 1
    }));
    setProjects(reindexed);

    try {
      await Promise.all(
        reindexed.map(p =>
          fetch(p.sourceType === 'service' ? '/api/services' : '/api/integrations', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: p.id, sortOrder: p.sortOrder })
          })
        )
      );
      setStatus({ type: 'success', message: 'จัดระเบียบลำดับ 1, 2, 3... ต่อเนื่องให้ครบทุกผลงานเรียบร้อยแล้ว' });
    } catch {
      setStatus({ type: 'error', message: 'เกิดข้อผิดพลาดในการบันทึกลำดับ กรุณาลองใหม่อีกครั้ง' });
      fetchAllWorks();
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = projects.filter(p => {
    const matchSearch = !searchQuery.trim() || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType = filterType === 'all' ||
      (filterType === 'featured' && p.isFeatured) ||
      (filterType === 'portfolio' && p.sourceType === 'portfolio') ||
      (filterType === 'service' && p.sourceType === 'service');

    return matchSearch && matchType;
  });

  const featuredCount = projects.filter(p => p.isFeatured).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 sm:p-7 text-white border-2 border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
            <Sparkles size={14} className="text-amber-400 animate-pulse" />
            <span>PORTFOLIO &amp; SHOWCASE MANAGER</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            จัดการและเรียงลำดับผลงานหน้าแรก (Works Manager)
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            ติดดาวผลงานเด่น ⭐ และจัดลำดับการแสดงผลงาน 1, 2, 3... ของเซกชัน <strong>&quot;ผลงานและโปรเจกต์จริง&quot;</strong> บนหน้าแรก DeeDevIoT
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleAutoReindexAll}
            disabled={isLoading || isSaving || projects.length === 0}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            title="จัดเรียงลำดับ 1, 2, 3... ต่อเนื่องให้ทุกรายการและบันทึก"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span className="hidden sm:inline">จัดระเบียบลำดับ 1..N อัตโนมัติ</span>
          </button>
          <button
            onClick={fetchAllWorks}
            disabled={isLoading || isSaving}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>รีเฟรช</span>
          </button>
          <a
            href="/#works"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#EA580C] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <span>ดูหน้าเว็บจริง</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Status Alert */}
      {status.type && (
        <div
          className={`p-3.5 rounded-xl flex items-center justify-between text-xs font-bold ${
            status.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-300'
              : status.type === 'info'
                ? 'bg-sky-50 text-sky-900 border-2 border-sky-300 animate-pulse'
                : 'bg-rose-50 text-rose-900 border-2 border-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {status.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : status.type === 'info' ? (
              <RefreshCw size={16} className="text-sky-600 animate-spin shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
          <button onClick={() => setStatus({ type: null, message: '' })} className="hover:opacity-75 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border-2 border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ทั้งหมด ({projects.length})
            </button>
            <button
              onClick={() => setFilterType('featured')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === 'featured'
                  ? 'bg-gradient-to-r from-amber-500 to-[#E11D48] text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Star size={13} className="fill-amber-400" />
              <span>⭐ ติดดาวผลงานเด่น ({featuredCount})</span>
            </button>
            <button
              onClick={() => setFilterType('service')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterType === 'service'
                  ? 'bg-[#E11D48] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Server size={12} />
              <span>บริการ (Services)</span>
            </button>
            <button
              onClick={() => setFilterType('portfolio')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterType === 'portfolio'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <LinkIcon size={12} />
              <span>เทคโนโลยี (Integrations)</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อผลงาน, ID, หมวดหมู่..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 outline-none focus:border-[#E11D48]"
            />
          </div>
        </div>
      </div>

      {/* Projects Ordered List */}
      {isLoading ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-slate-200">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#E11D48]" />
          <p className="mt-2 text-xs text-slate-500 font-mono">กำลังโหลดข้อมูลผลงานทั้งหมด...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-slate-200 p-8 space-y-2">
          <Layers size={32} className="text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">ไม่พบรายการผลงาน</h3>
          <p className="text-xs text-slate-400">ลองเปลี่ยนเงื่อนไขการค้นหาหรือเพิ่มข้อมูลบริการใหม่</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, index) => {
            const firstImg = item.imageUrl ? item.imageUrl.split(',')[0].trim() : '';
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border-2 transition-all p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  item.isFeatured
                    ? 'border-amber-400 ring-2 ring-amber-300/30 shadow-amber-500/5'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Left: Reorder Controls + Cover Image */}
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  
                  {/* Reorder Up / Down Buttons */}
                  <div className="flex sm:flex-col items-center gap-1 shrink-0 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      disabled={index === 0 || isSaving}
                      onClick={() => handleMove(item, 'up')}
                      className="p-1 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      title="เลื่อนขึ้นด้านบน"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <span className="text-[11px] font-mono font-black text-slate-800 px-1">
                      #{item.sortOrder !== undefined && item.sortOrder !== null ? item.sortOrder : (index + 1)}
                    </span>
                    <button
                      type="button"
                      disabled={index === filtered.length - 1 || isSaving}
                      onClick={() => handleMove(item, 'down')}
                      className="p-1 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      title="เลื่อนลงด้านล่าง"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden relative">
                    <ImageWithFallback
                      src={firstImg}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.isFeatured && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-black shadow-xs">
                        ⭐ เด่น
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        item.sourceType === 'service'
                          ? 'bg-rose-50 text-[#E11D48] border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">ID: {item.id}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ({item.sourceType === 'service' ? 'บริการ Services' : 'เทคโนโลยี Integrations'})
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-950 truncate flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.isFeatured && <span className="text-amber-500 text-xs">⭐</span>}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                      {item.description || 'ไม่มีคำอธิบาย'}
                    </p>
                  </div>
                </div>

                {/* Right: Star Button + Order Input + Edit Link */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  
                  {/* Star Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleStar(item)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      item.isFeatured
                        ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-2xs hover:bg-amber-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-amber-600 hover:border-amber-300'
                    }`}
                    title={item.isFeatured ? 'คลิกเพื่อปลดดาว' : 'คลิกเพื่อติดดาวผลงานเด่น'}
                  >
                    <Star size={14} className={item.isFeatured ? 'fill-amber-500 text-amber-500' : ''} />
                    <span>{item.isFeatured ? '⭐ ผลงานเด่น' : 'ติดดาว'}</span>
                  </button>

                  {/* Manual Order Input with Controlled Enter & Shift Save */}
                  <OrderInputBox
                    item={item}
                    currentIndex={index}
                    onSave={handleUpdateOrder}
                    disabled={isSaving}
                  />

                  {/* Direct Link to Edit in Manager */}
                  <Link
                    href={item.sourceType === 'service' ? '/admin/services' : '/admin/integrations'}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title={`ไปที่หน้าจัดการ ${item.sourceType === 'service' ? 'บริการ' : 'เทคโนโลยี'}`}
                  >
                    <Edit3 size={15} />
                  </Link>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Helper Note */}
      <div className="bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
        <Sparkles size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <span className="font-extrabold block">เคล็ดลับการจัดลำดับและการติดดาว:</span>
          <p>
            1. <strong>ผลงานที่ติดดาว ⭐</strong> จะถูกจัดให้อยู่กลุ่มแรกสุดเสมอ และมีการ์ดไฮไลต์เรืองแสงในหน้าแรก พร้อมปุ่มแท็บฟิลเตอร์ <code>⭐ ผลงานเด่น</code>
          </p>
          <p>
            2. สามารถกดปุ่ม <strong>▲ เลื่อนขึ้น / ▼ เลื่อนลง</strong> เพื่อสลับตำแหน่ง หรือพิมพ์ตัวเลขลำดับในช่องแล้วคลิกออก เพื่อจัดเรียงตามที่ต้องการได้ทันที
          </p>
        </div>
      </div>

    </div>
  );
}
