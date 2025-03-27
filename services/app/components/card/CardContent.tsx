import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import { Text } from "@comp/typography/Text.tsx";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";

const cardContentVariants = cva([
  "flex",
  "flex-col",
], {
  variants: {
    spacing: {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    },
    padding: {
      none: "",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    spacing: "md",
    padding: "lg",
  },
});

type CardContentVariants = NonNullableProps<typeof cardContentVariants>;

/**
 * CardContent component for providing structured content within Cards
 *
 * @props
 * - title: Optional title text to display at the top
 * - label: Optional label text to display above the title
 * - spacing: Gap between elements ('none', 'sm', 'md', 'lg')
 * - padding: Internal padding ('none', 'sm', 'md', 'lg')
 *
 * @example
 * <CardContent title="Card Title" label="Featured">
 *   <p>This is the main content of the card.</p>
 * </CardContent>
 */
type CardContentProps = BaseComponentProps & CardContentVariants & {
  title?: string;
  label?: string;
};

export const CardContent: FC<CardContentProps> = ({
  children,
  className,
  title,
  label,
  spacing,
  padding,
  ...props
}: CardContentProps) => {
  return (
    <div
      className={cn(
        cardContentVariants({ spacing, padding }),
        className,
      )}
      {...props}
    >
      {label && <Text variant="span">{label}</Text>}
      {title && <Text variant="h3">{title}</Text>}
      {children}
    </div>
  );
};
