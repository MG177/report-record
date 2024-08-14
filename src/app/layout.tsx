import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Homepage',
  description: 'Reports List',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`container mx-auto bg-background bg-none px-4 overflow-x-hidden w-screen font-['Calibri'] text-text ${inter.className}`}
      >
        {children}
      </body>
    </html>
  )
}
