import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Report Record',
  description: 'Record your reports',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-900 ${inter.className}`}
      >
        <div className="min-h-screen backdrop-blur-3xl">
          <div className="container mx-auto max-w-xl px-4 py-8">{children}</div>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1d4ed8',
              color: '#fff',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            },
            success: {
              duration: 2000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
              style: {
                background: '#1e40af',
                color: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              style: {
                background: '#991b1b',
                color: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
