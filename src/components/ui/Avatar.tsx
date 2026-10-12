import { cn } from "@/lib/cn";

/** «Данияр К.» → «ДК»; «Мадина» → «М». */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase("ru"))
    .join("");
}

export interface AvatarProps {
  name: string;
  size?: 32 | 40 | 48 | 64;
  /** По умолчанию декоративный: имя обычно написано рядом. */
  decorative?: boolean;
  className?: string;
}

const sizes = {
  32: "size-8 text-xs",
  40: "size-10 text-sm",
  48: "size-12 text-base",
  64: "size-16 text-xl",
};

/** Аватар-инициалы. Фото не храним и не грузим с внешних сервисов. */
export function Avatar({ name, size = 40, decorative = true, className }: AvatarProps) {
  return (
    <span
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-success-bg font-bold text-success-text select-none",
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
