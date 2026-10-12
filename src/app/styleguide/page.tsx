import type { Metadata } from "next";
import { Logo } from "@/components/brand";
import { t } from "@/i18n";
import { brandPalette, extraPalette, landingPalette } from "@/lib/design/palette";
import { Formatting } from "./_components/Formatting";
import { ButtonsDemo } from "./_components/kit/ButtonsDemo";
import { DataDemo } from "./_components/kit/DataDemo";
import { FieldsDemo } from "./_components/kit/FieldsDemo";
import { IconsDemo } from "./_components/kit/IconsDemo";
import { NavDemo } from "./_components/kit/NavDemo";
import { OverlaysDemo } from "./_components/kit/OverlaysDemo";
import { StatusDemo } from "./_components/kit/StatusDemo";
import { LogoShowcase } from "./_components/LogoShowcase";
import { Palette } from "./_components/Palette";
import { Radii } from "./_components/Radii";
import { Section } from "./_components/Section";
import { Typography } from "./_components/Typography";

const sg = t.styleguide;
const kit = sg.kit.sections;

export const metadata: Metadata = {
  title: sg.title,
  robots: { index: false, follow: false },
};

export default function StyleguidePage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-8 md:px-8 md:py-12">
      <header className="flex flex-col gap-3">
        <Logo variant="onLight" size={32} wordmarkSize={24} />
        <h1 className="font-display text-h1 font-extrabold tracking-display">{sg.title}</h1>
        <p className="max-w-2xl text-body text-muted">{sg.intro}</p>
      </header>

      <Section id="sg-logo" title={sg.sections.logo}>
        <LogoShowcase />
      </Section>

      <Section id="sg-palette" title={sg.sections.palette}>
        <p className="text-caption text-muted">{sg.contrastHint}</p>
        <Palette colors={brandPalette} />
      </Section>

      <Section id="sg-palette-extra" title={sg.sections.paletteExtra}>
        <Palette colors={extraPalette} />
      </Section>

      <Section id="sg-palette-landing" title={sg.sections.paletteLanding}>
        <Palette colors={landingPalette} columns={3} />
      </Section>

      <Section id="sg-type" title={sg.sections.typography}>
        <Typography />
      </Section>

      <Section id="sg-radii" title={sg.sections.radii}>
        <Radii />
      </Section>

      <Section id="sg-format" title={sg.sections.formatting}>
        <Formatting />
      </Section>

      <h2 className="-mb-6 border-t border-border pt-10 font-display text-h1 font-extrabold tracking-display">
        {sg.kit.title}
      </h2>

      <Section id="sg-buttons" title={kit.buttons}>
        <ButtonsDemo />
      </Section>

      <Section id="sg-fields" title={kit.fields}>
        <FieldsDemo />
      </Section>

      <Section id="sg-data" title={kit.data}>
        <DataDemo />
      </Section>

      <Section id="sg-status" title={kit.status}>
        <StatusDemo />
      </Section>

      <Section id="sg-nav" title={kit.navigation}>
        <NavDemo />
      </Section>

      <Section id="sg-overlays" title={kit.overlays}>
        <OverlaysDemo />
      </Section>

      <Section id="sg-icons" title={kit.icons}>
        <IconsDemo />
      </Section>
    </main>
  );
}
