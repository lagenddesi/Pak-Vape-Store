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
    if (!error) alert("About Us Updated Successfully!")
    else alert("Error saving data!")
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-2xl font-black mb-6 text-white uppercase italic tracking-tighter">Edit About Content</h2>
      <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
        <textarea 
          value={text} 
          onChange={(e)=>setText(e.target.value)}
          className="w-full bg-slate-900 p-5 rounded-2xl border border-slate-700 h-80 text-sm text-slate-300 outline-none focus:ring-1 ring-purple-500 mb-6"
          placeholder="Write your shop's about content here..."
        />
        <button 
          onClick={save} 
          disabled={loading} 
          className="w-full bg-purple-600 hover:bg-purple-700 p-4 rounded-2xl font-black uppercase tracking-widest transition shadow-lg shadow-purple-500/20"
        >
          {loading ? 'UPLOADING...' : 'SAVE CHANGES'}
        </button>
      </div>
    </div>
  )
}
