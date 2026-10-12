import type { ReactNode } from "react";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";

export interface TableColumn<Row> {
  key: string;
  header: ReactNode;
  /** Числа — вправо. */
  align?: "left" | "right";
  /** Выделить колонку (как «К выплате»). */
  emphasis?: boolean;
  render: (row: Row) => ReactNode;
  /** Ячейка итоговой строки. */
  footer?: ReactNode;
  className?: string;
}

export interface TableProps<Row> {
  /** Подпись таблицы для скринридера (визуально скрыта). */
  caption: string;
  columns: TableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Показать итоговую строку из column.footer. */
  footer?: boolean;
  /** Минимальная ширина: на узком экране таблица скроллится горизонтально. */
  minWidth?: number;
  /** Что показать вместо строк, если их нет. */
  empty?: ReactNode;
  className?: string;
}

/**
 * Таблица из дизайна «Зарплата за месяц»: числа справа и моноширинные,
 * итог под жирной линией, горизонтальная прокрутка на узком экране.
 * Обёртка с tabIndex=0, чтобы прокрутку можно было делать с клавиатуры.
 */
export function Table<Row>({
  caption,
  columns,
  rows,
  rowKey,
  footer,
  minWidth = 820,
  empty,
  className,
}: TableProps<Row>) {
  const alignClass = (c: TableColumn<Row>) => (c.align === "right" ? "text-right" : "text-left");
  // Без строк заголовки колонок бессмысленны: показываем только пустое состояние
  if (rows.length === 0 && empty) {
    return (
      <div className={cn("rounded-card-lg bg-surface p-4", className)}>
        <p className="sr-only">{caption}</p>
        {empty}
      </div>
    );
  }
  return (
    <div className={cn("rounded-card-lg bg-surface px-2 pt-2 pb-1", className)}>
      <div
        // relative: скрытые подписи (sr-only) внутри не растягивают страницу
        className="relative overflow-x-auto rounded-card"
        tabIndex={0}
        role="region"
        aria-label={`${caption}. ${t.ui.scrollableTable}`}
      >
        <table className="w-full border-collapse text-body tabular-nums" style={{ minWidth }}>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="text-caption text-muted">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3.5 font-semibold",
                    alignClass(c),
                    c.emphasis && "font-bold text-ink",
                    c.className,
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-t border-divider">
                {columns.map((c, i) => {
                  const Cell = i === 0 ? "th" : "td";
                  return (
                    <Cell
                      key={c.key}
                      scope={i === 0 ? "row" : undefined}
                      className={cn(
                        "px-4 py-3.5",
                        alignClass(c),
                        // одно значение font-weight: два класса начертания спорят по порядку в CSS
                        c.emphasis ? "font-bold" : "font-normal",
                        c.className,
                      )}
                    >
                      {c.render(row)}
                    </Cell>
                  );
                })}
              </tr>
            ))}
          </tbody>
          {footer && rows.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-ink font-bold">
                {columns.map((c, i) => {
                  const Cell = i === 0 ? "th" : "td";
                  return (
                    <Cell
                      key={c.key}
                      scope={i === 0 ? "row" : undefined}
                      className={cn("p-4", alignClass(c), c.emphasis && "text-primary")}
                    >
                      {c.footer}
                    </Cell>
                  );
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
