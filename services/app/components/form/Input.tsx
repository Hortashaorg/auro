import { cn } from "@utils/tailwind.ts";
import type { NonNullableProps } from "@utils/types.ts";
import { cva } from "class-variance-authority";
import type { JSX } from "preact";

const inputVariants = cva(
  [
    "border-2",
    "rounded",
    "focus:outline-none",
    "transition-shadow",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
    "text-base",
    "px-5",
    "py-2.5",
  ],
  {
    variants: {
      variant: {
        default: [
          "dark:border-primary-800",
          "border-primary-200",
          "dark:text-text-100",
          "text-text-800",
          "dark:bg-primary-900",
          "bg-primary-100",
          "dark:placeholder:text-text-300",
          "placeholder:text-text-700",
          "focus:border-primary-400",
          "focus:ring-2",
          "focus:ring-primary-400",
          "dark:focus:ring-primary-600",
        ],
        error: [
          "border-error-600",
          "text-error-700",
          "dark:text-error-300",
          "dark:bg-error-700",
          "bg-error-100",
          "dark:placeholder:text-error-300",
          "placeholder:text-error-700",
          "focus:border-error-400",
          "focus:ring-2",
          "focus:ring-error-400",
          "dark:focus:ring-error-700",
        ],
      },
    },
  },
);

type InputVariants = NonNullableProps<typeof inputVariants, "variant">;

interface Props extends JSX.HTMLAttributes<HTMLInputElement>, InputVariants {}

export const Input = ({ className, variant = "default", ...rest }: Props) => {
  <input {...rest} className={cn(inputVariants({ variant }), className)} />;
};
