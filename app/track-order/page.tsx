"use client"
import { useState } from 'react'
import { supabase } from '../../lib/supabase' // Yahan double ../../ aayega

export default function TrackOrder() {
  const [phone, setPhone] = useState("")
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function handleTrack() {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').eq('phone', phone).order('created_at', { ascending: false })
    if (data) setOrders(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-10 max-w-lg mx-auto">
      <button onClick={() => window.location.href='/'} className="text-slate-500 mb-6 text-sm underline">← Back to Shop</button>
      <h2 className="text-2xl font-bold mb-6 italic text-purple-500">TRACK YOUR ORDER</h2>
      <div className="flex gap-2 mb-10">
        <input placeholder="Enter Phone Number" className="flex-1 bg-white/5 p-3 rounded-xl border border-white/10 outline-none focus:ring-1 ring-purple-500" onChange={e=>setPhone(e.target.value)} />
        <button onClick={handleTrack} className="bg-purple-600 px-6 rounded-xl font-bold text-sm">
          {loading ? '...' : 'SEARCH'}
        </button>
      </div>
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-slate-500">#{o.id.slice(0,8)}</span>
              <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-[10px] font-bold uppercase">{o.status}</span>
            </div>
            <p className="font-bold text-sm">{o.customer_name}</p>
            <p className="text-green-500 font-black text-sm mt-1">Rs. {o.total_amount}</p>
            <p className="text-[10px] text-slate-500 mt-2 italic">Updated: {new Date(o.created_at).toLocaleDateString()}</p>
          </div>
        ))}
        {orders.length === 0 && phone && !loading && <p className="text-slate-500 text-center text-sm">No orders found for this number.</p>}
      </div>
    </div>
  )
}
