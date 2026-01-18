"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, ChevronRight, Loader2, MapPin, Phone, Clock, ShieldCheck, Truck, Instagram, Facebook, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
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
    const { data: s } = await supabase.from('settings').select('*').eq('id', 1).single()
    if (p) setProducts(p)
    if (b) setBanners(b)
    if (s) setSettings(s)
    setTimeout(() => setLoading(false), 1200)
  }

  const filtered = products.filter(p => {
    const matchesCategory = activeCategory === "All" || (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());
    return matchesCategory && p.name.toLowerCase().includes(search.toLowerCase().trim());
  })

  return (
    <div className="min-h-screen bg-[#030712] font-sans text-slate-200">
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-black italic tracking-tighter text-purple-500 uppercase">PAK VAPE STORE</h1>
        <div className="flex gap-4 text-[10px] font-black uppercase text-slate-400">
           <Link href="/about">About</Link>
           <Link href="/track-order">Track</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6 pb-20">
        {banners.length > 0 && (
          <div className="relative h-44 md:h-96 rounded-[2rem] overflow-hidden mb-10 border border-white/5 shadow-2xl">
             {banners.map((b, i) => (
               <Link key={b.id} href={b.link_url || '#'}>
                 <img src={b.image_url} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentBanner ? 'opacity-100' : 'opacity-0'}`} />
               </Link>
             ))}
          </div>
        )}

        <div className="mb-10 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input placeholder="Search Disposable, E-liquids..." className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-xl text-xs outline-none focus:ring-1 ring-purple-500" onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar justify-start md:justify-center">
          {["All", "Disposable", "E-liquids", "Pods / Mods", "Accessories"].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition border ${activeCategory === cat ? 'bg-white text-black' : 'glass text-slate-500'}`}>{cat}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loading ? <div className="text-center col-span-full py-20 text-slate-600 font-black animate-pulse uppercase tracking-widest">Refreshing Inventory...</div> : 
            filtered.map(p => (
              <div key={p.id} className="glass rounded-xl border border-white/5 overflow-hidden transition-all relative group">
                  {p.old_price && p.old_price > p.price && (
                    <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-lg">SALE</div>
                  )}
                  <div className={`absolute top-2 left-2 z-10 px-2.5 py-1 rounded-lg text-[8px] font-black border bg-black/80 text-green-400 border-green-500/30`}>
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

      <footer className="mt-20 border-t border-white/5 bg-slate-950/50 pb-10">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic text-purple-500">PAK VAPE STORE</h2>
            <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-widest">
              Premium quality vapes and drops in Gujar Khan. Aryaan Vape Shop - Your authentic source for vaping.
            </p>
            <div className="flex gap-4">
              <Link href={settings?.instagram_url || "#"} className="p-3 bg-white/5 rounded-full hover:text-purple-400 transition"><Instagram size={20}/></Link>
              <Link href={settings?.facebook_url || "#"} className="p-3 bg-white/5 rounded-full hover:text-purple-400 transition"><Facebook size={20}/></Link>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Navigation</h3>
            <ul className="space-y-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">
              <li><Link href="/about" className="hover:text-purple-500 transition">About Store</Link></li>
              <li><Link href="/track-order" className="hover:text-purple-500 transition">Track Order</Link></li>
              <li><Link href="/" className="hover:text-purple-500 transition">All Products</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Contact</h3>
            <div className="space-y-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">
               <div className="flex gap-3"><MapPin size={16} className="text-purple-500"/><p>Ithad Plaza, Islam Pora Jabbar</p></div>
               <div className="flex gap-3"><Clock size={16} className="text-purple-500"/><p>11:00 AM - 10:00 PM</p></div>
            </div>
            {/* DYNAMIC WHATSAPP BUTTON */}
            <Link href={`https://wa.me/${settings?.whatsapp_number}`} className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition shadow-lg shadow-green-500/20">
               <MessageCircle size={18}/> Contact Support
            </Link>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Trust</h3>
            <div className="space-y-3">
               <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <ShieldCheck size={18} className="text-green-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Authenticity Guaranteed</span>
               </div>
            </div>
          </div>
        </div>
        <p className="text-center text-[9px] font-bold text-slate-700 uppercase tracking-[0.5em]">Pak Vape Store &copy; 2026</p>
      </footer>
    </div>
  )
           }
