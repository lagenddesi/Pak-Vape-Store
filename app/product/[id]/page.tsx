"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { ArrowLeft, MessageSquare, Loader2, Plus, Minus, Star, Send } from 'lucide-react'

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

  const [form, setForm] = useState({ name: '', phone: '', address: '', tehsil: '', city: '' })

  useEffect(() => {
    fetchData()
    fetchReviews()
  }, [params.id])

  async function fetchData() {
    const { data: p } = await supabase.from('products').select('*').eq('id', params.id).single()
    const { data: s } = await supabase.from('settings').select('whatsapp_number').eq('id', 1).single()
    if (p) setProduct(p)
    if (s) setWhatsapp(s.whatsapp_number)
    setLoading(false)
  }

  async function fetchReviews() {
    const { data } = await supabase.from('reviews').select('*').eq('product_id', params.id).order('created_at', { ascending: false })
    if (data) setReviews(data)
  }

  async function submitReview(e: any) {
    e.preventDefault()
    const { error } = await supabase.from('reviews').insert([{
      product_id: params.id, user_name: revName, rating: revRating, comment: revComment
    }])
    if (!error) {
      alert("Review Submitted!")
      setRevName(""); setRevComment(""); fetchReviews();
    }
  }

  const totalPrice = product ? product.price * qty : 0

  async function handleOrder(e: any) {
    e.preventDefault()
    if (product.stock_quantity < qty) return alert("Not enough stock!")
    setIsOrdering(true)
    const { data: order, error } = await supabase.from('orders').insert([{
      customer_name: form.name, phone: form.phone, full_address: form.address, 
      tehsil: form.tehsil, city: form.city, district: '-', total_amount: totalPrice, status: 'Pending'
    }]).select().single()

    if (!error && order) {
      await supabase.from('order_items').insert([{ order_id: order.id, product_id: product.id, quantity: qty, price_at_time: product.price }])
      const flavorTxt = selectedFlavor ? `%0A*Flavor:* ${selectedFlavor}` : ''
      const msg = `*NEW ORDER*%0A*Item:* ${product.name}${flavorTxt}%0A*Qty:* ${qty}%0A*Total:* Rs. ${totalPrice}%0A*Customer:* ${form.name}`
      window.location.href = `https://wa.me/${whatsapp}?text=${msg}`
    }
    setIsOrdering(false)
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black animate-pulse">LOADING...</div>

  return (
    <div className="min-h-screen bg-[#030712] text-white pb-20">
      <div className="max-w-6xl mx-auto p-6">
        <button onClick={() => window.location.href='/'} className="mb-8 flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition"><ArrowLeft size={14}/> Back</button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Images & Description */}
          <div className="space-y-8">
            <div className="aspect-square glass rounded-[3.5rem] overflow-hidden p-2 shadow-2xl">
              <img src={product.images[0]} className="w-full h-full object-cover rounded-[3rem]" alt={product.name} />
            </div>
            <div className="glass p-8 rounded-[2.5rem] space-y-4">
               <h3 className="text-sm font-black uppercase text-purple-400 tracking-widest">Product Details</h3>
               <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{product.description || "Premium quality product from Pak Vape Store."}</p>
            </div>
          </div>

          {/* Right: Order Form */}
          <div className="space-y-8">
            <div>
              <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{product.category}</p>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-4">{product.name}</h1>
              <p className="text-3xl font-black text-green-500">Rs. {product.price}</p>
            </div>

            <form onSubmit={handleOrder} className="glass p-8 rounded-[3rem] space-y-4 shadow-2xl border-white/10">
              <div className="flex items-center gap-4 bg-white/5 w-fit p-3 rounded-2xl mb-4">
                <button type="button" onClick={() => qty > 1 && setQty(qty - 1)} className="hover:bg-white/10 p-1 rounded"><Minus size={16}/></button>
                <span className="font-black text-xl">{qty}</span>
                <button type="button" onClick={() => qty < product.stock_quantity && setQty(qty + 1)} className="hover:bg-white/10 p-1 rounded"><Plus size={16}/></button>
              </div>
              <p className="text-xl font-black text-white mb-4">Total: Rs. {totalPrice}</p>
              <input placeholder="Name" className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 outline-none focus:border-purple-500" onChange={e=>setForm({...form, name: e.target.value})} required />
              <input placeholder="WhatsApp Number" className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 outline-none focus:border-purple-500" onChange={e=>setForm({...form, phone: e.target.value})} required />
              <button type="submit" disabled={isOrdering} className="w-full bg-white text-black py-5 rounded-[2rem] font-black uppercase hover:bg-purple-600 hover:text-white transition-all tracking-widest">Confirm Order</button>
            </form>
          </div>
        </div>

        {/* --- REVIEWS SECTION --- */}
        <div className="mt-20 space-y-12">
           <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">Customer Reviews</h2>
              <div className="h-[1px] flex-1 bg-white/5"></div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Review Form */}
              <form onSubmit={submitReview} className="glass p-8 rounded-[2.5rem] space-y-4 h-fit">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Write a Review</p>
                <input placeholder="Your Name" className="w-full bg-white/5 p-4 rounded-2xl outline-none" value={revName} onChange={e=>setRevName(e.target.value)} required />
                <div className="flex gap-2 py-2">
                   {[1,2,3,4,5].map(star => (
                     <Star key={star} size={20} className={`cursor-pointer ${star <= revRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} onClick={()=>setRevRating(star)} />
                   ))}
                </div>
                <textarea placeholder="Your experience..." className="w-full bg-white/5 p-4 rounded-2xl outline-none h-24" value={revComment} onChange={e=>setRevComment(e.target.value)} required />
                <button className="flex items-center justify-center gap-2 bg-purple-600 w-full p-4 rounded-2xl font-black uppercase text-xs tracking-widest"><Send size={14}/> Submit Review</button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">
                {reviews.map(r => (
                  <div key={r.id} className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
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
                {reviews.length === 0 && <p className="text-slate-600 italic">No reviews yet. Be the first!</p>}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
        }
