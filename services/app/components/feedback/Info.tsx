import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const infoVariants = cva([
  "rounded-lg",
  "p-4",
  "flex",
  "gap-3",
  "items-center",
], {
  variants: {
    variant: {
      info: [
        "bg-info-50",
        "text-info-800",
        "dark:bg-info-950",
        "dark:text-info-200",
      ],
      warning: [
        "bg-warning-50",
        "text-warning-800",
        "dark:bg-warning-950",
        "dark:text-warning-200",
      ],
      success: [
        "bg-success-50",
        "text-success-800",
        "dark:bg-success-950",
        "dark:text-success-200",
      ],
      danger: [
        "bg-danger-50",
        "text-danger-800",
        "dark:bg-danger-950",
        "dark:text-danger-200",
      ],
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

type InfoVariants = NonNullableProps<typeof infoVariants>;
type Props = JSX.IntrinsicElements["div"] & InfoVariants;

/**
 * Info component for displaying contextual messages and alerts
 *
 * Features:
 * - Multiple variants (info, warning, success, danger)
 * - Appropriate icons for each variant
 * - Consistent styling with proper dark mode support
 * - Accessible with role="alert"
 * - Flexible content area
 *
 * @example
 * // Information message
 * <Info variant="info">
 *   This is an informational message.
 * </Info>
 *
 * // Warning message
 * <Info variant="warning">
 *   Please be careful with this action.
 * </Info>
 *
 * // Success message
 * <Info variant="success">
 *   Your changes have been saved successfully.
 * </Info>
 *
 * // Error message
 * <Info variant="danger">
 *   An error occurred while processing your request.
 * </Info>
 */
export const Info: FC<Props> = (
  { className, variant, children, ...props }: Props,
) => {
  return (
    <div
      role="alert"
      className={cn(infoVariants({ variant }), className)}
      {...props}
    >
      <div className="shrink-0 flex items-center">
        {variant === "info" && <i data-lucide="info"></i>}
        {variant === "warning" && <i data-lucide="alert-triangle"></i>}
        {variant === "success" && <i data-lucide="check-circle"></i>}
        {variant === "danger" && <i data-lucide="x-circle"></i>}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
