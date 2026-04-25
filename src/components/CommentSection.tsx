"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Comment } from "@/types"
import { formatDistanceToNow } from "date-fns"

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => { fetchComments() }, [postId])

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?post_id=${postId}`)
    const data = await res.json()
    setComments(data.comments || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setLoading(true)
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId, comment_text: newComment })
    })
    if (res.ok) {
      const data = await res.json()
      setComments(prev => [...prev, data.comment])
      setNewComment("")
    }
    setLoading(false)
  }

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h3>
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Write a comment..." rows={3} className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" disabled={loading} className="mt-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? "Posting..." : "Post Comment"}</button>
        </form>
      ) : (
        <p className="text-gray-500 mb-8"><a href="/auth/login" className="text-blue-600 underline">Login</a> to comment</p>
      )}
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-800">{comment.users?.name}</span>
              <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
            </div>
            <p className="text-gray-700">{comment.comment_text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
