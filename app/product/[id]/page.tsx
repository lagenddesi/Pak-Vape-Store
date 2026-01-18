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
  const [mainImage, setMainImage] = useState("") // Current displayed image
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
      
      if (p) {
        setProduct(p)
        setMainImage(p.images[0]) // Set first image as main
      }
      if (s) setWhatsapp(s.whatsapp_number)
      
      const { data: r } = await supabase.from('reviews').select('*').eq('product_id', params.id).order('created_at', { ascending: false })
      if (r) setReviews(r)
      
      setLoading(false)
    }
    fetchData()
  }, [params.id])

  const totalPrice = product ? product.price * qty : 0

  // SEO JSON-LD
  const jsonLd = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "brand": { "@type": "Brand", "name": "Pak Vape Store" },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "PKR",
      "price": product.price,
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
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
      const msg = `*NEW ORDER - PAK VAPE STORE*%0A--------------------------%0A*Item:* ${product.name}${flavorTxt}%0A*Quantity:* ${qty}%0A*Total Price:* Rs. ${totalPrice}%0A--------------------------%0A*Customer:* ${form.name}%0A*Address:* ${form.address}%0A*City:* ${form.city}`
      
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

  if (loading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white font-black animate-pulse uppercase tracking-widest">Loading...</div>

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <div className="min-h-screen bg-[#030712] text-white pb-20 font-sans">
        <div className="max-w-6xl mx-auto p-6">
          <button onClick={() => window.location.href='/'} className="mb-10 flex items-center gap-2 text-slate-500 hover:text-white transition font-black text-[10px] uppercase tracking-widest">
            <ArrowLeft size={14}/> Back to Store
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* --- IMPROVED IMAGE GALLERY AREA --- */}
            <div className="space-y-6">
              <div className="aspect-square glass rounded-[2rem] overflow-hidden p-2 shadow-2xl border-white/10">
                <img src={mainImage} className="w-full h-full object-cover rounded-[1.5rem] transition-all duration-500" alt={product.name} />
              </div>
              
              {/* Thumbnails Row */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {product.images.map((img: string, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => setMainImage(img)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-purple-500 scale-105 shadow-lg shadow-purple-500/20' : 'border-white/5 opacity-50 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="glass p-6 rounded-2xl space-y-4 border-white/5">
                 <h3 className="text-xs font-black uppercase text-purple-400 tracking-widest border-b border-white/5 pb-2">Description</h3>
                 <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">{product.description || "Authentic product from Pak Vape Store Gujar Khan."}</p>
              </div>
            </div>

            {/* --- DETAILS & CHECKOUT AREA --- */}
            <div className="space-y-8">
              <div>
                <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{product.category}</p>
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-4 leading-none">{product.name}</h1>
                
                <div className="flex items-center gap-4">
                  <p className="text-3xl font-black text-white">Rs. {product.price}</p>
                  {product.old_price && <p className="text-lg text-slate-500 line-through font-bold">Rs. {product.old_price}</p>}
                </div>
              </div>

              {/* Flavor Selector */}
              {product.flavors?.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Flavor</p>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((f: string) => (
                      <button 
                        key={f} 
                        onClick={() => setSelectedFlavor(f)} 
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${selectedFlavor === f ? 'bg-white text-black border-white shadow-lg scale-105' : 'glass text-slate-400 hover:border-white/20'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantity</p>
                <div className="flex items-center gap-8 bg-white/5 w-fit p-3 rounded-2xl border border-white/5">
                  <button type="button" onClick={() => qty > 1 && setQty(qty - 1)} className="p-1 hover:bg-white/10 rounded-lg transition"><Minus size={18}/></button>
                  <span className="font-black text-2xl w-6 text-center">{qty}</span>
                  <button type="button" onClick={() => qty < product.stock_quantity && setQty(qty + 1)} className="p-1 hover:bg-white/10 rounded-lg transition"><Plus size={18}/></button>
                </div>
              </div>

              {/* Total Price Card */}
              <div className="p-6 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex justify-between items-center shadow-inner">
                 <div>
                    <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Total Amount</p>
                    <p className="text-2xl font-black text-white">Rs. {totalPrice}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">In Stock</p>
                    <p className="text-xs text-slate-500 font-bold">{product.stock_quantity} left</p>
                 </div>
              </div>

              <form onSubmit={handleOrder} className="glass p-8 rounded-[2.5rem] space-y-4 shadow-2xl border-white/5">
                <input placeholder="Full Name" className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 outline-none focus:ring-1 ring-purple-500 transition" onChange={e=>setForm({...form, name: e.target.value})} required />
                <input placeholder="WhatsApp Number" className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 outline-none focus:ring-1 ring-purple-500 transition" onChange={e=>setForm({...form, phone: e.target.value})} required />
                <textarea placeholder="Delivery Address" className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 outline-none focus:ring-1 ring-purple-500 h-20" onChange={e=>setForm({...form, address: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                   <input placeholder="Tehsil" className="bg-white/5 p-4 rounded-2xl border border-white/5" onChange={e=>setForm({...form, tehsil: e.target.value})} required />
                   <input placeholder="City" className="bg-white/5 p-4 rounded-2xl border border-white/5" onChange={e=>setForm({...form, city: e.target.value})} required />
                </div>
                <button type="submit" disabled={isOrdering || product.stock_quantity <= 0} className="w-full bg-white text-black py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-3">
                  {isOrdering ? <Loader2 className="animate-spin"/> : <MessageSquare size={20}/>}
                  {isOrdering ? 'PROCESSING...' : 'CONFIRM ORDER'}
                </button>
              </form>
            </div>
          </div>

          {/* --- REVIEWS SECTION --- */}
          <div className="mt-32 space-y-12">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase border-b border-white/5 pb-6">Customer Reviews</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <form onSubmit={submitReview} className="glass p-8 rounded-[3rem] space-y-4 h-fit border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Share Your Experience</p>
                <input placeholder="Your Name" className="w-full bg-white/5 p-4 rounded-2xl outline-none" value={revName} onChange={e=>setRevName(e.target.value)} required />
                <div className="flex gap-2 py-2">
                   {[1,2,3,4,5].map(star => (
                     <Star key={star} size={20} className={`cursor-pointer transition-all ${star <= revRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} onClick={()=>setRevRating(star)} />
                   ))}
                </div>
                <textarea placeholder="Write a comment..." className="w-full bg-white/5 p-4 rounded-2xl outline-none h-24" value={revComment} onChange={e=>setRevComment(e.target.value)} required />
                <button className="bg-purple-600 w-full p-4 rounded-2xl font-black uppercase text-xs">Submit Review</button>
              </form>

              <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">
                {reviews.map(r => (
                  <div key={r.id} className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-bold text-slate-200">{r.user_name}</p>
                      <div className="flex gap-1">
                        {Array(r.rating).fill(0).map((_, i) => <Star key={i} size={10} className="text-yellow-500 fill-yellow-500" />)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
        }
