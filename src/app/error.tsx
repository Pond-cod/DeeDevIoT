'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to error reporting service
    console.error('Application Error Boundary caught error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center shadow-inner">
          <AlertTriangle size={32} />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            เกิดข้อผิดพลาดบางอย่าง
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            ระบบพบข้อขัดข้องชั่วคราวในการประมวลผล กรุณาลองใหม่อีกครั้ง หรือกลับสู่หน้าหลัก
          </p>
        </div>

        {/* Technical details (collapsed preview) */}
        {error.message && (
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3 text-left">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
              Error Details:
            </div>
            <p className="text-xs font-mono text-rose-300/90 break-words line-clamp-3">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <RefreshCw size={16} />
            <span>ลองใหม่อีกครั้ง</span>
          </button>

          <Link
            href="/"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs sm:text-sm border border-slate-700/60 transition-all flex items-center justify-center gap-2"
          >
            <Home size={16} />
            <span>หน้าหลัก</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
