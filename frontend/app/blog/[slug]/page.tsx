"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Blog } from "@/lib/types";
import BlogPost from "@/components/BlogPost";
import { useAdmin } from "@/components/AdminGate";

function formatDate(iso: string | null) {
  if (!iso) return "";
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [blog, setBlog] = useState<Blog | null | "not-found">(null);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setBlog(data ?? "not-found"));
  }, [slug]);

  return (
    <main className="mx-auto max-w-[600px] px-6 pt-[12vh] pb-16 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm text-black">praneel seth</span>
        <nav className="flex gap-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-black transition">← back</Link>
          <Link href="/about" className="hover:text-black transition">about</Link>
          {isAdmin && blog && blog !== "not-found" && (
            <Link href={`/blog/${slug}/edit`} className="hover:text-black transition">edit</Link>
          )}
        </nav>
      </div>

      {blog === null ? (
        <div className="text-sm text-gray-400">loading...</div>
      ) : blog === "not-found" ? (
        <div className="text-sm text-gray-500">post not found. <Link href="/" className="underline">go back</Link></div>
      ) : (
        <article>
          <h1 className="text-lg font-semibold text-black mb-1">{blog.title}</h1>
          <div className="text-xs text-gray-400 mb-6">{formatDate(blog.publishedAt)}</div>
          {blog.summary && (
            <p className="text-sm text-gray-600 mb-6 border-l-2 border-gray-200 pl-3 italic">{blog.summary}</p>
          )}
          <BlogPost content={blog.content} />
        </article>
      )}

      <div className="mt-12 pt-4 border-t border-gray-100">
        <Link href="/" className="text-xs text-gray-400 hover:text-black transition">← back</Link>
      </div>
    </main>
  );
}
