"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, MapPin, ChevronRight, Loader2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProducts() }, [])

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
      <div className="h-10 w-full skeleton rounded-2xl" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#030712] pb-20">
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase">PAK VAPE STORE</h1>
          <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link href="/about">About Us</Link>
            <Link href="/track-order">Track</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar justify-start md:justify-center">
          {["All", "Pods", "E-liquids", "Devices", "Accessories"].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-white text-black border-white shadow-xl scale-105' : 'glass text-slate-500 hover:border-white/20'}`}>{cat}</button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {loading ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />) : 
            filtered.map(p => (
              <div key={p.id} className="group">
                <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-700 hover:border-purple-500/30">
                  <div className="aspect-square relative overflow-hidden bg-slate-900">
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt={p.name} />
                    
                    {/* NEW HIGH-VISIBILITY STOCK BADGE */}
                    <div className={`absolute top-3 left-3 z-10 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter border shadow-2xl backdrop-blur-xl ${p.stock_quantity > 0 ? 'bg-black/80 text-green-400 border-green-500/50' : 'bg-black/90 text-red-500 border-red-500/50'}`}>
                      {p.stock_quantity > 0 ? `Stock: ${p.stock_quantity}` : 'Sold Out'}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[9px] text-purple-500 font-black uppercase mb-1">{p.category}</p>
                    <h3 className="font-bold text-xs truncate text-slate-200 mb-4">{p.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-black text-lg tracking-tighter">Rs.{p.price}</p>
                      <Link href={'/product/' + p.id} className="bg-white text-black p-2 rounded-full hover:bg-purple-600 hover:text-white transition-all"><ChevronRight size={18}/></Link>
                    </div>
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
