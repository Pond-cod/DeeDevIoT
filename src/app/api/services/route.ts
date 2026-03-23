import { NextResponse } from 'next/server';
import { getSheetValues, appendSheetValues, updateSheetRow } from '../../../lib/google';

// กำหนด Interface โครงสร้างของข้อมูล Service
export interface ServiceData {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  demoUrl?: string; // เพิ่มฟิลด์ใหม่
}

export async function GET() {
  try {
    // ดึงข้อมูลจากแท็บ 'Services' ช่วงเซลล์ 'A2:F'
    const range = 'Services!A2:F';
    const rows = await getSheetValues(range);

    // จัดระเบียบข้อมูล (Map) ให้ตรงกับ Interface ที่กำหนดไว้
    const services: ServiceData[] = rows.map((row) => {
      return {
        id: row[0] || '',
        title: row[1] || '',
        description: row[2] || '',
        icon: row[3] || '',
        imageUrl: row[4] || '',
        demoUrl: row[5] || '',
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
    const { id, title, description, icon, imageUrl, demoUrl, isEdit } = body;

    // ตรวจสอบว่ามีข้อมูลอย่างน้อย title และ description ก่อนบันทึก
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // แปลง Object เป็น Array แถวเดียว ให้ตรงกับลำดับคอลัมน์ [id, title, description, icon, imageUrl, demoUrl] 
    // หากค่าไหนไม่มีให้เป็น string ว่าง ""
    const rowData = [
      id || Date.now().toString(),
      title || "",
      description || "",
      icon || "",
      imageUrl || "",
      demoUrl || ""
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
      const range = 'Services!A:F';
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
