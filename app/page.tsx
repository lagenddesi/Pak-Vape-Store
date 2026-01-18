"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, ChevronRight, Loader2, MapPin, ShoppingBag } from 'lucide-react'
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

  // Auto-slide logic for banners
  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [banners])

  async function fetchData() {
    setLoading(true)
    const { data: p } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    const { data: b } = await supabase.from('banners').select('*').order('created_at', { ascending: false })
    if (p) setProducts(p)
    if (b) setBanners(b)
    // Professional Shimmer Delay
    setTimeout(() => setLoading(false), 1200)
  }

  // Multi-field Smart Search & Filter
  const filtered = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const searchTerm = search.toLowerCase().trim();
    const matchesSearch = p.name.toLowerCase().includes(searchTerm) || 
                          (p.category && p.category.toLowerCase().includes(searchTerm));
    return matchesCategory && matchesSearch;
  })

  // Skeleton Placeholder (Daraz Style)
  const SkeletonCard = () => (
    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden p-4">
      <div className="aspect-square skeleton rounded-lg mb-4" />
      <div className="h-2 w-1/3 skeleton rounded mb-2" />
      <div className="h-4 w-3/4 skeleton rounded mb-4" />
      <div className="h-10 w-full skeleton rounded-lg" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#030712] pb-20 font-sans text-slate-100">
      
      {/* PROFESSIONAL NAVBAR */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase">
            PAK VAPE STORE
          </h1>
          
          <div className="flex items-center gap-6">
             <Link href="/about" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-400 transition">About Us</Link>
             <Link href="/track-order" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-400 transition">Track Order</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* CLICKABLE DYNAMIC BANNERS SLIDER */}
        {banners.length > 0 && (
          <div className="relative h-44 md:h-96 w-full rounded-2xl md:rounded-3xl overflow-hidden mb-10 shadow-2xl border border-white/5 bg-slate-900 group">
             {banners.map((b, i) => (
               <Link key={b.id} href={b.link_url || '#'}>
                 <img 
                  src={b.image_url} 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentBanner ? 'opacity-100' : 'opacity-0'}`} 
                  alt="Promotion Banner"
                 />
               </Link>
             ))}
             {/* Banner Indicators */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all ${i === currentBanner ? 'w-6 bg-white' : 'w-2 bg-white/30'}`} />
                ))}
             </div>
          </div>
        )}

        {/* Fallback Hero if no banners */}
        {banners.length === 0 && !loading && (
          <div className="h-44 rounded-2xl bg-gradient-to-br from-purple-900/20 to-black border border-white/5 mb-10 flex items-center px-10">
             <div>
                <p className="text-purple-500 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Official Aryaan Vape Shop</p>
                <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase">Premium Vapes & Drops</h2>
             </div>
          </div>
        )}

        {/* SEARCH BAR */}
        <div className="mb-10 relative max-w-xl mx-auto group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
          <input 
            placeholder="Search flavor, pod, brand..." 
            className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-xl text-xs outline-none focus:ring-1 ring-purple-500/50 transition-all"
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        {/* CATEGORIES BAR (Must match Admin categories) */}
        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar justify-start md:justify-center">
          {["All", "Pods", "E-liquids", "Pods / Mods", "Accessories"].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-white text-black border-white shadow-xl scale-105' : 'glass text-slate-500 hover:border-white/20'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {loading ? (
            Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            filtered.map(p => (
              <div key={p.id} className="group">
                <div className="glass rounded-xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-purple-500/40 shadow-lg relative h-full flex flex-col">
                  
                  {/* HIGH VISIBILITY STOCK BADGE */}
                  <div className={`absolute top-2 left-2 z-10 px-2.5 py-1 rounded-lg text-[8px] font-black border backdrop-blur-xl shadow-2xl ${p.stock_quantity > 0 ? 'bg-black/80 text-green-400 border-green-500/30' : 'bg-black/90 text-red-500 border-red-500/30'}`}>
                    {p.stock_quantity > 0 ? `STOCK: ${p.stock_quantity}` : 'SOLD OUT'}
                  </div>

                  {/* SALE TAG */}
                  {p.old_price && p.old_price > p.price && (
                    <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-xl animate-pulse">
                      SALE
                    </div>
                  )}
                  
                  {/* IMAGE AREA */}
                  <div className="aspect-square relative overflow-hidden bg-slate-900">
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt={p.name} />
                  </div>
                  
                  {/* TEXT AREA */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[8px] text-purple-500 font-black uppercase tracking-widest mb-1">{p.category}</p>
                      <h3 className="font-bold text-[11px] md:text-sm truncate text-slate-100 mb-3 uppercase tracking-tight">{p.name}</h3>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">
                      <div>
                        <p className="text-white font-black text-sm md:text-base tracking-tighter">Rs.{p.price}</p>
                        {p.old_price && (
                          <p className="text-[9px] text-slate-500 line-through">Rs.{p.old_price}</p>
                        )}
                      </div>
                      <Link 
                        href={'/product/' + p.id} 
                        className="bg-white text-black p-2 rounded-lg hover:bg-purple-600 hover:text-white transition-all shadow-md"
                      >
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-40 glass rounded-3xl border-dashed border-white/10">
             <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">No Items Found In Inventory</p>
             <button onClick={() => {setSearch(""); setActiveCategory("All")}} className="mt-4 text-purple-500 text-[10px] font-bold underline uppercase tracking-widest">Clear Filters</button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-40 p-20 glass border-t border-white/5 text-center">
         <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-slate-500">
               <MapPin size={12} className="text-purple-500" />
               <p className="text-[9px] font-bold uppercase tracking-widest">Shop 7, Ithad Plaza, Gujar Khan</p>
            </div>
            <p className="text-slate-800 text-[9px] font-bold uppercase tracking-[0.8em] italic">Pak Vape Store &copy; 2026</p>
         </div>
      </footer>
    </div>
  )
                          }
