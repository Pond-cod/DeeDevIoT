import { NextResponse } from 'next/server';
import { getSheetValues, appendSheetValues, updateIntegrationRow } from '../../../lib/google';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface IntegrationData {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
}

export async function GET() {
  try {
    const rows = await getSheetValues('Integrations!A2:E');
    const integrations: IntegrationData[] = rows.map((row) => ({
      id: row[0] || '',
      title: row[1] || '',
      description: row[2] || '',
      icon: row[3] || '',
      link: row[4] || '',
    }));

    return NextResponse.json({ success: true, data: integrations });
  } catch (error: any) {
    console.error('Error GET integrations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch config', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, icon, link, isEdit } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Title and description required' }, { status: 400 });
    }

    const rowData = [
      id || Date.now().toString(),
      title || "",
      description || "",
      icon || "",
      link || ""
    ];

    if (isEdit) {
      if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
      const result = await updateIntegrationRow(id, rowData);
      return NextResponse.json({ success: true, message: 'Integration updated', data: result });
    } else {
      const result = await appendSheetValues('Integrations!A:E', [rowData]);
      return NextResponse.json({ success: true, message: 'Integration added', data: result });
    }
  } catch (error: any) {
    console.error('Error POST integrations:', error);
    return NextResponse.json({ success: false, error: 'Failed to save', details: error.message }, { status: 500 });
  }
}
