import type { ContentBlock } from "./types";

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
        case "image":     return `![${block.alt ?? ""}](${block.url})`;
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

    // Image: ![alt](url)
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushParagraph();
      blocks.push({ type: "image", alt: imageMatch[1] || undefined, url: imageMatch[2] });
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
