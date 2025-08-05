import type { NextApiRequest, NextApiResponse } from "next";
import { neon } from "@neondatabase/serverless";

const ALLOWED = ["experiences", "projects", "achievements"];

function isAdmin(req: NextApiRequest): boolean {
  return req.headers["x-admin-passphrase"] === process.env.ADMIN_PASSPHRASE;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { collection, id } = req.query as { collection: string; id: string };
  if (!ALLOWED.includes(collection)) return res.status(404).end();
  if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

  const sql = neon(process.env.POSTGRES_URL!);

  if (req.method === "PUT") {
    const body = req.body;
    if (collection === "experiences") {
      await sql`
        UPDATE experiences SET company = ${body.company ?? ""}, title = ${body.title ?? ""}, dates = ${body.dates ?? ""}
        WHERE id = ${id}
      `;
    } else if (collection === "projects") {
      await sql`
        UPDATE projects SET title = ${body.title ?? ""}, description = ${body.description ?? ""}, link = ${body.link ?? ""}
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE achievements SET title = ${body.title ?? ""}, issuer = ${body.issuer ?? ""}, year = ${body.year ?? null}
        WHERE id = ${id}
      `;
    }
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    if (collection === "experiences") {
      await sql`DELETE FROM experiences WHERE id = ${id}`;
    } else if (collection === "projects") {
      await sql`DELETE FROM projects WHERE id = ${id}`;
    } else {
      await sql`DELETE FROM achievements WHERE id = ${id}`;
    }
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  res.status(405).end();
}
