import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

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

/**
 * Card component for containing related content with consistent styling
 *
 * Features:
 * - Consistent padding and border radius
 * - Border styling for visual separation
 * - Dark mode support
 * - Hover state styling
 * - Primary and secondary variants
 *
 * @example
 * <Card variant="primary">
 *   <Text variant="h3">Card Title</Text>
 *   <Text variant="body">Card content goes here.</Text>
 * </Card>
 */
export const Card: FC<Props> = (
  { children, variant, className, ...props }: Props,
) => {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
};
