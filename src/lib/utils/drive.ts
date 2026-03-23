export function convertToDirectLink(driveUrls: string): string {
  if (!driveUrls) return driveUrls;
  
  // แยก URL ตามเครื่องหมายจุลภาคหรือขึ้นบรรทัดใหม่
  const urls = driveUrls.split(/[,\n]/).map(url => url.trim()).filter(Boolean);
  
  const converted = urls.map(url => {
    // แยก ID จากลิงก์ปกติ /d/ หรือจากลิงก์ที่บังเอิญเป็น id=... มาแล้ว
    const regex = /(?:\/d\/|id=)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
    
    // หากไม่ตรงเงื่อนไขเลยให้ส่ง URL เดิมกลับไป
    return url;
  });

  // นำ URL ที่ถูกแปลงแล้วมารวมกันคั่นด้วยบรรทัดใหม่
  return converted.join('\n');
}
