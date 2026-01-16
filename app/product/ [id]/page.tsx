"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { ArrowLeft, CheckCircle2, MessageSquare } from 'lucide-react'

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [whatsapp, setWhatsapp] = useState("")
  const [loading, setLoading] = useState(true)
  const [orderSent, setOrderSent] = useState(false)

  // Form State
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [tehsil, setTehsil] = useState("")
  const [district, setDistrict] = useState("")
  const [city, setCity] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: p } = await supabase.from('products').select('*').eq('id', params.id).single()
    const { data: s } = await supabase.from('settings').select('whatsapp_number').eq('id', 1).single()
    if (p) setProduct(p)
    if (s) setWhatsapp(s.whatsapp_number)
    setLoading(false)
  }

  async function handleOrder(e: any) {
    e.preventDefault()
    if (product.stock_quantity <= 0) return alert("Out of Stock!")

    // 1. Save Order
    const { data: order, error: orderError } = await supabase.from('orders').insert([{
      customer_name: name,
      phone,
      full_address: address,
      tehsil,
      district,
      city,
      total_amount: product.price,
      status: 'Pending'
    }]).select().single()

    if (orderError) return alert("Error placing order")

    // 2. Save Order Items (This triggers the stock minus)
    await supabase.from('order_items').insert([{
      order_id: order.id,
      product_id: product.id,
      quantity: 1,
      price_at_time: product.price
    }])

    setOrderSent(true)

    // 3. WhatsApp Redirect
    const msg = `*NEW ORDER - PAK VAPE STORE*%0A--------------------------%0A*Product:* ${product.name}%0A*Price:* Rs. ${product.price}%0A--------------------------%0A*Customer:* ${name}%0A*Phone:* ${phone}%0A*Address:* ${address}%0A*Location:* ${tehsil}, ${district}, ${city}`
    window.location.href = `https://wa.me/${whatsapp}?text=${msg}`
  }

  if (loading) return <div className="p-10 text-center text-white">Loading...</div>
  if (!product) return <div className="p-10 text-center text-white">Product not found.</div>

  if (orderSent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="bg-slate-900 p-8 rounded-2xl border border-green-500 shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-white">Order Confirmed!</h2>
          <p className="text-slate-400 mb-6">Redirecting to WhatsApp for confirmation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-4 md:p-10">
      <button onClick={() => window.location.href='/'} className="flex items-center gap-2 text-slate-400 mb-6 hover:text-white transition">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div className="space-y-4">
          <img src={product.images[0]} className="w-full aspect-square object-cover rounded-3xl border border-white/10" alt={product.name} />
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img: string, i: number) => (
              <img key={i} src={img} className="aspect-square object-cover rounded-lg border border-white/5 opacity-60" />
            ))}
          </div>
        </div>

        {/* Checkout Form */}
        <div>
          <h1 className="text-3xl font-black mb-2">{product.name}</h1>
          <p className="text-2xl text-purple-500 font-black mb-4">Rs. {product.price}</p>
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs mb-8">
            STOCK: {product.stock_quantity > 0 ? `${product.stock_quantity} Available` : 'OUT OF STOCK'}
          </div>

          <form onSubmit={handleOrder} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold border-b border-white/5 pb-3">DELIVERY DETAILS (COD)</h3>
            <input placeholder="Full Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full bg-slate-800 p-3 rounded-xl border border-white/5 outline-none focus:ring-1 ring-purple-500" required />
            <input placeholder="Phone / WhatsApp" value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full bg-slate-800 p-3 rounded-xl border border-white/5 outline-none focus:ring-1 ring-purple-500" required />
            <input placeholder="Complete Home Address" value={address} onChange={(e)=>setAddress(e.target.value)} className="w-full bg-slate-800 p-3 rounded-xl border border-white/5 outline-none focus:ring-1 ring-purple-500" required />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Tehsil" value={tehsil} onChange={(e)=>setTehsil(e.target.value)} className="bg-slate-800 p-3 rounded-xl outline-none" required />
              <input placeholder="District" value={district} onChange={(e)=>setDistrict(e.target.value)} className="bg-slate-800 p-3 rounded-xl outline-none" required />
            </div>
            <input placeholder="City" value={city} onChange={(e)=>setCity(e.target.value)} className="w-full bg-slate-800 p-3 rounded-xl outline-none" required />
            
            <button 
              type="submit"
              disabled={product.stock_quantity <= 0}
              className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <MessageSquare className="w-5 h-5" /> CONFIRM ORDER
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
