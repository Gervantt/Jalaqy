// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import { Checkbox, RadioGroup, Switch } from "./Choice";
import { IconButton } from "./IconButton";
import { IconBell } from "./icons";
import { Input } from "./Input";
import { MoneyInput } from "./MoneyInput";
import { Select } from "./Select";

const plain = (s: string) => s.replace(/ /g, " ");

describe("Button", () => {
  it("по умолчанию type=button и кликается", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Сохранить</Button>);
    const btn = screen.getByRole("button", { name: "Сохранить" });
    expect(btn.getAttribute("type")).toBe("button");
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("loading — заблокирована, aria-busy и текст для скринридера", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Отправить
      </Button>,
    );
    const btn = screen.getByRole("button", { name: /Отправить/ });
    expect((btn as HTMLButtonElement).disabled).toBe(true);
    expect(btn.getAttribute("aria-busy")).toBe("true");
    expect(btn.textContent).toContain("Загрузка");
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("IconButton", () => {
  it("имеет доступное имя из label", () => {
    render(<IconButton label="Уведомления" icon={<IconBell />} />);
    expect(screen.getByRole("button", { name: "Уведомления" })).toBeTruthy();
  });
});

describe("Input", () => {
  it("подпись связана с полем, ошибка — через aria-describedby", () => {
    render(<Input label="БИН" error="Должно быть 12 цифр" hint="12 цифр" />);
    const input = screen.getByLabelText("БИН");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const ids = input.getAttribute("aria-describedby")!.split(" ");
    const texts = ids.map((id) => document.getElementById(id)?.textContent);
    expect(texts).toContain("Должно быть 12 цифр");
    expect(texts).toContain("12 цифр");
  });
});

describe("Select", () => {
  it("выбор с клавиатуры", async () => {
    const onChange = vi.fn();
    render(
      <Select
        label="Налоговый режим"
        options={[
          { value: "general", label: "Общеустановленный" },
          { value: "simplified", label: "Упрощённая декларация" },
        ]}
        onChange={(e) => onChange(e.target.value)}
      />,
    );
    await userEvent.selectOptions(screen.getByLabelText("Налоговый режим"), "simplified");
    expect(onChange).toHaveBeenCalledWith("simplified");
  });
});

describe("Checkbox / Radio / Switch", () => {
  it("чекбокс с ошибкой", () => {
    render(<Checkbox label="Согласен" error="Нужно согласие" />);
    const box = screen.getByRole("checkbox", { name: "Согласен" });
    expect(box.getAttribute("aria-invalid")).toBe("true");
    expect(document.getElementById(box.getAttribute("aria-describedby")!)?.textContent).toBe(
      "Нужно согласие",
    );
  });

  it("switch переключается пробелом", async () => {
    render(<Switch label="Заявление на вычет" />);
    const sw = screen.getByRole("switch", { name: "Заявление на вычет" });
    sw.focus();
    await userEvent.keyboard(" ");
    expect((sw as HTMLInputElement).checked).toBe(true);
  });

  it("radio-группа: fieldset с legend, выбор отдаётся наверх", async () => {
    function Demo() {
      const [v, setV] = useState("owner");
      return (
        <>
          <RadioGroup
            legend="Я"
            name="role"
            value={v}
            onValueChange={setV}
            options={[
              { value: "owner", label: "владелец" },
              { value: "acc", label: "бухгалтер" },
            ]}
          />
          <output>{v}</output>
        </>
      );
    }
    render(<Demo />);
    expect(screen.getByRole("group", { name: "Я" })).toBeTruthy();
    await userEvent.click(screen.getByRole("radio", { name: "бухгалтер" }));
    expect(screen.getByRole("status").textContent).toBe("acc");
  });
});

describe("MoneyInput", () => {
  it("форматирует при вводе и отдаёт число", async () => {
    const onValueChange = vi.fn();
    render(<MoneyInput label="Оклад" onValueChange={onValueChange} />);
    const input = screen.getByLabelText("Оклад") as HTMLInputElement;
    await userEvent.type(input, "1558890");
    expect(plain(input.value)).toBe("1 558 890");
    expect(onValueChange).toHaveBeenLastCalledWith(1558890);
  });

  it("игнорирует буквы, очищается в null", async () => {
    const onValueChange = vi.fn();
    render(<MoneyInput label="Оклад" defaultValue={320000} onValueChange={onValueChange} />);
    const input = screen.getByLabelText("Оклад") as HTMLInputElement;
    await userEvent.type(input, "abc");
    expect(plain(input.value)).toBe("320 000");
    await userEvent.clear(input);
    expect(input.value).toBe("");
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("не даёт ввести больше max", async () => {
    render(<MoneyInput label="Оклад" max={1000} />);
    const input = screen.getByLabelText("Оклад") as HTMLInputElement;
    await userEvent.type(input, "99999");
    expect(plain(input.value)).toBe("1 000");
  });

  it("курсор остаётся после вставленной цифры", async () => {
    render(<MoneyInput label="Оклад" defaultValue={32000} />);
    const input = screen.getByLabelText("Оклад") as HTMLInputElement;
    // «32 000»: ставим курсор после «32» и вводим «0» → «320 000», курсор после «320»
    input.focus();
    input.setSelectionRange(2, 2);
    await userEvent.keyboard("0");
    expect(plain(input.value)).toBe("320 000");
    expect(input.selectionStart).toBe(3);
  });
});
