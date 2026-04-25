export interface User {
  id: string
  name: string
  email: string
  role: "viewer" | "author" | "admin"
  created_at: string
}

export interface Post {
  id: string
  title: string
  body: string
  summary?: string
  image_url?: string
  author_id: string
  created_at: string
  updated_at: string
  users?: {
    id: string
    name: string
    email: string
    role: string
  }
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  comment_text: string
  created_at: string
  users?: {
    name: string
    role: string
  }
}
