"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import CommentSection from "@/components/CommentSection"
import { formatDistanceToNow } from "date-fns"

export default function PostPage() {
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => { fetchPost() }, [id])

  const fetchPost = async () => {
    const res = await fetch("/api/posts/" + id)
    const data = await res.json()
    setPost(data.post)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return
    const res = await fetch("/api/posts/" + id, { method: "DELETE" })
    if (res.ok) router.push("/")
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (!post) return <div className="text-center py-20 text-red-500">Post not found</div>

  const canEdit = user && (user.id === post.author_id || user.role === "admin")

  return (
    <article className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">By {post.users?.name} - {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</div>
          {canEdit && (
            <div className="flex gap-3">
              <Link href={"/posts/" + id + "/edit"} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</Link>
              <button onClick={handleDelete} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
            </div>
          )}
        </div>
      </div>
      {post.summary && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <span className="text-blue-600 font-semibold text-sm">AI Summary</span>
          <p className="text-gray-700 text-sm leading-relaxed mt-2">{post.summary}</p>
        </div>
      )}
      <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap mb-12">{post.body}</div>
      <CommentSection postId={post.id} />
    </article>
  )
}
