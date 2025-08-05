import { getAchievements } from "@/lib/api";

export default async function Achievements() {
  const achievements = await getAchievements();

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