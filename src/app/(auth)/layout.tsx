import { Logo } from "@/components/brand";

/** Экраны входа и онбординга: логотип сверху, карточка по центру. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col items-center px-4 py-8 md:py-16">
      <div className="flex w-full max-w-[560px] flex-col gap-8">
        <Logo variant="onLight" size={36} wordmarkSize={28} />
        <main className="flex flex-col gap-6">{children}</main>
      </div>
    </div>
  );
}
