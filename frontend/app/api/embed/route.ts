import { NextRequest } from "next/server";

export const runtime = "edge"; // lightweight, fetch-friendly

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response("Missing 'text' field", { status: 400 });
    }

    const key = process.env.GOOGLE_API_KEY;
    if (!key) {
      return new Response("Server mis-config: GOOGLE_API_KEY not set", { status: 500 });
    }

    const googleRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text }] }
        })
      }
    );

    const body = await googleRes.text();
    return new Response(body, {
      status: googleRes.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(`Internal error: ${err.message}`, { status: 500 });
  }
}