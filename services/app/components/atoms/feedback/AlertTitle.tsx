import { cn } from "@comp/utils/tailwind.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva } from "class-variance-authority";
import type { FC } from "@kalena/framework";
import type { NonNullableProps } from "@comp/utils/types.ts";

const titleVariants = cva([
  "text-base",
  "font-semibold",
], {
  variants: {
    variant: {
      info: ["text-info"],
      warning: ["text-warning"],
      success: ["text-success"],
      danger: ["text-danger"],
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

// Define Props for AlertTitle
type AlertTitleProps =
  & BaseComponentProps
  & NonNullableProps<typeof titleVariants>;

/**
 * Renders the title portion of an Alert with appropriate styling based on variant.
 * Typically used as a child of the Alert component.
 *
 * @props variant - Determines the text color based on the alert type.
 * @props as - The HTML tag to render (defaults to 'h3').
 * @props children - The content of the title.
 */
export const AlertTitle: FC<AlertTitleProps> = ({
  variant,
  className,
  children,
  ...props
}: AlertTitleProps) => {
  return (
    <h3
      className={cn(titleVariants({ variant }), className)}
      {...props}
    >
      {children}
    </h3>
  );
};
