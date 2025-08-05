import SectionHeading from "@/components/SectionHeading";
import Intro from "@/components/Intro";
import Experiences from "@/components/Experiences";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="mx-auto max-w-[90vw] lg:max-w-[48rem] xl:max-w-4xl px-4 py-8">
      <SectionHeading id="intro" title="Welcome" />
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