import { getExperiences } from "@/lib/api";

export default async function Experiences() {
  const experiences = await getExperiences();

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