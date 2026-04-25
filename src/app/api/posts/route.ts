import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const search = searchParams.get("search") || ""
  const limit = 6
  const offset = (page - 1) * limit
  let query = supabase.from("posts").select("*, users(name, email, role)", { count: "exact" }).order("created_at", { ascending: false }).range(offset, offset + limit - 1)
  if (search) query = query.ilike("title", `%${search}%`)
  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ posts: data, total: count, page, totalPages: Math.ceil((count || 0) / limit) })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (!profile || !["author", "admin"].includes(profile.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { title, content, image_url, summary } = await request.json()
  const { data, error } = await supabase.from("posts").insert({ title, body: content, image_url, author_id: user.id, summary }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ post: data }, { status: 201 })
}
