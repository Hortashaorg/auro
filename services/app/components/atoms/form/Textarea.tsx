import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

const textareaVariants = cva([
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
  "resize-y",
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

type TextareaVariants = NonNullableProps<typeof textareaVariants>;
type TextareaProps = BaseComponentProps & TextareaVariants & {
  name: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
};

/**
 * Textarea component for multi-line text input
 *
 * @props
 * - size: Sizing of the textarea ('default', 'small', 'large')
 * - state: Visual state of the textarea ('default', 'error')
 * - name: Input name (required). Used for form submission and error state.
 * - rows: Number of visible text lines
 * - placeholder: Placeholder text
 * - required: Whether the field is required
 * - disabled: Whether the field is disabled
 *
 * @example
 * <Textarea
 *   name="description"
 *   placeholder="Enter description"
 *   rows={4}
 *   size="default"
 *   required
 * />
 */
export const Textarea: FC<TextareaProps> = ({
  className,
  size,
  state = "default",
  name,
  ...props
}) => {
  const baseClasses = cn(textareaVariants({ size, state }), className);

  const errorClasses = cn(
    textareaVariants({ size, state: "error" }),
    className,
  );

  return (
    <textarea
      {...props}
      name={name}
      className={baseClasses}
      x-bind:class={`errors && errors['${name}'] ? '${errorClasses}' : '${baseClasses}'`}
    />
  );
};
