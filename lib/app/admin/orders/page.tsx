"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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
    <div>
      <h2 className="text-2xl font-bold mb-8">Customer Orders</h2>
      <div className="grid grid-cols-1 gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-slate-800 p-5 rounded-lg border border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-purple-400 font-bold text-lg">{order.customer_name}</p>
                <p className="text-sm text-slate-400">{order.phone}</p>
              </div>
              <select 
                value={order.status} 
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="bg-slate-700 text-xs p-2 rounded border border-slate-600"
              >
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
            
            <div className="bg-slate-900/50 p-3 rounded mb-4 text-sm">
              <p><span className="text-slate-500">Address:</span> {order.full_address}</p>
              <p><span className="text-slate-500">Location:</span> {order.tehsil}, {order.district}, {order.city}</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-700">
              <p className="font-bold text-green-500 text-lg">Rs. {order.total_amount}</p>
              <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-slate-500 text-center">No orders found.</p>}
      </div>
    </div>
  )
}
