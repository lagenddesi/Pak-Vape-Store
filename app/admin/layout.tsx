"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAccess()
  }, [])

  async function checkAccess() {
    const savedKey = localStorage.getItem('admin_access')
    
    // Database se asli key mangwaein
    const { data } = await supabase.from('settings').select('admin_key').eq('id', 1).single()

    if (data && savedKey === data.admin_key) {
      setAuthorized(true)
    } else {
      // Agar key match nahi hoti ya nahi hai, to login par bhejien
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    setLoading(false)
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-purple-500 font-bold uppercase tracking-widest">Securing Connection...</div>

  // Agar login page hai to layout dikhayein bina nav ke
  if (window.location.pathname === '/admin/login') {
    return <>{children}</>
  }

  // Agar authorize nahi hai to kuch na dikhayein (redirect ho raha hoga)
  if (!authorized) return null

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="p-4 bg-slate-800 border-b border-purple-500/30 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-purple-400">PAK VAPE ADMIN</h1>
        <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
          <a href="/admin" className="hover:text-purple-400">Inventory</a>
          <a href="/admin/orders" className="hover:text-purple-400">Orders</a>
          <a href="/admin/about" className="hover:text-purple-400">About</a>
          <button onClick={() => {localStorage.removeItem('admin_access'); window.location.href='/admin/login'}} className="text-red-500">Logout</button>
        </div>
      </nav>
      <main className="p-4 md:p-8 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}
