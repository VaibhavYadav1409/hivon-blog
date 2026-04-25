const fs = require('fs');

fs.writeFileSync('src/components/Navbar.tsx', `"use client"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
export default function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const handleSignOut = async () => { await signOut(); router.push("/") }
  return (
    <nav style={{background:"#0a0a0a",borderBottom:"1px solid #1f1f1f",padding:"0 32px",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
      <Link href="/" style={{fontFamily:"Georgia,serif",fontSize:"22px",fontWeight:"700",color:"#f5f0e8",textDecoration:"none"}}>Hivon<span style={{color:"#e8c547"}}>Blog</span></Link>
      <div style={{display:"flex",alignItems:"center",gap:"24px"}}>
        <Link href="/" style={{color:"#888",textDecoration:"none",fontSize:"13px",textTransform:"uppercase",letterSpacing:"0.08em"}}>Home</Link>
        {user ? (
          <>
            {(user.role==="author"||user.role==="admin") && <Link href="/posts/create" style={{background:"#e8c547",color:"#0a0a0a",padding:"8px 18px",borderRadius:"4px",textDecoration:"none",fontSize:"13px",fontWeight:"700",textTransform:"uppercase"}}>+ Write</Link>}
            {user.role==="admin" && <Link href="/admin" style={{color:"#888",textDecoration:"none",fontSize:"13px",textTransform:"uppercase"}}>Admin</Link>}
            <span style={{color:"#555",fontSize:"13px",background:"#161616",padding:"6px 12px",borderRadius:"4px",border:"1px solid #222"}}>{user.name} <span style={{color:"#e8c547",fontSize:"11px"}}>{user.role}</span></span>
            <button onClick={handleSignOut} style={{color:"#555",background:"none",border:"none",cursor:"pointer",fontSize:"13px"}}>Sign out</button>
          </>
        ) : (
          <>
            <Link href="/auth/login" style={{color:"#888",textDecoration:"none",fontSize:"13px",textTransform:"uppercase"}}>Login</Link>
            <Link href="/auth/signup" style={{background:"#e8c547",color:"#0a0a0a",padding:"8px 18px",borderRadius:"4px",textDecoration:"none",fontSize:"13px",fontWeight:"700",textTransform:"uppercase"}}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}`, 'utf8');
console.log('Navbar done');

fs.writeFileSync('src/app/page.tsx', `"use client"
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
}`, 'utf8');
console.log('Home done');

fs.writeFileSync('src/components/PostCard.tsx', `import Link from "next/link"
import { Post } from "@/types"
import { formatDistanceToNow } from "date-fns"
export default function PostCard({ post }: { post: Post }) {
  return (
    <article style={{background:"#111",border:"1px solid #1f1f1f",borderRadius:"8px",overflow:"hidden"}}>
      {post.image_url && <div style={{height:"180px",overflow:"hidden"}}><img src={post.image_url} alt={post.title} style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.85)"}} /></div>}
      <div style={{padding:"24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"}}>
          <span style={{background:"#1a1a0a",border:"1px solid #3a3a10",color:"#e8c547",fontSize:"10px",padding:"3px 8px",borderRadius:"3px",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:"600"}}>{post.users?.role||"author"}</span>
          <span style={{color:"#444",fontSize:"12px"}}>{formatDistanceToNow(new Date(post.created_at),{addSuffix:true})}</span>
        </div>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:"20px",fontWeight:"700",color:"#f5f0e8",marginBottom:"10px",lineHeight:"1.3"}}>{post.title}</h2>
        {post.summary && <p style={{color:"#666",fontSize:"14px",lineHeight:"1.6",marginBottom:"20px"}}>{post.summary}</p>}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:"1px solid #1a1a1a",paddingTop:"16px"}}>
          <span style={{color:"#555",fontSize:"13px"}}>By <span style={{color:"#888"}}>{post.users?.name||"Unknown"}</span></span>
          <Link href={"/posts/"+post.id} style={{color:"#e8c547",textDecoration:"none",fontSize:"13px",fontWeight:"600"}}>Read →</Link>
        </div>
      </div>
    </article>
  )
}`, 'utf8');
console.log('PostCard done');

fs.writeFileSync('src/app/globals.css', `* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #0a0a0a; }`, 'utf8');
console.log('CSS done');

console.log('ALL DONE!');
