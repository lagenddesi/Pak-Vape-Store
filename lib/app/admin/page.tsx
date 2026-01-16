"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, ShoppingCart, Info, MapPin } from 'lucide-react'

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [showAgeGate, setShowAgeGate] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  useEffect(() => {
    // Check if age is already verified
    const isVerified = localStorage.getItem('age-verified')
    if (isVerified) setShowAgeGate(false)
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  const verifyAge = () => {
    localStorage.setItem('age-verified', 'true')
    setShowAgeGate(false)
  }

  const filtered = products.filter(p => 
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (showAgeGate) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-purple-500/50 shadow-2xl shadow-purple-500/20">
          <h1 className="text-3xl font-black text-purple-500 mb-4 italic">PAK VAPE STORE</h1>
          <h2 className="text-xl font-bold mb-6 text-white">AGE VERIFICATION</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">This website contains nicotine products. You must be 18 years or older to enter.</p>
          <div className="flex flex-col gap-4">
            <button onClick={verifyAge} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all">I AM 18+ (ENTER)</button>
            <button onClick={() => window.location.href="https://google.com"} className="text-slate-500 hover:text-red-400 transition">EXIT</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0B0E14]/80 backdrop-blur-md border-b border-white/5 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-black text-purple-500 italic tracking-tighter">PAK VAPE STORE</h1>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
            <input 
              placeholder="Search vapes, drops..." 
              className="w-full bg-white/5 border border-white/10 p-2 pl-10 rounded-full text-sm outline-none focus:ring-1 ring-purple-500"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </nav>

      {/* Hero & About Mini */}
      <header className="p-6 md:p-12 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black mb-4">Premium Drops & Vapes</h2>
        <p className="text-slate-400 flex items-center justify-center gap-2 text-sm md:text-base">
          <MapPin className="w-4 h-4 text-purple-500" /> 
          Shop 7, Ithad Plaza, Islam Pora Jabbar, Gujar Khan
        </p>
      </header>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto px-6 mb-8 no-scrollbar justify-center">
        {["All", "Pods", "Drops / Liquids", "Devices"].map((cat) => (
          <button 
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${category === cat ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <main className="px-6 pb-20 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map(p => (
          <div key={p.id} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all group">
            <div className="aspect-square bg-slate-800 overflow-hidden relative">
              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              {p.stock_quantity <= 0 && <div className="absolute inset-0 bg-black/60 flex items-center justify-center font-bold text-red-500">SOLD OUT</div>}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm md:text-base truncate">{p.name}</h3>
              <p className="text-purple-500 font-black mt-1">Rs. {p.price}</p>
              <button 
                onClick={() => window.location.href=`/product/${p.id}`}
                disabled={p.stock_quantity <= 0}
                className="w-full mt-4 bg-white text-black py-2 rounded-xl text-xs md:text-sm font-bold hover:bg-purple-500 hover:text-white transition-colors disabled:opacity-50"
              >
                VIEW DETAILS
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Mobile Footer Shop Info */}
      <footer className="bg-black/50 p-8 border-t border-white/5 text-center text-slate-500 text-xs">
        <p className="font-bold text-slate-300 mb-2 underline decoration-purple-500">PAK VAPE STORE (Aryaan Vape Shop)</p>
        <p>Ithad Plaza, Islam Pora Jabbar, Tehsil Gujar Khan, District Rawalpindi</p>
      </footer>
    </div>
  )
            }
