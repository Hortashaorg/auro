import { cn } from "@comp/utils/tailwind.ts";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

const linkVariants = cva([
  "font-body",
  "transition-colors",
], {
  variants: {
    variant: {
      menuItem: ["block"],
      none: [],
    },
    text: {
      normal: [
        "text-on-surface",
        "dark:text-on-surface-dark",
      ],
      strong: [
        "text-sm",
        "text-on-surface-strong",
        "dark:text-on-surface-dark-strong",
      ],
    },
    textHover: {
      none: [],
      strong: [
        "hover:text-on-surface-strong dark:hover:text-on-surface-dark-strong",
      ],
    },
    background: {
      none: "",
      surfaceAlt: "bg-surface-alt dark:bg-surface-dark-alt",
      surface: "bg-surface dark:bg-surface-dark",
    },
    backgroundHover: {
      none: "",
      surfaceAlt: "hover:bg-surface-alt dark:hover:bg-surface-dark-alt",
      surface: "hover:bg-surface dark:hover:bg-surface-dark",
    },
    size: {
      sm: "text-sm",
      md: "text-base px-4 py-3",
    },
    activeStyle: {
      surface:
        "data-[active=true]:bg-surface data-[active=true]:dark:bg-surface-dark",
      surfaceAlt:
        "data-[active=true]:bg-surface-alt data-[active=true]:dark:bg-surface-dark-alt",
      none: "",
    },
  },
  defaultVariants: {
    variant: "none",
    text: "normal",
    textHover: "none",
    background: "none",
    backgroundHover: "none",
    size: "sm",
    activeStyle: "none",
  },
});

type LinkVariants = VariantProps<typeof linkVariants>;

type Props =
  & BaseComponentProps
  & LinkVariants
  & {
    active?: boolean;
    external?: boolean;
    href: string;
  };

/**
 * Link component for navigation and actions with compositional styling.
 *
 * Use props to combine visual style, size, layout, background, and active state appearance.
 *
 * @props
 * - variant: Layout style ('menuItem', 'none'). Defaults to 'none'.
 * - text: Text color variant ('normal', 'strong'). Defaults to 'normal'.
 * - textHover: Hover text color effect ('none', 'strong'). Defaults to 'none'.
 * - background: Background color variant ('none', 'surfaceAlt', 'surface'). Defaults to 'none'.
 * - backgroundHover: Hover background effect ('none', 'surfaceAlt', 'surface'). Defaults to 'none'.
 * - size: Size variant ('sm', 'md'). Defaults to 'sm'.
 * - activeStyle: Active state styling ('none', 'surface', 'surfaceAlt'). Defaults to 'none'.
 * - active: Boolean indicating if the link is active (triggers activeStyle via `data-active=true`).
 * - href: The URL the link points to. Required.
 * - children: The content of the link.
 * - className: Optional additional CSS classes.
 * - ...rest: Standard HTML anchor attributes passed to the `<a>` tag.
 *
 * @example // Default small link
 * <Link href="/home">Home</Link>
 *
 * @example // Medium size link for main nav with surface background active state
 * <Link href="/servers" size="md" activeStyle="surface" active={isActive}>Servers</Link>
 *
 * @example // Menu item link with surfaceAlt background
 * <Link href="/profile" variant="menuItem" background="surfaceAlt" size="md">Profile</Link>
 *
 * @example // Strong text link with hover effect
 * <Link href="/category" text="strong" textHover="strong">Category</Link>
 */
export const Link: FC<Props> = (
  {
    className,
    variant,
    size,
    backgroundHover,
    textHover,
    text,
    activeStyle,
    background,
    active,
    children,
    external,
    ...rest
  }: Props,
) => {
  if (!external) {
    rest["x-on:click"] = `viewTransition($event, async () => {
      const href = '${rest.href}';
      const res = await fetch(href);
      const html = await res.text();
      const dom = new DOMParser().parseFromString(html, 'text/html');
      const newContent = dom.querySelector('#main');
      const newTitle = dom.querySelector('title')?.innerText;
    
      // Replace the main content
      document.querySelector('#main')?.replaceWith(newContent);
    
      // Set the document title
      if (newTitle) document.title = newTitle;
    
      // Push to browser history
      window.history.pushState({ href }, newTitle || '', href);
      htmx.process(document.body);
    })`;
  }
  return (
    <a
      {...rest}
      data-active={active}
      className={cn(
        linkVariants({
          variant,
          size,
          backgroundHover,
          textHover,
          text,
          activeStyle,
          background,
        }),
        className,
      )}
    >
      {children}
    </a>
  );
};
