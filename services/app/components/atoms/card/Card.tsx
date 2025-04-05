import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";

// Default base classes for the Card component
const cardVariants = cva(
  "group flex flex-col h-full overflow-hidden rounded-radius border border-outline bg-surface-alt text-on-surface dark:border-outline-dark dark:bg-surface-dark-alt dark:text-on-surface-dark",
  {
    variants: {
      width: {
        grow: "w-full",
        fit: "w-fit",
      },
      border: {
        default: "border border-outline dark:border-outline-dark",
        none: "border-0",
      },
      padding: {
        none: "",
        md: "p-4",
      },
    },
    defaultVariants: {
      width: "grow",
      border: "default",
      padding: "md",
    },
  },
);

type CardVariants = NonNullableProps<typeof cardVariants>;
type ElementType = "article" | "section" | "div";
type CardProps = BaseComponentProps & CardVariants & {
  as?: ElementType;
};

/**
 * Card component for containing related content with consistent styling
 *
 * @props
 * - width: Controls the width of the card ('grow', 'fit')
 * - shadow: Shadow depth ('none', 'sm', 'md', 'lg')
 * - border: Border style ('default', 'subtle', 'none')
 * - padding: Internal padding ('none', 'sm', 'md', 'lg')
 * - as: HTML element to render the card as ('div', 'article', 'section')
 *
 * @example
 * <Card>
 *   <CardContent title="Card Title">
 *     Card content goes here.
 *   </CardContent>
 * </Card>
 *
 * @example
 * <Card width="fit" shadow="md" as="article">
 *   <CardImage src="/product.jpg" alt="Product" />
 *   <CardContent title="Product Name">
 *     This is a product description.
 *   </CardContent>
 * </Card>
 */
export const Card: FC<CardProps> = ({
  children,
  className,
  width,
  border,
  padding,
  as: Element = "div",
  ...props
}: CardProps) => {
  return (
    <Element
      className={cn(
        cardVariants({ width, border, padding }),
        className,
      )}
      {...props}
    >
      {children}
    </Element>
  );
};
