"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, MapPin, ShoppingBag, ChevronRight } from 'lucide-react'
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
    setTimeout(() => setLoading(false), 800) // 0.8s wait for smooth feel
  }

  const filtered = products.filter(p => 
    (activeCategory === "All" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  )

  // Daraz Style Skeleton Card
  const SkeletonCard = () => (
    <div className="bg-white/5 rounded-[2rem] border border-white/5 overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-2 w-1/2 skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-3 w-1/3 skeleton rounded" />
        <div className="h-10 w-full skeleton rounded-xl" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 italic">
            PAK VAPE STORE
          </h1>
          
          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              placeholder="Search premium flavors..." 
              className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-2xl text-xs outline-none focus:border-purple-500/50 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-5">
             <Link href="/track-order" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-purple-400 transition">Track</Link>
             <Link href="/admin/login" className="bg-white/5 p-2 rounded-full border border-white/10"><ShoppingBag size={18} className="text-purple-400"/></Link>
          </div>
        </div>
        {/* Mobile Search */}
        <div className="mt-3 relative md:hidden">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            placeholder="Search..." 
            className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-2xl text-xs outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Banner */}
        <div className="relative h-48 md:h-80 rounded-[3rem] overflow-hidden mb-12 bg-gradient-to-br from-purple-900/20 to-slate-900 border border-white/5 flex items-center px-8 md:px-20">
           <div className="relative z-10 max-w-lg">
              <span className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Official Aryaan Vape Shop</span>
              <h2 className="text-3xl md:text-6xl font-black leading-none mb-6 italic tracking-tighter">PREMIUM<br/>VAPE STORE.</h2>
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <MapPin size={12} className="text-purple-500" /> Ithad Plaza, Gujar Khan
              </div>
           </div>
           <div className="absolute right-0 top-0 w-1/2 h-full bg-purple-500/10 blur-[120px] rounded-full" />
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
            // Display 8 Skeletons while loading
            Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            filtered.map(p => (
              <div key={p.id} className="group relative">
                <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-purple-500/30 transition-all duration-700 shadow-2xl">
                  {/* Stock Tag */}
                  <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[8px] font-black border backdrop-blur-md ${p.stock_quantity > 0 ? 'bg-green-500/10 text-green-500 border-green-500/10' : 'bg-red-500/10 text-red-500 border-red-500/10'}`}>
                    {p.stock_quantity > 0 ? `• ${p.stock_quantity} IN STOCK` : 'OUT OF STOCK'}
                  </div>
                  
                  <div className="aspect-square overflow-hidden bg-slate-900 relative">
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt={p.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  <div className="p-6">
                    <p className="text-[9px] text-purple-500 font-black uppercase mb-1 tracking-widest">{p.category}</p>
                    <h3 className="font-bold text-sm truncate text-slate-100 mb-2">{p.name}</h3>
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
         <p className="text-slate-700 text-[10px] font-bold uppercase tracking-[0.8em]">Pak Vape Store &copy; 2026</p>
      </footer>
    </div>
  )
                }
