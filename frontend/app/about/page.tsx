import Link from "next/link";
import Education from "@/components/Education";
import Experiences from "@/components/Experiences";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";

export default function About() {
  return (
    <main className="mx-auto max-w-[600px] px-6 pt-[12vh] pb-16 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-black">praneel seth</span>
          <nav className="flex gap-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-black transition">blog</Link>
          </nav>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          CS student at UT Austin. Interested in machine learning, systems, and building things.
        </p>
      </div>

      <section className="mb-6">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">education</div>
        <Education />
      </section>

      <section className="mb-6">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">experience</div>
        <Experiences />
      </section>

      <section className="mb-6">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">projects</div>
        <Projects />
      </section>

      <section className="mb-6">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">achievements</div>
        <Achievements />
      </section>

      <section className="mb-6">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">contact</div>
        <Contact />
      </section>
    </main>
  );
}
