import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { FormControl } from "@comp/molecules/form/index.ts";
import {
  Fieldset,
  Label,
  Legend,
  RadioButton,
} from "@comp/atoms/form/index.ts";
import { Text } from "@comp/atoms/typography/index.ts";

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
  legend: string;
  groupHint?: string;
  error?: string;
};

/**
 * RadioGroup component using Fieldset and Legend atoms for semantic grouping,
 * wrapped by FormControl for layout, hint, and AlpineJS error integration.
 *
 * @props
 * - name: Name for the radio group (used in forms and for error association)
 * - options: Array of options for the radio buttons { value, label, description?, disabled? }
 * - value: The currently selected value
 * - required: Whether a selection is required (applied to individual radio buttons)
 * - disabled: Whether the entire group is disabled (applied to fieldset)
 * - legend: The legend content for the fieldset (Child type).
 * - groupHint: Optional helper text for the group (passed to FormControl)
 * - error: Optional initial/server-side error message (passed to FormControl)
 */
export const RadioGroup: FC<RadioGroupProps> = ({
  className,
  name,
  options,
  value,
  required,
  disabled,
  legend,
  groupHint,
  error,
  ...props
}: RadioGroupProps) => {
  return (
    <FormControl
      inputName={name}
      hint={groupHint}
      error={error}
      className={className}
      {...props}
    >
      <Fieldset
        disabled={disabled}
      >
        <Legend>
          {legend}
        </Legend>

        <div className="space-y-2">
          {options.map((option) => {
            const optionId = `${name}-${option.value}`;
            const descriptionId = option.description
              ? `${optionId}-description`
              : undefined;
            const isChecked = value === option.value;
            const optionDisabled = option.disabled;

            return (
              <div
                key={option.value}
                className={cn(
                  "relative flex items-start gap-3",
                  optionDisabled && "cursor-not-allowed opacity-50",
                )}
              >
                <RadioButton
                  id={optionId}
                  name={name}
                  value={option.value}
                  checked={isChecked}
                  disabled={optionDisabled}
                  required={required}
                  aria-describedby={descriptionId}
                  className="mt-1 flex-shrink-0"
                />
                <div className="flex-grow">
                  <Label
                    htmlFor={optionId}
                    className={cn(
                      "text-sm",
                      (disabled || optionDisabled)
                        ? "cursor-not-allowed"
                        : "cursor-pointer",
                    )}
                  >
                    {option.label}
                  </Label>
                  {option.description && (
                    <Text
                      id={descriptionId}
                      variant="body"
                      size="sm"
                      className="mt-1 text-on-surface/80 dark:text-on-surface-dark/80"
                    >
                      {option.description}
                    </Text>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Fieldset>
    </FormControl>
  );
};
