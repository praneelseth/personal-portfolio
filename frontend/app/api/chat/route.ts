import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return new Response("Missing prompt", { status: 400 });

    const key = process.env.GOOGLE_API_KEY;
    if (!key) return new Response("Server mis-config", { status: 500 });

    const googleRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: prompt }] }
          ]
        })
      }
    );

    const body = await googleRes.json();
    return new Response(JSON.stringify(body), {
      status: googleRes.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}