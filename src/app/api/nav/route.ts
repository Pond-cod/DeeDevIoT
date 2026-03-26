import { NextResponse } from 'next/server';
import { getSheetValues, appendSheetValues, updateSheetRow, deleteSheetRow } from '../../../lib/google';

export interface NavData {
  id: string;
  label_en: string;
  label_th: string;
  href: string;
}

export async function GET() {
  try {
    const range = 'nav!A2:D';
    const rows = await getSheetValues(range);

    const navItems: NavData[] = rows.map((row) => ({
      id: row[0] || '',
      label_en: row[1] || '',
      label_th: row[2] || '',
      href: row[3] || '',
    }));

    return NextResponse.json({ success: true, data: navItems });
  } catch (error: any) {
    console.error('Error in /api/nav GET:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, label_en, label_th, href, isEdit } = body;

    const rowData = [
      id || Date.now().toString(),
      label_en || "",
      label_th || "",
      href || ""
    ];

    if (isEdit) {
      await updateSheetRow('nav', id, rowData, 'A:D');
      return NextResponse.json({ success: true, message: 'Nav item updated' });
    } else {
      await appendSheetValues('nav!A:D', [rowData]);
      return NextResponse.json({ success: true, message: 'Nav item added' });
    }
  } catch (error: any) {
    console.error('Error in /api/nav POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await deleteSheetRow('nav', id);
    return NextResponse.json({ success: true, message: 'Nav item deleted' });
  } catch (error: any) {
    console.error('Error in /api/nav DELETE:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
