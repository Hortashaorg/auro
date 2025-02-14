import { cn } from "@utils/tailwind.ts";
import type { NonNullableProps } from "@utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@hono/hono/jsx";

const gridVariants = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
    },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
    },
    align: {
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
  },
  defaultVariants: {
    cols: 1,
    gap: 0,
    align: "start",
    justify: "start",
  },
});

type GridVariants = NonNullableProps<typeof gridVariants>;
type Props = JSX.IntrinsicElements["div"] & GridVariants;

export const Grid: FC<Props> = ({
  className,
  cols,
  gap,
  align,
  justify,
  children,
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        gridVariants({ cols, gap, align, justify }),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
