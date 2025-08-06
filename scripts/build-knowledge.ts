#!/usr/bin/env ts-node
/*
 * Builds frontend/public/knowledge.json with embeddings using Google AI.
 */
import fs from "fs/promises";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fetch from "node-fetch";

// --- Google AI Configuration ---
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_EMBEDDING_MODEL = "text-embedding-004";
const GOOGLE_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_EMBEDDING_MODEL}:embedContent?key=${GOOGLE_API_KEY}`;
// --- End of Google AI Configuration ---

/**
 * Creates a vector embedding for a given text using the Google AI API.
 * @param text The string to embed.
 * @returns A promise that resolves to an array of numbers (the vector).
 */
async function embed(text: string): Promise<number[]> {
  const res = await fetch(GOOGLE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: `models/${GOOGLE_EMBEDDING_MODEL}`,
      content: {
        parts: [{ text }],
      },
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Google AI API Error: ${res.status} ${JSON.stringify(error)}`);
  }

  const json = await res.json();
  return json.embedding.values;
}

function chunk(text: string, size = 300): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

async function readProjectReadme(link: string): Promise<string | undefined> {
  if (!link.includes("github.com")) return;
  const match = link.match(/github\.com\/([^/]+\/[^/]+)/);
  if (!match) return;

  const repo = match[1].replace(/\.git$/, "");
  const url = `https://raw.githubusercontent.com/${repo}/main/README.md`;

  console.log(`Fetching README from: ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`Failed to fetch README for ${link} (Status: ${res.status})`);
    return undefined;
  }
  return await res.text();
}

async function main() {
  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY environment variable is required");
  }

  if (!getApps().length) {
    const creds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!creds) {
        throw new Error("GOOGLE_APPLICATION_CREDENTIALS environment variable is required for Firestore");
    }
    initializeApp({ credential: cert(creds) });
  }

  const db = getFirestore();
  const collections = ["projects", "experiences", "achievements"] as const;
  const corpus: { id: string; text: string }[] = [];

  for (const col of collections) {
    const snap = await db.collection(col).get();
    snap.forEach((doc) => {
      corpus.push({ id: `${col}__${doc.id}`, text: JSON.stringify(doc.data()) });
    });
  }

  const aboutPath = path.resolve(process.cwd(), "about_me.md");
  try {
    const aboutText = await fs.readFile(aboutPath, "utf8");
    corpus.push({ id: "about_me", text: aboutText });
  } catch (error) {
    console.warn(`Could not read about_me.md, skipping. Error: ${error}`);
  }

  for (const proj of corpus.filter((c) => c.id.startsWith("projects__"))) {
    const data = JSON.parse(proj.text);
    if (data.link) {
      const readme = await readProjectReadme(data.link);
      if (readme) {
        corpus.push({ id: `${proj.id}__readme`, text: readme });
      }
    }
  }

  const output: any[] = [];
  for (const item of corpus) {
    const itemChunks = chunk(item.text);
    for (let i = 0; i < itemChunks.length; i++) {
      const piece = itemChunks[i];
      // Add a small delay to be kind to the API, though Google's limits are high
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log(`Embedding chunk ${i + 1}/${itemChunks.length} for: ${item.id}`);
      const vector = await embed(piece);
      output.push({ id: item.id, text: piece, vector });
    }
  }
  
  const outPath = path.resolve(process.cwd(), "frontend", "public", "knowledge.json");
  await fs.writeFile(outPath, JSON.stringify(output, null, 2));
  console.log(`\n✅ Wrote ${output.length} chunks to knowledge.json`);
}

main().catch(error => {
  console.error("\n❌ An error occurred during script execution:");
  console.error(error);
  process.exit(1);
});