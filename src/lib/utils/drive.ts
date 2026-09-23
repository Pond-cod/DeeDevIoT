export function convertToDirectLink(driveUrls: string): string {
  if (!driveUrls) return driveUrls;

  // แยก URL กรณีมีหลายรูปรวมกันคั่นด้วย comma
  const urlList = driveUrls.split(',').map(u => u.trim()).filter(Boolean);

  const converted = urlList.map(url => {
    // ตรวจสอบเฉพาะ Google Drive / Google Docs เท่านั้น ป้องกันไม่ให้ไปแปลง URL ของ Facebook หรือที่อื่น
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      const regex = /(?:\/d\/|id=|\/open\?id=)([a-zA-Z0-9_-]{20,})/;
      const match = url.match(regex);
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
      }
    }

    // สำหรับ Facebook CDN (เช่น scontent...fbcdn.net) หรือ Direct image URL อื่นๆ ให้คง URL เดิมไว้ 100%
    return url;
  });

  return converted.join(',');
}
