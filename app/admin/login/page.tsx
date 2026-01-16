"use client"
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function AdminLogin() {
  const [key, setKey] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: any) {
    e.preventDefault()
    setLoading(true)

    // Database se sahi key fetch karein
    const { data } = await supabase.from('settings').select('admin_key').eq('id', 1).single()

    if (data && data.admin_key === key) {
      // Agar key sahi hai to browser mein session save karein
      localStorage.setItem('admin_access', key)
      alert("Login Successful!")
      window.location.href = '/admin'
    } else {
      alert("Invalid Admin Key! Access Denied.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl border border-purple-500/30 shadow-2xl">
        <h1 className="text-2xl font-black text-purple-500 mb-2 italic text-center">ADMIN ACCESS</h1>
        <p className="text-slate-500 text-xs text-center mb-8 uppercase tracking-widest">Enter Secret Key to Continue</p>
        
        <form onSubmit={handleOrder} className="space-y-4">
          <input 
            type="password" 
            placeholder="Enter Admin Key 🔑" 
            className="w-full bg-slate-800 p-4 rounded-2xl border border-white/5 outline-none focus:ring-2 ring-purple-500 text-center text-white"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 p-4 rounded-2xl font-black uppercase tracking-widest transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  )
}
