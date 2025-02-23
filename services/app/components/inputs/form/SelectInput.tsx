import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";
import { Text } from "@comp/content/Text.tsx";

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

export const SelectInput: FC<Props> = ({
  className,
  size,
  state,
  options,
  placeholder,
  ...props
}: Props) => {
  return (
    <>
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
      <Text
        variant="error"
        className="mt-1 text-sm"
        x-show={`errors['${props.name}']`}
        x-text={`errors['${props.name}']`}
      />
    </>
  );
};
