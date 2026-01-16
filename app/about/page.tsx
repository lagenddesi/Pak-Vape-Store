"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

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
      <h1 className="text-3xl font-black text-purple-500 mb-8 italic text-center uppercase">About Our Store</h1>
      
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10 leading-relaxed text-slate-300 text-center shadow-2xl">
        {loading ? (
          <div className="animate-pulse">Loading info...</div>
        ) : (
          <p className="whitespace-pre-wrap">{content || "Welcome to Pak Vape Store. We are located in Gujar Khan."}</p>
        )}
      </div>

      <div className="mt-12 text-center space-y-2">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">Official Store</p>
        <p className="text-sm font-bold text-slate-400">Aryaan Vape Shop</p>
        <p className="text-xs text-slate-500">Shop 7, Ithad Plaza, Islam Pora Jabbar, Gujar Khan</p>
      </div>
    </div>
  )
}
