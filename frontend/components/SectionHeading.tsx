import { ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  title?: string;
  children?: ReactNode;
}

export default function SectionHeading({ id, title, children }: SectionHeadingProps) {
  return (
    <div>
      <h2
        id={id}
        className="scroll-mt-24 text-2xl font-bold mb-6 flex items-center gap-3"
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
      </h2>
    </section>
  );
}