#!/usr/bin/env ts-node
/**
 * Seed dummy blog posts to Firestore.
 *
 * Usage (from project root):
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json npx ts-node --project scripts/tsconfig.json scripts/seedBlogs.ts
 */

import { initializeApp, applicationDefault, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

if (!getApps().length) {
  const credential = process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? applicationDefault()
    : cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      });
  initializeApp({ credential });
}

const db = getFirestore();

const posts = [
  {
    title: "Hello World",
    slug: "hello-world",
    summary: "First post on the new site — what this blog is about.",
    published: true,
    publishedAt: Timestamp.fromDate(new Date("2025-01-15")),
    updatedAt: Timestamp.fromDate(new Date("2025-01-15")),
    content: [
      { type: "paragraph", text: "Welcome to my blog. I built this site as a place to write about things I'm learning, working on, or find interesting." },
      { type: "paragraph", text: "I'm a CS student at UT Austin interested in systems, machine learning, and building small tools. This blog is mostly for me to think out loud — but if something here is useful to you, great." },
      { type: "heading", level: 2, text: "What I'll write about" },
      { type: "paragraph", text: "Mostly technical stuff: things I built, papers I read, bugs I spent too long on. Occasionally non-technical." },
      { type: "code", language: "bash", value: "# the build command for this site\npnpm build" },
    ],
  },
  {
    title: "Notes on Operating Systems",
    slug: "notes-on-operating-systems",
    summary: "A few things that clicked after taking OS.",
    published: true,
    publishedAt: Timestamp.fromDate(new Date("2025-02-03")),
    updatedAt: Timestamp.fromDate(new Date("2025-02-03")),
    content: [
      { type: "heading", level: 2, text: "Processes vs Threads" },
      { type: "paragraph", text: "A process has its own address space. A thread shares the address space of its process. This is the key distinction — everything else follows from it." },
      { type: "heading", level: 2, text: "Scheduling" },
      { type: "paragraph", text: "The scheduler decides which thread runs next. Common algorithms: Round Robin, MLFQ, CFS (Linux). MLFQ tries to approximate SJF without knowing job lengths in advance — it demotes long-running jobs to lower-priority queues." },
      { type: "heading", level: 2, text: "Virtual Memory" },
      { type: "paragraph", text: "Each process thinks it has the whole address space. The OS + hardware map virtual addresses to physical frames. Page faults happen when a page isn't in RAM — the OS fetches it from disk." },
      { type: "divider" },
      { type: "paragraph", text: "These are rough notes from the course. Highly recommend the OSTEP book if you want the full picture — it's free online." },
    ],
  },
  {
    title: "Resources I Keep Coming Back To",
    slug: "resources",
    summary: "Links I find myself re-reading.",
    published: true,
    publishedAt: Timestamp.fromDate(new Date("2025-02-10")),
    updatedAt: Timestamp.fromDate(new Date("2025-02-10")),
    content: [
      { type: "paragraph", text: "A running list of things I've found useful." },
      { type: "heading", level: 2, text: "Systems" },
      { type: "link", label: "OSTEP (Operating Systems: Three Easy Pieces)", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
      { type: "link", label: "The Little Book of Semaphores", url: "https://greenteapress.com/wp/semaphores/" },
      { type: "heading", level: 2, text: "Machine Learning" },
      { type: "link", label: "Andrej Karpathy's Neural Networks: Zero to Hero", url: "https://karpathy.ai/zero-to-hero.html" },
      { type: "link", label: "The Annotated Transformer", url: "https://nlp.seas.harvard.edu/annotated-transformer/" },
      { type: "heading", level: 2, text: "Writing" },
      { type: "link", label: "Paul Graham — Writing, Briefly", url: "http://www.paulgraham.com/writing44.html" },
    ],
  },
];

async function seed() {
  console.log("Seeding blog posts...");
  for (const post of posts) {
    const existing = await db.collection("blogs").where("slug", "==", post.slug).limit(1).get();
    if (!existing.empty) {
      console.log(`  Skipping "${post.title}" (already exists)`);
      continue;
    }
    await db.collection("blogs").add(post);
    console.log(`  Created "${post.title}"`);
  }
  console.log("Done.");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
