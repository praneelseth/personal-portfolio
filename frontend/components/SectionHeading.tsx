interface SectionHeadingProps {
  id: string;
  title: string;
}

export default function SectionHeading({ id, title }: SectionHeadingProps) {
  return (
    <section id={id} className="mb-6">
      <h2 className="font-bold text-2xl mb-4 border-b border-gray-300 pb-2">
        {title}
      </h2>
    </section>
  );
}