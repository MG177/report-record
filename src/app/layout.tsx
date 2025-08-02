import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

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
        className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-gray-900 ${inter.variable} font-sans antialiased`}
      >
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 max-w-2xl lg:max-w-4xl xl:max-w-6xl">
            {children}
          </div>
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '16px 20px',
              boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
            },
            success: {
              duration: 2000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
              style: {
                background: '#065f46',
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
                background: '#7f1d1d',
                color: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
