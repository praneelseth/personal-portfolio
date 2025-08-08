import SectionHeading from "@/components/SectionHeading";
import Contact from "@/components/Contact";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-[90vw] lg:max-w-[40rem] xl:max-w-[56rem] px-4 py-8">
      <SectionHeading id="contact" title="Contact" />
      <Contact />
    </main>
  );
}