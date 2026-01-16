"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

export default function Settings() {
  const [num, setNum] = useState("")
  const [adminKey, setAdminKey] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('settings').select('*').eq('id', 1).single().then(({data}) => {
      if(data) {
        setNum(data.whatsapp_number)
        setAdminKey(data.admin_key)
      }
    })
  }, [])

  async function save() {
    setLoading(true)
    const { error } = await supabase.from('settings').update({
      whatsapp_number: num,
      admin_key: adminKey
    }).eq('id',1)
    
    setLoading(false)
    if (!error) {
      // Agar key badli hai to naye key se login karna parega
      localStorage.setItem('admin_access', adminKey)
      alert('Settings & Key Updated!')
    }
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-xl font-bold mb-6 text-white uppercase tracking-wider text-center italic">Store Security & Settings</h2>
      <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-2xl space-y-6">
        <div>
          <label className="text-[10px] text-slate-500 font-bold uppercase mb-2 block tracking-widest">WhatsApp Number</label>
          <input value={num} onChange={(e)=>setNum(e.target.value)} className="w-full bg-slate-700 p-3 rounded-xl text-white outline-none focus:ring-1 ring-purple-500" />
        </div>

        <div>
          <label className="text-[10px] text-slate-500 font-bold uppercase mb-2 block tracking-widest">Secret Admin Key 🔑</label>
          <input value={adminKey} onChange={(e)=>setAdminKey(e.target.value)} className="w-full bg-slate-700 p-3 rounded-xl text-white outline-none focus:ring-1 ring-purple-500 font-mono" />
        </div>

        <button onClick={save} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 p-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20">
           {loading ? 'SAVING...' : 'UPDATE ALL SETTINGS'}
        </button>
      </div>
    </div>
  )
}
