"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Loader2, RefreshCw, Trash2 } from 'lucide-react'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (data) setOrders(data)
    setLoading(false)
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id)
    if (!error) {
      alert(`Status changed to ${newStatus}. Stock will auto-update if cancelled.`);
      fetchOrders();
    }
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black animate-pulse">REFRESHING ORDERS...</div>

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-purple-400">Order Management</h2>
        <button onClick={fetchOrders} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition"><RefreshCw size={18}/></button>
      </div>

      <div className="grid gap-6">
        {orders.map(order => (
          <div key={order.id} className={`glass rounded-[2rem] border overflow-hidden transition-all ${order.status === 'Cancelled' ? 'opacity-50 grayscale border-red-500/20' : 'border-white/5'}`}>
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Customer</p>
                   <h3 className="text-xl font-bold text-white uppercase">{order.customer_name}</h3>
                   <p className="text-sm text-purple-400 font-black">{order.phone}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Order Status</p>
                   <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`bg-slate-800 p-3 rounded-xl text-xs font-black uppercase border outline-none ${order.status === 'Cancelled' ? 'text-red-500 border-red-500/50' : 'text-green-400 border-green-500/30'}`}
                   >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                   </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                 <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Shipping Address</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{order.full_address}</p>
                    <p className="text-xs text-white font-bold mt-1 uppercase italic">{order.city}, {order.tehsil}</p>
                 </div>
                 <div className="md:text-right">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Amount Payable</p>
                    <p className="text-2xl font-black text-green-500 tracking-tighter">Rs. {order.total_amount}</p>
                    <p className="text-[10px] text-slate-600 mt-1 font-mono">{new Date(order.created_at).toLocaleString()}</p>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
        }
