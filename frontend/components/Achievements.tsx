"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { firebaseApp } from "@/utils/firebase";
import type { Achievement } from "@/lib/types";

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[] | null>(null);

  useEffect(() => {
    async function fetchAchievements() {
      const db = getFirestore(firebaseApp);
      const q = query(collection(db, "achievements"), orderBy("order", "asc"), limit(8));
      const snap = await getDocs(q);
      const data: Achievement[] = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Achievement, "id">) }));
      setAchievements(data);
    }
    fetchAchievements();
  }, []);

  if (!achievements) {
    return <div className="mb-10 text-gray-500">Loading achievements…</div>;
  }

  return (
    <ul className="mb-10 space-y-3">
      {achievements.map(ach => (
        <li key={ach.id} className="flex items-center">
          <span className="mr-3 font-semibold text-gray-600">{ach.year}</span>
          <span className="font-medium">{ach.title}</span>
          <span className="text-gray-500 ml-2 italic">– {ach.issuer}</span>
        </li>
      ))}
    </ul>
  );
}