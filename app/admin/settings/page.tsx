"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react'

export default function Settings() {
  const [num, setNum] = useState("")
  const [adminKey, setAdminKey] = useState("")
  const [banners, setBanners] = useState<any[]>([])
  const [newBannerImg, setNewBannerImg] = useState("")
  const [newBannerLink, setNewBannerLink] = useState("")
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

  async function addBanner() {
    if(!newBannerImg) return;
    await supabase.from('banners').insert([{ image_url: newBannerImg, link_url: newBannerLink }])
    setNewBannerImg(""); setNewBannerLink(""); fetchBanners();
  }

  async function saveSettings() {
    setLoading(true)
    await supabase.from('settings').update({ whatsapp_number: num, admin_key: adminKey }).eq('id',1)
    setLoading(false)
    alert('Settings Saved!')
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-12 pb-20">
      <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl text-white">
        <h2 className="text-xl font-black uppercase italic">Dukan Settings</h2>
        <input value={num} onChange={(e)=>setNum(e.target.value)} className="w-full bg-slate-700 p-4 rounded-2xl outline-none" placeholder="WhatsApp Number" />
        <input value={adminKey} onChange={(e)=>setAdminKey(e.target.value)} className="w-full bg-slate-700 p-4 rounded-2xl outline-none font-mono" placeholder="Secret Key" />
        <button onClick={saveSettings} className="w-full bg-purple-600 p-4 rounded-2xl font-black uppercase">Save All</button>
      </div>

      <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-white/5 space-y-4 shadow-2xl text-white">
        <h2 className="text-xl font-black uppercase italic">Promotion Banners</h2>
        <input value={newBannerImg} onChange={(e)=>setNewBannerImg(e.target.value)} className="w-full bg-slate-700 p-4 rounded-2xl outline-none text-xs" placeholder="Paste Banner Image URL (ImgBB)" />
        <input value={newBannerLink} onChange={(e)=>setNewBannerLink(e.target.value)} className="w-full bg-slate-700 p-4 rounded-2xl outline-none text-xs" placeholder="Paste Product URL or External Ad Link" />
        <button onClick={addBanner} className="w-full bg-white text-black p-4 rounded-2xl font-bold">ADD BANNER</button>
        <div className="grid gap-4 mt-6">
           {banners.map(b => (
             <div key={b.id} className="relative rounded-2xl overflow-hidden border border-white/10 h-32">
                <img src={b.image_url} className="w-full h-full object-cover" />
                <p className="absolute bottom-0 bg-black/60 w-full p-1 text-[8px] truncate italic">{b.link_url}</p>
                <button onClick={async ()=> { await supabase.from('banners').delete().eq('id', b.id); fetchBanners(); }} className="absolute top-2 right-2 bg-red-600 p-2 rounded-full"><Trash2 size={14}/></button>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}
