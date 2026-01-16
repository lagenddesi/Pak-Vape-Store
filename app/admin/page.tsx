"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
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
      images: images.split(',').map(img => img.trim()),
    }

    if (editId) {
      await supabase.from('products').update(productData).eq('id', editId)
      alert("Updated!")
    } else {
      await supabase.from('products').insert([productData])
      alert("Added!")
    }

    setName(""); setPrice(""); setStock(""); setImages(""); setEditId(null)
    fetchProducts()
  }

  const handleEdit = (p: any) => {
    setEditId(p.id); setName(p.name); setPrice(p.price.toString());
    setStock(p.stock_quantity.toString()); setImages(p.images.join(', '))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Inventory Management</h2>
      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl mb-8 border border-slate-700 grid gap-4">
        <input placeholder="Product Name" value={name} onChange={(e)=>setName(e.target.value)} className="bg-slate-700 p-3 rounded text-white outline-none" required />
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Price" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} className="bg-slate-700 p-3 rounded text-white" required />
          <input placeholder="Stock" type="number" value={stock} onChange={(e)=>setStock(e.target.value)} className="bg-slate-700 p-3 rounded text-white" required />
        </div>
        <textarea placeholder="Image URLs (Comma separated)" value={images} onChange={(e)=>setImages(e.target.value)} className="bg-slate-700 p-3 rounded text-white" />
        <button className="bg-purple-600 p-3 rounded font-bold uppercase tracking-widest text-white">
          {editId ? "Update Product" : "Save Product"}
        </button>
        {editId && <button type="button" onClick={() => {setEditId(null); setName("")}} className="text-slate-400 text-sm underline">Cancel Edit</button>}
      </form>

      <div className="grid gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center border border-slate-700">
            <div>
              <p className="font-bold text-white">{p.name}</p>
              <p className="text-sm text-purple-400 font-mono">Rs. {p.price} | Stock: {p.stock_quantity}</p>
              {p.stock_quantity <= 3 && <p className="text-red-500 text-[10px] uppercase font-bold">Low Stock!</p>}
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleEdit(p)} className="text-blue-400 text-sm">Edit</button>
              <button onClick={async () => {if(confirm('Delete?')) {await supabase.from('products').delete().eq('id', p.id); fetchProducts()}}} className="text-red-400 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
