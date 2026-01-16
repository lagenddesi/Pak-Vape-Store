"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, MapPin, Loader2 } from 'lucide-react'

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [showAgeGate, setShowAgeGate] = useState(true)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isVerified = localStorage.getItem('age-verified')
    if (isVerified) setShowAgeGate(false)
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  const verifyAge = () => {
    localStorage.setItem('age-verified', 'true')
    setShowAgeGate(false)
  }

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  // Age Verification Screen
  if (showAgeGate) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-purple-500/50 shadow-2xl">
          <h1 className="text-3xl font-black text-purple-500 mb-4 italic">PAK VAPE STORE</h1>
          <p className="text-slate-400 mb-8">You must be 18 years or older to enter this site.</p>
          <div className="flex flex-col gap-4">
            <button onClick={verifyAge} className="bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold transition-all">I AM 18+ (ENTER)</button>
            <button onClick={() => window.location.href="https://google.com"} className="text-slate-500 underline text-sm">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-black text-purple-500 italic tracking-tighter cursor-pointer" onClick={() => window.location.href='/'}>
            PAK VAPE STORE
          </h1>
          <div className="relative w-full md:w-80">
             <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
             <input 
              placeholder="Search vapes, drops..." 
              className="w-full bg-white/5 border border-white/10 p-2 pl-10 rounded-full text-sm outline-none focus:ring-1 ring-purple-500"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center py-10">
          <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">Premium Vapes & Drops</h2>
          <div className="flex flex-col items-center gap-2">
            <p className="text-slate-400 text-sm italic flex items-center gap-1">
              <MapPin className="w-3 h-3 text-purple-500" /> Aryaan Vape Shop - Gujar Khan
            </p>
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em]">Shop 7, Ithad Plaza, Islam Pora Jabbar</p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(p => (
            <div key={p.id} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all group">
              <div className="aspect-square bg-slate-800 overflow-hidden relative">
                <img 
                  src={p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/300'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={p.name} 
                />
                {p.stock_quantity <= 0 && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-red-500 font-black text-xs border-2 border-red-500 px-2 py-1 rotate-12">SOLD OUT</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm md:text-base truncate uppercase">{p.name}</h3>
                <p className="text-purple-500 font-black text-base mt-1">Rs. {p.price}</p>
                
                {/* FIXED BUTTON LINK */}
                <button 
                  onClick={() => window.location.href = '/product/' + p.id}
                  disabled={p.stock_quantity <= 0}
                  className="w-full mt-4 bg-white text-black py-2.5 rounded-xl text-xs font-black hover:bg-purple-600 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
                >
                  VIEW DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500">No products found matching "{search}"</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 p-10 text-center">
        <p className="text-slate-600 text-[10px] uppercase tracking-widest leading-loose">
          Pak Vape Store &copy; 2026<br/>
          Gujar Khan, Rawalpindi, Pakistan
        </p>
      </footer>
    </div>
  )
        }
