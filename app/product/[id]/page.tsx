"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { ArrowLeft, MessageSquare, Loader2, ShieldCheck, Truck } from 'lucide-react'

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [whatsapp, setWhatsapp] = useState("")
  const [loading, setLoading] = useState(true)
  const [isOrdering, setIsOrdering] = useState(false)

  // Form State
  const [form, setForm] = useState({ name: '', phone: '', address: '', tehsil: '', district: '', city: '' })

  useEffect(() => {
    async function fetchData() {
      const { data: p } = await supabase.from('products').select('*').eq('id', params.id).single()
      const { data: s } = await supabase.from('settings').select('whatsapp_number').eq('id', 1).single()
      if (p) setProduct(p)
      if (s) setWhatsapp(s.whatsapp_number)
      setLoading(false)
    }
    fetchData()
  }, [params.id])

  async function handleOrder(e: any) {
    e.preventDefault()
    if (product.stock_quantity <= 0) return alert("Out of Stock")
    setIsOrdering(true)
    
    const { data: order, error } = await supabase.from('orders').insert([{
      customer_name: form.name, phone: form.phone, full_address: form.address, 
      tehsil: form.tehsil, district: form.district, city: form.city,
      total_amount: product.price, status: 'Pending'
    }]).select().single()

    if (!error && order) {
      await supabase.from('order_items').insert([{ order_id: order.id, product_id: product.id, quantity: 1, price_at_time: product.price }])
      const msg = `*NEW ORDER - PAK VAPE STORE*%0AProduct: ${product.name}%0APrice: ${product.price}%0ACustomer: ${form.name}%0ALocation: ${form.city}`
      window.location.href = `https://wa.me/${whatsapp}?text=${msg}`
    }
    setIsOrdering(false)
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black animate-pulse uppercase tracking-[0.5em]">Loading App...</div>

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="max-w-6xl mx-auto p-6">
        <button onClick={() => window.location.href='/'} className="mb-10 flex items-center gap-2 text-slate-500 hover:text-white transition font-black text-[10px] uppercase tracking-widest">
          <ArrowLeft size={14}/> Back to Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery Area */}
          <div className="space-y-6">
            <div className="aspect-square glass rounded-[3rem] overflow-hidden p-2">
              <img src={product.images[0]} className="w-full h-full object-cover rounded-[2.5rem]" />
            </div>
            <div className="flex gap-4 items-center px-4">
              <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                 <ShieldCheck size={14}/> 100% Authentic
              </div>
              <div className="flex items-center gap-2 text-purple-500 text-[10px] font-black uppercase tracking-widest">
                 <Truck size={14}/> Cash on Delivery
              </div>
            </div>
          </div>

          {/* Details & Form */}
          <div className="space-y-8">
            <div>
              <p className="text-purple-500 text-xs font-black uppercase tracking-[0.3em] mb-2">{product.category}</p>
              <h1 className="text-4xl md:text-5xl font-black mb-2 italic tracking-tighter uppercase">{product.name}</h1>
              <p className="text-3xl font-black text-white">Rs. {product.price}</p>
            </div>

            <form onSubmit={handleOrder} className="glass p-8 md:p-10 rounded-[3rem] space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Complete Delivery Form</p>
              
              <input placeholder="Full Name" className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 outline-none focus:border-purple-500 transition" onChange={e=>setForm({...form, name: e.target.value})} required />
              <input placeholder="WhatsApp Number" className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 outline-none focus:border-purple-500 transition" onChange={e=>setForm({...form, phone: e.target.value})} required />
              <textarea placeholder="Delivery Address" className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 outline-none focus:border-purple-500 transition h-24" onChange={e=>setForm({...form, address: e.target.value})} required />
              
              <div className="grid grid-cols-2 gap-4">
                 <input placeholder="Tehsil" className="bg-white/5 p-4 rounded-2xl border border-white/5 outline-none" onChange={e=>setForm({...form, tehsil: e.target.value})} required />
                 <input placeholder="District" className="bg-white/5 p-4 rounded-2xl border border-white/5 outline-none" onChange={e=>setForm({...form, district: e.target.value})} required />
              </div>
              <input placeholder="City" className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 outline-none" onChange={e=>setForm({...form, city: e.target.value})} required />

              <button type="submit" disabled={isOrdering || product.stock_quantity <= 0} className="w-full bg-white text-black py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-3">
                {isOrdering ? <Loader2 className="animate-spin"/> : <MessageSquare size={20}/>}
                {isOrdering ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
