import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const inputVariants = cva([
  "rounded-md",
  "border",
  "dark:border-background-700",
  "border-background-300",
  "bg-background-50",
  "dark:bg-background-800",
  "text-text-900",
  "dark:text-text-100",
  "focus:outline-none",
  "focus:ring-2",
  "focus:ring-primary-500",
  "dark:focus:ring-primary-400",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
  "w-full",
], {
  variants: {
    size: {
      default: ["px-4", "py-2"],
      small: ["px-3", "py-1", "text-sm"],
      large: ["px-6", "py-3", "text-lg"],
    },
    state: {
      default: [],
      error: [
        "border-danger-300",
        "dark:border-danger-700",
        "focus:ring-danger-500",
      ],
    },
  },
  defaultVariants: {
    size: "default",
    state: "default",
  },
});

type InputVariants = NonNullableProps<typeof inputVariants>;
type Props = JSX.IntrinsicElements["input"] & InputVariants;

export const Input: FC<Props> = ({
  className,
  size,
  state,
  ...props
}: Props) => {
  return (
    <input
      {...props}
      className={cn(inputVariants({ size, state }), className)}
    />
  );
};
