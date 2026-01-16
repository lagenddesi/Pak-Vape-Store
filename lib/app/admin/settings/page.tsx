"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminSettings() {
  const [number, setNumber] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    const { data } = await supabase.from('settings').select('whatsapp_number').eq('id', 1).single()
    if (data) setNumber(data.whatsapp_number)
  }

  async function updateSettings() {
    setLoading(true)
    const { error } = await supabase.from('settings').update({ whatsapp_number: number }).eq('id', 1)
    if (!error) alert("WhatsApp Number Updated Successfully!")
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Store Settings</h2>
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <label className="block text-sm font-medium text-slate-400 mb-2">Admin WhatsApp Number</label>
        <input 
          type="text" 
          value={number} 
          onChange={(e) => setNumber(e.target.value)}
          placeholder="e.g. 923001234567"
          className="w-full bg-slate-700 p-3 rounded mb-4 outline-none focus:ring-1 ring-purple-500"
        />
        <p className="text-xs text-slate-500 mb-4">* Include country code without + (e.g., 92 for Pakistan)</p>
        <button 
          onClick={updateSettings}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded font-bold transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  )
}
