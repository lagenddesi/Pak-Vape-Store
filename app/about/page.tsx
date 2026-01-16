"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AboutPage() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getAbout() {
      const { data } = await supabase.from('store_info').select('*').eq('id', 1).single()
      if(data) setContent(data.about_text)
      setLoading(false)
    }
    getAbout()
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-6 md:p-20">
      <button onClick={() => window.location.href='/'} className="mb-10 text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition">← Back to Shop</button>
      
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-black text-purple-500 mb-8 italic uppercase tracking-tighter underline decoration-purple-500/30 underline-offset-8">Our Story</h1>
        
        <div className="bg-white/5 p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
          {loading ? (
            <div className="animate-pulse text-slate-500 uppercase tracking-widest text-xs">Fetching Info...</div>
          ) : (
            <p className="text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap italic">
              {content || "Welcome to Pak Vape Store. We are dedicated to providing the best vaping experience in Gujar Khan."}
            </p>
          )}
        </div>

        <div className="mt-16 space-y-4">
           <p className="text-xs font-black text-purple-500 uppercase tracking-[0.4em]">Official Store Location</p>
           <p className="text-sm font-bold text-slate-200">ARYAAN VAPE SHOP</p>
           <p className="text-xs text-slate-500 leading-loose">
             Shop 7, Ithad Plaza, Islam Pora Jabbar,<br/>
             Tehsil Gujar Khan, District Rawalpindi
           </p>
        </div>
      </div>
    </div>
  )
}
