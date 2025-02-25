import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const selectVariants = cva([
  "w-full",
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

type SelectVariants = NonNullableProps<typeof selectVariants>;
type Props = JSX.IntrinsicElements["select"] & SelectVariants & {
  options: Array<{
    value: string;
    label: string;
  }>;
  placeholder?: string;
};

/**
 * SelectInput component for dropdown selection with consistent styling
 *
 * Features:
 * - Accepts an array of options with value and label
 * - Optional placeholder option
 * - Different size variants
 * - Error state styling
 * - Proper dark mode support
 *
 * @example
 * <SelectInput
 *   name="category"
 *   placeholder="Select a category"
 *   options={[
 *     { value: "electronics", label: "Electronics" },
 *     { value: "clothing", label: "Clothing" },
 *     { value: "books", label: "Books" }
 *   ]}
 *   required
 *   size="default"
 *   state={hasError ? "error" : "default"}
 * />
 */
export const SelectInput: FC<Props> = ({
  className,
  size,
  state,
  options,
  placeholder,
  ...props
}: Props) => {
  return (
    <select
      {...props}
      className={cn(selectVariants({ size, state }), className)}
    >
      {placeholder && (
        <option value="" disabled selected>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
