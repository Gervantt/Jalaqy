import type { ReactNode, SVGProps } from "react";

/**
 * Тонкие линейные иконки (stroke 2), viewBox 24. Пути из design/*.dc.html,
 * недостающие нарисованы в той же манере. Иконки декоративные (aria-hidden):
 * смысл несут подпись рядом или aria-label у кнопки.
 */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  size?: number;
  strokeWidth?: number;
}

function createIcon(name: string, paths: ReactNode) {
  function Icon({ size = 20, strokeWidth = 2, ...rest }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...rest}
      >
        {paths}
      </svg>
    );
  }
  Icon.displayName = `Icon${name}`;
  return Icon;
}

/* Разделы (из сайдбара дизайна) */
export const IconPayroll = createIcon(
  "Payroll",
  <>
    <rect x="2" y="6" width="20" height="13" rx="2" />
    <circle cx="12" cy="12.5" r="2.5" />
  </>,
);
export const IconUsers = createIcon(
  "Users",
  <>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2 20c1-3.5 3.8-5.5 7-5.5s6 2 7 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .7 3.4 2.5 4 5.2" />
  </>,
);
export const IconCalendar = createIcon(
  "Calendar",
  <>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M3 9h18M8 2v4M16 2v4" />
  </>,
);
export const IconDocument = createIcon(
  "Document",
  <>
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5M10 13h6M10 17h6" />
  </>,
);
export const IconChart = createIcon("Chart", <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />);
export const IconSettings = createIcon(
  "Settings",
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </>,
);

/* Мобильные (из листка и экрана владельца) */
export const IconBell = createIcon(
  "Bell",
  <>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </>,
);
export const IconSun = createIcon(
  "Sun",
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>,
);
export const IconUser = createIcon(
  "User",
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </>,
);

/* Статусы */
export const IconCheck = createIcon("Check", <path d="M5 12l5 5 9-10" />);
export const IconClock = createIcon(
  "Clock",
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
);
export const IconAlert = createIcon(
  "Alert",
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5h.01" />
  </>,
);
export const IconInfo = createIcon(
  "Info",
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.5h.01" />
  </>,
);

/* Действия */
export const IconClose = createIcon("Close", <path d="M6 6l12 12M18 6L6 18" />);
export const IconMenu = createIcon("Menu", <path d="M4 7h16M4 12h16M4 17h16" />);
export const IconPlus = createIcon("Plus", <path d="M12 5v14M5 12h14" />);
export const IconChevronDown = createIcon("ChevronDown", <path d="M6 9l6 6 6-6" />);
export const IconChevronLeft = createIcon("ChevronLeft", <path d="M15 6l-6 6 6 6" />);
export const IconChevronRight = createIcon("ChevronRight", <path d="M9 6l6 6-6 6" />);
export const IconArrowRight = createIcon("ArrowRight", <path d="M5 12h14M13 6l6 6-6 6" />);
export const IconDownload = createIcon("Download", <path d="M12 4v11M7 10l5 5 5-5M4 20h16" />);
export const IconUpload = createIcon("Upload", <path d="M12 16V5M7 10l5-5 5 5M4 20h16" />);
export const IconSend = createIcon("Send", <path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />);
export const IconEdit = createIcon("Edit", <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />);
export const IconTrash = createIcon(
  "Trash",
  <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
);
export const IconSearch = createIcon(
  "Search",
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-4-4" />
  </>,
);
export const IconLogout = createIcon(
  "Logout",
  <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 16l-4-4 4-4M6 12h11" />,
);
export const IconMail = createIcon(
  "Mail",
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </>,
);
export const IconPhone = createIcon(
  "Phone",
  <>
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <path d="M11 18h2" />
  </>,
);
