import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const gridVariants = cva("grid", {
  variants: {
    content: {
      large: "grid-cols-[repeat(auto-fill,minmax(24rem,1fr))]",
      medium: "grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]",
      small: "grid-cols-[repeat(auto-fill,minmax(12rem,1fr))]",
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
