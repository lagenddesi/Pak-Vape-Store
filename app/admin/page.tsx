"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState("Pods") // Category State
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
      name,
      price: parseFloat(price),
      stock_quantity: parseInt(stock),
      category, // Saving Category
      images: images.split(',').map(img => img.trim()),
    }

    if (editId) {
      await supabase.from('products').update(productData).eq('id', editId)
      alert("Updated Successfully!")
    } else {
      await supabase.from('products').insert([productData])
      alert("Added Successfully!")
    }

    setName(""); setPrice(""); setStock(""); setImages(""); setEditId(null)
    fetchProducts()
  }

  const handleEdit = (p: any) => {
    setEditId(p.id); setName(p.name); setPrice(p.price.toString());
    setStock(p.stock_quantity.toString()); setCategory(p.category || "Pods");
    setImages(p.images.join(', '))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-purple-400 uppercase italic">Inventory Management</h2>
      
      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-2xl mb-8 border border-slate-700 grid gap-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{editId ? "Edit Product" : "Add New Product"}</p>
        <input placeholder="Product Name" value={name} onChange={(e)=>setName(e.target.value)} className="bg-slate-700 p-3 rounded-xl outline-none" required />
        
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Price (Rs)" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} className="bg-slate-700 p-3 rounded-xl outline-none" required />
          <input placeholder="Stock Quantity" type="number" value={stock} onChange={(e)=>setStock(e.target.value)} className="bg-slate-700 p-3 rounded-xl outline-none" required />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-slate-400 font-bold uppercase ml-1">Select Category</label>
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="bg-slate-700 p-3 rounded-xl outline-none text-white">
            <option value="Pods">Pods</option>
            <option value="E-liquids">E-liquids / Drops</option>
            <option value="Devices">Vape Devices</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <textarea placeholder="Image URLs (Comma separated)" value={images} onChange={(e)=>setImages(e.target.value)} className="bg-slate-700 p-3 rounded-xl outline-none h-20" />
        
        <button className="bg-purple-600 p-4 rounded-xl font-black uppercase tracking-widest hover:bg-purple-700 transition">
          {editId ? "Update Product Details" : "Save to Inventory"}
        </button>
        {editId && <button type="button" onClick={() => {setEditId(null); setName("")}} className="text-slate-500 text-xs underline">Cancel Editing</button>}
      </form>

      <div className="grid gap-3">
        {products.map(p => (
          <div key={p.id} className="bg-slate-800 p-4 rounded-xl flex justify-between items-center border border-slate-700 shadow-lg">
            <div>
              <p className="font-bold text-slate-200">{p.name}</p>
              <div className="flex gap-2 items-center mt-1">
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-bold uppercase">{p.category}</span>
                <span className="text-xs text-slate-500">Rs. {p.price} | Stock: {p.stock_quantity}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleEdit(p)} className="text-blue-400 text-sm font-bold">Edit</button>
              <button onClick={async () => {if(confirm('Delete?')) {await supabase.from('products').delete().eq('id', p.id); fetchProducts()}}} className="text-red-500 text-sm font-bold">Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
      }
