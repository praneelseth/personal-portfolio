"use client";

import React from "react";
import katex from "katex";
import type { ContentBlock } from "@/lib/types";

function renderInline(text: string): React.ReactNode[] {
  // Split on inline math $...$ and inline links [label](url)
  const parts = text.split(/(\$(?!\$)[^$]+\$|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    // Inline math
    if (part.startsWith("$") && part.endsWith("$") && !part.startsWith("$$")) {
      const math = part.slice(1, -1);
      const html = katex.renderToString(math, { throwOnError: false, displayMode: false });
      return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
    }
    // Inline link
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">{linkMatch[1]}</a>;
    }
    return <span key={i}>{part}</span>;
  });
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph": {
      const lines = block.text.split("\n");
      return (
        <p className="text-sm leading-relaxed text-gray-800 mb-4">
          {lines.map((line, i) => (
            <React.Fragment key={i}>
              {renderInline(line)}
              {i < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    }

    case "heading": {
      const Tag = `h${block.level}` as "h1" | "h2" | "h3";
      const sizes = { 1: "text-base font-semibold mt-6 mb-3", 2: "text-sm font-semibold mt-5 mb-2", 3: "text-sm font-medium mt-4 mb-2" };
      return <Tag className={`${sizes[block.level]} text-black`}>{block.text}</Tag>;
    }

    case "math": {
      const html = katex.renderToString(block.value, { throwOnError: false, displayMode: true });
      return <div className="mb-4 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />;
    }

    case "image":
      return (
        <figure className="mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.url} alt={block.alt ?? ""} className="w-full" />
          {block.caption && (
            <figcaption className="text-xs text-gray-500 mt-1">{block.caption}</figcaption>
          )}
        </figure>
      );

    case "video": {
      const ytId = getYouTubeId(block.url);
      return (
        <figure className="mb-4">
          {ytId ? (
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${ytId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video src={block.url} controls className="w-full" />
          )}
          {block.caption && (
            <figcaption className="text-xs text-gray-500 mt-1">{block.caption}</figcaption>
          )}
        </figure>
      );
    }

    case "link":
      return (
        <div className="mb-4">
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-700 underline hover:text-blue-900"
          >
            {block.label}
          </a>
        </div>
      );

    case "code":
      return (
        <pre className="bg-gray-100 border border-gray-200 text-xs p-4 overflow-x-auto mb-4 leading-relaxed">
          <code>{block.value}</code>
        </pre>
      );

    case "list":
      return (
        <ul className="list-disc list-outside pl-5 mb-4 space-y-1">
          {block.items.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed text-gray-800">{renderInline(item)}</li>
          ))}
        </ul>
      );

    case "divider":
      return <hr className="border-gray-200 my-6" />;

    default:
      return null;
  }
}

export default function BlogPost({ content }: { content: ContentBlock[] }) {
  return (
    <div>
      {content.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
