"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase' // Yeh sahi hai kyunke ye direct app folder mein hai

export default function AboutPage() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('store_info').select('*').single().then(({data}) => {
      if(data) setContent(data.about_text)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-10 max-w-2xl mx-auto">
      <button onClick={() => window.location.href='/'} className="text-slate-500 mb-6 text-sm underline">← Back to Shop</button>
      <h1 className="text-3xl font-black text-purple-500 mb-8 italic text-center">ABOUT OUR STORE</h1>
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10 leading-relaxed text-slate-300 text-center">
        {loading ? "Loading..." : content || "No info available yet."}
      </div>
      <p className="mt-10 text-[10px] text-slate-600 uppercase tracking-widest text-center">
        Pak Vape Store (Aryaan Vape Shop)<br/>
        Shop 7, Ithad Plaza, Islam Pora Jabbar, Gujar Khan
      </p>
    </div>
  )
}
