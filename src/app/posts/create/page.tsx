"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function CreatePostPage() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()

  if (!user || (user.role !== "author" && user.role !== "admin")) {
    return <div className="text-center py-20 text-red-500">Access Denied</div>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      setStatus("Generating AI summary...")
      const summaryRes = await fetch("/api/generate-summary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: title + "\n\n" + body }) })
      const summaryData = await summaryRes.json()
      setStatus("Publishing post...")
      const res = await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, content: body, summary: summaryData.summary || "" }) })
      const data = await res.json()
      if (res.ok) { router.push("/posts/" + data.post.id) } else { setError(data.error || "Failed to create post") }
    } catch { setError("Something went wrong.") }
    setLoading(false)
    setStatus("")
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Post</h1>
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
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold text-lg">{loading ? status || "Publishing..." : "Publish Post"}</button>
      </form>
    </div>
  )
}
