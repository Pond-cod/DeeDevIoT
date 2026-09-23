import { NextResponse } from 'next/server';
import { getSheetValues, appendSheetValues, updateSheetRow, deleteSheetRow } from '../../../lib/google';

export interface ConceptData {
  id: string;
  title_en: string;
  title_th: string;
  desc_en: string;
  desc_th: string;
  icon: string;
}

export async function GET() {
  try {
    const range = 'concept!A2:F';
    const rows = await getSheetValues(range);

    const concepts: ConceptData[] = rows.map((row) => ({
      id: row[0] || '',
      title_en: row[1] || '',
      title_th: row[2] || '',
      desc_en: row[3] || '',
      desc_th: row[4] || '',
      icon: row[5] || '',
    }));

    return NextResponse.json({ success: true, data: concepts });
  } catch (error: any) {
    console.error('Error in /api/concept GET:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title_en, title_th, desc_en, desc_th, icon, isEdit } = body;

    const finalId = id?.trim() || `concept-${Date.now()}`;

    const rowData = [
      finalId,
      title_en || "",
      title_th || "",
      desc_en || "",
      desc_th || "",
      icon || ""
    ];

    if (isEdit) {
      if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
      await updateSheetRow('concept', id, rowData, 'A:F');
    } else {
      const existingRows = await getSheetValues('concept!A2:A');
      const normalizedNewId = finalId.toLowerCase();
      if (existingRows.some(row => String(row[0] || '').trim().toLowerCase() === normalizedNewId)) {
        return NextResponse.json({ success: false, error: `รหัส '${finalId}' มีอยู่แล้วในระบบ` }, { status: 400 });
      }
      await appendSheetValues('concept!A:F', [rowData]);
    }

    return NextResponse.json({ success: true, message: isEdit ? 'Concept updated' : 'Concept added' });
  } catch (error: any) {
    console.error('Error in /api/concept POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await deleteSheetRow('concept', id);
    return NextResponse.json({ success: true, message: 'Concept deleted' });
  } catch (error: any) {
    console.error('Error in /api/concept DELETE:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
