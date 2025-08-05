import type { NextApiRequest, NextApiResponse } from "next";
import { neon } from "@neondatabase/serverless";
import type { Blog, ContentBlock } from "@/lib/types";

function isAdmin(req: NextApiRequest): boolean {
  return req.headers["x-admin-passphrase"] === process.env.ADMIN_PASSPHRASE;
}

function rowToBlog(row: any): Blog {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary ?? "",
    published: row.published,
    publishedAt: row.published_at ? new Date(row.published_at).toISOString() : null,
    updatedAt: new Date(row.updated_at).toISOString(),
    content: (row.content as ContentBlock[]) ?? [],
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sql = neon(process.env.POSTGRES_URL!);

  if (req.method === "GET") {
    if (req.headers["x-admin-passphrase"] && !isAdmin(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const adminMode = isAdmin(req);
    const rows = adminMode
      ? await sql`SELECT * FROM blogs ORDER BY published_at DESC NULLS LAST, updated_at DESC`
      : await sql`SELECT * FROM blogs WHERE published = true ORDER BY published_at DESC NULLS LAST`;
    return res.status(200).json((rows as any[]).map(rowToBlog));
  }

  if (req.method === "POST") {
    if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
    const { title, slug, summary, published, content } = req.body as Partial<Blog>;
    if (!title || !slug) return res.status(400).json({ error: "title and slug required" });
    const now = new Date().toISOString();
    const rows = await sql`
      INSERT INTO blogs (title, slug, summary, published, published_at, updated_at, content)
      VALUES (
        ${title},
        ${slug},
        ${summary ?? ""},
        ${published ?? false},
        ${published ? now : null},
        ${now},
        ${JSON.stringify(content ?? [])}
      )
      RETURNING id
    `;
    return res.status(201).json({ id: (rows[0] as any).id });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end();
}
