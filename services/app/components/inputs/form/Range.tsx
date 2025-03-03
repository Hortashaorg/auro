import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const rangeVariants = cva([
  "w-full",
  "h-2",
  "bg-background-200",
  "dark:bg-background-700",
  "rounded-lg",
  "appearance-none",
  "cursor-pointer",
  "focus:outline-none",
  "focus:ring-2",
  "focus:ring-primary-500",
  "dark:focus:ring-primary-400",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
], {
  variants: {
    size: {
      default: ["h-2"],
      small: ["h-1.5"],
      large: ["h-3"],
    },
    state: {
      default: [],
      error: [
        "focus:ring-danger-500",
      ],
    },
  },
  defaultVariants: {
    size: "default",
    state: "default",
  },
});

type RangeVariants = NonNullableProps<typeof rangeVariants>;

type Props = Omit<JSX.IntrinsicElements["input"], "type"> & RangeVariants & {
  unitSuffix?: string;
  showValue?: boolean;
};

/**
 * Range component for numeric input with a slider
 *
 * Features:
 * - Real-time value display with optional unit suffix
 * - Different size variants (small, default, large)
 * - Error state styling
 * - Dark mode support
 * - Alpine.js integration for reactivity
 * - Automatically detects error state from parent FormControl component
 *
 * @example
 * <Range
 *   name="opacity"
 *   min={0}
 *   max={100}
 *   defaultValue={75}
 *   unitSuffix="%"
 *   showValue
 *   size="default"
 * />
 */
export const Range: FC<Props> = ({
  className,
  size,
  state = "default",
  name,
  unitSuffix = "",
  showValue = true,
  defaultValue = 0,
  ...props
}: Props) => {
  // Base classes that are always applied
  const baseClasses = cn(rangeVariants({ size, state }), className);

  // Error state classes to be conditionally applied
  const errorClasses = cn(
    rangeVariants({ size, state: "error" }),
    className,
  );

  return (
    <div
      className="flex items-center gap-3"
      x-data={`{ value: ${defaultValue} }`}
    >
      <input
        type="range"
        {...props}
        name={name}
        x-model="value"
        className={baseClasses}
        x-bind:class={`errors && errors['${name}'] ? '${errorClasses}' : '${baseClasses}'`}
      />
      {showValue && (
        <span
          className="w-12 text-right text-sm text-text-700 dark:text-text-300"
          x-text={`value + '${unitSuffix}'`}
        />
      )}
    </div>
  );
};
