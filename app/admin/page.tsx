"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Loader2, Edit3, Trash2, Plus } from 'lucide-react'

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form States
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
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
      name,
      description,
      price: parseFloat(price),
      stock_quantity: parseInt(stock),
      category,
      images: images.split(',').map(img => img.trim()),
      flavors: flavors.split(',').map(f => f.trim()).filter(f => f !== "")
    }

    if (editId) {
      await supabase.from('products').update(productData).eq('id', editId)
      alert("Product Updated Successfully!")
    } else {
      await supabase.from('products').insert([productData])
      alert("Product Added Successfully!")
    }

    // Reset Form
    setName(""); setDescription(""); setPrice(""); setStock(""); setImages(""); setFlavors(""); setEditId(null)
    fetchProducts()
  }

  const handleEdit = (p: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditId(p.id);
    setName(p.name);
    setDescription(p.description || "");
    setPrice(p.price.toString());
    setStock(p.stock_quantity.toString());
    setCategory(p.category);
    setImages(p.images.join(', '));
    setFlavors(p.flavors ? p.flavors.join(', ') : "");
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  return (
    <div className="space-y-10 pb-20">
      <h2 className="text-2xl font-black text-purple-400 uppercase italic tracking-tighter">Inventory Control</h2>
      
      {/* FORM SECTION */}
      <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 grid gap-4 shadow-2xl">
        <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] ml-2">
          {editId ? "Editing Mode" : "Add New Product"}
        </p>
        <input placeholder="Product Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none focus:ring-1 ring-purple-500" required />
        <textarea placeholder="Description (Specs, details...)" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none h-24" />
        
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

        <input placeholder="Flavors (Blueberry, Mint, Mango...)" value={flavors} onChange={(e)=>setFlavors(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none" />
        <textarea placeholder="Image URLs (Comma separated)" value={images} onChange={(e)=>setImages(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none h-20" />
        
        <button className="w-full bg-purple-600 p-5 rounded-3xl font-black uppercase tracking-widest hover:bg-purple-700 transition shadow-xl">
          {editId ? "Update Product" : "Publish to Store"}
        </button>
        {editId && (
          <button type="button" onClick={() => {setEditId(null); setName(""); setPrice(""); setStock(""); setImages(""); setFlavors(""); setDescription("");}} className="text-slate-500 text-xs font-bold underline">
            Cancel Edit
          </button>
        )}
      </form>

      {/* LIST SECTION */}
      <div className="grid gap-3">
        {loading ? <Loader2 className="animate-spin mx-auto text-purple-500" /> : products.map(p => (
          <div key={p.id} className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 flex justify-between items-center hover:border-white/10 transition">
            <div>
              <p className="font-bold text-slate-200">{p.name}</p>
              <p className="text-[10px] text-slate-500 uppercase font-black">{p.category} • Rs.{p.price} • {p.stock_quantity} In Stock</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleEdit(p)} className="p-2 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition"><Edit3 size={16}/></button>
              <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
        }
