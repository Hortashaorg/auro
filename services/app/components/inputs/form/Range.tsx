import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const rangeVariants = cva(
  "h-2 w-full appearance-none bg-on-surface/15 focus:outline-primary dark:bg-on-surface-dark/15 dark:focus:outline-primary-dark [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-primary dark:[&::-moz-range-thumb]:bg-primary-dark active:[&::-moz-range-thumb]:scale-110 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:bg-primary active:[&::-webkit-slider-thumb]:scale-110 dark:[&::-webkit-slider-thumb]:bg-primary-dark [&::-moz-range-thumb]:rounded-full [&::-webkit-slider-thumb]:rounded-full rounded-full",
  {
    variants: {
      state: {
        default: [],
        error: [
          "focus:ring-danger-500",
        ],
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

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
  state = "default",
  name,
  unitSuffix = "",
  showValue = true,
  defaultValue = 0,
  ...props
}: Props) => {
  // Base classes that are always applied
  const baseClasses = cn(rangeVariants({ state }), className);

  // Error state classes to be conditionally applied
  const errorClasses = cn(
    rangeVariants({ state: "error" }),
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
