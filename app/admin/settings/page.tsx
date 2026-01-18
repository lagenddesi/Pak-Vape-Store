"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Trash2, Plus, Lock, Phone, Image as ImageIcon } from 'lucide-react'

export default function Settings() {
  const [num, setNum] = useState("")
  const [adminKey, setAdminKey] = useState("")
  const [banners, setBanners] = useState<any[]>([])
  const [newBanner, setNewBanner] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('settings').select('*').eq('id', 1).single().then(({data}) => {
      if(data) { setNum(data.whatsapp_number); setAdminKey(data.admin_key); }
    })
    fetchBanners()
  }, [])

  async function fetchBanners() {
    const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false })
    if(data) setBanners(data)
  }

  async function saveSettings() {
    setLoading(true)
    await supabase.from('settings').update({ whatsapp_number: num, admin_key: adminKey }).eq('id',1)
    localStorage.setItem('admin_access', adminKey) // Sync local access
    setLoading(false)
    alert('Global Settings Saved!')
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-12 pb-20">
      <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl">
        <h2 className="text-xl font-black text-white uppercase italic flex items-center gap-2"><Lock size={20} className="text-purple-500"/> General Settings</h2>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">WhatsApp (e.g. 923000000000)</label>
          <input value={num} onChange={(e)=>setNum(e.target.value)} className="w-full bg-slate-700 p-4 rounded-2xl outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Secret Admin Key</label>
          <input value={adminKey} onChange={(e)=>setAdminKey(e.target.value)} className="w-full bg-slate-700 p-4 rounded-2xl outline-none font-mono" />
        </div>
        <button onClick={saveSettings} disabled={loading} className="w-full bg-purple-600 p-4 rounded-2xl font-black uppercase transition hover:bg-purple-700">{loading ? 'Saving...' : 'Update Store Config'}</button>
      </div>

      <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl">
        <h2 className="text-xl font-black text-white uppercase italic flex items-center gap-2"><ImageIcon size={20} className="text-purple-500"/> Promotion Banners</h2>
        <div className="flex gap-2">
           <input value={newBanner} onChange={(e)=>setNewBanner(e.target.value)} className="flex-1 bg-slate-700 p-4 rounded-2xl outline-none text-xs" placeholder="Paste ImgBB Link" />
           <button onClick={async () => { if(newBanner) { await supabase.from('banners').insert([{image_url: newBanner}]); setNewBanner(""); fetchBanners(); } }} className="bg-white text-black p-4 rounded-2xl"><Plus/></button>
        </div>
        <div className="grid gap-4">
           {banners.map(b => (
             <div key={b.id} className="relative rounded-2xl overflow-hidden border border-white/10 h-32">
                <img src={b.image_url} className="w-full h-full object-cover" />
                <button onClick={async ()=> { await supabase.from('banners').delete().eq('id', b.id); fetchBanners(); }} className="absolute top-2 right-2 bg-red-600 p-2 rounded-full"><Trash2 size={14}/></button>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}
