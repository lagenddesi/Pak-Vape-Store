"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

export default function Settings() {
  const [num, setNum] = useState("")
  useEffect(() => {
    supabase.from('settings').select('*').eq('id', 1).single().then(({data}) => data && setNum(data.whatsapp_number))
  }, [])

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-xl font-bold mb-4">WhatsApp Settings</h2>
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <input value={num} onChange={(e)=>setNum(e.target.value)} className="w-full bg-slate-700 p-3 rounded mb-4" placeholder="923XXXXXXXXX" />
        <button onClick={async () => {await supabase.from('settings').update({whatsapp_number: num}).eq('id',1); alert('Saved!')}} className="w-full bg-purple-600 p-3 rounded font-bold">SAVE NUMBER</button>
      </div>
    </div>
  )
}
