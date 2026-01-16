"use client"
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function AdminLogin() {
  const [key, setKey] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: any) {
    e.preventDefault()
    setLoading(true)
    const { data } = await supabase.from('settings').select('admin_key').eq('id', 1).single()

    if (data && data.admin_key === key) {
      localStorage.setItem('admin_access', key)
      window.location.href = '/admin'
    } else {
      alert("Ghalat Key! Dobara koshish karein.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-md w-full bg-slate-900 p-10 rounded-[2.5rem] border border-purple-500/20 shadow-2xl">
        <h1 className="text-3xl font-black text-purple-500 mb-2 italic text-center uppercase tracking-tighter">Admin Login</h1>
        <p className="text-slate-500 text-[10px] text-center mb-10 uppercase tracking-[0.3em]">Enter Secret Key</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="password" 
            placeholder="••••••••••••" 
            className="w-full bg-slate-800 p-4 rounded-2xl border border-white/5 outline-none focus:ring-2 ring-purple-500 text-center text-lg"
            onChange={(e) => setKey(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} className="w-full bg-purple-600 p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-purple-700 transition-all">
            {loading ? "Verifying..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  )
}
