"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function EditPostPage() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => { fetchPost() }, [id])

  const fetchPost = async () => {
    const res = await fetch("/api/posts/" + id)
    const data = await res.json()
    setTitle(data.post?.title || "")
    setBody(data.post?.body || "")
  }

  if (!user || (user.role !== "author" && user.role !== "admin")) {
    return <div className="text-center py-20 text-red-500">Access Denied</div>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/posts/" + id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, content: body }) })
    if (res.ok) { router.push("/posts/" + id) } else { const data = await res.json(); setError(data.error) }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Post</h1>
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} required rows={15} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-mono" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold">{loading ? "Saving..." : "Save Changes"}</button>
      </form>
    </div>
  )
}
