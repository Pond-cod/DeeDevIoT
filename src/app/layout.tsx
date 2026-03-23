import type { Metadata } from 'next'
import { Prompt } from 'next/font/google'
import './globals.css'

const prompt = Prompt({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-prompt'
})

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
    <html lang="th" className={`${prompt.variable}`}>
      <body className="font-sans text-[#333333] bg-[#F8F9FA] antialiased">
        {children}
      </body>
    </html>
  )
}
