import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
  // TEMP: return dummy AI answer for sanity check
  return res.status(200).json({
    candidates: [
      {
        content: {
          parts: [
            {
              text: `Dummy answer for: "${prompt}"\n(If you see this, the /api/chat route is reachable from ChatWidget).`
            }
          ]
        }
      }
    ]
  });
}