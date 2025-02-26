import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const spinnerVariants = cva([
  "animate-spin",
  "rounded-full",
  "border-background-300",
  "dark:border-background-700",
  "border-t-primary-600",
  "dark:border-t-primary-400",
], {
  variants: {
    size: {
      sm: "w-4 h-4 border-2",
      default: "w-6 h-6 border-2",
      lg: "w-8 h-8 border-3",
      xl: "w-12 h-12 border-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type SpinnerVariants = NonNullableProps<typeof spinnerVariants>;
type Props = JSX.IntrinsicElements["div"] & SpinnerVariants;

/**
 * Spinner component for indicating loading states
 *
 * Features:
 * - Multiple size options (sm, default, lg, xl)
 * - Smooth animation with CSS
 * - Accessible with proper ARIA attributes
 * - Consistent styling with proper dark mode support
 * - Minimal and clean design
 *
 * @example
 * // Default size spinner
 * <Spinner />
 *
 * // Large spinner
 * <Spinner size="lg" />
 *
 * // Inside a button with loading state
 * <button disabled>
 *   <Spinner size="sm" className="mr-2" />
 *   Loading...
 * </button>
 */
export const Spinner: FC<Props> = ({ size, className, ...rest }: Props) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size }), className)}
      {...rest}
    />
  );
};
