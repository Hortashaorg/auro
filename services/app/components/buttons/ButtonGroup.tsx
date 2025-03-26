import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";

const buttonGroupVariants = cva([
  "flex",
  "items-center",
  "justify-end", // Right-aligned by default
  "flex-wrap",
], {
  variants: {
    spacing: {
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    },
    alignment: {
      right: "justify-end",
      left: "justify-start",
      center: "justify-center",
      between: "justify-between",
    },
  },
  defaultVariants: {
    spacing: "md",
    alignment: "right",
  },
});

type ButtonGroupVariants = NonNullableProps<typeof buttonGroupVariants>;

type ButtonGroupProps = JSX.IntrinsicElements["div"] & ButtonGroupVariants;

/**
 * ButtonGroup component for grouping related buttons with consistent spacing
 *
 * Features:
 * - Flexbox container with configurable spacing between buttons
 * - Right-aligned by default (can be changed with alignment prop)
 * - Responsive with flex-wrap for small screens
 * - Maintains consistent spacing between buttons
 *
 * @example
 * <ButtonGroup>
 *   <Button variant="secondary">Cancel</Button>
 *   <Button variant="primary">Save</Button>
 * </ButtonGroup>
 *
 * @example
 * <ButtonGroup spacing="lg" alignment="between">
 *   <Button variant="alternate">Back</Button>
 *   <div>
 *     <Button variant="secondary">Cancel</Button>
 *     <Button variant="primary">Continue</Button>
 *   </div>
 * </ButtonGroup>
 */
export const ButtonGroup: FC<ButtonGroupProps> = ({
  children,
  className,
  spacing,
  alignment,
  ...props
}: ButtonGroupProps) => {
  return (
    <div
      className={cn(buttonGroupVariants({ spacing, alignment }), className)}
      {...props}
    >
      {children}
    </div>
  );
};
