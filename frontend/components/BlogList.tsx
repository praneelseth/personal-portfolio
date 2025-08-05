"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { Blog } from "@/lib/types";
import AdminGate, { useAdmin } from "./AdminGate";
import WebringWidget from "./WebringWidget";
import { markdownToBlocks } from "@/lib/markdown";

function formatDate(iso: string | null) {
  if (!iso) return "draft";
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

interface NewPostForm {
  title: string;
  slug: string;
  summary: string;
  published: boolean;
  markdown: string;
}

export default function BlogList({ initialData }: { initialData?: Blog[] }) {
  const [blogs, setBlogs] = useState<Blog[] | null>(initialData ?? null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newPost, setNewPost] = useState<NewPostForm>({
    title: "",
    slug: "",
    summary: "",
    published: false,
    markdown: "",
  });
  const [saving, setSaving] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { passphrase, login, logout, isAdmin } = useAdmin();

  async function fetchBlogs(pp?: string | null) {
    const headers: Record<string, string> = {};
    if (pp) headers["x-admin-passphrase"] = pp;
    try {
      const res = await fetch("/api/blog", { headers });
      if (!res.ok) { setBlogs([]); return; }
      const data: Blog[] = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch {
      setBlogs([]);
    }
  }

  useEffect(() => {
    fetchBlogs(passphrase);
  }, [passphrase]);

  function handleNameClick() {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 1500);
    if (clickCount.current >= 5) {
      clickCount.current = 0;
      if (isAdmin) logout();
      else setAdminOpen(true);
    }
  }

  async function handleDelete(slug: string) {
    if (!passphrase) return;
    if (!confirm("delete this post?")) return;
    await fetch(`/api/blog/${slug}`, {
      method: "DELETE",
      headers: { "x-admin-passphrase": passphrase },
    });
    fetchBlogs(passphrase);
  }

  async function handleTogglePublish(blog: Blog) {
    if (!passphrase) return;
    await fetch(`/api/blog/${blog.slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-passphrase": passphrase,
      },
      body: JSON.stringify({ published: !blog.published }),
    });
    fetchBlogs(passphrase);
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!passphrase || !newPost.title) return;
    setSaving(true);
    await fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-passphrase": passphrase,
      },
      body: JSON.stringify({ ...newPost, content: markdownToBlocks(newPost.markdown) }),
    });
    setSaving(false);
    setCreating(false);
    setNewPost({ title: "", slug: "", summary: "", published: false, markdown: "" });
    fetchBlogs(passphrase);
  }

  return (
    <>
      <AdminGate
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        onSuccess={p => { login(p); fetchBlogs(p); }}
      />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-black">praneel seth</span>
          <nav className="flex gap-4 text-sm text-gray-600">
            <Link href="/about" className="hover:text-black transition">about</Link>
            {isAdmin && (
              <button onClick={logout} className="text-xs text-gray-400 hover:text-red-600">
                logout
              </button>
            )}
          </nav>
        </div>

        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          check out my blog posts — most of what i care about ends up here.
        </p>

      {isAdmin && !creating && (
          <button
            onClick={() => setCreating(true)}
            className="text-xs text-gray-500 hover:text-black border border-dashed border-gray-300 px-3 py-1.5 mb-6"
          >
            + new post
          </button>
        )}

        {creating && (
          <form onSubmit={handleCreatePost} className="border border-gray-200 p-4 mb-6">
            <div className="text-xs font-medium mb-3 text-gray-700">new post</div>
            <input
              className="w-full border border-gray-300 bg-base px-2 py-1.5 text-sm outline-none focus:border-gray-500 mb-2"
              placeholder="title"
              value={newPost.title}
              required
              onChange={e => setNewPost(p => ({
                ...p,
                title: e.target.value,
                slug: slugify(e.target.value),
              }))}
            />
            <input
              className="w-full border border-gray-300 bg-base px-2 py-1.5 text-xs outline-none focus:border-gray-500 mb-2"
              placeholder="slug (auto-filled)"
              value={newPost.slug}
              onChange={e => setNewPost(p => ({ ...p, slug: e.target.value }))}
            />
            <input
              className="w-full border border-gray-300 bg-base px-2 py-1.5 text-xs outline-none focus:border-gray-500 mb-3"
              placeholder="summary (one-line teaser)"
              value={newPost.summary}
              onChange={e => setNewPost(p => ({ ...p, summary: e.target.value }))}
            />
            <textarea
              className="w-full border border-gray-300 bg-base px-3 py-2 text-sm outline-none focus:border-gray-500 font-mono leading-relaxed resize-none mb-1"
              placeholder={"# heading\n\nparagraph text\n\n```js\ncode here\n```"}
              value={newPost.markdown}
              onChange={e => setNewPost(p => ({ ...p, markdown: e.target.value }))}
              rows={10}
            />
            <div className="flex gap-3 items-center mt-3">
              <label className="flex items-center gap-1.5 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={newPost.published}
                  onChange={e => setNewPost(p => ({ ...p, published: e.target.checked }))}
                />
                publish now
              </label>
              <div className="flex-1" />
              <button type="button" onClick={() => setCreating(false)} className="text-xs text-gray-400 hover:text-black px-3 py-1.5">
                cancel
              </button>
              <button type="submit" disabled={saving} className="text-xs bg-black text-white px-3 py-1.5 disabled:opacity-40">
                {saving ? "saving..." : "create"}
              </button>
            </div>
          </form>
        )}
      </div>

      {blogs === null ? (
        <div className="text-sm text-gray-400">loading...</div>
      ) : blogs.length === 0 ? (
        <div className="text-sm text-gray-400">no posts yet.</div>
      ) : (
        <ul className="space-y-0">
          {blogs.map(blog => (
            <li key={blog.id} className="py-2 flex items-baseline gap-3 group border-b border-gray-100 last:border-b-0">
              <span className="text-xs text-gray-400 shrink-0 w-24 text-right">
                {formatDate(blog.publishedAt)}
                {!blog.published && <span className="ml-1 text-gray-300">[draft]</span>}
              </span>
              <Link
                href={`/blog/${blog.slug}`}
                className="text-sm text-black hover:underline flex-1 min-w-0"
              >
                {blog.title}
              </Link>
              {isAdmin && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => handleTogglePublish(blog)}
                    className="text-xs text-gray-400 hover:text-black"
                  >
                    {blog.published ? "unpublish" : "publish"}
                  </button>
                  <Link href={`/blog/${blog.slug}/edit`} className="text-xs text-gray-400 hover:text-black">
                    edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog.slug)}
                    className="text-xs text-red-400 hover:text-red-700"
                  >
                    delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-12 pt-4 border-t border-gray-100 flex items-center justify-between">
        <WebringWidget />
        <span
          className="text-[10px] text-gray-300 hover:text-gray-500 cursor-pointer transition-colors select-none inline-block px-2 py-2 -mx-2 -my-2"
          onClick={handleNameClick}
        >
          {isAdmin ? "● admin" : "○"}
        </span>
      </div>
    </>
  );
}
