"use client"
import { useState, useEffect } from "react"
import PostCard from "@/components/PostCard"
import { Post } from "@/types"
export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  useEffect(() => { fetchPosts() }, [page, search])
  const fetchPosts = async () => {
    setLoading(true)
    const res = await fetch("/api/posts?page=" + page + "&search=" + search)
    const data = await res.json()
    setPosts(data.posts || [])
    setTotalPages(data.totalPages || 1)
    setLoading(false)
  }
  return (
    <div style={{minHeight:"100vh",background:"#0a0a0a"}}>
      <div style={{borderBottom:"1px solid #1f1f1f",padding:"80px 32px 60px",maxWidth:"1200px",margin:"0 auto"}}>
        <div style={{display:"inline-block",background:"#1a1a0a",border:"1px solid #3a3a10",color:"#e8c547",fontSize:"11px",padding:"4px 10px",borderRadius:"3px",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:"24px",fontWeight:"600"}}>Publishing Platform</div>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"72px",fontWeight:"700",color:"#f5f0e8",lineHeight:"1.05",letterSpacing:"-2px",marginBottom:"20px",maxWidth:"700px"}}>Ideas worth<br/><span style={{color:"#e8c547"}}>reading.</span></h1>
        <p style={{color:"#555",fontSize:"18px",maxWidth:"500px",lineHeight:"1.6"}}>Discover stories, perspectives, and expertise from writers on any topic.</p>
      </div>
      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"40px 32px"}}>
        <div style={{marginBottom:"48px"}}>
          <input type="text" placeholder="Search stories..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            style={{background:"#111",border:"1px solid #222",borderRadius:"6px",padding:"14px 20px",fontSize:"15px",color:"#f5f0e8",width:"100%",maxWidth:"480px",outline:"none"}} />
        </div>
        {loading ? (
          <div style={{textAlign:"center",padding:"80px",color:"#444"}}>Loading stories...</div>
        ) : posts.length === 0 ? (
          <div style={{textAlign:"center",padding:"80px",border:"1px dashed #222",borderRadius:"8px"}}><p style={{color:"#555"}}>No stories yet.</p></div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))",gap:"24px"}}>
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}
        {totalPages > 1 && (
          <div style={{display:"flex",justifyContent:"center",gap:"12px",marginTop:"48px"}}>
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} style={{background:"#111",border:"1px solid #222",color:"#888",padding:"10px 20px",borderRadius:"6px",cursor:"pointer",opacity:page===1?0.4:1}}>Prev</button>
            <span style={{color:"#555",padding:"10px 16px"}}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} style={{background:"#111",border:"1px solid #222",color:"#888",padding:"10px 20px",borderRadius:"6px",cursor:"pointer",opacity:page===totalPages?0.4:1}}>Next</button>
          </div>
        )}
      </div>
    </div>
  )
}