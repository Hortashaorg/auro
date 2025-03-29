import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import { FormControl } from "./FormControl.tsx";
import { Text } from "@comp/atoms/typography/index.ts";
import { Label } from "./Label.tsx";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type Option = {
  value: string;
  label: string;
  description?: string;
};

const checkboxGroupVariants = cva(
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

type CheckboxGroupVariants = NonNullableProps<typeof checkboxGroupVariants>;
type CheckboxGroupProps = BaseComponentProps & CheckboxGroupVariants & {
  name: string;
  options: Option[];
  values?: string[];
  label?: string;
  hint?: string;
};

/**
 * CheckboxGroup provides a group of checkboxes with consistent styling
 *
 * @props
 * - name: Field name for form submission
 * - options: Array of checkbox options (value, label, optional description)
 * - values: Array of pre-selected values
 * - label: Group label text
 * - hint: Helper text for the checkbox group
 * - orientation: Layout direction ('vertical' or 'horizontal')
 * - required: Whether the field is required
 *
 * @example
 * <CheckboxGroup
 *   name="features"
 *   label="Select Features"
 *   hint="Choose all the features you want to enable"
 *   options={[
 *     { value: "analytics", label: "Analytics", description: "Track user behavior" },
 *     { value: "notifications", label: "Notifications", description: "Send alerts to users" },
 *     { value: "automation", label: "Automation", description: "Automate repetitive tasks" }
 *   ]}
 *   orientation="vertical"
 *   required
 * />
 */
export const CheckboxGroup: FC<CheckboxGroupProps> = ({
  className,
  name,
  options,
  values = [],
  label,
  hint,
  orientation,
}: CheckboxGroupProps) => {
  return (
    <FormControl inputName={name} hint={hint} className={className}>
      {label && (
        <Label as="div">
          |
          {label}
        </Label>
      )}

      <div className={cn(checkboxGroupVariants({ orientation }))}>
        {options.map((option) => {
          const isChecked = values.includes(option.value);

          return (
            <label
              key={option.value}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <div className="relative flex h-5 w-5 shrink-0 items-center justify-center pt-0.5">
                <input
                  type="checkbox"
                  name={`${name}[]`}
                  value={option.value}
                  checked={isChecked}
                  className="before:content[''] peer relative size-4 appearance-none overflow-hidden rounded-sm border border-outline bg-surface-alt before:absolute before:inset-0 checked:border-primary checked:before:bg-primary focus:outline-2 focus:outline-offset-2 focus:outline-outline-strong checked:focus:outline-primary active:outline-offset-0 disabled:cursor-not-allowed dark:border-outline-dark dark:bg-surface-dark-alt dark:checked:border-primary-dark dark:checked:before:bg-primary-dark dark:focus:outline-outline-dark-strong dark:checked:focus:outline-primary-dark"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Text variant="body">
                  {option.label}
                </Text>
                {option.description && (
                  <Text variant="body">
                    {option.description}
                  </Text>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </FormControl>
  );
};
