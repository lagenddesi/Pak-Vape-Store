"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, MapPin, Loader2 } from 'lucide-react'
import Link from 'next/link' // <--- Naya Import

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
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  const verifyAge = () => {
    localStorage.setItem('age-verified', 'true')
    setShowAgeGate(false)
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  if (showAgeGate) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-purple-500/50 shadow-2xl">
          <h1 className="text-3xl font-black text-purple-500 mb-4 italic">PAK VAPE STORE</h1>
          <p className="text-slate-400 mb-8 font-bold text-sm">AGE VERIFICATION: 18+ ONLY</p>
          <button onClick={verifyAge} className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold transition-all">ENTER STORE</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white">
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <h1 className="text-xl font-black text-purple-500 italic">PAK VAPE STORE</h1>
          <div className="relative flex-1 max-w-xs">
             <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
             <input placeholder="Search..." className="w-full bg-white/5 border border-white/10 p-2 pl-10 rounded-full text-xs outline-none" onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black mb-2 uppercase italic">Vapes & Drops</h2>
          <p className="text-slate-500 text-[10px] italic">Aryaan Vape Shop Gujar Khan</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-500" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden group">
                <img src={p.images[0]} className="w-full aspect-square object-cover group-hover:scale-105 transition duration-500" />
                <div className="p-4">
                  <h3 className="font-bold text-sm truncate uppercase">{p.name}</h3>
                  <p className="text-purple-500 font-black text-sm mt-1">Rs. {p.price}</p>
                  
                  {/* NEXT.JS LINK FOR BETTER ROUTING */}
                  <Link 
                    href={`/product/${p.id}`}
                    className="block w-full mt-4 bg-white text-black py-2.5 rounded-xl text-xs font-black text-center hover:bg-purple-600 hover:text-white transition-all"
                  >
                    VIEW DETAILS
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
