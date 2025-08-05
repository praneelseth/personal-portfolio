import { ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  title?: string;
  children?: ReactNode;
}

export default function SectionHeading({ id, title, children }: SectionHeadingProps) {
  return (
    <section id={id} className="mb-6">
      <div className="border-b border-gray-300 pb-2 mb-6">
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        {children}
      </div>
    </section>
  );
}