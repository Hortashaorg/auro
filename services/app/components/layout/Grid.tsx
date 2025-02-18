import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const gridVariants = cva("grid", {
  variants: {
    variant: {
      default: "flex flex-wrap gap-4 items-start justify-start custom-flex",
      fit: "grid-cols-3 grid-flow-row-dense gap-4",
    },
    gap: {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    },
  },
  defaultVariants: {
    variant: "default",
    gap: "md",
  },
});

type GridVariants = NonNullableProps<typeof gridVariants>;
type Props = JSX.IntrinsicElements["div"] & GridVariants;

export const Grid: FC<Props> = ({
  className,
  variant,
  gap,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(gridVariants({ variant, gap }), className)}
      {...props}
    >
      {children}
    </div>
  );
};
