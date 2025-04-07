import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

const flexVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row items-center",
      col: "flex-col",
      "row-reverse": "flex-row-reverse",
      "col-reverse": "flex-col-reverse",
    },
    items: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    gap: {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
      "2xl": "gap-12",
    },
    wrap: {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
      "wrap-reverse": "flex-wrap-reverse",
    },
  },
  defaultVariants: {
    direction: "row",
    items: "start",
    justify: "start",
    gap: "sm",
    wrap: "nowrap",
  },
});

type FlexVariants = NonNullableProps<typeof flexVariants>;
type Props = BaseComponentProps & FlexVariants;

/**
 * Flex component for creating flexible layouts with consistent styling
 *
 * Features:
 * - Configurable flex direction (row, column, reverse)
 * - Alignment control for items and justification
 * - Predefined gap spacing options
 * - Flex wrapping behavior
 *
 * @example
 * <Flex
 *   direction="col"
 *   items="center"
 *   justify="between"
 *   gap="md"
 * >
 *   <div>First item</div>
 *   <div>Second item</div>
 * </Flex>
 */
export const Flex: FC<Props> = ({
  className,
  direction,
  items,
  justify,
  gap,
  wrap,
  children,
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        flexVariants({ direction, items, justify, gap, wrap }),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
