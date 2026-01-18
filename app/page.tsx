"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, ChevronRight, Loader2, MapPin, Phone, Clock, ShieldCheck, Truck, Instagram, Facebook } from 'lucide-react'
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
    const matchesCategory = activeCategory === "All" || 
      (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());
    const searchTerm = search.toLowerCase().trim();
    const matchesSearch = p.name.toLowerCase().includes(searchTerm) || 
                          (p.category && p.category.toLowerCase().includes(searchTerm));
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
    <div className="min-h-screen bg-[#030712] font-sans text-slate-200">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase">PAK VAPE STORE</h1>
          <div className="flex gap-4 text-[10px] font-black uppercase text-slate-400">
             <Link href="/about" className="hover:text-purple-400">About</Link>
             <Link href="/track-order" className="hover:text-purple-400">Track</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* --- BANNER SLIDER --- */}
        {banners.length > 0 && (
          <div className="relative h-44 md:h-96 rounded-[2rem] overflow-hidden mb-10 border border-white/5 group shadow-2xl">
             {banners.map((b, i) => (
               <Link key={b.id} href={b.link_url || '#'}>
                 <img src={b.image_url} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentBanner ? 'opacity-100' : 'opacity-0'}`} />
               </Link>
             ))}
          </div>
        )}

        {/* --- SEARCH --- */}
        <div className="mb-10 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input placeholder="Search Disposable, E-liquids..." className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-xl text-xs outline-none focus:ring-1 ring-purple-500" onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* --- CATEGORIES --- */}
        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar justify-start md:justify-center">
          {["All", "Disposable", "E-liquids", "Pods / Mods", "Accessories"].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition border ${activeCategory === cat ? 'bg-white text-black' : 'glass text-slate-500'}`}>{cat}</button>
          ))}
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pb-20">
          {loading ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />) : 
            filtered.map(p => (
              <div key={p.id} className="glass rounded-xl border border-white/5 overflow-hidden transition-all relative group">
                  {p.old_price && p.old_price > p.price && (
                    <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-lg">SALE</div>
                  )}
                  <div className={`absolute top-2 left-2 z-10 px-2.5 py-1 rounded-lg text-[8px] font-black border backdrop-blur-xl ${p.stock_quantity > 0 ? 'bg-black/80 text-green-400 border-green-500/30' : 'bg-black/90 text-red-500 border-red-500/30'}`}>
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
                      <Link href={'/product/' + p.id} className="bg-white text-black p-2 rounded-lg hover:bg-purple-600 hover:text-white transition-all shadow-xl"><ChevronRight size={14}/></Link>
                    </div>
                  </div>
              </div>
            ))
          }
        </div>
      </main>

      {/* --- PROFESSIONAL FOOTER --- */}
      <footer className="mt-20 border-t border-white/5 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Column 1: Store Branding */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic text-purple-500 tracking-tighter">PAK VAPE STORE</h2>
            <p className="text-xs text-slate-400 leading-relaxed uppercase tracking-wider">
              Aryaan Vape Shop Gujar Khan. Premium quality vapes, pods, and accessories at your doorstep.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:text-purple-400 transition"><Instagram size={18}/></Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:text-purple-400 transition"><Facebook size={18}/></Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Information</h3>
            <ul className="space-y-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
              <li><Link href="/about" className="hover:text-purple-500 transition">About Our Store</Link></li>
              <li><Link href="/track-order" className="hover:text-purple-500 transition">Track Your Order</Link></li>
              <li><Link href="/" className="hover:text-purple-500 transition">All Products</Link></li>
              <li><Link href="/admin" className="hover:text-slate-200 transition">Staff Login</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact & Address */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Contact Us</h3>
            <div className="space-y-4 text-xs text-slate-400">
               <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-purple-500 shrink-0" />
                  <p>Shop 7, Ithad Plaza, Islam Pora Jabbar, Gujar Khan</p>
               </div>
               <div className="flex items-center gap-3">
                  <Phone size={16} className="text-purple-500 shrink-0" />
                  <p>WhatsApp Support Available</p>
               </div>
               <div className="flex items-center gap-3">
                  <Clock size={16} className="text-purple-500 shrink-0" />
                  <p>Mon - Sat: 11:00 AM - 10:00 PM</p>
               </div>
            </div>
          </div>

          {/* Column 4: Trust Badges */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Reliability</h3>
            <div className="space-y-3">
               <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                  <ShieldCheck size={16} className="text-green-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">100% Authentic Products</span>
               </div>
               <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                  <Truck size={16} className="text-purple-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Cash on Delivery</span>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 p-8 text-center">
           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.5em]">
             Pak Vape Store &copy; 2026 | All Rights Reserved
           </p>
        </div>
      </footer>
    </div>
  )
        }
