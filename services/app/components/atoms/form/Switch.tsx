import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";
import type { BaseComponentProps, HTMXProps } from "@comp/utils/props.ts";

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

type SwitchProps = BaseComponentProps & SwitchVariants & HTMXProps & {
  name: string;
  initialState?: boolean;
  disabled?: boolean;
};

/**
 * Switch component for toggling boolean states using Alpine.js
 *
 * Renders a visually styled switch control linked to a hidden checkbox.
 * Use a separate Label component associated via `id`/`for` attributes.
 *
 * @props
 * - name: Form field name (required). Used for ID and submission.
 * - initialState: Whether the switch is toggled on initially (default: false).
 * - disabled: Whether the switch is disabled (default: false).
 * - variant: Visual style of the switch ('default', 'success', 'danger', etc.)
 * - className: Additional classes for the wrapper div.
 * - ...rest: Props passed to the wrapper div.
 *
 * @example
 * <>
 *   <Label for="feature">Enable Feature</Label>
 *   <Switch
 *     name="feature"
 *     initialState={true}
 *     variant="success"
 *   />
 * </>
 */
export const Switch: FC<SwitchProps> = ({
  initialState = false,
  variant = "default",
  className,
  name,
  disabled = false,
  ...props
}: SwitchProps) => {
  return (
    <div
      className={cn("inline-block align-middle", className)}
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
    </div>
  );
};
