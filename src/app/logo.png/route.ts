import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'logo', 'logo2.png');
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Image not found', { status: 404 });
    }
    const buffer = fs.readFileSync(filePath);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error reading logo2.png:', error);
    return new NextResponse('Error reading image', { status: 500 });
  }
}

export const dynamic = 'force-static';
export const revalidate = false;
