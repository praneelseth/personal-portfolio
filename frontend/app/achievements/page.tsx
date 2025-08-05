import SectionHeading from "@/components/SectionHeading";
import Achievements from "@/components/Achievements";

export default function AchievementsPage() {
  return (
    <main className="mx-auto max-w-[90vw] lg:max-w-[48rem] xl:max-w-4xl px-4 py-8">
      <SectionHeading id="achievements" title="Achievements" />
      <Achievements />
    </main>
  );
}