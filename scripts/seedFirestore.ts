#!/usr/bin/env ts-node
import { initializeApp, applicationDefault, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs/promises";
import path from "path";

async function main() {
  if (!getApps().length) {
    const credential = process.env.GOOGLE_APPLICATION_CREDENTIALS
      ? cert(process.env.GOOGLE_APPLICATION_CREDENTIALS)
      : applicationDefault();
    initializeApp({ credential });
  }

  const db = getFirestore();
  const collections = ["projects", "experiences", "achievements"] as const;
  const dataDir = path.resolve(process.cwd(), "data");

  for (const col of collections) {
    const file = path.join(dataDir, `${col}.json`);
    const exists = await fs
      .access(file)
      .then(() => true)
      .catch(() => false);
    if (!exists) {
      console.warn(`No sample file for ${col}`);
      continue;
    }
    const docs = JSON.parse(await fs.readFile(file, "utf8"));
    for (const doc of docs) {
      const id = doc.id || String(doc.title || "doc").replace(/\s+/g, "-").toLowerCase();
      await db.collection(col).doc(id).set(doc, { merge: true });
    }
    console.log(`Seeded ${col}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});