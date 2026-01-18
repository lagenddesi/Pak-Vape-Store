"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react'

export default function Settings() {
  const [num, setNum] = useState("")
  const [adminKey, setAdminKey] = useState("")
  const [banners, setBanners] = useState<any[]>([])
  const [newBanner, setNewBanner] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSettings()
    fetchBanners()
  }, [])

  async function fetchSettings() {
    const { data } = await supabase.from('settings').select('*').eq('id', 1).single()
    if(data) { setNum(data.whatsapp_number); setAdminKey(data.admin_key); }
  }

  async function fetchBanners() {
    const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false })
    if(data) setBanners(data)
  }

  async function addBanner() {
    if(!newBanner) return;
    await supabase.from('banners').insert([{ image_url: newBanner }])
    setNewBanner(""); fetchBanners();
  }

  async function deleteBanner(id: string) {
    await supabase.from('banners').delete().eq('id', id)
    fetchBanners()
  }

  async function saveSettings() {
    setLoading(true)
    await supabase.from('settings').update({ whatsapp_number: num, admin_key: adminKey }).eq('id',1)
    setLoading(false)
    alert('Settings Saved!')
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-12">
      {/* Store Settings */}
      <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl">
        <h2 className="text-xl font-black text-white uppercase italic">General Settings</h2>
        <input value={num} onChange={(e)=>setNum(e.target.value)} className="w-full bg-slate-700 p-4 rounded-2xl outline-none" placeholder="WhatsApp Number" />
        <input value={adminKey} onChange={(e)=>setAdminKey(e.target.value)} className="w-full bg-slate-700 p-4 rounded-2xl outline-none" placeholder="Admin Key" />
        <button onClick={saveSettings} disabled={loading} className="w-full bg-purple-600 p-4 rounded-2xl font-black uppercase">{loading ? 'Saving...' : 'Save All'}</button>
      </div>

      {/* Banner Management */}
      <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl">
        <h2 className="text-xl font-black text-white uppercase italic">Promotion Banners</h2>
        <div className="flex gap-2">
           <input value={newBanner} onChange={(e)=>setNewBanner(e.target.value)} className="flex-1 bg-slate-700 p-4 rounded-2xl outline-none text-xs" placeholder="Paste Banner Image URL (ImgBB)" />
           <button onClick={addBanner} className="bg-white text-black p-4 rounded-2xl"><Plus size={20}/></button>
        </div>
        <div className="grid gap-4">
           {banners.map(b => (
             <div key={b.id} className="relative group rounded-2xl overflow-hidden border border-white/10 h-32">
                <img src={b.image_url} className="w-full h-full object-cover" />
                <button onClick={()=>deleteBanner(b.id)} className="absolute top-2 right-2 bg-red-600 p-2 rounded-full shadow-lg"><Trash2 size={14}/></button>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
      }
