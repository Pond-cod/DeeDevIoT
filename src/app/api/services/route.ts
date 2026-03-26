import { NextResponse } from 'next/server';
import { getSheetValues, appendSheetValues, updateSheetRow, deleteSheetRow } from '../../../lib/google';

// กำหนด Interface โครงสร้างของข้อมูล Service
export interface ServiceData {
  id: string;
  title: string;
  description: string;
  title_th?: string;
  description_th?: string;
  icon: string;
  imageUrl: string;   // comma-separated image URLs (col E)
  demoUrl?: string;   // reference URL (col F)
  videoUrls?: string; // comma-separated video URLs (col I)
}

export async function GET() {
  try {
    // ดึงข้อมูลจากแท็บ 'Services' ช่วงเซลล์ 'A2:I'
    const range = 'Services!A2:I';
    const rows = await getSheetValues(range);

    // จัดระเบียบข้อมูล (Map) ให้ตรงกับ Interface ที่กำหนดไว้
    const services: ServiceData[] = rows.map((row) => {
      let imageUrlsStr = row[4] || '';
      let videoUrlsStr = row[8] || '';
      
      // Transform Google Drive links for multiple images
      const imageUrl = imageUrlsStr.split(',').map(url => {
        let cleanUrl = url.trim();
        if (cleanUrl.includes('drive.google.com')) {
          const regex = /(?:\/d\/|id=|\/open\?id=)([a-zA-Z0-9_-]{20,})/;
          const match = cleanUrl.match(regex);
          if (match && match[1]) {
            return `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
          }
        }
        return cleanUrl;
      }).filter(u => u).join(',');

      // Transform Google Drive video links to Preview/Embed links
      const videoUrls = videoUrlsStr.split(',').map(url => {
        let cleanUrl = url.trim();
        if (cleanUrl.includes('drive.google.com')) {
          const regex = /(?:\/d\/|id=|\/open\?id=)([a-zA-Z0-9_-]{20,})/;
          const match = cleanUrl.match(regex);
          if (match && match[1]) {
            return `https://drive.google.com/file/d/${match[1]}/preview`;
          }
        }
        return cleanUrl;
      }).filter(u => u).join(',');

      return {
        id: row[0] || '',
        title: row[1] || '',
        description: row[2] || '',
        icon: row[3] || '',
        imageUrl: imageUrl,
        demoUrl: row[5] || '',
        title_th: row[6] || '',
        description_th: row[7] || '',
        videoUrls: videoUrls,
      };
    });

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error: any) {
    console.error('Error in /api/services GET:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch services from Google Sheets',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// ปิดแคชสำหรับ API เพื่อให้ดึงข้อมูลล่าสุดเสมอ (ป้องกันตารางไม่อัปเดต)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    // รับข้อมูล JSON จาก Body ของ Request
    const body = await request.json();
    const { id, title, description, icon, imageUrl, demoUrl, videoUrls, isEdit } = body;

    // ตรวจสอบว่ามีข้อมูลอย่างน้อย title และ description ก่อนบันทึก
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // แปลง Object เป็น Array แถวเดียว ให้ตรงกับลำดับคอลัมน์ [id, title, description, icon, imageUrl, demoUrl, title_th, description_th, videoUrls] 
    // หากค่าไหนไม่มีให้เป็น string ว่าง ""
    const rowData = [
      id || Date.now().toString(),
      title || "",
      description || "",
      icon || "",
      imageUrl || "",
      demoUrl || "",
      body.title_th || "",
      body.description_th || "",
      videoUrls || ""
    ];

    if (isEdit) {
      if (!id) {
        return NextResponse.json(
          { success: false, error: 'ID is required to update service' },
          { status: 400 }
        );
      }
      const result = await updateSheetRow(id, rowData);
      return NextResponse.json({
        success: true,
        message: 'Service updated successfully in Google Sheets',
        data: result,
      });
    } else {
      // แปลงเป็น Array 2 มิติ (มี 1 แถว)
      const newRow = [rowData];

      // กำหนด Range เป็นทั้งตาราง เพี่อให้ Google Sheets หาบรรทัดว่างต่อท้ายให้อัตโนมัติ
      const range = 'Services!A:I';
      const result = await appendSheetValues(range, newRow);

      return NextResponse.json({
        success: true,
        message: 'Service added successfully to Google Sheets',
        data: result,
      });
    }
  } catch (error: any) {
    console.error('Error in /api/services POST:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to append service to Google Sheets',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required to delete service' },
        { status: 400 }
      );
    }

    await deleteSheetRow('Services', id);

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully from Google Sheets',
    });
  } catch (error: any) {
    console.error('Error in /api/services DELETE:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete service',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
