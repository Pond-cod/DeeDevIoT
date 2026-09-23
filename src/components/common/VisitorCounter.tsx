"use client";

import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

interface VisitorCounterProps {
  className?: string;
  compact?: boolean;
  showIcon?: boolean;
}

export default function VisitorCounter({
  className = '',
  compact = false,
  showIcon = true
}: VisitorCounterProps) {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function trackAndFetchVisitor() {
      try {
        // Check if visit was already tracked in this browser session
        const alreadyTracked = typeof window !== 'undefined' && sessionStorage.getItem('deedev_visited');
        const endpoint = alreadyTracked ? '/api/visitors' : '/api/visitors?hit=1';

        const res = await fetch(endpoint, {
          method: 'GET',
          cache: 'no-store'
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted && typeof data.count === 'number') {
            setCount(data.count);
            if (!alreadyTracked && typeof window !== 'undefined') {
              sessionStorage.setItem('deedev_visited', 'true');
            }
          }
        }
      } catch (err) {
        console.error('Failed to load visitor counter:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    trackAndFetchVisitor();

    return () => {
      isMounted = false;
    };
  }, []);

  const formattedCount = count !== null ? count.toLocaleString('th-TH') : '...';

  return (
    <div
      className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white/90 hover:bg-slate-50/95 backdrop-blur-xs shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all duration-200 text-xs font-mono select-none cursor-default ${className}`}
      title="ยอดคนเข้าชมเว็บไซต์ (Total Website Views)"
      aria-label={`ยอดคนเข้าชมเว็บ: ${count ?? 'กำลังโหลด'} คน`}
    >
      {/* Live pulse dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>

      {/* Eye icon */}
      {showIcon && (
        <Eye
          size={13}
          className="text-slate-500 group-hover:text-[#E11D48] transition-colors shrink-0"
        />
      )}

      {/* Counter number */}
      <span className="font-bold text-slate-900 tracking-tight">
        {isLoading ? (
          <span className="inline-block w-8 h-3.5 bg-slate-200 animate-pulse rounded" />
        ) : (
          formattedCount
        )}
      </span>

      {/* Label */}
      {!compact && (
        <span className="text-[11px] font-sans font-medium text-slate-500">
          เข้าชม
        </span>
      )}
    </div>
  );
}
