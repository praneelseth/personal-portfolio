export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  tech: string[];
  order: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  dates: string;
  bullets: string[];
  order: number;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  year: number;
  order: number;
}

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "image"; url: string; alt?: string; caption?: string }
  | { type: "video"; url: string; caption?: string }
  | { type: "link"; url: string; label: string }
  | { type: "code"; language?: string; value: string }
  | { type: "math"; value: string }
  | { type: "list"; items: string[] }
  | { type: "divider" };

export interface Blog {
  id: string;
  title: string;
  slug: string;
  summary: string;
  published: boolean;
  publishedAt: string | null;
  updatedAt: string;
  content: ContentBlock[];
}
