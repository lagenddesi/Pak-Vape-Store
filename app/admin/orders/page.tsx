"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (data) setOrders(data)
  }

  async function updateStatus(id: string, newStatus: string) {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id)
    fetchOrders()
    alert("Status Updated!")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-white">Order History</h2>
      <div className="grid gap-4">
        {orders.map(order => (
          <div key={order.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-400 font-bold text-lg">{order.customer_name}</p>
                <p className="text-xs text-slate-500 font-mono">{order.phone}</p>
              </div>
              <select 
                value={order.status} 
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="bg-slate-700 text-xs p-2 rounded border border-slate-600 outline-none text-white"
              >
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
            
            <div className="mt-4 bg-slate-900/50 p-3 rounded text-sm text-slate-300">
              <p><strong>Address:</strong> {order.full_address}</p>
              <p><strong>Location:</strong> {order.tehsil}, {order.district}, {order.city}</p>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
              <p className="font-bold text-green-500">Rs. {order.total_amount}</p>
              <p className="text-[10px] text-slate-500 uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-slate-500 text-center py-20">No orders found.</p>}
      </div>
    </div>
  )
}
