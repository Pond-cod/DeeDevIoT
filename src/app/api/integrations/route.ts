import { NextResponse } from 'next/server';
import { getSheetValues, appendSheetValues, updateIntegrationRow, deleteSheetRow } from '../../../lib/google';

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
        title: row[1] || '',       // Column B: Description (Title in UI)
        description: row[1] || '', // Fallback to Title
        imageUrl: imageUrl,
        tag: row[2] || '',         // Column C: Icon (Tag in UI)
        referenceUrl: row[5] || '', // Column F: DemoUrl (ReferenceUrl in UI)
        title_th: row[6] || '',
        description_th: row[7] || '',
      };
    });

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
      title || "",        // B: Description header in sheet
      tag || "",          // C: Icon header in sheet
      imageUrl || "",     // D: ImageUrl header in sheet
      "",                 // E: (Empty/Reserved)
      referenceUrl || "",  // F: DemoUrl header in sheet
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await deleteSheetRow('Integrations', id);

    return NextResponse.json({ success: true, message: 'Integration deleted successfully' });
  } catch (error: any) {
    console.error('Error DELETE integrations:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete', details: error.message }, { status: 500 });
  }
}
