import { NextResponse } from 'next/server';
import { getSheetValues, appendSheetValues, updateSheetRow, deleteSheetRow } from '../../../lib/google';

export interface SectionData {
  id: string;
  title_en: string;
  title_th: string;
  subtitle_en: string;
  subtitle_th: string;
  is_active: string;
}

export async function GET() {
  try {
    const range = 'sections!A2:F';
    const rows = await getSheetValues(range);

    const sections: SectionData[] = rows.map((row) => ({
      id: row[0] || '',
      title_en: row[1] || '',
      title_th: row[2] || '',
      subtitle_en: row[3] || '',
      subtitle_th: row[4] || '',
      is_active: row[5] || 'TRUE',
    }));

    return NextResponse.json({ success: true, data: sections });
  } catch (error: any) {
    console.error('Error in /api/sections GET:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title_en, title_th, subtitle_en, subtitle_th, is_active, isEdit } = body;

    const rowData = [
      id || Date.now().toString(),
      title_en || "",
      title_th || "",
      subtitle_en || "",
      subtitle_th || "",
      is_active || "TRUE"
    ];

    if (isEdit) {
      await updateSheetRow(id, rowData);
    } else {
      await appendSheetValues('sections!A:F', [rowData]);
    }

    return NextResponse.json({ success: true, message: isEdit ? 'Section updated' : 'Section added' });
  } catch (error: any) {
    console.error('Error in /api/sections POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await deleteSheetRow('sections', id);
    return NextResponse.json({ success: true, message: 'Section deleted' });
  } catch (error: any) {
    console.error('Error in /api/sections DELETE:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
