import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { text } = req.body;
  if (!text || typeof text !== "string") return res.status(400).json({ error: "Missing text" });

  const key = process.env.GOOGLE_API_KEY;
  if (!key) return res.status(500).json({ error: "Server mis-config: GOOGLE_API_KEY not set" });

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
  const body = await googleRes.json();
  // Always return just the vector array for the client
  if (body.embedding?.values) return res.status(200).json(body.embedding.values);
  if (Array.isArray(body[0])) return res.status(200).json(body[0]);
  return res.status(500).json({ error: "No embedding returned", raw: body });
}