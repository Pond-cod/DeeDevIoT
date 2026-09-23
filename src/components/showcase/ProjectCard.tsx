"use client";

import React from 'react';
import { ExternalLink, FileText, ArrowRight, Layers } from 'lucide-react';
import { ProjectItem } from '../../types/portfolio';
import ImageWithFallback from '../common/ImageWithFallback';

interface ProjectCardProps {
  project: ProjectItem;
  onSelect: (project: ProjectItem) => void;
}

export default function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <div
      onClick={() => onSelect(project)}
      className="bg-white/95 backdrop-blur-xs border-2 border-slate-200/90 hover:border-[#E11D48] transition-all rounded-2xl flex flex-col justify-between overflow-hidden group shadow-xs hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
    >
      {/* Cover Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
        <ImageWithFallback
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          loading="lazy"
          fallbackIcon={
            <div className="w-full h-full bg-gradient-to-br from-slate-50 via-rose-50/40 to-orange-50/40 flex items-center justify-center">
              <Layers size={36} className="text-slate-400 group-hover:text-[#E11D48] transition-colors" />
            </div>
          }
        />
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-slate-300 text-[10px] font-mono text-slate-900 font-bold shadow-2xs">
          {project.category}
        </div>
      </div>

      {/* Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
              Production Verified
            </span>
          </div>

          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#E11D48] transition-colors line-clamp-1">
            {project.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.technologies.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-bold text-[#E11D48] group-hover:translate-x-1 transition-transform flex items-center gap-1">
            ดูรายละเอียดสเปก <ArrowRight size={14} />
          </span>

          <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
                title="เปิด Live Demo"
              >
                <ExternalLink size={14} />
              </a>
            )}
            {project.manualUrl && (
              <a
                href={project.manualUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                title="คู่มือการใช้งาน (Manual)"
              >
                <FileText size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
