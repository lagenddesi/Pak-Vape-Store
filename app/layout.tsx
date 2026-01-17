import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://pak-vape-store-pods.vercel.app'),
  title: {
    default: 'Pak Vape Store | Best Vape Shop in Gujar Khan & Pakistan',
    template: '%s | Pak Vape Store'
  },
  description: 'Aryaan Vape Shop - Premium Vapes, Pods, and E-liquids in Gujar Khan, Rawalpindi. Buy authentic vape kits and drops at best prices.',
  keywords: ['vape shop Gujar Khan', 'vape shop Rawalpindi', 'best e-liquids Pakistan', 'buy pods online Pakistan', 'Aryaan Vape Shop', 'Pak Vape Store', 'Vaporesso Pakistan'],
  
  // --- GOOGLE VERIFICATION TAG START ---
  verification: {
    google: 'Vg04eiXL_lLorBc0wVkC8daYYD8F85FzUhJpKdXf29k',
  },
  // --- GOOGLE VERIFICATION TAG END ---

  openGraph: {
    title: 'Pak Vape Store | Premium Vapes & Drops',
    description: 'Authentic Vapes & E-liquids in Gujar Khan. Fast Delivery!',
    url: 'https://pak-vape-store-pods.vercel.app',
    siteName: 'Pak Vape Store',
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
      <head>
        {/* Google verification tag in standard meta format as a backup */}
        <meta name="google-site-verification" content="Vg04eiXL_lLorBc0wVkC8daYYD8F85FzUhJpKdXf29k" />
      </head>
      <body className={`${inter.className} bg-[#030712] text-slate-100 selection:bg-purple-500/30`}>
        {children}
      </body>
    </html>
  )
}
