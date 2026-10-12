import * as icons from "@/components/ui/icons";

const list = Object.entries(icons).filter(([name]) => name.startsWith("Icon"));

export function IconsDemo() {
  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-8">
      {list.map(([name, Icon]) => (
        <li
          key={name}
          className="flex flex-col items-center gap-2 rounded-card bg-surface px-2 py-4 text-ink"
        >
          <Icon size={24} />
          <code className="text-[11px] break-all text-muted">{name.replace("Icon", "")}</code>
        </li>
      ))}
    </ul>
  );
}
