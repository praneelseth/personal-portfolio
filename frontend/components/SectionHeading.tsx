import { ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  title?: string;
  children?: ReactNode;
}

export default function SectionHeading({ id, title, children }: SectionHeadingProps) {
  return (
    <section id={id} className="mb-6">
      <div>
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        <div className="border-b border-black pt-2 pb-1 mb-1">
          {children}
        </div>
      </div>
    </section>
  );
}