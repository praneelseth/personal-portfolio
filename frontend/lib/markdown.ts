import type { ContentBlock } from "./types";

function formatImageMarkdown(block: Extract<ContentBlock, { type: "image" }>): string {
  const options: string[] = [];
  if (block.width) options.push(`width=${block.width}`);
  if (block.height) options.push(`height=${block.height}`);
  if (block.align) options.push(`align=${block.align}`);

  const suffix = options.length > 0 ? ` | ${options.join(" | ")}` : "";
  return `![${block.alt ?? ""}](${block.url}${suffix})`;
}

function parseImageMetadata(raw: string) {
  const parts = raw.split("|").map(part => part.trim()).filter(Boolean);
  const url = parts[0] ?? "";
  let width: string | undefined;
  let height: string | undefined;
  let align: "center" | "left" | "right" | undefined;

  for (const part of parts.slice(1)) {
    const widthMatch = part.match(/^width\s*=\s*(.+)$/i);
    if (widthMatch) {
      width = widthMatch[1].trim();
      continue;
    }

    const heightMatch = part.match(/^height\s*=\s*(.+)$/i);
    if (heightMatch) {
      height = heightMatch[1].trim();
      continue;
    }

    const alignMatch = part.match(/^align\s*=\s*(center|left|right)$/i);
    if (alignMatch) {
      align = alignMatch[1].toLowerCase() as "center" | "left" | "right";
      continue;
    }

    const centeredMatch = part.match(/^(center|centre|centered)$/i);
    if (centeredMatch) {
      align = "center";
      continue;
    }

    const sizeMatch = part.match(/^(\d+(?:\.\d+)?)(px|%)?$/i);
    if (sizeMatch) {
      width = `${sizeMatch[1]}${sizeMatch[2] ?? "px"}`;
      continue;
    }

    const dimsMatch = part.match(/^(\d+(?:\.\d+)?)(px|%)?x(\d+(?:\.\d+)?)(px|%)?$/i);
    if (dimsMatch) {
      width = `${dimsMatch[1]}${dimsMatch[2] ?? "px"}`;
      height = `${dimsMatch[3]}${dimsMatch[4] ?? "px"}`;
    }
  }

  return { url, width, height, align };
}

export function blocksToMarkdown(blocks: ContentBlock[]): string {
  return blocks
    .map(block => {
      switch (block.type) {
        case "paragraph": return block.text;
        case "heading":   return "#".repeat(block.level) + " " + block.text;
        case "code":      return "```" + (block.language ?? "") + "\n" + block.value + "\n```";
        case "math":      return "$$\n" + block.value + "\n$$";
        case "list":      return block.items.map(item => "* " + item).join("\n");
        case "divider":   return "---";
        case "link":      return `[${block.label}](${block.url})`;
        case "image":     return formatImageMarkdown(block);
        case "video":     return block.url;
        default:          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

export function markdownToBlocks(md: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = md.split("\n");
  let i = 0;
  let paragraphLines: string[] = [];

  function flushParagraph() {
    const text = paragraphLines.join("\n").trim();
    if (text) blocks.push({ type: "paragraph", text });
    paragraphLines = [];
  }

  while (i < lines.length) {
    const line = lines[i];

    // Display math block: $$
    if (line.trim() === "$$") {
      flushParagraph();
      const mathLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "$$") {
        mathLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "math", value: mathLines.join("\n") });
      i++;
      continue;
    }

    // Fenced code block
    if (line.startsWith("```")) {
      flushParagraph();
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", language: language || undefined, value: codeLines.join("\n") });
      i++;
      continue;
    }

    // Heading (# / ## / ###)
    const headingMatch = line.match(/^(#{1,3}) (.+)/);
    if (headingMatch) {
      flushParagraph();
      const level = headingMatch[1].length as 1 | 2 | 3;
      blocks.push({ type: "heading", level, text: headingMatch[2].trim() });
      i++;
      continue;
    }

    // Divider
    if (line.trim() === "---") {
      flushParagraph();
      blocks.push({ type: "divider" });
      i++;
      continue;
    }

    // Image: ![alt](url) or ![alt](url | width=60% | align=center)
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushParagraph();
      const { url, width, height, align } = parseImageMetadata(imageMatch[2].trim());
      blocks.push({ type: "image", alt: imageMatch[1] || undefined, url, width, height, align });
      i++;
      continue;
    }

    // Link: [label](url)
    const linkMatch = line.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      flushParagraph();
      blocks.push({ type: "link", label: linkMatch[1], url: linkMatch[2] });
      i++;
      continue;
    }

    // List item: * or -
    if (/^[*-] /.test(line)) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length && /^[*-] /.test(lines[i])) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // Blank line — flush accumulated paragraph
    if (line.trim() === "") {
      flushParagraph();
      i++;
      continue;
    }

    // Regular text — accumulate into paragraph
    paragraphLines.push(line);
    i++;
  }

  flushParagraph();
  return blocks;
}
