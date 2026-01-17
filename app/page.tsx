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
      {/* Premium Navbar - Admin Button Removed */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase">
            PAK VAPE STORE
          </h1>
          
          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              placeholder="Search premium flavors..." 
              className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-2xl text-xs outline-none focus:ring-1 ring-purple-500/50 transition-all"
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>

          <div className="flex items-center gap-6">
             <Link href="/about" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-400 transition">About</Link>
             <Link href="/track-order" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-400 transition">Track Order</Link>
          </div>
        </div>
        {/* Mobile Search */}
        <div className="mt-4 relative md:hidden">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            placeholder="Search..." 
            className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-2xl text-xs outline-none"
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="relative h-44 md:h-80 rounded-[3rem] overflow-hidden mb-12 bg-gradient-to-br from-purple-900/20 to-slate-900 border border-white/5 flex items-center px-10 shadow-2xl">
           <div className="relative z-10">
              <p className="text-purple-500 text-[9px] font-black uppercase tracking-[0.4em] mb-3">Official Aryaan Vape Shop</p>
              <h2 className="text-3xl md:text-6xl font-black mb-6 italic tracking-tighter uppercase leading-none">Vaping<br/>Redefined.</h2>
              <p className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-2">
                <MapPin size={10} className="text-purple-500"/> Gujar Khan, Pakistan
              </p>
           </div>
           <div className="absolute right-0 top-0 w-1/2 h-full bg-purple-500/5 blur-[100px] rounded-full" />
        </div>

        {/* Categories Bar */}
        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar justify-start md:justify-center">
          {["All", "Pods", "E-liquids", "Devices", "Accessories"].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-white text-black border-white shadow-xl scale-105' : 'glass text-slate-500 hover:border-white/20'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
          {loading ? (
            Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            filtered.map(p => (
              <div key={p.id} className="group">
                <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-700 hover:border-purple-500/30 shadow-xl">
                  <div className="aspect-square relative overflow-hidden bg-slate-900">
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt={p.name} />
                    {/* Stock Tag */}
                    <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[8px] font-black border backdrop-blur-md ${p.stock_quantity > 0 ? 'bg-green-500/10 text-green-500 border-green-500/10' : 'bg-red-500/10 text-red-500 border-red-500/10'}`}>
                      {p.stock_quantity > 0 ? `• ${p.stock_quantity} IN STOCK` : 'OUT OF STOCK'}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[9px] text-purple-500 font-black uppercase tracking-widest mb-1">{p.category}</p>
                    <h3 className="font-bold text-xs truncate text-slate-200 mb-4">{p.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-black text-lg tracking-tighter">Rs.{p.price}</p>
                      <Link href={'/product/' + p.id} className="bg-white text-black p-2 rounded-full hover:bg-purple-500 hover:text-white transition-all">
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-40 glass rounded-[4rem]">
             <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">No Items Found</p>
          </div>
        )}
      </main>

      <footer className="mt-40 p-20 glass border-t border-white/5 text-center">
         <p className="text-slate-800 text-[9px] font-bold uppercase tracking-[0.8em] italic">Pak Vape Store &copy; 2026</p>
      </footer>
    </div>
  )
      }
