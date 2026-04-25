import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get("post_id")
  if (!postId) return NextResponse.json({ error: "post_id required" }, { status: 400 })
  const { data, error } = await supabase.from("comments").select("*, users(name, role)").eq("post_id", postId).order("created_at", { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ comments: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { post_id, comment_text } = await request.json()
  const { data, error } = await supabase.from("comments").insert({ post_id, user_id: user.id, comment_text }).select("*, users(name, role)").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ comment: data }, { status: 201 })
}
