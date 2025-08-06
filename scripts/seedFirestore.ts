#!/usr/bin/env ts-node
/*
 * Uploads sample data from ./data/*.json into Firestore.
 * Requires GOOGLE_APPLICATION_CREDENTIALS or Firebase emulator running.
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs/promises";
import path from "path";

async function main() {
  if (!getApps().length) initializeApp({ credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS || "") });
  const db = getFirestore();
  const collections = ["projects", "experiences", "achievements"] as const;
  for (const col of collections) {
    const file = path.join(__dirname, "../data", `${col}.json`);
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
      const id = doc.id || doc.title.replace(/\s+/g, "-").toLowerCase();
      await db.collection(col).doc(id).set(doc, { merge: true });
    }
    console.log(`Seeded ${col}`);
  }
}
main();