"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, ChevronRight, Loader2, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => setCurrentBanner((prev) => (prev + 1) % banners.length), 5000)
      return () => clearInterval(timer)
    }
  }, [banners])

  async function fetchData() {
    setLoading(true)
    const { data: p } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    const { data: b } = await supabase.from('banners').select('*').order('created_at', { ascending: false })
    if (p) setProducts(p)
    if (b) setBanners(b)
    setTimeout(() => setLoading(false), 1200)
  }

  const filtered = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase().trim()) || 
                          (p.category && p.category.toLowerCase().includes(search.toLowerCase().trim()));
    return matchesCategory && matchesSearch;
  })

  const SkeletonCard = () => (
    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden p-4">
      <div className="aspect-square skeleton rounded-lg mb-4" />
      <div className="h-2 w-1/3 skeleton rounded mb-2" />
      <div className="h-10 w-full skeleton rounded-lg" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#030712] pb-20 font-sans">
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase">PAK VAPE STORE</h1>
        <div className="flex gap-4 text-[10px] font-black uppercase text-slate-400">
           <Link href="/about">About</Link>
           <Link href="/track-order">Track</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Banner Slider */}
        {banners.length > 0 && (
          <div className="relative h-44 md:h-96 rounded-[2rem] overflow-hidden mb-10 border border-white/5 group shadow-2xl">
             {banners.map((b, i) => (
               <Link key={b.id} href={b.link_url || '#'}>
                 <img src={b.image_url} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentBanner ? 'opacity-100' : 'opacity-0'}`} />
               </Link>
             ))}
          </div>
        )}

        <div className="mb-10 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input placeholder="Search..." className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-xl text-xs outline-none" onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* UPDATED CATEGORY BUTTONS */}
        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar justify-start md:justify-center">
          {["All", "Disposable", "E-liquids", "Pods / Mods", "Accessories"].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition border ${activeCategory === cat ? 'bg-white text-black' : 'glass text-slate-500'}`}>{cat}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loading ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />) : 
            filtered.map(p => (
              <div key={p.id} className="glass rounded-xl border border-white/5 overflow-hidden transition-all relative group">
                  {p.old_price && p.old_price > p.price && (
                    <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-lg">SALE</div>
                  )}
                  <div className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded-lg text-[8px] font-black border bg-black/80 text-green-400 border-green-500/30">
                    {p.stock_quantity > 0 ? `STOCK: ${p.stock_quantity}` : 'OUT OF STOCK'}
                  </div>
                  <div className="aspect-square bg-slate-900 overflow-hidden">
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" />
                  </div>
                  <div className="p-4">
                    <p className="text-[8px] text-purple-500 font-black uppercase mb-1">{p.category}</p>
                    <h3 className="font-bold text-[11px] truncate text-slate-200 mb-3 uppercase">{p.name}</h3>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <div>
                        <p className="text-white font-black text-sm">Rs.{p.price}</p>
                        {p.old_price && <p className="text-[9px] text-slate-500 line-through">Rs.{p.old_price}</p>}
                      </div>
                      <Link href={'/product/' + p.id} className="bg-white text-black p-2 rounded-lg hover:bg-purple-600 hover:text-white transition-all"><ChevronRight size={14}/></Link>
                    </div>
                  </div>
              </div>
            ))
          }
        </div>
      </main>
    </div>
  )
            }
