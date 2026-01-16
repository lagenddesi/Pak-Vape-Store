"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, MapPin, Loader2, Filter } from 'lucide-react'
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

  const filtered = products.filter(p => 
    (activeCategory === "All" || p.category === activeCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/5 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex justify-between items-center w-full md:w-auto">
            <h1 className="text-xl font-black text-purple-500 italic">PAK VAPE STORE</h1>
            <div className="md:hidden flex gap-4 text-[10px] font-bold uppercase tracking-tighter">
              <Link href="/about">About</Link>
              <Link href="/track-order">Track</Link>
            </div>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
            <input 
              placeholder="Search flavors, kits..." 
              className="w-full bg-white/5 border border-white/10 p-2 pl-10 rounded-full text-xs outline-none focus:ring-1 ring-purple-500"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
            <Link href="/about" className="hover:text-purple-500">About Us</Link>
            <Link href="/track-order" className="hover:text-purple-500">Track Order</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar justify-start md:justify-center">
          {["All", "Pods", "E-liquids", "Devices", "Accessories"].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition whitespace-nowrap ${activeCategory === cat ? 'bg-purple-600 text-white' : 'bg-white/5 border border-white/10 text-slate-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-500" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(p => (
              <div key={p.id} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden group relative">
                {/* Stock Tag */}
                <div className={`absolute top-2 left-2 z-10 px-2 py-1 rounded-lg text-[8px] font-black border ${p.stock_quantity > 0 ? 'bg-green-500/20 text-green-500 border-green-500/20' : 'bg-red-500/20 text-red-500 border-red-500/20'}`}>
                   {p.stock_quantity > 0 ? `${p.stock_quantity} IN STOCK` : 'OUT OF STOCK'}
                </div>
                
                <div className="aspect-square overflow-hidden bg-slate-900">
                  <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                
                <div className="p-4">
                  <p className="text-[9px] text-purple-500 font-bold uppercase mb-1">{p.category}</p>
                  <h3 className="font-bold text-xs truncate uppercase text-slate-200">{p.name}</h3>
                  <p className="text-white font-black text-sm mt-1 tracking-tight">Rs. {p.price}</p>
                  <Link href={'/product/' + p.id} className="block w-full mt-4 bg-white text-black py-2.5 rounded-xl text-[10px] font-black text-center hover:bg-purple-600 hover:text-white transition-all uppercase">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
