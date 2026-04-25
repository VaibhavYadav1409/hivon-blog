"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Post } from "@/types"

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const { user } = useAuth()

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const res = await fetch("/api/posts?page=1")
    const data = await res.json()
    setPosts(data.posts || [])
  }

  if (!user || user.role !== "admin") return <div className="text-center py-20 text-red-500">Admin access required</div>

  const handleDelete = async (postId: string) => {
    if (!confirm("Delete this post?")) return
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" })
    if (res.ok) setPosts(prev => prev.filter(p => p.id !== postId))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">Admin</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200"><h2 className="font-semibold text-gray-800">All Posts</h2></div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Title</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Author</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-t border-gray-100">
                <td className="p-4 text-gray-800 font-medium">{post.title}</td>
                <td className="p-4 text-gray-500">{post.users?.name}</td>
                <td className="p-4 text-gray-500 text-sm">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <Link href={`/posts/${post.id}/edit`} className="text-blue-600 hover:underline text-sm">Edit</Link>
                    <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
