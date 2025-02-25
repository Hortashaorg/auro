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

const radioGroupVariants = cva(
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

type RadioGroupVariants = NonNullableProps<typeof radioGroupVariants>;
type RadioGroupProps =
  & Omit<JSX.IntrinsicElements["div"], "onChange">
  & RadioGroupVariants
  & {
    name: string;
    options: Option[];
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    hint?: string;
    required?: boolean;
  };

/**
 * RadioGroup provides a group of radio buttons with consistent styling
 *
 * @example
 * <RadioGroup
 *   name="priority"
 *   label="Priority Level"
 *   hint="Select the importance of this task"
 *   options={[
 *     { value: "low", label: "Low", description: "Not urgent" },
 *     { value: "medium", label: "Medium", description: "Somewhat urgent" },
 *     { value: "high", label: "High", description: "Very urgent" }
 *   ]}
 *   orientation="horizontal"
 *   required
 * />
 */
export const RadioGroup: FC<RadioGroupProps> = ({
  className,
  name,
  options,
  value,
  onChange,
  label,
  hint,
  orientation,
  required,
}: RadioGroupProps) => {
  return (
    <FormControl inputName={name} hint={hint} className={className}>
      {label && (
        <Label as="div" required={required}>
          {label}
        </Label>
      )}

      <div className={cn(radioGroupVariants({ orientation }))}>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center pt-0.5">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange ? () => onChange(option.value) : undefined}
                className="h-4 w-4 cursor-pointer rounded-full border-border text-primary focus:ring-1 focus:ring-primary focus:ring-offset-1"
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
        ))}
      </div>
    </FormControl>
  );
};
