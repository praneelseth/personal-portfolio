import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  const key = process.env.GOOGLE_API_KEY;
  if (!key) return res.status(500).json({ error: "Server misconfig: GOOGLE_API_KEY missing" });

  const model = process.env.GEMINI_MODEL || "gemini-1.0-pro"; // valid examples: gemini-1.0-pro, gemini-1.0-pro-vision, gemini-1.5-flash
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    const googleRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": key
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const body = await googleRes.json();
    return res.status(googleRes.status).json(body);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}