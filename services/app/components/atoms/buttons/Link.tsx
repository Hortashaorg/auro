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
      default: [
        "text-on-surface",
        "dark:text-on-surface-dark",
        "hover:text-on-surface-strong",
        "dark:hover:text-on-surface-dark-strong",
      ],
      primary: [
        "text-primary",
        "dark:text-primary-dark",
        "hover:underline",
      ],
      subtle: [
        "text-on-surface",
        "dark:text-on-surface-dark",
        "hover:text-on-surface",
        "dark:hover:text-on-surface-dark",
      ],
      breadcrumb: [
        "text-sm",
        "text-on-surface",
        "dark:text-on-surface-dark",
        "hover:text-on-surface-strong",
        "dark:hover:text-on-surface-dark-strong",
      ],
    },
    padding: {
      none: "p-0",
      sm: "px-2 py-1",
      md: "px-4 py-3",
    },
    display: {
      inline: "inline-block",
      block: "block",
    },
    activeStyle: {
      background:
        "data-[active=true]:bg-surface data-[active=true]:dark:bg-surface-dark",
      underline: "data-[active=true]:underline",
      strong:
        "data-[active=true]:text-on-surface-strong data-[active=true]:dark:text-on-surface-dark-strong data-[active=true]:font-semibold",
      primaryStrong:
        "data-[active=true]:text-primary data-[active=true]:dark:text-primary-dark data-[active=true]:font-semibold",
      none: "",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "none",
    display: "inline",
    activeStyle: "none",
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
 * Link component for navigation and actions with compositional styling
 *
 * Use props to combine visual style, padding, display, and active state appearance.
 *
 * @props
 * - variant: Core visual style ('default', 'primary', 'subtle', 'breadcrumb'). Defaults to 'default'.
 * - padding: Internal padding ('none', 'sm', 'md'). Defaults to 'none'.
 * - display: CSS display property ('inline', 'block'). Defaults to 'inline'.
 * - activeStyle: How the link appears when active ('background', 'underline', 'strong', 'primaryStrong', 'none'). Defaults to 'none'.
 * - active: Boolean indicating if the link is active (triggers activeStyle).
 * - href: The URL the link points to.
 * - children: The content of the link.
 * - ...rest: Standard HTML anchor attributes passed to the `<a>` tag.
 *
 * @example // Default link
 * <Link href="/home">Home</Link>
 *
 * @example // Primary link with medium padding, block display, and background active state
 * <Link href="/action" variant="primary" padding="md" display="block" activeStyle="background" active={isActive}>Do Action</Link>
 *
 * @example // Subtle block link for dropdowns
 * <Link href="/profile" variant="subtle" display="block" padding="sm">Profile</Link>
 *
 * @example // Breadcrumb link (inherits small text and specific hover from variant)
 * <Link href="/category" variant="breadcrumb">Category</Link>
 */
export const Link: FC<Props> = (
  {
    className,
    variant,
    padding,
    display,
    activeStyle,
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
        linkStyles({ variant, padding, display, activeStyle }),
        className,
      )}
    >
      {children}
    </a>
  );
};
