"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, MessageCircle, MapPin, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const [content, setContent] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getData() {
      const { data: info } = await supabase.from('store_info').select('*').single()
      const { data: set } = await supabase.from('settings').select('whatsapp_number').single()
      if(info) setContent(info.about_text)
      if(set) setWhatsapp(set.whatsapp_number)
      setLoading(false)
    }
    getData()
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-purple-500/30">
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-1/2 h-screen bg-purple-600/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-20">
        <button onClick={() => window.location.href='/'} className="mb-12 flex items-center gap-2 text-slate-500 hover:text-white transition font-black text-[10px] uppercase tracking-widest">
          <ArrowLeft size={14}/> Return to Shop
        </button>

        <header className="mb-20 text-center">
           <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">Our Story.</h1>
           <p className="text-purple-500 font-black uppercase tracking-[0.5em] text-[10px]">Aryaan Vape Shop Gujar Khan</p>
        </header>

        <div className="space-y-20 leading-relaxed">
           <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-purple-600" />
              <p className="text-slate-300 text-lg italic whitespace-pre-wrap leading-relaxed">
                {loading ? "Refreshing content..." : content || "Pak Vape Store is Gujar Khan's premium destination for high-quality vaping hardware and e-liquids."}
              </p>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 space-y-4">
                 <ShieldCheck size={32} className="text-purple-500" />
                 <h3 className="font-black uppercase tracking-widest text-xs">Authentic</h3>
                 <p className="text-[10px] text-slate-500 uppercase leading-loose">100% Original products sourced from top brands.</p>
              </div>
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 space-y-4">
                 <Zap size={32} className="text-purple-500" />
                 <h3 className="font-black uppercase tracking-widest text-xs">Fast Delivery</h3>
                 <p className="text-[10px] text-slate-500 uppercase leading-loose">Quick Cash on Delivery service in Gujar Khan & surroundings.</p>
              </div>
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 space-y-4">
                 <MapPin size={32} className="text-purple-500" />
                 <h3 className="font-black uppercase tracking-widest text-xs">Local Store</h3>
                 <p className="text-[10px] text-slate-500 uppercase leading-loose">Visit us at Shop 7, Ithad Plaza, Islam Pora Jabbar.</p>
              </div>
           </div>

           <div className="text-center space-y-8 bg-gradient-to-br from-purple-900/20 to-transparent p-12 rounded-[4rem] border border-white/5">
              <h2 className="text-2xl font-black uppercase italic tracking-widest">Need Assistance?</h2>
              <p className="text-xs text-slate-400 uppercase tracking-widest max-w-sm mx-auto leading-loose">Contact our store support team directly on WhatsApp for any queries.</p>
              <Link href={`https://wa.me/${whatsapp}`} className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-xl">
                 <MessageCircle size={20}/> Chat with us
              </Link>
           </div>
        </div>
      </div>
      
      <footer className="p-20 text-center opacity-30">
         <p className="text-[9px] font-black uppercase tracking-[0.8em]">Pak Vape Store Official Website &copy; 2026</p>
      </footer>
    </div>
  )
}
