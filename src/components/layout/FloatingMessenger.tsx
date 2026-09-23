"use client";

import React, { useState } from 'react';
import { MessengerIcon } from '../common/Icons';

interface FloatingMessengerProps {
  messengerUrl?: string;
}

export default function FloatingMessenger({
  messengerUrl = 'https://m.me/DeeDevIOT'
}: FloatingMessengerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip on hover */}
      {isHovered && (
        <div className="hidden sm:block bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-slate-700 animate-in fade-in slide-in-from-right-2 duration-150 whitespace-nowrap">
          <span>ทักแชท Inbox ปรึกษาเรา (DeeDevIOT)</span>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={messengerUrl}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-[#0084FF] via-[#00A3FF] to-[#00C6FF] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white/80 cursor-pointer"
        aria-label="Contact via Facebook Messenger"
      >
        {/* Soft breathing pulse effect */}
        <span className="absolute -inset-1 rounded-full bg-sky-400 opacity-30 group-hover:opacity-60 blur-xs animate-ping pointer-events-none" />

        {/* Icon */}
        <MessengerIcon className="w-7 h-7 fill-white relative z-10 transition-transform group-hover:scale-105" />

        {/* Online Status Dot */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full z-20 shadow-xs" />
      </a>
    </div>
  );
}
