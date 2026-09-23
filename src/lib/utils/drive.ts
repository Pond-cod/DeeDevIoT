/**
 * Unified Google Drive utility for DeeDevIoT
 * Single Source of Truth for extracting IDs and generating preview/direct links.
 */

const DRIVE_REGEX = /(?:\/d\/|id=|\/open\?id=)([a-zA-Z0-9_-]{20,})/;

/**
 * Extracts the file ID from a Google Drive URL or returns the string if already an ID.
 */
export function extractDriveId(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const cleanStr = url.trim().replace(/\s+/g, '');
  const match = cleanStr.match(DRIVE_REGEX);
  if (match && match[1]) {
    return match[1];
  }
  // If string itself looks like a raw Google Drive ID (alphanumeric, dashes, underscores, length >= 25)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(cleanStr) && !cleanStr.includes('http')) {
    return cleanStr;
  }
  return null;
}

/**
 * Generates a thumbnail URL for Google Drive (supports both Drive ID and full URL).
 */
export function getDriveThumbnailUrl(input: string | undefined | null, size: number = 1000): string {
  if (!input) return '';
  const id = extractDriveId(input) || input.trim();
  if (id && !id.includes('http')) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
  }
  return input;
}

/**
 * Generates an embedded iframe/preview URL for Google Drive.
 */
export function getDriveIframeUrl(input: string | undefined | null): string {
  if (!input) return '';
  const id = extractDriveId(input);
  if (id) {
    return `https://drive.google.com/file/d/${id}/preview`;
  }
  return input;
}

/**
 * Generates a direct download/view URL for Google Drive.
 */
export function getDriveDirectUrl(input: string | undefined | null): string {
  if (!input) return '';
  const id = extractDriveId(input);
  if (id) {
    return `https://drive.google.com/uc?export=download&id=${id}`;
  }
  return input;
}

/**
 * Converts comma-separated or single Drive URLs to high-speed lh3 direct image links.
 * Preserves non-Drive URLs (Facebook CDN, external images) untouched.
 * Avoids redundant double transformations.
 */
export function convertToDirectLink(driveUrls: string | undefined | null): string {
  if (!driveUrls || typeof driveUrls !== 'string') return driveUrls || '';

  // Separate multiple comma-separated URLs
  const urlList = driveUrls.split(',').map((u) => u.trim()).filter(Boolean);

  const converted = urlList.map((url) => {
    // If already in lh3 format, preserve it to avoid double-processing (BUG-11)
    if (url.includes('lh3.googleusercontent.com/d/')) {
      return url;
    }

    // Only transform Google Drive / Google Docs links
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      const id = extractDriveId(url);
      if (id) {
        return `https://lh3.googleusercontent.com/d/${id}=w1000`;
      }
    }

    // External direct image URLs (Facebook, Cloudinary, AWS S3, etc.) are kept 100% as-is
    return url;
  });

  return converted.join(',');
}
