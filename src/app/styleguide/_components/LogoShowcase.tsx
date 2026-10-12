import { AppIcon, Logo, LogoMark } from "@/components/brand";
import { t } from "@/i18n";

const l = t.styleguide.logo;

function Tile({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="flex min-w-0 flex-col gap-2">
      <div
        className={`flex min-h-40 items-center justify-center overflow-hidden rounded-card-lg p-6 ${className}`}
      >
        {children}
      </div>
      <figcaption className="text-caption text-muted">{label}</figcaption>
    </figure>
  );
}

export function LogoShowcase() {
  return (
    <div className="flex flex-col gap-4">
      <div className="on-ink flex flex-col gap-6 rounded-sheet bg-ink p-6 text-on-ink md:p-10">
        <Logo variant="onDark" size={72} wordmarkSize={64} className="max-w-full" />
        <p className="max-w-[430px] text-lg leading-snug text-on-ink-text">{t.brand.tagline}</p>
        <p className="max-w-[440px] text-sm text-on-ink-muted">{t.brand.meaning}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Tile label={l.onDark} className="on-ink bg-ink">
          <Logo variant="onDark" size={40} wordmarkSize={32} />
        </Tile>
        <Tile label={l.onLight} className="bg-surface">
          <Logo variant="onLight" size={48} wordmarkSize={42} />
        </Tile>
        <Tile label={l.onCream} className="bg-cream">
          <span data-theme="landing" className="contents">
            <Logo variant="ink" size={32} wordmarkSize={25} />
          </span>
        </Tile>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Tile label={l.appIcon} className="bg-surface">
          <AppIcon tone="ink" size={120} />
        </Tile>
        <Tile label={l.appIconGold} className="bg-surface">
          <AppIcon tone="gold" size={120} />
        </Tile>
        <Tile label={l.small} className="bg-surface">
          <div className="flex flex-wrap items-end gap-4">
            <AppIcon size={48} />
            <AppIcon size={32} />
            <LogoMark tone="primary" size={28} />
            <LogoMark tone="primary" size={16} />
          </div>
        </Tile>
      </div>
    </div>
  );
}
