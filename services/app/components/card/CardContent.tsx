import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";
import { Text } from "@comp/typography/index.ts";

type Props = JSX.IntrinsicElements["div"] & {
  title?: string;
  label?: string;
};

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
export const CardContent: FC<Props> = (
  { children, className, title, label, ...props }: Props,
) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-6",
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
