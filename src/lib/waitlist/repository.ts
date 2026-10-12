import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { WaitlistEntry } from "./schema";

/** Хранилище заявок. Сейчас — JSON-файл; позже — PostgreSQL/FastAPI с тем же интерфейсом. */
export interface WaitlistRepository {
  add(entry: WaitlistEntry): Promise<void>;
  list(): Promise<WaitlistEntry[]>;
}

/**
 * Заявки в JSON-файле на нашем сервере (data/waitlist.json, вне git).
 * Запись атомарная (временный файл + rename), параллельные записи выстраиваются в очередь.
 */
export function createJsonFileRepository(file: string): WaitlistRepository {
  let queue: Promise<unknown> = Promise.resolve();

  async function read(): Promise<WaitlistEntry[]> {
    try {
      return JSON.parse(await readFile(file, "utf8")) as WaitlistEntry[];
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw e;
    }
  }

  return {
    add(entry) {
      const task = queue.then(async () => {
        const list = await read();
        list.push(entry);
        await mkdir(path.dirname(file), { recursive: true });
        const tmp = `${file}.${process.pid}.tmp`;
        await writeFile(tmp, JSON.stringify(list, null, 2), { encoding: "utf8", mode: 0o600 });
        await rename(tmp, file);
      });
      queue = task.catch(() => {});
      return task;
    },
    list: () => queue.then(read),
  };
}

export function waitlistFile(): string {
  return path.join(
    process.env.JALAQY_DATA_DIR ?? path.join(process.cwd(), "data"),
    "waitlist.json",
  );
}
