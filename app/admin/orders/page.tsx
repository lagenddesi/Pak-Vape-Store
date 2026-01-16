"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setOrders(data)
    setLoading(false)
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id)
    
    if (!error) {
      alert("Order Status Updated!")
      fetchOrders()
    }
  }

  async function deleteOrder(id: string) {
    if (confirm("Are you sure you want to delete this order?")) {
      await supabase.from('orders').delete().eq('id', id)
      fetchOrders()
    }
  }

  if (loading) return <div className="p-10 text-center">Loading Orders...</div>

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Customer Orders</h2>
        <button onClick={fetchOrders} className="text-sm bg-slate-800 px-4 py-2 rounded text-purple-400 border border-purple-500/30">Refresh</button>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            {/* Header: Name & Status */}
            <div className="p-4 bg-slate-700/50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-purple-400">{order.customer_name}</h3>
                <p className="text-xs text-slate-400">Order ID: #{order.id.slice(0,8)}</p>
              </div>
              <select 
                value={order.status} 
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className={`text-xs font-bold p-2 rounded border border-white/10 outline-none
                  ${order.status === 'Pending' ? 'bg-orange-500/20 text-orange-500' : 
                    order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-500' : 
                    order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' : 'bg-slate-600'}`}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Content: Phone & Address */}
            <div className="p-4 grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Contact Info</p>
                <p className="text-white font-mono">{order.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total Amount</p>
                <p className="text-green-500 font-black text-lg">Rs. {order.total_amount}</p>
              </div>
              <div className="md:col-span-2 bg-slate-900/50 p-3 rounded border border-white/5">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Shipping Details</p>
                <p className="text-slate-300 text-sm">{order.full_address}</p>
                <p className="text-purple-400 text-sm mt-1">
                  {order.tehsil}, {order.district}, {order.city} {order.postal_code && `(${order.postal_code})`}
                </p>
              </div>
            </div>

            {/* Footer: Date & Delete */}
            <div className="p-4 bg-slate-900/30 flex justify-between items-center border-t border-white/5">
              <span className="text-xs text-slate-500 italic">
                {new Date(order.created_at).toLocaleString()}
              </span>
              <button 
                onClick={() => deleteOrder(order.id)}
                className="text-xs text-red-500 hover:underline"
              >
                Delete Order
              </button>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-20 bg-slate-800 rounded-xl border border-dashed border-slate-700">
            <p className="text-slate-500 italic">No orders received yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
