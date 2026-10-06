import { NextResponse } from 'next/server';
import { getSheetValues, appendSheetValues, updateSheetRow, deleteSheetRow } from '../../../lib/google';
import { convertToDirectLink } from '../../../lib/utils/drive';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface IntegrationData {
  id: string;
  title: string;
  description: string;
  title_th?: string;
  description_th?: string;
  imageUrl: string;     // ภาพปก
  tag: string;          // หมวดหมู่ / แท็ก
  referenceUrl: string; // ลิงก์เปิดดูเนื้อหา
  manualUrl?: string;   // ลิงก์เปิดดูคู่มือ
  isFeatured?: boolean; // ติดดาวเป็นผลงานเด่น (col J)
  sortOrder?: number;   // ลำดับการแสดงผล (col K)
}

export async function GET() {
  try {
    const rows = await getSheetValues('Integrations!A2:K');
    const integrations: IntegrationData[] = rows.map((row: any[]) => {
      const imageUrl = convertToDirectLink(String(row[3] || ''));
      const isFeatured = String(row[9] || '').trim().toUpperCase() === 'TRUE';
      const sortOrderRaw = row[10] !== undefined && row[10] !== '' ? Number(row[10]) : undefined;
      const sortOrder = sortOrderRaw !== undefined && !isNaN(sortOrderRaw) ? sortOrderRaw : undefined;

      return {
        id: String(row[0] || ''),
        title: String(row[1] || ''),
        tag: String(row[2] || ''),
        imageUrl: imageUrl,
        description: String(row[4] || row[1] || ''),
        referenceUrl: String(row[5] || ''),
        title_th: String(row[6] || ''),
        description_th: String(row[7] || ''),
        manualUrl: String(row[8] || ''),
        isFeatured: isFeatured,
        sortOrder: sortOrder,
      };
    });

    return NextResponse.json({ success: true, data: integrations });
  } catch (error: any) {
    console.error('Error GET integrations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch integrations', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, imageUrl, tag, referenceUrl, manualUrl, isFeatured, sortOrder, isEdit } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const finalId = id?.trim() || `int-${Date.now()}`;

    // ลำดับคอลัมน์: [id, title, tag, imageUrl, description, referenceUrl, title_th, description_th, manualUrl, is_featured, sort_order]
    const rowData = [
      finalId,
      title || "",
      tag || "",
      imageUrl || "",
      description || "",
      referenceUrl || "",
      body.title_th || "",
      body.description_th || "",
      manualUrl || "",
      isFeatured ? "TRUE" : "FALSE",
      sortOrder !== undefined && sortOrder !== null && sortOrder !== '' ? String(sortOrder) : ""
    ];

    if (isEdit) {
      if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
      const result = await updateSheetRow('Integrations', id, rowData, 'A:K');
      return NextResponse.json({ success: true, message: 'Integration updated', data: result });
    } else {
      // ตรวจสอบว่ามี ID นี้อยู่แล้วหรือไม่
      const existingRows = await getSheetValues('Integrations!A2:A');
      const normalizedNewId = finalId.toLowerCase();
      const duplicate = existingRows.some(row => String(row[0] || '').trim().toLowerCase() === normalizedNewId);
      if (duplicate) {
        return NextResponse.json(
          { success: false, error: `รหัสระบบ '${finalId}' มีอยู่ในระบบแล้ว กรุณาระบุรหัสใหม่ หรือกดแก้ไขรายการเดิม` },
          { status: 400 }
        );
      }

      const result = await appendSheetValues('Integrations!A:K', [rowData]);
      return NextResponse.json({ success: true, message: 'Integration added', data: result });
    }
  } catch (error: any) {
    console.error('Error POST integrations:', error);
    return NextResponse.json({ success: false, error: 'Failed to save integration', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isFeatured, sortOrder } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const rows = await getSheetValues('Integrations!A2:K');
    const normalizedId = String(id).trim().toLowerCase();
    const existing = rows.find((r: any[]) => String(r[0] || '').trim().toLowerCase() === normalizedId);

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Integration not found' }, { status: 404 });
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
      isFeatured !== undefined ? (isFeatured ? 'TRUE' : 'FALSE') : (existing[9] || 'FALSE'),
      sortOrder !== undefined && sortOrder !== null ? String(sortOrder) : (existing[10] || '')
    ];

    await updateSheetRow('Integrations', id, updatedRow, 'A:K');

    return NextResponse.json({
      success: true,
      message: 'Integration updated successfully'
    });
  } catch (error: any) {
    console.error('Error in /api/integrations PATCH:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await deleteSheetRow('Integrations', id);

    return NextResponse.json({ success: true, message: 'Integration deleted successfully' });
  } catch (error: any) {
    console.error('Error DELETE integrations:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete integration', details: error.message }, { status: 500 });
  }
}
