"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState("Pods")
  const [images, setImages] = useState("") 
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    const productData = {
      name, price: parseFloat(price), stock_quantity: parseInt(stock),
      category, images: images.split(',').map(img => img.trim()),
    }
    if (editId) await supabase.from('products').update(productData).eq('id', editId)
    else await supabase.from('products').insert([productData])
    setName(""); setPrice(""); setStock(""); setImages(""); setEditId(null);
    fetchProducts();
    alert("Database Updated!");
  }

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-black italic uppercase tracking-tighter text-purple-400 underline decoration-purple-900">Inventory Management</h2>
      
      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-[2rem] border border-white/5 grid gap-6 shadow-2xl">
        <div className="space-y-4">
           <input placeholder="Product Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none focus:ring-1 ring-purple-500" required />
           <div className="grid grid-cols-2 gap-4">
              <input placeholder="Price" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none" required />
              <input placeholder="Stock" type="number" value={stock} onChange={(e)=>setStock(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none" required />
           </div>
           <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none text-white appearance-none border border-white/5">
              <option value="Pods">Pods</option>
              <option value="E-liquids">E-liquids</option>
              <option value="Devices">Devices</option>
              <option value="Accessories">Accessories</option>
           </select>
           <textarea placeholder="Image URLs (Comma separated)" value={images} onChange={(e)=>setImages(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none h-32" />
        </div>
        <button className="w-full bg-purple-600 p-5 rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-purple-700 transition-all shadow-xl shadow-purple-500/10">
          {editId ? "Update Product" : "Publish to Store"}
        </button>
        {editId && <button onClick={() => {setEditId(null); setName("")}} className="text-slate-500 text-xs uppercase font-bold underline text-center">Cancel Edit</button>}
      </form>

      <div className="grid gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 flex justify-between items-center hover:border-white/10 transition">
            <div>
              <p className="font-bold text-slate-200">{p.name}</p>
              <div className="flex gap-3 items-center mt-2">
                <span className="text-[9px] bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-black uppercase">{p.category}</span>
                <span className="text-xs text-slate-500">Rs. {p.price} | {p.stock_quantity} left</span>
              </div>
            </div>
            <div className="flex gap-6 font-black text-[10px] uppercase">
              <button onClick={() => {setEditId(p.id); setName(p.name); setPrice(p.price); setStock(p.stock_quantity); setCategory(p.category); setImages(p.images.join(','))}} className="text-blue-400 tracking-widest">Edit</button>
              <button onClick={async () => {if(confirm('Delete?')) {await supabase.from('products').delete().eq('id', p.id); fetchProducts()}}} className="text-red-500 tracking-widest">Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
              }
