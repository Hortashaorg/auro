import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";

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
type ButtonGroupProps = BaseComponentProps & ButtonGroupVariants;

/**
 * ButtonGroup component for grouping related buttons with consistent spacing
 *
 * @props
 * - spacing: Gap between buttons ('sm', 'md', 'lg')
 * - alignment: Horizontal alignment of buttons ('right', 'left', 'center', 'between')
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
