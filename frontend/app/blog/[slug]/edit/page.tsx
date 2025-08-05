"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Blog } from "@/lib/types";
import { blocksToMarkdown, markdownToBlocks } from "@/lib/markdown";
import { useAdmin } from "@/components/AdminGate";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { passphrase, isAdmin } = useAdmin();

  const [blog, setBlog] = useState<Blog | null | "not-found">(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [published, setPublished] = useState(false);
  const [publishedDate, setPublishedDate] = useState(""); // YYYY-MM-DD
  const [markdown, setMarkdown] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then((data: Blog | null) => {
        if (!data) { setBlog("not-found"); return; }
        setBlog(data);
        setTitle(data.title);
        setSummary(data.summary);
        setPublished(data.published);
        setPublishedDate(data.publishedAt ? data.publishedAt.slice(0, 10) : "");
        setMarkdown(blocksToMarkdown(data.content));
      });
  }, [slug]);

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-[600px] px-6 pt-[12vh] pb-16">
        <div className="text-sm text-gray-500">
          not authorized. <Link href="/" className="underline">go back</Link>
        </div>
      </main>
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!passphrase) return;
    setSaving(true);
    await fetch(`/api/blog/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-passphrase": passphrase,
      },
      body: JSON.stringify({
        title, summary, published,
        publishedAt: publishedDate ? new Date(publishedDate).toISOString() : null,
        content: markdownToBlocks(markdown),
      }),
    });
    setSaving(false);
    router.push(`/blog/${slug}`);
  }

  return (
    <main className="mx-auto max-w-[600px] px-6 pt-[12vh] pb-16 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-black">praneel seth</span>
        <Link href={`/blog/${slug}`} className="text-xs text-gray-400 hover:text-black">← back to post</Link>
      </div>

      {blog === null ? (
        <div className="text-sm text-gray-400">loading...</div>
      ) : blog === "not-found" ? (
        <div className="text-sm text-gray-500">post not found.</div>
      ) : (
        <form onSubmit={handleSave}>
          <div className="text-xs text-gray-500 mb-4">editing: <span className="text-gray-700">{slug}</span></div>

          <input
            className="w-full border border-gray-300 bg-base px-2 py-1.5 text-sm outline-none focus:border-gray-500 mb-2"
            placeholder="title"
            value={title}
            required
            onChange={e => setTitle(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 bg-base px-2 py-1.5 text-xs outline-none focus:border-gray-500 mb-3"
            placeholder="summary"
            value={summary}
            onChange={e => setSummary(e.target.value)}
          />

          <textarea
            className="w-full border border-gray-300 bg-base px-3 py-2 text-sm outline-none focus:border-gray-500 font-mono leading-relaxed resize-none mb-4"
            placeholder={"# heading\n\nparagraph text\n\n```js\ncode here\n```\n\n---\n\n[link label](https://example.com)"}
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
            rows={24}
          />

          <div className="flex gap-3 items-center">
            <label className="flex items-center gap-1.5 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={published}
                onChange={e => setPublished(e.target.checked)}
              />
              published
            </label>
            <input
              type="date"
              className="border border-gray-300 bg-base px-2 py-1 text-xs outline-none focus:border-gray-500"
              value={publishedDate}
              onChange={e => setPublishedDate(e.target.value)}
            />
            <div className="flex-1" />
            <button
              type="submit"
              disabled={saving}
              className="text-xs bg-black text-white px-3 py-1.5 disabled:opacity-40"
            >
              {saving ? "saving..." : "save"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
