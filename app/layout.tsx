import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://pak-vape-store-pods.vercel.app'),
  title: {
    default: 'Pak Vape Store | Best Vape Shop in Gujar Khan, Jhelum & Rawalpindi',
    template: '%s | Pak Vape Store'
  },
  description: 'Aryaan Vape Shop (Pak Vape Store) - Premium Vapes, Pods, Mods & E-liquids. Serving Islampura Jabbar, Smote, Bewal, Kallar Sayyeda, Sir Suba Shah, Dina, Sohawa, Jhelum, Rawalpindi & Gujar Khan. Original products with Cash on Delivery.',
  keywords: [
    'vape shop Gujar Khan', 
    'vape store Islampura Jabbar', 
    'best e-liquids Jhelum', 
    'buy pods Dina', 
    'vape shop Rawalpindi', 
    'vape store Bewal',
    'Kallar Sayyeda vape shop', 
    'Sohawa vape accessories', 
    'Smote vape store', 
    'Sir Suba Shah vape', 
    'Habib Chowk vape shop', 
    'Chowk Pandori vape store',
    'Pak Vape Store',
    'Aryaan Vape Shop',
    'Vaporesso Pakistan',
    'Caliburn Pakistan',
    'Disposable vapes Pakistan'
  ],
  
  // --- GOOGLE VERIFICATION ---
  verification: {
    google: 'Vg04eiXL_lLorBc0wVkC8daYYD8F85FzUhJpKdXf29k',
  },

  // --- OPEN GRAPH (Facebook, WhatsApp Sharing) ---
  openGraph: {
    title: 'Pak Vape Store | Premium Vapes & Drops',
    description: 'Fastest Vape Delivery in Gujar Khan, Jhelum, Rawalpindi and surrounding areas.',
    url: 'https://pak-vape-store-pods.vercel.app',
    siteName: 'Pak Vape Store',
    locale: 'en_PK',
    type: 'website',
  },

  // --- TWITTER CARD ---
  twitter: {
    card: 'summary_large_image',
    title: 'Pak Vape Store | Official Aryaan Vape Shop',
    description: 'Premium Authentic Vapes & E-liquids in Pakistan',
  },

  // --- VIEWPORT & ROBOTS ---
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Backup verification tag */}
        <meta name="google-site-verification" content="Vg04eiXL_lLorBc0wVkC8daYYD8F85FzUhJpKdXf29k" />
        
        {/* Mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#030712" />
      </head>
      <body className={`${inter.className} bg-[#030712] text-slate-100 selection:bg-purple-500/30 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}
