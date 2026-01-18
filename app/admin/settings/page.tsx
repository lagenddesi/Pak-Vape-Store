"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Trash2, Plus, Lock, Globe, Instagram, Facebook } from 'lucide-react'

export default function Settings() {
  const [num, setNum] = useState("")
  const [adminKey, setAdminKey] = useState("")
  const [ig, setIg] = useState("")
  const [fb, setFb] = useState("")
  const [banners, setBanners] = useState<any[]>([])
  const [newBannerImg, setNewBannerImg] = useState("")
  const [newBannerLink, setNewBannerLink] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('settings').select('*').eq('id', 1).single().then(({data}) => {
      if(data) { 
        setNum(data.whatsapp_number); 
        setAdminKey(data.admin_key);
        setIg(data.instagram_url || "");
        setFb(data.facebook_url || "");
      }
    })
    fetchBanners()
  }, [])

  async function fetchBanners() {
    const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false })
    if(data) setBanners(data)
  }

  async function saveSettings() {
    setLoading(true)
    await supabase.from('settings').update({ 
      whatsapp_number: num, 
      admin_key: adminKey,
      instagram_url: ig,
      facebook_url: fb
    }).eq('id',1)
    setLoading(false)
    alert('All Settings Saved!')
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-12 pb-20 text-white">
      <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl">
        <h2 className="text-xl font-black uppercase italic flex items-center gap-2 text-purple-400">Store Configuration</h2>
        
        <div className="space-y-4">
          <input value={num} onChange={(e)=>setNum(e.target.value)} className="w-full bg-slate-700 p-4 rounded-2xl outline-none" placeholder="WhatsApp (923...)" />
          <input value={adminKey} onChange={(e)=>setAdminKey(e.target.value)} className="w-full bg-slate-700 p-4 rounded-2xl outline-none" placeholder="Secret Key" />
          
          <div className="flex gap-2">
            <div className="bg-slate-900 p-4 rounded-2xl border border-white/5"><Instagram size={20}/></div>
            <input value={ig} onChange={(e)=>setIg(e.target.value)} className="flex-1 bg-slate-700 p-4 rounded-2xl outline-none" placeholder="Instagram Profile Link" />
          </div>

          <div className="flex gap-2">
            <div className="bg-slate-900 p-4 rounded-2xl border border-white/5"><Facebook size={20}/></div>
            <input value={fb} onChange={(e)=>setFb(e.target.value)} className="flex-1 bg-slate-700 p-4 rounded-2xl outline-none" placeholder="Facebook Page Link" />
          </div>
        </div>

        <button onClick={saveSettings} className="w-full bg-purple-600 p-4 rounded-2xl font-black uppercase">Save Settings</button>
      </div>

      <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-white/5 space-y-4 shadow-2xl">
        <h2 className="text-xl font-black uppercase italic text-purple-400">Banners</h2>
        <input value={newBannerImg} onChange={(e)=>setNewBannerImg(e.target.value)} className="w-full bg-slate-700 p-4 rounded-2xl outline-none text-xs" placeholder="Banner Image URL" />
        <input value={newBannerLink} onChange={(e)=>setNewBannerLink(e.target.value)} className="w-full bg-slate-700 p-4 rounded-2xl outline-none text-xs" placeholder="Click Link (Product URL)" />
        <button onClick={async () => { if(newBannerImg) { await supabase.from('banners').insert([{image_url: newBannerImg, link_url: newBannerLink}]); setNewBannerImg(""); setNewBannerLink(""); fetchBanners(); } }} className="w-full bg-white text-black p-4 rounded-2xl font-bold">ADD BANNER</button>
        <div className="grid gap-4 mt-6">
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
