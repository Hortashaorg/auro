import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

/**
 * RadioGroup component for displaying a group of radio buttons
 *
 * @props
 * - name: Name for the radio group (used in forms)
 * - options: Array of options for the radio buttons
 * - value: The currently selected value
 * - required: Whether a selection is required
 * - disabled: Whether the entire group is disabled
 *
 * @example
 * <RadioGroup
 *   name="plan"
 *   options={[
 *     { value: "basic", label: "Basic Plan" },
 *     { value: "pro", label: "Pro Plan" },
 *     { value: "enterprise", label: "Enterprise Plan" }
 *   ]}
 *   required
 * />
 */
type RadioOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

type RadioGroupProps = BaseComponentProps & {
  name: string;
  options: RadioOption[];
  value?: string;
  required?: boolean;
  disabled?: boolean;
};

export const RadioGroup: FC<RadioGroupProps> = ({
  className,
  name,
  options,
  value,
  required,
  disabled,
  ...props
}: RadioGroupProps) => {
  return (
    <div
      className={cn("space-y-2", className)}
      role="radiogroup"
      {...props}
    >
      {options.map((option) => (
        <div
          key={option.value}
          className={cn(
            "relative flex items-start",
            option.disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <div className="flex items-center h-6">
            <input
              id={`${name}-${option.value}`}
              aria-describedby={option.description
                ? `${name}-${option.value}-description`
                : undefined}
              name={name}
              type="radio"
              value={option.value}
              checked={value === option.value}
              disabled={disabled || option.disabled}
              required={required}
              className={cn(
                "h-4 w-4 border-outline dark:border-outline-dark",
                "text-primary dark:text-primary-dark",
                "focus:ring-primary dark:focus:ring-primary-dark",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor={`${name}-${option.value}`}
              className={cn(
                "font-medium text-on-surface-strong dark:text-on-surface-dark-strong",
                (disabled || option.disabled) && "cursor-not-allowed",
              )}
            >
              {option.label}
            </label>
            {option.description && (
              <p
                id={`${name}-${option.value}-description`}
                className="text-on-surface dark:text-on-surface-dark"
              >
                {option.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
