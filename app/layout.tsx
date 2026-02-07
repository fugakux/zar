import type { Metadata } from 'next'
import './globals.css'
import { NotificationProvider } from '@/components/NotificationProvider'

export const metadata: Metadata = {
  title: 'Zenith Vision',
  description: 'Official Zenith Vision merchandise',
  icons: {
    icon: '/Zlogo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  )
}

