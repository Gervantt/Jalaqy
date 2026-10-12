"use client";

import { useState } from "react";
import { t } from "@/i18n";
import {
  Button,
  EmptyState,
  Modal,
  Sheet,
  Skeleton,
  ToastProvider,
  useToast,
} from "@/components/ui";
import { IconDocument, IconPlus } from "@/components/ui/icons";
import { DemoPanel } from "./StateRow";

const o = t.styleguide.kit.overlays;
const b = t.styleguide.kit.buttons;
const e = t.styleguide.kit.empty;

function ToastButtons() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-2.5">
      <Button
        variant="secondary"
        onClick={() => toast.show({ title: o.toastSuccessTitle, description: o.toastSuccessText })}
      >
        {o.toastSuccess}
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.show({ title: o.toastErrorTitle, description: o.toastErrorText, tone: "error" })
        }
      >
        {o.toastError}
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.show({ title: o.toastInfoTitle, tone: "info" })}
      >
        {o.toastInfo}
      </Button>
    </div>
  );
}

export function OverlaysDemo() {
  const [modal, setModal] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [sending, setSending] = useState(false);

  return (
    <ToastProvider>
      <div className="flex flex-col gap-4">
        <DemoPanel title="Modal · Sheet · Toast">
          <div className="flex flex-wrap gap-2.5">
            <Button onClick={() => setModal(true)}>{o.openModal}</Button>
            <Button variant="secondary" onClick={() => setSheet(true)}>
              {o.openSheet}
            </Button>
          </div>
          <ToastButtons />
        </DemoPanel>

        <div className="grid gap-4 md:grid-cols-2">
          <EmptyState
            icon={<IconDocument size={26} />}
            title={e.title}
            action={<Button icon={<IconPlus size={18} />}>{e.action}</Button>}
          >
            {e.text}
          </EmptyState>
          <DemoPanel title={e.skeletonLabel}>
            <div aria-busy="true" className="flex flex-col gap-3">
              <span className="sr-only">{t.ui.loading}</span>
              <Skeleton className="h-8 w-2/3" />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 border-t border-divider pt-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </DemoPanel>
        </div>
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={o.modalTitle}
        description={o.modalText}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(false)}>
              {o.cancel}
            </Button>
            <Button
              loading={sending}
              onClick={() => {
                setSending(true);
                setTimeout(() => {
                  setSending(false);
                  setModal(false);
                }, 900);
              }}
            >
              {b.send}
            </Button>
          </>
        }
      />
      <Sheet
        open={sheet}
        onClose={() => setSheet(false)}
        title={o.sheetTitle}
        description={o.sheetText}
        footer={
          <div className="flex w-full gap-2">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => setSheet(false)}
            >
              {b.reject}
            </Button>
            <Button variant="soft" size="md" className="flex-1" onClick={() => setSheet(false)}>
              {b.approve}
            </Button>
          </div>
        }
      />
    </ToastProvider>
  );
}
