import { NextResponse } from 'next/server';
import { getConfig, updateConfig } from '../../../lib/google';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const config = await getConfig();
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    console.error('Error GET config:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch config', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // body is expected to be a Record<string, string>
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid config format' }, { status: 400 });
    }

    const result = await updateConfig(body);
    
    return NextResponse.json({
      success: true,
      message: 'Config updated successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Error POST config:', error);
    return NextResponse.json({ success: false, error: 'Failed to update config', details: error.message }, { status: 500 });
  }
}
