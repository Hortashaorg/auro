import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva } from "class-variance-authority";

const legendVariants = cva(
  [
    "block",
    "text-base",
    "font-medium",
    "text-on-surface-strong",
    "dark:text-on-surface-dark-strong",
    "mb-2",
  ],
);

type LegendProps = BaseComponentProps;

/**
 * Legend component - Renders an HTML <legend> element.
 * Intended to be used as the label within a Fieldset atom.
 * Uses CVA for styling consistency.
 *
 * @props Inherits base component props (including children and standard attributes).
 */
export const Legend: FC<LegendProps> = ({
  className,
  children,
  ...props
}) => {
  const legendClasses = cn(legendVariants({ className }));

  return (
    <legend
      className={legendClasses}
      {...props}
    >
      {children}
    </legend>
  );
};
