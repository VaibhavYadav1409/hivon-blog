"use client"
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
}