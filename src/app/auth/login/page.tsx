'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message) } else { router.push('/'); router.refresh() }
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center',padding:'32px'}}>
      <div style={{width:'100%',maxWidth:'420px'}}>
        <Link href='/' style={{fontFamily:'Georgia,serif',fontSize:'24px',fontWeight:'700',color:'#f5f0e8',textDecoration:'none',display:'block',marginBottom:'40px'}}>Hivon<span style={{color:'#e8c547'}}>Blog</span></Link>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:'36px',fontWeight:'700',color:'#f5f0e8',marginBottom:'8px',letterSpacing:'-1px'}}>Welcome back</h1>
        <p style={{color:'#555',fontSize:'15px',marginBottom:'32px'}}>Sign in to continue writing</p>
        {error && <div style={{background:'#1a0a0a',border:'1px solid #3a1010',color:'#ff6b6b',padding:'12px 16px',borderRadius:'6px',marginBottom:'24px',fontSize:'14px'}}>{error}</div>}
        <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <div>
            <label style={{display:'block',color:'#555',fontSize:'12px',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'8px'}}>Email</label>
            <input type='email' value={email} onChange={e => setEmail(e.target.value)} required placeholder='you@example.com'
              style={{width:'100%',background:'#111',border:'1px solid #222',borderRadius:'6px',padding:'14px 16px',fontSize:'15px',color:'#f5f0e8',outline:'none',boxSizing:'border-box'}} />
          </div>
          <div>
            <label style={{display:'block',color:'#555',fontSize:'12px',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'8px'}}>Password</label>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)} required placeholder='••••••••'
              style={{width:'100%',background:'#111',border:'1px solid #222',borderRadius:'6px',padding:'14px 16px',fontSize:'15px',color:'#f5f0e8',outline:'none',boxSizing:'border-box'}} />
          </div>
          <button type='submit' disabled={loading}
            style={{marginTop:'8px',background:'#e8c547',color:'#0a0a0a',border:'none',borderRadius:'6px',padding:'14px',fontSize:'15px',fontWeight:'700',cursor:'pointer',opacity:loading?0.7:1}}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'24px',color:'#444',fontSize:'14px'}}>
          No account? <Link href='/auth/signup' style={{color:'#e8c547',textDecoration:'none',fontWeight:'600'}}>Create one</Link>
        </p>
      </div>
    </div>
  )
}