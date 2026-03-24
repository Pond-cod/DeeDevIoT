import { NextResponse } from 'next/server';
import { getSheetValues, appendSheetValues, updateIntegrationRow } from '../../../lib/google';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface IntegrationData {
  id: string;
  title: string;
  description: string;
  title_th?: string;
  description_th?: string;
  imageUrl: string;
  tag: string;
  referenceUrl: string;
}

export async function GET() {
  try {
    const rows = await getSheetValues('Integrations!A2:H');
    const integrations: IntegrationData[] = rows.map((row) => ({
      id: row[0] || '',
      title: row[1] || '',
      description: row[2] || '',
      imageUrl: row[3] || '',
      tag: row[4] || '',
      referenceUrl: row[5] || '',
      title_th: row[6] || '',
      description_th: row[7] || '',
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
    const { id, title, description, imageUrl, tag, referenceUrl, isEdit } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Title and description required' }, { status: 400 });
    }

    const rowData = [
      id || Date.now().toString(),
      title || "",
      description || "",
      imageUrl || "",
      tag || "",
      referenceUrl || "",
      body.title_th || "",
      body.description_th || ""
    ];

    if (isEdit) {
      if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
      const result = await updateIntegrationRow(id, rowData);
      return NextResponse.json({ success: true, message: 'Integration updated', data: result });
    } else {
      const result = await appendSheetValues('Integrations!A:H', [rowData]);
      return NextResponse.json({ success: true, message: 'Integration added', data: result });
    }
  } catch (error: any) {
    console.error('Error POST integrations:', error);
    return NextResponse.json({ success: false, error: 'Failed to save', details: error.message }, { status: 500 });
  }
}
