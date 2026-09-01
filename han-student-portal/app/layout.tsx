import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'HAN Studenten Hub',
  description:
    'Alles voor je studie aan de HAN op één plek: rooster, deadlines, plattegrond, absentie melden, campus events, een AI-studieassistent en snelkoppelingen naar alle HAN-apps.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#e2001a',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={`light ${manrope.variable}`}>
      <body className="bg-background font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
