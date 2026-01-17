"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { ArrowLeft, MessageSquare, Loader2, Plus, Minus, ShieldCheck, Truck, Star, Send } from 'lucide-react'

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [whatsapp, setWhatsapp] = useState("")
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [selectedFlavor, setSelectedFlavor] = useState("")
  const [isOrdering, setIsOrdering] = useState(false)

  // Review State
  const [reviews, setReviews] = useState<any[]>([])
  const [revName, setRevName] = useState("")
  const [revRating, setRevRating] = useState(5)
  const [revComment, setRevComment] = useState("")

  // Form State
  const [form, setForm] = useState({ name: '', phone: '', address: '', tehsil: '', city: '' })

  useEffect(() => {
    async function fetchData() {
      const { data: p } = await supabase.from('products').select('*').eq('id', params.id).single()
      const { data: s } = await supabase.from('settings').select('whatsapp_number').eq('id', 1).single()
      if (p) setProduct(p)
      if (s) setWhatsapp(s.whatsapp_number)
      
      const { data: r } = await supabase.from('reviews').select('*').eq('product_id', params.id).order('created_at', { ascending: false })
      if (r) setReviews(r)
      
      setLoading(false)
    }
    fetchData()
  }, [params.id])

  const totalPrice = product ? product.price * qty : 0

  // SEO Rich Snippets (Google Search Results ke liye)
  const jsonLd = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description || `Buy ${product.name} at Pak Vape Store.`,
    "brand": {
      "@type": "Brand",
      "name": "Pak Vape Store"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://pak-vape-store-pods.vercel.app/product/${product.id}`,
      "priceCurrency": "PKR",
      "price": product.price,
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": reviews.length > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1),
      "reviewCount": reviews.length
    } : undefined
  } : null;

  async function handleOrder(e: any) {
    e.preventDefault()
    if (product.stock_quantity < qty) return alert("Not enough stock!")
    if (product.flavors?.length > 0 && !selectedFlavor) return alert("Please select a flavor!")
    
    setIsOrdering(true)
    const { data: order, error } = await supabase.from('orders').insert([{
      customer_name: form.name, phone: form.phone, full_address: form.address, 
      tehsil: form.tehsil, city: form.city, district: '-',
      total_amount: totalPrice, status: 'Pending'
    }]).select().single()

    if (!error && order) {
      await supabase.from('order_items').insert([{ 
        order_id: order.id, product_id: product.id, quantity: qty, price_at_time: product.price 
      }])
      
      const flavorTxt = selectedFlavor ? `%0A*Flavor:* ${selectedFlavor}` : ''
      const msg = `*NEW ORDER - PAK VAPE STORE*%0A--------------------------%0A*Item:* ${product.name}${flavorTxt}%0A*Quantity:* ${qty}%0A*Total Price:* Rs. ${totalPrice}%0A--------------------------%0A*Customer:* ${form.name}%0A*Phone:* ${form.phone}%0A*Address:* ${form.address}%0A*City:* ${form.city}, ${form.tehsil}`
      
      window.location.href = `https://wa.me/${whatsapp}?text=${msg}`
    }
    setIsOrdering(false)
  }

  async function submitReview(e: any) {
    e.preventDefault()
    const { error } = await supabase.from('reviews').insert([{
      product_id: params.id, user_name: revName, rating: revRating, comment: revComment
    }])
    if (!error) {
      alert("Review Submitted!"); setRevName(""); setRevComment("");
      const { data } = await supabase.from('reviews').select('*').eq('product_id', params.id).order('created_at', { ascending: false })
      if (data) setReviews(data)
    }
  }

  if (loading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white font-black animate-pulse tracking-[0.3em]">LOADING VAPE STORE...</div>

  if (!product) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">Product Not Found</div>

  return (
    <>
      {/* Google SEO Script */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="min-h-screen bg-[#030712] text-white pb-20 font-sans">
        <div className="max-w-6xl mx-auto p-6">
          <button onClick={() => window.location.href='/'} className="mb-10 flex items-center gap-2 text-slate-500 hover:text-white transition font-black text-[10px] uppercase tracking-widest">
            <ArrowLeft size={14}/> Back to Store
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT AREA: GALLERY & DESCRIPTION */}
            <div className="space-y-8">
              <div className="aspect-square glass rounded-2xl overflow-hidden p-2 shadow-2xl">
                <img src={product.images[0]} className="w-full h-full object-cover rounded-xl" alt={product.name} />
              </div>
              <div className="glass p-8 rounded-2xl space-y-4 shadow-2xl border-white/5">
                <h3 className="text-sm font-black uppercase text-purple-400 tracking-widest border-b border-white/5 pb-2">Description & Specs</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{product.description || "Premium quality product from Pak Vape Store Gujar Khan."}</p>
                <div className="flex gap-4 pt-4 border-t border-white/5">
                   <span className="flex items-center gap-1 text-green-500 text-[9px] font-black uppercase"><ShieldCheck size={12}/> Authentic</span>
                   <span className="flex items-center gap-1 text-purple-500 text-[9px] font-black uppercase"><Truck size={12}/> Cash on Delivery</span>
                </div>
              </div>
            </div>

            {/* RIGHT AREA: DETAILS & FORM */}
            <div className="space-y-8">
              <div>
                <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{product.category}</p>
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-2 leading-none">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <p className="text-3xl font-black text-white">Rs. {product.price}</p>
                  <span className={`px-2 py-1 rounded-md text-[9px] font-black border ${product.stock_quantity > 0 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                    {product.stock_quantity > 0 ? `${product.stock_quantity} IN STOCK` : 'OUT OF STOCK'}
                  </span>
                </div>
              </div>

              {/* Flavor Selector */}
              {product.flavors?.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Flavor</p>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((f: string) => (
                      <button key={f} onClick={() => setSelectedFlavor(f)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedFlavor === f ? 'bg-white text-black border-white scale-105' : 'glass text-slate-400 hover:border-white/30'}`}>{f}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantity</p>
                <div className="flex items-center gap-6 bg-white/5 w-fit p-2 rounded-xl border border-white/5">
                  <button type="button" onClick={() => qty > 1 && setQty(qty - 1)} className="p-2 hover:bg-white/10 rounded-lg"><Minus size={16}/></button>
                  <span className="font-black text-xl w-6 text-center">{qty}</span>
                  <button type="button" onClick={() => qty < product.stock_quantity && setQty(qty + 1)} className="p-2 hover:bg-white/10 rounded-lg"><Plus size={16}/></button>
                </div>
              </div>

              {/* Live Price Total */}
              <div className="p-6 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex justify-between items-center shadow-inner">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                <p className="text-2xl font-black text-white">Rs. {totalPrice}</p>
              </div>

              {/* Order Form */}
              <form onSubmit={handleOrder} className="glass p-8 rounded-2xl space-y-4 shadow-2xl border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 text-center underline">Delivery Details</p>
                <input placeholder="Full Name" className="w-full bg-white/5 p-4 rounded-xl border border-white/5 outline-none focus:ring-1 ring-purple-500 transition" onChange={e=>setForm({...form, name: e.target.value})} required />
                <input placeholder="WhatsApp Number" className="w-full bg-white/5 p-4 rounded-xl border border-white/5 outline-none focus:ring-1 ring-purple-500 transition" onChange={e=>setForm({...form, phone: e.target.value})} required />
                <textarea placeholder="Delivery Address (House #, Street)" className="w-full bg-white/5 p-4 rounded-xl border border-white/5 outline-none focus:ring-1 ring-purple-500 h-20" onChange={e=>setForm({...form, address: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Tehsil" className="bg-white/5 p-4 rounded-xl border border-white/5 outline-none" onChange={e=>setForm({...form, tehsil: e.target.value})} required />
                  <input placeholder="City" className="bg-white/5 p-4 rounded-xl border border-white/5 outline-none" onChange={e=>setForm({...form, city: e.target.value})} required />
                </div>
                <button type="submit" disabled={isOrdering || product.stock_quantity <= 0} className="w-full bg-white text-black py-5 rounded-xl font-black text-lg uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl">
                  {isOrdering ? <Loader2 className="animate-spin"/> : <MessageSquare size={20}/>}
                  {isOrdering ? 'PROCESSING...' : 'PLACE ORDER (COD)'}
                </button>
              </form>
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="mt-32 space-y-12">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase border-b border-white/5 pb-6">Customer Reviews</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Write Review */}
              <form onSubmit={submitReview} className="glass p-8 rounded-2xl space-y-4 h-fit border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Share Your Experience</p>
                <input placeholder="Your Name" className="w-full bg-white/5 p-4 rounded-xl border border-white/5 outline-none" value={revName} onChange={e=>setRevName(e.target.value)} required />
                <div className="flex gap-2 py-2">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={20} className={`cursor-pointer transition-all hover:scale-110 ${star <= revRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} onClick={()=>setRevRating(star)} />
                  ))}
                </div>
                <textarea placeholder="Write something about the flavor or device..." className="w-full bg-white/5 p-4 rounded-xl border border-white/5 outline-none h-24" value={revComment} onChange={e=>setRevComment(e.target.value)} required />
                <button className="bg-purple-600 hover:bg-purple-700 w-full p-4 rounded-xl font-black uppercase text-xs transition-colors">Submit Review</button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
                {reviews.map(r => (
                  <div key={r.id} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-bold text-slate-200">{r.user_name}</p>
                      <div className="flex gap-1">
                        {Array(r.rating).fill(0).map((_, i) => <Star key={i} size={10} className="text-yellow-500 fill-yellow-500" />)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 italic">"{r.comment}"</p>
                    <p className="text-[8px] text-slate-600 mt-4 uppercase font-bold">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-slate-600 italic text-center py-20 uppercase font-black tracking-widest opacity-30">No reviews yet</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
    }
