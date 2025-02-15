import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const buttonVariants = cva([
  "rounded",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
  "transition-transform",
  "disabled:hover:transform-none",
  "text-base",
  "font-normal",
  "leading-tight",
  "box-content",
  "cursor-pointer",
], {
  variants: {
    variant: {
      primary: [
        "border-2",
        "dark:border-primary-600",
        "border-primary-400",
        "text-text-600",
        "dark:text-text-200",
        "dark:bg-primary-600",
        "bg-primary-400",
        "py-2",
        "px-4",
        "rounded",
      ],
      secondary: [
        "border-2",
        "text-text-600",
        "dark:text-text-200",
        "dark:bg-secondary-600",
        "bg-secondary-400",
        "dark:border-secondary-600",
        "border-secondary-400",
        "rounded",
      ],
      outline: [
        "border-2",
        "dark:border-primary-600",
        "dark:text-text-200",
        "border-primary-400",
        "text-text-600",
        "rounded",
      ],
      danger: [
        "border-2",
        "dark:border-danger-600",
        "dark:text-text-200",
        "border-danger-400",
        "dark:bg-danger-600",
        "bg-danger-400",
        "text-text-600",
        "rounded",
      ],
    },
    buttonSize: {
      small: ["text-sm", "px-3.5", "py-1.5"],
      medium: ["text-base", "px-5", "py-2.5"],
      large: ["text-lg", "px-7", "py-3"],
    },
  },
  defaultVariants: {
    variant: "primary",
    buttonSize: "medium",
  },
});
type ButtonVariants = NonNullableProps<typeof buttonVariants>;

type Props = JSX.IntrinsicElements["button"] & ButtonVariants;

export const Button: FC<Props> = (
  { children, variant, buttonSize, className, ...rest }: Props,
) => {
  return (
    <button
      {...rest}
      className={cn(buttonVariants({ variant, buttonSize }), className)}
    >
      {children}
    </button>
  );
};
