import { cn } from "@utils/tailwind.ts";
import type { NonNullableProps } from "@utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@hono/hono/jsx";

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
