import { NextResponse } from 'next/server';
import { getSheetValues, appendSheetValues, updateSheetRow, deleteSheetRow } from '../../../lib/google';

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
}

export async function GET() {
  try {
    const rows = await getSheetValues('Integrations!A2:I');
    const integrations: IntegrationData[] = rows.map((row) => {
      let imageUrl = row[3] || ''; // Column D: ImageUrl
      
      // Transform Google Drive links to bypass CORB/ORB
      if (imageUrl.includes('drive.google.com')) {
        const regex = /(?:\/d\/|id=|\/open\?id=)([a-zA-Z0-9_-]{20,})/;
        const match = imageUrl.match(regex);
        if (match && match[1]) {
          imageUrl = `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
        }
      }

      return {
        id: row[0] || '',
        title: row[1] || '',
        tag: row[2] || '',
        imageUrl: imageUrl,
        description: row[4] || row[1] || '',
        referenceUrl: row[5] || '',
        title_th: row[6] || '',
        description_th: row[7] || '',
        manualUrl: row[8] || '',
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
    const { id, title, description, imageUrl, tag, referenceUrl, manualUrl, isEdit } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const finalId = id?.trim() || `int-${Date.now()}`;

    const rowData = [
      finalId,
      title || "",
      tag || "",
      imageUrl || "",
      description || "",
      referenceUrl || "",
      body.title_th || "",
      body.description_th || "",
      manualUrl || ""
    ];

    if (isEdit) {
      if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
      const result = await updateSheetRow('Integrations', id, rowData, 'A:I');
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

      const result = await appendSheetValues('Integrations!A:I', [rowData]);
      return NextResponse.json({ success: true, message: 'Integration added', data: result });
    }
  } catch (error: any) {
    console.error('Error POST integrations:', error);
    return NextResponse.json({ success: false, error: 'Failed to save integration', details: error.message }, { status: 500 });
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
