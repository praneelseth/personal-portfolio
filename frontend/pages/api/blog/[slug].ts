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
  const { slug } = req.query as { slug: string };

  if (req.method === "GET") {
    const rows = await sql`SELECT * FROM blogs WHERE slug = ${slug}`;
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(rowToBlog(rows[0] as any));
  }

  if (req.method === "PUT") {
    if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
    const rows = await sql`SELECT * FROM blogs WHERE slug = ${slug}`;
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    const curr = rows[0] as any;
    const body = req.body as Partial<Blog>;

    const title = body.title ?? curr.title;
    const summary = body.summary ?? curr.summary;
    const content = body.content !== undefined ? JSON.stringify(body.content) : JSON.stringify(curr.content);
    const published = body.published ?? curr.published;
    const publishedAt = body.publishedAt !== undefined
      ? (body.publishedAt ?? null)
      : published && !curr.published
        ? new Date().toISOString()
        : curr.published_at ?? null;

    await sql`
      UPDATE blogs SET
        title = ${title},
        summary = ${summary},
        content = ${content},
        published = ${published},
        published_at = ${publishedAt},
        updated_at = NOW()
      WHERE slug = ${slug}
    `;
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
    await sql`DELETE FROM blogs WHERE slug = ${slug}`;
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end();
}
