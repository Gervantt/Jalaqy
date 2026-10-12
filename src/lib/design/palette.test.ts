import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { brandPalette, extraPalette, landingPalette } from "./palette";

const css = readFileSync(
  fileURLToPath(new URL("../../styles/tokens.css", import.meta.url)),
  "utf8",
);
const rootStart = css.search(/^:root \{/m);
const rootBlock = css.slice(rootStart, css.indexOf("}", rootStart));

describe("палитра стайлгайда совпадает с tokens.css", () => {
  it.each([...brandPalette, ...extraPalette, ...landingPalette])("$token = $hex", ({ token, hex }) => {
    const m = new RegExp(`${token}:\\s*(#[0-9a-fA-F]{6})`).exec(rootBlock);
    expect(m?.[1]?.toUpperCase()).toBe(hex);
  });
});
