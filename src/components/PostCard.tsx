import Link from "next/link"
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
}