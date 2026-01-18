"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Loader2, Edit3, Trash2 } from 'lucide-react'

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [oldPrice, setOldPrice] = useState("") // New
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState("Pods")
  const [images, setImages] = useState("") 
  const [flavors, setFlavors] = useState("") 
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    const productData = {
      name, description, 
      price: parseFloat(price), 
      old_price: oldPrice ? parseFloat(oldPrice) : null,
      stock_quantity: parseInt(stock),
      category, images: images.split(',').map(img => img.trim()),
      flavors: flavors.split(',').map(f => f.trim()).filter(f => f !== "")
    }
    if (editId) await supabase.from('products').update(productData).eq('id', editId)
    else await supabase.from('products').insert([productData])
    
    setName(""); setDescription(""); setPrice(""); setOldPrice(""); setStock(""); setImages(""); setFlavors(""); setEditId(null);
    fetchProducts();
    alert("Product Updated!");
  }

  const handleEdit = (p: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditId(p.id); setName(p.name); setDescription(p.description || "");
    setPrice(p.price.toString()); setOldPrice(p.old_price ? p.old_price.toString() : "");
    setStock(p.stock_quantity.toString()); setCategory(p.category);
    setImages(p.images.join(', ')); setFlavors(p.flavors ? p.flavors.join(', ') : "");
  }

  return (
    <div className="space-y-10 pb-20">
      <h2 className="text-2xl font-black text-purple-400 uppercase italic tracking-tighter">Inventory & Sale Manager</h2>
      <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 grid gap-4 shadow-2xl">
        <input placeholder="Product Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none" required />
        <textarea placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none h-20" />
        
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Sale Price (Current)" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none" required />
          <input placeholder="Old Price (Optional)" type="number" value={oldPrice} onChange={(e)=>setOldPrice(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none border border-red-500/20" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Stock" type="number" value={stock} onChange={(e)=>setStock(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none" required />
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none text-white border border-white/5">
            <option value="Pods">Pods</option>
            <option value="E-liquids">E-liquids</option>
            <option value="Pods / Mods">Pods / Mods</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <input placeholder="Flavors (Blueberry, Mint...)" value={flavors} onChange={(e)=>setFlavors(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none" />
        <textarea placeholder="Image URLs" value={images} onChange={(e)=>setImages(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none" />
        <button className="w-full bg-purple-600 p-5 rounded-3xl font-black uppercase">{editId ? "Update" : "Publish"}</button>
      </form>

      <div className="grid gap-3">
        {products.map(p => (
          <div key={p.id} className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-200">{p.name}</p>
              <p className="text-xs text-slate-500">
                {p.old_price && <span className="line-through mr-2">Rs.{p.old_price}</span>}
                <span className="text-green-500 font-bold text-sm">Rs.{p.price}</span>
              </p>
            </div>
            <button onClick={() => handleEdit(p)} className="text-blue-400 text-xs font-black uppercase">Edit</button>
          </div>
        ))}
      </div>
    </div>
  )
}
