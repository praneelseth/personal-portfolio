import { getProjects } from "@/lib/api";

export default async function Projects() {
  const projects = await getProjects();

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