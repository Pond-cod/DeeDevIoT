import type { Metadata, Viewport } from 'next'
import { Kanit, Montserrat } from 'next/font/google'
import './globals.css'

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-kanit',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#09090b',
}

export const metadata: Metadata = {
  title: 'DeeDevIOT | Modern Web App & Smart IoT Solutions',
  description: 'ขับเคลื่อนธุรกิจสู่อนาคตด้วย Web Application และระบบ IoT อัจฉริยะที่ออกแบบเฉพาะเพื่อคุณ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${kanit.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="font-kanit antialiased bg-zinc-950 text-zinc-100 min-h-screen selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
