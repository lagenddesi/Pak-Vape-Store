"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, ChevronRight, Loader2, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => { 
    fetchData() 
  }, [])

  // Banner Auto-Slide Logic
  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 4000)
      return () => clearInterval(timer)
    }
  }, [banners])

  async function fetchData() {
    setLoading(true)
    const { data: p } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    const { data: b } = await supabase.from('banners').select('*').order('created_at', { ascending: false })
    if (p) setProducts(p)
    if (b) setBanners(b)
    setTimeout(() => setLoading(false), 1200)
  }

  const filtered = products.filter(p => 
    (activeCategory === "All" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || (p.category && p.category.toLowerCase().includes(search.toLowerCase())))
  )

  const SkeletonCard = () => (
    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden p-4">
      <div className="aspect-square skeleton rounded-lg mb-4" />
      <div className="h-3 w-1/2 skeleton rounded mb-2" />
      <div className="h-10 w-full skeleton rounded-lg" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#030712] pb-20">
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase">PAK VAPE STORE</h1>
          <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link href="/about">About</Link>
            <Link href="/track-order">Track</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* DYNAMIC PROMOTION BANNERS */}
        {banners.length > 0 && (
          <div className="relative h-44 md:h-96 w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-10 shadow-2xl border border-white/5 bg-slate-900">
             {banners.map((b, i) => (
               <img 
                key={b.id} 
                src={b.image_url} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentBanner ? 'opacity-100' : 'opacity-0'}`} 
               />
             ))}
             {/* Simple Banner Indicator Dots */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all ${i === currentBanner ? 'w-6 bg-purple-500' : 'w-2 bg-white/30'}`} />
                ))}
             </div>
          </div>
        )}

        {/* Hero Section if no banners */}
        {banners.length === 0 && (
           <div className="h-44 rounded-[2rem] bg-gradient-to-r from-purple-900/20 to-black border border-white/5 mb-10 flex items-center px-10">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Premium Vape Store <br/><span className="text-purple-500 text-xs tracking-widest not-italic">Official Aryaan Vape Shop</span></h2>
           </div>
        )}

        <div className="mb-10 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input placeholder="Search pods, mods, kits..." className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-xl text-xs outline-none" onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* UPDATED CATEGORIES BAR */}
        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar justify-start md:justify-center">
          {["All", "Pods", "E-liquids", "Pods / Mods", "Accessories"].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-white text-black border-white' : 'glass text-slate-500 hover:border-white/20'}`}>{cat}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loading ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />) : 
            filtered.map(p => (
              <div key={p.id} className="glass rounded-xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-purple-500/40">
                  <div className="aspect-square relative overflow-hidden bg-slate-900">
                    <img src={p.images[0]} className="w-full h-full object-cover" alt={p.name} />
                    <div className={`absolute top-2 left-2 z-10 px-2.5 py-1 rounded-lg text-[8px] font-black border backdrop-blur-xl ${p.stock_quantity > 0 ? 'bg-black/80 text-green-400 border-green-500/30' : 'bg-black/90 text-red-500 border-red-500/30'}`}>
                      {p.stock_quantity > 0 ? `STOCK: ${p.stock_quantity}` : 'OUT OF STOCK'}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[8px] text-purple-500 font-black uppercase mb-1">{p.category}</p>
                    <h3 className="font-bold text-[11px] truncate text-slate-200 mb-3 uppercase">{p.name}</h3>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <p className="text-white font-black text-sm">Rs.{p.price}</p>
                      <Link href={'/product/' + p.id} className="bg-white text-black p-2 rounded-lg hover:bg-purple-600 hover:text-white transition-all"><ChevronRight size={14}/></Link>
                    </div>
                  </div>
              </div>
            ))
          }
        </div>
      </main>
    </div>
  )
      }
