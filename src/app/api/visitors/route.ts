import { NextRequest, NextResponse } from 'next/server';
import { getVisitorCount, incrementVisitorCount, setVisitorCount } from '../../../lib/visitors';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isHit = searchParams.get('hit') === '1' || searchParams.get('action') === 'hit';

    let count: number;
    if (isHit) {
      count = await incrementVisitorCount();
    } else {
      count = await getVisitorCount();
    }

    return NextResponse.json(
      { success: true, count },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error handling GET /api/visitors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch visitor count', count: 1280 },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body?.action || 'hit';

    let count: number;
    if (action === 'set' && typeof body?.count === 'number') {
      await setVisitorCount(body.count);
      count = body.count;
    } else {
      count = await incrementVisitorCount();
    }

    return NextResponse.json(
      { success: true, count },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Error handling POST /api/visitors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update visitor count', count: 1280 },
      { status: 500 }
    );
  }
}
