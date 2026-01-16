import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Pak Vape Store | Best Vape Shop in Gujar Khan',
  description: 'Aryaan Vape Shop - Premium Vapes, Pods, and E-liquids in Gujar Khan, Rawalpindi. Buy authentic vape kits and drops at best prices.',
  keywords: 'vape shop pakistan, vape gujar khan, pak vape store, aryaan vape shop, e-liquids pakistan, pods gujar khan',
  openGraph: {
    title: 'Pak Vape Store',
    description: 'Authentic Vapes & E-liquids in Gujar Khan',
    url: 'https://pak-vape-store-pods.vercel.app/',
    siteName: 'Pak Vape Store',
    locale: 'en_PK',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-white selection:bg-purple-500/30`}>
        {children}
      </body>
    </html>
  )
}
