import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type SwitchProps = JSX.IntrinsicElements["div"] & {
  label?: string;
  name?: string;
  initialState?: boolean;
  variant?: "default" | "success" | "danger";
};

/**
 * Switch component for toggling boolean states using Alpine.js
 *
 * Features:
 * - Clean toggle animation
 * - Multiple color variants
 * - Alpine.js integration for state management
 * - Optional label integration
 * - Consistent styling with other form components
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
  ...props
}: SwitchProps) => {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      x-data={`{ isOn: ${initialState} }`}
      {...props}
    >
      {label && (
        <span className="text-text-700 dark:text-text-300">{label}</span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked="false"
        x-bind:aria-checked="isOn"
        x-on:click="isOn = !isOn"
        x-bind:class={`isOn 
          ? ${
          variant === "success"
            ? "'bg-success-500'"
            : variant === "danger"
            ? "'bg-danger-500'"
            : "'bg-primary-500'"
        } 
          : 'bg-background-300 dark:bg-background-700'`}
        className="w-12 h-6 rounded-full relative cursor-pointer transition-colors"
      >
        <span
          x-bind:class="isOn ? 'right-1' : 'left-1'"
          className="absolute top-1 w-4 h-4 bg-background-50 rounded-full transition-all"
        />
      </button>
    </div>
  );
};
