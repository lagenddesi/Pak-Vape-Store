"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, MapPin, Loader2, Filter } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  const filtered = products.filter(p => 
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white">
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/5 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <h1 className="text-xl font-black text-purple-500 italic">PAK VAPE STORE</h1>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
            <Link href="/about" className="hover:text-purple-400">About Us</Link>
            <Link href="/track-order" className="hover:text-purple-400">Track Order</Link>
          </div>
          <div className="relative w-full md:w-64">
            <input 
              placeholder="Search flavors..." 
              className="w-full bg-white/5 border border-white/10 p-2 rounded-full text-xs px-4 outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 justify-center no-scrollbar">
          {["All", "Pods", "Drops / Liquids", "Devices"].map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase transition ${category === cat ? 'bg-purple-600' : 'bg-white/5 border border-white/10'}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-500" /></div> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative group">
                {/* Stock Tag */}
                <div className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[8px] font-bold border ${p.stock_quantity > 0 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                   {p.stock_quantity > 0 ? `${p.stock_quantity} IN STOCK` : 'OUT OF STOCK'}
                </div>
                <img src={p.images[0]} className="w-full aspect-square object-cover group-hover:scale-105 transition duration-500" />
                <div className="p-4">
                  <h3 className="font-bold text-xs truncate uppercase">{p.name}</h3>
                  <p className="text-purple-500 font-black text-sm mt-1">Rs. {p.price}</p>
                  <Link href={'/product/' + p.id} className="block w-full mt-3 bg-white text-black py-2 rounded-xl text-[10px] font-bold text-center">VIEW DETAILS</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
