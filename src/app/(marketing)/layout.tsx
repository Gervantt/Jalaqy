/** Тема лендинга: крем, мята, кнопки-пилюли (см. [data-theme="landing"] в tokens.css). */
export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div
      data-theme="landing"
      className="min-h-dvh overflow-x-clip bg-paper text-[17px] leading-[1.55] text-ink"
    >
      {children}
    </div>
  );
}
