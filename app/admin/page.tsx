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
  const [flavors, setFlavors] = useState("") // Comma separated list
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    const productData = {
      name,
      price: parseFloat(price),
      stock_quantity: parseInt(stock),
      category,
      images: images.split(',').map(img => img.trim()),
      flavors: flavors.split(',').map(f => f.trim()).filter(f => f !== "")
    }

    if (editId) {
      await supabase.from('products').update(productData).eq('id', editId)
      alert("Updated!")
    } else {
      await supabase.from('products').insert([productData])
      alert("Added!")
    }

    setName(""); setPrice(""); setStock(""); setImages(""); setFlavors(""); setEditId(null)
    fetchProducts()
  }

  const handleEdit = (p: any) => {
    setEditId(p.id); setName(p.name); setPrice(p.price.toString());
    setStock(p.stock_quantity.toString()); setCategory(p.category);
    setImages(p.images.join(', '));
    setFlavors(p.flavors ? p.flavors.join(', ') : "")
  }

  return (
    <div className="space-y-10 pb-20">
      <h2 className="text-2xl font-black text-purple-400 uppercase italic tracking-tighter">Inventory Control</h2>
      
      <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 grid gap-4 shadow-2xl">
        <input placeholder="Product Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none focus:ring-1 ring-purple-500" required />
        
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Price (Rs)" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none" required />
          <input placeholder="Stock Qty" type="number" value={stock} onChange={(e)=>setStock(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none" required />
        </div>

        <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none text-white border border-white/5">
          <option value="Pods">Pods</option>
          <option value="E-liquids">E-liquids</option>
          <option value="Devices">Devices</option>
          <option value="Accessories">Accessories</option>
        </select>

        <input placeholder="Flavors (Blueberry, Mint, Mango) - Leave empty if none" value={flavors} onChange={(e)=>setFlavors(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none" />
        
        <textarea placeholder="Image URLs (Comma separated)" value={images} onChange={(e)=>setImages(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none h-24" />
        
        <button className="w-full bg-purple-600 p-5 rounded-3xl font-black uppercase tracking-widest hover:bg-purple-700 transition shadow-xl shadow-purple-500/10">
          {editId ? "Update Product" : "Publish to Store"}
        </button>
        {editId && <button type="button" onClick={() => {setEditId(null); setName("")}} className="text-slate-500 text-xs font-bold underline text-center">Cancel</button>}
      </form>

      <div className="grid gap-3">
        {products.map(p => (
          <div key={p.id} className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-200">{p.name}</p>
              <p className="text-[10px] text-slate-500 uppercase font-black">{p.category} • Rs.{p.price} • {p.stock_quantity} Left</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleEdit(p)} className="text-blue-400 text-xs font-black uppercase">Edit</button>
              <button onClick={async () => {if(confirm('Delete?')) {await supabase.from('products').delete().eq('id', p.id); fetchProducts()}}} className="text-red-500 text-xs font-black uppercase">Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
        }
