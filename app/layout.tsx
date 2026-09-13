import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CIPHER — Student Association of Computer Science & Engineering',
  description:
    'CIPHER is the official student association of the CSE department — bridging academic knowledge and practical application through workshops, hackathons, leadership, and community.',
  generator: 'v0.app',
  keywords: [
    'CIPHER',
    'CSE',
    'Computer Science',
    'Student Association',
    'hackathons',
    'workshops',
    'coding',
  ],
  openGraph: {
    title: 'CIPHER — Student Association of Computer Science & Engineering',
    description:
      'A community of aspiring professionals in computing. Workshops, hackathons, leadership, and more.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#050705',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
