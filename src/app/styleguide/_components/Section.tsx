import type { ReactNode } from "react";

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <h2 id={id} className="text-caption font-semibold tracking-[0.12em] text-muted uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
