"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  // Form State
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState("Pods")
  const [images, setImages] = useState("") 
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
      price: parseFloat(price),
      stock_quantity: parseInt(stock),
      category,
      images: images.split(',').map(img => img.trim()),
    }

    if (editId) {
      const { error } = await supabase.from('products').update(productData).eq('id', editId)
      if (!error) alert("Product Updated!")
    } else {
      const { error } = await supabase.from('products').insert([productData])
      if (!error) alert("Product Added!")
    }

    setName(""); setPrice(""); setStock(""); setImages(""); setEditId(null)
    fetchProducts()
  }

  const handleEdit = (p: any) => {
    setEditId(p.id); setName(p.name); setPrice(p.price.toString());
    setStock(p.stock_quantity.toString()); setCategory(p.category);
    setImages(p.images.join(', '))
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <input 
          placeholder="Search by name..." 
          className="bg-slate-800 p-2 rounded border border-slate-700 w-full md:w-64"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg mb-8 border border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
        <h3 className="md:col-span-2 text-lg font-semibold text-purple-400">{editId ? 'Edit Product' : 'Add New Product'}</h3>
        <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} className="bg-slate-700 p-2 rounded outline-none focus:ring-1 ring-purple-500" required />
        <input placeholder="Price" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} className="bg-slate-700 p-2 rounded outline-none focus:ring-1 ring-purple-500" required />
        <input placeholder="Stock" type="number" value={stock} onChange={(e)=>setStock(e.target.value)} className="bg-slate-700 p-2 rounded outline-none focus:ring-1 ring-purple-500" required />
        <select value={category} onChange={(e)=>setCategory(e.target.value)} className="bg-slate-700 p-2 rounded">
          <option>Pods</option>
          <option>Drops / Liquids</option>
          <option>Devices</option>
        </select>
        <textarea placeholder="Image Links (Comma separated)" value={images} onChange={(e)=>setImages(e.target.value)} className="bg-slate-700 p-2 rounded md:col-span-2" rows={2} />
        <div className="flex gap-2 md:col-span-2">
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded font-bold transition flex-1">
            {editId ? "Update Product" : "Save Product"}
          </button>
          {editId && <button type="button" onClick={() => {setEditId(null); setName("")}} className="bg-slate-600 px-6 py-2 rounded">Cancel</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-slate-800 p-4 rounded border border-slate-700 flex justify-between items-center">
            <div>
              <p className="font-bold">{p.name}</p>
              <p className="text-sm text-slate-400">Rs. {p.price} | Stock: {p.stock_quantity}</p>
              {p.stock_quantity <= 3 && <p className="text-red-500 text-xs mt-1">Low Stock Warning!</p>}
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleEdit(p)} className="text-purple-400 text-sm hover:underline">Edit</button>
              <button onClick={async () => { if(confirm('Delete?')) { await supabase.from('products').delete().eq('id', p.id); fetchProducts(); } }} className="text-red-400 text-sm hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
