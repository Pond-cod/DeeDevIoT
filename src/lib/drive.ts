export function getDriveThumbnailUrl(url: string | undefined): string {
  if (!url) return '';
  const driveRegex = /(?:\/d\/|id=)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }
  return url;
}
