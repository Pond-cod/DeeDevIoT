export function getDriveThumbnailUrl(url: string | undefined): string {
  if (!url) return '';
  const cleanStr = url.replace(/\s+/g, '');
  const driveRegex = /(?:\/d\/|id=|\/open\?id=)([a-zA-Z0-9_-]{20,})/;
  const match = cleanStr.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }
  return url;
}
