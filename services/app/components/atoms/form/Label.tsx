import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type LabelProps = BaseComponentProps & {
  htmlFor?: string;
  required?: boolean;
};

/**
 * Label component for form inputs
 *
 * @props
 * - htmlFor: ID of the associated input element
 * - required: Whether the field is required (adds an asterisk)
 *
 * @example
 * <Label htmlFor="email" required>Email Address</Label>
 */
export const Label: FC<LabelProps> = ({
  children,
  className,
  required,
  ...props
}) => {
  return (
    <label
      className={cn(
        "block font-medium text-base text-on-surface-strong dark:text-on-surface-dark-strong mb-1",
        className,
      )}
      {...props}
    >
      {children}
      {required && <span className="text-danger ml-1">*</span>}
    </label>
  );
};
