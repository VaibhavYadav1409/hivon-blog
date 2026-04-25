'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { formatDistanceToNow } from 'date-fns'

interface Comment {
  id: string
  comment_text: string
  created_at: string
  users?: { name: string }
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => { fetchComments() }, [postId])

  const fetchComments = async () => {
    const res = await fetch('/api/comments?post_id=' + postId)
    const data = await res.json()
    setComments(data.comments || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setLoading(true)
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId, comment_text: newComment })
    })
    if (res.ok) {
      const data = await res.json()
      setComments(prev => [...prev, data.comment])
      setNewComment('')
    }
    setLoading(false)
  }

  return (
    <div style={{borderTop:'1px solid #1a1a1a',paddingTop:'48px'}}>
      <h3 style={{fontFamily:'Georgia,serif',fontSize:'24px',fontWeight:'700',color:'#f5f0e8',marginBottom:'32px'}}>
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} style={{marginBottom:'40px'}}>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder='Share your thoughts...'
            rows={4}
            style={{width:'100%',background:'#111',border:'1px solid #222',borderRadius:'6px',padding:'16px',fontSize:'15px',color:'#f5f0e8',outline:'none',fontFamily:'Georgia,serif',lineHeight:'1.6',boxSizing:'border-box',resize:'vertical',marginBottom:'12px',display:'block'}}
          />
          <button type='submit' disabled={loading}
            style={{background:'#e8c547',color:'#0a0a0a',border:'none',borderRadius:'6px',padding:'10px 24px',fontSize:'14px',fontWeight:'700',cursor:'pointer',opacity:loading?0.7:1}}>
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div style={{background:'#111',border:'1px solid #1f1f1f',borderRadius:'6px',padding:'20px',marginBottom:'32px',textAlign:'center'}}>
          <p style={{color:'#555',fontSize:'14px',margin:0}}>
            <a href='/auth/login' style={{color:'#e8c547',textDecoration:'none',fontWeight:'600'}}>Sign in</a> to join the conversation
          </p>
        </div>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        {comments.length === 0 && (
          <div style={{textAlign:'center',padding:'40px',border:'1px dashed #1a1a1a',borderRadius:'8px'}}>
            <p style={{color:'#444',fontSize:'14px',margin:0}}>No comments yet. Be the first!</p>
          </div>
        )}
        {comments.map(comment => (
          <div key={comment.id} style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:'8px',padding:'20px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
              <div style={{width:'30px',height:'30px',borderRadius:'50%',background:'#1a1a0a',border:'1px solid #2a2a10',display:'flex',alignItems:'center',justifyContent:'center',color:'#e8c547',fontSize:'12px',fontWeight:'700',flexShrink:0}}>
                {comment.users?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <span style={{color:'#888',fontSize:'14px',fontWeight:'600'}}>{comment.users?.name || 'Unknown'}</span>
              <span style={{color:'#333',fontSize:'12px'}}>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
            </div>
            <p style={{color:'#777',fontSize:'15px',lineHeight:'1.6',margin:0}}>{comment.comment_text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}