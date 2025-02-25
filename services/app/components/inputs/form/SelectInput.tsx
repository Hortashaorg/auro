import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const selectVariants = cva([
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

type SelectVariants = NonNullableProps<typeof selectVariants>;

type Option = {
  value: string;
  label: string;
};

type Props =
  & Omit<JSX.IntrinsicElements["select"], "children">
  & SelectVariants
  & {
    options: Option[];
    placeholder?: string;
  };

/**
 * SelectInput component for dropdown selection
 *
 * Features:
 * - Accepts an array of options with value and label
 * - Optional placeholder
 * - Different size variants (small, default, large)
 * - Error state styling
 * - Dark mode support
 * - Automatically detects error state from parent FormControl component via Alpine.js
 *
 * @example
 * <SelectInput
 *   name="country"
 *   options={[
 *     { value: "us", label: "United States" },
 *     { value: "ca", label: "Canada" },
 *     { value: "mx", label: "Mexico" }
 *   ]}
 *   placeholder="Select a country"
 *   size="default"
 * />
 */
export const SelectInput: FC<Props> = ({
  className,
  size,
  state = "default",
  options,
  placeholder,
  name,
  ...props
}: Props) => {
  // Base classes that are always applied
  const baseClasses = cn(selectVariants({ size, state }), className);

  // Error state classes to be conditionally applied
  const errorClasses = cn(
    selectVariants({ size, state: "error" }),
    className,
  );

  return (
    <select
      {...props}
      name={name}
      className={baseClasses}
      x-bind:class={`errors && errors['${name}'] ? '${errorClasses}' : '${baseClasses}'`}
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
