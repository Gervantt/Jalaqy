import { Golos_Text, Onest } from "next/font/google";

/*
 * next/font скачивает файлы шрифтов при сборке и раздаёт их с нашего домена:
 * в рантайме браузер не ходит в Google Fonts.
 * Оба шрифта вариативные — один файл на подмножество, все веса (Onest 500–800, Golos 400–700).
 * cyrillic-ext нужен для казахских букв (ә, ғ, қ, ң, ө, ұ, ү, һ, і).
 */
export const onest = Onest({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-onest",
  display: "swap",
});

export const golos = Golos_Text({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-golos",
  display: "swap",
});
