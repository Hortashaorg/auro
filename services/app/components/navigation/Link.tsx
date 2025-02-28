import { Text } from "@comp/content/Text.tsx";
import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const linkVariants = cva(["py-3"], {
  variants: {
    variant: {
      navLink: [
        "group",
        "dark:hover:bg-background-600",
        "hover:bg-background-200",
        "active:bg-background-300",
      ],
      dropdownLink: [
        "block",
        "px-5",
        "text-center",
        "dark:hover:bg-background-600",
        "hover:bg-background-200",
      ],
    },
  },
});

type LinkVariants = NonNullableProps<typeof linkVariants, "variant">;

type Props = JSX.IntrinsicElements["a"] & LinkVariants;

/**
 * Link component for navigation with consistent styling
 *
 * Features:
 * - Multiple variants (navLink, dropdownLink)
 * - Consistent padding and hover states
 * - Wraps content in Text component for typography consistency
 * - Group hover effects for child elements
 *
 * @example
 * <Link href="/dashboard" variant="navLink">
 *   Dashboard
 * </Link>
 *
 * <Link href="/settings" variant="dropdownLink">
 *   Settings
 * </Link>
 */
export const Link: FC<Props> = (
  { className, variant, children, ...rest }: Props,
) => {
  return (
    <a
      {...rest}
      className={cn(linkVariants({ variant }), className)}
    >
      <Text variant="body" className="group-hover:text-text-400">
        {children}
      </Text>
    </a>
  );
};
