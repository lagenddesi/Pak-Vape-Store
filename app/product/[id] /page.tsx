"use client"
// Yeh line Vercel ko batayegi ke ye page har baar naya hai (Dynamic hai)
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { ArrowLeft, CheckCircle2, MessageSquare, Loader2 } from 'lucide-react'

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [whatsapp, setWhatsapp] = useState("")
  const [loading, setLoading] = useState(true)
  const [isOrdering, setIsOrdering] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [tehsil, setTehsil] = useState("")
  const [district, setDistrict] = useState("")
  const [city, setCity] = useState("")

  useEffect(() => {
    async function fetchData() {
      // Params.id ko check karein
      if (!params || !params.id) return;
      
      try {
        const { data: p, error: pError } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single()
          
        const { data: s } = await supabase
          .from('settings')
          .select('whatsapp_number')
          .eq('id', 1)
          .single()
        
        if (p) setProduct(p)
        if (s) setWhatsapp(s.whatsapp_number)
      } catch (err) {
        console.error("Fetch Error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params])

  async function handleOrder(e: any) {
    e.preventDefault()
    if (!product || product.stock_quantity <= 0) return alert("Out of Stock")
    setIsOrdering(true)
    
    try {
      const { data: order, error } = await supabase.from('orders').insert([{
        customer_name: name, 
        phone, 
        full_address: address, 
        tehsil, 
        district, 
        city,
        total_amount: product.price, 
        status: 'Pending'
      }]).select().single()

      if (!error && order) {
        await supabase.from('order_items').insert([{ 
          order_id: order.id, 
          product_id: product.id, 
          quantity: 1, 
          price_at_time: product.price 
        }])
        
        setOrderSuccess(true)
        const msg = `*NEW ORDER - PAK VAPE STORE*%0AProduct: ${product.name}%0APrice: ${product.price}%0ACustomer: ${name}%0ALocation: ${tehsil}, ${district}, ${city}`
        window.location.href = `https://wa.me/${whatsapp}?text=${msg}`
      }
    } catch (err) {
      alert("Error placing order")
    } finally {
      setIsOrdering(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin text-purple-500" /></div>
  if (!product) return <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white"><p>Product Not Found</p><button onClick={()=>window.location.href='/'} className="mt-4 bg-purple-600 px-4 py-2 rounded">Go Back</button></div>

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-6">
      <button onClick={() => window.location.href='/'} className="mb-6 flex items-center gap-2 text-slate-400">
        <ArrowLeft size={16}/> Back to Shop
      </button>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        <img src={product.images[0]} className="w-full rounded-2xl aspect-square object-cover border border-white/10" />
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h1 className="text-3xl font-bold mb-2 uppercase">{product.name}</h1>
          <p className="text-2xl text-purple-500 font-black mb-6">Rs. {product.price}</p>
          <form onSubmit={handleOrder} className="space-y-4">
            <input placeholder="Name" className="w-full bg-slate-800 p-3 rounded-lg outline-none" onChange={e=>setName(e.target.value)} required />
            <input placeholder="Phone" className="w-full bg-slate-800 p-3 rounded-lg outline-none" onChange={e=>setPhone(e.target.value)} required />
            <textarea placeholder="Address" className="w-full bg-slate-800 p-3 rounded-lg outline-none" onChange={e=>setAddress(e.target.value)} required />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Tehsil" className="bg-slate-800 p-3 rounded-lg outline-none" onChange={e=>setTehsil(e.target.value)} required />
              <input placeholder="District" className="bg-slate-800 p-3 rounded-lg outline-none" onChange={e=>setDistrict(e.target.value)} required />
            </div>
            <input placeholder="City" className="w-full bg-slate-800 p-3 rounded-lg outline-none" onChange={e=>setCity(e.target.value)} required />
            <button type="submit" disabled={isOrdering || product.stock_quantity <= 0} className="w-full bg-purple-600 py-4 rounded-xl font-bold uppercase hover:bg-purple-700 transition">
              {isOrdering ? 'Processing...' : 'Confirm Order (COD)'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
          }
