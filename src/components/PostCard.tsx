import Link from "next/link"
import { Post } from "@/types"
import { formatDistanceToNow } from "date-fns"

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
        {post.summary && <p className="text-gray-600 text-sm mb-3">{post.summary}</p>}
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-gray-400">
            <span>By {post.users?.name || "Unknown"}</span>
            <span className="mx-2">.</span>
            <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
          </div>
          <Link href={"/posts/" + post.id} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Read More</Link>
        </div>
      </div>
    </div>
  )
}
