import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva } from "class-variance-authority";

const checkboxVariants = cva(
  [
    "before:content['']",
    "peer",
    "relative",
    "size-4",
    "appearance-none",
    "overflow-hidden",
    "rounded-sm",
    "border",
    "border-outline",
    "dark:border-outline-dark",
    "bg-surface-alt",
    "dark:bg-surface-dark-alt",
    "checked:border-primary",
    "dark:checked:border-primary-dark",
    "checked:before:bg-primary",
    "dark:checked:before:bg-primary-dark",
    "before:absolute",
    "before:inset-0",
    "focus:outline-2",
    "focus:outline-offset-2",
    "focus:outline-outline-strong",
    "dark:focus:outline-outline-dark-strong",
    "checked:focus:outline-primary",
    "dark:checked:focus:outline-primary-dark",
    "active:outline-offset-0",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
  ],
);

type CheckboxProps = BaseComponentProps & {
  name: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  "aria-describedby"?: string;
};

/**
 * Checkbox component - Renders a styled HTML <input type="checkbox"> element.
 * Intended for use within CheckboxGroup or individually with a Label.
 *
 * @props Inherits base props (id, className, etc.) and explicitly defines necessary input attributes.
 */
export const Checkbox: FC<CheckboxProps> = ({
  className,
  name,
  value,
  checked,
  disabled,
  required,
  "aria-describedby": describedBy,
  ...props
}) => {
  return (
    <input
      type="checkbox"
      className={cn(checkboxVariants(), className)}
      name={name}
      value={value}
      checked={checked}
      disabled={disabled}
      required={required}
      aria-describedby={describedBy}
      {...props}
    />
  );
};
