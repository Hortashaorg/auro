import type { FC } from "@kalena/framework";
import { cva } from "class-variance-authority";
import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";

const icons = {
  info: (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
  success: (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <path d="M21.801 10A10 10 0 1 1 17 3.335" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  ),
  danger: (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  ),
  warning: (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  x: (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      stroke-width="2"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  "chevron-right": (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  "chevron-down": (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  plus: (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  ),
  sun: (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  ),
  moon: (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  ),
  repeat: (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  clock: (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  "map-pin": (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  "server": (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  ),
  "server-off": (
    { className, props }: {
      className?: string;
      props: Record<string, unknown>;
    },
  ) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <path d="M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5" />
      <path d="M10 10 2.5 2.5C2 2 2 2.5 2 5v3a2 2 0 0 0 2 2h6z" />
      <path d="M22 17v-1a2 2 0 0 0-2-2h-1" />
      <path d="M4 14a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16.5l1-.5.5.5-8-8H4z" />
      <path d="M6 18h.01" />
      <path d="m2 2 20 20" />
    </svg>
  ),
};

const iconContainerVariants = cva([
  "p-0.5",
], {
  variants: {
    variant: {
      info: ["text-info"],
      warning: ["text-warning"],
      success: ["text-success"],
      danger: ["bg-danger/15", "text-danger"],
      default: ["text-on-surface", "dark:text-on-surface-dark"],
      inverse: ["text-on-surface-dark", "dark:text-on-surface"],
      dark: ["text-on-surface-strong"],
      light: ["text-on-surface-dark-strong"],
      none: [],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type Props = NonNullableProps<typeof iconContainerVariants> & {
  icon: keyof typeof icons;
  size?: "size-3" | "size-4" | "size-5" | "size-6" | "size-7";
  props?: Record<string, unknown>;
};

/**
 * Icon component that displays SVG icons with various styling options
 *
 * @props
 *   - "info" - Info color
 *   - "warning" - Warning color
 *   - "success" - Success color
 *   - "danger" - Danger color with light background
 *   - "default" - Default text color (dark in light mode, light in dark mode)
 *   - "inverse" - Inverse of default (light in light mode, dark in dark mode)
 *   - "dark" - Strong dark text color
 *   - "light" - Strong light text color
 *   - "none" - Inherits text color from parent element
 *
 * @example
 * <Icon icon="map-pin" variant="success" size="size-6" />
 */
export const Icon: FC<Props> = ({ icon, variant, size, ...props }) => {
  return icons[icon]({
    className: cn(iconContainerVariants({ variant }), size ?? "size-5"),
    props,
  });
};
