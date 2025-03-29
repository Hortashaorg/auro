import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

const rangeVariants = cva(
  "h-2 w-full appearance-none bg-on-surface/15 focus:outline-primary dark:bg-on-surface-dark/15 dark:focus:outline-primary-dark [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-primary dark:[&::-moz-range-thumb]:bg-primary-dark active:[&::-moz-range-thumb]:scale-110 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:bg-primary active:[&::-webkit-slider-thumb]:scale-110 dark:[&::-webkit-slider-thumb]:bg-primary-dark [&::-moz-range-thumb]:rounded-full [&::-webkit-slider-thumb]:rounded-full rounded-full",
  {
    variants: {
      state: {
        default: [],
        error: [
          "focus:ring-danger",
        ],
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

type RangeVariants = NonNullableProps<typeof rangeVariants>;

type RangeProps = BaseComponentProps & RangeVariants & {
  unitSuffix?: string;
  showValue?: boolean;
  min?: number | string;
  max?: number | string;
  defaultValue?: number | string;
  name: string;
};

/**
 * Range component for numeric input with a slider
 *
 * @props
 * - state: Visual state of the slider ('default', 'error')
 * - unitSuffix: Text to display after the value (e.g., '%', 'px')
 * - showValue: Whether to display the current value
 * - defaultValue: Initial value of the slider
 * - min: Minimum value
 * - max: Maximum value
 * - name: Form field name
 *
 * @example
 * <Range
 *   name="opacity"
 *   min={0}
 *   max={100}
 *   defaultValue={75}
 *   unitSuffix="%"
 *   showValue
 * />
 */
export const Range: FC<RangeProps> = ({
  className,
  state = "default",
  name,
  unitSuffix = "",
  showValue = true,
  defaultValue = 0,
  ...props
}: RangeProps) => {
  const baseClasses = cn(rangeVariants({ state }), className);

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
          className="w-12 text-right text-sm text-on-surface dark:text-on-surface-dark"
          x-text={`value + '${unitSuffix}'`}
        />
      )}
    </div>
  );
};
