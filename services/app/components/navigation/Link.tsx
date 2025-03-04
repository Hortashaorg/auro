import { Text } from "@comp/content/Text.tsx";
import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const linkVariants = cva("py-3", {
  variants: {
    variant: {
      navLink: [
        "group",
        "relative",
        "px-4",
        "hover:bg-surface",
        "dark:hover:bg-surface-dark",
        "data-[active=true]:bg-surface",
        "data-[active=true]:dark:bg-surface-dark",
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
  defaultVariants: {
    variant: "navLink",
  },
});

type LinkVariants = NonNullableProps<typeof linkVariants, "variant">;

type Props = JSX.IntrinsicElements["a"] & LinkVariants & {
  active?: boolean;
};

/**
 * Link component for navigation with consistent styling
 *
 * Features:
 * - Multiple variants (navLink, dropdownLink)
 * - Active state indicator with left border and subtle background
 * - Subtle hover states
 * - Wraps content in Text component for typography consistency
 * - Group hover effects for child elements
 *
 * @example
 * <Link href="/dashboard" variant="navLink" active={true}>
 *   Dashboard
 * </Link>
 *
 * <Link href="/settings" variant="dropdownLink">
 *   Settings
 * </Link>
 */
export const Link: FC<Props> = (
  { className, variant, active, children, ...rest }: Props,
) => {
  return (
    <a
      {...rest}
      data-active={active}
      className={cn(linkVariants({ variant }), className)}
    >
      <Text
        variant="body"
        className={cn(
          "group-hover:text-text-200",
          active && "font-medium text-accent-300 dark:text-accent-200",
        )}
      >
        {children}
      </Text>
    </a>
  );
};
