import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

const selectVariants = cva([
  "rounded-md",
  "border",
  "dark:border-outline-dark",
  "border-outline",
  "bg-surface",
  "dark:bg-surface-dark",
  "text-on-surface-strong",
  "dark:text-on-surface-dark-strong",
  "focus:outline-none",
  "focus:ring-2",
  "focus:ring-primary",
  "dark:focus:ring-primary-dark",
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
        "border-danger",
        "dark:border-danger",
        "focus:ring-danger",
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

type SelectInputProps =
  & BaseComponentProps
  & SelectVariants
  & {
    options: Option[];
    placeholder?: string;
    name: string;
  };

/**
 * SelectInput component for dropdown selection
 *
 * @props
 * - options: Array of options with value and label properties
 * - placeholder: Optional text shown when no option is selected
 * - size: Size of the select input ('default', 'small', 'large')
 * - state: Visual state of the input ('default', 'error')
 * - name: Form field name
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
export const SelectInput: FC<SelectInputProps> = ({
  className,
  size,
  state = "default",
  options,
  placeholder,
  name,
  ...props
}: SelectInputProps) => {
  const baseClasses = cn(selectVariants({ size, state }), className);
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
