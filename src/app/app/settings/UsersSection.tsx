"use client";

import { submitWith } from "@/lib/form-submit";
import { useActionState, useState, useTransition } from "react";
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  Sheet,
  StatusPill,
  Table,
  useToast,
  type TableColumn,
} from "@/components/ui";
import { IconPlus } from "@/components/ui/icons";
import { interpolate, t } from "@/i18n";
import type { CompanyUser } from "@/lib/api/contracts";
import { formatKzPhone, normalizeKzPhone } from "@/lib/validation/contact";
import { inviteUserAction, setUserRoleAction, type FormState } from "./actions";

const u = t.settings.users;
const roleOptions = (["accountant", "owner"] as const).map((r) => ({
  value: r,
  label: t.domain.roles[r],
}));

function RoleSelect({ user }: { user: CompanyUser }) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  return (
    <Select
      label={interpolate(u.roleLabel, { name: user.name })}
      hideLabel
      options={roleOptions}
      defaultValue={user.role}
      disabled={pending}
      className="h-11 min-w-40"
      onChange={(e) => {
        const role = e.target.value as CompanyUser["role"];
        startTransition(async () => {
          const r = await setUserRoleAction(user.id, role);
          toast.show(r.ok ? { title: u.roleChanged } : { title: r.error, tone: "error" });
        });
      }}
    />
  );
}

const columns: TableColumn<CompanyUser>[] = [
  { key: "name", header: u.name, render: (x) => <span className="font-semibold">{x.name}</span> },
  {
    key: "contact",
    header: u.contact,
    render: (x) => {
      const phone = normalizeKzPhone(x.contact);
      return phone && !x.contact.includes("@") ? formatKzPhone(phone) : x.contact;
    },
  },
  { key: "role", header: u.role, render: (x) => <RoleSelect user={x} /> },
  {
    key: "status",
    header: u.status,
    render: (x) =>
      x.status === "active" ? (
        <StatusPill status="approved">{t.domain.userStatus.active}</StatusPill>
      ) : (
        <Badge tone="warning">{t.domain.userStatus.invited}</Badge>
      ),
  },
];

export function UsersSection({ users }: { users: CompanyUser[] }) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const toast = useToast();
  const [state, action, pending] = useActionState<FormState, FormData>(async (prev, form) => {
    const r = await inviteUserAction(prev, form);
    if (r?.ok) {
      setOpen(false);
      setFormKey((k) => k + 1);
      toast.show({ title: u.invited });
    }
    return r;
  }, null);
  const errors = state && !state.ok ? (state.fields ?? {}) : {};

  return (
    <Card as="section" aria-labelledby="set-users" padding="lg" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex max-w-xl flex-col gap-1">
          <h2 id="set-users" className="font-display text-xl font-bold tracking-display">
            {u.title}
          </h2>
          <p className="text-body text-muted">{u.description}</p>
        </div>
        <Button variant="secondary" icon={<IconPlus size={18} />} onClick={() => setOpen(true)}>
          {u.invite}
        </Button>
      </div>
      <Table
        caption={u.caption}
        columns={columns}
        rows={users}
        rowKey={(x) => x.id}
        minWidth={680}
        className="px-0"
      />
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={u.inviteTitle}
        description={u.inviteDescription}
      >
        <form
          key={formKey}
          action={action}
          onSubmit={submitWith(action)}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input name="name" label={u.name} required error={errors.name} />
          <Input
            name="contact"
            label={u.contactField}
            inputMode="email"
            required
            error={errors.contact}
          />
          <Select name="role" label={u.role} options={roleOptions} defaultValue="accountant" />
          <div className="flex justify-end gap-2.5">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {t.ui.cancel}
            </Button>
            <Button type="submit" loading={pending}>
              {u.send}
            </Button>
          </div>
        </form>
      </Sheet>
    </Card>
  );
}
