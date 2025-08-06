"use client";
import { useState } from "react";
export type KnowledgeChunk = { id: string; text: string; vector: number[] };
let cache: KnowledgeChunk[] | null = null;
export async function loadKnowledge(): Promise<KnowledgeChunk[]> {
  if (cache) return cache;
  const res = await fetch("/knowledge.json");
  cache = await res.json();
  return cache!;
}
// cosine similarity
export function similarity(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}