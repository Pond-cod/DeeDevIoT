"use client";

import React, { useEffect } from 'react';
import { X, ExternalLink, FileText, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { ProjectItem } from '../../types/portfolio';
import ImageWithFallback from '../common/ImageWithFallback';
import { MessengerIcon } from '../common/Icons';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  messengerUrl?: string;
}

export default function ProjectModal({
  project,
  onClose,
  messengerUrl = 'https://m.me/DeeDevIOT'
}: ProjectModalProps) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  if (!project) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border-2 border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200 p-5 sm:p-7 relative space-y-5"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors z-20 cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Cover Image */}
        {project.imageUrl && (
          <div className="relative h-48 sm:h-64 -mx-5 sm:-mx-7 -mt-5 sm:-mt-7 mb-4 overflow-hidden rounded-t-2xl bg-slate-100 border-b border-slate-200">
            <ImageWithFallback
              src={project.imageUrl}
              alt={project.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-slate-300 text-xs font-mono text-slate-800 font-bold shadow-xs">
              {project.category}
            </div>
          </div>
        )}

        {/* Title & Category Header */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">
              {project.sourceType === 'service' ? 'Service Solution' : 'Delivered Portfolio'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {project.name}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
            {project.description}
          </p>
        </div>

        {/* Video Embeds if available */}
        {project.videoUrls && project.videoUrls.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>วิดีโอสาธิตระบบ (Live Video Demo)</span>
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {project.videoUrls.map((vUrl, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-200 shadow-xs">
                  <iframe
                    src={vUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={`Video Demo ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies Pills */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            เทคโนโลยีและสถาปัตยกรรม (Tech Stack)
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Architecture details */}
        {project.architectureDetails && project.architectureDetails.length > 0 && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/90 space-y-2">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#E11D48]" />
              <span>คุณสมบัติทางวิศวกรรม (Engineering Specifications)</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {project.architectureDetails.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:opacity-95 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink size={15} />
              <span>เปิดดูระบบจริง (Live Demo)</span>
            </a>
          )}

          {project.manualUrl && (
            <a
              href={project.manualUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <FileText size={15} />
              <span>เปิดคู่มือการใช้งาน (Manual)</span>
            </a>
          )}

          <a
            href={messengerUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 min-w-[160px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0084FF] to-[#00C6FF] hover:opacity-95 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <MessengerIcon className="w-4 h-4 fill-white" />
            <span>ทักแชทปรึกษาระบบนี้</span>
          </a>
        </div>
      </div>
    </div>
  );
}
