import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pLogo2 = path.join(process.cwd(), 'logo', 'logo2.png');
    const pLogoJpg = path.join(process.cwd(), 'logo', 'logo.jpg');

    if (fs.existsSync(pLogo2)) {
      const buffer = fs.readFileSync(pLogo2);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    if (fs.existsSync(pLogoJpg)) {
      const buffer = fs.readFileSync(pLogoJpg);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse('Favicon not found', { status: 404 });
  } catch (error) {
    console.error('Error reading favicon:', error);
    return new NextResponse('Error reading favicon', { status: 500 });
  }
}

export const dynamic = 'force-static';
export const revalidate = false;
