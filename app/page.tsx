"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, ShoppingCart, MapPin } from 'lucide-react'

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [showAgeGate, setShowAgeGate] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
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

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  if (showAgeGate) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-purple-500/50 shadow-2xl">
          <h1 className="text-3xl font-black text-purple-500 mb-4 italic">PAK VAPE STORE</h1>
          <p className="text-slate-400 mb-8">You must be 18 years or older to enter this site.</p>
          <div className="flex flex-col gap-4">
            <button onClick={verifyAge} className="bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold">I AM 18+</button>
            <button onClick={() => window.location.href="https://google.com"} className="text-slate-500 underline">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-black text-purple-500 italic">PAK VAPE STORE</h1>
          <input 
            placeholder="Search products..." 
            className="w-full md:w-80 bg-white/5 border border-white/10 p-2 rounded-full text-sm px-4 outline-none focus:ring-1 ring-purple-500"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black mb-2">Premium Vapes & Drops</h2>
          <p className="text-slate-400 text-sm italic">Aryaan Vape Shop - Shop 7, Ithad Plaza, Gujar Khan</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <img src={p.images[0]} className="w-full aspect-square object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-sm truncate">{p.name}</h3>
                <p className="text-purple-500 font-black text-sm mt-1">Rs. {p.price}</p>
                <button className="w-full mt-3 bg-white text-black py-2 rounded-lg text-xs font-bold hover:bg-purple-500 hover:text-white transition">VIEW DETAILS</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
