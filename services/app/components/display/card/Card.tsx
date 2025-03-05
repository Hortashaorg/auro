import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["article"];

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
  { children, className, ...props }: Props,
) => {
  return (
    <article
      className={cn(
        "group flex rounded-radius max-w-sm flex-col overflow-hidden border border-outline bg-surface-alt text-on-surface dark:border-outline-dark dark:bg-surface-dark-alt dark:text-on-surface-dark",
        className,
      )}
      {...props}
    >
      {children}
    </article>
  );
};
