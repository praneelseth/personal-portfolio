export async function embed(text: string): Promise<number[]> {
  const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
  const body = {
    model: "models/text-embedding-004",
    content: { parts: [{ text }] }
  };
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  );
  const json = await res.json();
  return json.embedding.values as number[];
}