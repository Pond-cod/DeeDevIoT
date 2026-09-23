import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#FFFFFF',
}

export const metadata: Metadata = {
  referrer: 'no-referrer',
  title: 'DeeDevIOT | Connecting Devices. Developing Futures. | รับพัฒนา Web Application, IoT และระบบ IT',
  description: 'DeeDevIOT สตูดิโอพัฒนา Web Application, IoT, Dashboard และระบบ IT เชื่อมต่ออุปกรณ์ฮาร์ดแวร์โดยทีมงานคนไทย',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' }
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <meta name="referrer" content="no-referrer" />
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#FAFAFC] text-[#0F172A] min-h-screen selection:bg-[#E11D48]/15 selection:text-[#E11D48] overflow-x-hidden pb-[env(safe-area-inset-bottom)]">
        {children}
      </body>
    </html>
  )
}
