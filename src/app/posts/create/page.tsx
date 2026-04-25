'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function CreatePostPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()

  if (!user || (user.role !== 'author' && user.role !== 'admin')) {
    return (
      <div style={{minHeight:'100vh',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center',color:'#ff6b6b',fontSize:'18px'}}>
        Access Denied
      </div>
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)) }
  }

  const uploadImage = async () => {
    if (!image) return null
    const filename = Date.now() + '-' + image.name
    const { error } = await supabase.storage.from('post-images').upload(filename, image)
    if (error) return null
    const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(filename)
    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      setStatus('Uploading image...')
      const imageUrl = await uploadImage()
      setStatus('Generating AI summary...')
      const combinedContent = title + ' ' + body
      const summaryRes = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: combinedContent })
      })
      const summaryData = await summaryRes.json()
      setStatus('Publishing...')
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: body, image_url: imageUrl, summary: summaryData.summary || '' })
      })
      const data = await res.json()
      if (res.ok) { router.push('/posts/' + data.post.id) } else { setError(data.error || 'Failed') }
    } catch (err) { setError('Something went wrong.') }
    setLoading(false)
    setStatus('')
  }

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',padding:'60px 32px'}}>
      <div style={{maxWidth:'720px',margin:'0 auto'}}>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:'42px',fontWeight:'700',color:'#f5f0e8',marginBottom:'8px',letterSpacing:'-1px'}}>
          New Story
        </h1>
        <p style={{color:'#555',fontSize:'15px',marginBottom:'48px'}}>Share your ideas with the world</p>

        {error && (
          <div style={{background:'#1a0a0a',border:'1px solid #3a1010',color:'#ff6b6b',padding:'12px 16px',borderRadius:'6px',marginBottom:'24px',fontSize:'14px'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'28px'}}>
          <div>
            <label style={{display:'block',color:'#555',fontSize:'12px',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'10px'}}>Title</label>
            <input type='text' value={title} onChange={e => setTitle(e.target.value)} required placeholder='Your story title...'
              style={{width:'100%',background:'#111',border:'1px solid #222',borderRadius:'6px',padding:'16px',fontSize:'20px',color:'#f5f0e8',outline:'none',boxSizing:'border-box',fontFamily:'Georgia,serif'}} />
          </div>

          <div>
            <label style={{display:'block',color:'#555',fontSize:'12px',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'10px'}}>Featured Image</label>
            <input type='file' accept='image/*' onChange={handleImageChange}
              style={{color:'#666',fontSize:'14px',width:'100%',background:'#111',border:'1px solid #222',borderRadius:'6px',padding:'12px 16px',boxSizing:'border-box'}} />
            {imagePreview && (
              <img src={imagePreview} alt='Preview' style={{marginTop:'12px',height:'200px',width:'100%',objectFit:'cover',borderRadius:'6px'}} />
            )}
          </div>

          <div>
            <label style={{display:'block',color:'#555',fontSize:'12px',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'10px'}}>Content</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} required rows={18} placeholder='Write your story here...'
              style={{width:'100%',background:'#111',border:'1px solid #222',borderRadius:'6px',padding:'16px',fontSize:'16px',color:'#f5f0e8',outline:'none',fontFamily:'Georgia,serif',lineHeight:'1.7',boxSizing:'border-box',resize:'vertical'}} />
          </div>

          <div style={{background:'#111',border:'1px solid #1f1f1f',borderLeft:'3px solid #e8c547',borderRadius:'6px',padding:'14px 16px',fontSize:'13px',color:'#555'}}>
            AI summary will be auto-generated when you publish
          </div>

          <button type='submit' disabled={loading}
            style={{background:'#e8c547',color:'#0a0a0a',border:'none',borderRadius:'6px',padding:'16px',fontSize:'16px',fontWeight:'700',cursor:'pointer',opacity:loading?0.7:1}}>
            {loading ? (status || 'Publishing...') : 'Publish Story'}
          </button>
        </form>
      </div>
    </div>
  )
}