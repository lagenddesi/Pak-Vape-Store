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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  async function fetchData() {
    setLoading(true);
    const { data: p } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: b } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
    const { data: s } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (p) setProducts(p);
    if (b) setBanners(b);
    if (s) setSettings(s);
    setTimeout(() => setLoading(false), 1200);
  }

  const filtered = products.filter(p => {
    const matchesCategory = activeCategory === "All" || (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());
    const searchTerm = search.toLowerCase().trim();
    const matchesSearch = p.name.toLowerCase().includes(searchTerm) || 
                          (p.category && p.category.toLowerCase().includes(searchTerm));
    return matchesCategory && matchesSearch;
  });

  const SkeletonCard = () => (
    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden p-4">
      <div className="aspect-square skeleton rounded-lg mb-4" />
      <div className="h-2 w-1/3 skeleton rounded mb-2" />
      <div className="h-10 w-full skeleton rounded-lg" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030712] font-sans text-slate-200">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase cursor-pointer" onClick={() => window.location.href='/'}>
            PAK VAPE STORE
          </h1>
          <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <Link href="/about" className="hover:text-purple-400 transition">About</Link>
             <Link href="/track-order" className="hover:text-purple-400 transition">Track</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6 pb-20">
        
        {/* --- BANNER SLIDER --- */}
        {banners.length > 0 && (
          <div className="relative h-44 md:h-96 rounded-[2rem] overflow-hidden mb-10 border border-white/5 group shadow-2xl">
             {banners.map((b, i) => (
               <Link key={b.id} href={b.link_url || '#'}>
                 <img 
                   src={b.image_url} 
                   className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentBanner ? 'opacity-100' : 'opacity-0'}`} 
                   alt="Promotion"
                 />
               </Link>
             ))}
          </div>
        )}

        {/* --- SEARCH --- */}
        <div className="mb-10 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            placeholder="Search Disposable, E-liquids, Pods..." 
            className="w-full bg-white/5 border border-white/10 p-3 pl-12 rounded-xl text-xs outline-none focus:ring-1 ring-purple-500" 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        {/* --- CATEGORIES --- */}
        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar justify-start md:justify-center">
          {["All", "Disposable", "E-liquids", "Pods / Mods", "Accessories"].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition border ${activeCategory === cat ? 'bg-white text-black' : 'glass text-slate-500'}`}>{cat}</button>
          ))}
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loading ? [1,2,3,4,5,6,7,8].map((i) => <SkeletonCard key={i} />) : 
            filtered.map(p => (
              <div key={p.id} className="glass rounded-xl border border-white/5 overflow-hidden transition-all relative group">
                  {p.old_price && p.old_price > p.price && (
                    <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg">SALE</div>
                  )}
                  <div className={`absolute top-2 left-2 z-10 px-2.5 py-1 rounded-lg text-[8px] font-black border bg-black/80 text-green-400 border-green-500/30`}>
                    {p.stock_quantity > 0 ? `STOCK: ${p.stock_quantity}` : 'SOLD OUT'}
                  </div>
                  <div className="aspect-square bg-slate-900 overflow-hidden">
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt={p.name} />
                  </div>
                  <div className="p-4">
                    <p className="text-[8px] text-purple-500 font-black uppercase mb-1">{p.category}</p>
                    <h3 className="font-bold text-[11px] truncate text-slate-200 mb-3 uppercase tracking-tight">{p.name}</h3>
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

        {/* --- MULTI-CITY SEO SECTION (Service Areas) --- */}
        <section className="mt-24 py-12 border-t border-white/5">
          <div className="text-center mb-10">
            <h2 className="text-xl font-black italic text-purple-500 uppercase tracking-tighter">Service Areas</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Fastest Vape Delivery in Your City</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              "Islampura Jabbar", "Smote", "Bewal", "Kallar Sayyeda", 
              "Sir Suba Shah", "Dina", "Sohawa", "Habib Chowk", 
              "Chowk Pandori", "Jhelum", "Rawalpindi", "Gujar Khan"
            ].map((city) => (
              <span key={city} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-400 hover:border-purple-500/30 transition-all cursor-default">
                {city}
              </span>
            ))}
          </div>
          <p className="text-center text-[9px] text-slate-600 mt-10 uppercase tracking-[0.2em] leading-loose max-w-2xl mx-auto">
            Pak Vape Store provides authentic vape kits, pods, mods, e-liquids and accessories with cash on delivery across Gujar Khan, Jhelum, Rawalpindi and all surrounding towns.
          </p>
        </section>

      </main>

      {/* --- PROFESSIONAL FOOTER --- */}
      <footer className="mt-10 border-t border-white/5 bg-slate-950/50 pb-10">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic text-purple-500 tracking-tighter">PAK VAPE STORE</h2>
            <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-widest">
              Official Aryaan Vape Shop. Serving Islampura Jabbar, Gujar Khan and nearby cities with premium authentic products.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link href={settings?.instagram_url || "#"} className="p-3 bg-white/5 rounded-full hover:text-purple-400 transition shadow-lg"><Instagram size={20}/></Link>
              <Link href={settings?.facebook_url || "#"} className="p-3 bg-white/5 rounded-full hover:text-purple-400 transition shadow-lg"><Facebook size={20}/></Link>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Menu</h3>
            <ul className="space-y-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">
              <li><Link href="/about" className="hover:text-purple-400 transition">Our Story</Link></li>
              <li><Link href="/track-order" className="hover:text-purple-400 transition">Track Your Order</Link></li>
              <li><Link href="/" className="hover:text-purple-400 transition">Latest Inventory</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Contact Info</h3>
            <div className="space-y-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">
               <div className="flex gap-3 justify-center md:justify-start">
                  <MapPin size={18} className="text-purple-500 shrink-0"/>
                  <p className="leading-relaxed text-slate-400">Shop 7, Ithad Plaza, Islampura Jabbar, Tehsil Gujar Khan, District Rawalpindi</p>
               </div>
               <div className="flex gap-3 justify-center md:justify-start">
                  <Clock size={16} className="text-purple-500 shrink-0"/><p className="text-slate-400">11:00 AM - 10:00 PM</p>
               </div>
            </div>
            <Link href={`https://wa.me/${settings?.whatsapp_number}`} className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition">
               <MessageCircle size={18}/> Contact Support
            </Link>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Reliability</h3>
            <div className="space-y-3">
               <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 justify-center md:justify-start">
                  <ShieldCheck size={18} className="text-green-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">100% Authentic Products</span>
               </div>
               <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 justify-center md:justify-start">
                  <Truck size={18} className="text-purple-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Cash On Delivery</span>
               </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 text-center px-4">
           <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.5em]">Pak Vape Store &copy; 2026 | Professional Vaping Solutions</p>
        </div>
      </footer>
    </div>
  );
             }
