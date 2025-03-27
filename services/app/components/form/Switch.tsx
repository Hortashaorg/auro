import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";

const switchTrackVariants = cva([
  "relative",
  "h-6",
  "w-11",
  "rounded-full",
  "border",
  "border-outline",
  "bg-surface-alt",
  "transition-colors",
  "cursor-pointer",
  "after:absolute",
  "after:bottom-0",
  "after:left-[0.0625rem]",
  "after:top-0",
  "after:my-auto",
  "after:h-5",
  "after:w-5",
  "after:rounded-full",
  "after:bg-on-surface",
  "after:transition-all",
  "after:content-['']",
  "peer-focus:outline-2",
  "peer-focus:outline-offset-2",
  "peer-focus:outline-outline-strong",
  "peer-active:outline-offset-0",
  "peer-disabled:cursor-not-allowed",
  "peer-disabled:opacity-70",
  "dark:border-outline-dark",
  "dark:bg-surface-dark-alt",
  "dark:after:bg-on-surface-dark",
  "dark:peer-focus:outline-outline-dark-strong",
], {
  variants: {
    variant: {
      default: [
        "peer-checked:bg-primary",
        "peer-checked:after:bg-on-primary",
        "peer-checked:after:translate-x-5",
        "peer-focus:peer-checked:outline-primary",
        "dark:peer-checked:bg-primary-dark",
        "dark:peer-checked:after:bg-on-primary-dark",
        "dark:peer-focus:peer-checked:outline-primary-dark",
      ],
      success: [
        "peer-checked:bg-success",
        "peer-checked:after:bg-on-success",
        "peer-checked:after:translate-x-5",
        "peer-focus:peer-checked:outline-success",
        "dark:peer-checked:bg-success",
        "dark:peer-checked:after:bg-on-success",
        "dark:peer-focus:peer-checked:outline-success",
      ],
      danger: [
        "peer-checked:bg-danger",
        "peer-checked:after:bg-on-danger",
        "peer-checked:after:translate-x-5",
        "peer-focus:peer-checked:outline-danger",
        "dark:peer-checked:bg-danger",
        "dark:peer-checked:after:bg-on-danger",
        "dark:peer-focus:peer-checked:outline-danger",
      ],
      warning: [
        "peer-checked:bg-warning",
        "peer-checked:after:bg-on-warning",
        "peer-checked:after:translate-x-5",
        "peer-focus:peer-checked:outline-warning",
        "dark:peer-checked:bg-warning",
        "dark:peer-checked:after:bg-on-warning",
        "dark:peer-focus:peer-checked:outline-warning",
      ],
      info: [
        "peer-checked:bg-info",
        "peer-checked:after:bg-on-info",
        "peer-checked:after:translate-x-5",
        "peer-focus:peer-checked:outline-info",
        "dark:peer-checked:bg-info",
        "dark:peer-checked:after:bg-on-info",
        "dark:peer-focus:peer-checked:outline-info",
      ],
      secondary: [
        "peer-checked:bg-secondary",
        "peer-checked:after:bg-on-secondary",
        "peer-checked:after:translate-x-5",
        "peer-focus:peer-checked:outline-secondary",
        "dark:peer-checked:bg-secondary-dark",
        "dark:peer-checked:after:bg-on-secondary-dark",
        "dark:peer-focus:peer-checked:outline-secondary-dark",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type SwitchVariants = NonNullableProps<typeof switchTrackVariants>;

type SwitchProps = BaseComponentProps & SwitchVariants & {
  label?: string;
  name?: string;
  initialState?: boolean;
  disabled?: boolean;
};

/**
 * Switch component for toggling boolean states using Alpine.js
 *
 * @props
 * - label: Text label beside the switch
 * - name: Form field name
 * - initialState: Whether the switch is toggled on initially
 * - disabled: Whether the switch is disabled
 * - variant: Visual style of the switch ('default', 'success', 'danger', etc.)
 *
 * @example
 * <Switch
 *   name="enableFeature"
 *   initialState={true}
 *   label="Enable feature"
 *   variant="success"
 * />
 */
export const Switch: FC<SwitchProps> = ({
  label,
  initialState = false,
  variant = "default",
  className,
  name,
  disabled = false,
  ...props
}: SwitchProps) => {
  return (
    <div
      className={cn("flex items-center gap-3", className)}
      x-data={`{ isOn: ${initialState} }`}
      {...props}
    >
      <input
        type="checkbox"
        id={name}
        name={name}
        className="peer sr-only"
        role="switch"
        x-model="isOn"
        disabled={disabled}
      />
      <div
        x-on:click="!$el.previousElementSibling.disabled && (isOn = !isOn)"
        className={cn(
          switchTrackVariants({ variant }),
          "aria-hidden",
        )}
      >
      </div>
      {label && (
        <span className="text-sm font-medium text-on-surface peer-checked:text-on-surface-strong peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-on-surface-dark dark:peer-checked:text-on-surface-dark-strong">
          {label}
        </span>
      )}
    </div>
  );
};
