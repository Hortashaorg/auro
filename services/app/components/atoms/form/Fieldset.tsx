import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva } from "class-variance-authority";

const fieldsetVariants = cva(
  [
    "border-none",
    "p-0",
    "m-0",
  ],
);

type FieldsetProps = BaseComponentProps & {
  disabled?: boolean;
};

/**
 * Fieldset component - Renders an HTML <fieldset> element.
 * Provides semantic grouping for related form controls.
 * Intended to contain a Legend atom and input elements.
 * Uses CVA for base styling resets and future variants.
 *
 * @props Inherits base component props (incl. children) & standard fieldset attributes (via Omit).
 * @props disabled: Standard attribute to disable all contained inputs.
 * @props Includes CVA variant props for styling.
 */
export const Fieldset: FC<FieldsetProps> = ({
  className,
  children,
  disabled,
  ...props
}) => {
  const fieldsetClasses = cn(fieldsetVariants({ className }));

  return (
    <fieldset
      className={fieldsetClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </fieldset>
  );
};
