"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { ArrowLeft, CheckCircle2, MessageSquare, Loader2, MapPin } from 'lucide-react'

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [whatsapp, setWhatsapp] = useState("")
  const [loading, setLoading] = useState(true)
  const [isOrdering, setIsOrdering] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  // Checkout Form State
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [tehsil, setTehsil] = useState("")
  const [district, setDistrict] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    // Product details aur WhatsApp number aik saath fetch karein
    const { data: p } = await supabase.from('products').select('*').eq('id', params.id).single()
    const { data: s } = await supabase.from('settings').select('whatsapp_number').eq('id', 1).single()
    
    if (p) setProduct(p)
    if (s) setWhatsapp(s.whatsapp_number)
    setLoading(false)
  }

  async function handleOrder(e: any) {
    e.preventDefault()
    if (product.stock_quantity <= 0) return alert("Sorry, this item is out of stock.")
    
    setIsOrdering(true)

    // 1. Order Table mein data save karein
    const { data: order, error: orderError } = await supabase.from('orders').insert([{
      customer_name: name,
      phone,
      full_address: address,
      tehsil,
      district,
      city,
      postal_code: postalCode,
      total_amount: product.price,
      status: 'Pending'
    }]).select().single()

    if (orderError) {
      console.error(orderError)
      alert("Database Error: Could not place order.")
      setIsOrdering(false)
      return
    }

    // 2. Order Items mein data dalien (Is se DB Trigger stock minus kar dega)
    await supabase.from('order_items').insert([{
      order_id: order.id,
      product_id: product.id,
      quantity: 1,
      price_at_time: product.price
    }])

    setOrderSuccess(true)

    // 3. WhatsApp Redirect Link tyaar karein
    const message = `*NEW ORDER - PAK VAPE STORE*%0A` +
                    `--------------------------%0A` +
                    `*Product:* ${product.name}%0A` +
                    `*Price:* Rs. ${product.price}%0A` +
                    `--------------------------%0A` +
                    `*Customer:* ${name}%0A` +
                    `*Phone:* ${phone}%0A` +
                    `*Address:* ${address}%0A` +
                    `*Location:* ${tehsil}, ${district}, ${city}%0A` +
                    `*Postal Code:* ${postalCode || 'N/A'}`

    window.location.href = `https://wa.me/${whatsapp}?text=${message}`
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-6">
      <p className="text-slate-400 mb-4">Product not found.</p>
      <button onClick={() => window.location.href='/'} className="bg-purple-600 px-6 py-2 rounded-lg font-bold">Back to Home</button>
    </div>
  )

  if (orderSuccess) return (
    <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-6 text-center">
      <div className="bg-slate-900 p-10 rounded-3xl border border-green-500 shadow-2xl shadow-green-500/10 max-w-sm">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-black mb-4">ORDER PLACED!</h2>
        <p className="text-slate-400 mb-8">Redirecting you to WhatsApp for final confirmation...</p>
        <Loader2 className="w-6 h-6 text-green-500 animate-spin mx-auto" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-purple-500/30">
      {/* Header Navigation */}
      <div className="p-4 md:p-8 flex items-center justify-between max-w-7xl mx-auto">
        <button onClick={() => window.location.href='/'} className="flex items-center gap-2 text-slate-400 hover:text-white transition group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm font-bold uppercase tracking-widest">Back to Store</span>
        </button>
        <div className="text-[10px] text-slate-500 font-mono hidden md:block uppercase tracking-widest">
          PAK VAPE STORE / {product.category}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 p-6">
        {/* Left Side: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden">
            <img 
              src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/600'} 
              className="w-full h-full object-cover" 
              alt={product.name} 
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img: string, i: number) => (
                <div key={i} className="aspect-square bg-slate-900 rounded-2xl border border-white/5 overflow-hidden opacity-50 hover:opacity-100 transition cursor-pointer">
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Info & Checkout */}
        <div>
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black mb-2 uppercase italic tracking-tighter">{product.name}</h1>
            <p className="text-3xl text-purple-500 font-black mb-4 tracking-tight">Rs. {product.price}</p>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${product.stock_quantity > 0 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
              {product.stock_quantity > 0 ? `${product.stock_quantity} IN STOCK` : 'OUT OF STOCK'}
            </div>
          </div>

          <form onSubmit={handleOrder} className="bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/10 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Checkout (COD)</h3>
            </div>

            <div className="space-y-4">
              <input 
                placeholder="Full Name" 
                value={name} onChange={(e)=>setName(e.target.value)} 
                className="w-full bg-slate-800/50 p-4 rounded-xl border border-white/5 outline-none focus:ring-1 ring-purple-500 transition" 
                required 
              />
              <input 
                placeholder="Phone Number / WhatsApp" 
                value={phone} onChange={(e)=>setPhone(e.target.value)} 
                className="w-full bg-slate-800/50 p-4 rounded-xl border border-white/5 outline-none focus:ring-1 ring-purple-500 transition" 
                required 
              />
              <textarea 
                placeholder="Complete Address (Home No, Street, Mohalla)" 
                value={address} onChange={(e)=>setAddress(e.target.value)} 
                className="w-full bg-slate-800/50 p-4 rounded-xl border border-white/5 outline-none focus:ring-1 ring-purple-500 transition h-24" 
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Tehsil" value={tehsil} onChange={(e)=>setTehsil(e.target.value)} 
                  className="bg-slate-800/50 p-4 rounded-xl border border-white/5 outline-none focus:ring-1 ring-purple-500 transition" 
                  required 
                />
                <input 
                  placeholder="District (Zila)" value={district} onChange={(e)=>setDistrict(e.target.value)} 
                  className="bg-slate-800/50 p-4 rounded-xl border border-white/5 outline-none focus:ring-1 ring-purple-500 transition" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="City" value={city} onChange={(e)=>setCity(e.target.value)} 
                  className="bg-slate-800/50 p-4 rounded-xl border border-white/5 outline-none focus:ring-1 ring-purple-500 transition" 
                  required 
                />
                <input 
                  placeholder="Postal Code" value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} 
                  className="bg-slate-800/50 p-4 rounded-xl border border-white/5 outline-none focus:ring-1 ring-purple-500 transition" 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isOrdering || product.stock_quantity <= 0}
              className="w-full bg-purple-600 hover:bg-purple-700 py-5 rounded-2xl font-black text-lg shadow-xl shadow-purple-500/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 active:scale-95"
            >
              {isOrdering ? <Loader2 className="animate-spin" /> : <MessageSquare className="w-5 h-5" />}
              {isOrdering ? 'PROCESSING...' : 'PLACE ORDER (COD)'}
            </button>
            <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest mt-4 italic">
              * Final confirmation will be via WhatsApp
            </p>
          </form>
        </div>
      </div>

      <footer className="mt-20 p-10 border-t border-white/5 text-center">
        <p className="text-slate-600 text-[10px] uppercase tracking-widest leading-loose">
          Aryaan Vape Shop Gujar Khan / Pak Vape Store<br/>
          Shop 7, Ithad Plaza, Islam Pora Jabbar
        </p>
      </footer>
    </div>
  )
}
