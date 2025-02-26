import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["section"];

/**
 * Section component for grouping related content
 *
 * Features:
 * - Full width by default
 * - Consistent spacing between child elements
 * - Uses semantic HTML section element
 *
 * @example
 * <Section>
 *   <Text variant="h2">Section Title</Text>
 *   <Text variant="body">Section content goes here.</Text>
 *   <Button>Action</Button>
 * </Section>
 */
export const Section: FC<Props> = ({
  className,
  children,
  ...props
}) => {
  return (
    <section className={cn("w-full space-y-4", className)} {...props}>
      {children}
    </section>
  );
};
