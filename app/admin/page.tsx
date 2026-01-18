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
  const [oldPrice, setOldPrice] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState("Disposable") // Updated Default
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
    alert("Inventory Updated!");
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
      <h2 className="text-2xl font-black text-purple-400 uppercase italic tracking-tighter">Inventory Control</h2>
      <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 grid gap-4 shadow-2xl">
        <input placeholder="Product Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none" required />
        <textarea placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none h-20" />
        
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Sale Price" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none" required />
          <input placeholder="Old Price (Optional)" type="number" value={oldPrice} onChange={(e)=>setOldPrice(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Stock" type="number" value={stock} onChange={(e)=>setStock(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none" required />
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none text-white border border-white/5">
            <option value="Disposable">Disposable</option> {/* Updated */}
            <option value="E-liquids">E-liquids</option>
            <option value="Pods / Mods">Pods / Mods</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <input placeholder="Flavors (Comma separated)" value={flavors} onChange={(e)=>setFlavors(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none" />
        <textarea placeholder="Image URLs (Comma separated)" value={images} onChange={(e)=>setImages(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none" />
        <button className="w-full bg-purple-600 p-5 rounded-3xl font-black uppercase tracking-widest">{editId ? "Update" : "Publish"}</button>
      </form>

      <div className="grid gap-3">
        {loading ? <div className="text-center py-10 animate-pulse text-slate-500">Loading...</div> : products.map(p => (
          <div key={p.id} className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-200">{p.name}</p>
              <div className="flex gap-2 items-center mt-1">
                <span className="text-[9px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-black uppercase">{p.category}</span>
                <span className="text-xs text-slate-500">Rs. {p.price}</span>
              </div>
            </div>
            <button onClick={() => handleEdit(p)} className="text-blue-400 text-xs font-black uppercase">Edit</button>
          </div>
        ))}
      </div>
    </div>
  )
}
