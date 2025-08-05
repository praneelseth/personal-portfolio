"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { firebaseApp } from "@/utils/firebase";
import type { Project } from "@/lib/types";

export default function Projects() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      const db = getFirestore(firebaseApp);
      const q = query(collection(db, "projects"), orderBy("order", "asc"), limit(8));
      const snap = await getDocs(q);
      const data: Project[] = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Project, "id">) }));
      setProjects(data);
    }
    fetchProjects();
  }, []);

  if (!projects) {
    return <div className="mb-10 text-gray-500">Loading projects…</div>;
  }

  return (
    <div className="mb-10 space-y-4">
      {projects.map(proj => (
        <div
          key={proj.id}
          className="border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <a
            href={proj.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold text-blue-700 hover:underline"
          >
            {proj.title}
          </a>
          <p className="text-gray-800 mt-1 mb-2">{proj.description}</p>
          <div className="flex flex-wrap gap-2">
            {proj.tech.map((tag, i) => (
              <span
                key={i}
                className="inline-block bg-gray-200 text-xs font-medium px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}