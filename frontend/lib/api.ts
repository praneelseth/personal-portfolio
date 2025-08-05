export const BASE_URL =
  "https://us-central1-personal-portfolio.cloudfunctions.net/api";

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

type NextRequestInit = RequestInit & { next?: { revalidate: number } };

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${BASE_URL}/api/projects`, {
    next: { revalidate: 1800 }
  } as NextRequestInit);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function getExperiences(): Promise<Experience[]> {
  const res = await fetch(`${BASE_URL}/api/experiences`, {
    next: { revalidate: 1800 }
  } as NextRequestInit);
  if (!res.ok) throw new Error("Failed to fetch experiences");
  return res.json();
}

export async function getAchievements(): Promise<Achievement[]> {
  const res = await fetch(`${BASE_URL}/api/achievements`, {
    next: { revalidate: 1800 }
  } as NextRequestInit);
  if (!res.ok) throw new Error("Failed to fetch achievements");
  return res.json();
}