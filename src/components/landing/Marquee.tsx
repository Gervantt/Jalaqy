import { t } from "@/i18n";

/** Четырёхлучевая звёздочка вместо символа «✦» — без эмодзи и шрифтовых глифов. */
function Star() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0 text-accent"
    >
      <path
        d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="m-0 flex shrink-0 list-none items-center gap-14 p-0 pr-14"
    >
      {t.landing.marquee.items.map((item) => (
        <li key={item} className="flex items-center gap-14">
          <span>{item}</span>
          <Star />
        </li>
      ))}
    </ul>
  );
}

/** Бегущая строка: две копии, вторая скрыта от скринридера. */
export function Marquee() {
  return (
    <section
      aria-label={t.landing.marquee.label}
      className="overflow-hidden bg-ink py-[22px] text-cream"
    >
      <div className="flex w-max font-display text-[19px] font-bold whitespace-nowrap motion-safe:animate-marquee">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
