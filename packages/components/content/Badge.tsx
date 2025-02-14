import { cn } from "@utils/tailwind.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@hono/hono/jsx";

import type { NonNullableProps } from "@utils/types.ts";

const badgeVariants = cva([
  "inline-flex",
  "items-center",
  "rounded-full",
  "font-medium",
  "transition-colors",
  "focus:outline-none",
  "focus:ring-2",
  "focus:ring-primary-400",
  "focus:ring-offset-2",
], {
  variants: {
    variant: {
      default: [
        "bg-primary-100",
        "text-primary-800",
        "dark:bg-primary-800",
        "dark:text-primary-100",
      ],
      secondary: [
        "bg-secondary-100",
        "text-secondary-800",
        "dark:bg-secondary-800",
        "dark:text-secondary-100",
      ],
      success: [
        "bg-success-100",
        "text-success-800",
        "dark:bg-success-800",
        "dark:text-success-100",
      ],
      danger: [
        "bg-danger-100",
        "text-danger-800",
        "dark:bg-danger-800",
        "dark:text-danger-100",
      ],
      warning: [
        "bg-warning-100",
        "text-warning-800",
        "dark:bg-warning-800",
        "dark:text-warning-100",
      ],
    },
    size: {
      sm: "px-2.5 py-0.5 text-xs",
      default: "px-3 py-1 text-sm",
      lg: "px-4 py-1.5 text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type BadgeVariants = NonNullableProps<typeof badgeVariants>;
type Props = JSX.IntrinsicElements["span"] & BadgeVariants;

export const Badge: FC<Props> = ({ className, variant, size, ...props }) => {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
};
