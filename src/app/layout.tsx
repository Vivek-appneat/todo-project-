import './globals.css'
import { ReactNode } from 'react'
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'Login App',
  description: 'Login to dashboard using Next.js',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
