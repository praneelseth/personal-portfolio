import SectionHeading from "@/components/SectionHeading";
import Projects from "@/components/Projects";

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-[90vw] lg:max-w-[48rem] xl:max-w-4xl px-4 py-8">
      <SectionHeading id="projects" title="Projects" />
      <Projects />
    </main>
  );
}