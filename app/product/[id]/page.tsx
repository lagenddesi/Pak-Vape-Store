"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { ArrowLeft, MessageSquare, Loader2, Plus, Minus, ShieldCheck, Truck, CreditCard } from 'lucide-react'

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [whatsapp, setWhatsapp] = useState("")
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [selectedFlavor, setSelectedFlavor] = useState("")
  const [isOrdering, setIsOrdering] = useState(false)

  const [form, setForm] = useState({ name: '', phone: '', address: '', tehsil: '', city: '' })

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

  // LIVE PRICE CALCULATION
  const totalPrice = product ? product.price * qty : 0

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
      await supabase.from('order_items').insert([{ order_id: order.id, product_id: product.id, quantity: qty, price_at_time: product.price }])
      const flavorTxt = selectedFlavor ? `%0A*Flavor:* ${selectedFlavor}` : ''
      const msg = `*NEW ORDER - PAK VAPE STORE*%0A--------------------------%0A*Item:* ${product.name}${flavorTxt}%0A*Quantity:* ${qty}%0A*Total Amount:* Rs. ${totalPrice}%0A--------------------------%0A*Customer:* ${form.name}%0A*Address:* ${form.address}%0A*City:* ${form.city}`
      window.location.href = `https://wa.me/${whatsapp}?text=${msg}`
    }
    setIsOrdering(false)
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black animate-pulse uppercase tracking-[0.5em]">Loading...</div>

  return (
    <div className="min-h-screen bg-[#030712] text-white pb-20">
      <div className="max-w-6xl mx-auto p-6">
        <button onClick={() => window.location.href='/'} className="mb-10 flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition"><ArrowLeft size={14}/> Back</button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="aspect-square glass rounded-[3.5rem] overflow-hidden p-2 shadow-2xl">
              <img src={product.images[0]} className="w-full h-full object-cover rounded-[3rem]" alt={product.name} />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{product.category}</p>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-4">{product.name}</h1>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">{product.description}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">Rs. {product.price}</span>
                <span className="text-xs text-slate-500 line-through">Rs. {product.price + 500}</span>
              </div>
            </div>

            {product.flavors?.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Flavor</p>
                <div className="flex flex-wrap gap-2">
                  {product.flavors.map((f: string) => (
                    <button key={f} onClick={() => setSelectedFlavor(f)} className={`px-5 py-2.5 rounded-2xl text-xs font-bold border transition-all ${selectedFlavor === f ? 'bg-white text-black border-white scale-105' : 'glass text-slate-400 hover:border-white/30'}`}>{f}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantity</p>
              <div className="flex items-center gap-8 bg-white/5 w-fit p-3 rounded-[1.5rem] border border-white/5">
                <button onClick={() => qty > 1 && setQty(qty - 1)} className="p-2 hover:bg-white/10 rounded-full transition"><Minus size={18}/></button>
                <span className="font-black text-2xl w-6 text-center">{qty}</span>
                <button onClick={() => qty < product.stock_quantity && setQty(qty + 1)} className="p-2 hover:bg-white/10 rounded-full transition"><Plus size={18}/></button>
              </div>
            </div>

            {/* LIVE PRICE TOTAL DISPLAY */}
            <div className="p-6 rounded-[2rem] bg-purple-600/10 border border-purple-500/20 flex justify-between items-center shadow-inner">
               <div>
                  <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Total Payable</p>
                  <p className="text-2xl font-black text-white">Rs. {totalPrice}</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Items</p>
                  <p className="text-lg font-black text-slate-300">x{qty}</p>
               </div>
            </div>

            <form onSubmit={handleOrder} className="glass p-8 rounded-[3rem] space-y-4 shadow-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Delivery Information</p>
              <input placeholder="Full Name" className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 outline-none focus:border-purple-500 transition" onChange={e=>setForm({...form, name: e.target.value})} required />
              <input placeholder="WhatsApp Number" className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 outline-none focus:border-purple-500 transition" onChange={e=>setForm({...form, phone: e.target.value})} required />
              <textarea placeholder="Address" className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 outline-none focus:border-purple-500 transition h-20" onChange={e=>setForm({...form, address: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                 <input placeholder="Tehsil" className="bg-white/5 p-4 rounded-2xl border border-white/5 outline-none" onChange={e=>setForm({...form, tehsil: e.target.value})} required />
                 <input placeholder="City" className="bg-white/5 p-4 rounded-2xl border border-white/5 outline-none" onChange={e=>setForm({...form, city: e.target.value})} required />
              </div>
              <button type="submit" disabled={isOrdering || product.stock_quantity <= 0} className="w-full bg-white text-black py-5 rounded-[2rem] font-black text-lg uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-3">
                {isOrdering ? <Loader2 className="animate-spin"/> : <CreditCard size={20}/>}
                {isOrdering ? 'PROCESSING...' : 'CONFIRM ORDER'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
                                                                                                                                                       }
