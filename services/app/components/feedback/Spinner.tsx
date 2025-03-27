import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC } from "@kalena/framework";
import { cn } from "@comp/utils/tailwind.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";

const spinnerVariants = cva([
  "motion-safe:animate-spin",
], {
  variants: {
    variant: {
      primary: "dark:fill-primary-dark fill-primary",
      secondary: "dark:fill-secondary-dark fill-secondary",
      danger: "dark:fill-danger fill-danger",
      success: "dark:fill-success fill-success",
      warning: "dark:fill-warning fill-warning",
      info: "dark:fill-info fill-info",
    },
    size: {
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-7",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

type SpinnerVariants = NonNullableProps<typeof spinnerVariants>;

/**
 * Spinner component for indicating loading states
 *
 * @props
 * - variant: Visual style of the spinner ('primary', 'secondary', 'danger', etc.)
 * - size: Size of the spinner ('sm', 'md', 'lg', 'xl')
 *
 * @example
 * // Default spinner
 * <Spinner />
 *
 * @example
 * // Large danger spinner
 * <Spinner size="lg" variant="danger" />
 *
 * @example
 * // Inside a button with loading state
 * <button disabled>
 *   <Spinner size="sm" className="mr-2" />
 *   Loading...
 * </button>
 */
type SpinnerProps = BaseComponentProps & SpinnerVariants;

export const Spinner: FC<SpinnerProps> = ({
  variant,
  size,
  className,
  ...rest
}: SpinnerProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      class={cn(spinnerVariants({ variant, size }), className)}
      {...rest}
    >
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity=".25"
      />
      <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" />
    </svg>
  );
};
