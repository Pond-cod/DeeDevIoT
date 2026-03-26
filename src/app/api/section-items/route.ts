import { NextResponse } from 'next/server';
import { getSheetValues, appendSheetValues, updateSheetRow, deleteSheetRow } from '../../../lib/google';

export interface SectionItemData {
  id: string;
  section_id: string;
  title_en: string;
  title_th: string;
  desc_en: string;
  desc_th: string;
  icon: string;
  imageUrl: string;
}

export async function GET() {
  try {
    const range = 'section_items!A2:H';
    const rows = await getSheetValues(range);

    const items: SectionItemData[] = rows.map((row) => {
      let imageUrl = row[7] || '';
      if (imageUrl.includes('drive.google.com')) {
        const regex = /(?:\/d\/|id=|\/open\?id=)([a-zA-Z0-9_-]{20,})/;
        const match = imageUrl.match(regex);
        if (match && match[1]) {
          imageUrl = `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
        }
      }

      return {
        id: row[0] || '',
        section_id: row[1] || '',
        title_en: row[2] || '',
        title_th: row[3] || '',
        desc_en: row[4] || '',
        desc_th: row[5] || '',
        icon: row[6] || '',
        imageUrl: imageUrl,
      };
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    console.error('Error in /api/section-items GET:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, section_id, title_en, title_th, desc_en, desc_th, icon, imageUrl, isEdit } = body;

    const rowData = [
      id || Date.now().toString(),
      section_id || "",
      title_en || "",
      title_th || "",
      desc_en || "",
      desc_th || "",
      icon || "",
      imageUrl || ""
    ];

    if (isEdit) {
      await updateSheetRow('section_items', id, rowData, 'A:H');
    } else {
      await appendSheetValues('section_items!A:H', [rowData]);
    }

    return NextResponse.json({ success: true, message: isEdit ? 'Section item updated' : 'Section item added' });
  } catch (error: any) {
    console.error('Error in /api/section-items POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await deleteSheetRow('section_items', id);
    return NextResponse.json({ success: true, message: 'Section item deleted' });
  } catch (error: any) {
    console.error('Error in /api/section-items DELETE:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
