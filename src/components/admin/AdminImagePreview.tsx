"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { extractDriveId, getDriveThumbnailUrl, convertToDirectLink } from '../../lib/utils/drive';

export default function AdminImagePreview({ url }: { url: string }) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [triedFallback, setTriedFallback] = useState(false);

  const cleanUrl = url?.trim() || '';
  const driveId = extractDriveId(cleanUrl);
  const isDrive = Boolean(cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com') || driveId);
  const isTruncated = Boolean(driveId && driveId.length < 33);

  useEffect(() => {
    if (!cleanUrl) {
      setImgSrc('');
      setStatus('loading');
      setTriedFallback(false);
      return;
    }
    setImgSrc(convertToDirectLink(cleanUrl));
    setStatus('loading');
    setTriedFallback(false);
  }, [cleanUrl]);

  if (!cleanUrl) return null;

  const handleError = () => {
    if (driveId && !triedFallback) {
      setTriedFallback(true);
      setImgSrc(getDriveThumbnailUrl(driveId));
    } else {
      setStatus('error');
    }
  };

  return (
    <div className={`mt-2 p-2.5 rounded-xl border-2 transition-all ${
      status === 'error' || isTruncated
        ? 'bg-rose-50 border-rose-200' 
        : status === 'success' 
          ? 'bg-emerald-50/60 border-emerald-200' 
          : 'bg-slate-100 border-slate-200'
    }`}>
      <div className="flex items-start gap-3">
        {/* Preview image */}
        <div className="relative w-12 h-12 rounded-lg bg-white border-2 border-slate-300 shrink-0 overflow-hidden shadow-2xs flex items-center justify-center">
          {status !== 'error' && (
            <img 
              src={imgSrc} 
              alt="preview" 
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-opacity duration-200 ${status === 'loading' ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setStatus('success')}
              onError={handleError} 
            />
          )}
          {status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          )}
          {status === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center bg-rose-100 text-rose-500">
              <AlertCircle size={20} />
            </div>
          )}
        </div>

        {/* Text & Guidance */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold truncate flex items-center gap-1.5">
              {status === 'success' && <span className="text-emerald-800">✓ ตัวอย่างรูปภาพ (Direct Preview พร้อมใช้งาน)</span>}
              {status === 'loading' && <span className="text-slate-600">กำลังตรวจสอบและโหลดตัวอย่างรูป...</span>}
              {status === 'error' && <span className="text-rose-700">⚠️ โหลดตัวอย่างรูปภาพไม่สำเร็จ</span>}
            </span>
            {status === 'success' && (
              <a 
                href={imgSrc} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] text-sky-600 hover:text-sky-800 font-bold flex items-center gap-0.5 shrink-0"
              >
                ดูรูปเต็ม <ArrowUpRight size={11} />
              </a>
            )}
          </div>

          {isTruncated && (
            <div className="text-[10px] text-amber-900 font-semibold bg-amber-100/90 px-2 py-1 rounded border border-amber-300 leading-snug">
              ⚠️ รหัสไฟล์สั้นกว่าปกติ (มี {driveId?.length}/33 ตัวอักษร) ลิงก์อาจคัดลอกมาไม่ครบ ขาดตัวอักษรท้าย
            </div>
          )}

          {status === 'error' && !isTruncated && (
            <div className="text-[10px] text-rose-800 space-y-0.5 leading-snug">
              <p className="font-semibold">สาเหตุที่รูปไม่ขึ้น:</p>
              <ul className="list-disc list-inside space-y-0.5 text-rose-700">
                {isDrive ? (
                  <>
                    <li>สิทธิ์ Google Drive ยังเป็น &quot;จำกัด&quot; (กรุณาตั้งค่าแชร์เป็น <b>&quot;ทุกคนที่มีลิงก์มีสิทธิ์ดู&quot;</b>)</li>
                    <li>หรือรหัสไฟล์ในลิงก์ไม่ถูกต้อง</li>
                  </>
                ) : (
                  <>
                    <li>ลิงก์รูปภาพไม่ถูกต้อง หรือไม่สามารถเข้าถึงได้</li>
                    <li>หากใช้ Facebook ให้คลิกขวาที่ภาพ &gt; เลือก <b>&quot;คัดลอกที่อยู่รูปภาพ&quot;</b> (Copy image address)</li>
                  </>
                )}
              </ul>
            </div>
          )}

          {status === 'success' && (
            <span className="text-[10px] text-emerald-700 block font-medium">
              รองรับทั้ง Google Drive และ Facebook CDN แสดงผลสมบูรณ์
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
