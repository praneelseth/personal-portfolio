#!/usr/bin/env ts-node
/*
 * Builds frontend/public/knowledge.json with embeddings.
 */
import fs from "fs/promises";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fetch from "node-fetch";
import yaml from "yaml";

const HF_TOKEN = process.env.HF_TOKEN || process.env.NEXT_PUBLIC_HF_TOKEN;
const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const HF_ENDPOINT = `https://api-inference.huggingface.co/pipeline/feature-extraction/${encodeURIComponent(HF_MODEL)}`;

async function embed(text: string): Promise<number[]> {
  const res = await fetch(HF_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (res.status === 202) {
    console.log("Model loading at HF… waiting 15s");
    await new Promise((r) => setTimeout(r, 15000));
    return embed(text);
  }

  if (!res.ok) {
    throw new Error(`HF ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  return Array.isArray(json[0]) ? json[0] : json;
}

function chunk(text: string, size = 300): string[] {
  const chunks = [] as string[];
  for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
  return chunks;
}

async function readProjectReadme(link: string): Promise<string | undefined> {
  if (!link.includes("github.com")) return;
  const [_, user, repo] = link.split("https://github.com/")[1].split("/");
  const url = `https://raw.githubusercontent.com/${user}/${repo}/main/README.md`;
  const res = await fetch(url);
  if (!res.ok) return;
  return await res.text();
}

async function main() {
  if (!HF_TOKEN) throw new Error("HF_TOKEN env var required");
  if (!getApps().length) initializeApp({ credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS || "") });
  const db = getFirestore();
  const collections = ["projects", "experiences", "achievements"] as const;
  let corpus: { id: string; text: string }[] = [];
  for (const col of collections) {
    const snap = await db.collection(col).get();
    snap.forEach((doc) => {
      corpus.push({ id: `${col}__${doc.id}`, text: JSON.stringify(doc.data()) });
    });
  }

  // add about_me.md
  const aboutPath = path.resolve(process.cwd(), "about_me.md");
  const aboutText = await fs.readFile(aboutPath, "utf8");
  corpus.push({ id: "about_me", text: aboutText });

  // add READMEs
  for (const proj of corpus.filter((c) => c.id.startsWith("projects__"))) {
    const data = JSON.parse(proj.text);
    const readme = await readProjectReadme(data.link);
    if (readme) corpus.push({ id: `${proj.id}__readme`, text: readme });
  }

  const output: any[] = [];
  for (const item of corpus) {
    for (const piece of chunk(item.text)) {
      const vector = await embed(piece);
      output.push({ id: item.id, text: piece, vector });
    }
  }
  const outPath = path.resolve(process.cwd(), "frontend", "public", "knowledge.json");
  await fs.writeFile(outPath, JSON.stringify(output));
  console.log(`Wrote ${output.length} chunks to knowledge.json`);
}
main();