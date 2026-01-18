"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    async function check() {
      const savedKey = localStorage.getItem('admin_access')
      const { data } = await supabase.from('settings').select('admin_key').eq('id', 1).single()
      if (data && savedKey === data.admin_key) setAuthorized(true)
      else if (pathname !== '/admin/login') router.push('/admin/login')
      setLoading(false)
    }
    check()
  }, [pathname, router])

  if (loading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-purple-500 font-black uppercase tracking-[0.5em] animate-pulse">Authenticating...</div>
  if (pathname === '/admin/login') return <>{children}</>
  if (!authorized) return null

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <nav className="p-4 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-lg font-black text-purple-400 italic">ADMIN PANEL</h1>
        <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
          <Link href="/admin">Inventory</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/settings">Settings</Link>
          <Link href="/admin/about">About</Link>
          <button onClick={() => {localStorage.removeItem('admin_access'); router.push('/admin/login')}} className="text-red-500">Logout</button>
        </div>
      </nav>
      <main className="p-6 md:p-10 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}
