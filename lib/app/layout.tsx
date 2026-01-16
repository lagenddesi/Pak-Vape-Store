import './globals.css'
export const metadata = { title: 'Pak Vape Store', description: 'Premium Vape Shop' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white selection:bg-purple-500/30">
        {children}
      </body>
    </html>
  )
}
