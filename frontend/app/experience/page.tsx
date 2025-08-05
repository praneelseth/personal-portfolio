import SectionHeading from "@/components/SectionHeading";
import Experiences from "@/components/Experiences";

export default function ExperiencePage() {
  return (
    <main className="mx-auto max-w-[90vw] lg:max-w-[48rem] xl:max-w-4xl px-4 py-8">
      <SectionHeading id="experience" title="Experience" />
      <Experiences />
    </main>
  );
}