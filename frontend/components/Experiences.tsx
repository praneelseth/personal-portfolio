"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { firebaseApp } from "@/utils/firebase";
import type { Experience } from "@/lib/types";

export default function Experiences() {
  const [experiences, setExperiences] = useState<Experience[] | null>(null);

  useEffect(() => {
    async function fetchExperiences() {
      const db = getFirestore(firebaseApp);
      const q = query(collection(db, "experiences"), orderBy("order", "asc"), limit(3));
      const snap = await getDocs(q);
      const data: Experience[] = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Experience, "id">) }));
      setExperiences(data);
    }
    fetchExperiences();
  }, []);

  if (!experiences) {
    return <div className="mb-10 text-gray-500">Loading experiences…</div>;
  }

  return (
    <ul className="mb-10 space-y-6">
      {experiences.map(exp => (
        <li key={exp.id}>
          <div className="font-bold text-lg">{exp.title}</div>
          <div className="text-md font-semibold text-gray-800">
            {exp.company} <span className="text-gray-500 font-normal">({exp.dates})</span>
          </div>
          <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
            {exp.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}