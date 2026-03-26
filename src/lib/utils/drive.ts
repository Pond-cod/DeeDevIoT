export function convertToDirectLink(driveUrls: string): string {
  if (!driveUrls) return driveUrls;
  
  // ลบการเว้นวรรคและขึ้นบรรทัดใหม่ทั้งหมด เผื่อ User ก๊อปปี้ลิงก์แล้วข้อความขาดตอน
  const cleanStr = driveUrls.replace(/\s+/g, '');
  
  // ค้นหา ID จาก Google Drive (ความยาวประมาณ 25-35 ตัวอักษร)
  const regex = /(?:\/d\/|id=|\/open\?id=)([a-zA-Z0-9_-]{20,})/g;
  const matches = [...cleanStr.matchAll(regex)];
  
  if (matches.length > 0) {
    // นำ ID ทั้งหมดที่เจอมาแปลงเป็น Direct Link ที่รองรับ CORB/ORB
    return matches.map(m => `https://lh3.googleusercontent.com/d/${m[1]}=w1000`).join(',');
  }

  // หากไม่มี ID ปรากฏ ส่งสตริงเดิมกลับไป
  return driveUrls;
}
