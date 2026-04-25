import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  const { data, error } = await supabase.from("posts").select("*, users(id, name, email, role)").eq("id", id).single()
  if (error) return NextResponse.json({ error: "Post not found" }, { status: 404 })
  return NextResponse.json({ post: data })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data: post } = await supabase.from("posts").select("author_id").eq("id", id).single()
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (post?.author_id !== user.id && profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { title, content, image_url } = await request.json()
  const { data, error } = await supabase.from("posts").update({ title, body: content, image_url, updated_at: new Date().toISOString() }).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ post: data })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data: post } = await supabase.from("posts").select("author_id").eq("id", id).single()
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (post?.author_id !== user.id && profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { error } = await supabase.from("posts").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
