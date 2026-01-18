"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Loader2, Edit3, Trash2, AlertTriangle, Search } from 'lucide-react'

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  
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
      name, description, price: parseFloat(price), stock_quantity: parseInt(stock),
      category, images: images.split(',').map(img => img.trim()),
      flavors: flavors.split(',').map(f => f.trim()).filter(f => f !== "")
    }

    if (editId) await supabase.from('products').update(productData).eq('id', editId)
    else await supabase.from('products').insert([productData])

    setName(""); setDescription(""); setPrice(""); setStock(""); setImages(""); setFlavors(""); setEditId(null)
    fetchProducts();
    alert("Inventory Updated!");
  }

  const handleEdit = (p: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditId(p.id); setName(p.name); setDescription(p.description || "");
    setPrice(p.price.toString()); setStock(p.stock_quantity.toString());
    setCategory(p.category); setImages(p.images.join(', '));
    setFlavors(p.flavors ? p.flavors.join(', ') : "");
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-purple-400 uppercase italic tracking-tighter">Inventory Control</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input placeholder="Search..." className="bg-white/5 border border-white/10 p-2 pl-10 rounded-xl text-xs outline-none focus:ring-1 ring-purple-500" onChange={(e)=>setSearch(e.target.value)} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 grid gap-4 shadow-2xl">
        <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] ml-2">{editId ? "Edit Product" : "New Entry"}</p>
        <input placeholder="Product Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none focus:ring-1 ring-purple-500" required />
        <textarea placeholder="Description (Puffs, Nicotine, Coils etc.)" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none h-24" />
        
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Price" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none" required />
          <input placeholder="Stock" type="number" value={stock} onChange={(e)=>setStock(e.target.value)} className="bg-slate-800 p-4 rounded-2xl outline-none" required />
        </div>

        <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none text-white border border-white/5">
          <option value="Pods">Pods</option>
          <option value="E-liquids">E-liquids</option>
          <option value="Pods / Mods">Pods / Mods</option>
          <option value="Accessories">Accessories</option>
        </select>

        <input placeholder="Flavors (Comma separated)" value={flavors} onChange={(e)=>setFlavors(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none" />
        <textarea placeholder="Image URLs" value={images} onChange={(e)=>setImages(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl outline-none h-20" />
        <button className="w-full bg-purple-600 p-5 rounded-3xl font-black uppercase tracking-widest">{editId ? "Update Product" : "Publish to Store"}</button>
        {editId && <button onClick={() => {setEditId(null); setName("")}} className="text-slate-500 text-xs underline font-bold">Cancel Edit</button>}
      </form>

      <div className="grid gap-3">
        {loading ? <Loader2 className="animate-spin mx-auto text-purple-500" /> : filtered.map(p => (
          <div key={p.id} className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 flex justify-between items-center">
            <div>
              <p className="font-bold">{p.name}</p>
              <div className="flex gap-2 items-center mt-1">
                <span className="text-[9px] bg-purple-500/20 text-purple-400 px-2 py-1 rounded font-black uppercase">{p.category}</span>
                <span className="text-xs text-slate-500">Rs. {p.price}</span>
                {p.stock_quantity <= 3 && <span className="flex items-center gap-1 text-[9px] text-red-500 font-black uppercase"><AlertTriangle size={10}/> Low Stock ({p.stock_quantity})</span>}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(p)} className="p-2 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition"><Edit3 size={16}/></button>
              <button onClick={async () => {if(confirm('Delete?')) {await supabase.from('products').delete().eq('id', p.id); fetchProducts()}}} className="p-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
        }
