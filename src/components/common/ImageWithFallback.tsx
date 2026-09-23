"use client";

import React, { useState, useEffect } from 'react';
import { extractDriveId, getDriveThumbnailUrl, convertToDirectLink } from '../../lib/utils/drive';
import { ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackIcon?: React.ReactNode;
}

export default function ImageWithFallback({
  src = '',
  alt = 'image',
  className = '',
  fallbackIcon,
  ...props
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [hasTriedFallback, setHasTriedFallback] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      setCurrentSrc('');
      setHasError(true);
      return;
    }
    const direct = convertToDirectLink(src);
    setCurrentSrc(direct);
    setHasTriedFallback(false);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    const driveId = extractDriveId(currentSrc) || extractDriveId(src);
    if (driveId && !hasTriedFallback) {
      setHasTriedFallback(true);
      setCurrentSrc(getDriveThumbnailUrl(driveId));
    } else {
      setHasError(true);
    }
  };

  if (!src || hasError) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}>
        {fallbackIcon || <ImageIcon size={24} className="opacity-60" />}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={handleError}
      {...props}
    />
  );
}
