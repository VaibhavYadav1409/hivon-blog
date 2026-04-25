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
    const res = await fetch(`/api/posts?page=${page}&search=${search}`)
    const data = await res.json()
    setPosts(data.posts || [])
    setTotalPages(data.totalPages || 1)
    setLoading(false)
  }

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to HivonBlog</h1>
        <p className="text-gray-500 text-lg">Discover stories, thoughts, and ideas</p>
      </div>
      <div className="mb-8">
        <input type="text" placeholder="Search posts..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="w-full max-w-lg mx-auto block border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" />
      </div>
      {loading ? <div className="text-center py-20 text-gray-400">Loading posts...</div> : posts.length === 0 ? <div className="text-center py-20 text-gray-400">No posts found</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}
