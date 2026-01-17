import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://pak-vape-store-pods.vercel.app'),
  title: {
    default: 'Pak Vape Store | #1 Vape Shop in Gujar Khan & Pakistan',
    template: '%s | Pak Vape Store'
  },
  description: 'Buy authentic Vaporesso, Caliburn, and Premium E-liquids at Pak Vape Store (Aryaan Vape Shop). Best prices in Gujar Khan, Rawalpindi. Cash on Delivery nationwide.',
  keywords: ['vape shop Gujar Khan', 'vape shop Rawalpindi', 'best e-liquids Pakistan', 'buy pods online Pakistan', 'Aryaan Vape Shop', 'Pak Vape Store', 'Vaporesso Pakistan'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pak Vape Store | Premium Vapes & Drops',
    description: 'Authentic Vapes & E-liquids in Gujar Khan. Fast Delivery!',
    url: 'https://pak-vape-store-pods.vercel.app',
    siteName: 'Pak Vape Store',
    images: [
      {
        url: '/og-image.jpg', // Aik achi photo root folder mein is naam se save karein
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pak Vape Store',
    description: 'Premium Vapes & Drops in Pakistan',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#030712] text-slate-100 selection:bg-purple-500/30`}>
        {children}
      </body>
    </html>
  )
}
