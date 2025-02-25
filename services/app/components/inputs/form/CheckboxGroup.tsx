import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";
import { FormControl } from "./FormControl.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Label } from "./Label.tsx";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";

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
type CheckboxGroupProps =
  & Omit<JSX.IntrinsicElements["div"], "onChange">
  & CheckboxGroupVariants
  & {
    name: string;
    options: Option[];
    values?: string[];
    onChange?: (values: string[]) => void;
    label?: string;
    hint?: string;
    required?: boolean;
  };

/**
 * CheckboxGroup provides a group of checkboxes with consistent styling
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
  onChange,
  label,
  hint,
  orientation,
  required,
}: CheckboxGroupProps) => {
  const handleChange = (value: string, checked: boolean) => {
    if (!onChange) return;

    if (checked) {
      onChange([...values, value]);
    } else {
      onChange(values.filter((v) => v !== value));
    }
  };

  return (
    <FormControl inputName={name} hint={hint} className={className}>
      {label && (
        <Label as="div" required={required}>
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
                  onChange={() => handleChange(option.value, !isChecked)}
                  className="h-4 w-4 cursor-pointer rounded border-border text-primary focus:ring-1 focus:ring-primary focus:ring-offset-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Text
                  variant="body"
                  className="text-sm font-medium group-hover:text-primary"
                >
                  {option.label}
                </Text>
                {option.description && (
                  <Text variant="body" className="mt-1 text-xs">
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
