import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans_Thai, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-thai',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

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
    <html lang="th" className={`${inter.variable} ${notoSansThai.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#08090D] text-[#FFFFFF] min-h-screen selection:bg-[#E53935]/20 selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
