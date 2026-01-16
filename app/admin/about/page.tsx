"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

export default function AdminAbout() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('store_info').select('*').eq('id', 1).single().then(({data}) => {
      if(data) setText(data.about_text)
    })
  }, [])

  async function save() {
    setLoading(true)
    const { error } = await supabase.from('store_info').update({ about_text: text }).eq('id', 1)
    setLoading(false)
    if (!error) alert("About Us Updated!")
    else alert("Error updating!")
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-white uppercase tracking-tighter">Manage About Us</h2>
      <textarea 
        value={text} 
        onChange={(e)=>setText(e.target.value)}
        className="w-full bg-slate-800 p-4 rounded-2xl border border-slate-700 h-64 text-sm text-white outline-none focus:ring-1 ring-purple-500"
        placeholder="Describe your shop..."
      />
      <button onClick={save} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 p-4 rounded-xl font-bold mt-4 transition">
        {loading ? 'SAVING...' : 'UPDATE ABOUT PAGE'}
      </button>
    </div>
  )
}
