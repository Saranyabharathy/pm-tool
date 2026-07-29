'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email to confirm your account!')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Create an Account</h1>
        <p className="text-slate-400 text-sm mb-6 text-center">
          Enter your email to get started
        </p>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
            <input 
              type="email"
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-xs text-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2 px-3 rounded-lg">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}