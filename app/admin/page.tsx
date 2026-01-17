"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("") // New
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState("Pods")
  const [images, setImages] = useState("") 
  const [flavors, setFlavors] = useState("")
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    const productData = {
      name, description, price: parseFloat(price), stock_quantity: parseInt(stock),
      category, images: images.split(',').map(img => img.trim()),
      flavors: flavors.split(',').map(f => f.trim()).filter(f => f !== "")
    }

    if (editId) await supabase.from('products').update(productData).eq('id', editId)
    else await supabase.from('products').insert([productData])

    setName(""); setDescription(""); setPrice(""); setStock(""); setImages(""); setFlavors(""); setEditId(null)
    fetchProducts()
    alert("Saved!")
  }

  const handleEdit = (p: any) => {
    setEditId(p.id); setName(p.name); setDescription(p.description || ""); 
    setPrice(p.price.toString()); setStock(p.stock_quantity.toString()); 
    setCategory(p.category); setImages(p.images.join(', '));
    setFlavors(p.flavors ? p.flavors.join(', ') : "")
  }

  return (
    <div className="space-y-10 pb-20">
      <h2 className="text-2xl font-black text-purple-400 uppercase italic">Inventory</h2>
      <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 grid gap-4">
        <input placeholder="Product Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none focus:ring-1 ring-purple-500" required />
        
        {/* DESCRIPTION BOX */}
        <textarea placeholder="Product Description (Specs, Details, etc.)" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none h-32" />
        
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Price" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none" required />
          <input placeholder="Stock" type="number" value={stock} onChange={(e)=>setStock(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none" required />
        </div>
        <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none text-white border border-white/5">
          <option value="Pods">Pods</option>
          <option value="E-liquids">E-liquids</option>
          <option value="Devices">Devices</option>
          <option value="Accessories">Accessories</option>
        </select>
        <input placeholder="Flavors (Comma separated)" value={flavors} onChange={(e)=>setFlavors(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none" />
        <textarea placeholder="Image URLs" value={images} onChange={(e)=>setImages(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none h-20" />
        <button className="w-full bg-purple-600 p-5 rounded-3xl font-black uppercase">{editId ? "Update" : "Publish"}</button>
      </form>

      <div className="grid gap-3">
        {products.map(p => (
          <div key={p.id} className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 flex justify-between items-center">
            <div>
              <p className="font-bold">{p.name}</p>
              <p className="text-[10px] text-slate-500 uppercase">{p.category} • Rs.{p.price}</p>
            </div>
            <button onClick={() => handleEdit(p)} className="text-blue-400 text-xs font-black uppercase tracking-widest">Edit</button>
          </div>
        ))}
      </div>
    </div>
  )
}
