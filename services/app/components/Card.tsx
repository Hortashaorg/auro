import { cn } from "@utils/tailwind.ts";
import type { NonNullableProps } from "@utils/types.ts";
import { cva } from "class-variance-authority";
import type { JSX } from "preact";

const cardVariants = cva([
  "dark:bg-background-800",
  "bg-background-300",
  "p-3",
  "rounded-sm",
  "border-2",
  "dark:border-background-500",
  "border-background-500",
  "dark:hover:bg-background-700",
], {
  variants: {
    variant: {
      primary: [],
      secondary: [],
    },
  },
});

type CardVariants = NonNullableProps<typeof cardVariants>;
interface Props extends JSX.HTMLAttributes<HTMLDivElement>, CardVariants {}

export const Card = ({ children, variant }: Props) => {
  return <div className={cn(cardVariants({ variant }))}>{children}</div>;
};
