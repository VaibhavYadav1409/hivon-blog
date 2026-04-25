import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()
    if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 })
    const apiKey = process.env.GEMINI_API_KEY
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Summarize the following blog post in approximately 200 words:\n\n${content}` }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.4 }
      })
    })
    const data = await response.json()
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!summary) return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
    return NextResponse.json({ summary })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
