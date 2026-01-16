"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, MapPin, Loader2 } from 'lucide-react'
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
    setLoading(false)
  }

  // SMART SEARCH LOGIC:
  // Yeh Name aur Category dono mein search karega
  const filtered = products.filter(p => {
    const searchTerm = search.toLowerCase().trim();
    const matchesCategoryFilter = activeCategory === "All" || p.category === activeCategory;
    
    const matchesSearchText = 
      p.name.toLowerCase().includes(searchTerm) || 
      p.category.toLowerCase().includes(searchTerm) ||
      (p.description && p.description.toLowerCase().includes(searchTerm));

    return matchesCategoryFilter && matchesSearchText;
  })

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-purple-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/5 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-4">
          <div className="flex justify-between items-center w-full md:w-auto">
            <h1 className="text-xl font-black text-purple-500 italic tracking-tighter uppercase">PAK VAPE STORE</h1>
            <div className="md:hidden flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Link href="/about">About</Link>
              <Link href="/track-order">Track</Link>
            </div>
          </div>
          
          {/* SEARCH BAR */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-3 text-slate-500 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
            <input 
              placeholder="Search pods, flavors, kits..." 
              className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-2xl text-xs outline-none focus:ring-2 ring-purple-500/50 transition-all placeholder:text-slate-600"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            <Link href="/about" className="hover:text-purple-500 transition">About Us</Link>
            <Link href="/track-order" className="hover:text-purple-500 transition">Track Order</Link>
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Categories Bar */}
        <div className="flex gap-3 overflow-x-auto pb-6 mb-10 no-scrollbar justify-start md:justify-center">
          {["All", "Pods", "E-liquids", "Devices", "Accessories"].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20 scale-105' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Loading Inventory</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            {search && (
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-6 tracking-widest">
                Found {filtered.length} results for "{search}"
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {filtered.map(p => (
                <div key={p.id} className="bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden group relative hover:border-purple-500/30 transition-all duration-500">
                  <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[8px] font-black border backdrop-blur-md ${p.stock_quantity > 0 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                    {p.stock_quantity > 0 ? `• ${p.stock_quantity} IN STOCK` : 'OUT OF STOCK'}
                  </div>
                  
                  <div className="aspect-square overflow-hidden bg-slate-900">
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={p.name} />
                  </div>
                  
                  <div className="p-5">
                    <p className="text-[9px] text-purple-500 font-black uppercase mb-1 tracking-widest">{p.category}</p>
                    <h3 className="font-bold text-sm truncate uppercase text-slate-200 tracking-tight">{p.name}</h3>
                    <p className="text-white font-black text-lg mt-1 tracking-tighter">Rs. {p.price}</p>
                    <Link href={'/product/' + p.id} className="block w-full mt-5 bg-white text-black py-3 rounded-2xl text-[11px] font-black text-center hover:bg-purple-600 hover:text-white transition-all uppercase tracking-widest">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem]">
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No products found</p>
                <button onClick={() => {setSearch(""); setActiveCategory("All")}} className="mt-4 text-purple-500 text-[10px] font-bold underline">Clear Search</button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-20 p-12 border-t border-white/5 text-center bg-black/20">
        <div className="flex flex-col items-center gap-4">
           <div className="flex items-center gap-2 text-slate-500">
              <MapPin size={14} className="text-purple-500" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Shop 7, Ithad Plaza, Gujar Khan</p>
           </div>
           <p className="text-slate-700 text-[9px] uppercase tracking-[0.5em]">Pak Vape Store &copy; 2026</p>
        </div>
      </footer>
    </div>
  )
              }
