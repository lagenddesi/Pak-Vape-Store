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

  useEffect(() => { 
    fetchProducts() 
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setTimeout(() => setLoading(false), 1200)
  }

  const filtered = products.filter(p => 
    (activeCategory === "All" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || (p.category && p.category.toLowerCase().includes(search.toLowerCase())))
  )

  // Skeleton Card with reduced rounding
  const SkeletonCard = () => (
    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden p-4">
      <div className="aspect-square skeleton rounded-lg mb-4" />
      <div className="h-3 w-1/2 skeleton rounded mb-2" />
      <div className="h-10 w-full skeleton rounded-lg" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#030712] pb-20 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase">
            PAK VAPE STORE
          </h1>
          <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link href="/about" className="hover:text-purple-400 transition">About</Link>
            <Link href="/track-order" className="hover:text-purple-400 transition">Track</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {/* Search Bar Container */}
        <div className="mb-10 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            placeholder="Search products, brands, flavors..." 
            className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-xl text-xs outline-none focus:ring-1 ring-purple-500/50 transition-all"
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        {/* Categories Bar */}
        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar justify-start md:justify-center">
          {["All", "Pods", "E-liquids", "Devices", "Accessories"].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-white text-black border-white shadow-xl' : 'glass text-slate-500 hover:border-white/20'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            filtered.map(p => (
              <div key={p.id} className="group">
                {/* Updated rounded-xl for less rounding */}
                <div className="glass rounded-xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-purple-500/40 shadow-lg">
                  <div className="aspect-square relative overflow-hidden bg-slate-900">
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt={p.name} />
                    
                    {/* Floating Stock Badge */}
                    <div className={`absolute top-2 left-2 z-10 px-2.5 py-1 rounded-lg text-[8px] font-black border backdrop-blur-xl shadow-2xl ${p.stock_quantity > 0 ? 'bg-black/80 text-green-400 border-green-500/30' : 'bg-black/90 text-red-500 border-red-500/30'}`}>
                      {p.stock_quantity > 0 ? `STOCK: ${p.stock_quantity}` : 'OUT OF STOCK'}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-[8px] text-purple-500 font-black uppercase tracking-widest mb-1">{p.category}</p>
                    <h3 className="font-bold text-[11px] md:text-sm truncate text-slate-100 mb-3 uppercase tracking-tight">{p.name}</h3>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <p className="text-white font-black text-sm md:text-base tracking-tighter italic">Rs.{p.price}</p>
                      <Link href={'/product/' + p.id} className="bg-white text-black p-2 rounded-lg hover:bg-purple-600 hover:text-white transition-all">
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-40 glass rounded-3xl">
             <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">No Products Found</p>
          </div>
        )}
      </main>

      <footer className="mt-40 p-20 glass border-t border-white/5 text-center">
         <p className="text-slate-800 text-[9px] font-bold uppercase tracking-[0.8em] italic">Pak Vape Store &copy; 2026</p>
      </footer>
    </div>
  )
        }
