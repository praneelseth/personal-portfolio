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