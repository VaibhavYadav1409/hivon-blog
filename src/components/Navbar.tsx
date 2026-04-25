"use client"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <nav style={{backgroundColor: "white", borderBottom: "1px solid #e5e7eb", padding: "16px 24px"}}>
      <div style={{maxWidth: "1152px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <Link href="/" style={{fontSize: "24px", fontWeight: "bold", color: "#2563eb", textDecoration: "none"}}>
          HivonBlog
        </Link>
        <div style={{display: "flex", alignItems: "center", gap: "24px"}}>
          <Link href="/" style={{color: "#4b5563", textDecoration: "none"}}>Home</Link>
          {user ? (
            <>
              {(user.role === "author" || user.role === "admin") && (
                <Link href="/posts/create" style={{backgroundColor: "#2563eb", color: "white", padding: "8px 16px", borderRadius: "8px", textDecoration: "none"}}>
                  New Post
                </Link>
              )}
              {user.role === "admin" && (
                <Link href="/admin" style={{color: "#4b5563", textDecoration: "none"}}>Admin</Link>
              )}
              <span style={{color: "#6b7280", fontSize: "14px"}}>{user.name} ({user.role})</span>
              <button onClick={handleSignOut} style={{color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "14px"}}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" style={{color: "#4b5563", textDecoration: "none"}}>Login</Link>
              <Link href="/auth/signup" style={{backgroundColor: "#2563eb", color: "white", padding: "8px 16px", borderRadius: "8px", textDecoration: "none"}}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
