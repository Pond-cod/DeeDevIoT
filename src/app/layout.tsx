import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#08090D',
}

export const metadata: Metadata = {
  title: 'DeeDevIOT | รับพัฒนา Web Application, IoT และระบบ IT',
  description: 'รับพัฒนา Web Application, IoT, Dashboard และระบบ IT ตามความต้องการ พร้อมช่วยออกแบบระบบให้เหมาะกับการใช้งานจริง',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#08090D] text-[#FFFFFF] min-h-screen selection:bg-[#E53935]/20 selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
