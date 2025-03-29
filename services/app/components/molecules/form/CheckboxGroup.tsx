import { cn } from "@comp/utils/tailwind.ts";
import type { Child, FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { FormControl } from "@comp/molecules/form/index.ts";
import { Checkbox, Fieldset, Label, Legend } from "@comp/atoms/form/index.ts";
import { Text } from "@comp/atoms/typography/index.ts";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";

type Option = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

const checkboxGroupContainerVariants = cva(
  "flex",
  {
    variants: {
      orientation: {
        vertical: "flex-col gap-3",
        horizontal: "flex-row flex-wrap gap-6",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

type CheckboxGroupProps =
  & BaseComponentProps
  & NonNullableProps<typeof checkboxGroupContainerVariants>
  & {
    name: string;
    options: Option[];
    values?: string[];
    legend: Child;
    hint?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
  };

/**
 * CheckboxGroup component using Fieldset/Legend for semantic grouping,
 * wrapped by FormControl for layout and error handling.
 *
 * @props
 * - name: Base name for the checkbox inputs (e.g., "features"). Use `[]` in form handler for arrays.
 * - options: Array of options { value, label, description?, disabled? }
 * - values: Array of currently checked values.
 * - legend: The legend content for the fieldset (Child type).
 * - hint: Optional helper text (passed to FormControl).
 * - error: Optional initial error message (passed to FormControl).
 * - disabled: Disables the entire group via the fieldset.
 * - orientation: Layout of options ('vertical' or 'horizontal').
 * - required: Note: Standard HTML checkbox groups don't have a single group `required` attribute.
 *             Enforcement is typically done via validation. Apply `required` to individual Checkbox atoms if needed.
 */
export const CheckboxGroup: FC<CheckboxGroupProps> = ({
  className,
  name,
  options,
  values = [],
  legend,
  hint,
  error,
  disabled,
  orientation,
  required,
  ...props
}: CheckboxGroupProps) => {
  return (
    <FormControl
      inputName={name}
      hint={hint}
      error={error}
      className={className}
      {...props}
    >
      <Fieldset disabled={disabled}>
        <Legend>{legend}</Legend>

        <div className={cn(checkboxGroupContainerVariants({ orientation }))}>
          {options.map((option) => {
            const optionId = `${name}-${option.value}`;
            const isChecked = values.includes(option.value);
            const optionDisabled = option.disabled;
            const descriptionId = option.description
              ? `${optionId}-description`
              : undefined;

            return (
              <div
                key={option.value}
                className={cn(
                  "relative flex items-start gap-3",
                  (disabled || optionDisabled) && "opacity-50",
                )}
              >
                <Checkbox
                  id={optionId}
                  name={`${name}[]`}
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
