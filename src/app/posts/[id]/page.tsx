'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import CommentSection from '@/components/CommentSection'
import { formatDistanceToNow } from 'date-fns'

export default function PostPage() {
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => { fetchPost() }, [id])

  const fetchPost = async () => {
    const res = await fetch('/api/posts/' + id)
    const data = await res.json()
    setPost(data.post)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    const res = await fetch('/api/posts/' + id, { method: 'DELETE' })
    if (res.ok) router.push('/')
  }

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center',color:'#444',fontSize:'16px'}}>
      Loading...
    </div>
  )
  if (!post) return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center',color:'#ff6b6b',fontSize:'16px'}}>
      Post not found
    </div>
  )

  const canEdit = user && (user.id === post.author_id || user.role === 'admin')

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a'}}>
      {post.image_url && (
        <div style={{height:'420px',overflow:'hidden',position:'relative'}}>
          <img src={post.image_url} alt={post.title} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.5)'}} />
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, #0a0a0a, transparent)'}} />
        </div>
      )}

      <div style={{maxWidth:'760px',margin:'0 auto',padding:'60px 32px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'40px'}}>
          <Link href='/' style={{color:'#555',textDecoration:'none',fontSize:'13px',letterSpacing:'0.08em',textTransform:'uppercase'}}>← Back</Link>
          {canEdit && (
            <div style={{display:'flex',gap:'16px'}}>
              <Link href={'/posts/' + id + '/edit'} style={{color:'#e8c547',textDecoration:'none',fontSize:'13px',fontWeight:'600'}}>Edit</Link>
              <button onClick={handleDelete} style={{color:'#ff6b6b',background:'none',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'600'}}>Delete</button>
            </div>
          )}
        </div>

        <h1 style={{fontFamily:'Georgia,serif',fontSize:'48px',fontWeight:'700',color:'#f5f0e8',lineHeight:'1.1',letterSpacing:'-1.5px',marginBottom:'24px'}}>{post.title}</h1>

        <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'40px',paddingBottom:'32px',borderBottom:'1px solid #1a1a1a'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#1a1a0a',border:'1px solid #3a3a10',display:'flex',alignItems:'center',justifyContent:'center',color:'#e8c547',fontSize:'14px',fontWeight:'700',flexShrink:0}}>
            {post.users?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{color:'#888',fontSize:'14px',fontWeight:'600'}}>{post.users?.name || 'Unknown'}</div>
            <div style={{color:'#444',fontSize:'12px'}}>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</div>
          </div>
        </div>

        {post.summary && (
          <div style={{background:'#111',border:'1px solid #1f1f1f',borderLeft:'3px solid #e8c547',borderRadius:'6px',padding:'20px 24px',marginBottom:'40px'}}>
            <div style={{color:'#e8c547',fontSize:'11px',letterSpacing:'0.15em',textTransform:'uppercase',fontWeight:'700',marginBottom:'10px'}}>✦ AI Summary</div>
            <p style={{color:'#777',fontSize:'15px',lineHeight:'1.7',margin:0}}>{post.summary}</p>
          </div>
        )}

        <div style={{color:'#aaa',fontSize:'17px',lineHeight:'1.85',whiteSpace:'pre-wrap',fontFamily:'Georgia,serif',marginBottom:'64px'}}>{post.body}</div>

        <CommentSection postId={post.id} />
      </div>
    </div>
  )
}