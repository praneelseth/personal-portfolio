export async function embed(text: string): Promise<number[]> {
  const res = await fetch("/api/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Embed request failed");
  }

  if (json.embedding?.values) return json.embedding.values as number[];
  if (Array.isArray(json[0])) return json[0] as number[];
  throw new Error("Unexpected embed response format");
}