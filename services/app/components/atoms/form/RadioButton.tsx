import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva } from "class-variance-authority";

const radioButtonVariants = cva(
  [
    "h-4 w-4 border-outline dark:border-outline-dark",
    "text-primary dark:text-primary-dark",
    "focus:ring-primary dark:focus:ring-primary-dark",
    "focus:ring-2 focus:ring-offset-0",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ],
);

// Define specific props for RadioButton, inheriting framework/HTML attributes
type RadioButtonProps = BaseComponentProps & {
  name: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
};

/**
 * RadioButton component - a single radio input element.
 * Intended to be used within a RadioGroup molecule.
 * Uses CVA for styling consistency and future variant additions.
 *
 * @props Inherits standard HTML input attributes via JSX.IntrinsicElements except 'type' and 'size'.
 * @props Includes CVA variant props for styling.
 */
export const RadioButton: FC<RadioButtonProps> = ({
  className,
  id,
  name,
  value,
  checked,
  disabled,
  required,
  ...props // Pass remaining props like aria-describedby
}) => {
  // Generate classes using CVA. Pass className to allow overriding/extending.
  // Also pass any specific variant props defined in the variants object if they existed.
  const radioClasses = cn(radioButtonVariants({ className }));

  return (
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      disabled={disabled}
      required={required}
      className={radioClasses} // Apply CVA generated classes
      {...props}
    />
  ) // Spread the rest of the props
  ;
};
