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
  themeColor: '#090d1a',
}

export const metadata: Metadata = {
  title: 'DeeDevIOT | Next-Gen Web App & IoT Accelerator',
  description: 'Gearing up for the future with smart IoT Ecosystems and modern software solutions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${kanit.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="font-kanit antialiased bg-slate-950 text-slate-100 min-h-screen selection:bg-brand-500/30 selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
