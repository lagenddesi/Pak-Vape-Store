"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

export default function Settings() {
  const [num, setNum] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('settings').select('*').eq('id', 1).single().then(({data}) => data && setNum(data.whatsapp_number))
  }, [])

  async function save() {
    setLoading(true)
    await supabase.from('settings').update({whatsapp_number: num}).eq('id',1)
    setLoading(false)
    alert('Settings Saved!')
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-xl font-bold mb-4 text-white uppercase tracking-wider text-center">Admin Settings</h2>
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
        <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">WhatsApp Number (e.g. 923001234567)</label>
        <input value={num} onChange={(e)=>setNum(e.target.value)} className="w-full bg-slate-700 p-3 rounded-lg mb-6 text-white outline-none focus:ring-1 ring-purple-500" placeholder="923XXXXXXXXX" />
        <button onClick={save} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-xl font-bold transition-all">
           {loading ? 'SAVING...' : 'SAVE SETTINGS'}
        </button>
      </div>
    </div>
  )
}
