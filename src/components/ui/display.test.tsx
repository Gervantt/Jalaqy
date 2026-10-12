// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { initials } from "./Avatar";
import { StatusPill } from "./Badge";
import { KpiTile } from "./KpiTile";
import { Stepper } from "./Stepper";
import { Table } from "./Table";

const plain = (s: string | null) => (s ?? "").replace(/ /g, " ");

describe("Table", () => {
  const rows = [
    { id: "1", name: "Мадина Ж.", salary: "550 000" },
    { id: "2", name: "Данияр К.", salary: "320 000" },
  ];

  it("подпись, заголовки строк, числа справа, итог в tfoot", () => {
    render(
      <Table
        caption="Зарплата за октябрь"
        rows={rows}
        rowKey={(r) => r.id}
        footer
        columns={[
          { key: "name", header: "Сотрудник", render: (r) => r.name, footer: "Итого" },
          {
            key: "salary",
            header: "Оклад",
            align: "right",
            render: (r) => r.salary,
            footer: "870 000",
          },
        ]}
      />,
    );
    const table = screen.getByRole("table", { name: "Зарплата за октябрь" });
    expect(within(table).getByRole("rowheader", { name: "Мадина Ж." })).toBeTruthy();
    const salaryCell = within(table).getByText("550 000");
    expect(salaryCell.className).toContain("text-right");
    expect(table.querySelector("tfoot")?.textContent).toContain("870 000");
    // область прокрутки доступна с клавиатуры
    const region = screen.getByRole("region");
    expect(region.getAttribute("tabindex")).toBe("0");
  });

  it("пустое состояние вместо строк", () => {
    render(
      <Table
        caption="Пусто"
        rows={[]}
        rowKey={() => "x"}
        columns={[{ key: "a", header: "A", render: () => null }]}
        empty="Нет сотрудников"
      />,
    );
    expect(screen.getByText("Нет сотрудников")).toBeTruthy();
  });
});

describe("Stepper", () => {
  it("помечает текущий шаг и выполненные", () => {
    render(<Stepper steps={["Табель", "Расчёт", "Выплата", "Налоги и отчётность"]} current={1} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]?.textContent).toContain("выполнено");
    expect(items[1]?.getAttribute("aria-current")).toBe("step");
    expect(items[1]?.textContent).toContain("2 · Расчёт");
    expect(items[2]?.getAttribute("aria-current")).toBeNull();
  });
});

describe("StatusPill", () => {
  it.each([
    ["paid", "Выплачено"],
    ["pending", "Ждёт решения"],
    ["new", "Новый"],
  ] as const)("%s → %s", (status, text) => {
    render(<StatusPill status={status} />);
    expect(screen.getByText(text)).toBeTruthy();
  });

  it("своя подпись", () => {
    render(<StatusPill status="paid">Выплачено 5 ноя</StatusPill>);
    expect(screen.getByText("Выплачено 5 ноя")).toBeTruthy();
  });
});

describe("KpiTile", () => {
  it("форматирует сумму", () => {
    render(<KpiTile label="К выплате сотрудникам" value={1558890} />);
    expect(plain(screen.getByText(/558/).textContent)).toBe("1 558 890 ₸");
  });

  it("loading — aria-busy и текст загрузки", () => {
    const { container } = render(<KpiTile label="Налоги" value={0} loading />);
    expect(container.firstElementChild?.getAttribute("aria-busy")).toBe("true");
    expect(screen.getByText("Загрузка…")).toBeTruthy();
  });
});

describe("initials", () => {
  it.each([
    ["Данияр К.", "ДК"],
    ["Мадина", "М"],
    ["  асель   бекова  ", "АБ"],
    ["", ""],
  ])("%s → %s", (name, expected) => {
    expect(initials(name)).toBe(expected);
  });
});
