import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva } from "class-variance-authority";
import type { FC } from "@kalena/framework";

const inputVariants = cva([
  "rounded-md",
  "border",
  "dark:border-outline-dark",
  "border-outline",
  "bg-surface",
  "dark:bg-surface-dark",
  "text-on-surface-strong",
  "dark:text-on-surface-dark-strong",
  "focus:outline-none",
  "focus:ring-2",
  "focus:ring-primary",
  "dark:focus:ring-primary-dark",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
  "w-full",
], {
  variants: {
    size: {
      default: ["px-4", "py-2"],
      small: ["px-3", "py-1", "text-sm"],
      large: ["px-6", "py-3", "text-lg"],
    },
    state: {
      default: [],
      error: [
        "border-danger",
        "dark:border-danger",
        "focus:ring-danger",
      ],
    },
  },
  defaultVariants: {
    size: "default",
    state: "default",
  },
});

type InputVariants = NonNullableProps<typeof inputVariants>;
type InputProps = BaseComponentProps & InputVariants & {
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string | number;
};

/**
 * Input component with consistent styling and variants
 *
 * @props
 * - size: Input field size ('default', 'small', 'large')
 * - state: Visual state of the input ('default', 'error')
 * - name: Input name (required). Used for form submission and error state.
 * - type: Input type (text, email, password, etc.)
 * - placeholder: Placeholder text
 * - required: Whether the field is required
 * - disabled: Whether the field is disabled
 *
 * @example
 * <Input
 *   name="email"
 *   type="email"
 *   placeholder="Enter your email"
 *   required
 *   size="default"
 * />
 */
export const Input: FC<InputProps> = ({
  className,
  size,
  state = "default",
  name,
  ...props
}) => {
  const baseClasses = cn(inputVariants({ size, state }), className);

  const errorClasses = cn(
    inputVariants({ size, state: "error" }),
    className,
  );

  return (
    <input
      {...props}
      name={name}
      className={baseClasses}
      x-bind:class={`errors && errors['${name}'] ? '${errorClasses}' : '${baseClasses}'`}
    />
  );
};
