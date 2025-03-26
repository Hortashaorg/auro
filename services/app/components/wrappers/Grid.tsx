import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const gridVariants = cva("grid", {
  variants: {
    content: {
      large: "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      medium: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      small: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    },
    gap: {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    },
    items: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-items-start",
      center: "justify-items-center",
      end: "justify-items-end",
      stretch: "justify-items-stretch",
    },
  },
  defaultVariants: {
    content: "medium",
    gap: "md",
    items: "start",
    justify: "stretch",
  },
});

type GridVariants = NonNullableProps<typeof gridVariants>;
type Props = JSX.IntrinsicElements["div"] & GridVariants;

/**
 * Grid component for creating responsive grid layouts
 *
 * Features:
 * - Predefined content sizes (small, medium, large)
 * - Configurable gap spacing
 * - Control over item alignment and justification
 * - Responsive by default with auto-fill behavior
 *
 * @example
 * <Grid
 *   content="medium"
 *   gap="md"
 *   items="center"
 * >
 *   <div>Grid item 1</div>
 *   <div>Grid item 2</div>
 *   <div>Grid item 3</div>
 * </Grid>
 */
export const Grid: FC<Props> = ({
  className,
  content,
  gap,
  children,
  items,
  justify,
  ...props
}) => {
  return (
    <div
      className={cn(
        gridVariants({ content, gap, items, justify }),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
