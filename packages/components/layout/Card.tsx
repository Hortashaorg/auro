import { cn } from "@utils/tailwind.ts";
import type { NonNullableProps } from "@utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@hono/hono/jsx";

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
type Props = JSX.IntrinsicElements["div"] & CardVariants;

export const Card: FC<Props> = ({ children, variant }: Props) => {
  return <div className={cn(cardVariants({ variant }))}>{children}</div>;
};
