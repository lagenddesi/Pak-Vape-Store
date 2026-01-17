"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, MapPin, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [loading, setLoading] = useState(true)

  useEffect(() => { 
    fetchProducts() 
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setTimeout(() => setLoading(false), 1000)
  }

  const filtered = products.filter(p => 
    (activeCategory === "All" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || (p.category && p.category.toLowerCase().includes(search.toLowerCase())))
  )

  const SkeletonCard = () => (
    <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden p-4">
      <div className="aspect-square skeleton rounded-[2rem] mb-4" />
      <div className="h-3 w-1/2 skeleton rounded mb-2" />
      <div className="h-5 w-3/4 skeleton rounded mb-4" />
      <div className="h-10 w-full skeleton rounded-2xl" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#030712]">
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase">
            PAK VAPE STORE
          </h1>
          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input placeholder="Search..." className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-2xl text-xs outline-none" onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-6">
             <Link href="/about" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-400 transition">About</Link>
             <Link href="/track-order" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-400 transition">Track</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar justify-start md:justify-center">
          {["All", "Pods", "E-liquids", "Devices", "Accessories"].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-white text-black border-white shadow-xl' : 'glass text-slate-500 hover:border-white/20'}`}>{cat}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
          {loading ? (
            Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            filtered.map(p => (
              <div key={p.id} className="group">
                <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-700 hover:border-purple-500/30">
                  <div className="aspect-square relative overflow-hidden bg-slate-900">
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt={p.name} />
                  </div>
                  <div className="p-6">
                    <p className="text-[9px] text-purple-500 font-black uppercase mb-1">{p.category}</p>
                    <h3 className="font-bold text-xs truncate text-slate-200 mb-4">{p.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-black text-lg tracking-tighter">Rs.{p.price}</p>
                      <Link href={'/product/' + p.id} className="bg-white text-black p-2 rounded-full hover:bg-purple-600 hover:text-white transition-all"><ChevronRight size={18} /></Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
      }
