import { initials } from "@/components/ui";
import { t } from "@/i18n";
import type { Absence, AbsenceType, Timesheet } from "@/lib/api/contracts";
import { cn } from "@/lib/cn";

const ts = t.timesheet;

const chipTone: Record<AbsenceType, string> = {
  vacation: "bg-success-bg text-success-text",
  sick: "bg-warning-bg text-warning-text",
  unpaid: "bg-danger-bg text-danger",
};

function Chip({ absence, name }: { absence: Absence; name: string }) {
  const pending = absence.status === "pending";
  return (
    <li
      className={cn(
        "rounded-full px-1.5 py-0.5 text-[11px] leading-tight font-bold",
        chipTone[absence.type],
        pending && "outline-1 outline-current outline-dashed",
      )}
    >
      <span aria-hidden="true">{initials(name)}</span>
      <span className="sr-only">
        {name}, {t.domain.absenceTypes[absence.type].toLowerCase()}
        {pending && `, ${t.domain.absenceStatus.pending.toLowerCase()}`}
      </span>
    </li>
  );
}

/** Месячный календарь: неделя с понедельника, праздники, отсутствия сотрудников. */
export function MonthCalendar({
  timesheet,
  names,
  caption,
}: {
  timesheet: Timesheet;
  names: Record<string, string>;
  caption: string;
}) {
  const first = new Date(`${timesheet.period}-01T00:00:00`);
  const offset = (first.getDay() + 6) % 7; // понедельник = 0
  const cells: Array<Timesheet["days"][number] | null> = [
    ...Array.from({ length: offset }, () => null),
    ...timesheet.days,
  ];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  return (
    <table className="w-full table-fixed border-collapse text-body">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          {ts.weekdays.map((d, i) => (
            <th key={d} scope="col" className="pb-2 text-caption font-semibold text-muted">
              <abbr title={ts.weekdaysFull[i]} className="no-underline">
                {d}
              </abbr>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, w) => (
          <tr key={w}>
            {week.map((day, i) => {
              if (!day) return <td key={i} className="p-0.5" />;
              const dayNum = Number(day.date.slice(8));
              const absences = timesheet.absences.filter(
                (a) => a.from <= day.date && a.to >= day.date,
              );
              return (
                <td key={day.date} className="h-[72px] p-0.5 align-top md:h-20">
                  <div
                    className={cn(
                      "flex h-full flex-col gap-1 rounded-nav p-1.5",
                      day.working ? "bg-paper" : "bg-transparent",
                      day.holiday && "bg-warning-bg/60",
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-semibold tabular-nums",
                        !day.working && "text-muted",
                        day.holiday && "text-warning-text",
                      )}
                    >
                      {dayNum}
                      {day.holiday && <span className="sr-only">, {ts.holiday}</span>}
                      {!day.working && !day.holiday && (
                        <span className="sr-only">, {ts.dayOff}</span>
                      )}
                    </span>
                    {absences.length > 0 && (
                      <ul className="m-0 flex list-none flex-wrap gap-0.5 p-0">
                        {absences.map((a) => (
                          <Chip key={a.id} absence={a} name={names[a.employeeId] ?? ""} />
                        ))}
                      </ul>
                    )}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function CalendarLegend() {
  const item = (cls: string, label: string) => (
    <li className="flex items-center gap-2">
      <span aria-hidden="true" className={cn("size-3.5 rounded-full", cls)} />
      {label}
    </li>
  );
  return (
    <ul
      aria-label={ts.legend}
      className="m-0 flex list-none flex-wrap gap-x-4 gap-y-2 p-0 text-caption text-muted"
    >
      {item("bg-success-bg", t.domain.absenceTypes.vacation)}
      {item("bg-warning-bg", t.domain.absenceTypes.sick)}
      {item("bg-danger-bg", t.domain.absenceTypes.unpaid)}
      {item("border border-dashed border-muted", t.domain.absenceStatus.pending)}
      {item("bg-warning-bg/60", ts.holidayLegend)}
    </ul>
  );
}
