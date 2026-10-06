import { NextResponse } from 'next/server';
import { getSheetValues, appendSheetValues, updateSheetRow, deleteSheetRow } from '../../../lib/google';
import { convertToDirectLink, getDriveIframeUrl } from '../../../lib/utils/drive';

// กำหนด Interface โครงสร้างของข้อมูล Service / Works
export interface ServiceData {
  id: string;
  title: string;
  description: string;
  title_th?: string;
  description_th?: string;
  icon: string;
  imageUrl: string;   // ลิงก์ภาพปก (col E)
  demoUrl?: string;   // ลิงก์เปิดดูเนื้อหา / Live Demo (col F)
  videoUrls?: string; // ลิงก์วิดีโอ (col I)
  manualUrl?: string; // ลิงก์เปิดดูคู่มือ / Manual Documentation (col J)
  isFeatured?: boolean; // ติดดาวเป็นผลงานเด่น (col K)
  sortOrder?: number;   // ลำดับการแสดงผล (col L)
}

export async function GET() {
  try {
    // ดึงข้อมูลจากแท็บ 'Services' ช่วงเซลล์ 'A2:L' (ครอบคลุม is_featured และ sort_order)
    const range = 'Services!A2:L';
    const rows = await getSheetValues(range);

    // จัดระเบียบข้อมูล (Map) ให้ตรงกับ Interface
    const services: ServiceData[] = rows.map((row: any[]) => {
      const imageUrlsStr: string = String(row[4] || '');
      const videoUrlsStr: string = String(row[8] || '');
      
      // Transform Google Drive links for multiple images
      const imageUrl = convertToDirectLink(imageUrlsStr);

      // Transform Google Drive video links to Preview/Embed links
      const videoUrls = videoUrlsStr
        .split(',')
        .map((url: string) => getDriveIframeUrl(url.trim()))
        .filter(Boolean)
        .join(',');

      const isFeatured = String(row[10] || '').trim().toUpperCase() === 'TRUE';
      const sortOrderRaw = row[11] !== undefined && row[11] !== '' ? Number(row[11]) : undefined;
      const sortOrder = sortOrderRaw !== undefined && !isNaN(sortOrderRaw) ? sortOrderRaw : undefined;

      return {
        id: String(row[0] || ''),
        title: String(row[1] || ''),
        description: String(row[2] || ''),
        icon: String(row[3] || ''),
        imageUrl: imageUrl,
        demoUrl: row[5] || '',
        title_th: row[6] || '',
        description_th: row[7] || '',
        videoUrls: videoUrls,
        manualUrl: row[9] || '',
        isFeatured: isFeatured,
        sortOrder: sortOrder,
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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, icon, imageUrl, demoUrl, videoUrls, manualUrl, isFeatured, sortOrder, isEdit } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const finalId = id?.trim() || `svc-${Date.now()}`;

    // ลำดับคอลัมน์: [id, title, description, icon, imageUrl, demoUrl, title_th, description_th, videoUrls, manualUrl, is_featured, sort_order]
    const rowData = [
      finalId,
      title || "",
      description || "",
      icon || "",
      imageUrl || "",
      demoUrl || "",
      body.title_th || "",
      body.description_th || "",
      videoUrls || "",
      manualUrl || "",
      isFeatured ? "TRUE" : "FALSE",
      sortOrder !== undefined && sortOrder !== null && sortOrder !== '' ? String(sortOrder) : ""
    ];

    if (isEdit) {
      if (!id) {
        return NextResponse.json(
          { success: false, error: 'ID is required to update service' },
          { status: 400 }
        );
      }
      const result = await updateSheetRow('Services', id, rowData, 'A:L');
      return NextResponse.json({
        success: true,
        message: 'Service updated successfully in Google Sheets',
        data: result,
      });
    } else {
      // ตรวจสอบว่ามี ID นี้อยู่แล้วหรือไม่ เพื่อป้องกันการบันทึกซ้ำ
      const existingRows = await getSheetValues('Services!A2:A');
      const normalizedNewId = finalId.toLowerCase();
      const duplicate = existingRows.some(row => String(row[0] || '').trim().toLowerCase() === normalizedNewId);
      if (duplicate) {
        return NextResponse.json(
          { success: false, error: `รหัสผลงาน '${finalId}' มีอยู่ในระบบแล้ว กรุณาระบุรหัสใหม่ หรือกดแก้ไขรายการเดิม` },
          { status: 400 }
        );
      }

      const newRow = [rowData];
      const range = 'Services!A:L';
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

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isFeatured, sortOrder } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const rows = await getSheetValues('Services!A2:L');
    const normalizedId = String(id).trim().toLowerCase();
    const existing = rows.find((r: any[]) => String(r[0] || '').trim().toLowerCase() === normalizedId);

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    const updatedRow = [
      existing[0] || id,
      existing[1] || '',
      existing[2] || '',
      existing[3] || '',
      existing[4] || '',
      existing[5] || '',
      existing[6] || '',
      existing[7] || '',
      existing[8] || '',
      existing[9] || '',
      isFeatured !== undefined ? (isFeatured ? 'TRUE' : 'FALSE') : (existing[10] || 'FALSE'),
      sortOrder !== undefined && sortOrder !== null ? String(sortOrder) : (existing[11] || '')
    ];

    await updateSheetRow('Services', id, updatedRow, 'A:L');

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully'
    });
  } catch (error: any) {
    console.error('Error in /api/services PATCH:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
