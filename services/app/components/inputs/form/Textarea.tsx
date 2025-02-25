import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const textareaVariants = cva([
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
  "resize-none",
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

type TextareaVariants = NonNullableProps<typeof textareaVariants>;
type Props = JSX.IntrinsicElements["textarea"] & TextareaVariants;

/**
 * Textarea component with consistent styling and variants
 *
 * Supports different sizes and states, with proper dark mode support.
 * By default, resize is disabled but can be overridden with className.
 *
 * @example
 * <Textarea
 *   name="description"
 *   placeholder="Enter a description"
 *   rows={4}
 *   size="default"
 *   state={hasError ? "error" : "default"}
 * />
 */
export const Textarea: FC<Props> = ({
  className,
  size,
  state,
  ...props
}: Props) => {
  return (
    <textarea
      {...props}
      className={cn(textareaVariants({ size, state }), className)}
    />
  );
};
