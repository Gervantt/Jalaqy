"use client";

import { useState } from "react";
import { IconButton, Sheet } from "@/components/ui";
import { IconBell } from "@/components/ui/icons";
import { t } from "@/i18n";

/** Колокольчик: точка, если есть новое; список — в шторке снизу. */
export function Notifications({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <span className="relative">
        <IconButton
          label={
            items.length
              ? `${t.mobile.owner.notifications}: ${items.length}`
              : t.mobile.owner.notifications
          }
          icon={<IconBell />}
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        />
        {items.length > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-2.5 right-2.5 size-2 rounded-full bg-accent ring-2 ring-surface"
          />
        )}
      </span>
      <Sheet open={open} onClose={() => setOpen(false)} title={t.mobile.owner.notifications}>
        {items.length === 0 ? (
          <p className="text-body text-muted">{t.mobile.owner.notificationsEmpty}</p>
        ) : (
          <ul className="m-0 flex list-none flex-col p-0">
            {items.map((item) => (
              <li key={item} className="border-t border-divider py-3 text-body first:border-t-0">
                {item}
              </li>
            ))}
          </ul>
        )}
      </Sheet>
    </>
  );
}
