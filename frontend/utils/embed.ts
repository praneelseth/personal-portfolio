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

  // New API always returns the array directly
  if (Array.isArray(json)) return json as number[];
  throw new Error("Unexpected embed response format");
}