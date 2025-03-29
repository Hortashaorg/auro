import { cn } from "@comp/utils/tailwind.ts";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

const linkStyles = cva([
  "font-body",
  "transition-colors",
], {
  variants: {
    variant: {
      normal: [
        "text-on-surface",
        "dark:text-on-surface-dark",
        "hover:text-on-surface-strong",
        "dark:hover:text-on-surface-dark-strong",
      ],
      strong: [
        "text-sm",
        "text-on-surface",
        "dark:text-on-surface-dark",
        "hover:text-on-surface-strong",
        "dark:hover:text-on-surface-dark-strong",
      ],
    },
    background: {
      none: "",
      alt: "bg-surface-alt dark:bg-surface-dark-alt",
    },
    size: {
      sm: "text-sm",
      md: "text-base px-4 py-3",
    },
    display: {
      inline: "inline-block",
      block: "block",
    },
    activeStyle: {
      background:
        "data-[active=true]:bg-surface data-[active=true]:dark:bg-surface-dark",
      none: "",
    },
  },
  defaultVariants: {
    variant: "normal",
    size: "sm",
    display: "inline",
    activeStyle: "none",
    background: "none",
  },
});

type LinkStyleProps = VariantProps<typeof linkStyles>;

type Props =
  & BaseComponentProps
  & LinkStyleProps
  & {
    active?: boolean;
    href: string;
  };

/**
 * Link component for navigation and actions with compositional styling.
 *
 * Use props to combine visual style, size, layout, background, and active state appearance.
 *
 * @props
 * - variant: Core visual style ('normal', 'strong'). Defaults to 'normal'.
 * - background: Optional background style ('none', 'alt'). Defaults to 'none'.
 * - size: Controls text size and padding ('sm', 'md'). Defaults to 'sm'.
 * - display: CSS display property ('inline', 'block'). Defaults to 'inline'.
 * - activeStyle: How the link appears when active ('background', 'none'). Defaults to 'none'.
 * - active: Boolean indicating if the link is active (triggers activeStyle via `data-active=true`).
 * - href: The URL the link points to. Required.
 * - children: The content of the link.
 * - className: Optional additional CSS classes.
 * - ...rest: Standard HTML anchor attributes passed to the `<a>` tag.
 *
 * @example // Default small link
 * <Link href="/home">Home</Link>
 *
 * @example // Medium size link for main nav with background active state
 * <Link href="/servers" size="md" activeStyle="background" active={isActive}>Servers</Link>
 *
 * @example // Block link with alt background (e.g., for dropdown)
 * <Link href="/profile" display="block" background="alt" size="md">Profile</Link>
 *
 * @example // Strong variant link (e.g., breadcrumb style link)
 * <Link href="/category" variant="strong">Category</Link>
 */
export const Link: FC<Props> = (
  {
    className,
    variant,
    size,
    display,
    activeStyle,
    background,
    active,
    children,
    ...rest
  }: Props,
) => {
  return (
    <a
      {...rest}
      data-active={active}
      className={cn(
        linkStyles({ variant, size, display, activeStyle, background }),
        className,
      )}
    >
      {children}
    </a>
  );
};
