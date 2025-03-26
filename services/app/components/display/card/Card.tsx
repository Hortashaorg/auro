import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";

// Default base classes for the Card component
const cardVariants = cva(
  "group flex flex-col overflow-hidden rounded-radius border border-outline bg-surface-alt text-on-surface dark:border-outline-dark dark:bg-surface-dark-alt dark:text-on-surface-dark",
  {
    variants: {
      width: {
        grow: "w-full",
        fit: "w-fit",
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow",
        lg: "shadow-md",
      },
      border: {
        default: "border border-outline dark:border-outline-dark",
        subtle: "border border-outline/30 dark:border-outline-dark/30",
        none: "border-0",
      },
      padding: {
        none: "",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      width: "grow",
      shadow: "none",
      border: "default",
      padding: "none",
    },
  },
);

// Extract type information from the variant definitions
type CardVariants = NonNullableProps<typeof cardVariants>;

// Allow any HTML element that can be used as an article
export type ElementType = "article" | "section" | "div";

// Combined props type with both HTML attributes and our variants
type Props =
  & JSX.IntrinsicElements["div"]
  & CardVariants
  & {
    as?: ElementType;
  };

/**
 * Card component for containing related content with consistent styling
 *
 * Features:
 * - Consistent styling with variants for width, shadow, border, and padding
 * - Customizable HTML element via the 'as' prop for proper semantics
 * - Responsive behavior with width variants (grow or fit)
 * - Dark mode support
 *
 * @example
 * <Card>
 *   <Text variant="h3">Card Title</Text>
 *   <Text variant="body">Card content goes here.</Text>
 * </Card>
 *
 * @example
 * <Card width="fit" shadow="md" as="article">
 *   <Text variant="h3">Product Card</Text>
 *   <Text variant="body">This is a product description.</Text>
 * </Card>
 */
export const Card: FC<Props> = ({
  children,
  className,
  width,
  shadow,
  border,
  padding,
  as: Element = "div",
  ...props
}: Props) => {
  return (
    <Element
      className={cn(
        cardVariants({ width, shadow, border, padding }),
        className,
      )}
      {...props}
    >
      {children}
    </Element>
  );
};
