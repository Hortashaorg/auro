import { Text } from "@comp/typography/index.ts";
import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

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
        "dark:bg-surface-dark-alt",
        "bg-surface-alt",
        "dark:hover:bg-surface-dark-alt/50",
        "hover:bg-surface-alt/50",
      ],
    },
  },
  defaultVariants: {
    variant: "navLink",
  },
});

type LinkVariants = NonNullableProps<typeof linkVariants, "variant">;

type Props = LinkVariants & BaseComponentProps & {
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
      <Text variant="body">
        {children}
      </Text>
    </a>
  );
};
