"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

export default function AdminAbout() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('store_info').select('*').eq('id', 1).single().then(({data}) => data && setText(data.about_text))
  }, [])

  async function save() {
    setLoading(true)
    await supabase.from('store_info').update({ about_text: text }).eq('id', 1)
    setLoading(false)
    alert("About Us Updated!")
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Manage About Us</h2>
      <textarea 
        value={text} 
        onChange={(e)=>setText(e.target.value)}
        className="w-full bg-slate-800 p-4 rounded-2xl border border-slate-700 h-64 text-sm text-white"
        placeholder="Describe your shop..."
      />
      <button onClick={save} disabled={loading} className="w-full bg-purple-600 p-4 rounded-xl font-bold mt-4">
        {loading ? 'SAVING...' : 'UPDATE ABOUT PAGE'}
      </button>
    </div>
  )
}
