import { cn } from "@comp/utils/tailwind.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";
import type { NonNullableProps } from "@comp/utils/types.ts";

const badgeVariants = cva([
  "rounded-radius",
  "w-fit",
  "border",
  "px-2",
  "py-1",
  "text-xs",
  "font-medium",
  "focus:ring-2",
  "focus:ring-primary-400",
  "focus:ring-offset-2",
], {
  variants: {
    variant: {
      default: [
        "border-outline",
        "bg-surface-alt",
        "text-on-surface",
        "dark:border-outline-dark",
        "dark:bg-surface-dark-alt",
        "dark:text-on-surface-dark",
      ],
      inverse: [
        "border-outline-dark",
        "bg-surface-dark-alt",
        "text-on-surface-dark",
        "dark:border-outline",
        "dark:bg-surface-alt",
        "dark:text-on-surface",
      ],
      primary: [
        "border-primary",
        "bg-primary",
        "text-on-primary",
        "dark:border-primary-dark",
        "dark:bg-primary-dark",
        "dark:text-on-primary-dark",
      ],
      secondary: [
        "border-secondary",
        "bg-secondary",
        "text-on-secondary",
        "dark:border-secondary-dark",
        "dark:bg-secondary-dark",
        "dark:text-on-secondary-dark",
      ],
      info: [
        "border-info",
        "bg-info",
        "text-on-info",
        "dark:border-info",
        "dark:bg-info",
        "dark:text-on-info",
      ],
      success: [
        "border-success",
        "bg-success",
        "text-on-success",
        "dark:border-success",
        "dark:bg-success",
        "dark:text-on-success",
      ],
      warning: [
        "border-warning",
        "bg-warning",
        "text-on-warning",
        "dark:border-warning",
        "dark:bg-warning",
        "dark:text-on-warning",
      ],
      danger: [
        "border-danger",
        "bg-danger",
        "text-on-danger",
        "dark:border-danger",
        "dark:bg-danger",
        "dark:text-on-danger",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BadgeVariants = NonNullableProps<typeof badgeVariants>;
type Props = JSX.IntrinsicElements["span"] & BadgeVariants;

/**
 * Badge component for displaying status, labels, or counts
 *
 * Features:
 * - Multiple color variants (default, secondary, success, danger, warning)
 * - Consistent styling with proper dark mode support
 * - Focus states for accessibility
 *
 * @example
 * <Badge>Default</Badge>
 *
 * <Badge variant="success">
 *   Completed
 * </Badge>
 *
 * <Badge variant="danger">
 *   Critical
 * </Badge>
 */
export const Badge: FC<Props> = ({ className, variant, ...props }) => {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
};
