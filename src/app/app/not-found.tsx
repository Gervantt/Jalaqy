import { ButtonLink, EmptyState } from "@/components/ui";
import { IconSearch } from "@/components/ui/icons";
import { t } from "@/i18n";

export default function AppNotFound() {
  return (
    <EmptyState
      icon={<IconSearch size={26} />}
      title={t.app.errors.notFoundTitle}
      action={<ButtonLink href="/app/payroll">{t.app.errors.toPayroll}</ButtonLink>}
    >
      {t.app.errors.notFoundText}
    </EmptyState>
  );
}
