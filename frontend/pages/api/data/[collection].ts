import type { NextApiRequest, NextApiResponse } from "next";
import { neon } from "@neondatabase/serverless";

const ALLOWED = ["experiences", "projects", "achievements"];

function isAdmin(req: NextApiRequest): boolean {
  return req.headers["x-admin-passphrase"] === process.env.ADMIN_PASSPHRASE;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { collection } = req.query as { collection: string };
  if (!ALLOWED.includes(collection)) return res.status(404).end();

  const sql = neon(process.env.POSTGRES_URL!);

  if (req.method === "GET") {
    let rows;
    if (collection === "experiences") {
      rows = await sql`SELECT * FROM experiences ORDER BY "order" ASC`;
    } else if (collection === "projects") {
      rows = await sql`SELECT * FROM projects ORDER BY "order" ASC`;
    } else {
      rows = await sql`SELECT * FROM achievements ORDER BY "order" ASC`;
    }
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
    const body = req.body;

    let maxRows;
    if (collection === "experiences") {
      maxRows = await sql`SELECT COALESCE(MAX("order"), 0) as max_order FROM experiences`;
    } else if (collection === "projects") {
      maxRows = await sql`SELECT COALESCE(MAX("order"), 0) as max_order FROM projects`;
    } else {
      maxRows = await sql`SELECT COALESCE(MAX("order"), 0) as max_order FROM achievements`;
    }
    const nextOrder = ((maxRows[0] as any).max_order as number) + 1;

    let newRows;
    if (collection === "experiences") {
      newRows = await sql`
        INSERT INTO experiences (company, title, dates, "order")
        VALUES (${body.company ?? ""}, ${body.title ?? ""}, ${body.dates ?? ""}, ${nextOrder})
        RETURNING id
      `;
    } else if (collection === "projects") {
      newRows = await sql`
        INSERT INTO projects (title, description, link, "order")
        VALUES (${body.title ?? ""}, ${body.description ?? ""}, ${body.link ?? ""}, ${nextOrder})
        RETURNING id
      `;
    } else {
      newRows = await sql`
        INSERT INTO achievements (title, issuer, year, "order")
        VALUES (${body.title ?? ""}, ${body.issuer ?? ""}, ${body.year ?? null}, ${nextOrder})
        RETURNING id
      `;
    }
    return res.status(201).json({ id: (newRows[0] as any).id });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end();
}
