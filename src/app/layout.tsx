import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DeeDevIoT - Web & IoT Solutions',
  description: 'บริการรับพัฒนา Web Application & IoT Solutions รวดเร็ว ราคาเป็นกันเอง',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
