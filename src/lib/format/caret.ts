/** Позиция в отформатированной строке сразу после n-й цифры (для сохранения курсора). */
export function caretAfterDigits(formatted: string, digitCount: number): number {
  if (digitCount <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted.charAt(i))) {
      seen++;
      if (seen === digitCount) return i + 1;
    }
  }
  return formatted.length;
}

/** Сколько цифр стоит левее позиции курсора. */
export function digitsBefore(value: string, caret: number): number {
  return value.slice(0, caret).replace(/\D/g, "").length;
}
