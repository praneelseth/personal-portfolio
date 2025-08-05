import SectionHeading from "@/components/SectionHeading";
import Intro from "@/components/Intro";
import Experiences from "@/components/Experiences";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-[90vw] lg:max-w-[48rem] xl:max-w-4xl px-4 py-8">
      <SectionHeading id="intro">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 justify-between">
          <div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">Praneel Seth</span>
          </div>
          <nav className="flex flex-wrap gap-4 items-center text-sm font-medium text-gray-800">
            <a href="#intro" className="hover:text-black transition">Home</a>
            <a href="#experience" className="hover:text-black transition">Experience</a>
            <a href="#projects" className="hover:text-black transition">Projects</a>
            <a href="#achievements" className="hover:text-black transition">Achievements</a>
            <a href="#contact" className="hover:text-black transition">Contact</a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 border border-black px-3 py-1 rounded font-semibold text-sm hover:bg-black hover:text-white transition"
            >
              Résumé
            </a>
          </nav>
        </div>
      </SectionHeading>
      <Intro />
      <SectionHeading id="experience" title="Experience" />
      <Experiences />
      <SectionHeading id="projects" title="Projects" />
      <Projects />
      <SectionHeading id="achievements" title="Achievements" />
      <Achievements />
      <SectionHeading id="contact" title="Contact" />
      <Contact />
    </main>
  );
}